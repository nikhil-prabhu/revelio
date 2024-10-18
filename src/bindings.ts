import {invoke} from "@tauri-apps/api/core";

/**
 * Bindings to Tauri commands from the Rust core.
 */
export const commands = {
    isReleaseProfile,
    getCpuInfo,
    getVulkanInfo,
    getOpenGLInfo,
    getDisplaysInfo,
    getDisksInfo,
    getNetworksInfo,
    getPlatformInfo,
};

/**
 * Contains information of a Vulkan device layer.
 */
export type VulkanDeviceLayer = {
    /** The layer's name */
    layerName: string;
    /** The layer's Vulkan version */
    vulkanVersion: string;
    /** The layer's version */
    layerVersion: string;
    /** The layer's description */
    description: String;
}

/**
 * Contains information of a Vulkan device.
 */
export type VulkanDevice = {
    /** The name of the device */
    deviceName: string;
    /** The device's vendor ID */
    vendorId: number;
    /** The layer's description */
    deviceId: number;
    /** The layer's description */
    deviceType: string;
    /** The layer's description */
    apiVersion: string;
    /** The layer's description */
    driverVersion: string;
    /** The layer's description */
    pipelineCacheUuid: string;
    /** The layer's description */
    layers: VulkanDeviceLayer[];
}

/**
 * Contains information about Vulkan on the system.
 */
export type VulkanInfo = {
    /** The total number of Vulkan-enabled devices */
    totalDevices: number;
    /** The list of Vulkan-enabled devices identified on the system */
    devices: VulkanDevice[];
}

/**
 * Contains information about OpenGL on the system.
 */
export type OpenGLInfo = {
    /** The OpenGL device vendor */
    vendor: string;
    /** The OpenGL renderer */
    renderer: string;
    /** The OpenGL version */
    version: string;
    /** The current free video memory on the OpenGL device */
    freeVideoMem: number;
}

/**
 * Represents an individual disk on the system.
 */
export type Disk = {
    /** The name of the disk */
    name: string;
    /** The file-system of the disk (Eg: `EXT4`, `NTFS`, etc.) */
    fileSystem: string;
    /** The mount point of the disk */
    mountPoint: string;
    /** The total space/size of the disk */
    totalSpace: number;
    /** The currently available space on the disk */
    availableSpace: number;
    /** The kind of disk */
    kind: string;
}

/**
 * Contains information of all the disks identified on the system.
 */
export type DisksInfo = {
    /** The total number of disks */
    count: number;
    /** The information of each disk */
    disks: Disk[];
}

/**
 * Contains information of a single logical processor.
 */
export type Cpu = {
    /** The CPU name */
    name: string;
    /** The CPU frequency */
    frequency: number;
}

/**
 * Contains information of the system's CPU/Processor.
 */
export type CpuInfo = {
    /** The CPU architecture */
    arch?: string;
    /** The vendor ID of the CPU */
    vendorId: string;
    /** The CPU brand */
    brand: string;
    /** The total number of CPU cores */
    physicalCoreCount?: number;
    /** The logical processors on the CPU */
    cpus: Cpu[];
}

/**
 * Represents an individual display attached to the system.
 */
export type Display = {
    /** The name of the display */
    name: string;
    /** The display dimensions (width x height) */
    dimensions: string;
    /** The scale factor of the display */
    scaleFactor: number;
    /** The top-left corner position of the monitor relative to the larger full screen area (x, y) */
    position: string;
    /** The display's refresh rate in MHz */
    refreshRate?: number;
}

/**
 * Contains information of the displays connected to the system.
 */
export type DisplaysInfo = {
    /** The total number of displays */
    totalDisplays: number;
    /** The list of displays */
    displays: Display[];
}

/**
 * Represents an individual network interface on the system.
 */
export type NetworkInterface = {
    /** The name of the interface */
    itfName: string;
    /** The MAC address of the interface */
    macAddr: string;
    /** The IP networks belonging to the interface */
    ipNetworks: string[];
}

/**
 * Contains information of the networks and network interfaces on the system.
 */
export type NetworksInfo = {
    /** The total number of network interfaces */
    totalInterfaces: number;
    /** The list of network interfaces */
    interfaces: NetworkInterface[];
}

/**
 * Information that's common across all supported platforms.
 */
