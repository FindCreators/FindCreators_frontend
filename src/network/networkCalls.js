import { makeRequest, multipartMakeRequest } from "./apiHelpers";
import { API_URLS } from "./apiUrls";
import apiClient, { BASE_URL } from "./apiClient";
import axios from "axios";

export const validateNewEmailorPhone = async ({
  entity,
  email = "",
  phone = "",
}) => {
  const data = await makeRequest({
    url:
      API_URLS.GET_VALIDATE_NEW_EMAIL_OR_PHONE +
      `entity=${entity}&email=${email}&phone=${phone}`,
  });
  return data;
};

export const loginUser = async (phone) => {
  try {
    const data = await makeRequest({
      url: API_URLS.GET_LOGIN_USER + `phone=${phone}`,
    });

    if (!data || !data.profile || !data.jwt) {
      throw new Error("Invalid response from server");
    }

    localStorage.setItem("token", data.jwt);
    localStorage.setItem("profile", JSON.stringify(data.profile));
    localStorage.setItem("userType", data.profile.type);
    localStorage.setItem("userId", data.profile.id);

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const createUser = async (entity, profile) => {
  const data = await makeRequest({
    method: "post",
    url:
      entity === "creator"
        ? API_URLS.POST_CREATOR_SIGNUP
        : API_URLS.POST_BRAND_SIGNUP,
    data: profile,
  });
  localStorage.setItem("token", data.jwt);
  localStorage.setItem("profile", JSON.stringify(data.profile));
  return data;
};

export const createJobListing = async (jobData) => {
  const data = await makeRequest({
    method: "post",
    url: API_URLS.POST_JOB_LISTING,
    data: jobData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getBrandListings = async (page, limit, filters = {}) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
  });

  if (filters.status && filters.status !== "all") {
    queryParams.append("status", filters.status);
  }
  if (filters.categories?.length > 0) {
    queryParams.append("categories", filters.categories.join(","));
  }
  if (filters.budget) {
    queryParams.append("budget", filters.budget);
  }

  const response = await makeRequest({
    url: `${API_URLS.GET_BRAND_LISTINGS}?${queryParams}`,
  });
  return {
    data: response.data || [],
    total: response.total || 0,
    page: response.page || 1,
    limit: response.limit || 10,
    totalPages: response.totalPages || 1,
  };
};

export const getBrandProfile = async (id) => {
  const data = await makeRequest({
    url: `${API_URLS.GET_BRAND_PROFILE}${id ? `?id=${id}` : ""}`,
  });
  return data;
};

export const getCreatorProfile = async (id) => {
  const data = await makeRequest({
    url: `${API_URLS.GET_CREATOR_PROFILE}${id ? `?id=${id}` : ""}`,
  });
  return data;
};

export const updateBrandProfile = async (profileData) => {
  try {
    const response = await makeRequest({
      method: "PATCH",
      url: "/api/brand",
      data: profileData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating brand profile:", error);
    throw error;
  }
};

export const uploadBrandLogo = async (formData) => {
  try {
    const response = await axios.patch(
      "https://findcreators-537037621947.asia-south2.run.app/api/update-profile-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": `${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading brand logo:", error);
    throw error;
  }
};

export const getListings = async (filters = {}) => {
  const queryParams = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.budget && { budget: filters.budget }),
    ...(filters.categories?.length && {
      categories: filters.categories.join(","),
    }),
  });

  const data = await makeRequest({
    url: `${API_URLS.GET_LISTINGS}/?${queryParams}`,
  });
  return data;
};

export const applyToJob = async (listingId, quotedPrice, message) => {
  const data = await makeRequest({
    method: "PATCH",
    url: API_URLS.APPLY_TO_LISTING,
    data: { listingId, quotedPrice: parseInt(quotedPrice, 10), message },
  });
  return data;
};

export const getCreatorsByIdArray = async (ids, listingId) => {
  const data = await makeRequest({
    method: "POST",
    url: API_URLS.CREATORS_BY_ID_ARRAY,
    data: { ids, listingId },
  });
  return data;
};
export const updateCreatorProfile = async (profileData) => {
  try {
    const response = await makeRequest({
      method: "PATCH",
      url: "/api/creator",
      data: profileData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating creator profile:", error);
    throw error;
  }
};

export const getUserToken = async () => {
  const data = await makeRequest({
    url: API_URLS.GET_CHAT_TOKEN,
  });
  return data;
};

export const createOffer = async (
  listingId,
  creatorId,
  amount,
  details,
  attachments,
  contractTitle
) => {
  const formData = new FormData();
  formData.append("listingId", listingId);
  formData.append("creatorId", creatorId);
  formData.append("amount", amount);
  formData.append("details", details);
  formData.append("paymentOption", "fixed_price");
  formData.append("contractTitle", contractTitle);
  formData.append("paymentScheduleType", "whole");
  if (attachments) {
    formData.append("attachments", attachments);
  }

  try {
    const response = await makeRequest({
      method: "POST",
      url: API_URLS.CREATE_OFFER,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": localStorage.getItem("token"),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating offer:", error);
    throw error;
  }
};
