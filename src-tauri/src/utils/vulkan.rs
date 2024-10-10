use std::ffi::CStr;

use ash::{vk, Entry};
use serde::Serialize;

use crate::types::PeekError;

/// Contains information about a Vulkan instance extension.
#[derive(Debug, Serialize)]
pub struct VulkanExt {
    /// The name of the extension.
    pub name: String,
    /// The version/revision of the extension.
    pub version: u32,
}

/// Contains information about a Vulkan instance layer.
#[derive(Debug, Serialize)]
pub struct VulkanLayer {
    /// The name of the layer.
    pub name: String,
    /// The specification version of the layer.
    pub spec_version: u32,
    /// The implementation version of the layer.
    pub implementation_version: u32,
    /// The layer's description.
    pub description: String,
}

/// Contains Vulkan information.
#[derive(Debug, Serialize)]
pub struct VulkanInfo {
    /// The Vulkan instance version.
    pub instance_version: Option<String>,
    /// Information about the detected Vulkan instance extensions.
    pub extensions: Vec<VulkanExt>,
    /// The total number of detected Vulkan instance extensions.
    pub total_extensions: u64,
    /// Information about the detected Vulkan instance layers.
    pub layers: Vec<VulkanLayer>,
    /// The total number of detected Vulkan instance layers.
    pub total_layers: u64,
}

impl VulkanInfo {
    /// Retrieves Vulkan information from the system.
    pub fn get() -> Result<Self, PeekError> {
        let entry =
            unsafe { Entry::load().map_err(|e| PeekError::VulkanInfoError(e.to_string().into()))? };
        let ext_props = unsafe {
            entry
                .enumerate_instance_extension_properties(None)
                .map_err(|e| PeekError::VulkanInfoError(e.to_string().into()))?
        };
        let layer_props = unsafe {
            entry
                .enumerate_instance_layer_properties()
                .map_err(|e| PeekError::VulkanInfoError(e.to_string().into()))?
        };
        let exts_count = ext_props.len();
        let layers_count = layer_props.len();
        let mut extensions = Vec::with_capacity(exts_count);
        let mut layers = Vec::with_capacity(layers_count);

        for ext in ext_props {
            let ext_name = unsafe { CStr::from_ptr(ext.extension_name.as_ptr()) }.to_string_lossy();

            extensions.push(VulkanExt {
                name: ext_name.into(),
                version: ext.spec_version,
            });
        }

        for layer in layer_props {
            let layer_name = unsafe { CStr::from_ptr(layer.layer_name.as_ptr()) }.to_string_lossy();
            let layer_desc =
                unsafe { CStr::from_ptr(layer.description.as_ptr()) }.to_string_lossy();

            layers.push(VulkanLayer {
                name: layer_name.into(),
                spec_version: layer.spec_version,
                implementation_version: layer.implementation_version,
                description: layer_desc.into(),
            })
        }

        let instance_version = match unsafe { entry.try_enumerate_instance_version() }
            .map_err(|e| PeekError::VulkanInfoError(e.to_string().into()))?
        {
            Some(v) => {
                let major = vk::api_version_major(v);
                let minor = vk::api_version_minor(v);
                let patch = vk::api_version_patch(v);

                Some(format!("{major}.{minor}.{patch}"))
            }
            None => None,
        };

        Ok(Self {
            instance_version,
            extensions,
            total_extensions: exts_count as u64,
            layers,
            total_layers: layers_count as u64,
        })
    }
}
