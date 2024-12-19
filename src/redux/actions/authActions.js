import { loginStart, loginSuccess, loginFailure } from "../slices/authSlice";
import { loginUser, createUser } from "../../network/networkCalls";

export const login = (phone) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const cleanedPhone = phone.replace(/^91/, "");
    const response = await loginUser(cleanedPhone);
    dispatch(loginSuccess(response));
    return response;
  } catch (error) {
    dispatch(loginFailure(error.message));
    throw error;
  }
};

export const signup = (entity, profile) => async (dispatch) => {
  try {
    dispatch(loginStart());
    if (profile.phone) {
      profile.phone = profile.phone.replace(/^91/, "");
    }
    const response = await createUser(entity, profile);
    dispatch(loginSuccess(response));
    return response;
  } catch (error) {
    dispatch(loginFailure(error.message));
    throw error;
  }
};
