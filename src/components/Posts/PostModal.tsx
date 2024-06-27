import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePostsContext } from "../../context/PostsContext";
import PostContent from "./PostContent";
import { Post } from "../../utils/contants";

const PostModal = ({ onClose }: { onClose: () => void }) => {

    const { id } = useParams();

    const { userPosts, feedPosts } = usePostsContext();

    const [post, setPost] = useState(undefined as Post | undefined);

    useEffect(() => {
        //TODO: move to context
        let postData = userPosts.find(post => { return post._id === `${id}` });
        if (!postData) {
            postData = feedPosts.find(post => { return post._id === `${id}` });
        }

        if (postData) {
            setPost(postData);
        }
    }, [id, userPosts, feedPosts])

    useEffect(() => {
        console.log(post);
    }, [post])

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full justify-center items-center text-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left 
                                        shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-[500px] w-full
                                        min-h-[600px] mx-5">
                            {post && <PostContent post={post} onClose={onClose} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostModal