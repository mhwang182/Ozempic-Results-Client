import React, { ReactElement, useContext, useEffect, useReducer, useCallback } from "react";
import { APIMethod, apiCall } from "../api/apiClient";
import { useUserAuthContext } from "./UserAuthContext";
import { MedicationOptions, NewReviewDTO, ReviewData, SelectOption } from "../utils/contants";

interface ReviewContextState {
    userReviews: ReviewData[],
    feedReviews: ReviewData[],
    isLoadingFeedReviews: boolean,
    isLoadingUserReviews: boolean,
    addReview: (data: NewReviewDTO) => void,
    deleteReview: (reviewId: string, deletingUserId: string) => void,
    loadUserReviews: (isFirstLoad: boolean) => any,
    loadFeedReviews: (feedReviews: any[]) => void,
}

const initialReviewsState: ReviewContextState = {
    userReviews: [],
    feedReviews: [],
    isLoadingFeedReviews: false,
    isLoadingUserReviews: false,
    addReview: () => { },
    deleteReview: () => { },
    loadUserReviews: () => { },
    loadFeedReviews: () => { },
}

export const ReviewsContext = React.createContext(initialReviewsState);

const reducer = (state: ReviewContextState, action: any): ReviewContextState => {
    switch (action.type) {
        case "addReview":
            return { ...state, userReviews: [...state.userReviews, action.payload.review] }
        case "setUserReviews":
            return { ...state, userReviews: action.payload.reviews, isLoadingUserReviews: false }
        case "setFeedReviews":
            return { ...state, feedReviews: action.payload.reviews, isLoadingFeedReviews: false }
        case "setIsLoadingUserReviews":
            return { ...state, isLoadingUserReviews: action.payload.isLoadingUserReviews }
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
            await apiCall(APIMethod.POST, "/reviews/create", { review: reviewData, userId: user.id }, token);
            loadUserReviews(false);
        } catch (error) {
            //TODO: implement error notifying
        }
    }

    const deleteReview = async (reviewId: string, deletingUserId: string) => {
        try {
            await apiCall(APIMethod.POST, '/reviews/delete', { reviewId, userId: deletingUserId }, token);
            const updatedReviews = state.userReviews.filter(review => review._id !== reviewId);
            dispatch({ type: "setUserReviews", payload: { reviews: updatedReviews } });
        } catch (error) {
            //TODO: implement error notifying
        }
    }

    const loadUserReviews = useCallback(async (firstLoad: boolean) => {

        try {
            if (Object.keys(user).length) {
                if (firstLoad) {
                    dispatch({ type: "setIsLoadingUserReviews", payload: { isLoadingUserReviews: true } });
                }
                const response = await apiCall(APIMethod.POST, "/reviews/listByUserId", { userId: user.id }, token);
                const reviews = response.data.data.reviews;
                dispatch({ type: "setUserReviews", payload: { reviews: reviews } });
            }
        } catch (error) {
            dispatch({ type: "setIsLoadingUserReviews", payload: { isLoadingUserReviews: false } });
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
            const response = await apiCall(APIMethod.POST, "/reviews/feed", { date });
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

    useEffect(() => {
        loadFeedReviews([]);
    }, [user, state.userReviews, loadFeedReviews])

    useEffect(() => {
        loadUserReviews(true);
    }, [user, loadUserReviews])

    return (
        <ReviewsContext.Provider value={{ ...state, addReview, loadUserReviews, loadFeedReviews, deleteReview }}>
            {props.children}
        </ReviewsContext.Provider>
    )
}

export const loadReviewById = async (reviewId: string): Promise<ReviewData> => {
    try {
        const response = await apiCall(APIMethod.GET, `/reviews/get?reviewId=${reviewId}`);
        const review = response.data.data.review;
        console.log(review);
        return review;
    } catch (error) {
        //TODO: implement error notifying
    }
    return null as unknown as ReviewData;
}


export const useReviewsContext = () => {
    const context = useContext(ReviewsContext)

    if (context === undefined) {
        throw new Error("")
    }

    return context
}

