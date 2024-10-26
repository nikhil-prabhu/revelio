use std::ptr;
use std::mem;

use serde::Serialize;
use winapi::ctypes::c_void;
use winapi::Interface;
use winapi::shared::dxgi::{CreateDXGIFactory, IDXGIAdapter, IDXGIFactory, DXGI_ADAPTER_DESC};
use crate::types::CoreError;

// TODO: add more info.
/// Contains information of a DirectX device.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DirectXDevice {
    /// Device index; useful for unique identification in mapping functions, but otherwise not bound to the device itself.
    pub index: usize,
    /// The name of the device.
    pub device_name: String,
    /// The device's vendor ID.
    pub vendor_id: u32,
    /// The device ID.
    pub device_id: u32,
    /// The subsystem ID.
    pub sub_sys_id: u32,
    /// The device revision.
    pub revision: u32,
    /// Dedicated video memory in bytes.
    pub dedicated_video_memory: usize,
    /// Dedicated system memory in bytes.
    pub dedicated_system_memory: usize,
    /// Shared system memory in bytes.
    pub shared_system_memory: usize,
}

/// Contains information about DirectX on the system.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DirectXInfo {
    /// The total number of DirectX capable devices.
    pub total_devices: usize,
    /// The list of DirectX capable devices identified on the system.
    pub devices: Vec<DirectXDevice>,
}

impl DirectXInfo {
    /// Retrieves the DirectX information from the system.
    pub fn get() -> Result<Self, CoreError> {
        let mut total_devices: usize = 0;
        let mut devices = Vec::new();

        unsafe {
            let mut dxgi_factory: *mut IDXGIFactory = ptr::null_mut();
            if CreateDXGIFactory(
                &IDXGIFactory::uuidof(),
                &mut dxgi_factory as *mut _ as *mut *mut c_void,
            ) != 0 {
                return Err(CoreError::DirectXInfoError("Failed to create DXGIFactory".into()));
            }

            let mut adapter_idx = 0;
            loop {
                let mut adapter: *mut IDXGIAdapter = ptr::null_mut();
                if (*dxgi_factory).EnumAdapters(adapter_idx, &mut adapter) != 0 {
                    break;
                }

                let mut desc: DXGI_ADAPTER_DESC = mem::zeroed();
                (*adapter).GetDesc(&mut desc);

                let device_name = String::from_utf16_lossy(&desc.Description);
                let vendor_id = desc.VendorId as u32;
                let device_id = desc.DeviceId as u32;
                let sub_sys_id = desc.SubSysId as u32;
                let revision = desc.Revision as u32;
                let dedicated_video_memory = desc.DedicatedVideoMemory as usize;
                let dedicated_system_memory = desc.DedicatedSystemMemory as usize;
                let shared_system_memory = desc.SharedSystemMemory as usize;

                devices.push(DirectXDevice{
                    index: adapter_idx as usize,
                    device_name,
                    vendor_id,
                    device_id,
                    sub_sys_id,
                    revision,
                    dedicated_video_memory,
                    dedicated_system_memory,
                    shared_system_memory,
                });

                (*adapter).Release();
                adapter_idx += 1;
                total_devices += 1;
            }

            (*dxgi_factory).Release();
        }

        Ok(Self {
            total_devices,
            devices,
        })
    }
}
