import { useEffect, useState } from "react";
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

export default function useStampForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [firstWeightSaved, setFirstWeightSaved] = useState(false);

  const [savingFirstWeight, setSavingFirstWeight] = useState(false);

  const [gettingFirstWeight, setGettingFirstWeight] = useState(false);

  const [generatingStamp, setGeneratingStamp] = useState(false);

  const saveFirstWeight = useProductStore((state) => state.saveFirstWeight);

  const getFirstWeight = useProductStore((state) => state.getFirstWeight);

  const generateStamp = useProductStore((state) => state.generateStamp);

  const getSr = useProductStore((state) => state.getSr);

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
        console.error("SR fetch failed:", error);
      }
    };

    fetchSr();
  }, [getSr]);

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    const isTextField = ["vehicle", "Party", "Product"].includes(name);

    setFormData((prev) => ({
      ...prev,
      [name]: isTextField ? value.toUpperCase() : value,
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
    const selectedName = e.target.value;

    const selectedId = Object.keys(products).find(
      (key) => products[key] === selectedName,
    );

    setFormData((prev) => ({
      ...prev,
      Product: selectedName,
      ProductId: selectedId,
    }));
  };





  const handleSaveFirstWeight = async () => {
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

  if (!formData.Cash) {
    alert("Enter cash");
    return;
  }

  if (formData.Gross === "" || formData.Gross === null) {
    alert("Enter first weight");
    return;
  }

  try {
    setSavingFirstWeight(true);

    await saveFirstWeight({
      Sr_No: formData.Sr_No,
      vehicle: formData.vehicle,
      Party: formData.Party,
      Product: formData.Product,
      ProductId: formData.ProductId,
      Gross: formData.Gross,
      Cash: formData.Cash,
    });

    // ==========================================
    // RESET FORM FOR NEW ENTRY
    // ==========================================

    setFormData(initialFormData);

    setFirstWeightSaved(false);

    // ==========================================
    // GET NEW SR NO
    // ==========================================

    const newSr = await getSr();

    setFormData((prev) => ({
      ...prev,
      Sr_No: newSr,
    }));

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        "Failed to save first weight"
    );
  } finally {
    setSavingFirstWeight(false);
  }
};


  // const handleGetFirstWeight = async () => {
  //   if (!formData.Sr_No) {
  //     alert("Enter Sr No");
  //     return;
  //   }

  //   try {
  //     setGettingFirstWeight(true);

  //     const product = await getFirstWeight(formData.Sr_No);

  //     setFormData((prev) => ({
  //       ...prev,

  //       Sr_No: product.Sr_No,

  //       vehicle: product.vehicle || "",

  //       Party: product.Party || "",

  //       Product: product.Product || "",

  //       ProductId: product.ProductId || "",

  //       Gross: product.Gross || "",

  //       Cash: product.Cash || "",
  //     }));

  //     setFirstWeightSaved(true);

  //     // No success alert
  //   } catch (error) {
  //     console.error(error);

  //     alert(error.response?.data?.message || "First weight not found");
  //   } finally {
  //     setGettingFirstWeight(false);
  //   }
  // };

  // ==================================================
  // GENERATE STAMP
  // ==================================================



  const handleGetFirstWeight = async (srNo) => {
  if (!srNo) {
    alert("Enter Sr No");
    return;
  }

  try {
    setGettingFirstWeight(true);

    const product = await getFirstWeight(srNo);

    setFormData((prev) => ({
      ...prev,
      Sr_No: product.Sr_No,
      vehicle: product.vehicle || "",
      Party: product.Party || "",
      Product: product.Product || "",
      ProductId: product.ProductId || "",
      Gross: product.Gross ?? "",
      Cash: product.Cash ?? "",
    }));

    setFirstWeightSaved(true);
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        "First weight not found"
    );
  } finally {
    setGettingFirstWeight(false);
  }
  };

  
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
      setGeneratingStamp(true);

      const pdfBlob = await generateStamp(formData);

      const url = window.URL.createObjectURL(pdfBlob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "document.pdf";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

      // Reset form
      setFormData(initialFormData);

      setFirstWeightSaved(false);

      // Get new SR
      const newSr = await getSr();

      setFormData((prev) => ({
        ...prev,
        Sr_No: newSr,
      }));
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to generate stamp");
    } finally {
      setGeneratingStamp(false);
    }
  };

  return {
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
  };
}
