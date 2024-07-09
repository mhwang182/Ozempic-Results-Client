import { useLocation, useParams } from "react-router-dom";
import ModalBackground from "../Common/ModalBackground"
import { loadReviewById } from "../../context/ReviewsContext";
import { useEffect, useState } from "react";
import { MedicationToTradeName, ReviewData, getDateString } from "../../utils/contants";
import { Rating } from "react-simple-star-rating";
import { CloseIcon } from "../../svgs/svgs";
import LoadingSpinner from "../Common/LoadingSpinner";

const ReviewModal = (props: { onClose: () => void }) => {

    const { id } = useParams();
    const location = useLocation();

    const [reviewData, setReviewData] = useState(undefined as ReviewData | undefined);
    const [loadingReview, setLoadingReview] = useState(false);


    const { onClose } = props;

    useEffect(() => {
        const getReview = async () => {
            if (!id) { return; }

            setLoadingReview(true);

            if (location.state && location.state?.review) {
                const { review } = location.state;
                setReviewData(review)
                setLoadingReview(false);
                return;
            }

            const review = await loadReviewById(id);
            if (review) {
                setReviewData(review);
            }
            setLoadingReview(false);
        }
        getReview();

    }, [id, location.state])

    const ReviewContent = (props: { data: ReviewData }) => {

        const { data } = props;
        return (
            <div className="flex flex-col space-y-1 w-full">
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
                {(data.sideEffects && data.sideEffects.length) ? <>
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
                </> : null}
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
                            h-fit mx-5 p-4 max-h-[90vh] min-h-[250px] overflow-y-scroll flex">
                <>{loadingReview ?
                    <div className="m-auto h-20 w-20">
                        <LoadingSpinner />
                    </div> :
                    <>
                        {reviewData ?
                            <ReviewContent data={reviewData} /> :
                            <div className="py-3 flex flex-col space-y-3 items-center rounded-md w-full">
                                <div className={`w-full px-3 flex flex-row justify-end`}>
                                    <button
                                        onClick={onClose}
                                        className=""
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                                <div className="font-semibold">Review Not Found</div>
                            </div>
                        }
                    </>
                }</>

            </div>
        </ModalBackground>
    )
}

export default ReviewModal