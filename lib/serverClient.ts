import axios from "axios";
import { cookies } from "next/headers";

// Create an Axios instance
const serverClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
serverClient.interceptors.request.use(
  (config) => {
    // Server-side: Retrieve cookies using `next/headers`
    const cookieStore = cookies();
    const authToken = cookieStore.get("authToken")?.value;

    if (authToken) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  },
);

// Add a response interceptor
serverClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle error responses globally
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default serverClient;
