use sysinfo::{Disks, DiskKind};
use serde::{Serialize, Serializer};

// TODO: include more advanced information (Eg: vendor, etc.).
/// Represents an individual disk on the system.
#[derive(Debug, Serialize)]
pub struct Disk {
    /// The name of the disk.
    pub name: String,
    /// The file-system of the disk (Eg: `EXT4`, `NTFS`, etc.).
    pub file_system: String,
    /// The mount point of the disk.
    pub mount_point: String,
    /// The total space/size of the disk.
    pub total_space: u64,
    /// The currently available space on the disk.
    pub available_space: u64,
    
    /// The kind of disk (`HDD`, `SSD` or `Unknown(n)`).
    #[serde(serialize_with = "serialize_disk_kind")]
    pub kind: DiskKind,
}

/// Contains information of all the disks identified on the system.
#[derive(Debug, Serialize)]
pub struct DisksInfo {
    /// The total number of disks.
    pub count: u64,
    /// The information of each disk.
    pub disks: Vec<Disk>,
}

fn serialize_disk_kind<S>(d: &DiskKind, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match d {
        DiskKind::HDD => serializer.serialize_str("Hard Disk Drive (HDD)"),
        DiskKind::SSD => serializer.serialize_str("Solid State Drive (SDD)"),
        DiskKind::Unknown(n) => serializer.serialize_str(&format!("Unknown({n})")),
    }
}

impl DisksInfo {
    /// Retrieves information of all disks identified on the system.
    pub fn get() -> Self {
        let disks = Disks::new_with_refreshed_list();
        let count = disks.list().len();
        let mut disks_info = Vec::with_capacity(count);
        
        for disk in disks.list() {
            let name = disk.name().to_string_lossy().to_string();
            let file_system = disk.file_system().to_string_lossy().to_string();
            let mount_point = disk.mount_point().to_string_lossy().to_string();
            
            disks_info.push(Disk {
                name,
                file_system,
                mount_point,
                total_space: disk.total_space(),
                available_space: disk.available_space(),
                kind: disk.kind(),
            });
        }
        
        Self{
            count: count as u64,
            disks: disks_info,
        }
    }
}
