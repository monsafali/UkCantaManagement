import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Stamp,
  LogOut,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  
];

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-72
          bg-slate-950
          text-white
          flex
          flex-col
          transition-transform
          duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}

        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Stamp size={23} />
            </div>

            <div>
              <h1 className="font-bold text-lg">Computer Canta</h1>

              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Admin Profile */}

        <div className="p-5">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                {user?.fullname?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">
                <p className="font-semibold truncate">{user?.fullname}</p>

                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <p className="px-3 mb-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }
                  `
                }
              >
                <Icon size={20} />

                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={20} />

            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
