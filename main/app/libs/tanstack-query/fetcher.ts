import axios from "axios";

let baseURI: (string | undefined) = '';

const env = !!process && process.env.NODE_ENV;
if (env == "development") {
    baseURI = process.env.NEXT_PUBLIC_BACKEND_BASE_URI_LOCAL;
} else {
    baseURI = process.env.NEXT_PUBLIC_BACKEND_BASE_URI_ONLINE;
}

export const axiosInstance = axios.create({
    baseURL: baseURI,
});