import { makeRequest } from "./apiHelpers";
import { API_URLS } from "./apiUrls";


export const validateNewEmailorPhone = async({entity,email="",phone=""})=>{
        const data = await makeRequest({
            url: API_URLS.GET_VALIDATE_NEW_EMAIL_OR_PHONE +`entity=${entity}&email=${email}&phone=${phone}`
          });
          return data;
    
} 
export const loginUser = async(phone)=>{
    const data = await makeRequest({
        url: API_URLS.GET_LOGIN_USER+`phone=${phone}`,
      });
      console.log(data);
      ////update here properly 


      
    localStorage.setItem("token", data.jwt)
    localStorage.setItem("profile", JSON.stringify(data.profile))
      return data;
}

export const createUser = async(entity,profile)=>{
        const data = await makeRequest({
            method:'post',
            url: entity==='creator'?API_URLS.POST_CREATOR_SIGNUP:API_URLS.POST_BRAND_SIGNUP,
            data:profile
          });
        localStorage.setItem("token", data.jwt)
        localStorage.setItem("profile", JSON.stringify(data.profile))
          return data;
    
}
// export const verifyPhoneToken = async (idToken) => {
//   const data = await makeRequest({
//     method: "post",
//     url: API_URLS.VERIFY_PHONE_TOKEN,
//     data: { idToken },
//   });
//   return data;
// };

// export const verifyGoogleToken = async (idToken) => {
//   const data = await makeRequest({
//     method: "post",
//     url: API_URLS.VERIFY_GOOGLE_TOKEN,
//     data: { idToken },
//   });
//   return data;
// };

// export const getProfile = async () => {
//   const data = await makeRequest({
//     method: "get",
//     url: API_URLS.GET_PROFILE,
//   });
//   return data;
// };

// export const logoutUser = () => {
//   const itemsToClear = ["token", "userState", "logintype", "number", "email"];

//   itemsToClear.forEach((item) => localStorage.removeItem(item));
// };

// export const storeUserData = (response) => {
//   if (response.success && response.token) {
//     localStorage.setItem("token", response.token);
//     localStorage.setItem("userState", JSON.stringify(response.user));

//     if (response.user.phoneNumber) {
//       localStorage.setItem("number", response.user.phoneNumber);
//       localStorage.setItem("logintype", "phone");
//     } else if (response.user.email) {
//       localStorage.setItem("email", response.user.email);
//       localStorage.setItem("logintype", "google");
//     }
//   }
// };
// export const getTripPreferences = async () => {
//   const data = await makeRequest({
//     method: "get",
//     url: API_URLS.GET_TRIP_PREFERENCES,
//   });
//   return data;
// };

// export const createExploreType = async (exploreTypeData) => {
//   const data = await makeRequest({
//     method: "post",
//     url: API_URLS.CREATE_TRIP_TYPE,
//     data: exploreTypeData,
//   });
//   return data;
// };

// export const getTripSuggestions = async (
//   days,
//   budget,
//   interests,
//   tripType,
//   page
// ) => {
//   const data = await makeRequest({
//     method: "post",
//     url: API_URLS.GET_TRIP_SUGGESTIONS,
//     data: { days, budget, interests, tripType, page },
//   });
//   return data;
// };

// export const getTrendingTrips = async () => {
//   const data = await makeRequest({
//     method: "get",
//     url: API_URLS.GET_TRENDING_TRIPS,
//   });
//   return data;
// };

// export const getRouteOptions = async (source, destination) => {
//   const data = await makeRequest({
//     method: "post",
//     url: API_URLS.GET_ROUTE_OPTIONS,
//     data: { source, destination },
//   });
//   return data;
// };

// export const getPlaceImages = async (placeName) => {
//   const data = await makeRequest({
//     method: "get",
//     url: API_URLS.GET_PLACE_IMAGES,
//     params: { placeName },
//   });
//   return data;
// };