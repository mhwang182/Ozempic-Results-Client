import Compressor from 'compressorjs';

export const compressImage = (image: File): File | Blob => {

    let result: File | Blob = image;
    new Compressor(image, {
        quality: 0.8,
        success: (compressedImage) => {
            result = compressedImage
        }
    })
    return result
}