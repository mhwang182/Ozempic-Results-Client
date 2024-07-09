import React, { ReactElement, useContext, useReducer, useState } from "react";
import { APIMethod, apiCall } from "../api/apiClient";
import reducer from "./Reducers/SearchResultsContextReducer";
import { ISearchResultContextState } from "../utils/ContextTypes";
import { Post } from "../utils/contants";

const initialState: ISearchResultContextState = {
    searchTerm: "",
    searchPosts: [],
    isLoadingSearchPosts: false,
    isCurrentlyUserSearch: false,
    getSearchPosts: () => { },
    getUserSearchPosts: () => { }
}

const SearchResultContext = React.createContext<ISearchResultContextState>(initialState);

export const SearchResultContextProvider = (props: { children: ReactElement }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const [isCurrentlyUserSearch, setIsCurrentlyUserSearch] = useState(false);
    const [searchUsername, setSearchUsername] = useState("");
    const [searchUserId, setSearchUserId] = useState("");

    const fetchSearch = async (searchTerm: string, paginationToken?: string) => {
        try {
            dispatch({ type: "SET_SEARCH_POSTS_LOADING", payload: { loading: true } });
            const response = await apiCall(APIMethod.POST, "/posts/search", { searchTerm, paginationToken });
            if (!response.data?.data || !response.data?.data?.posts) {
                dispatch({ type: "SET_SEARCH_POSTS", payload: { posts: [] } });
                return;
            }
            const searchPosts = response.data.data.posts;
            if (!searchPosts.length) {
                dispatch({ type: "SET_SEARCH_POSTS_LOADING", payload: { loading: false } });
                return;
            }
            dispatch({ type: "SET_SEARCH_POSTS", payload: { posts: paginationToken ? [...state.searchPosts, ...searchPosts] : searchPosts } });
        } catch (error) {
            dispatch({ type: "SET_SEARCH_POSTS_LOADING", payload: { loading: false } });
            //TODO: implement error notifying
        }
    }

    const getUserSearchPosts = async (isNewSearch: boolean, searchPosts: Post[], username?: string, userId?: string) => {

        if (username && userId) {
            setSearchUsername(username);
            setSearchUserId(userId);
        }

        if (!isNewSearch && (searchUsername.length === 0 || searchUserId.length === 0)) {
            return;
        }

        if (isNewSearch) {
            dispatch({ type: "SET_SEARCH_TERM", payload: { searchTerm: username } });
            dispatch({ type: "SET_SEARCH_POSTS", payload: { posts: [] } });
            setIsCurrentlyUserSearch(true);
        }

        try {
            dispatch({ type: "SET_SEARCH_POSTS_LOADING", payload: { loading: true } });
            let date = (new Date()).toISOString();
            if (searchPosts.length) {
                date = searchPosts[searchPosts.length - 1].createdAt;
            }

            const response = await apiCall(APIMethod.POST, "/posts/searchByUserId", { userId: isNewSearch ? userId : searchUserId, date });
            const posts = response.data.data.posts;

            if (posts.length === 0) {
                dispatch({ type: "SET_SEARCH_POSTS_LOADING", payload: { loading: false } });
                return;
            }
            dispatch({ type: "SET_SEARCH_POSTS", payload: { posts: [...searchPosts, ...posts] } });
        } catch (error) {
            dispatch({ type: "SET_SEARCH_POSTS_LOADING", payload: { loading: false } });
        }
    }

    const getSearchPosts = async (searchTerm: string, isNewSearch: boolean, paginationToken?: string) => {
        if (!searchTerm.length) {
            return;
        }

        if (isNewSearch) {
            dispatch({ type: "SET_SEARCH_POSTS", payload: { posts: [] } })
            setIsCurrentlyUserSearch(false);
        }

        dispatch({ type: "SET_SEARCH_TERM", payload: { searchTerm: searchTerm } });

        fetchSearch(searchTerm, paginationToken);
    }

    return (
        <SearchResultContext.Provider value={{ ...state, isCurrentlyUserSearch: isCurrentlyUserSearch, getSearchPosts, getUserSearchPosts }}>
            {props.children}
        </SearchResultContext.Provider>
    )
}

export const useSearchResultContext = () => {
    return useContext(SearchResultContext);
}