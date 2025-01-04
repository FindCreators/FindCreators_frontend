import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return {
    isAuthenticated: auth.isAuthenticated,
    userType: auth.userType,
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    logout: handleLogout,
  };
};
