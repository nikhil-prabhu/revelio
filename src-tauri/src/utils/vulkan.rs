use std::ffi::CStr;

use ash::Entry;
use serde::Serialize;

use crate::types::PeekError;

/// Contains information about a Vulkan extension.
#[derive(Debug, Serialize)]
pub struct VulkanExt {
    /// The name of the extension.
    pub name: String,
    /// The version/revision of the extension.
    pub version: u32,
}

/// Contains Vulkan information.
#[derive(Debug, Serialize)]
pub struct VulkanInfo {
    /// Information about the detected Vulkan extensions.
    pub extensions: Vec<VulkanExt>,
    /// The total number of detected Vulkan extensions.
    pub total_extensions: u64,
}

impl VulkanInfo {
    /// Retrieves Vulkan information from the system.
    pub fn get() -> Result<Self, PeekError> {
        let entry = unsafe { Entry::load().map_err(|e| PeekError::Error(e.into()))? };
        let ext_props = unsafe {
            entry
                .enumerate_instance_extension_properties(None)
                .map_err(|e| PeekError::Error(e.into()))?
        };
        let count = ext_props.len();
        let mut extensions = Vec::with_capacity(count);

        for ext in ext_props {
            let ext_name = unsafe { CStr::from_ptr(ext.extension_name.as_ptr()) }.to_string_lossy();

            extensions.push(VulkanExt {
                name: ext_name.into(),
                version: ext.spec_version,
            });
        }

        Ok(Self {
            extensions,
            total_extensions: count as u64,
        })
    }
}
