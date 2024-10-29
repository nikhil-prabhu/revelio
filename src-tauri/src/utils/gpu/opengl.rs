use std::sync::LazyLock;

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

static OPENGL_INFO: LazyLock<Result<OpenGLInfo, String>> = LazyLock::new(|| {
    // FIXME: This still causes a panic, although it's now a segmentation fault rather than a `RecreationAttempt` error.
    let event_loop = EventLoop::new().map_err(|e| format!("failed to create event loop: {}", e))?;
    let (_, display) = SimpleWindowBuilder::new().build(&event_loop);

    let vendor = display.get_opengl_renderer_string().to_string();
    let renderer = display.get_opengl_renderer_string().to_string();
    let version = display.get_opengl_version_string().to_string();
    let free_video_mem = display.get_free_video_memory();

    Ok(OpenGLInfo {
        vendor,
        renderer,
        version,
        free_video_mem,
    })
});

impl OpenGLInfo {
    /// Retrieves the OpenGL information from the system.
    pub fn get() -> Result<Self, CoreError> {
        OPENGL_INFO
            .clone()
            .map_err(|e| CoreError::OpenGLInfoError(e.into()))
    }
}
