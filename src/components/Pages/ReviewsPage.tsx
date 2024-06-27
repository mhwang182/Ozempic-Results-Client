import { useIntersection } from "@mantine/hooks";
import { useReviewsContext } from "../../context/ReviewsContext"
import ReviewPreview from "../Reviews/ReviewPreview";
import { useEffect, useRef } from "react";
import LoadingSpinner from "../Common/LoadingSpinner";
import ReviewPageSkeleton from "../LoadingSkeletons/ReviewPageSkeleton";

const ReviewsPage = () => {

    const { feedReviews, isLoadingFeedReviews, loadFeedReviews } = useReviewsContext();

    const lastReviewRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastReviewRef.current,
        threshold: 1
    });

    useEffect(() => {
        if (entry?.isIntersecting) {
            loadFeedReviews(feedReviews);
        }
    }, [entry, loadFeedReviews, feedReviews]);


    return (
        <>
            {isLoadingFeedReviews && feedReviews.length === 0 ?
                <ReviewPageSkeleton /> :
                <div className="bg-zinc-50 size-full">
                    <div className="size-full flex flex-col p-4 space-y-4 items-center overflow-y-scroll">
                        {feedReviews.map((review, index) => {
                            if (index < (feedReviews.length - 1)) {
                                return <div className="w-full max-w-[900px]">
                                    <ReviewPreview data={review} showUserName hoverable />
                                </div>
                            }
                            return <div className="w-full max-w-[900px]">
                                <ReviewPreview data={review} showUserName hoverable />
                                <div className="invisible" ref={ref}>last element</div>
                            </div>

                        })}
                        {isLoadingFeedReviews && <div className="w-full">
                            <div className="w-16 h-16 mx-auto">
                                <LoadingSpinner />
                            </div>
                        </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default ReviewsPage