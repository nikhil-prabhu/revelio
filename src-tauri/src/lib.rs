use crate::types::PeekError;
use crate::utils::cpu::CpuInfo;
use crate::utils::disks::DisksInfo;
use crate::utils::gpus::GpusInfo;

#[cfg(target_os = "linux")]
use crate::utils::linux::vulkan::VulkanInfo;

mod types;
mod utils;

#[tauri::command]
fn get_cpu_info() -> CpuInfo {
    CpuInfo::get()
}

#[tauri::command]
fn get_disks_info() -> DisksInfo {
    DisksInfo::get()
}

#[tauri::command]
fn get_gpus_info() -> GpusInfo {
    GpusInfo::get()
}

#[cfg(target_os = "linux")]
#[tauri::command]
fn get_vulkan_info() -> Result<VulkanInfo, PeekError> {
    VulkanInfo::get()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default().plugin(tauri_plugin_shell::init());

    #[cfg(target_os = "windows")]
    builder
        .invoke_handler(tauri::generate_handler![
            get_cpu_info,
            get_disks_info,
            get_gpus_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    #[cfg(target_os = "macos")]
    builder
        .invoke_handler(tauri::generate_handler![
            get_cpu_info,
            get_disks_info,
            get_gpus_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    #[cfg(target_os = "linux")]
    builder
        .invoke_handler(tauri::generate_handler![
            get_cpu_info,
            get_disks_info,
            get_gpus_info,
            get_vulkan_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
