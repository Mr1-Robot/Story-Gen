import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

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
apiClient.interceptors.response.use(
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

export default apiClient;
