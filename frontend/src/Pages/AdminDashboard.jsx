// pages/AdminDashboard.jsx

import { useEffect, useState } from "react";

import {
  Users,
  UserCheck,
  FileText,
  DollarSign,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import StatCard from "../components/admin/StatCard";
import DailyCharts from "../components/admin/DailyCharts";
import UserPerformanceChart from "../components/admin/UserPerformanceChart";

import useAdminStore from "../store/adminStore";

export default function AdminDashboard() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const dashboard = useAdminStore(
    (state) => state.dashboard,
  );

  const loading = useAdminStore(
    (state) => state.loading,
  );

  const getAdminDashboard =
    useAdminStore(
      (state) =>
        state.getAdminDashboard,
    );

  useEffect(() => {
    getAdminDashboard();
  }, [getAdminDashboard]);

  const handleRefresh = () => {
    getAdminDashboard();
  };

  const users =
    dashboard?.users || {};

  const overall =
    dashboard?.overall || {};

  const today =
    dashboard?.today || {};

  const dailyPerformance =
    dashboard?.dailyPerformance || [];

  const userPerformance =
    dashboard?.userPerformance || [];

  const chartData =
    dailyPerformance.map((item) => ({
      date: item._id,
      entries: item.entries,
      revenue: item.revenue,
    }));

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:ml-72">
        <AdminHeader
          setMobileOpen={setMobileOpen}
          onRefresh={handleRefresh}
          loading={loading}
        />

        <main className="p-4 md:p-6 lg:p-8">
          {/* HEADER */}

          <div className="mb-7">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor users, entries and
              revenue from one place.
            </p>
          </div>

          {/* MAIN STATS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard
              title="Total Users"
              value={users.total || 0}
              subtitle="Registered users"
              icon={Users}
              iconClass="bg-blue-100 text-blue-600"
            />

            <StatCard
              title="Active Users"
              value={users.active || 0}
              subtitle={`${users.inactive || 0} inactive users`}
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
                overall.totalRevenue || 0,
              ).toLocaleString()}`}
              subtitle="Overall revenue"
              icon={DollarSign}
              iconClass="bg-orange-100 text-orange-600"
            />
          </div>

          {/* TODAY */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
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
                today.revenue || 0,
              ).toLocaleString()}`}
              subtitle="Revenue generated today"
              icon={TrendingUp}
              iconClass="bg-emerald-100 text-emerald-600"
            />

            <StatCard
              title="Inactive Users"
              value={users.inactive || 0}
              subtitle="Users currently inactive"
              icon={Users}
              iconClass="bg-red-100 text-red-600"
            />
          </div>

          {/* DAILY CHARTS */}

          <div className="mt-7">
            <DailyCharts
              data={chartData}
            />
          </div>

          {/* USER PERFORMANCE */}

          <div className="mt-7">
            <UserPerformanceChart
              data={userPerformance}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
