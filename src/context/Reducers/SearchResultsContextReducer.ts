const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "SET_SEARCH_TERM":
            return { ...state, searchTerm: action.payload.searchTerm }
        case "SET_SEARCH_POSTS":
            return { ...state, searchPosts: action.payload.posts, isLoadingSearchPosts: false }
        case "SET_SEARCH_POSTS_LOADING":
            return { ...state, isLoadingSearchPosts: action.payload.loading }
        default:
            return { ...state }
    }
}

export default reducer