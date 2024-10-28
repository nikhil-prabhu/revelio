// Brand logos.
import amdLight from "./assets/images/light/amd.svg";
import amdDark from "./assets/images/dark/amd.svg";
import nvidia from "./assets/images/nvidia.svg";
import intelLight from "./assets/images/light/intel.svg";
import intelDark from "./assets/images/dark/intel.svg";
import unknownLight from "./assets/images/light/unknown.svg";
import unknownDark from "./assets/images/dark/unknown.svg";
import appleLight from "./assets/images/light/apple.svg";
import appleDark from "./assets/images/dark/apple.svg";

// Graphics Library logos.
import vulkan from "./assets/images/vulkan.svg";
import openGL from "./assets/images/opengl.svg";
import metal from "./assets/images/metal_2.svg";
import directxLight from "./assets/images/light/directx.svg";
import directxDark from "./assets/images/dark/directx.svg";

// CPU logos.
import amdRyzenLight from "./assets/images/light/amd-ryzen.svg";
import amdRyzenDark from "./assets/images/dark/amd-ryzen.svg";
import amdAthlonLight from "./assets/images/light/amd-athlon.svg";
import amdAthlonDark from "./assets/images/dark/amd-athlon.svg";
import intelCore from "./assets/images/intel-core.svg";
import intelPentium from "./assets/images/intel-pentium.svg";
import intelXeon from "./assets/images/intel-xeon.svg";

// GPU logos.
import amdRadeon from "./assets/images/amd-radeon.png";
import nvidiaGeforceRtx from "./assets/images/nvidia-geforce-rtx.svg";
import nvidiaGeforceGtx from "./assets/images/nvidia-geforce-gtx.svg";
import intelArc from "./assets/images/intel-arc.webp";
import intelIrisXe from "./assets/images/intel-iris-xe.svg";
import intelIrisXeMax from "./assets/images/intel-iris-xe-max.svg";
import intelGraphics from "./assets/images/intel-graphics.webp";
import appleM4 from "./assets/images/apple-m4.webp";
import appleM3 from "./assets/images/apple-m3.webp";
import appleM3Pro from "./assets/images/apple-m3-pro.webp";
import appleM3Max from "./assets/images/apple-m3-max.webp";
import appleM2 from "./assets/images/apple-m2.webp";
import appleM2Ultra from "./assets/images/apple-m2-ultra.webp";
import appleM2Pro from "./assets/images/apple-m2-pro.webp";
import appleM2Max from "./assets/images/apple-m2-max.webp";
import appleM1 from "./assets/images/apple-m1.webp";
import appleM1Ultra from "./assets/images/apple-m1-ultra.webp";
import appleM1Pro from "./assets/images/apple-m1-pro.webp";
import appleM1Max from "./assets/images/apple-m1-max.webp";
import llvm from "./assets/images/llvm.svg";
import microsoft from "./assets/images/microsoft.svg";

// Platform logos.
import windows10 from "./assets/images/windows10.svg";
import windows11 from "./assets/images/windows11.svg";
import macOSLight from "./assets/images/light/macos.svg";
import macOSDark from "./assets/images/dark/macos.svg";
import macOSBigSur from "./assets/images/macos-big-sur.webp";
import macOSMonterey from "./assets/images/macos-monterey.webp";
import macOSVentura from "./assets/images/macos-ventura.webp";
import macOSSonoma from "./assets/images/macos-sonoma.webp";
import macOSSequoia from "./assets/images/macos-sequoia.webp";
import linux from "./assets/images/linux.svg";

// Linux distribution logos.
import archlinux from "./assets/images/archlinux.svg";
import opensuse from "./assets/images/opensuse.svg";
import opensuseLeap from "./assets/images/opensuse-leap.svg";
import opensuseTumbleweed from "./assets/images/opensuse-tumbleweed.svg";
import fedora from "./assets/images/fedora.svg";
import ubuntu from "./assets/images/ubuntu.svg";
import manjaro from "./assets/images/manjaro.svg";
import linuxMint from "./assets/images/linuxmint.svg";
import debian from "./assets/images/debian.svg";

// Linux desktop environment logos.
import kde from "./assets/images/kde.svg";
import gnomeLight from "./assets/images/light/gnome.svg";
import gnomeDark from "./assets/images/dark/gnome.svg";
import xfce from "./assets/images/xfce.svg";

// Linux graphics platform logos.
import wayland from "./assets/images/wayland.svg";
import x11Light from "./assets/images/light/x11.svg";
import x11Dark from "./assets/images/dark/x11.svg";

// UNIX shell logos.
import bash from "./assets/images/bash.svg";
import zshLight from "./assets/images/light/zsh.svg";
import zshDark from "./assets/images/dark/zsh.svg";

/**
 * The logo variant based on the current theme ("light" or "dark").
 */
export type Variant = "light" | "dark";

function getVariant(variant: Variant, lightIcon: string, darkIcon: string) {
  if (variant === "dark") {
    return darkIcon;
  }

  return lightIcon;
}

