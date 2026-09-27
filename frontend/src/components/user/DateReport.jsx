import { useState } from "react";
import useProductStore from "../../store/productStore";

export default function DateReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const downloadReport = useProductStore((state) => state.downloadReport);

  const loading = useProductStore((state) => state.loading);

  const handleDownload = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }

    try {
      const pdfBlob = await downloadReport(fromDate, toDate);

      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], {
          type: "application/pdf",
        }),
      );

      const link = document.createElement("a");

      link.href = url;

      link.download = `report-${fromDate}-to-${toDate}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to download PDF");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Download PDF Report
      </h2>

      <form onSubmit={handleDownload} className="space-y-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-full border p-2 rounded-md"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="w-full border p-2 rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? "Downloading..." : "Download PDF"}
        </button>
      </form>
    </div>
  );
}
