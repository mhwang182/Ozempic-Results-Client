import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY || "";
const apiBaseURL = process.env.REACT_APP_API_BASE_URL || "";

export const apiClient = axios.create({
    baseURL: apiBaseURL
});

export enum APIMethod {
    GET = "get",
    POST = "post"
}

export const apiCall = (method: APIMethod, url: string, data?: any, token?: string, contentType?: string) => {
    let headers: { [key: string]: string } = {
        'X-API-KEY': apiKey
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (contentType) {
        headers['Content-Type'] = contentType
    }

    if (method === APIMethod.GET) {
        return apiClient[method](url, {
            headers: headers
        });
    }

    return apiClient[method](url, data, {
        headers: headers
    });
}