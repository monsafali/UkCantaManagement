import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function DailyCharts({ data }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Entries */}

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="font-bold text-lg">Daily Entries</h2>

          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>

        <div className="h-[320px]">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              No entry data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="entries"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                  name="Entries"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Revenue */}

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="font-bold text-lg">Daily Revenue</h2>

          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>

        <div className="h-[320px]">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              No revenue data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={false}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
