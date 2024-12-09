#[cfg(target_os = "linux")]
use os_release::OsRelease;
use serde::Serialize;
#[cfg(any(target_os = "macos", target_os = "linux"))]
use std::env;
#[cfg(target_os = "macos")]
use std::process::Command;
use sysinfo::System;

use crate::types::CoreError;

/// Represents the current platform.
#[derive(Serialize, Clone)]
pub enum Platform {
    #[serde(rename = "Windows")]
    Windows,
    #[serde(rename = "macOS")]
    MacOS,
    #[serde(rename = "Linux")]
    Linux,
    #[serde(rename = "Unknown")]
    Unknown,
}

#[cfg(target_os = "macos")]
#[derive(Serialize, Clone)]
pub enum ChipType {
    #[cfg(target_arch = "x86_64")]
    #[serde(rename = "x86_64")]
    Intel,
    #[cfg(target_arch = "aarch64")]
    #[serde(rename = "Apple Silicon")]
    AppleSilicon,
}

/// Represents the current Linux graphics platform (X11/Wayland).
#[cfg(target_os = "linux")]
#[derive(Serialize, Clone)]
pub enum GraphicsPlatform {
    #[serde(rename = "X11")]
    X11,
    #[serde(rename = "Wayland")]
    Wayland,
    #[serde(rename = "Unknown")]
    Unknown,
}

#[cfg(target_os = "windows")]
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WindowsInfo {}

/// Contains information about the current macOS installation.
#[cfg(target_os = "macos")]
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MacOSInfo {
    /// The macOS version.
    #[serde(rename = "macOSVersion")]
    macos_version: String,
    /// The macOS chip type.
    chip_type: ChipType,
    /// The current user's shell.
    shell: String,
}

/// Contains information about the current Linux distribution.
#[cfg(target_os = "linux")]
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LinuxInfo {
    /// An identifier that describes the distribution's release.
    id: String,
    /// Identifier of the original upstream OS that this distribution is derived from.
    id_like: String,
    /// The name of this release, without the version string.
    name: String,
    /// The name of this release, with the version string.
    pretty_name: String,
    /// The version of this OS release.
    version: String,
    /// The version of this OS release, along with additional details about the release.
    version_id: String,
    ///  The codename of this version.
    version_codename: String,
    /// The current graphics platform (X11/Wayland).
    graphics_platform: GraphicsPlatform,
    /// The current Desktop environment.
    desktop: String,
    /// The current user's shell.
    shell: String,
    /// The bug report URL.
    bug_report_url: String,
    /// The support URL.
    support_url: String,
    /// The home URL.
    home_url: String,
    /// The privacy policy URL.
    privacy_policy_url: String,
    /// The documentation URL.
    documentation_url: String,
}

/// Contains information of the current platform.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PlatformInfo {
    /// The current platform (Windows/macOS/Linux).
    platform: Platform,
    /// The hostname of the system.
    hostname: String,
    /// The OS' architecture.
    os_arch: String,
    /// The current kernel version.
    kernel: String,

    #[cfg(target_os = "windows")]
    #[serde(flatten)]
    windows_info: WindowsInfo,

    #[cfg(target_os = "macos")]
    #[serde(flatten)]
    macos_info: MacOSInfo,

    /// Information about the current Linux distribution.
    #[cfg(target_os = "linux")]
    #[serde(flatten)]
    linux_info: LinuxInfo,
}

#[cfg(target_os = "windows")]
impl WindowsInfo {
    /// Retrieves the Windows OS information.
    pub fn get() -> Result<Self, CoreError> {
        Ok(Self {})
    }
}

#[cfg(target_os = "macos")]
impl MacOSInfo {
    /// Retrieves the macOS OS information.
    pub fn get() -> Result<Self, CoreError> {
        let output = Command::new("sw_vers").arg("-productVersion").output().ok();
        let macos_version = match output {
            Some(output) => String::from_utf8_lossy(&output.stdout).trim().to_string(),
            None => "Unknown".to_string(),
        };

        #[cfg(target_arch = "x86_64")]
        let chip_type = ChipType::Intel;

        #[cfg(target_arch = "aarch64")]
        let chip_type = ChipType::AppleSilicon;

        let shell = env::var("SHELL")
            .unwrap_or("Unknown".into())
            .split('/')
            .last()
            .unwrap_or("Unknown")
            .into();

        Ok(Self {
            macos_version,
            chip_type,
            shell,
        })
    }
}

#[cfg(target_os = "linux")]
impl LinuxInfo {
    /// Retrieves the Linux distribution information.
    pub fn get() -> Result<Self, CoreError> {
        let mut info = OsRelease::new().map_err(|e| CoreError::Error(e.into()))?;
        let graphics_platform = match env::var("XDG_SESSION_TYPE")
            .map_err(|e| CoreError::Error(e.into()))?
            .as_str()
        {
            "x11" => GraphicsPlatform::X11,
            "wayland" => GraphicsPlatform::Wayland,
            _ => GraphicsPlatform::Unknown,
        };
        let desktop = env::var("XDG_CURRENT_DESKTOP")
            .unwrap_or_else(|_| env::var("DESKTOP_SESSION").unwrap_or("Unknown".into()));

        let shell = env::var("SHELL")
            .unwrap_or("Unknown".into())
            .split('/')
            .last()
            .unwrap_or("Unknown")
            .into();

        Ok(Self {
            id: info.id,
            id_like: info.id_like,
            name: info.name,
            pretty_name: info.pretty_name,
            version: info.version,
            version_id: info.version_id,
            version_codename: info.version_codename,
            graphics_platform,
            desktop,
            shell,
            bug_report_url: info.bug_report_url,
            support_url: info.support_url,
            home_url: info.home_url,
            privacy_policy_url: info.privacy_policy_url,
            documentation_url: info
                .extra
                .remove("DOCUMENTATION_URL")
                .unwrap_or(String::with_capacity(0))
                .replace("\"", ""),
        })
    }
}

impl PlatformInfo {
    /// Retrieves the platform information.
    pub fn get() -> Result<Self, CoreError> {
        let hostname = tauri_plugin_os::hostname();
        let os_arch = tauri_plugin_os::arch().to_string();
        let kernel = System::kernel_version().unwrap_or(String::with_capacity(0));
        let platform = match tauri_plugin_os::platform() {
            "windows" => Platform::Windows,
            "macos" => Platform::MacOS,
            "linux" => Platform::Linux,
            _ => Platform::Unknown,
        };

        #[cfg(target_os = "windows")]
        let windows_info = WindowsInfo::get()?;
        #[cfg(target_os = "windows")]
        return Ok(Self {
            platform,
            hostname,
            os_arch,
            kernel,
            windows_info,
        });

        #[cfg(target_os = "macos")]
        let macos_info = MacOSInfo::get()?;
        #[cfg(target_os = "macos")]
        return Ok(Self {
            platform,
            hostname,
            os_arch,
            kernel,
            macos_info,
        });

        #[cfg(target_os = "linux")]
        let linux_info = LinuxInfo::get()?;
        #[cfg(target_os = "linux")]
        #[allow(clippy::needless_return)]
        return Ok(Self {
            platform,
            hostname,
            os_arch,
            kernel,
            linux_info,
        });
    }
}
