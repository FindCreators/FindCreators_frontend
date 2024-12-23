import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: "https://findcreators-537037621947.asia-south2.run.app",
  timeout: 120000,
  withCredentials: false,
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (config.headers) {
        const token = localStorage.getItem("token");
        if (token) {
          let cleanedToken;
          try {
            cleanedToken = JSON.parse(token);
          } catch {
            cleanedToken = token;
          }
          config.headers["x-access-token"] = cleanedToken;
        }
        // Only set Content-Type to application/json if it's not already set
        if (!config.headers["Content-Type"]) {
          config.headers["Content-Type"] = "application/json";
        }
      }
      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

const logout = () => {
  const itemsToClear = ["token", "number", "userState", "logintype", "email"];
  itemsToClear.forEach((item) => localStorage.removeItem(item));
  toast.error("Session expired. Please login again.");
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(new Error("Request canceled"));
    }

    if (error.code === "ECONNABORTED") {
      toast.error("Request timeout. Please try again.");
      return Promise.reject(new Error("Request timeout"));
    }
    if (error.response) {
      const message = error.response.data.error || "An error occurred";
      toast.error(message);
      return Promise.reject(new Error(message));
    }

    toast.error("Network error. Please check your connection.");
    return Promise.reject(new Error("Network error"));
  }
);

export default apiClient;
