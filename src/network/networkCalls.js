import { makeRequest } from "./apiHelpers";
import { API_URLS } from "./apiUrls";
import apiClient from "./apiClient";

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
  const data = await makeRequest({
    url: API_URLS.GET_LOGIN_USER + `phone=${phone}`,
  });
  console.log(data);
  localStorage.setItem("token", data.jwt);
  localStorage.setItem("profile", JSON.stringify(data.profile));
  return data;
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
    const response = await apiClient.patch(
      API_URLS.UPLOAD_BRAND_LOGO,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
  applicationId,
  amount,
  details,
  attachments
) => {
  const data = await makeRequest({
    method: "POST",
    url: API_URLS.CREATE_OFFER,
    data: { applicationId, amount, details, attachments },
  });
  return data;
};
