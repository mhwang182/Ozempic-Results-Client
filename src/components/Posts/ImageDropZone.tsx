import { useDropzone } from 'react-dropzone';
import { compressImage } from '../../utils/helpers';

interface IDropZoneProps {
    imageUrl: string | undefined,
    setFile: (file: File | Blob) => void
}

const ImageDropZone = ({ imageUrl, setFile }: IDropZoneProps) => {

    const { getInputProps, getRootProps, isFocused, isDragAccept } = useDropzone({
        onDrop: (files: File[]) => {
            let image = files[0];
            setFile(compressImage(image))
        },
        accept: {
            'image/jpeg': [],
            'image/png': []
        }
    });

    const focus = isFocused || isDragAccept;

    const ImageContent = () => {
        return (
            <div className='size-full relative'>
                <div className='size-full absolute z-10'
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                />
                <div className='size-full absolute backdrop-blur'
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    <div className="size-full backdrop-blur-md" />
                </div>
            </div>
        )
    }
    return (
        <>
            {imageUrl ?
                <ImageContent />
                :
                <div {...getRootProps({ isFocused })}
                    className={`border-2 border-dashed ${focus ? 'border-blue-400' : 'border-gray-300'} cursor-pointer p-4 flex justify-center bg-gray-100  rounded-md size-full`}
                >
                    <input {...getInputProps()} className='border' />
                    <p className='text-gray-400'>Drag n' drop files here or click to browse.</p>
                </div>
            }
        </>
    )
}

export default ImageDropZone