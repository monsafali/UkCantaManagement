import {
  X,
  TrendingUp,
  FileText,
  DollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function UserPerformanceModal({
  data,
  loading,
  onClose,
}) {
  if (!data && !loading) {
    return null;
  }

  const user = data?.user;

  const statistics =
    data?.statistics || {};

  const daily = data?.daily || [];

  const chartData = daily
    .slice()
    .reverse()
    .map((item) => ({
      date: item._id,
      entries: item.entries,
      revenue: item.revenue,
    }));

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between z-10">

          <div>
            <h2 className="text-xl font-bold">
              User Performance
            </h2>

            {user && (
              <p className="text-sm text-gray-500 mt-1">
                {user.fullname} @{user.username}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="p-16 flex justify-center">
            <div className="h-10 w-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="p-5 md:p-6">

            {/* User */}

            {user && (
              <div className="bg-gray-50 rounded-xl p-5 mb-6">

                <div className="flex items-center gap-4">

                  <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                    {user.fullname
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">
                      {user.fullname}
                    </h3>

                    <p className="text-sm text-gray-500">
                      @{user.username}
                    </p>

                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Stats */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FileText size={19} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Entries
                    </p>

                    <h3 className="text-2xl font-bold">
                      {statistics.totalEntries ||
                        0}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="border rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                    <DollarSign size={19} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Revenue
                    </p>

                    <h3 className="text-2xl font-bold text-green-600">
                      Rs.{" "}
                      {Number(
                        statistics.totalRevenue ||
                          0
                      ).toLocaleString()}
                    </h3>
                  </div>
                </div>
              </div>

            </div>

            {/* Chart */}

            <div className="border rounded-xl p-5">

              <div className="flex items-center gap-2 mb-5">
                <TrendingUp
                  size={20}
                  className="text-blue-600"
                />

                <div>
                  <h3 className="font-bold">
                    Daily Performance
                  </h3>

                  <p className="text-xs text-gray-500">
                    Last 30 days
                  </p>
                </div>
              </div>

              <div className="h-[320px]">

                {chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No performance data available.
                  </div>
                ) : (
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={chartData}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="date"
                        tick={{
                          fontSize: 11,
                        }}
                      />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="entries"
                        name="Entries"
                        fill="#2563eb"
                        radius={[
                          5,
                          5,
                          0,
                          0,
                        ]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}

              </div>
            </div>

   

          </div>
        )}
      </div>
    </div>
  );
}
