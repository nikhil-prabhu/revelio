use std::error::Error;

use phf::phf_map;
use serde::{Serialize, Serializer};

#[doc = "<https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VkPhysicalDeviceType.html>"]
#[derive(Serialize)]
pub enum VulkanDeviceType {
    #[serde(rename = "VK_PHYSICAL_DEVICE_TYPE_OTHER")]
    Other,
    #[serde(rename = "VK_PHYSICAL_DEVICE_TYPE_INTEGRATED_GPU")]
    IntegratedGpu,
    #[serde(rename = "VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU")]
    DiscreteGpu,
    #[serde(rename = "VK_PHYSICAL_DEVICE_TYPE_VIRTUAL_GPU")]
    VirtualGpu,
    #[serde(rename = "VK_PHYSICAL_DEVICE_TYPE_CPU")]
    Cpu,
}

#[doc = "<https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VkMemoryHeapFlagBits.html>"]
#[derive(Serialize)]
pub enum VulkanMemoryHeapFlags {
    #[serde(rename = "VK_MEMORY_HEAP_DEVICE_LOCAL_BIT")]
    DeviceLocal,
    #[serde(rename = "VK_MEMORY_HEAP_MULTI_INSTANCE_BIT")]
    MultiInstance,
}

/// Lookup map for raw Vulkan device type constant.
pub static VK_DEVICE_TYPE_MAP: phf::Map<u32, VulkanDeviceType> = phf_map! {
    0_u32 => VulkanDeviceType::Other,
    1_u32 => VulkanDeviceType::IntegratedGpu,
    2_u32 => VulkanDeviceType::DiscreteGpu,
    3_u32 => VulkanDeviceType::VirtualGpu,
    4_u32 => VulkanDeviceType::Cpu,
};

/// Lookup map for raw Vulkan device memory heap flags constant.
pub static VK_MEMORY_HEAP_FLAGS_MAP: phf::Map<u32, VulkanMemoryHeapFlags> = phf_map! {
    0_u32 => VulkanMemoryHeapFlags::DeviceLocal,
    1_u32 => VulkanMemoryHeapFlags::MultiInstance,
};

/// Custom error type for errors encountered while gathering system information.
#[non_exhaustive]
#[derive(Debug, thiserror::Error)]
pub enum PeekError {
    #[error("An error occurred while retrieving CPU information: {0}")]
    CPUInfoError(Box<str>),

    /// DirectX info retrieval error (Windows only).
    #[cfg(target_os = "windows")]
    #[error("An error occurred while retrieving DirectX information: {0}")]
    DirectXInfoError(Box<str>),

    /// Metal info retrieval error (macOS only).
    #[cfg(target_os = "macos")]
    #[error("An error occurred while retrieving Metal information: {0}")]
    MetalInfoError(Box<str>),

    /// Vulkan info retrieval error (Linux only).
    #[cfg(target_os = "linux")]
    #[error("An error occurred while retrieving Vulkan information: {0}")]
    VulkanInfoError(Box<str>),

    /// OpenGL info retrieval error (Linux only).
    #[cfg(target_os = "linux")]
    #[error("An error occurred while retrieving OpenGL information: {0}")]
    OpenGLInfoError(Box<str>),

    /// Generic errors.
    #[error("An error occurred: {0}")]
    Error(
        #[from]
        #[source]
        Box<dyn Error + Send + Sync>,
    ),
}

#[derive(Debug, Serialize)]
#[serde(tag = "kind", content = "message")]
#[serde(rename_all = "camelCase")]
enum PeekErrorKind {
    CPUInfoError(String),

    #[cfg(target_os = "windows")]
    DirectXInfoError(String),

    #[cfg(target_os = "macos")]
    MetalInfoError(String),

    #[cfg(target_os = "linux")]
    VulkanInfoError(String),

    #[cfg(target_os = "linux")]
    OpenGLInfoError(String),

    Error(String),
}

impl Serialize for PeekError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let err_msg = self.to_string();
        let err_kind = match self {
            Self::CPUInfoError(_) => PeekErrorKind::CPUInfoError(err_msg),

            #[cfg(target_os = "windows")]
            Self::DirectXInfoError(_) => PeekErrorKind::DirectXInfoError(err_msg),

            #[cfg(target_os = "macos")]
            Self::MetalInfoError(_) => PeekErrorKind::MetalInfoError(err_msg),

            #[cfg(target_os = "linux")]
            Self::VulkanInfoError(_) => PeekErrorKind::VulkanInfoError(err_msg),

            #[cfg(target_os = "linux")]
            Self::OpenGLInfoError(_) => PeekErrorKind::OpenGLInfoError(err_msg),

            Self::Error(_) => PeekErrorKind::Error(err_msg),
        };

        err_kind.serialize(serializer)
    }
}
