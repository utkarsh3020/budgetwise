import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#ffbb28"];

const Insights = () => {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  if (transactions.length === 0) {
    return <p>No transactions available for insights.</p>;
  }

  // Normalize categories to lower case for grouping
  const normalized = transactions.map((t) => ({
    ...t,
    category: t.category.toLowerCase(),
  }));

  // Group by category
  const categoryTotals = normalized.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryTotals).map(([key, value]) => ({
    name: key,
    value,
  }));

  // Calculate monthly trends
  const monthData = {};
  normalized.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    if (!monthData[month]) monthData[month] = { month, income: 0, expense: 0 };
    monthData[month][t.type] += t.amount;
  });

  const monthlyTrends = Object.values(monthData);

  const totalIncome = normalized
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = normalized
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(2)
      : 0;

  return (
    <main className="p-4 max-w-6xl mx-auto dark:text-white">
      <h1 className="text-2xl font-bold mb-10 border-b p-2">Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Top Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#4caf50" name="Income" />
              <Bar dataKey="expense" fill="#f44336" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="font-semibold">Savings Rate</h2>
        <p className="text-xl mt-2">💰 {savingsRate}%</p>
      </div>
    </main>
  );
};

export default Insights;
