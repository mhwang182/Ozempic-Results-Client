import { useMemo, useRef, useState } from 'react';
import ImageDropZone from './ImageDropZone';
import { usePostsContext } from '../../context/PostsContext';
import { CloseIcon } from '../../svgs/svgs';
import { MedicationOptions, SelectOption } from '../../utils/contants';
import { SubmitHandler } from 'react-hook-form';
import NewPostForm from './NewPostForm';

const NewPostModal = ({ onClose }: { onClose: () => void }) => {

    const [beforeImage, setBeforeImage] = useState(null as File | null);
    const [afterImage, setAfterImage] = useState(null as File | null);
    const [page, setPage] = useState(0);
    const [uploadLoading, setUploadLoading] = useState(false);
    const { uploadPost } = usePostsContext();

    const { loadFeedPosts, resetFeedEnd } = usePostsContext();

    const submitForm = useRef<HTMLFormElement>(null)

    const onFormSubmit: SubmitHandler<{
        weightLost: string,
        medicationUsed: SelectOption,
        caption: string
    }> = async (data) => {
        if (beforeImage && afterImage) {
            setUploadLoading(true);
            await uploadPost(
                beforeImage,
                afterImage,
                {
                    weightLost: parseInt(data.weightLost),
                    medicationUsed: MedicationOptions[data.medicationUsed.value].OfficialName,
                    caption: data.caption
                }
            )
            resetFeedEnd();
            loadFeedPosts([], false);
            setUploadLoading(false);
        }
        onClose();
    }

    const onPost = () => {
        submitForm.current && submitForm.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }

    const headers = [
        'Choose Before Picture:',
        'Choose After Picture:',
        'Add Post Details'
    ];

    const setFile = (file: any) => {
        if (page === 0) setBeforeImage(file);
        if (page === 1) setAfterImage(file);
    }

    const hasImage = page < 2 && [beforeImage, afterImage][page];

    const beforeImageUrl = useMemo(() => beforeImage ? URL.createObjectURL(beforeImage) : undefined, [beforeImage]);
    const afterImageUrl = useMemo(() => afterImage ? URL.createObjectURL(afterImage) : undefined, [afterImage]);

    return (
        <div className="relative z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full justify-center items-center p-4 text-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left 
                                        shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-[500px] w-full
                                        min-h-fit
                                        ">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex flex-col space-y-4 items-center">
                                <div className="w-full flex flex-row justify-between">
                                    <button
                                        onClick={onClose}
                                        className=""
                                    >
                                        <CloseIcon />
                                    </button>
                                    {page >= 2 ?
                                        <button
                                            onClick={() => { onPost() }}
                                            className="py-1 px-2 rounded-md font-semibold bg-gradient-to-r from-sky-500 to-teal-500 text-white"
                                        >
                                            Post
                                        </button>
                                        : null
                                    }

                                </div>
                                <h2 className='w-full font-semibold'>{headers[page]} </h2>
                                <div className='w-full h-[400px]'>
                                    {page < 2 ?

                                        <ImageDropZone imageUrl={[beforeImageUrl, afterImageUrl][page]} setFile={setFile} />
                                        : null}
                                    {page >= 2 ?
                                        <NewPostForm
                                            onFormSubmit={onFormSubmit}
                                            submitFormRef={submitForm}
                                            isUploading={uploadLoading}
                                        />
                                        : null}
                                </div>
                                <div className='w-full flex justify-end space-x-2'>
                                    {page > 0 ? <button
                                        onClick={() => {
                                            setPage(page - 1)
                                        }}
                                        className="border py-1 px-2 rounded-md font-semibold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent"
                                    >
                                        Back
                                    </button> : null}
                                    {hasImage ? <button
                                        onClick={() => {
                                            setFile(null);
                                        }}
                                        className="border py-1 px-2 rounded-md font-semibold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent"
                                    >
                                        Replace
                                    </button> : null}
                                    {hasImage ? <button
                                        onClick={() => {
                                            setPage(page + 1)
                                        }}
                                        className="border py-1 px-2 rounded-md font-semibold bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent"
                                    >
                                        Next
                                    </button> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewPostModal