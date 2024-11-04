use std::sync::{LazyLock, Once, RwLock};
use std::thread;
use std::time::Duration;

use serde::Serialize;
use sysinfo::{System, Users};

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CpuUsage {
    index: usize,
    usage: f32,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Memory {
    total_memory: u64,
    free_memory: u64,
    available_memory: u64,
    used_memory: u64,
    total_swap: u64,
    free_swap: u64,
    used_swap: u64,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SysInfo {
    uptime: u64,
    boot_time: u64,
    load_avg: Option<(f64, f64, f64)>,
}

#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Process {
    name: String,
    pid: u32,
    parent: Option<u32>,
    user: String,
    cpu_usage: f32,
    memory: u64,
}

static INIT: Once = Once::new();
static SYSTEM: LazyLock<RwLock<System>> = LazyLock::new(|| RwLock::new(System::new_all()));

fn init_system_refresher() {
    INIT.call_once(|| {
        thread::spawn(|| loop {
            {
                let mut val = SYSTEM.write().unwrap();
                val.refresh_all();
            }
            thread::sleep(Duration::from_millis(200));
        });
    });
}

pub fn get_cpu_usage() -> Vec<CpuUsage> {
    init_system_refresher();

    let system = SYSTEM.read().unwrap();
    let cpus = system.cpus();
    let mut cpus_usage = Vec::with_capacity(cpus.len());

    for (index, cpu) in cpus.iter().enumerate() {
        cpus_usage.push(CpuUsage {
            index,
            usage: cpu.cpu_usage(),
        })
    }

    cpus_usage
}

pub fn get_memory() -> Memory {
    init_system_refresher();

    let system = SYSTEM.read().unwrap();

    Memory {
        total_memory: system.total_memory(),
        free_memory: system.free_memory(),
        available_memory: system.available_memory(),
        used_memory: system.used_memory(),
        total_swap: system.total_swap(),
        free_swap: system.free_swap(),
        used_swap: system.used_swap(),
    }
}

pub fn get_sys_info() -> SysInfo {
    init_system_refresher();

    let load = System::load_average();
    #[allow(unused_assignments)]
    let mut load_avg = None;

    #[cfg(not(target_os = "windows"))]
    {
        load_avg = Some((load.one, load.five, load.fifteen));
    }

    SysInfo {
        uptime: System::uptime(),
        boot_time: System::boot_time(),
        load_avg,
    }
}

pub fn get_processes() -> Vec<Process> {
    init_system_refresher();

    let system = SYSTEM.read().unwrap();
    let procs = system.processes();
    let mut processes = Vec::with_capacity(procs.len());
    let users = Users::new_with_refreshed_list();

    for (pid, proc) in procs {
        let mut user = String::new();
        if let Some(user_id) = proc.user_id() {
            if let Some(u) = users.get_user_by_id(user_id) {
                user = format!("{} ({})", u.name(), u.id().to_string());
            }
        }

        processes.push(Process {
            name: proc.name().to_string_lossy().to_string(),
            pid: pid.as_u32(),
            parent: proc.parent().map(|p| p.as_u32()),
            user,
            cpu_usage: 0.0,
            memory: 0,
        });
    }

    processes
}
