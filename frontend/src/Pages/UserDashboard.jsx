import { useState } from "react";
import useAuthStore from "../store/authStore";

import StampForm from "../components/user/StampForm";
import SearchStamp from "../components/user/SearchStamp";
import DateReport from "../components/user/DateReport";

export default function UserDashboard() {
  const [activePage, setActivePage] = useState("stamp");

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case "stamp":
        return <StampForm />;

      case "search":
        return <SearchStamp />;

      case "report":
        return <DateReport />;

      default:
        return <StampForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* =========================
          SIDEBAR
      ========================== */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 bottom-0">
        {/* Logo / Title */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">BANK OF UNLIMITED</h1>

          <p className="text-sm text-gray-400 mt-1">User Dashboard</p>
        </div>

        {/* =========================
            USER INFO
        ========================== */}
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="font-semibold truncate">{user?.name || "User"}</p>

              <p className="text-xs text-gray-400 truncate">
                {user?.email || "No email"}
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActivePage("stamp")}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activePage === "stamp"
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            📝 Generate Stamp
          </button>

          <button
            onClick={() => setActivePage("search")}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activePage === "search"
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            🔍 Search / Reprint
          </button>

          <button
            onClick={() => setActivePage("report")}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              activePage === "report"
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            📊 Date Report
          </button>
        </nav>

        {/* =========================
            LOGOUT
        ========================== */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition font-medium"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="ml-64 flex-1 min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm px-8 py-5">
          <h2 className="text-2xl font-bold text-gray-800">
            {activePage === "stamp" && "Generate Stamp"}
            {activePage === "search" && "Search / Reprint Stamp"}
            {activePage === "report" && "Date Report"}
          </h2>
        </header>

        {/* Page Content */}
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
