import { NewReviewDTO, Post, PostDetailsDTO, ReviewData } from "./contants";

export interface ISearchResultContextState {
    searchTerm: string,
    searchPosts: Post[],
    isLoadingSearchPosts: boolean,
    isCurrentlyUserSearch: boolean,
    getSearchPosts: (searchTerm: string, isNewSearch: boolean, paginationToken?: string) => void,
    getUserSearchPosts: (isNewSearch: boolean, searchPosts: Post[], username?: string, userId?: string) => void
}

export interface ReviewContextState {
    userReviews: ReviewData[],
    feedReviews: ReviewData[],
    isLoadingFeedReviews: boolean,
    isLoadingUserReviews: boolean,
    addReview: (data: NewReviewDTO) => Promise<void>,
    deleteReview: (reviewId: string) => void,
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
    deletePost: (postId: string) => void,
    loadFeedPosts: (feedPosts: Post[], atFeedEnd: boolean) => void,
    resetFeedEnd: () => void;
}