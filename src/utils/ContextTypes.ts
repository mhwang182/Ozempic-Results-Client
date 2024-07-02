import { NewReviewDTO, Post, PostDetailsDTO, ReviewData } from "./contants";

export interface ISearchResultContextState {
    searchTerm: string,
    searchPosts: Post[],
    isLoadingSearchPosts: boolean,
    isCurrentlyUserSearch: boolean,
    getSearchPosts: (searchTerm: string, isNewSearch: boolean, paginationToken?: string) => void,
    getUserSearchPosts: (username: string, userId: string, isNewSearch: boolean, paginationToken?: string) => void
}

export interface ReviewContextState {
    userReviews: ReviewData[],
    feedReviews: ReviewData[],
    isLoadingFeedReviews: boolean,
    isLoadingUserReviews: boolean,
    addReview: (data: NewReviewDTO) => void,
    deleteReview: (reviewId: string, deletingUserId: string) => void,
    loadUserReviews: (isFirstLoad: boolean) => any,
    loadFeedReviews: (feedReviews: any[]) => void,
}

export interface PostsState {
    userPosts: Post[],
    feedPosts: Post[],
    isUploadLoading: boolean,
    isFeedLoading: boolean,
    isUserPostsLoading: boolean,
    atFeedEnd: boolean,
    loadPostById: (postId: string) => Promise<Post>
    uploadPost: (beforeImage: File, afterImage: File, postDetails: PostDetailsDTO) => void,
    deletePost: (deleteingUserId: string, postId: string) => void,
    loadFeedPosts: (feedPosts: Post[]) => void
}