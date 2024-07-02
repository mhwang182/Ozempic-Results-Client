import { useEffect, useRef } from "react"
import { usePostsContext } from "../../context/PostsContext"
import PostContent from "../Posts/PostContent";
import { useIntersection } from "@mantine/hooks";
import LoadingSpinner from "../Common/LoadingSpinner";
import { useReviewsContext } from "../../context/ReviewsContext";
import ReviewPreview from "../Reviews/ReviewPreview";
import { Link } from "react-router-dom";
import HomePageSkeleton from "../LoadingSkeletons/HomePageSkeleton";
import { Post } from "../../utils/contants";
import SignUpTile from "../Common/SignUpTile";
import { useUserAuthContext } from "../../context/UserAuthContext";
import React from "react";

const HomePage = () => {

    const {
        feedPosts,
        loadFeedPosts,
        isFeedLoading,
        atFeedEnd
    } = usePostsContext();

    const { token } = useUserAuthContext();
    const { feedReviews, isLoadingFeedReviews } = useReviewsContext();

    const lastPostRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    })

    const Post = (props: { post: Post, ref?: any }) => {

        const { post, ref } = props;

        return (
            <div className="border border-gray-300 rounded-md overflow-hidden shadow-md w-full" ref={ref}>
                <PostContent post={post} clickable />
            </div>
        )
    }

    useEffect(() => {
        const load = async () => {
            if (entry?.isIntersecting) {
                loadFeedPosts(feedPosts);
            }
        }
        load();

    }, [entry, loadFeedPosts, feedPosts])

    const isHomePageLoading = (isFeedLoading && feedPosts.length === 0) || isLoadingFeedReviews;

    return (
        <>{isHomePageLoading ?
            <HomePageSkeleton /> :
            <div className="bg-zinc-50 min-h-screen">
                <div className="flex flex-row justify-center pt-5">
                    <div className="max-w-md  w-full mx-5">
                        <div className="flex flex-col ml-0 space-y-5 w-full">
                            {feedPosts && feedPosts.map((post, index) => {
                                if (index === feedPosts.length - 1) {
                                    return (
                                        <React.Fragment key={post._id}>
                                            <Post post={post} key={post._id} />
                                            {!isFeedLoading && !atFeedEnd && <div className="invisible" ref={ref} />}
                                        </React.Fragment>)
                                }
                                return <Post post={post} key={post._id} />
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