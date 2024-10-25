use metal::{Device, MTLArgumentBuffersTier, MTLDeviceLocation, MTLReadWriteTextureTier, MTLSize};
use num_format::{Locale, ToFormattedString};
use serde::{Serialize, Serializer};

use crate::types::CoreError;

/// Contains information of a Metal counter set.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MetalCounterSet {
    pub name: String,
}

/// Contains information of a Metal device.
#[allow(non_snake_case)]
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MetalDevice {
    pub index: usize,
    pub device_name: String,
    pub registry_id: u64,
    #[serde(serialize_with = "serialize_mtl_device_location")]
    pub location: MTLDeviceLocation,
    pub location_number: u64,
    pub max_threadgroup_memory_length: u64,
    #[serde(serialize_with = "serialize_mtl_size")]
    pub max_threads_per_threadgroup: MTLSize,
    pub is_low_power: bool,
    pub is_headless: bool,
    pub is_removable: bool,
    pub supports_raytracing: bool,
    pub has_unified_memory: bool,
    pub recommended_max_working_set_size: u64,
    pub max_transfer_rate: u64,
    pub supports_barycentric_coordinates: bool,
    pub supports_function_pointers: bool,
    pub supports_dynamic_libraries: bool,
    #[serde(serialize_with = "serialize_mtl_argument_buffers_tier")]
    pub argument_buffers_support: MTLArgumentBuffersTier,
    #[serde(serialize_with = "serialize_mtl_read_write_texture_tier")]
    pub read_write_texture_support: MTLReadWriteTextureTier,
    pub supports_32bit_float_filtering: bool,
    pub supports_32bit_MSAA: bool,
    pub supports_query_texture_LOD: bool,
    pub supports_BC_texture_compression: bool,
    pub supports_pull_model_interpolation: bool,
    pub max_argument_buffer_sampler_count: u64,
    pub current_allocated_size: u64,
    pub max_buffer_length: u64,
    pub counter_sets: Vec<MetalCounterSet>,
}

/// Contains information about the Metal capable devices identified on the system.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MetalInfo {
    pub total_devices: usize,
    pub devices: Vec<MetalDevice>,
}

fn serialize_mtl_device_location<S>(m: &MTLDeviceLocation, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match m {
        MTLDeviceLocation::BuiltIn => serializer.serialize_str("Built-in"),
        MTLDeviceLocation::Slot => serializer.serialize_str("Slot"),
        MTLDeviceLocation::External => serializer.serialize_str("External"),
        MTLDeviceLocation::Unspecified => serializer.serialize_str("Unspecified"),
    }
}

fn serialize_mtl_size<S>(m: &MTLSize, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let product = m.depth * m.width * m.height;
    serializer.serialize_str(&format!(
        "{} (depth: {} width: {} height: {})",
        product.to_formatted_string(&Locale::en),
        m.depth,
        m.width,
        m.height
    ))
}

fn serialize_mtl_argument_buffers_tier<S>(
    m: &MTLArgumentBuffersTier,
    serializer: S,
) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match m {
        MTLArgumentBuffersTier::Tier1 => serializer.serialize_str("Tier 1"),
        MTLArgumentBuffersTier::Tier2 => serializer.serialize_str("Tier 2"),
    }
}

fn serialize_mtl_read_write_texture_tier<S>(
    m: &MTLReadWriteTextureTier,
    serializer: S,
) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match m {
        MTLReadWriteTextureTier::TierNone => serializer.serialize_str("Tier None"),
        MTLReadWriteTextureTier::Tier1 => serializer.serialize_str("Tier 1"),
        MTLReadWriteTextureTier::Tier2 => serializer.serialize_str("Tier 2"),
    }
}

impl MetalInfo {
    /// Retrieves information about the Metal capable devices identified on the system.
    pub fn get() -> Result<Self, CoreError> {
        let devices = Device::all();
        let total_devices = devices.len();
        let mut metal_devices = Vec::with_capacity(total_devices);

        for (idx, device) in devices.iter().enumerate() {
            let counter_sets = device.counter_sets();
            let mut metal_counter_sets = Vec::with_capacity(counter_sets.len());

            for counter_set in counter_sets {
                metal_counter_sets.push(MetalCounterSet {
                    name: counter_set.name().into(),
                })
            }

            metal_devices.push(MetalDevice {
                index: idx,
                device_name: device.name().into(),
                registry_id: device.registry_id(),
                location: device.location(),
                location_number: device.location_number(),
                max_threadgroup_memory_length: device.max_threadgroup_memory_length(),
                max_threads_per_threadgroup: device.max_threads_per_threadgroup(),
                is_low_power: device.is_low_power(),
                is_headless: device.is_headless(),
                is_removable: device.is_removable(),
                supports_raytracing: device.supports_raytracing(),
                has_unified_memory: device.has_unified_memory(),
                recommended_max_working_set_size: device.recommended_max_working_set_size(),
                max_transfer_rate: device.max_transfer_rate(),
                supports_barycentric_coordinates: device.supports_shader_barycentric_coordinates(),
                supports_function_pointers: device.supports_function_pointers(),
                supports_dynamic_libraries: device.supports_dynamic_libraries(),
                argument_buffers_support: device.argument_buffers_support(),
                read_write_texture_support: device.read_write_texture_support(),
                supports_32bit_float_filtering: device.supports_32bit_float_filtering(),
                supports_32bit_MSAA: device.supports_32bit_MSAA(),
                supports_query_texture_LOD: device.supports_query_texture_LOD(),
                supports_BC_texture_compression: device.supports_BC_texture_compression(),
                supports_pull_model_interpolation: device.supports_pull_model_interpolation(),
                max_argument_buffer_sampler_count: device.max_argument_buffer_sampler_count(),
                current_allocated_size: device.current_allocated_size(),
                max_buffer_length: device.max_buffer_length(),
                counter_sets: metal_counter_sets,
            })
        }

        Ok(Self {
            total_devices,
            devices: metal_devices,
        })
    }
}
