import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  if (!user) return <Navigate to="/" />;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.name}!</h2>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

export default Dashboard;