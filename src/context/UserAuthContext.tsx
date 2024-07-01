import React, { ReactElement, useContext, useReducer } from "react";
import { APIMethod, apiCall } from "../api/apiClient";
import { AxiosError } from "axios";
import { NewUserDTO, LoginCredentialsDTO } from "../utils/contants";

export interface User {
    id?: string,
    username: string,
    email: string,
    firstname?: string,
    lastname?: string,
}

export interface UserAuthState {
    token: string,
    user: User,
    isUserLoading: boolean,
    loginAlert?: string,
    createUser: (data: NewUserDTO, signUpCode?: string) => void,
    login: (data: LoginCredentialsDTO) => void,
    logout: () => void
}

const appName = 'Ozempic-Results';

const initialUserAuthState: UserAuthState = {
    token: localStorage.getItem(`${appName}-token`) || "",
    user: JSON.parse(localStorage.getItem(`${appName}-user`) || JSON.stringify({})) as User,
    isUserLoading: false,
    createUser: () => { },
    login: () => { },
    logout: () => { }
}

const UserAuthContext = React.createContext(initialUserAuthState);

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'logout':
            localStorage.removeItem(`${appName}-token`);
            localStorage.removeItem(`${appName}-user`);
            return { ...state, token: "", user: {} };
        case 'setUser':
            localStorage.setItem(`${appName}-token`, action.payload.token)
            localStorage.setItem(`${appName}-user`, JSON.stringify(action.payload.user))
            console.log(action.payload.user);
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isUserLoading: false
            };
        case 'userLoading':
            return { ...state, isUserLoading: true }
        case 'userLoaded':
            return { ...state, isUserLoading: false }
        case 'setLoginAlert':
            return { ...state, loginAlert: action.payload.alert }
        case 'clearAlert':
            return { ...state, loginAlert: undefined }
        default:
            throw Error()
    }
}

const UserAuthContextProvider = (props: { children: ReactElement }) => {

    const [userAuthState, dispatch] = useReducer(reducer, initialUserAuthState);

    const login = async (data: LoginCredentialsDTO) => {
        try {
            dispatch({ type: "userLoading" });

            const response = await apiCall(APIMethod.POST, "/user/login", {
                credentials: data
            });

            dispatch({
                type: 'setUser', payload: {
                    token: response.data.token,
                    user: response.data.user
                }
            });
        } catch (error) {
            dispatch({ type: "userLoaded" })
            const err = error as AxiosError;
            const errData = err.response?.data as any;

            if (errData && errData.message) {
                setAlert(errData.message);
            }
        }
    }

    const logout = () => {
        dispatch({ type: 'logout' });
    }

    const createUser = async (data: NewUserDTO, signUpCode?: string) => {
        try {
            dispatch({ type: "userLoading" });
            const response = await apiCall(APIMethod.POST, "/user", { user: data, signUpCode });
            dispatch({ type: 'setUser', payload: { token: response.data.token, user: response.data.user } });
        } catch (error) {
            dispatch({ type: "userLoaded" })
            const err = error as AxiosError;
            const errData = err.response?.data as any;

            if (errData && errData.message) {
                setAlert(errData.message);
            }
        }
    }

    const setAlert = (message: string) => {
        dispatch({ type: 'setLoginAlert', payload: { alert: message } });
        setTimeout(() => {
            dispatch({ type: 'clearAlert' });
        }, 4000);
    }

    return (
        <UserAuthContext.Provider
            value={{
                ...userAuthState,
                createUser,
                login,
                logout
            }}
        >
            {props.children}
        </UserAuthContext.Provider>
    )

}

const useUserAuthContext = () => {
    const context = useContext(UserAuthContext)

    if (context === undefined) {
        throw new Error("")
    }

    return context
}

export { useUserAuthContext, UserAuthContextProvider }