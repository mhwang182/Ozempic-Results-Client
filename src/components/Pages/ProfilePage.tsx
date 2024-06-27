import { useState } from "react";
import { useUserAuthContext } from "../../context/UserAuthContext"
import NewPostModal from "../Posts/NewPostModal";
import TabSwitch from "../Common/TabSwitch";
import PostGridContent from "../Layout/PostGridContent";
import UserReviewsContent from "../Layout/UserReviewsContent";
import NewReviewModal from "../Reviews/NewReviewModal";
import { useReviewsContext } from "../../context/ReviewsContext";

const ProfilePage = () => {

    const { user } = useUserAuthContext();
    const { userReviews } = useReviewsContext();
    const { firstname, lastname, username } = user;

    const [isOpenPost, setIsOpenPost] = useState(false);
    const [isOpenReview, setIsOpenReview] = useState(false);
    const [page, setPage] = useState(0);

    return (
        <>
            {isOpenPost ? <NewPostModal onClose={() => setIsOpenPost(false)} /> : null}
            {isOpenReview ? <NewReviewModal onClose={() => setIsOpenReview(false)} /> : null}
            <div className="flex flex-col size-full items-center">
                <div className="p-8 flex justify-center">
                    <div className="relative inline-flex items-center justify-center w-24 h-24 min-w-24 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <span className="font-medium text-4xl text-gray-600 dark:text-gray-300">
                            {firstname ? firstname[0].toUpperCase() : ""}{lastname ? lastname[0].toUpperCase() : ""}
                        </span>
                    </div>
                    <div className="flex flex-col mx-4">
                        <div className="flex flex-wrap">
                            <span className="font-semibold text-2xl mr-2">{username}</span>
                            {/* <button className="bg-gray-100 p-2 rounded-md text-sm">Edit Profile</button> */}
                        </div>
                        <span className="">{firstname} {lastname}</span>
                        <div className="w-full text-wrap">

                        </div>
                    </div>
                </div>
                <div className="flex justify-center flex-col space-y-2">
                    <button
                        className="bg-gray-100 p-2 rounded-md text-sm"
                        onClick={() => { setIsOpenPost(true) }}
                    >
                        Add Post +
                    </button>
                    <button
                        className="bg-gray-100 p-2 rounded-md text-sm"
                        onClick={() => { setIsOpenReview(true) }}
                    >
                        Add Review +
                    </button>
                </div>
                <div className="w-full mt-10 p-4 sm:max-w-screen-md flex-grow">
                    <div className="mb-2">
                        <TabSwitch label1={"Posts"} label2={"Reviews"} page={page} setPage={setPage} />
                    </div>
                    {page ?
                        <UserReviewsContent reviews={userReviews} /> :
                        <PostGridContent />
                    }
                </div>
            </div >
        </>
    )
}

export default ProfilePage