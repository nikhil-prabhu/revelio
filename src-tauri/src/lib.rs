use std::sync::Mutex;

use tauri::{Builder, Manager, State};
use tauri_plugin_log::{Target, TargetKind};

use crate::types::CoreError;
use crate::utils::cpu::CpuInfo;
use crate::utils::disks::DisksInfo;
use crate::utils::displays::DisplaysInfo;
use crate::utils::gpu::opengl::OpenGLInfo;
use crate::utils::network::NetworksInfo;
use crate::utils::platform::PlatformInfo;

#[cfg(target_os = "macos")]
use crate::utils::gpu::metal::MetalInfo;
#[cfg(not(all(target_os = "macos", target_arch = "aarch64")))]
use crate::utils::gpu::vulkan::VulkanInfo;

mod types;
mod utils;

#[derive(Default)]
struct AppStateInner {
    cpu_info: Option<CpuInfo>,
    opengl_info: Option<OpenGLInfo>,
    displays_info: Option<DisplaysInfo>,
    disks_info: Option<DisksInfo>,
    networks_info: Option<NetworksInfo>,
    platform_info: Option<PlatformInfo>,

    #[cfg(not(all(target_os = "macos", target_arch = "aarch64")))]
    vulkan_info: Option<VulkanInfo>,
    #[cfg(target_os = "macos")]
    metal_info: Option<MetalInfo>,
}

type AppState = Mutex<AppStateInner>;

#[tauri::command]
fn is_release_profile() -> bool {
    !cfg!(debug_assertions)
}

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
fn get_os_type() -> &'static str {
    #[cfg(target_os = "windows")]
    return "Windows";

    #[cfg(all(target_os = "macos", target_arch = "x86_64"))]
    return "MacIntel";

    #[cfg(all(target_os = "macos", target_arch = "aarch64"))]
    return "MacSilicon";

    #[cfg(target_os = "linux")]
    #[allow(clippy::needless_return)]
    return "Linux";
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

#[cfg(not(all(target_os = "macos", target_arch = "aarch64")))]
#[tauri::command]
fn get_vulkan_info(state: State<'_, AppState>) -> Result<VulkanInfo, CoreError> {
    let mut state = state.lock().unwrap();

    if let Some(info) = &state.vulkan_info {
        return Ok(info.clone());
    }

    let info = VulkanInfo::get()?;
    state.vulkan_info = Some(info.clone());

    Ok(info)
}

#[tauri::command]
fn get_opengl_info(state: State<'_, AppState>) -> Result<OpenGLInfo, CoreError> {
    let mut state = state.lock().unwrap();

    if let Some(info) = &state.opengl_info {
        return Ok(info.clone());
    }

    let info = OpenGLInfo::get()?;
    state.opengl_info = Some(info.clone());

    Ok(info)
}

#[tauri::command]
fn get_displays_info(state: State<'_, AppState>) -> Result<DisplaysInfo, CoreError> {
    let mut state = state.lock().unwrap();

    if let Some(info) = &state.displays_info {
        return Ok(info.clone());
    }

    let info = DisplaysInfo::get()?;
    state.displays_info = Some(info.clone());

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

#[tauri::command]
fn get_platform_info(state: State<'_, AppState>) -> Result<PlatformInfo, CoreError> {
    let mut state = state.lock().unwrap();

    if let Some(info) = &state.platform_info {
        return Ok(info.clone());
    }

    let info = PlatformInfo::get()?;
    state.platform_info = Some(info.clone());

    Ok(info)
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").into()
}

#[cfg(target_os = "macos")]
#[tauri::command]
fn get_metal_info(state: State<'_, AppState>) -> Result<MetalInfo, CoreError> {
    let mut state = state.lock().unwrap();

    if let Some(info) = &state.metal_info {
        return Ok(info.clone());
    }

    let info = MetalInfo::get()?;
    state.metal_info = Some(info.clone());

    Ok(info)
}

pub fn run() {
    let mut level = log::LevelFilter::Trace;
    if !cfg!(debug_assertions) {
        level = log::LevelFilter::Warn;
    }

    let mut builder = Builder::default();
    builder = builder.invoke_handler(tauri::generate_handler![]);

    // Apple Silicon devices.
    #[cfg(all(target_os = "macos", target_arch = "aarch64"))]
    {
        builder = builder.invoke_handler(tauri::generate_handler![
            is_release_profile,
            get_os_type,
            get_cpu_info,
            get_disks_info,
            get_displays_info,
            get_networks_info,
            get_platform_info,
            get_app_version,
            get_metal_info
        ]);
    }

    // x86 Apple devices.
    #[cfg(all(target_os = "macos", target_arch = "x86_64"))]
    {
        builder = builder.invoke_handler(tauri::generate_handler![
            is_release_profile,
            get_os_type,
            get_cpu_info,
            get_disks_info,
            get_displays_info,
            get_networks_info,
            get_platform_info,
            get_app_version,
            get_vulkan_info,
            get_opengl_info,
            get_metal_info,
        ]);
    }

    // Every other supported device.
    #[cfg(not(all(target_os = "macos", target_arch = "aarch64")))]
    {
        builder = builder.invoke_handler(tauri::generate_handler![
            is_release_profile,
            get_os_type,
            get_cpu_info,
            get_disks_info,
            get_displays_info,
            get_networks_info,
            get_platform_info,
            get_app_version,
            get_vulkan_info,
            get_opengl_info
        ]);
    }

    builder
        .setup(|app| {
            app.manage(AppState::default());
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(Target::new(TargetKind::Stderr))
                .level(level)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
