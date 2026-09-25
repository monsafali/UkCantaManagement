import puppeteer from "puppeteer";

import Product from "../models/Product.js";
import stampTemplate from "../templates/stampTemplate.js";
import generateStampData from "../utils/generateStampData.js";

import { puppeteerConfig } from "../config/puppeteer.js";


// =====================================================
// GET NEXT SERIAL NUMBER
// =====================================================

export const getSr = async (req, res) => {
  try {
    // Get product with highest Sr_No
    const product = await Product.findOne()
      .sort({ Sr_No: -1 })
      .lean();

    // If no product exists
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


// =====================================================
// GENERATE PRODUCT + PDF
// =====================================================

export const GenerateProduct = async (req, res) => {
  try {
    // FRONTEND DATA
    const bodyData = req.body;

    // GENERATE AUTO VALUES
    const finalData = generateStampData(bodyData);

    // SAVE PRODUCT

     const savedProduct = await Product.create({
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

      // VERY IMPORTANT
      user: req.user._id,
    });

    console.log("Product saved:", savedProduct._id);

    // =================================================
    // GENERATE HTML
    // =================================================

    const html = stampTemplate(finalData);

    // =================================================
    // GENERATE PDF
    // =================================================

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

      // SEND PDF
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
    console.error("GenerateProduct error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// SEARCH PRODUCT BY SERIAL NUMBER + PDF
// =====================================================

export const SearchProduct = async (req, res) => {
  try {
    const { Sr_No } = req.body;

    // MONGOOSE
    const product = await Product.findOne({
      Sr_No: Number(Sr_No),
    }).lean();

    // NOT FOUND
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // =================================================
    // CONVERT DATABASE DATA TO TEMPLATE FORMAT
    // =================================================

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

    // =================================================
    // GENERATE HTML
    // =================================================

    const html = stampTemplate(productData);

    // =================================================
    // GENERATE PDF
    // =================================================

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

      // SEND PDF
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
    console.error("SearchProduct error:", error);

    return res.status(500).json({
      message: "Preview failed",
    });
  }
};


// =====================================================
// SEARCH PRODUCTS BY DATE + GENERATE REPORT
// =====================================================

export const SearchDate = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    // =================================================
    // DATE CONVERT
    // =================================================

    const from = new Date(fromDate);

    const to = new Date(toDate);

    to.setHours(23, 59, 59, 999);

    // =================================================
    // GET ALL PRODUCTS
    // =================================================

    const products = await Product.find({})
      .sort({ Sr_No: 1 })
      .lean();

    // =================================================
    // FILTER DATA
    // =================================================

    const filtered = products.filter((item) => {
      if (!item.Date) {
        return false;
      }

      const [dd, mm, yy] = item.Date.split("-");

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

    // =================================================
    // NO RECORDS
    // =================================================

    if (!filtered.length) {
      return res.status(404).send("No records found");
    }

    // =================================================
    // TOTAL CASH
    // =================================================

    const totalCash = filtered.reduce(
      (sum, item) => {
        return (
          sum +
          (Number(item.Cash) || 0)
        );
      },
      0
    );

    // =================================================
    // HTML REPORT
    // =================================================

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

                    <td>
                      ${item.Sr_No}
                    </td>

                    <td>
                      ${item.vehicle || ""}
                    </td>

                    <td>
                      ${item.Party || ""}
                    </td>

                    <td>
                      ${item.Product || ""}
                    </td>

                    <td>
                      ${item.Gross || ""}
                    </td>

                    <td>
                      ${item.Tare || ""}
                    </td>

                    <td>
                      ${item.Cash || ""}
                    </td>

                    <td>
                      ${item.Date || ""}
                    </td>

                    <td>
                      ${item.GrossTime || ""}
                    </td>

                    <td>
                      ${item.TareTime || ""}
                    </td>

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

    // =================================================
    // GENERATE PDF
    // =================================================

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

      // =================================================
      // SEND PDF
      // =================================================

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
    console.error("SearchDate error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (req, res) => {
  try {
    const { SrNo } = req.params;

    // MONGOOSE
    const deleted = await Product.deleteOne({
      Sr_No: Number(SrNo),
    });

    // NO PRODUCT
    if (deleted.deletedCount === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("deleteProduct error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
