use std::thread;
use std::time::Duration;

use tauri::{AppHandle, Emitter, Result};

use crate::utils::sysinfo;

mod utils;

#[tauri::command]
fn init_cpu_usage(app: AppHandle) -> Result<()> {
    loop {
        app.emit("cpu_usage", sysinfo::get_cpu_usage())?;
        thread::sleep(Duration::from_secs(1));
    }
}

#[tauri::command]
fn init_memory(app: AppHandle) -> Result<()> {
    loop {
        app.emit("memory", sysinfo::get_memory())?;
        thread::sleep(Duration::from_secs(1));
    }
}

#[tauri::command]
fn init_sys_info(app: AppHandle) -> Result<()> {
    loop {
        app.emit("sysinfo", sysinfo::get_sys_info())?;
        thread::sleep(Duration::from_secs(1));
    }
}

#[tauri::command]
fn init_processes(app: AppHandle) -> Result<()> {
    loop {
        app.emit("processes", sysinfo::get_processes())?;
        thread::sleep(Duration::from_secs(1));
    }
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
