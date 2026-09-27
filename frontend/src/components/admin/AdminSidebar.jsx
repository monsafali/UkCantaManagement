// components/admin/AdminSidebar.jsx

import {
  LayoutDashboard,
  Users,
  FileBarChart,
  LogOut,
  X,
  Stamp,
} from "lucide-react";

import useAuthStore from "../../store/authStore";

const menuItems = [
  {
    name: "Dashboard",
    page: "dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Manage Users",
    page: "users",
    icon: Users,
  },
  {
    name: "Reports",
    page: "reports",
    icon: FileBarChart,
  },
];

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
  activePage,
  setActivePage,
}) {
  const logout = useAuthStore((state) => state.logout);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await logout();

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ==========================================
  // MENU CLICK
  // ==========================================

const handleMenuClick = (page) => {
  if (typeof setActivePage !== "function") {
    console.error("setActivePage is not a function:", setActivePage);
    return;
  }

  setActivePage(page);

  if (typeof setMobileOpen === "function") {
    setMobileOpen(false);
  }
};

  return (
    <>
      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ======================================
          SIDEBAR
      ====================================== */}

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
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* ======================================
            LOGO
        ====================================== */}

        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Stamp size={23} />
            </div>

            <div>
              <h1 className="font-bold text-lg">
                Computer Canta
              </h1>

              <p className="text-xs text-slate-400">
                Administration
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* ======================================
            NAVIGATION
        ====================================== */}

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-3 mb-3 text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activePage === item.page;

            return (
              <button
                key={item.page}
                type="button"
                onClick={() =>
                  handleMenuClick(item.page)
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  transition
                  text-left
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ======================================
            LOGOUT
        ====================================== */}

        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={20} />

            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
