import React, { ReactElement, useContext, useEffect, useReducer, useCallback } from "react";
import { apiPost } from "../api/apiClient";
import { useUserAuthContext } from "./UserAuthContext";
import { MedicationOptions, NewReviewDTO, ReviewData, SelectOption } from "../utils/contants";

interface ReviewContextState {
    userReviews: ReviewData[],
    feedReviews: ReviewData[],
    isLoadingFeedReviews: boolean,
    addReview: (data: NewReviewDTO) => void,
    deleteReview: (reviewId: string, deletingUserId: string) => void,
    loadUserReviews: () => any,
    loadFeedReviews: (feedReviews: any[]) => void,
    findReview: (id: string) => any
}

const initialReviewsState: ReviewContextState = {
    userReviews: [],
    feedReviews: [],
    isLoadingFeedReviews: false,
    addReview: () => { },
    deleteReview: () => { },
    loadUserReviews: () => { },
    loadFeedReviews: () => { },
    findReview: () => { }
}

export const ReviewsContext = React.createContext(initialReviewsState);

const reducer = (state: ReviewContextState, action: any): ReviewContextState => {
    switch (action.type) {
        case "addReview":
            return { ...state, userReviews: [...state.userReviews, action.payload.review] }
        case "setUserReviews":
            return { ...state, userReviews: action.payload.reviews }
        case "setFeedReviews":
            return { ...state, feedReviews: action.payload.reviews, isLoadingFeedReviews: false }
        case "setFeedReviewsLoading":
            return { ...state, isLoadingFeedReviews: true }
        case "setFeedReviewsLoaded":
            return { ...state, isLoadingFeedReviews: false }
        default:
            return { ...state }
    }
}

export const ReviewsContextProvider = (props: { children: ReactElement }) => {

    const [state, dispatch] = useReducer<(state: ReviewContextState, action: any) => ReviewContextState>(reducer, initialReviewsState);

    const { token, user } = useUserAuthContext();

    const addReview = async (data: NewReviewDTO) => {
        const sideEffects = data.sideEffects.map((e: SelectOption) => e.label);
        const reviewData = {
            rating: data.rating,
            medication: MedicationOptions[data.medicationUsed.value].OfficialName,
            sideEffects,
            reviewBody: data.reviewBody
        }
        try {
            await apiPost("/reviews/create", { review: reviewData, userId: user.id }, token);
            loadUserReviews();
        } catch (error) {
            //TODO: implement error notifying
        }
    }

    const deleteReview = async (reviewId: string, deletingUserId: string) => {
        try {
            await apiPost('/reviews/delete', { reviewId, userId: deletingUserId }, token);
            const updatedReviews = state.userReviews.filter(review => review._id !== reviewId);
            dispatch({ type: "setUserReviews", payload: { reviews: updatedReviews } });
        } catch (error) {
            //TODO: implement error notifying
        }
    }

    const loadUserReviews = useCallback(async () => {

        try {
            if (Object.keys(user).length) {
                const response = await apiPost("/reviews/get", { userId: user.id }, token);
                const reviews = response.data.data.reviews;
                dispatch({ type: "setUserReviews", payload: { reviews: reviews } });
            }
        } catch (error) {
            //TODO: implement error notifying
        }

    }, [user, token])

    const loadFeedReviews = useCallback(async (feedReviews: ReviewData[]) => {
        try {
            let date = (new Date()).toISOString();
            if (feedReviews.length) {
                date = feedReviews[feedReviews.length - 1].createdAt;
            }
            dispatch({ type: "setFeedReviewsLoading", payload: { isLoading: true } });
            const response = await apiPost("/reviews/feed", { date });
            const reviews = response.data.data.reviews;
            if (!reviews.length) {
                dispatch({ type: "setFeedReviewsLoaded", payload: { isLoading: false } });
            } else {
                dispatch({ type: "setFeedReviews", payload: { reviews: [...feedReviews, ...reviews] } });
            }
        } catch (error) {
            dispatch({ type: "setFeedReviewsLoaded" });
            //TODO: implement error notifying
        }
    }, [])

    const findReview = (id: string) => {
        let review = state.userReviews.find((review: ReviewData) => { return review._id === `${id}` });
        if (!review) {
            review = state.feedReviews.find((review: ReviewData) => { return review._id === `${id}` });
        }
        return review;
    }

    useEffect(() => {
        loadFeedReviews([]);
    }, [user, state.userReviews, loadFeedReviews])

    useEffect(() => {
        loadUserReviews();
    }, [user, loadUserReviews])

    return (
        <ReviewsContext.Provider value={{ ...state, addReview, loadUserReviews, loadFeedReviews, findReview, deleteReview }}>
            {props.children}
        </ReviewsContext.Provider>
    )
}

export const useReviewsContext = () => {
    const context = useContext(ReviewsContext)

    if (context === undefined) {
        throw new Error("")
    }

    return context
}

