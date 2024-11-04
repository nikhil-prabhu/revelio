use std::sync::Once;
use std::thread;
use std::time::Duration;

use tauri::{AppHandle, Emitter, Result};

use crate::utils::sysinfo;

mod utils;

static CPU_USAGE: Once = Once::new();
static MEMORY: Once = Once::new();
static SYS_INFO: Once = Once::new();
static PROCESSES: Once = Once::new();

#[tauri::command(async)]
fn init_cpu_usage(app: AppHandle) -> Result<()> {
    CPU_USAGE.call_once(|| loop {
        app.emit("cpu_usage", sysinfo::get_cpu_usage()).unwrap();
        thread::sleep(Duration::from_secs(1));
    });

    Ok(())
}

#[tauri::command(async)]
fn init_memory(app: AppHandle) -> Result<()> {
    MEMORY.call_once(|| loop {
        app.emit("memory", sysinfo::get_memory()).unwrap();
        thread::sleep(Duration::from_secs(1));
    });

    Ok(())
}

#[tauri::command(async)]
fn init_sys_info(app: AppHandle) -> Result<()> {
    SYS_INFO.call_once(|| loop {
        app.emit("sys_info", sysinfo::get_sys_info()).unwrap();
        thread::sleep(Duration::from_secs(1));
    });

    Ok(())
}

#[tauri::command(async)]
fn init_processes(app: AppHandle) -> Result<()> {
    PROCESSES.call_once(|| loop {
        app.emit("processes", sysinfo::get_processes()).unwrap();
        thread::sleep(Duration::from_secs(1));
    });

    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            init_cpu_usage,
            init_memory,
            init_sys_info,
            init_processes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
