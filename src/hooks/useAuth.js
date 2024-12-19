import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    logout: handleLogout,
  };
};
