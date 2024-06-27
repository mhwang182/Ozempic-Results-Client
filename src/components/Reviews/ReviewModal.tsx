import { useParams } from "react-router-dom";
import ModalBackground from "../Common/ModalBackground"
import { useReviewsContext } from "../../context/ReviewsContext";
import { useEffect, useState } from "react";
import { MedicationToTradeName, ReviewData, getDateString } from "../../utils/contants";
import { Rating } from "react-simple-star-rating";
import { CloseIcon } from "../../svgs/svgs";

const ReviewModal = (props: { onClose: () => void }) => {

    const [reviewData, setReviewData] = useState(undefined as ReviewData | undefined);
    const { id } = useParams();
    const { findReview, userReviews, feedReviews } = useReviewsContext();

    const { onClose } = props;

    useEffect(() => {
        if (!id) { return; }
        const data = findReview(id);
        console.log(data);
        setReviewData(data);
    }, [id, userReviews, feedReviews])

    const ReviewContent = (props: { data: ReviewData }) => {

        const { data } = props;

        console.log(data.createdAt);
        return (
            <div className="flex flex-col space-y-1">
                <div className="flex flex-row justify-between">
                    <h1 className="font-semibold">{MedicationToTradeName[data.medication]} {`(${data.medication})`} Review</h1>
                    <button onClick={onClose}><CloseIcon /></button>
                </div>
                {data.createdAt && <p className="text-sm text-slate-500">{getDateString(data.createdAt)}</p>}
                {data.userDetails && <p className="text-sm text-slate-500">By: {data.userDetails?.username}</p>}
                <p className="text-sm">Rating: </p>
                <div className="-ml-1">
                    <Rating
                        initialValue={data.rating}
                        fillColor="#0ea5e9"
                        SVGclassName={'inline-block'}
                        readonly
                        size={25}
                    />
                </div>
                <p className="text-sm">Side Effects: </p>
                <div className="flex flex-row space-x-1">
                    {data.sideEffects.map((effect: string) => {
                        return (
                            <div className="w-fit py-2 px-3 bg-gradient-to-r from-sky-500 to-teal-500 
                                            rounded-full text-sm text-white font-semibold">
                                {effect}
                            </div>
                        )
                    })}
                </div>
                <br />
                <p className="text-sm">Details: </p>
                <p className="leading-relaxed">{data.reviewBody}</p>
            </div>
        )
    }

    return (
        <ModalBackground>
            <div className="relative transform overflow-hidden rounded-lg bg-zinc-50 text-left 
                            shadow-xl transition-all sm:mx-auto sm:w-full sm:max-w-[650px] w-full
                            h-fit mx-5 p-4 max-h-[90vh] overflow-y-scroll">
                {reviewData && <ReviewContent data={reviewData} />}
            </div>
        </ModalBackground>
    )
}

export default ReviewModal