import React from "react";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import toast from "react-hot-toast";

const ExportButton = () => {
  const [open, setOpen] = React.useState(false);

  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const generatePDF = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          const doc = new jsPDF();
          doc.text("Finance Report", 14, 10);
          const rows = transactions.map((t) => [
            t.amount,
            t.type,
            t.category,
            t.date,
          ]);
          autoTable(doc, {
            head: [["Amount", "Type", "Category", "Date"]],
            body: rows,
          });
          doc.save("finance_report.pdf");
          resolve();
        } catch (err) {
          reject();
        }
      }),
      {
        loading: "Exporting PDF...",
        success: <b>PDF exported!</b>,
        error: <b>Could not export PDF.</b>,
      }
    );
  };

  const generateCSV = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          const csvRows = [];
          const headers = Object.keys(transactions[0]).filter(
            (header) => header !== "id" && header !== "recurring"
          );
          console.log("he", headers);

          csvRows.push(headers.join(","));

          transactions.forEach((transaction) => {
            const values = headers.map((header) => transaction[header]);
            csvRows.push(values.join(","));
          });

          const csvContent =
            "data:text/csv;charset=utf-8," + csvRows.join("\n");
          const downloadAnchorNode = document.createElement("a");
          downloadAnchorNode.setAttribute("href", encodeURI(csvContent));
          downloadAnchorNode.setAttribute("download", "finance_report.csv");
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
          resolve();
        } catch (err) {
          reject();
        }
      }),
      {
        loading: "Exporting CSV...",
        success: <b>CSV exported!</b>,
        error: <b>Could not export CSV.</b>,
      }
    );
  };

  return (
    <div
      className="relative px-3 py-1 bg-green-500 text-white rounded sm:flex hidden items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 focus:outline-none cursor-pointer"
        type="button"
        tabIndex={0}
      >
        Export as
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`
          absolute left-0 top-[100%] w-full bg-white text-black rounded shadow z-10
          transition-all duration-400 ease-in-out
          ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}
        `}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <button
          className="block w-full text-left px-4 py-2 hover:bg-green-100"
          onClick={() => {
            setOpen(false);
            generatePDF();
          }}
        >
          PDF
        </button>
        <button
          className="block w-full text-left px-4 py-2 hover:bg-green-100"
          onClick={() => {
            setOpen(false);
            generateCSV();
          }}
        >
          CSV
        </button>
      </div>
    </div>
  );
};

export default ExportButton;
