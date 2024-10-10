use std::error::Error;

use serde::{Serialize, Serializer};

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
