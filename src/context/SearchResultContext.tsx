import React, { ReactElement, useContext, useReducer } from "react";
import { APIMethod, apiCall } from "../api/apiClient";
import { Post } from "../utils/contants";

interface ISearchResultContextState {
    searchTerm: string,
    searchPosts: Post[],
    isLoadingSearchPosts: boolean,
    getSearchPosts: (searchTerm: string, paginationToken?: string) => void
}

const initialState: ISearchResultContextState = {
    searchTerm: "",
    searchPosts: [],
    isLoadingSearchPosts: false,
    getSearchPosts: () => { }
}

const SearchResultContext = React.createContext(initialState);

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "setSearchTerm":
            return { ...state, searchTerm: action.payload.searchTerm }
        case "setSearchPosts":
            return { ...state, searchPosts: action.payload.posts, isLoadingSearchPosts: false }
        case "setSearchPostsLoading":
            return { ...state, isLoadingSearchPosts: action.payload.loading }
        default:
            return { ...state }
    }
}

export const SearchResultContextProvider = (props: { children: ReactElement }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const getSearchPosts = async (searchTerm: string, paginationToken?: string) => {
        if (!searchTerm.length) {
            return;
        }
        dispatch({ type: "setSearchTerm", payload: { searchTerm: searchTerm } });
        try {
            dispatch({ type: "setSearchPostsLoading", payload: { loading: true } });
            const response = await apiCall(APIMethod.POST, "/posts/search", { searchTerm, paginationToken });
            if (!response.data?.data || !response.data?.data?.posts) {
                dispatch({ type: "setSearchPosts", payload: { posts: [] } });
                return;
            }
            const searchPosts = response.data.data.posts;
            if (!searchPosts.length) {
                dispatch({ type: "setSearchPostsLoading", payload: { loading: false } });
                return;
            }
            dispatch({ type: "setSearchPosts", payload: { posts: paginationToken ? [...state.searchPosts, ...searchPosts] : searchPosts } });
        } catch (error) {
            dispatch({ type: "setSearchPostsLoading", payload: { loading: false } });
            //TODO: implement error notifying
        }

    }

    return (
        <SearchResultContext.Provider value={{ ...state, getSearchPosts }}>
            {props.children}
        </SearchResultContext.Provider>
    )
}

export const useSearchResultContext = () => {
    return useContext(SearchResultContext);
}