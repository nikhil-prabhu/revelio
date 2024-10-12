// TODO: add more vendor and brand icons
import amdIcon from "./assets/amd-icon.svg";
import nvidiaIcon from "./assets/nvidia-icon.svg";
import intelIcon from "./assets/intel-icon.svg";
import unknownIcon from "./assets/unknown.svg";

import ryzenBrand from "./assets/ryzen-brand.svg";
import intelBrand from "./assets/intel-brand.svg";

/**
 * Map for vendors and their vendor icons.
 */
export const vendorIcons: Record<string, string> = {
    amd: amdIcon,
    intel: intelIcon,
    nvidia: nvidiaIcon,
};

/**
 * Map for brands and their brand icons.
 */
export const brandIcons: Record<string, string> = {
    ryzen: ryzenBrand,
    intel: intelBrand,
}

/**
 * Retrieves the vendor icon for the specified vendor ID.
 *
 * @param vendorId The ID of the vendor.
 * @returns {string} The path to the vendor icon.
 */
export function getVendorIcon(vendorId: string): string {
    for (const vendor in vendorIcons) {
        if (vendorId.toLowerCase().includes(vendor)) {
            return vendorIcons[vendor];
        }
    }

    return unknownIcon;
}

/**
 * Retrieves the brand icon for the specified brand.
 *
 * @param brand The brand.
 * @returns {string} The path to the brand icon.
 */
export function getBrandIcon(brand: string): string {
    for (const b in brandIcons) {
        if (brand.toLowerCase().includes(b)) {
            return brandIcons[b];
        }
    }

    return unknownIcon;
}
