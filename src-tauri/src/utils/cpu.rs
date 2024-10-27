use cpuinfo_rs::{CacheInfo, CpuInfo as Info};
use serde::Serialize;

use crate::types::CoreError;
#[cfg(any(target_os = "macos", target_os = "linux"))]
use libc::{uname, utsname};

/// Contains information of a single logical processor.
#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Processor {
    pub smt_id: u32,
    pub windows_group_id: Option<u16>,
    pub windows_processor_id: Option<u16>,
    pub apic_id: u32,
}

#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Core {
    pub id: u32,
    pub processors_count: u32,
    pub cpu_id: u32,
    pub frequency: u64,
    pub processors: Vec<Processor>,
}

/// Contains information of the system's CPU.
#[derive(Debug, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CpuInfo {
    pub brand: String,
    pub arch: String,
    pub op_modes: String,
    pub vendor_id: String,
    pub cache_info: CacheInfo,
    pub processors_count: usize,
    pub core_count: usize,
    pub threads_per_core: usize,
    pub cores: Vec<Core>,
}

impl CpuInfo {
    #[cfg(target_os = "windows")]
    /// Retrieves the CPU's supported op-modes.
    fn get_cpu_op_modes() -> Result<String, String> {
        todo!()
    }

    #[cfg(any(target_os = "macos", target_os = "linux"))]
    /// Retrieves the CPU's supported op-modes.
    fn get_cpu_op_modes() -> Result<String, String> {
        unsafe {
            let mut uname_info: utsname = std::mem::zeroed();
            if uname(&mut uname_info) != 0 {
                return Err("Failed to retrieve CPU op-modes".into());
            }

            let machine = std::ffi::CStr::from_ptr(uname_info.machine.as_ptr())
                .to_string_lossy()
                .to_string();

            let mut modes = Vec::with_capacity(2);

            match machine.as_str() {
                "x86_64" => {
                    // x86_64 generally supports both 64-bit and 32-bit modes.
                    modes.push("64-bit");
                    modes.push("32-bit");
                }
                "aarch64" => modes.push("64-bit"), // 32-bit support on aarch64 depends on the OS configuration.
                "i386" | "i686" => modes.push("32-bit"),
                _ => modes.push("Unknown"),
            }

            Ok(modes.join(", "))
        }
    }

    /// Retrieves information of the system's CPU.
    pub fn get() -> Result<Self, CoreError> {
        let info = Info::new();
        let proc_info = info.processors();
        let cores_info = info.cores();
        let brand = &proc_info[0].package.name;
        let mut arch = String::new();
        let op_modes = Self::get_cpu_op_modes().map_err(|e| CoreError::CPUInfoError(e.into()))?;
        let vendor = &cores_info[0].vendor.name.to_string();
        let cache = &proc_info[0].cache;
        let proc_count = proc_info[0].package.processor_count as usize;
        let core_count = proc_info[0].package.core_count as usize;

        let mut cores = Vec::with_capacity(core_count);

        #[cfg(target_arch = "x86_64")]
        {
            arch = "x86_64".to_string();
        }

        #[cfg(target_arch = "aarch64")]
        {
            arch = "aarch64".to_string();
        }

        for core in cores_info {
            let mut processors = Vec::new();

            for proc in &proc_info {
                if proc.core.core_id == core.core_id {
                    let windows_group_id = None;
                    let windows_processor_id = None;

                    #[cfg(target_os = "windows")]
                    {
                        windows_group_id = proc.windows_group_id;
                        windows_processor_id = proc.windows_processor_id;
                    }

                    processors.push(Processor {
                        smt_id: proc.smt_id,
                        windows_group_id,
                        windows_processor_id,
                        apic_id: proc.apic_id,
                    })
                }
            }

            cores.push(Core {
                id: core.core_id,
                processors_count: core.processor_count,
                cpu_id: core.cpuid,
                frequency: core.frequency,
                processors,
            });
        }

        Ok(Self {
            brand: brand.clone(),
            arch,
            op_modes,
            vendor_id: vendor.clone(),
            cache_info: cache.clone(),
            processors_count: proc_count,
            core_count,
            threads_per_core: proc_count / core_count,
            cores,
        })
    }
}
