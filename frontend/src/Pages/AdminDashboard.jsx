import { useEffect, useState } from "react";

import {
  Users,
  UserCheck,
  FileText,
  DollarSign,
  UserX,
  CalendarDays,
} from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import StatCard from "../components/admin/StatCard";
import DailyCharts from "../components/admin/DailyCharts";
import UserPerformanceChart from "../components/admin/UserPerformanceChart";
import UsersTable from "../components/admin/UsersTable";
import CreateUserModal from "../components/admin/CreateUserModal";
import UserPerformanceModal from "../components/admin/UserPerformanceModal";

import useAdminStore from "../store/adminStore";

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  const [
    selectedUser,
    setSelectedUser,
  ] = useState(null);

  const dashboard = useAdminStore(
    (state) => state.dashboard
  );

  const users = useAdminStore(
    (state) => state.users
  );

  const loading = useAdminStore(
    (state) => state.loading
  );

  const usersLoading = useAdminStore(
    (state) => state.usersLoading
  );

  const performanceLoading =
    useAdminStore(
      (state) => state.performanceLoading
    );

  const userPerformance =
    useAdminStore(
      (state) => state.userPerformance
    );

  const getAdminDashboard =
    useAdminStore(
      (state) => state.getAdminDashboard
    );

  const getAllUsers =
    useAdminStore(
      (state) => state.getAllUsers
    );

  const createUser =
    useAdminStore(
      (state) => state.createUser
    );

  const toggleUserStatus =
    useAdminStore(
      (state) => state.toggleUserStatus
    );

  const deleteUser =
    useAdminStore(
      (state) => state.deleteUser
    );

  const getUserPerformance =
    useAdminStore(
      (state) => state.getUserPerformance
    );

  const clearUserPerformance =
    useAdminStore(
      (state) =>
        state.clearUserPerformance
    );

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    getAdminDashboard();
    getAllUsers();
  }, [
    getAdminDashboard,
    getAllUsers,
  ]);

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = async () => {
    await Promise.all([
      getAdminDashboard(),
      getAllUsers(),
    ]);
  };

  // ==========================================
  // CREATE USER
  // ==========================================

  const handleCreateUser = async (data) => {
    await createUser(data);
  };

  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  const handleToggleUser = async (user) => {
    const action = user.isActive
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.fullname}?`
    );

    if (!confirmed) return;

    try {
      await toggleUserStatus(user._id);
    } catch {
      // store already handles error
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${user.fullname}?`
    );

    if (!confirmed) return;

    try {
      await deleteUser(user._id);
    } catch {
      // store already handles error
    }
  };

  // ==========================================
  // PERFORMANCE
  // ==========================================

  const handlePerformance = async (user) => {
    setSelectedUser(user);

    try {
      await getUserPerformance(user._id);
    } catch {
      // store already handles error
    }
  };

  // ==========================================
  // DATA
  // ==========================================

  const stats = dashboard?.users || {};

  const overall =
    dashboard?.overall || {};

  const today =
    dashboard?.today || {};

  const dailyPerformance =
    dashboard?.dailyPerformance || [];

  const userPerformanceData =
    dashboard?.userPerformance || [];

  const dailyChartData =
    dailyPerformance.map((item) => ({
      date: item._id,
      entries: item.entries,
      revenue: item.revenue,
    }));

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Sidebar */}

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main */}

      <div className="lg:ml-72">

        <AdminHeader
          setMobileOpen={setMobileOpen}
          onRefresh={handleRefresh}
          loading={loading}
        />

        <main className="p-4 md:p-6 lg:p-8">

          {/* ======================================
              PAGE TITLE
          ====================================== */}

          <div className="mb-7">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor users, entries and revenue
              from one place.
            </p>
          </div>

          {/* ======================================
              STATS
          ====================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            <StatCard
              title="Total Users"
              value={stats.total || 0}
              subtitle="Registered users"
              icon={Users}
              iconClass="bg-blue-100 text-blue-600"
            />

            <StatCard
              title="Active Users"
              value={stats.active || 0}
              subtitle={`${
                stats.inactive || 0
              } inactive users`}
              icon={UserCheck}
              iconClass="bg-green-100 text-green-600"
            />

            <StatCard
              title="Total Entries"
              value={
                overall.totalEntries || 0
              }
              subtitle="All product entries"
              icon={FileText}
              iconClass="bg-purple-100 text-purple-600"
            />

            <StatCard
              title="Total Revenue"
              value={`Rs. ${Number(
                overall.totalRevenue || 0
              ).toLocaleString()}`}
              subtitle="Overall revenue"
              icon={DollarSign}
              iconClass="bg-orange-100 text-orange-600"
            />

          </div>

          {/* ======================================
              TODAY
          ====================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

            <StatCard
              title="Today's Entries"
              value={today.entries || 0}
              subtitle="Entries generated today"
              icon={CalendarDays}
              iconClass="bg-cyan-100 text-cyan-600"
            />

            <StatCard
              title="Today's Revenue"
              value={`Rs. ${Number(
                today.revenue || 0
              ).toLocaleString()}`}
              subtitle="Revenue generated today"
              icon={DollarSign}
              iconClass="bg-emerald-100 text-emerald-600"
            />

          </div>

          {/* ======================================
              DAILY CHARTS
          ====================================== */}

          <div className="mt-7">
            <DailyCharts
              data={dailyChartData}
            />
          </div>

          {/* ======================================
              USER PERFORMANCE CHART
          ====================================== */}

          <div className="mt-7">
            <UserPerformanceChart
              data={userPerformanceData}
            />
          </div>

          {/* ======================================
              USERS
          ====================================== */}

          <div className="mt-7">
            <UsersTable
              users={users}
              loading={usersLoading}
              onCreate={() =>
                setCreateModalOpen(true)
              }
              onToggle={handleToggleUser}
              onDelete={handleDeleteUser}
              onPerformance={
                handlePerformance
              }
            />
          </div>

        </main>
      </div>

      {/* ==========================================
          CREATE USER MODAL
      ========================================== */}

      <CreateUserModal
        open={createModalOpen}
        onClose={() =>
          setCreateModalOpen(false)
        }
        onCreate={handleCreateUser}
        loading={usersLoading}
      />

      {/* ==========================================
          USER PERFORMANCE MODAL
      ========================================== */}

      {(selectedUser ||
        userPerformance) && (
        <UserPerformanceModal
          data={userPerformance}
          loading={performanceLoading}
          onClose={() => {
            setSelectedUser(null);
            clearUserPerformance();
          }}
        />
      )}

    </div>
  );
}
