import { Rating } from "react-simple-star-rating";
import { MedicationToTradeName, ReviewData, getDateString } from "../../utils/contants";
import { Link, useLocation } from "react-router-dom";

const ReviewPreview = (props: { data: ReviewData, showUserName?: boolean, hoverable?: boolean }) => {
    const { data, showUserName, hoverable } = props;
    const location = useLocation();

    return (
        <Link to={`/review/${data._id}`} state={{ previousLocation: location, review: data }}>
            <div className={`w-full h-fit border rounded-md shadow-sm p-4 ${hoverable ? 'hover:brightness-95' : ''} bg-white`}>
                <h1 className="font-semibold">{MedicationToTradeName[data.medication]} {`(${data.medication})`} Review</h1>
                {showUserName ? <p className="text-sm text-slate-500">By: {data.userDetails?.username}</p> : null}
                {data.createdAt && <p className="text-sm text-slate-500">{getDateString(data.createdAt)}</p>}
                <Rating
                    initialValue={data.rating}
                    fillColor="#0ea5e9"
                    SVGclassName={'inline-block'}
                    readonly
                    size={25}
                />
                <p className="line-clamp-2">{data.reviewBody}</p>
            </div>
        </Link>
    )
}

export default ReviewPreview