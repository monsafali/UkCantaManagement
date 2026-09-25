import { useState } from "react";
import { X, UserPlus } from "lucide-react";

export default function CreateUserModal({
  open,
  onClose,
  onCreate,
  loading,
}) {
  const [formData, setFormData] =
    useState({
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    try {
      await onCreate(formData);

      setFormData({
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create user"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <UserPlus size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Create User
              </h2>

              <p className="text-sm text-gray-500">
                Add a new system user
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <input
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create User"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
