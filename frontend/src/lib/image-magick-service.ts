import { ImageMagick, initializeImageMagick, Percentage } from '@imagemagick/magick-wasm';
import magickWasm from '@imagemagick/magick-wasm/magick.wasm?url';

type ImageEditOptions = {
    rotate?: number; // Angle in degrees
    resize?: { width?: number; height?: number }; // Width and height for resizing
    brightness?: number; // Brightness adjustment (100 is neutral)
    contrast?: number; // Contrast adjustment, positive to increase, negative to decrease
    // Add more transformations here as needed
};

export async function editImage(file: Blob, options: ImageEditOptions): Promise<Blob> {
    await initializeImageMagick(new URL(magickWasm, import.meta.url));
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);

    return new Promise(resolve => {
        ImageMagick.read(data, image => {
            if (options.rotate !== undefined) {
                image.rotate(options.rotate);
            }

            if (options.resize) {
                const { width, height } = options.resize;
                image.resize(width || image.width, height || image.height);
            }

            if (options.brightness !== undefined || options.contrast !== undefined) {
                const brightness = options.brightness ?? 100;
                const contrast = options.contrast ?? 100;
                image.modulate(new Percentage(brightness), new Percentage(contrast), new Percentage(100));
            }

            image.write(data => {
                const blob = new Blob([data], { type: 'image/png' });
                resolve(blob);
            });
        });
    });
}
