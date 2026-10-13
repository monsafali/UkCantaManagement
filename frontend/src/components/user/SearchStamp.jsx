import { useState } from "react";
import useProductStore from "../../store/productStore";

export default function SearchStamp() {
  const [Sr_No, setSr_No] = useState("");

  const searchStamp = useProductStore((state) => state.searchStamp);

  const loading = useProductStore((state) => state.loading);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!Sr_No) {
      alert("Enter Sr No");
      return;
    }

    try {
      const pdfBlob = await searchStamp(Sr_No);

      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], {
          type: "application/pdf",
        }),
      );

      window.open(url, "_blank");

      setSr_No("");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Money not found");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Reprint</h2>

      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="number"
          placeholder="Enter Sr No"
          value={Sr_No}
          onChange={(e) => setSr_No(e.target.value)}
          className="w-full border p-2 rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Searching..." : "Print Money"}
        </button>
      </form>
    </div>
  );
}
