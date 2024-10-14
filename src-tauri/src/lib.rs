use std::sync::Mutex;

use tauri::{Builder, Manager, State};

use crate::types::PeekError;
use crate::utils::cpu::CpuInfo;
use crate::utils::disks::DisksInfo;
use crate::utils::gpu::vulkan::VulkanInfo;
use crate::utils::network::NetworksInfo;

mod types;
mod utils;

#[derive(Default)]
struct AppStateInner {
    cpu_info: Option<CpuInfo>,
    vulkan_info: Option<VulkanInfo>,
    disks_info: Option<DisksInfo>,
    networks_info: Option<NetworksInfo>,
}

type AppState = Mutex<AppStateInner>;

#[tauri::command]
fn get_cpu_info(state: State<'_, AppState>) -> CpuInfo {
    let mut state = state.lock().unwrap();

    if let Some(info) = &state.cpu_info {
        return info.clone();
    }

    let info = CpuInfo::get();
    state.cpu_info = Some(info.clone());

    info
}

#[tauri::command]
fn get_disks_info(state: State<'_, AppState>) -> DisksInfo {
    let mut state = state.lock().unwrap();

    if let Some(info) = &state.disks_info {
        return info.clone();
    }

    let info = DisksInfo::get();
    state.disks_info = Some(info.clone());

    info
}

#[tauri::command]
fn get_vulkan_info(state: State<'_, AppState>) -> Result<VulkanInfo, PeekError> {
    let mut state = state.lock().unwrap();

    if let Some(info) = &state.vulkan_info {
        return Ok(info.clone());
    }

    let info = VulkanInfo::get()?;
    state.vulkan_info = Some(info.clone());

    Ok(info)
}

#[tauri::command]
fn get_networks_info(state: State<'_, AppState>) -> NetworksInfo {
    let mut state = state.lock().unwrap();

    if let Some(info) = &state.networks_info {
        return info.clone();
    }

    let info = NetworksInfo::get();
    state.networks_info = Some(info.clone());

    info
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .setup(|app| {
            app.manage(AppState::default());
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_cpu_info,
            get_disks_info,
            get_vulkan_info,
            get_networks_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
