import { useEffect, useState } from "react";
import ThemeButton from "./ThemeButton";
import { TbFileImport } from "react-icons/tb";
import ExportButton from "./ExportButton";
import toast from "react-hot-toast";

const initialTransactions = JSON.parse(
  localStorage.getItem("transactions")
) || [
  {
    id: 1,
    amount: 5000,
    type: "income",
    category: "Salary",
    date: "2025-05-10",
  },
  {
    id: 2,
    amount: 1500,
    type: "expense",
    category: "Rent",
    date: "2025-05-11",
  },
];

const Navbar = () => {
  const [transactions, setTransactions] = useState(initialTransactions);


  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      // Parse CSV
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const importedData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, idx) => {
          obj[header] = values[idx];
        });
        // Convert fields if needed
        obj.id = Number(obj.id) || Math.floor(Math.random() * 1000000);
        obj.amount = Number(obj.amount);
        return obj;
      });

      setTransactions([...transactions, ...importedData]);
      toast.success("Transactions imported successfully");
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <header className="flex justify-between items-center bg-white dark:bg-gray-800 px-6 py-4 shadow sticky top-0 z-10 dark:text-white">
      <div>
        <h1 className="text-2xl font-semibold">Welcome!</h1>
      </div>
      <div className="flex items-center space-x-2">
        <ThemeButton />
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="hidden"
          id="import-input"
        />
        <label
          htmlFor="import-input"
          className="px-3 py-1 bg-yellow-500 text-white rounded cursor-pointer items-center gap-1 sm:flex hidden"
        >
         <TbFileImport /> Import
        </label>
        <ExportButton />
      </div>
    </header>
  );
};

export default Navbar;
