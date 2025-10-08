import axios from 'axios'

export const makeRequest = axios.create({
    baseURL: "https://mydevifyapp-backend.onrender.com",
    withCredentials: true,
})
