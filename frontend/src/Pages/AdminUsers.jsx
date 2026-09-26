// pages/AdminUsers.jsx

import { useEffect, useState } from "react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import UsersTable from "../components/admin/UsersTable";
import CreateUserModal from "../components/admin/CreateUserModal";
import UserPerformanceModal from "../components/admin/UserPerformanceModal";

import useAdminStore from "../store/adminStore";

export default function AdminUsers() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const users = useAdminStore(
    (state) => state.users,
  );

  const usersLoading = useAdminStore(
    (state) => state.usersLoading,
  );

  const performanceLoading =
    useAdminStore(
      (state) =>
        state.performanceLoading,
    );

  const userPerformance =
    useAdminStore(
      (state) =>
        state.userPerformance,
    );

  const getAllUsers = useAdminStore(
    (state) => state.getAllUsers,
  );

  const createUser = useAdminStore(
    (state) => state.createUser,
  );

  const toggleUserStatus =
    useAdminStore(
      (state) =>
        state.toggleUserStatus,
    );

  const deleteUser = useAdminStore(
    (state) => state.deleteUser,
  );

  const getUserPerformance =
    useAdminStore(
      (state) =>
        state.getUserPerformance,
    );

  const clearUserPerformance =
    useAdminStore(
      (state) =>
        state.clearUserPerformance,
    );

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleToggle = async (user) => {
    const action = user.isActive
      ? "deactivate"
      : "activate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${user.fullname}?`,
      )
    ) {
      return;
    }

    await toggleUserStatus(user._id);
  };

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Permanently delete ${user.fullname}?`,
      )
    ) {
      return;
    }

    await deleteUser(user._id);
  };

  const handlePerformance = async (
    user,
  ) => {
    setSelectedUser(user);

    await getUserPerformance(
      user._id,
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:ml-72">
        <AdminHeader
          setMobileOpen={setMobileOpen}
          onRefresh={getAllUsers}
          loading={usersLoading}
        />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-7">
            <h1 className="text-3xl font-bold">
              Manage Users
            </h1>

            <p className="text-gray-500 mt-1">
              Create, activate, deactivate,
              delete and monitor users.
            </p>
          </div>

          <UsersTable
            users={users}
            loading={usersLoading}
            onCreate={() =>
              setCreateOpen(true)
            }
            onToggle={handleToggle}
            onDelete={handleDelete}
            onPerformance={
              handlePerformance
            }
          />
        </main>
      </div>

      <CreateUserModal
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onCreate={createUser}
        loading={usersLoading}
      />

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
