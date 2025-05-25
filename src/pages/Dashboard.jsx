import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { MdOutlineUpdate } from "react-icons/md";

import { AddTransaction, Mic, TransactionsList } from "../components";
import { MdOutlineAddCircle } from "react-icons/md";
import toast from "react-hot-toast";

const initialTransactions = JSON.parse(
  localStorage.getItem("transactions")
) || [
  {
    id: 1,
    amount: 5000,
    type: "income",
    category: "Salary",
    date: "2025-05-01",
    recurring: true,
  },
  {
    id: 2,
    amount: 1500,
    type: "expense",
    category: "Rent",
    date: "2025-05-01",
    recurring: true,
  },
];

const initialGoal = JSON.parse(localStorage.getItem("goal")) || 10000;

const Dashboard = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [form, setForm] = useState({
    amount: "",
    type: "",
    category: "",
    date: "",
    recurring: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("monthly");
  const [goal, setGoal] = useState(initialGoal);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("goal", JSON.stringify(goal));
  }, [goal]);

  useEffect(() => {
    const today = new Date();
    if (today.getDate() === 1) {
      const added = transactions.some(
        (t) =>
          new Date(t.date).getMonth() === today.getMonth() &&
          t.recurring === true
      );
      if (!added) {
        const recurringTx = transactions.filter((t) => t.recurring);
        const newTx = recurringTx.map((t) => ({
          ...t,
          id: Date.now() + Math.random(),
          date: today.toISOString().slice(0, 10),
        }));
        setTransactions([...transactions, ...newTx]);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAdd = () => {
    if (!form.amount || !form.type || !form.category || !form.date) {
      toast.error("Please fill all fields");
      return;
    }

    if (isEditing) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingId
            ? { ...form, id: editingId, amount: +form.amount }
            : t
        )
      );
      toast.success("Transaction updated successfully");
    } else {
      const newTransaction = {
        ...form,
        id: Date.now(),
        amount: +form.amount,
      };
      setTransactions([...transactions, newTransaction]);
      toast.success("Transaction added successfully");
    }
    setForm({ amount: "", type: "", category: "", date: "", recurring: false });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (id) => {
    const t = transactions.find((t) => t.id === id);
    setForm(t);
    setIsEditing(true);
    setEditingId(id);
  };

  const handleCancel = () => {
    setForm({ amount: "", type: "", category: "", date: "", recurring: false });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filterByDateRange = (txns) => {
    const now = new Date();
    return txns.filter((t) => {
      const txDate = new Date(t.date);
      if (filter === "monthly") {
        return (
          txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        );
      }
      if (filter === "weekly") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return txDate >= startOfWeek && txDate <= endOfWeek;
      }
      if (filter === "yearly") {
        return txDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredTransactions = filterByDateRange(transactions);
  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = income - expense;

  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const COLORS = ["#4caf50", "#f44336"];

  const categoryData = Object.values(
    filteredTransactions.reduce((acc, t) => {
      const key = `${t.type}-${t.category}`;
      if (!acc[key]) acc[key] = { name: t.category, type: t.type, value: 0 };
      acc[key].value += t.amount;
      return acc;
    }, {})
  );

  return (
    <main className="p-4 max-w-6xl mx-auto dark:text-white">
      <div className="flex justify-end mb-4 items-center gap-2">
        <label className="font-semibold">Filter charts:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold">Net balance</h2>
          <p className={`text-2xl ${netBalance < 0 ? "text-red-500" : ""}`}>
            ₹{netBalance}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold">Income</h2>
          <p className="text-2xl text-green-600">₹{income}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold">Expense</h2>
          <p className="text-2xl text-red-600">₹{expense}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-lg font-semibold">Saving goal</h2>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(+e.target.value)}
            className="w-full border p-1 rounded mt-2"
          />
          <div className="mt-2 text-sm">
            Saved: ₹{netBalance} / ₹{goal}
            <div className="w-full bg-gray-300 rounded h-2 mt-1">
              <div
                className={`h-2 rounded ${
                  netBalance >= goal ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{
                  width: `${Math.min(100, (netBalance / goal) * 100)}%`,
                }}
              ></div>
            </div>
            {netBalance < 0 && (
              <p className="text-red-500 mt-1">Warning: Overspending!</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Income vs Expense</h2>
          <PieChart width={200} height={200}>
            <Pie data={pieData} dataKey="value" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">
            Category-wise {filter.charAt(0).toUpperCase() + filter.slice(1)}{" "}
            Distribution
          </h2>
          <BarChart width={300} height={200} data={categoryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      <AddTransaction
        form={form}
        handleAdd={handleAdd}
        handleChange={handleChange}
        isEditing={isEditing}
        handleCancel={handleCancel}
      />

      <TransactionsList
        filteredTransactions={filteredTransactions}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </main>
  );
};

export default Dashboard;