/**
 * Retrieves the appropriate Apple Silicon logo for the specified device name.
 *
 * @param deviceName The device name.
 * @returns {string} The URL for the logo image source.
 */
function getAppleSiliconLogo(deviceName: string): string {
  if (/\bm4\b/.test(deviceName)) {
    return appleM4;
  }

  if (/\bm3\b/.test(deviceName)) {
    if (/\bmax\b/.test(deviceName)) {
      return appleM3Max;
    }

    if (/\bpro\b/.test(deviceName)) {
      return appleM3Pro;
    }

    return appleM3;
  }

  if (/\bm2\b/.test(deviceName)) {
    if (/\bultra\b/.test(deviceName)) {
      return appleM2Ultra;
    }

    if (/\bmax\b/.test(deviceName)) {
      return appleM2Max;
    }

    if (/\bpro\b/.test(deviceName)) {
      return appleM2Pro;
    }

    return appleM2;
  }

  if (/\bultra\b/.test(deviceName)) {
    return appleM1Ultra;
  }

  if (/\bmax\b/.test(deviceName)) {
    return appleM1Max;
  }

  if (/\bpro\b/.test(deviceName)) {
    return appleM1Pro;
  }

  return appleM1;
}

/**
 * Retrieves the appropriate macOS logo for the specified macOS version.
 *
 * @export
 * @param macOSVersion The macOS version.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getMacOSLogo(
  macOSVersion: string,
  variant: Variant = "light",
): string {
  if (/\b11\.\d+\.\d+$/.test(macOSVersion)) {
    return macOSBigSur;
  }

  if (/\b12\.\d+\.\d+$/.test(macOSVersion)) {
    return macOSMonterey;
  }

  if (/\b13\.\d+\.\d+$/.test(macOSVersion)) {
    return macOSVentura;
  }

  if (/\b14\.\d+\.\d+$/.test(macOSVersion)) {
    return macOSSonoma;
  }

  if (/\b15\.\d+\.\d+$/.test(macOSVersion)) {
    return macOSSequoia;
  }

  return getVariant(variant, macOSLight, macOSDark);
}

/**
 * Retrieves the Linux distribution logo for the specified ID.
 *
 * @export
 * @param id The distribution ID.
 * @param _variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getLinuxLogo(id: string, _variant: Variant = "light"): string {
  id = id.toLowerCase();

  if (id.includes("opensuse")) {
    if (id.includes("leap")) {
      return opensuseLeap;
    }

    if (id.includes("tumbleweed")) {
      return opensuseTumbleweed;
    }

    return opensuse;
  }

  if (id === "fedora") {
    return fedora;
  }

  if (id === "ubuntu") {
    return ubuntu;
  }

  if (id === "arch") {
    return archlinux;
  }

  // TODO: find and match against exact ID.
  if (id.includes("manjaro")) {
    return manjaro;
  }

  // TODO: find and match against exact ID.
  if (id.includes("mint")) {
    return linuxMint;
  }

  if (id === "debian") {
    return debian;
  }

  return linux;
}

/**
 * Retrieves the logo for the specified Linux desktop environment.
 *
 * @export
 * @param desktop The desktop environment name.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getLinuxDesktopLogo(
  desktop: string,
  variant: Variant = "light",
): string {
  desktop = desktop.toLowerCase();

  if (desktop.includes("kde")) {
    return kde;
  }

  if (desktop.includes("gnome")) {
    return getVariant(variant, gnomeLight, gnomeDark);
  }

  if (desktop.includes("xfce")) {
    return xfce;
  }

  return getVariant(variant, unknownLight, unknownDark);
}

/**
 * Retrieves the logo for the specified Linux graphics platform.
 *
 * @export
 * @param graphicsPlatform The graphics platform name.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getLinuxGraphicsPlatformLogo(
  graphicsPlatform: string,
  variant: Variant = "light",
): string {
  graphicsPlatform = graphicsPlatform.toLowerCase();

  if (graphicsPlatform === "wayland") {
    return wayland;
  }

  if (graphicsPlatform === "x11") {
    return getVariant(variant, x11Light, x11Dark);
  }

  return getVariant(variant, unknownLight, unknownDark);
}

/**
 * Retrieves the logo for the specified UNIX shell.
 *
 * @export
 * @param shell The shell name.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getUnixShellLogo(
  shell: string,
  variant: Variant = "light",
): string {
  shell = shell.toLowerCase();

  if (shell === "bash") {
    return bash;
  }

  if (shell === "zsh") {
    return getVariant(variant, zshLight, zshDark);
  }

  return getVariant(variant, unknownLight, unknownLight);
}

/**
 * Retrieves the vendor icon for the specified vendor ID.
 *
 * @param vendorId The ID of the vendor.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getVendorLogo(
  vendorId: string,
  variant: Variant = "light",
): string {
  if (vendorId.includes("AMD")) {
    return getVariant(variant, amdLight, amdDark);
  }

  if (/\bnvidia\b/.test(vendorId.toLowerCase())) {
    return nvidia;
  }

  if (vendorId.toLowerCase().includes("intel")) {
    return getVariant(variant, intelLight, intelDark);
  }

  if (/\bapple\b/.test(vendorId.toLowerCase())) {
    return getVariant(variant, appleLight, appleDark);
  }

  if (/\bllvm\b/.test(vendorId.toLowerCase())) {
    return llvm;
  }

  if (/\bmicrosoft\b/.test(vendorId.toLowerCase())) {
    return microsoft;
  }

  return getVariant(variant, unknownLight, unknownDark);
}

/**
 * Retrieves the logo for the specified graphics library.
 *
 * @export
 * @param libName The name of the graphics library.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getGraphicsLibLogo(
  libName: string,
  variant: Variant = "light",
): string {
  libName = libName.toLowerCase();

  if (libName === "vulkan") {
    return vulkan;
  }

  if (libName === "opengl") {
    return openGL;
  }

  if (libName === "metal") {
    return metal;
  }

  if (libName === "directx") {
    return getVariant(variant, directxLight, directxDark);
  }

  return getVariant(variant, unknownLight, unknownDark);
}

/**
 * Retrieves the logo for the specified CPU brand.
 *
 * @export
 * @param cpuBrand The CPU brand.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getCpuLogo(
  cpuBrand: string,
  variant: Variant = "light",
): string {
  cpuBrand = cpuBrand.toLowerCase();

  // Add separate logos for older AMD processors (Athlon, etc.).
  if (/\bamd\b/.test(cpuBrand)) {
    if (cpuBrand.includes("ryzen")) {
      return getVariant(variant, amdRyzenLight, amdRyzenDark);
    }

    if (cpuBrand.includes("athlon")) {
      return getVariant(variant, amdAthlonLight, amdAthlonDark);
    }

    return getVariant(variant, amdLight, amdDark);
  }

  // Add separate logos for older Intel processors (Pentium, etc.).
  if (/\bintel\b/.test(cpuBrand)) {
    if (cpuBrand.includes("core")) {
      return intelCore;
    }

    if (cpuBrand.includes("pentium")) {
      return intelPentium;
    }

    if (cpuBrand.includes("xeon")) {
      return intelXeon;
    }

    return getVariant(variant, intelLight, intelDark);
  }

  if (/\bapple\b/.test(cpuBrand)) {
    return getAppleSiliconLogo(cpuBrand);
  }

  return getVariant(variant, unknownLight, unknownDark);
}

/**
 * Retrieves the logo for the specified GPU device name.
 *
 * @export
 * @param deviceName The name of the device.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getGpuLogo(
  deviceName: string,
  variant: Variant = "light",
): string {
  deviceName = deviceName.toLowerCase();

  if (/\bradeon\b/.test(deviceName)) {
    return amdRadeon;
  }

  if (/\bgeforce\b/.test(deviceName)) {
    if (/\brtx\b/.test(deviceName)) {
      return nvidiaGeforceRtx;
    }

    return nvidiaGeforceGtx;
  }

  if (/\bintel\b/.test(deviceName)) {
    if (/\barc\b/.test(deviceName)) {
      return intelArc;
    }

    if (/\biris\b/.test(deviceName)) {
      if (deviceName.includes("max")) {
        return intelIrisXeMax;
      }

      return intelIrisXe;
    }

    return intelGraphics;
  }

  if (/\bapple\b/.test(deviceName)) {
    return getAppleSiliconLogo(deviceName);
  }

  if (/\bllvm\b/.test(deviceName)) {
    return llvm;
  }

  if (/\bmicrosoft\b/.test(deviceName)) {
    return microsoft;
  }

  return getVariant(variant, unknownLight, unknownDark);
}

export function getPlatformLogo(
  platform: string,
  variant: Variant = "light",
): string {
  platform = platform.toLowerCase();

  if (/\bwindows\b/.test(platform)) {
    if (platform.includes("11")) {
      return windows11;
    }

    return windows10;
  }

  if (/\bmacos\b/.test(platform)) {
    return getMacOSLogo(platform, variant);
  }

  if (/\blinux\b/.test(platform)) {
    return linux;
  }

  return getVariant(variant, unknownLight, unknownDark);
}

/**
 * Formats numerical bytes to a human-readable string.
 *
 * @export
 * @param bytes The bytes value.
 * @param decimals The numeric precision.
 * @returns {string} The formatted size.
 */
export function formatBytes(bytes?: number, decimals: number = 2): string {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

/**
 * Formats numerical bytes per second rate to a human-readable string.
 *
 * @export
 * @param bytesPerSecond The bytes per second rate.
 * @param decimals The numeric precision.
 * @returns {string} The formatted bytes per second rate.
 */
export function formatBytesPerSecond(
  bytesPerSecond: number,
  decimals: number = 2,
): string {
  const units = ["B/s", "KB/s", "MB/s", "GB/s", "TB/s"];
  let index = 0;
  let value = bytesPerSecond;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }

  // Round to two decimal places and format the result
  return `${value.toFixed(decimals)} ${units[index]}`;
}

// Example usage
const formatted = formatBytesPerSecond(1500); // Output: "1.46 KB/s"
console.log(formatted);
