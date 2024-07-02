import { ReviewContextState } from "../../utils/ContextTypes"

const reducer = (state: ReviewContextState, action: any): ReviewContextState => {
    switch (action.type) {
        case "ADD_REVIEW":
            return { ...state, userReviews: [...state.userReviews, action.payload.review] }
        case "SET_USER_REVIEWS":
            return { ...state, userReviews: action.payload.reviews, isLoadingUserReviews: false }
        case "SET_FEED_REVIEWS":
            return { ...state, feedReviews: action.payload.reviews, isLoadingFeedReviews: false }
        case "SET_IS_LOADING_USER_REVIEWS":
            return { ...state, isLoadingUserReviews: action.payload.isLoadingUserReviews }
        case "SET_IS_LOADING_FEED_REVIEWS":
            return { ...state, isLoadingFeedReviews: action.payload.isLoadingFeedReviews }
        default:
            return { ...state }
    }
}

export default reducer