use glium::backend::glutin::SimpleWindowBuilder;
use glium::winit::event_loop::EventLoop;
use serde::Serialize;

use crate::types::CoreError;

/// Contains information about OpenGL on the system.
#[derive(Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct OpenGLInfo {
    /// The OpenGL device vendor.
    pub vendor: String,
    /// The OpenGL renderer.
    pub renderer: String,
    /// The OpenGL version.
    pub version: String,
    /// The current free video memory on the OpenGL device.
    pub free_video_mem: Option<usize>,
}

impl OpenGLInfo {
    /// Retrieves the OpenGL information from the system.
    #[allow(dead_code)]
    pub fn get() -> Result<Self, CoreError> {
        // FIXME!: Currently, the following line panics when `Self::get()` is called more than once, and I can't be arsed to fix it right now.
        let event_loop = EventLoop::new().unwrap();
        let (_, display) = SimpleWindowBuilder::new().build(&event_loop);

        let vendor = display.get_opengl_renderer_string().to_string();
        let renderer = display.get_opengl_renderer_string().to_string();
        let version = display.get_opengl_version_string().to_string();
        let free_video_mem = display.get_free_video_memory();

        display.finish();

        Ok(Self {
            vendor,
            renderer,
            version,
            free_video_mem,
        })
    }
}
