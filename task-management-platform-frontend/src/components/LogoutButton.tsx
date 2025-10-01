import { useDispatch } from "react-redux";
import { clearCredentials } from "../store/authSlice";

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials());
    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}
