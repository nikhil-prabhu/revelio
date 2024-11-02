use nusb::Speed;
use serde::{Serialize, Serializer};

use crate::types::CoreError;

/// Represents an interface belonging to a USB device.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct USBInterface {
    pub interface_number: u8,
    pub class: u8,
    pub subclass: u8,
    pub protocol: u8,
    pub interface_string: Option<String>,
}

/// Represents a USB device on the system.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct USBDevice {
    pub index: usize,
    pub bus_number: u8,
    pub device_address: u8,
    pub vendor_id: u16,
    pub product_id: u16,
    pub device_version: u16,
    pub class: u8,
    pub subclass: u8,
    pub protocol: u8,
    #[serde(serialize_with = "serialize_optional_speed")]
    pub speed: Option<Speed>,
    pub manufacturer_string: Option<String>,
    pub product_string: Option<String>,
    pub serial_number: Option<String>,
    pub interfaces: Vec<USBInterface>,
}

fn serialize_optional_speed<S>(s: &Option<Speed>, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    match s {
        Some(s) => match s {
            Speed::Low => serializer.serialize_str("Low speed (1.5 Mbit)"),
            Speed::Full => serializer.serialize_str("Full speed (12 Mbit)"),
            Speed::High => serializer.serialize_str("High speed (480 Mbit)"),
            Speed::Super => serializer.serialize_str("Super speed (5,000 Mbit)"),
            Speed::SuperPlus => serializer.serialize_str("Super speed (10,000 Mbit)"),
            _ => serializer.serialize_str("Unknown"),
        },
        None => serializer.serialize_none(),
    }
}

/// Contains information about the USB devices on the system.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct USBInfo {
    total_devices: usize,
    devices: Vec<USBDevice>,
}

impl USBInfo {
    /// Retrieves information about the USB devices detected on the system.
    pub fn get() -> Result<Self, CoreError> {
        let devices_iter =
            nusb::list_devices().map_err(|e| CoreError::USBInfoError(e.to_string().into()))?;
        let mut total_devices = 0;
        let (lower, upper) = devices_iter.size_hint();
        let mut devices: Vec<USBDevice> = Vec::with_capacity(upper.unwrap_or(lower));

        for (idx, device) in devices_iter.enumerate() {
            let interfaces_iter = device.interfaces();
            let (lower, upper) = interfaces_iter.size_hint();
            let mut interfaces = Vec::with_capacity(upper.unwrap_or(lower));

            for itf in interfaces_iter {
                interfaces.push(USBInterface {
                    interface_number: itf.interface_number(),
                    class: itf.class(),
                    subclass: itf.subclass(),
                    protocol: itf.protocol(),
                    interface_string: itf.interface_string().map(str::to_string),
                })
            }

            devices.push(USBDevice {
                index: idx,
                bus_number: device.bus_number(),
                device_address: device.device_address(),
                vendor_id: device.vendor_id(),
                product_id: device.product_id(),
                device_version: device.device_version(),
                class: device.class(),
                subclass: device.subclass(),
                protocol: device.protocol(),
                speed: device.speed(),
                manufacturer_string: device.manufacturer_string().map(str::to_string),
                product_string: device.product_string().map(str::to_string),
                serial_number: device.serial_number().map(str::to_string),
                interfaces,
            });
            total_devices += 1;
        }

        Ok(USBInfo {
            total_devices,
            devices,
        })
    }
}
