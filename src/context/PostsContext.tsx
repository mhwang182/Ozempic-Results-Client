import React, { ReactElement, useCallback, useContext, useEffect, useReducer, useState } from "react";
import { apiCall, APIMethod } from "../api/apiClient";
import { useUserAuthContext } from "./UserAuthContext";
import { Post, PostDetailsDTO } from "../utils/contants";
import { PostsState } from "../utils/ContextTypes";

const initialPostsState: PostsState = {
    userPosts: [],
    feedPosts: [],
    isUploadLoading: false,
    isFeedLoading: false,
    isUserPostsLoading: false,
    atFeedEnd: false,
    loadPostById: () => { return null as unknown as Promise<Post> },
    uploadPost: () => { },
    deletePost: () => { },
    loadFeedPosts: () => { }
}

const reducer = (state: PostsState, action: any): PostsState => {
    switch (action.type) {
        case "setUserPosts":
            return { ...state, userPosts: action.payload.posts, isUserPostsLoading: false }
        case "removePosts":
            return { ...state, userPosts: [] }
        case "setFeedPosts":
            return { ...state, feedPosts: action.payload.posts, isFeedLoading: false }
        case "setFeedLoading":
            return { ...state, isFeedLoading: true }
        case "setUserPostsLoading":
            return { ...state, isUserPostsLoading: action.payload.isUserPostsLoading }
        //TODO: move to useState perhaps
        case "setFeedLoaded":
            if (action.payload && action.payload.atFeedEnd) {
                return { ...state, isFeedLoading: false, atFeedEnd: true }
            }
            return { ...state, isFeedLoading: false }
        default:
            return state;
    }
}

export const PostsContext = React.createContext(initialPostsState);

export const PostsContextProvider = ({ children }: { children: ReactElement }) => {

    const { token } = useUserAuthContext();
    const [state, dispatch] = useReducer<(state: PostsState, action: any) => PostsState>(reducer, initialPostsState);

    const [feedPostCount, setFeedPostCount] = useState(0);

    const uploadPost = async (beforeImage: File, afterImage: File, postDetails: PostDetailsDTO) => {
        if (!beforeImage || !afterImage) {
            return;
        }
        const formData = new FormData();
        formData.append('beforeImage', beforeImage);
        formData.append('afterImage', afterImage);
        formData.append('weightLost', `${postDetails.weightLost}`);
        formData.append('medicationUsed', postDetails.medicationUsed);
        formData.append('caption', postDetails.caption);

        try {
            await apiCall(APIMethod.POST, '/posts/create', formData, token, 'multipart/form-data');
            loadUserPosts(false);
        } catch (error) {
            //TODO: implement error notifying
        }
    }

    const deletePost = async (postId: string) => {
        try {
            await apiCall(APIMethod.POST, '/posts/delete', { postId }, token);
            dispatch({ type: "setUserPosts", payload: { posts: state.userPosts.filter((post) => post._id !== postId) } });
        } catch (error) {
            //TODO: implement error notifying
        }
    }

    const loadUserPosts = useCallback(async (firstLoad: boolean) => {
        try {
            if (!token || token.length === 0) return;

            if (firstLoad) {
                dispatch({ type: "setUserPostsLoading", payload: { isUserPostsLoading: true } })
            }

            const response = await apiCall(APIMethod.POST, '/posts/getPostsByUser', undefined, token);
            const posts = response.data.data.posts;
            dispatch({ type: "setUserPosts", payload: { posts } });
        } catch (error) {
            //TODO: implement error notifying
            dispatch({ type: "setUserPostsLoading", payload: { isUserPostsLoading: false } })
        }
    }, [token])

    const loadFeedPosts = useCallback(async (feedPosts: Post[], atFeedEnd: boolean) => {
        try {
            let date = feedPosts.length > 0 ? feedPosts[feedPosts.length - 1].createdAt : (new Date()).toISOString();

            dispatch({ type: "setFeedLoading" });
            const response = await apiCall(APIMethod.POST, '/posts/feed', { date }, token)
            const posts = response.data.data.posts;

            if (posts.length === 0 && feedPosts.length) {
                if (atFeedEnd) return;
                dispatch({ type: "setFeedLoaded", payload: { atFeedEnd: true } });
                return;
            }
            const updatedFeed = [...feedPosts, ...posts];
            if (updatedFeed.length !== feedPostCount) {
                setFeedPostCount(updatedFeed.length);
            }

            dispatch({ type: "setFeedPosts", payload: { posts: updatedFeed } });

        } catch (error) {
            dispatch({ type: "setFeedLoaded" });
        }
    }, [token, feedPostCount])

    const loadPostById = async (postId: string): Promise<Post> => {
        try {
            const response = await apiCall(APIMethod.GET, `posts/get?postId=${postId}`);
            const post = response.data.data.post;
            return post;
        } catch (error) {
            //TODO: implement error notifying
        }
        return null as unknown as Post
    }

    //load posts on first app load
    useEffect(() => {
        if (feedPostCount > 0) return;
        loadFeedPosts([], false);

    }, [loadFeedPosts, token, feedPostCount])

    useEffect(() => {
        if (!token || token.length === 0) {
            dispatch({ type: "removePosts" });
            return;
        }
        loadUserPosts(true);
    }, [token, loadUserPosts])

    return (
        <PostsContext.Provider value={{ ...state, uploadPost, deletePost, loadFeedPosts, loadPostById }}>
            {children}
        </PostsContext.Provider>
    )
}

export const usePostsContext = () => {
    const context = useContext(PostsContext)

    if (context === undefined) {
        throw new Error("")
    }

    return context
}