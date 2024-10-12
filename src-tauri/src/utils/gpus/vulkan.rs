use ash::vk::{self, InstanceCreateInfo};
use ash::Entry;
use serde::Serialize;

use crate::types::{PeekError, VK_DEVICE_TYPE_MAP};

/// Contains information of a Vulkan device layer.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VulkanDeviceLayer {
    /// The layer's name.
    pub layer_name: String,
    /// The layer's Vulkan version.
    pub vulkan_version: String,
    /// The layer's version.
    pub layer_version: u32,
    /// The layer's description.
    pub description: String,
}

// TODO: add limits and sparse properties.
/// Contains information of a Vulkan device.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VulkanDevice {
    /// The name of the device.
    pub device_name: String,
    /// The device's vendor ID.
    pub vendor_id: u32,
    /// The device ID.
    pub device_id: u32,
    /// The type of device (Integrated, Discrete, Virtual, etc.).
    pub device_type: String,
    /// The Vulkan API version the device supports.
    pub api_version: String,
    /// The device's driver version.
    pub driver_version: String,
    /// The pipeline cache UUID.
    pub pipeline_cache_uuid: String,
    /// The device's Vulkan layers.
    pub layers: Vec<VulkanDeviceLayer>,
}

/// Contains information about Vulkan on the system.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VulkanInfo {
    /// The total number of Vulkan-enabled devices.
    total_devices: usize,
    /// The list of Vulkan-enabled devices identified on the system.
    devices: Vec<VulkanDevice>,
}

impl VulkanInfo {
    /// Extracts and forms a Vulkan version string.
    ///
    /// # Arguments
    ///
    /// * `version` - The Vulkan version value.
    fn get_version_string(version: u32) -> String {
        let major = vk::api_version_major(version);
        let minor = vk::api_version_minor(version);
        let patch = vk::api_version_patch(version);

        format!("{major}.{minor}.{patch}")
    }

    // TODO: split info retrieval into separate functions.
    /// Retrieves the Vulkan information from the system.
    pub fn get() -> Result<Self, PeekError> {
        let entry =
            unsafe { Entry::load().map_err(|e| PeekError::VulkanInfoError(e.to_string().into()))? };
        let instance = unsafe {
            entry
                .create_instance(
                    &InstanceCreateInfo {
                        ..Default::default()
                    },
                    None,
                )
                .map_err(|e| PeekError::VulkanInfoError(e.to_string().into()))?
        };
        let physical_devices = unsafe {
            instance
                .enumerate_physical_devices()
                .map_err(|e| PeekError::VulkanInfoError(e.to_string().into()))?
        };
        let devices_count = physical_devices.len();
        let mut devices = Vec::with_capacity(devices_count);

        for device in physical_devices {
            let device_props = unsafe { instance.get_physical_device_properties(device) };
            let device_name = device_props
                .device_name_as_c_str()
                .map_err(|e| PeekError::VulkanInfoError(e.to_string().into()))?
                .to_string_lossy()
                .to_string();
            let vendor_id = device_props.vendor_id;
            let device_id = device_props.device_id;
            let api_version = Self::get_version_string(device_props.api_version);
            let driver_version = Self::get_version_string(device_props.driver_version);
            let pipeline_cache_uuid = hex::encode(device_props.pipeline_cache_uuid);

            let device_layers = unsafe {
                instance
                    .enumerate_device_layer_properties(device)
                    .map_err(|e| PeekError::VulkanInfoError(e.to_string().into()))?
            };
            let mut layers = Vec::with_capacity(device_layers.len());

            for layer in device_layers {
                let layer_name = layer
                    .layer_name_as_c_str()
                    .map_err(|e| PeekError::Error(e.into()))?
                    .to_string_lossy()
                    .to_string();
                let vulkan_version = Self::get_version_string(layer.spec_version);
                let layer_version = layer.implementation_version;
                let description = layer
                    .description_as_c_str()
                    .map_err(|e| PeekError::Error(e.into()))?
                    .to_string_lossy()
                    .to_string();

                layers.push(VulkanDeviceLayer {
                    layer_name,
                    vulkan_version,
                    layer_version,
                    description,
                });
            }

            let device_type = &VK_DEVICE_TYPE_MAP[&device_props.device_type.as_raw()];

            devices.push(VulkanDevice {
                device_name,
                vendor_id,
                device_id,
                device_type: device_type.to_string(),
                api_version,
                driver_version,
                pipeline_cache_uuid,
                layers,
            })
        }

        Ok(Self {
            total_devices: devices_count,
            devices,
        })
    }
}
