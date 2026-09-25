import { useState } from "react";
import useProductStore from "../store/productStore";

const DeleteProduct = () => {
  const [SrNo, setSrNo] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const deleteProduct = useProductStore(
    (state) => state.deleteProduct
  );

  const loading = useProductStore(
    (state) => state.loading
  );

  const handleDeleteProduct = async (e) => {
    e.preventDefault();

    if (!SrNo.trim()) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response =
        await deleteProduct(SrNo);

      setMessage(
        response.message ||
          "Product deleted successfully"
      );

      setSrNo("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border">
      <h2 className="text-2xl font-bold text-center mb-6">
        Delete Product
      </h2>

      <form
        onSubmit={handleDeleteProduct}
        className="space-y-4"
      >
        <input
          type="number"
          value={SrNo}
          onChange={(e) =>
            setSrNo(e.target.value)
          }
          placeholder="Enter Sr No"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading
            ? "Deleting..."
            : "Delete Product"}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default DeleteProduct;
