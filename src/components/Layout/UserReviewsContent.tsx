import { useReviewsContext } from "../../context/ReviewsContext"
import { useUserAuthContext } from "../../context/UserAuthContext"
import { DocIcon } from "../../svgs/svgs"
import { ReviewData } from "../../utils/contants"
import LoadingSpinner from "../Common/LoadingSpinner"
import ReviewPreview from "../Reviews/ReviewPreview"

const UserReviewsContent = (props: { reviews: ReviewData[] }) => {

    const { deleteReview, isLoadingUserReviews } = useReviewsContext();
    const { user } = useUserAuthContext();

    return <>
        {props.reviews && props.reviews.length > 0 ?
            <>
                <div className="w-full border-gray-300 h-full flex flex-col mt-2 space-y-2 ">
                    {props.reviews.map(review => {
                        return <div className="relative group">
                            <button
                                className="group-hover:opacity-100 hover:brightness-95 opacity-0 absolute z-30 bg-sky-600 p-2 rounded-md text-white mt-2 mr-2 font-semibold right-0"
                                onClick={() => {
                                    if (review._id && user.id) {
                                        deleteReview(review._id, user.id);
                                    }
                                }}
                            >
                                Delete
                            </button>
                            <ReviewPreview data={review} hoverable />
                        </div>
                    })}
                </div>
            </> :
            <> {isLoadingUserReviews ?
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-24 h-24">
                        <LoadingSpinner />
                    </div>
                </div> :
                <div className="w-full border-t border-gray-300 h-full flex flex-col justify-center items-center">
                    <DocIcon />
                    <p className="w-fit text-4xl font-semibold">No Reviews</p>
                </div>
            }
            </>
        }
    </>

}

export default UserReviewsContent