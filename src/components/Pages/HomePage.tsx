import { useEffect } from "react"
import { usePostsContext } from "../../context/PostsContext"
import PostContent from "../Posts/PostContent";
import LoadingSpinner from "../Common/LoadingSpinner";
import { useReviewsContext } from "../../context/ReviewsContext";
import ReviewPreview from "../Reviews/ReviewPreview";
import { Link } from "react-router-dom";
import HomePageSkeleton from "../LoadingSkeletons/HomePageSkeleton";
import { Post } from "../../utils/contants";
import SignUpTile from "../Common/SignUpTile";
import { useUserAuthContext } from "../../context/UserAuthContext";
import { useInView } from "react-intersection-observer";

const HomePage = () => {

    const {
        feedPosts,
        loadFeedPosts,
        isFeedLoading,
        atFeedEnd
    } = usePostsContext();

    const { token } = useUserAuthContext();
    const { feedReviews, isLoadingFeedReviews } = useReviewsContext();

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const Post = (props: { post: Post, ref?: any }) => {

        const { post, ref } = props;

        return (
            <div className="border border-gray-300 rounded-md overflow-hidden shadow-md w-full" ref={ref}>
                <PostContent post={post} clickable />
            </div>
        )
    }

    useEffect(() => {
        if (atFeedEnd) return;

        const load = async () => {
            if (inView) {
                loadFeedPosts(feedPosts, false);
            }
        }
        load();

    }, [inView])

    const isHomePageLoading = (isFeedLoading && feedPosts.length === 0) || isLoadingFeedReviews;

    return (
        <>{isHomePageLoading ?
            <HomePageSkeleton /> :
            <div className="bg-zinc-50 min-h-screen size-full">
                <div className="flex flex-row justify-center pt-5">
                    <div className="max-w-md w-full mx-5">
                        <div className="flex flex-col ml-0 space-y-5" >
                            {feedPosts && feedPosts.map((post, index) => {
                                if (index < feedPosts.length - 1) {
                                    return <Post post={post} key={post._id} />
                                }
                                return (
                                    <>
                                        <Post post={post} key={post._id} />
                                        <div ref={ref} className="h-2"></div>
                                    </>)
                            })}
                            {isFeedLoading && feedPosts && feedPosts.length > 0 && <div className="w-full p-3">
                                <div className="w-16 h-16 mx-auto">
                                    <LoadingSpinner />
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="flex-1 h-[70vh] max-w-[400px] sticky rounded-md hidden lg:flex lg:flex-col space-y-1 mr-5 top-0">
                        {(!token || token.length === 0) && <SignUpTile />}
                        {feedReviews &&
                            <div className="overflow-y-scroll flex-1">
                                <div className="size-full flex flex-col space-y-3">
                                    {feedReviews.slice(0, 6).map(review => {
                                        return <ReviewPreview data={review} showUserName hoverable key={review._id} />
                                    })}
                                    {feedReviews.length > 0 &&
                                        <Link to={'/reviews'}>
                                            <div>See More</div>
                                        </Link>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        }</>
    )

}

export default HomePage