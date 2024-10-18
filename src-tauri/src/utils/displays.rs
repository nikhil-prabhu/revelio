use glium::backend::glutin::SimpleWindowBuilder;
use serde::{Serialize, Serializer};
use winit::event_loop::EventLoop;
use winit::monitor::MonitorHandle;

use crate::types::CoreError;

/// Represents a display's dimensions (width x height).
#[derive(Clone)]
pub struct Dimensions {
    /// Display width.
    pub width: u32,
    /// Display height.
    pub height: u32,
}

/// Represents the position coordinates of the top-left corner of the monitor relative to the larger full screen area (x, y).
#[derive(Clone)]
pub struct Position {
    /// The x coordinate.
    pub x: i32,
    /// The y coordinate.
    pub y: i32,
}

/// Represents an individual display attached to the system.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Display {
    /// The name of the display.
    pub name: String,
    /// The display dimensions (width x height).
    #[serde(serialize_with = "serialize_dimensions")]
    pub dimensions: Dimensions,
    /// The scale factor of the display.
    pub scale_factor: f64,
    /// The top-left corner position of the monitor relative to the larger full screen area (x, y).
    #[serde(serialize_with = "serialize_position")]
    pub position: Position,
    /// The display's refresh rate in MHz.
    pub refresh_rate: Option<u32>,
}

/// Contains information of the displays connected to the system.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct DisplaysInfo {
    /// The total number of displays.
    pub total_displays: usize,
    /// The list of the displays.
    pub displays: Vec<Display>,
}

fn serialize_dimensions<S>(d: &Dimensions, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    serializer.serialize_str(&format!("{}x{}", d.width, d.height))
}

fn serialize_position<S>(p: &Position, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    serializer.serialize_str(&format!("({}, {})", p.x, p.y))
}

impl DisplaysInfo {
    /// Retrieves information about the displays connected to the system.
    pub fn get() -> Result<Self, CoreError> {
        // FIXME!: Similar to `crate::utils::gpu::opengl::OpenGLInfo::get()`, the event loop here panics as well when called multiple times. MUST BE FIXED.
        let event_loop = EventLoop::new().map_err(|e| CoreError::Error(e.into()))?;
        let (window, _) = SimpleWindowBuilder::new().build(&event_loop);
        let monitors: Vec<MonitorHandle> = window.available_monitors().collect();
        let total_displays = &monitors.len();
        let mut displays = Vec::with_capacity(*total_displays);

        for monitor in monitors {
            let name = monitor.name().unwrap_or("".into());
            let dimensions = monitor.size();
            let scale_factor = monitor.scale_factor();
            let position = monitor.position();
            let refresh_rate = monitor.refresh_rate_millihertz();

            displays.push(Display {
                name,
                dimensions: Dimensions {
                    width: dimensions.width,
                    height: dimensions.height,
                },
                scale_factor,
                position: Position {
                    x: position.x,
                    y: position.y,
                },
                refresh_rate,
            })
        }

        Ok(Self {
            total_displays: *total_displays,
            displays,
        })
    }
}
