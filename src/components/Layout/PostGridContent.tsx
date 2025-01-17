import { Blurhash } from "react-blurhash"
import { useLocation, useNavigate } from "react-router-dom"
import { usePostsContext } from "../../context/PostsContext"
import { Post, parseBlurHash } from "../../utils/contants"
import { CameraIcon } from "../../svgs/svgs"
import { useUserAuthContext } from "../../context/UserAuthContext"
import LoadingSpinner from "../Common/LoadingSpinner"

const PostGridContent = () => {

    const location = useLocation();
    const { userPosts, isUserPostsLoading, deletePost, loadFeedPosts } = usePostsContext();
    const { token } = useUserAuthContext();
    const navigate = useNavigate();

    const PostPreview = ({ post }: { post: Post }) => {
        return (
            <div className="aspect-square border rounded-md size-full overflow-hidden">
                <div className="relative size-full flex justify-end group">
                    <button
                        className="group-hover:opacity-100 hover:brightness-95 opacity-0 absolute z-30 bg-sky-600 p-2 rounded-md text-white mt-2 mr-2 font-semibold"
                        onClick={async () => {
                            if (token) {
                                await deletePost(post._id);
                                loadFeedPosts([], false);
                            }
                        }}
                    >
                        Delete
                    </button>
                    <div className="absolute size-full">
                        <Blurhash width={'100%'} height={'100%'} hash={parseBlurHash(post.beforeImageId)} />
                    </div>
                    <img
                        className="aspect-square cursor-pointer rounded-md object-cover object-top absolute"
                        loading="lazy"
                        fetchPriority="high"
                        src={post.beforeImageUrl}
                        alt=""
                        onClick={() => {
                            navigate(`/post/${post._id}`, { state: { previousLocation: location, post } })
                        }}
                    />
                </div>
            </div>

        )
    }

    return <>
        {userPosts && userPosts.length > 0 ?
            <div className="grid grid-cols-2 sm:grid-cols-3 grid-flow-row gap-0.5 mt-3">
                {userPosts.map((post: any) => {
                    return (
                        <PostPreview post={post} />
                    )
                })}
            </div> : <> {isUserPostsLoading ?
                <div className="w-full h-full flex justify-center items-center">
                    <div className="h-24 w-24">
                        <LoadingSpinner />
                    </div>
                </div> :
                <div className="w-full border-t border-gray-300 h-full flex flex-col justify-center items-center">
                    <CameraIcon />
                    <p className="w-fit text-4xl font-semibold">No Posts</p>
                </div>
            }
            </>
        }
    </>
}

export default PostGridContent