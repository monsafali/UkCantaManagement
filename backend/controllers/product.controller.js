import puppeteer from "puppeteer";

import Product from "../models/Product.js";
import stampTemplate from "../templates/stampTemplate.js";
import generateStampData from "../utils/generateStampData.js";

import { puppeteerConfig } from "../config/puppeteer.js";

// ======================================================
// GET NEXT SR NO
// ======================================================

export const getSr = async (req, res) => {
  try {
    const product = await Product.findOne()
      .sort({ Sr_No: -1 })
      .lean();

    if (!product) {
      return res.json(1);
    }

    return res.json(Number(product.Sr_No) + 1);
  } catch (error) {
    console.error("getSr error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// SAVE FIRST WEIGHT
// ======================================================

export const saveFirstWeight = async (req, res) => {
  try {
    const {
      Sr_No,
      vehicle,
      Party,
      Product: productName,
      ProductId,
      Gross,
    } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!Sr_No) {
      return res.status(400).json({
        message: "Sr No is required",
      });
    }

    if (!vehicle) {
      return res.status(400).json({
        message: "Vehicle is required",
      });
    }

    if (!Party) {
      return res.status(400).json({
        message: "Party is required",
      });
    }

    if (!productName) {
      return res.status(400).json({
        message: "Product is required",
      });
    }

    if (
      Gross === undefined ||
      Gross === null ||
      Gross === ""
    ) {
      return res.status(400).json({
        message: "First weight is required",
      });
    }

    // ------------------------------------------
    // CHECK IF SR ALREADY EXISTS
    // ------------------------------------------

    const existingProduct = await Product.findOne({
      Sr_No: Number(Sr_No),
    });

    if (existingProduct) {
      return res.status(409).json({
        message: `Sr No ${Sr_No} already exists`,
      });
    }

    // ------------------------------------------
    // CREATE PARTIAL PRODUCT
    // ------------------------------------------

    const product = await Product.create({
      Sr_No: Number(Sr_No),

      vehicle: vehicle?.toUpperCase(),

      Party: Party?.toUpperCase(),

      Product: productName?.toUpperCase(),

      ProductId,

      Gross: Number(Gross),

      // Second weight is empty for now
      Tare: 0,

      Net: 0,

      Cash: 0,

      // First weight date/time
      GrossDate: new Date(),

      GrossTime: new Date().toLocaleTimeString(),

      Date: new Date().toLocaleDateString("en-GB"),

      formDate: new Date(),

      // User who saved first weight
      user: req.user._id,
    });

    console.log(
      "First weight saved:",
      product._id
    );

    return res.status(201).json({
      message: "First weight saved successfully",
      srNo: product.Sr_No,
      product,
    });
  } catch (error) {
    console.error(
      "saveFirstWeight error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// GET FIRST WEIGHT
// ======================================================

export const getFirstWeight = async (req, res) => {
  try {
    const { Sr_No } = req.query;

    if (!Sr_No) {
      return res.status(400).json({
        message: "Sr No is required",
      });
    }

    const product = await Product.findOne({
      Sr_No: Number(Sr_No),
    }).lean();

    if (!product) {
      return res.status(404).json({
        message: "First weight not found",
      });
    }

    // ------------------------------------------
    // CHECK WHETHER SECOND WEIGHT IS ALREADY DONE
    // ------------------------------------------

    if (
      product.Tare &&
      Number(product.Tare) > 0
    ) {
      return res.status(400).json({
        message:
          "Second weight has already been recorded for this Sr No",
      });
    }

    return res.json({
      message: "First weight found",
      product,
    });
  } catch (error) {
    console.error(
      "getFirstWeight error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// GENERATE PRODUCT / COMPLETE SECOND WEIGHT
// ======================================================

export const GenerateProduct = async (req, res) => {
  try {
    const bodyData = req.body;

    const {
      Sr_No,
      Gross,
      Tare,
      Cash,
    } = bodyData;

    if (!Sr_No) {
      return res.status(400).json({
        message: "Sr No is required",
      });
    }

    if (
      Gross === undefined ||
      Gross === null ||
      Gross === ""
    ) {
      return res.status(400).json({
        message: "First weight is required",
      });
    }

    if (
      Tare === undefined ||
      Tare === null ||
      Tare === ""
    ) {
      return res.status(400).json({
        message: "Second weight is required",
      });
    }

    // ==================================================
    // CHECK EXISTING RECORD
    // ==================================================

    const existingProduct = await Product.findOne({
      Sr_No: Number(Sr_No),
    });

    // ==================================================
    // GENERATE FINAL DATA
    // ==================================================

    let finalData;

    if (existingProduct) {
      // ----------------------------------------------
      // TWO-STEP FLOW
      // ----------------------------------------------

      finalData = generateStampData({
        ...existingProduct.toObject(),

        ...bodyData,

        Sr_No: Number(Sr_No),

        Gross: Number(Gross),

        Tare: Number(Tare),

        Cash: Number(Cash || 0),
      });
    } else {
      // ----------------------------------------------
      // ONE-STEP FLOW
      // ----------------------------------------------

      finalData = generateStampData({
        ...bodyData,

        Sr_No: Number(Sr_No),

        Gross: Number(Gross),

        Tare: Number(Tare),

        Cash: Number(Cash || 0),
      });
    }

    // ==================================================
    // UPDATE EXISTING FIRST WEIGHT
    // ==================================================

    let savedProduct;

    if (existingProduct) {
      savedProduct = await Product.findOneAndUpdate(
        {
          Sr_No: Number(Sr_No),
        },
        {
          vehicle: finalData.vehicle,

          Party: finalData.Party,

          Product: finalData.Product,

          ProductId: finalData.ProductId,

          Gross: finalData.Gross,

          Tare: finalData.Tare,

          Net: finalData.Net,

          Cash: finalData.Cash,

          Date: finalData.Date,

          GrossDate: finalData.GrossDate,

          TareDate: finalData.TareDate,

          formDate: finalData.formDate,

          GrossTime: finalData.GrossTime,

          TareTime: finalData.TareTime,

          remarks: finalData.remarks,

          calc40_mnds:
            finalData.calc40?.mnds || 0,

          calc40_kg:
            finalData.calc40?.kg || 0,

          calc37_mnds:
            finalData.calc37?.mnds || 0,

          calc37_kg:
            finalData.calc37?.kg || 0,
        },
        {
          new: true,
        }
      );
    } else {
      // ==================================================
      // CREATE NEW COMPLETE RECORD
      // ==================================================

      savedProduct = await Product.create({
        Sr_No: finalData.Sr_No,

        vehicle: finalData.vehicle,

        Party: finalData.Party,

        Product: finalData.Product,

        ProductId: finalData.ProductId,

        Gross: finalData.Gross,

        Tare: finalData.Tare,

        Net: finalData.Net,

        Cash: finalData.Cash,

        Date: finalData.Date,

        GrossDate: finalData.GrossDate,

        TareDate: finalData.TareDate,

        formDate: finalData.formDate,

        GrossTime: finalData.GrossTime,

        TareTime: finalData.TareTime,

        remarks: finalData.remarks,

        calc40_mnds:
          finalData.calc40?.mnds || 0,

        calc40_kg:
          finalData.calc40?.kg || 0,

        calc37_mnds:
          finalData.calc37?.mnds || 0,

        calc37_kg:
          finalData.calc37?.kg || 0,

        user: req.user._id,
      });
    }

    console.log(
      "Product saved:",
      savedProduct._id
    );

    // ==================================================
    // GENERATE HTML
    // ==================================================

    const html = stampTemplate(finalData);

    // ==================================================
    // GENERATE PDF
    // ==================================================

    const browser = await puppeteer.launch(
      puppeteerConfig
    );

    try {
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        pageRanges: "1",
      });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=stamp.pdf"
      );

      res.setHeader(
        "Content-Length",
        pdfBuffer.length
      );

      return res.end(pdfBuffer);
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error(
      "GenerateProduct error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// SEARCH PRODUCT
// ======================================================

export const SearchProduct = async (req, res) => {
  try {
    const { Sr_No } = req.body;

    const product = await Product.findOne({
      Sr_No: Number(Sr_No),
    }).lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const productData = {
      ...product,

      calc40: {
        mnds: product.calc40_mnds || 0,
        kg: product.calc40_kg || 0,
      },

      calc37: {
        mnds: product.calc37_mnds || 0,
        kg: product.calc37_kg || 0,
      },
    };

    const html = stampTemplate(productData);

    const browser = await puppeteer.launch(
      puppeteerConfig
    );

    try {
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        pageRanges: "1",
      });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=stamp.pdf"
      );

      res.setHeader(
        "Content-Length",
        pdfBuffer.length
      );

      return res.end(pdfBuffer);
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error(
      "SearchProduct error:",
      error
    );

    return res.status(500).json({
      message: "Preview failed",
    });
  }
};

// ======================================================
// DATE REPORT
// ======================================================

export const SearchDate = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    const from = new Date(fromDate);

    const to = new Date(toDate);

    to.setHours(23, 59, 59, 999);

    const products = await Product.find({})
      .sort({ Sr_No: 1 })
      .lean();

    const filtered = products.filter((item) => {
      if (!item.Date) {
        return false;
      }

      const [dd, mm, yy] =
        item.Date.split("-");

      const fullYear =
        Number(yy) < 50
          ? `20${yy}`
          : `19${yy}`;

      const itemDate = new Date(
        `${fullYear}-${mm}-${dd}`
      );

      return (
        itemDate >= from &&
        itemDate <= to
      );
    });

    if (!filtered.length) {
      return res
        .status(404)
        .send("No records found");
    }

    const totalCash = filtered.reduce(
      (sum, item) =>
        sum + (Number(item.Cash) || 0),
      0
    );

    const html = `
      <!DOCTYPE html>

      <html>

      <head>

        <style>

          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }

          h1 {
            text-align: center;
            margin-bottom: 20px;
          }

          .date {
            margin-bottom: 20px;
            font-size: 14px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            font-size: 12px;
          }

          th {
            background: #f2f2f2;
          }

          .total {
            margin-top: 20px;
            text-align: right;
            font-size: 18px;
            font-weight: bold;
          }

        </style>

      </head>

      <body>

        <h1>Product Report</h1>

        <div class="date">

          <strong>From:</strong>
          ${fromDate}

          &nbsp;&nbsp;&nbsp;

          <strong>To:</strong>
          ${toDate}

        </div>

        <table>

          <thead>

            <tr>
              <th>Sr No</th>
              <th>Vehicle</th>
              <th>Party</th>
              <th>Product</th>
              <th>Gross</th>
              <th>Tare</th>
              <th>Cash</th>
              <th>Date</th>
              <th>Gross Time</th>
              <th>Tare Time</th>
            </tr>

          </thead>

          <tbody>

            ${filtered
              .map(
                (item) => `
                  <tr>

                    <td>${item.Sr_No}</td>

                    <td>${item.vehicle || ""}</td>

                    <td>${item.Party || ""}</td>

                    <td>${item.Product || ""}</td>

                    <td>${item.Gross || ""}</td>

                    <td>${item.Tare || ""}</td>

                    <td>${item.Cash || ""}</td>

                    <td>${item.Date || ""}</td>

                    <td>${item.GrossTime || ""}</td>

                    <td>${item.TareTime || ""}</td>

                  </tr>
                `
              )
              .join("")}

          </tbody>

        </table>

        <div class="total">

          Total Cash:
          ${totalCash}

        </div>

      </body>

      </html>
    `;

    const browser = await puppeteer.launch(
      puppeteerConfig
    );

    try {
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=report.pdf"
      );

      res.setHeader(
        "Content-Length",
        pdfBuffer.length
      );

      return res.end(pdfBuffer);
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error(
      "SearchDate error:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};
