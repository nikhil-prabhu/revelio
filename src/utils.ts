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
import amdRadeonLight from "./assets/images/light/amd-radeon.svg";
import amdRadeonDark from "./assets/images/dark/amd-radeon.svg";
import nvidiaGeforceRtx from "./assets/images/nvidia-geforce-rtx.svg";
import nvidiaGeforceGtx from "./assets/images/nvidia-geforce-gtx.svg";
import intelArcLight from "./assets/images/light/intel-arc.svg";
import intelArcDark from "./assets/images/dark/intel-arc.svg";
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
 * Retrieves the vendor icon for the specified vendor ID.
 *
 * @param vendorId The ID of the vendor.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getVendorLogo(vendorId: string, variant: Variant = "light"): string {
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
export function getGraphicsLibLogo(libName: string, variant: Variant = "light"): string {
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
export function getCpuLogo(cpuBrand: string, variant: Variant = "light"): string {
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
export function getGpuLogo(deviceName: string, variant: Variant = "light"): string {
    deviceName = deviceName.toLowerCase();

    if (/\bradeon\b/.test(deviceName)) {
        return getVariant(variant, amdRadeonLight, amdRadeonDark);
    }

    if (/\bgeforce\b/.test(deviceName)) {
        if (/\brtx\b/.test(deviceName)) {
            return nvidiaGeforceRtx;
        }

        return nvidiaGeforceGtx;
    }

    if (/\bintel\b/.test(deviceName)) {
        if (/\barc\b/.test(deviceName)) {
            return getVariant(variant, intelArcLight, intelArcDark);
        }
    }

    if (/\bapple\b/.test(deviceName)) {
        return getAppleSiliconLogo(deviceName);
    }

    if (/\bllvm\b/.test(deviceName)) {
        return llvm;
    }

    return getVariant(variant, unknownLight, unknownDark);
}

type OSType = {
    os: "Windows" | "macOS" | "Linux" | "Unknown";
    appleSilicon: boolean;
}

/**
 * Detects and returns the current operating system.
 *
 * @export
 * @returns {OSType} The operating system type.
 */
export function getOSType(): OSType {
    const userAgent = window.navigator.userAgent;

    if (userAgent.includes("Windows")) {
        return {os: "Windows", appleSilicon: false};
    }

    if (userAgent.includes("Mac OS X")) {
        if (userAgent.includes("Macintosh") && userAgent.includes("ARM")) {
            return {os: "macOS", appleSilicon: true};
        }

        return {os: "macOS", appleSilicon: false};
    }

    if (userAgent.includes("Linux")) {
        return {os: "Linux", appleSilicon: false};
    }

    return {os: "Unknown", appleSilicon: false}
}
