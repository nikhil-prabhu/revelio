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

// GPU logos.
import radeonLight from "./assets/images/light/radeon.svg";
import radeonDark from "./assets/images/dark/radeon.svg";
import geforceRtx from "./assets/images/geforce-rtx.svg";
import geforceGtx from "./assets/images/geforce-gtx.svg";
import arcLight from "./assets/images/light/intel-arc.svg";
import arcDark from "./assets/images/dark/intel-arc.svg";
import m4 from "./assets/images/apple-m4.webp";
import m3 from "./assets/images/apple-m3.webp";
import m3Pro from "./assets/images/apple-m3-pro.webp";
import m3Max from "./assets/images/apple-m3-max.webp";
import m2 from "./assets/images/apple-m2.webp";
import m2Ultra from "./assets/images/apple-m2-ultra.webp";
import m2Pro from "./assets/images/apple-m2-pro.webp";
import m2Max from "./assets/images/apple-m2-max.webp";
import m1Ultra from "./assets/images/apple-m1-ultra.webp";
import m1Pro from "./assets/images/apple-m1-pro.webp";
import m1 from "./assets/images/apple-m1.webp";
import m1Max from "./assets/images/apple-m1-max.webp";
import llvm from "./assets/images/llvm.svg";

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
 * @returns {string} The path to the vendor icon.
 */
export function getVendorIcon(vendorId: string, variant: Variant = "light"): string {
    vendorId = vendorId.toLowerCase();

    if (/\bamd\b/.test(vendorId)) {
        return getVariant(variant, amdLight, amdDark);
    }

    if (/\bnvidia\b/.test(vendorId)) {
        return nvidia;
    }

    if (/\bintel\b/.test(vendorId)) {
        return getVariant(variant, intelLight, intelDark);
    }

    if (/\bapple\b/.test(vendorId)) {
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
 * Retrieves the logo for the specified GPU device name.
 *
 * @export
 * @param deviceName The name of the device.
 * @param variant The variant of the logo for the current theme ("light" or "dark").
 * @returns {string} The URL for the logo image source.
 */
export function getGpuIcon(deviceName: string, variant: Variant = "light"): string {
    deviceName = deviceName.toLowerCase();

    if (/\bradeon\b/.test(deviceName)) {
        return getVariant(variant, radeonLight, radeonDark);
    }

    if (/\bgeforce\b/.test(deviceName)) {
        if (/\brtx\b/.test(deviceName)) {
            return geforceRtx;
        }

        return geforceGtx;
    }

    if (/\bintel\b/.test(deviceName)) {
        if (/\barc\b/.test(deviceName)) {
            return getVariant(variant, arcLight, arcDark);
        }
    }

    if (/\bapple\b/.test(deviceName)) {
        if (/\bm4\b/.test(deviceName)) {
            return m4;
        }

        if (/\bm3\b/.test(deviceName)) {
            if (/\bmax\b/.test(deviceName)) {
                return m3Max;
            }

            if (/\bpro\b/.test(deviceName)) {
                return m3Pro;
            }

            return m3;
        }

        if (/\bm2\b/.test(deviceName)) {
            if (/\bultra\b/.test(deviceName)) {
                return m2Ultra;
            }

            if (/\bmax\b/.test(deviceName)) {
                return m2Max;
            }

            if (/\bpro\b/.test(deviceName)) {
                return m2Pro;
            }

            return m2;
        }

        if (/\bm1\b/.test(deviceName)) {
            if (/\bultra\b/.test(deviceName)) {
                return m1Ultra;
            }

            if (/\bmax\b/.test(deviceName)) {
                return m1Max;
            }

            if (/\bpro\b/.test(deviceName)) {
                return m1Pro;
            }

            return m1;
        }
    }

    if (/\bllvm\b/.test(deviceName)) {
        return llvm;
    }

    return getVariant(variant, unknownLight, unknownDark);
}
