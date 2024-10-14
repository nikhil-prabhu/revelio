use std::fmt::Display;

use serde::{Serialize, Serializer};
use sysinfo::{IpNetwork, Networks};

/// Represents an individual network interface on the system.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NetworkInterface {
    /// The name of the interface.
    itf_name: String,
    /// The MAC address of the interface.
    mac_addr: String,

    /// The IP networks belonging to the interface.
    #[serde(serialize_with = "serialize_display_vec")]
    ip_networks: Vec<IpNetwork>,
}

/// Contains information of the networks and network interfaces on the system.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NetworksInfo {
    /// The total number of network interfaces.
    pub total_interfaces: usize,
    /// The list of network interfaces.
    pub interfaces: Vec<NetworkInterface>,
}

#[inline]
fn serialize_display_vec<S, T>(values: &Vec<T>, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
    T: Display,
{
    let disp_strings: Vec<String> = values.iter().map(|v| v.to_string()).collect();
    disp_strings.serialize(serializer)
}

impl NetworksInfo {
    /// Retrieves network(s) information from the system.
    pub fn get() -> Self {
        let networks = Networks::new_with_refreshed_list();
        let count = networks.len();
        let mut interfaces = Vec::with_capacity(count);

        for (itf_name, network) in &networks {
            let mac_addr = network.mac_address().to_string();
            let ip_networks = network.ip_networks();

            interfaces.push(NetworkInterface {
                itf_name: itf_name.clone(),
                mac_addr,
                ip_networks: ip_networks.into(),
            })
        }

        Self {
            total_interfaces: count,
            interfaces,
        }
    }
}
