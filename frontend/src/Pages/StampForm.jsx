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
  const [formData, setFormData] =
    useState(initialFormData);

  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("darkMode") === "true"
    );
  });

  const [firstWeightSaved, setFirstWeightSaved] =
    useState(false);

  const saveFirstWeight =
    useProductStore(
      (state) => state.saveFirstWeight
    );

  const getFirstWeight =
    useProductStore(
      (state) => state.getFirstWeight
    );

  const generateStamp =
    useProductStore(
      (state) => state.generateStamp
    );

  const getSr =
    useProductStore(
      (state) => state.getSr
    );

  const loading =
    useProductStore(
      (state) => state.loading
    );

  // ==================================================
  // GET NEW SR
  // ==================================================

  useEffect(() => {
    const fetchSr = async () => {
      try {
        const sr = await getSr();

        setFormData((prev) => ({
          ...prev,
          Sr_No: sr,
        }));
      } catch (error) {
        console.error(
          "SR fetch failed:",
          error
        );
      }
    };

    fetchSr();
  }, [getSr]);

  // ==================================================
  // DARK MODE
  // ==================================================

  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      darkMode
    );
  }, [darkMode]);

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

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

  // ==================================================
  // PRODUCT CODE
  // ==================================================

  const handleProductCode = (e) => {
    const val = e.target.value;

    if (products[val]) {
      setFormData((prev) => ({
        ...prev,

        Product: products[val],

        ProductId: val,
      }));
    }
  };

  // ==================================================
  // PRODUCT SELECT
  // ==================================================

  const handleProductSelect = (e) => {
    const selectedName =
      e.target.value;

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
  };

  // ==================================================
  // SAVE FIRST WEIGHT
  // ==================================================

  const handleSaveFirstWeight =
    async () => {
      if (!formData.Sr_No) {
        alert("Sr No is required");
        return;
      }

      if (!formData.vehicle) {
        alert("Enter vehicle");
        return;
      }

      if (!formData.Party) {
        alert("Enter party");
        return;
      }

      if (!formData.Product) {
        alert("Select product");
        return;
      }

      if (
        formData.Gross === "" ||
        formData.Gross === null
      ) {
        alert("Enter first weight");
        return;
      }

      try {
        const response =
          await saveFirstWeight({
            Sr_No: formData.Sr_No,

            vehicle:
              formData.vehicle,

            Party:
              formData.Party,

            Product:
              formData.Product,

            ProductId:
              formData.ProductId,

            Gross:
              formData.Gross,
          });

        alert(
          `First weight saved successfully.\nSr No: ${response.srNo}`
        );

        setFirstWeightSaved(true);
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data
            ?.message ||
            "Failed to save first weight"
        );
      }
    };

  // ==================================================
  // LOAD FIRST WEIGHT
  // ==================================================

  const handleGetFirstWeight =
    async () => {
      if (!formData.Sr_No) {
        alert("Enter Sr No");
        return;
      }

      try {
        const product =
          await getFirstWeight(
            formData.Sr_No
          );

        setFormData((prev) => ({
          ...prev,

          Sr_No:
            product.Sr_No,

          vehicle:
            product.vehicle || "",

          Party:
            product.Party || "",

          Product:
            product.Product || "",

          ProductId:
            product.ProductId || "",

          Gross:
            product.Gross || "",
        }));

        setFirstWeightSaved(true);

        alert(
          "First weight loaded successfully"
        );
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data
            ?.message ||
            "First weight not found"
        );
      }
    };

  // ==================================================
  // GENERATE STAMP
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Gross) {
      alert("Enter first weight");
      return;
    }

    if (!formData.Tare) {
      alert("Enter second weight");
      return;
    }

    try {
      const pdfBlob =
        await generateStamp(
          formData
        );

      const url =
        window.URL.createObjectURL(
          pdfBlob
        );

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "e-stamp.pdf";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

      // ------------------------------------------
      // RESET FORM
      // ------------------------------------------

      setFormData(
        initialFormData
      );

      setFirstWeightSaved(
        false
      );

      // ------------------------------------------
      // GET NEW SR
      // ------------------------------------------

      const newSr =
        await getSr();

      setFormData((prev) => ({
        ...prev,

        Sr_No: newSr,
      }));
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data
          ?.message ||
          "Failed to generate stamp"
      );
    }
  };

  // ==================================================
  // INPUT CLASS
  // ==================================================

  const inputClass = `
    w-full
    border
    p-2
    rounded-md
    ${
      darkMode
        ? "bg-gray-800 text-white border-gray-600"
        : "bg-white text-black border-gray-300"
    }
  `;

  return (
    <div
      className={`
        min-h-screen
        w-full
        flex
        justify-center
        items-start
        pt-10
        ${
          darkMode
            ? "bg-gray-950 text-white"
            : "bg-gray-100 text-black"
        }
      `}
    >
      <div
        className={`
          max-w-md
          w-full
          p-6
          shadow-lg
          rounded-xl
          ${
            darkMode
              ? "bg-gray-900"
              : "bg-white"
          }
        `}
      >
        {/* DARK MODE */}

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() =>
              setDarkMode(
                (prev) => !prev
              )
            }
            className={`
              px-4
              py-2
              rounded-md
              font-medium
              ${
                darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800 text-white"
              }
            `}
          >
            {darkMode
              ? "☀ Light"
              : "🌙 Dark"}
          </button>
        </div>

        {/* TITLE */}

        <h2 className="text-2xl font-bold text-center mb-6">
          BANK OF UNLIMITED
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* SR */}

          <input
            placeholder="Sr No"
            name="Sr_No"
            value={formData.Sr_No}
            onChange={handleChange}
            className={inputClass}
          />

          {/* VEHICLE */}

          <input
            placeholder="Vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className={inputClass}
          />

          {/* PARTY */}

          <input
            placeholder="Party"
            name="Party"
            value={formData.Party}
            onChange={handleChange}
            className={inputClass}
          />

          {/* PRODUCT CODE */}

          <input
            type="number"
            placeholder="Enter Product Code"
            onChange={
              handleProductCode
            }
            className={inputClass}
          />

          {/* PRODUCT */}

          <select
            name="Product"
            value={
              formData.Product
            }
            onChange={
              handleProductSelect
            }
            className={inputClass}
          >
            <option value="">
              Select Product
            </option>

            {Object.entries(
              products
            ).map(
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

          {/* FIRST WEIGHT */}

          <div>
            <label className="block text-sm font-medium mb-1">
              First Weight
            </label>

            <input
              type="number"
              placeholder="Enter First Weight"
              name="Gross"
              value={
                formData.Gross
              }
              onChange={
                handleChange
              }
              className={
                inputClass
              }
            />
          </div>

          {/* SECOND WEIGHT */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Second Weight
            </label>

            <input
              type="number"
              placeholder="Enter Second Weight"
              name="Tare"
              value={
                formData.Tare
              }
              onChange={
                handleChange
              }
              className={
                inputClass
              }
            />
          </div>

          {/* CASH */}

          <input
            type="number"
            placeholder="Cash"
            name="Cash"
            value={
              formData.Cash
            }
            onChange={
              handleChange
            }
            className={inputClass}
          />

          {/* ======================================
              FIRST WEIGHT BUTTON
          ====================================== */}

          <button
            type="button"
            onClick={
              handleSaveFirstWeight
            }
            disabled={
              loading ||
              firstWeightSaved
            }
            className="
              w-full
              py-2
              rounded-md
              font-medium
              bg-blue-600
              text-white
              hover:bg-blue-700
              disabled:bg-gray-400
            "
          >
            {firstWeightSaved
              ? "✓ First Weight Saved"
              : loading
              ? "Saving..."
              : "Save First Weight"}
          </button>

          {/* ======================================
              GET FIRST WEIGHT
          ====================================== */}

          <button
            type="button"
            onClick={
              handleGetFirstWeight
            }
            disabled={loading}
            className="
              w-full
              py-2
              rounded-md
              font-medium
              bg-orange-500
              text-white
              hover:bg-orange-600
              disabled:bg-gray-400
            "
          >
            {loading
              ? "Loading..."
              : "Get First Weight"}
          </button>

          {/* ======================================
              GENERATE
          ====================================== */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-2
              rounded-md
              font-medium
              bg-gray-800
              text-white
              hover:bg-gray-900
              disabled:bg-gray-400
            "
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
