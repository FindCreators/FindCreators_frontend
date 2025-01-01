import apiClient from "./apiClient";
import multipartapiClient from "./multipartapiclient";

const makeRequest = async ({
  method = "get",
  url,
  data = {},
  params = {},
  responseType = "json",
  cancelToken = null,
  headers = {},
} = {}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      params,
      responseType,
      cancelToken,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

const multipartMakeRequest = async ({
  method = "post",
  url,
  data = {},
  params = {},
  cancelToken = null,
  headers = {},
} = {}) => {
  try {
    const response = await multipartapiClient({
      method,
      url,
      data,
      params,
      cancelToken,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};

export { makeRequest, multipartMakeRequest };
