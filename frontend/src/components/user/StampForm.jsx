import useStampForm from "../../hooks/useStampForm";
import products from "../../../products";
import { useState } from "react";
export default function StampForm() {
  const {
    formData,
    firstWeightSaved,

    savingFirstWeight,
    gettingFirstWeight,
    generatingStamp,

    handleChange,
    handleProductCode,
    handleProductSelect,

    handleSaveFirstWeight,
    handleGetFirstWeight,
    handleSubmit,
  } = useStampForm();
  const [searchSrNo, setSearchSrNo] = useState("");
  const inputClass = `
    w-full
    border
    border-gray-300
    bg-white
    text-black
    p-2
    rounded-md
  `;

  return (
    <div
      className="
    min-h-screen
    w-full
    flex
    justify-center
    items-start
    pt-10
    bg-gray-100
    text-black
  "
    >
      <div
        className="
      flex
      flex-col
      w-full
      max-w-5xl
      p-6
      shadow-lg
      rounded-xl
      bg-white
    "
      >
        {/* TITLE */}

        <h2 className="text-2xl font-bold text-center mb-6">
          UK Computer Canta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ======================================
          FORM FIELDS
      ====================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SR NO */}

            <div>
              <label className="block text-sm font-medium mb-1">Sr No</label>

              <input
                type="number"
                name="Sr_No"
                value={formData.Sr_No}
                readOnly
                className={`${inputClass} bg-gray-100 cursor-not-allowed`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Enter Sr No to Get First Weight
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  placeholder="Enter existing Sr No"
                  value={searchSrNo}
                  onChange={(e) => setSearchSrNo(e.target.value)}
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={() => handleGetFirstWeight(searchSrNo)}
                  disabled={gettingFirstWeight || !searchSrNo}
                  className="
        px-5 py-2
        rounded-md
        font-medium
        bg-orange-500
        text-white
        hover:bg-orange-600
        disabled:bg-gray-400
        whitespace-nowrap
      "
                >
                  {gettingFirstWeight ? "Loading..." : "Get 1st Weight"}
                </button>
              </div>
            </div>

            {/* VEHICLE */}

            <div>
              <label className="block text-sm font-medium mb-1">Vehicle</label>

              <input
                placeholder="Enter Vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* PARTY */}

            <div>
              <label className="block text-sm font-medium mb-1">Party</label>

              <input
                placeholder="Enter Party"
                name="Party"
                value={formData.Party}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* PRODUCT CODE */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Product Code
              </label>

              <input
                type="number"
                placeholder="Enter Product Code"
                onChange={handleProductCode}
                className={inputClass}
              />
            </div>

            {/* PRODUCT */}

            <div>
              <label className="block text-sm font-medium mb-1">Product</label>

              <select
                name="Product"
                value={formData.Product}
                onChange={handleProductSelect}
                className={inputClass}
              >
                <option value="">Select Product</option>

                {Object.entries(products).map(([id, name]) => (
                  <option key={id} value={name}>
                    {id} - {name}
                  </option>
                ))}
              </select>
            </div>

            {/* FIRST WEIGHT */}

            <div>
              <label className="block text-sm font-medium mb-1">
                First Weight
              </label>

              <input
                type="number"
                placeholder="Enter First Weight"
                name="Gross"
                value={formData.Gross}
                onChange={handleChange}
                className={inputClass}
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
                value={formData.Tare}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* CASH */}

            <div>
              <label className="block text-sm font-medium mb-1">Cash</label>

              <input
                type="number"
                placeholder="Enter Cash"
                name="Cash"
                value={formData.Cash}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* ======================================
          BUTTONS
      ====================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SAVE FIRST WEIGHT */}

            <button
              type="button"
              onClick={handleSaveFirstWeight}
              disabled={savingFirstWeight || firstWeightSaved}
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
                : savingFirstWeight
                  ? "Saving..."
                  : "Save 1st Weight"}
            </button>

            {/* GENERATE */}

            <button
              type="submit"
              disabled={generatingStamp}
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
              {generatingStamp ? "Generating..." : "Save & Print"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
