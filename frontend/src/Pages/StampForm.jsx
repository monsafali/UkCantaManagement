import { useState, useEffect } from "react";
import useProductStore from "../store/productStore";
import products from "../../products";

const initialFormData = {
  vehicle: "XYZ",
  Party: "",
  Product: "",
  ProductId: "",
  Sr_No: "",
  Gross: "",
  Tare: "",
  Cash: "",
};

export default function StampForm() {
  const [formData, setFormData] = useState(initialFormData);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const generateStamp = useProductStore(
    (state) => state.generateStamp
  );

  const getSr = useProductStore(
    (state) => state.getSr
  );

  const loading = useProductStore(
    (state) => state.loading
  );

  // =========================
  // GET SR
  // =========================

  useEffect(() => {
    const fetchSr = async () => {
      try {
        const sr = await getSr();

        setFormData((prev) => ({
          ...prev,
          Sr_No: sr,
        }));
      } catch (error) {
        console.error("SR fetch failed:", error);
      }
    };

    fetchSr();
  }, [getSr]);

  // =========================
  // DARK MODE
  // =========================

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    const isTextField = [
      "vehicle",
      "Party",
      "Product",
    ].includes(name);

    setFormData((prev) => ({
      ...prev,
      [name]: isTextField
        ? value.toUpperCase()
        : value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const pdfBlob = await generateStamp(formData);

      const url = window.URL.createObjectURL(pdfBlob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "e-stamp.pdf";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

      // Reset form
      setFormData(initialFormData);

      // Get new SR
      const newSr = await getSr();

      setFormData((prev) => ({
        ...prev,
        Sr_No: newSr,
      }));
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to generate stamp"
      );
    }
  };

  const inputClass = `w-full border p-2 rounded-md ${
    darkMode
      ? "bg-gray-800 text-white border-gray-600"
      : "bg-white text-black border-gray-300"
  }`;

  return (
    <div
      className={`min-h-screen w-full flex justify-center items-start pt-10 ${
        darkMode
          ? "bg-gray-950 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`max-w-md w-full p-6 shadow-lg rounded-xl ${
          darkMode
            ? "bg-gray-900"
            : "bg-white"
        }`}
      >
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() =>
              setDarkMode((prev) => !prev)
            }
            className={`px-4 py-2 rounded-md font-medium ${
              darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            {darkMode
              ? "☀ Light"
              : "🌙 Dark"}
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          BANK OF UNLIMITED
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            placeholder="Sr No"
            name="Sr_No"
            value={formData.Sr_No}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            placeholder="Vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            placeholder="Party"
            name="Party"
            value={formData.Party}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="number"
            placeholder="Enter Product Code"
            onChange={(e) => {
              const val = e.target.value;

              if (products[val]) {
                setFormData((prev) => ({
                  ...prev,
                  Product: products[val],
                  ProductId: val,
                }));
              }
            }}
            className={inputClass}
          />

          <select
            name="Product"
            value={formData.Product}
            onChange={(e) => {
              const selectedName = e.target.value;

              const selectedId =
                Object.keys(products).find(
                  (key) =>
                    products[key] === selectedName
                );

              setFormData((prev) => ({
                ...prev,
                Product: selectedName,
                ProductId: selectedId,
              }));
            }}
            className={inputClass}
          >
            <option value="">
              Select Product
            </option>

            {Object.entries(products).map(
              ([id, name]) => (
                <option
                  key={id}
                  value={name}
                >
                  {id} - {name}
                </option>
              )
            )}
          </select>

          <input
            type="number"
            placeholder="First"
            name="Gross"
            value={formData.Gross}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="number"
            placeholder="Second"
            name="Tare"
            value={formData.Tare}
            onChange={handleChange}
            className={inputClass}
          />

          <input
            type="number"
            placeholder="Cash"
            name="Cash"
            value={formData.Cash}
            onChange={handleChange}
            className={inputClass}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md font-medium bg-gray-800 text-white hover:bg-gray-900 disabled:bg-gray-400"
          >
            {loading
              ? "Please wait..."
              : "MONEY GENERATE"}
          </button>
        </form>
      </div>
    </div>
  );
}
