import React, { ReactElement, useCallback, useContext, useEffect, useReducer } from "react";
import { apiPost } from "../api/apiClient";
import { useUserAuthContext } from "./UserAuthContext";
import { Post, PostDetailsDTO } from "../utils/contants";

interface PostsState {
    userPosts: Post[],
    feedPosts: Post[],
    isUploadLoading: boolean,
    isFeedLoading: boolean,
    atFeedEnd: boolean,
    uploadPost: (beforeImage: File, afterImage: File, postDetails: PostDetailsDTO) => void,
    deletePost: (deleteingUserId: string, postId: string) => void,
    loadFeedPosts: (feedPosts: Post[]) => void
}

const initialPostsState: PostsState = {
    userPosts: [],
    feedPosts: [],
    isUploadLoading: false,
    isFeedLoading: false,
    atFeedEnd: false,
    uploadPost: () => { },
    deletePost: () => { },
    loadFeedPosts: () => { }
}

const reducer = (state: PostsState, action: any): PostsState => {
    switch (action.type) {
        case "setUserPosts":
            return { ...state, userPosts: action.payload.posts }
        case "removePosts":
            return { ...state, userPosts: [] }
        case "setFeedPosts":
            return { ...state, feedPosts: action.payload.posts, isFeedLoading: false }
        case "setFeedLoading":
            return { ...state, isFeedLoading: true }
        case "setFeedLoaded":
            if (action.paylod && action.payload.atFeedEnd) {
                return { ...state, isFeedLoading: false, atFeedEnd: true }
            }
            return { ...state, isFeedLoading: false }
        default:
            return state;
    }
}

export const PostsContext = React.createContext(initialPostsState);

export const PostsContextProvider = ({ children }: { children: ReactElement }) => {

    const { token, user } = useUserAuthContext();
    const [state, dispatch] = useReducer<(state: PostsState, action: any) => PostsState>(reducer, initialPostsState);

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
        if (user.id) { formData.append('userId', user.id) };

        try {
            await apiPost('/posts/create', formData, token, 'multipart/form-data');
            loadUserPosts();
        } catch (error) {
            //TODO: implement error notifying
        }
    }

    const deletePost = async (deletingUserId: string, postId: string) => {
        console.log(postId, deletingUserId);
        try {
            await apiPost('/posts/delete', { userId: deletingUserId, postId }, token);
            dispatch({ type: "setUserPosts", payload: { posts: state.userPosts.filter((post) => post._id !== postId) } });
        } catch (error) {
            //TODO: implement error notifying
        }
    }

    const loadUserPosts = useCallback(async () => {
        try {
            if (Object.keys(user).length) {
                const data = { userId: user.id };
                const response = await apiPost('/posts/get', data, token)
                const posts = response.data.data.posts;
                dispatch({ type: "setUserPosts", payload: { posts } })
            }
        } catch (error) {
            //TODO: implement error notifying
        }
    }, [user, token])

    const loadFeedPosts = useCallback(async (feedPosts: Post[]) => {
        try {

            let date = (new Date()).toISOString();

            if (feedPosts.length > 0) {
                date = feedPosts[feedPosts.length - 1].createdAt;
            }

            let data = { userId: user.id, date };

            dispatch({ type: "setFeedLoading" });
            const response = await apiPost('/posts/feed', data, token)
            const posts = response.data.data.posts;

            if (posts.length === 0) {
                dispatch({ type: "setFeedLoaded", payload: { atFeedEnd: true } });
                return;
            }
            dispatch({ type: "setFeedPosts", payload: { posts: [...feedPosts, ...posts] } });

        } catch (error) {
            dispatch({ type: "setFeedLoaded" });
        }
    }, [user, token])

    useEffect(() => {
        loadFeedPosts([]);
        if (!token || token.length === 0) {
            dispatch({ type: "removePosts" })
            return;
        }
        loadUserPosts();

    }, [loadUserPosts, loadFeedPosts, token])

    return (
        <PostsContext.Provider value={{ ...state, uploadPost, deletePost, loadFeedPosts }}>
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