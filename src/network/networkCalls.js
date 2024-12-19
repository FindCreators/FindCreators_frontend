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