export interface PlatformInfoCommon {
    /** The current platform (Windows/macOS/Linux) */
    platform: string;
    /** The hostname of the system */
    hostname: string;
    /** The OS' architecture */
    osArch: string;
    /** The current kernel version */
    kernel: string;
}

/**
 * Contains information about the current Linux distribution.
 */
export interface LinuxInfo extends PlatformInfoCommon {
    /** An identifier that describes the distribution's release */
    id: string;
    /** Identifier of the original upstream OS that this distribution is derived from */
    idLike: string;
    /** The name of this release, without the version string */
    name: string;
    /** The name of this release, with the version string */
    prettyName: string;
    /** The version of this OS release */
    version: string;
    /** The version of this OS release, along with additional details about the release */
    versionId: string;
    /** The codename of this version */
    versionCodename: string;
    /** The current graphics platform (X11/Wayland) */
    graphicsPlatform: string;
}

/**
 * Contains information of the current platform.
 */
export type PlatformInfo = PlatformInfoCommon | LinuxInfo;

/**
 * The kind of error from the core library.
 */
export enum CoreErrorKind {
    /** Error while retrieving CPU info */
    CPUInfoError,
    /** Error while retrieving Vulkan info */
    VulkanInfoError,
    /** Generic error */
    Error,
}

/**
 * Custom error type for errors encountered while gathering system information.
 */
export class CoreError extends Error {
    public kind: CoreErrorKind;

    constructor(message: string, kind: CoreErrorKind) {
        super(message);
        this.kind = kind;
    }
}

/**
 * Checks if the app is running in the release profile.
 *
 * @export
 * @async
 * @returns {Promise<boolean>} Resolves to whether the app is running in the release profile.
 */
export async function isReleaseProfile(): Promise<boolean> {
    return await invoke("is_release_profile");
}

/**
 * Retrieves CPU information from the system.
 *
 * @export
 * @async
 * @returns {Promise<CpuInfo>} Resolves to the CPU information.
 * @throws {CoreError} If gathering CPU information fails.
 */
export async function getCpuInfo(): Promise<CpuInfo> {
    return await invoke("get_cpu_info");
}

/**
 * Retrieves disk(s) information from the system.
 *
 * @export
 * @async
 * @returns {Promise<CpuInfo>} Resolves to the disk(s) information.
 * @throws {CoreError} If gathering disk(s) information fails.
 */
export async function getDisksInfo(): Promise<DisksInfo> {
    return await invoke("get_disks_info");
}

/**
 * Retrieves Vulkan information from the system.
 *
 * @export
 * @async
 * @returns {Promise<CpuInfo>} Resolves to the Vulkan information.
 * @throws {CoreError} If gathering Vulkan information fails.
 */
export async function getVulkanInfo(): Promise<VulkanInfo> {
    return await invoke("get_vulkan_info");
}

/**
 * Retrieves the OpenGL information from the system.
 *
 * FIXME!: calling this function currently causes the core of the application to freeze and eventually crash. DO NOT USE!!!
 *
 * @export
 * @async
 * @returns {Promise<OpenGLInfo>} Resolves to the OpenGL information.
 * @throws {CoreError} If gathering OpenGL information fails.
 */
export async function getOpenGLInfo(): Promise<OpenGLInfo> {
    return await invoke("get_opengl_info");
}

/**
 * Retrieves information about the displays connected to the system.
 *
 * FIXME!: calling this function currently causes the core of the application to freeze and eventually crash. DO NOT USE!!!
 *
 * @export
 * @async
 * @returns {Promise<DisplaysInfo>} Resolves to the displays information.
 * @throws {CoreError} If gathering displays information fails.
 */
export async function getDisplaysInfo(): Promise<DisplaysInfo> {
    return await invoke("get_displays_info");
}

/**
 * Retrieves network(s) information from the system.
 *
 * @export
 * @async
 * @returns {Promise<NetworksInfo>} Resolves to the network(s) information.
 */
export async function getNetworksInfo(): Promise<NetworksInfo> {
    return await invoke("get_networks_info");
}

// FIXME!: handle platform-specific information.
/**
 * Retrieves platform information from the system.
 *
 * @export
 * @async
 * @returns {Promise<PlatformInfo>} Resolves to the platform information.
 * @throws {CoreError} If gathering platform information fails.
 */
export async function getPlatformInfo(): Promise<PlatformInfo> {
    return await invoke("get_platform_info");
}
