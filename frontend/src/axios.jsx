import axios from 'axios'

export const makeRequest = axios.create({
    baseURL: "https://my-devify-app-api.vercel.app",
    withCredentials: true,
})
