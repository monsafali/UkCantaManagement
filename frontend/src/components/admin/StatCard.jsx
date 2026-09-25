export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = "bg-blue-100 text-blue-600",
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            {value}
          </h2>

          {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
        </div>

        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}
