import { makeRequest } from "./apiHelpers";
import { API_URLS } from "./apiUrls";

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
