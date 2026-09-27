// pages/AdminReports.jsx

import { useEffect, useState } from "react";

import { FileDown, Search, CalendarDays, FileBarChart } from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import useAdminStore from "../../store/adminStore";

export default function AdminReports() {
  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const [userId, setUserId] = useState("all");

  const users = useAdminStore((state) => state.users);

  const reports = useAdminStore((state) => state.reports);

  const reportsLoading = useAdminStore((state) => state.reportsLoading);

  const getAllUsers = useAdminStore((state) => state.getAllUsers);

  const getAdminReports = useAdminStore((state) => state.getAdminReports);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleGenerate = async () => {
    if (!from || !to) {
      alert("Please select From Date and To Date.");
      return;
    }

    await getAdminReports({
      from,
      to,
      userId,
    });
  };

  // =================================================
  // PDF
  // =================================================

  const downloadPDF = () => {
    if (!reports) {
      alert("Generate a report first.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text("Computer Canta", 14, 18);

    doc.setFontSize(14);

    doc.text("Entries & Revenue Report", 14, 28);

    doc.setFontSize(10);

    doc.text(`Period: ${from} to ${to}`, 14, 36);

    const selectedUser =
      userId === "all"
        ? "All Users"
        : users.find((user) => user._id === userId)?.fullname ||
          "Selected User";

    doc.text(`User: ${selectedUser}`, 14, 42);

    // -----------------------------------------------
    // SUMMARY
    // -----------------------------------------------

    doc.setFontSize(13);

    doc.text("Summary", 14, 52);

    autoTable(doc, {
      startY: 57,

      head: [["Total Entries", "Total Revenue"]],

      body: [
        [
          reports.statistics?.totalEntries || 0,

          `Rs. ${Number(
            reports.statistics?.totalRevenue || 0,
          ).toLocaleString()}`,
        ],
      ],
    });

    doc.save(`computer-canta-report-${from}-to-${to}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="lg:ml-72">
        <main className="p-4 md:p-6 lg:p-8">
          {/* HEADER */}

          <div className="mb-7">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileBarChart size={24} />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>

                <p className="text-gray-500">
                  Generate entries and revenue reports.
                </p>
              </div>
            </div>
          </div>

          {/* FILTER */}

          <div className="bg-white rounded-2xl border shadow-sm p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* FROM */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* TO */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />

                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* USER */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  User
                </label>

                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>

                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.fullname} ({user.username})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleGenerate}
                disabled={reportsLoading}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                <Search size={18} />

                {reportsLoading ? "Generating..." : "Generate Report"}
              </button>

              {reports && (
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700"
                >
                  <FileDown size={18} />
                  Download PDF
                </button>
              )}
            </div>
          </div>

          {/* REPORT */}

          {reports && (
            <div className="mt-7 space-y-6">
              {/* SUMMARY */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border p-6">
                  <p className="text-sm text-gray-500">Total Entries</p>

                  <h2 className="text-3xl font-bold mt-2">
                    {reports.statistics?.totalEntries}
                  </h2>
                </div>

                <div className="bg-white rounded-2xl border p-6">
                  <p className="text-sm text-gray-500">Total Revenue</p>

                  <h2 className="text-3xl font-bold text-green-600 mt-2">
                    Rs.{" "}
                    {Number(
                      reports.statistics?.totalRevenue || 0,
                    ).toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
