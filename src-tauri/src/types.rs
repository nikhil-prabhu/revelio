use std::error::Error;

use thiserror::Error as ThisError;

/// Custom error type for errors encountered while gathering system information.
#[non_exhaustive]
#[derive(Debug, ThisError)]
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
