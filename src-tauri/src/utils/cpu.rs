use serde::Serialize;
use sysinfo::{CpuRefreshKind, RefreshKind, System};

// TODO: include lower level information (Eg: cache, op-mode(s), etc.).
/// Contains information of the system's CPU/Processor.
#[derive(Debug, Serialize)]
pub struct CpuInfo {
    /// The CPU architecture.
    pub arch: Option<String>,
    /// The name of the CPU.
    pub name: String,
    /// The vendor ID of the CPU.
    pub vendor_id: String,
    /// The CPU brand.
    pub brand: String,
    /// The frequency of the CPU.
    pub frequency: u64,
    /// The total number of physical cores.
    pub physical_core_count: Option<usize>,
}

impl CpuInfo {
    /// Retrieves information of the system's CPU/Processor.
    pub fn get() -> Self {
        let sys = System::new_with_specifics(
            RefreshKind::new().with_cpu(CpuRefreshKind::new().without_cpu_usage()),
        );
        let physical_core_count = sys.physical_core_count();
        let cpus = sys.cpus();
        let cpu = &cpus[0];

        Self {
            arch: System::cpu_arch(),
            name: cpu.name().into(),
            vendor_id: cpu.vendor_id().into(),
            brand: cpu.brand().into(),
            frequency: cpu.frequency(),
            physical_core_count,
        }
    }
}
