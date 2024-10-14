use phf::phf_map;
use serde::{Serialize, Serializer};
use std::error::Error;
use std::fmt::{Display, Formatter};

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

/// Serializes a value into a JSON string without including double quotes in the result.
///
/// # Arguments
///
/// * `value` - The value to serialize.
#[inline]
fn serialize_without_quotes<S>(value: &S) -> String
where
    S: Serialize,
{
    serde_json::to_string(value)
        .unwrap()
        .to_string()
        .replace("\"", "")
}

impl Display for VulkanDeviceType {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", serialize_without_quotes(&self))
    }
}

impl Display for VulkanMemoryHeapFlags {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", serialize_without_quotes(&self))
    }
}

/// Lookup map for raw Vulkan device type constant.
pub static VK_DEVICE_TYPE_MAP: phf::Map<i32, VulkanDeviceType> = phf_map! {
    0_i32 => VulkanDeviceType::Other,
    1_i32 => VulkanDeviceType::IntegratedGpu,
    2_i32 => VulkanDeviceType::DiscreteGpu,
    3_i32 => VulkanDeviceType::VirtualGpu,
    4_i32 => VulkanDeviceType::Cpu,
};

/// Lookup map for raw Vulkan device memory heap flags constant.
pub static VK_MEMORY_HEAP_FLAGS_MAP: phf::Map<u32, VulkanMemoryHeapFlags> = phf_map! {
    0_u32 => VulkanMemoryHeapFlags::DeviceLocal,
    1_u32 => VulkanMemoryHeapFlags::MultiInstance,
};

/// Custom error type for errors encountered while gathering system information.
#[non_exhaustive]
#[derive(Debug, thiserror::Error)]
pub enum CoreError {
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

    /// Vulkan info retrieval error.
    #[error("An error occurred while retrieving Vulkan information: {0}")]
    VulkanInfoError(Box<str>),

    /// OpenGL info retrieval error.
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
enum CoreErrorKind {
    CPUInfoError(String),

    #[cfg(target_os = "windows")]
    DirectXInfoError(String),

    #[cfg(target_os = "macos")]
    MetalInfoError(String),

    VulkanInfoError(String),
    OpenGLInfoError(String),
    Error(String),
}

impl Serialize for CoreError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let err_msg = self.to_string();
        let err_kind = match self {
            Self::CPUInfoError(_) => CoreErrorKind::CPUInfoError(err_msg),

            #[cfg(target_os = "windows")]
            Self::DirectXInfoError(_) => CoreErrorKind::DirectXInfoError(err_msg),

            #[cfg(target_os = "macos")]
            Self::MetalInfoError(_) => CoreErrorKind::MetalInfoError(err_msg),

            Self::VulkanInfoError(_) => CoreErrorKind::VulkanInfoError(err_msg),
            Self::OpenGLInfoError(_) => CoreErrorKind::OpenGLInfoError(err_msg),
            Self::Error(_) => CoreErrorKind::Error(err_msg),
        };

        err_kind.serialize(serializer)
    }
}
