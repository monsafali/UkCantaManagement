import { Menu, Bell, RefreshCw } from "lucide-react";

import useAuthStore from "../../store/authStore";

export default function AdminHeader({ setMobileOpen, onRefresh, loading }) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={23} />
        </button>

        <div>
          <h1 className="font-bold text-lg text-gray-900">Admin Panel</h1>

          <p className="text-xs text-gray-500 hidden sm:block">
            Manage your application
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition"
          title="Refresh"
        >
          <RefreshCw size={19} className={loading ? "animate-spin" : ""} />
        </button>

        <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600">
          <Bell size={19} />
        </button>

        <div className="hidden sm:flex items-center gap-2 border-l pl-4">
          <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {user?.fullname?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div>
            <p className="text-sm font-semibold">{user?.fullname}</p>

            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
