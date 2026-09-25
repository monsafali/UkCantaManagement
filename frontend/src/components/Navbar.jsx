import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Navbar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();

    navigate("/login", { replace: true });
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-6">


        {user.role === "User" && (
          <>
            <Link
              to="/"
              className="hover:text-gray-300"
            >
              Create Stamp
            </Link>

            <Link
              to="/search"
              className="hover:text-gray-300"
            >
              Search Stamp
            </Link>

            <Link
              to="/report"
              className="hover:text-gray-300"
            >
              Report
            </Link>
                
          </>
        )}

        {user.role === "Admin" && (
          <Link
            to="/admin"
            className="hover:text-gray-300"
          >
            Admin Dashboard
          </Link>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">
            {user.fullname}
          </p>

          <p className="text-xs text-gray-300">
            {user.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
