import {
  Eye,
  UserCheck,
  UserX,
  Trash2,
  Plus,
} from "lucide-react";

export default function UsersTable({
  users,
  loading,
  onCreate,
  onToggle,
  onDelete,
  onPerformance,
}) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

      {/* Header */}

      <div className="p-5 md:p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold">
            Manage Users
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage accounts and track individual
            performance.
          </p>
        </div>

        <button
          onClick={onCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Create User
        </button>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[850px]">

          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-xs uppercase text-gray-500">
                User
              </th>

              <th className="text-left px-6 py-4 text-xs uppercase text-gray-500">
                Email
              </th>

              <th className="text-left px-6 py-4 text-xs uppercase text-gray-500">
                Status
              </th>

              <th className="text-left px-6 py-4 text-xs uppercase text-gray-500">
                Joined
              </th>

              <th className="text-right px-6 py-4 text-xs uppercase text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-12 text-gray-500"
                >
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-12 text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50"
                >
                  {/* User */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {user.fullname
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.fullname}
                        </p>

                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}

                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    {user.isActive ? (
                      <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Date */}

                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">

                      {/* Performance */}

                      <button
                        onClick={() =>
                          onPerformance(user)
                        }
                        title="View performance"
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={17} />
                      </button>


                      {/* Delete */}

                      <button
                        onClick={() =>
                          onDelete(user)
                        }
                        title="Delete user"
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}
