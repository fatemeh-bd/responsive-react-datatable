import axios, { AxiosInstance, AxiosProgressEvent } from "axios";
import { getCookie } from "./utils";
// import { REFRESH_TOKEN } from "./endpoints/login_endpoints";
import { delete_cookie } from "./utils";
import { setCookie } from "./utils";
// import { notify } from "../utils/notify/notify";

// export const BASE_URL = import.meta.env.VITE_BASE_URL;
// export const BASE_URL_SERVICES = import.meta.env.VITE_BASE_URL_SERVICES;

/**
 * رفرش کردن توکن دسترسی
 */
const refreshAccessToken = async () => {
  try {
    const refreshToken = getCookie("refreshToken");
    const response = await postMethod("REFRESH_TOKEN", { refreshToken });
    if (response.isSuccess) {
      const { accessToken, refreshKey, expireDate } = response?.data;
      setCookie("accessToken", accessToken, expireDate);
      setCookie("refreshToken", refreshKey, expireDate);
      return accessToken;
    } else {
      delete_cookie("accessToken");
      delete_cookie("refreshToken");
      window.location.href = "/login";
      // notify(`خطای احراز هویت `, "error");
      return null;
    }
  } catch (err) {
    console.error("Unable to refresh token", err);
    return null;
  }
};

/**
 * ساخت یک Axios Instance
 */
const createAxiosInstance = (
  customHeaders?: object,
  customBaseURL?: string // ✅ امکان تعیین baseURL دلخواه
): AxiosInstance => {
  const accessToken = getCookie("accessToken");
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    ...customHeaders,
  };

  const instance = axios.create({
    baseURL: customBaseURL || "BASE_URL", // ✅ استفاده از customBaseURL
    timeout: 120000,
    headers,
  });

  // مدیریت ریسپانس‌ها
  instance.interceptors.response.use(
    (response) => {
      if (
        response.data.statusCode === 401 ||
        response.data.statusCode === 403
      ) {
        refreshAccessToken();
      }
      return response;
    },
    async (error: any) => {
      const status = error?.response?.status;

      if ((status === 401 || status === 403) && !error.config._retry) {
        if (status === 401) {
          error.config._retry = true;
          delete_cookie("accessToken");
          delete_cookie("refreshToken");
          window.location.href = "/login";
          // notify(`خطای احراز هویت ${status})`, "error");
        } else {
          // notify(`شما دسترسی به این بخش ندارید (خطای ${status})`, "error");
        }
        return null;
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * مدیریت خطاها
 */
const handleError = (error: any) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error("Server error:", error.response.status);
      if (error.response.status === 401) {
        delete_cookie("accessToken");
        delete_cookie("refreshToken");
        window.location.href = "/login";
        // notify(`خطای احراز هویت ${error.response.status})`, "error");
      } else {
        // notify(
        //   `شما دسترسی به این بخش ندارید (خطای ${error.response.status})`,
        //   "error"
        // );
      }
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      console.error("Network error:", error.request);
    }
  } else {
    console.error("Unexpected error:", error.message);
  }
};

/**
 * متد POST
 */
export const postMethod = async (
  endpoint: string,
  body: object | FormData,
  customHeaders?: object,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
  customBaseURL?: string // ✅
): Promise<any> => {
  const isFormData = body instanceof FormData;
  const headers = isFormData
    ? { "Content-Type": "multipart/form-data" }
    : { "Content-Type": "application/json" };

  const axiosInstance = createAxiosInstance(
    { ...headers, ...customHeaders },
    customBaseURL
  );

  try {
    const response = await axiosInstance.post(endpoint, body, {
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    console.log("Error On Fetching: ", endpoint, " (Post Method)");
    handleError(error);
    throw error;
  }
};

/**
 * متد GET
 */
export const getMethod = async (
  endpoint: string,
  customHeaders?: object,
  customBaseURL?: string // ✅
): Promise<any> => {
  const axiosInstance = createAxiosInstance(customHeaders, customBaseURL);

  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.log("Error On Fetching: ", endpoint, " (Get Method)");
    handleError(error);
    throw error;
  }
};
