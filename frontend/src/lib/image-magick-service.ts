import { initializeImageMagick, ImageMagick, Percentage } from "@imagemagick/magick-wasm";
import magickWasm from "@imagemagick/magick-wasm/magick.wasm?url";

// Initialization function for ImageMagick
let isMagickInitialized = false; // Flag to check if ImageMagick is initialized

// Initialization function for ImageMagick
async function initMagick() {
    if (!isMagickInitialized) {
        await initializeImageMagick(new URL(magickWasm, import.meta.url));
        isMagickInitialized = true; // Set flag to true after initialization
    }
}

/**
 * Function to rotate an image
 */
export async function rotateImage(file: Blob, degrees: number): Promise<Blob> {
    await initMagick();
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);

    return new Promise((resolve, reject) => {
        try {
            ImageMagick.read(data, image => {
                image.rotate(degrees);
                image.write(outputData => {
                    const blob = new Blob([outputData], { type: "image/png" });
                    resolve(blob);
                });
            });
        } catch (error) {
            console.error("Failed to rotate image:", error);
            reject(error);
        }
    });
}

/**
 * Function to resize an image
 */
export async function resizeImage(file: Blob, width: number, height: number): Promise<Blob> {
    await initMagick();
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);

    return new Promise((resolve, reject) => {
        try {
            ImageMagick.read(data, image => {
                image.resize(width || image.width, height || image.height);
                image.write(outputData => {
                    const blob = new Blob([outputData], { type: "image/png" });
                    resolve(blob);
                });
            });
        } catch (error) {
            console.error("Failed to resize image:", error);
            reject(error);
        }
    });
}

/**
 * Function to adjust brightness
 */
export async function adjustBrightness(file: Blob, brightness: number): Promise<Blob> {
    await initMagick();
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);

    return new Promise((resolve, reject) => {
        try {
            ImageMagick.read(data, image => {
                image.modulate(new Percentage(brightness));
                image.write(outputData => {
                    const blob = new Blob([outputData], { type: "image/png" });
                    resolve(blob);
                });
            });
        } catch (error) {
            console.error("Failed to adjust brightness:", error);
            reject(error);
        }
    });
}
