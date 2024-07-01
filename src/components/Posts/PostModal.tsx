import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { usePostsContext } from "../../context/PostsContext";
import PostContent from "./PostContent";
import { Post } from "../../utils/contants";
import LoadingSpinner from "../Common/LoadingSpinner";
import { CloseIcon } from "../../svgs/svgs";

const PostModal = ({ onClose }: { onClose: () => void }) => {

    const { id } = useParams();
    const location = useLocation();

    const { loadPostById } = usePostsContext();

    const [post, setPost] = useState(undefined as Post | undefined);
    const [loadingPost, setLoadingPost] = useState(false);

    useEffect(() => {
        const getPost = async () => {
            if (!id) {
                return;
            }

            setLoadingPost(true);

            if (location.state && location.state?.post) {
                const { post } = location.state;
                setPost(post);
                setLoadingPost(false);
                return;
            }

            const postData = await loadPostById(id);

            if (postData) {
                setPost(postData);
            }

            setLoadingPost(false);
        }
        getPost()

    }, [id])

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full justify-center items-center text-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left 
                                        shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-[500px] w-full
                                        min-h-[600px] h-fit mx-5">
                            {loadingPost ?
                                <div className="w-full min-h-[600px] flex justify-center items-center">
                                    <div className="h-20 w-20">
                                        <LoadingSpinner />
                                    </div>
                                </div> :
                                <>{post ?
                                    <PostContent post={post} onClose={onClose} /> :
                                    <div className="bg-white py-3 flex flex-col space-y-3 items-center rounded-md">
                                        <div className={`w-full px-3 flex flex-row justify-end`}>
                                            <button
                                                onClick={onClose}
                                                className=""
                                            >
                                                <CloseIcon />
                                            </button>
                                        </div>
                                        <div className="font-semibold">Post Not Found</div>
                                    </div>
                                }</>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostModal