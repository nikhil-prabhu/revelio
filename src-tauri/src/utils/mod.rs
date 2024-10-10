pub mod cpu;
pub mod disks;
pub mod gpus;

#[cfg(target_os = "linux")]
pub mod linux;
