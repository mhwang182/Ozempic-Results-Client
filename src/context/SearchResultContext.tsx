import React, { ReactElement, useContext, useReducer, useState } from "react";
import { APIMethod, apiCall } from "../api/apiClient";
import { Post } from "../utils/contants";
import reducer from "./Reducers/SearchResultsContextReducer";
import { ISearchResultContextState } from "../utils/ContextTypes";

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
    const [usernameSearch, setUsernameSearch] = useState("");
    const [userIdSearch, setUserIdSearch] = useState("");

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

    const getUserSearchPosts = async (username: string, userId: string, isNewSearch: boolean, paginationToken?: string) => {
        if (!username || !userId) {
            return;
        }

        setUsernameSearch(username);
        setUserIdSearch(userId);

        if (isNewSearch) {
            dispatch({ type: "SET_SEARCH_POSTS", payload: { posts: [] } });
            setIsCurrentlyUserSearch(true);
        }

        dispatch({ type: "SET_SEARCH_TERM", payload: { searchTerm: username } });
        fetchSearch(userId, paginationToken);
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