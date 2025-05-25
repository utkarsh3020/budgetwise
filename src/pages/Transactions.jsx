import React, { useState, useEffect } from "react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filter, setFilter] = useState("yearly");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(stored);
  }, []);

  const isWithinFilter = (date) => {
    const transactionDate = new Date(date);
    const now = new Date();

    if (filter === "monthly") {
      return (
        transactionDate.getFullYear() === now.getFullYear() &&
        transactionDate.getMonth() === now.getMonth()
      );
    } else if (filter === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return transactionDate >= oneWeekAgo && transactionDate <= now;
    } else if (filter === "yearly") {
      return transactionDate.getFullYear() === now.getFullYear();
    }
    return true; // Default to include all if no filter matches
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.date.includes(search) ||
      t.type.includes(search) ||
      t.amount.toString().includes(search);
    const matchesType = typeFilter ? t.type === typeFilter : true;
    const matchesCategory = categoryFilter
      ? t.category === categoryFilter
      : true;
    const matchesDate = isWithinFilter(t.date);
    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  const uniqueCategories = [...new Set(transactions.map((t) => t.category))];

  return (
    <main className="p-4 max-w-6xl mx-auto dark:text-white">
      <h2 className="text-2xl font-bold mb-10 border-b p-2">Transactions</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option className="dark:text-black" value="">
            All Types
          </option>
          <option className="dark:text-black" value="income">
            Income
          </option>
          <option className="dark:text-black" value="expense">
            Expense
          </option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option className="dark:text-black" value="">
            All Categories
          </option>
          {uniqueCategories.map((cat) => (
            <option className="dark:text-black" key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option className="dark:text-black" value="monthly">
            Monthly
          </option>
          <option className="dark:text-black" value="weekly">
            Weekly
          </option>
          <option className="dark:text-black" value="yearly">
            Yearly
          </option>
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="border px-3 py-2">Amount</th>
            <th className="border px-3 py-2">Type</th>
            <th className="border px-3 py-2">Category</th>
            <th className="border px-3 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t) => (
            <tr key={t.id} className="text-center">
              <td className="border px-3 py-2">₹{t.amount}</td>
              <td className="border px-3 py-2">{t.type}</td>
              <td className="border px-3 py-2">{t.category}</td>
              <td className="border px-3 py-2">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
