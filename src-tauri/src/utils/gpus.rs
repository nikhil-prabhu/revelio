use serde::{Serialize, Serializer};
use wgpu::{Backend, Backends, DeviceType, Instance, InstanceDescriptor, InstanceFlags};

// TODO: include more advanced information (Eg: DirectX/Metal/Vulkan info, etc.).
/// Represents an individual GPU on the system.
#[derive(Debug, Serialize)]
pub struct Gpu {
    /// The name of the GPU.
    pub name: String,
    /// The vendor ID of the GPU.
    pub vendor_id: u32,
    /// The device ID of the GPU.
    pub device_id: u32,
    /// The driver in use by the GPU.
    pub driver: String,

    /// The GPU backend (`DirectX 12`, `Metal`, `Vulkan`, etc.).
    #[serde(serialize_with = "serialize_backend")]
    pub backend: Backend,
    /// The GPU device type.
    #[serde(serialize_with = "serialize_device_type")]
    pub device_type: DeviceType,
}

/// Contains information of all the GPUs identified on the system.
#[derive(Debug, Serialize)]
pub struct GpusInfo {
    /// The total number of GPUs.
    pub count: u64,
    /// The information of each GPU.
    pub gpus: Vec<Gpu>,
}

fn serialize_backend<S>(b: &Backend, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match b {
        Backend::Vulkan => serializer.serialize_str("Vulkan"),
        Backend::Metal => serializer.serialize_str("Metal"),
        Backend::Dx12 => serializer.serialize_str("DirectX 12"),
        Backend::Gl => serializer.serialize_str("OpenGL"),
        _ => unimplemented!(),
    }
}

fn serialize_device_type<S>(d: &DeviceType, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match d {
        DeviceType::Cpu => serializer.serialize_str("CPU"),
        DeviceType::DiscreteGpu => serializer.serialize_str("Discrete Graphics"),
        DeviceType::IntegratedGpu => serializer.serialize_str("Integrated Graphics"),
        DeviceType::VirtualGpu => serializer.serialize_str("Virtual Graphics"),
        DeviceType::Other => serializer.serialize_str("Other"),
    }
}

impl GpusInfo {
    /// Retrieves information of all GPUs identified on the system.
    pub fn get() -> Self {
        #[cfg(target_os = "windows")]
        let backends = Backends::DX12;
        #[cfg(target_os = "macos")]
        let backends = Backends::METAL;
        #[cfg(target_os = "linux")]
        let backends = Backends::VULKAN | Backends::GL;

        let instance = Instance::new(InstanceDescriptor {
            backends,
            flags: InstanceFlags::empty(),
            ..Default::default()
        });
        let adapters = instance.enumerate_adapters(backends);
        let count = adapters.len();
        let mut gpus_info = Vec::with_capacity(count);

        for adapter in adapters {
            let adapter_info = adapter.get_info();

            gpus_info.push(Gpu {
                name: adapter_info.name,
                vendor_id: adapter_info.vendor,
                device_id: adapter_info.device,
                driver: adapter_info.driver,
                backend: adapter_info.backend,
                device_type: adapter_info.device_type,
            })
        }

        Self {
            count: count as u64,
            gpus: gpus_info,
        }
    }
}
