import { useEffect, useState } from "react";

import UsersTable from "./UsersTable";
import CreateUserModal from "./CreateUserModal";
import UserPerformanceModal from "./UserPerformanceModal";


import useAdminStore from "../../store/adminStore";


export default function AdminUsers() {
  // ==========================================
  // LOCAL STATE
  // ==========================================

  const [createOpen, setCreateOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // ==========================================
  // ADMIN STORE
  // ==========================================

  const users = useAdminStore((state) => state.users);

  const usersLoading = useAdminStore(
    (state) => state.usersLoading
  );

  const performanceLoading = useAdminStore(
    (state) => state.performanceLoading
  );

  const userPerformance = useAdminStore(
    (state) => state.userPerformance
  );

  const getAllUsers = useAdminStore(
    (state) => state.getAllUsers
  );

  const createUser = useAdminStore(
    (state) => state.createUser
  );

  const toggleUserStatus = useAdminStore(
    (state) => state.toggleUserStatus
  );

  const deleteUser = useAdminStore(
    (state) => state.deleteUser
  );

  const getUserPerformance = useAdminStore(
    (state) => state.getUserPerformance
  );

  const clearUserPerformance = useAdminStore(
    (state) => state.clearUserPerformance
  );

  // ==========================================
  // GET USERS
  // ==========================================

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);


  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Permanently delete ${user.fullname}?`
      )
    ) {
      return;
    }

    await deleteUser(user._id);
  };

  // ==========================================
  // USER PERFORMANCE
  // ==========================================

  const handlePerformance = async (user) => {
    setSelectedUser(user);

    await getUserPerformance(user._id);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <div className="mb-7">
        <h1 className="text-3xl font-bold">
          Manage Users
        </h1>

        <p className="text-gray-500 mt-1">
          Create, activate, deactivate, delete and
          monitor users.
        </p>
      </div>


      <UsersTable
        users={users}
        loading={usersLoading}
        onCreate={() => setCreateOpen(true)}
        onDelete={handleDelete}
        onPerformance={handlePerformance}
      />

      {/* CREATE USER */}

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createUser}
        loading={usersLoading}
      />

      {/* USER PERFORMANCE */}

      {(selectedUser || userPerformance) && (
        <UserPerformanceModal
          data={userPerformance}
          loading={performanceLoading}
          onClose={() => {
            setSelectedUser(null);
            clearUserPerformance();
          }}
        />
      )}
    </>
  );
}
