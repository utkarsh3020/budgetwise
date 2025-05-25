import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';


// const initialTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

// const FinanceTrackerAdvanced = () => {
//   const [transactions, setTransactions] = useState(initialTransactions);
//   const [form, setForm] = useState({ amount: "", type: "", category: "", date: "" });
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     localStorage.setItem("transactions", JSON.stringify(transactions));
//   }, [transactions]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const normalizeCategory = (category) =>
//     category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

//   const handleAdd = () => {
//     const normalizedCategory = normalizeCategory(form.category);
//     const newTransaction = {
//       ...form,
//       id: Date.now(),
//       amount: +form.amount,
//       category: normalizedCategory,
//     };
//     setTransactions([...transactions, newTransaction]);
//     setForm({ amount: "", type: "", category: "", date: "" });
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Finance Report", 14, 10);
//     const rows = transactions.map((t) => [t.amount, t.type, t.category, t.date]);
//     autoTable(doc, {
//       head: [["Amount", "Type", "Category", "Date"]],
//       body: rows,
//     });
//     doc.save("finance_report.pdf");
//   };

//   const handleVoiceInput = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       alert("Speech recognition is not supported in this browser.");
//       return;
//     }
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-IN";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onresult = (event) => {
//       const command = event.results[0][0].transcript;
//       console.log("Voice Command:", command);
//       parseVoiceCommand(command);
//     };

//     recognition.onerror = (event) => {
//       alert("Speech recognition error: " + event.error);
//     };

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   const parseVoiceCommand = (command) => {
//     const amountMatch = command.match(/\d+/);
//     const typeMatch = command.includes("expense") ? "expense" : command.includes("income") ? "income" : "";
//     const categoryMatch = command.match(/for (.*?) (on|today|yesterday)?$/i);
//     const date = new Date().toISOString().split("T")[0];

//     if (amountMatch && typeMatch && categoryMatch) {
//       setForm({
//         amount: amountMatch[0],
//         type: typeMatch,
//         category: categoryMatch[1],
//         date,
//       });
//     } else {
//       alert("Could not parse the command. Please try again clearly.");
//     }
//   };

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Advanced Finance Tracker</h1>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//         <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" className="border p-2 rounded" />
//         <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
//           <option value="" disabled>Type</option>
//           <option value="income">Income</option>
//           <option value="expense">Expense</option>
//         </select>
//         <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 rounded" />
//         <input name="date" type="date" value={form.date} onChange={handleChange} className="border p-2 rounded" />
//       </div>

//       <div className="flex gap-2 mb-6">
//         <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
//         <button onClick={generatePDF} className="bg-green-600 text-white px-4 py-2 rounded">Export PDF</button>
//         <button onClick={handleVoiceInput} className="bg-purple-600 text-white px-4 py-2 rounded">🎤 Speak</button>
//       </div>

//       <table className="w-full border text-left">
//         <thead>
//           <tr>
//             <th className="border p-2">Amount</th>
//             <th className="border p-2">Type</th>
//             <th className="border p-2">Category</th>
//             <th className="border p-2">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((t) => (
//             <tr key={t.id}>
//               <td className="border p-2">₹{t.amount}</td>
//               <td className="border p-2">{t.type}</td>
//               <td className="border p-2">{t.category}</td>
//               <td className="border p-2">{t.date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FinanceTrackerAdvanced;


const initialTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
const initialLimits = JSON.parse(localStorage.getItem("limits")) || {};

const FinanceTrackerAdvanced = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [form, setForm] = useState({ amount: "", type: "", category: "", date: "" });
  const [limits, setLimits] = useState(initialLimits);
  const [limitForm, setLimitForm] = useState({ category: "", amount: "" });
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const recognitionRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("limits", JSON.stringify(limits));
  }, [limits]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const normalizeCategory = (category) =>
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  const handleAdd = () => {
    const normalizedCategory = normalizeCategory(form.category);
    const newTransaction = {
      ...form,
      id: Date.now(),
      amount: +form.amount,
      category: normalizedCategory,
    };
    setTransactions([...transactions, newTransaction]);
    setForm({ amount: "", type: "", category: "", date: "" });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Finance Report", 14, 10);
    const rows = transactions.map((t) => [t.amount, t.type, t.category, t.date]);
    doc.autoTable({
      head: [["Amount", "Type", "Category", "Date"]],
      body: rows,
    });
    doc.save("finance_report.pdf");
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      parseVoiceCommand(command);
    };

    recognition.onerror = (event) => {
      alert("Speech recognition error: " + event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const parseVoiceCommand = (command) => {
    const amountMatch = command.match(/\d+/);
    const typeMatch = command.includes("expense") ? "expense" : command.includes("income") ? "income" : "";
    const categoryMatch = command.match(/for (.*?) (on|today|yesterday)?$/i);
    const date = new Date().toISOString().split("T")[0];

    if (amountMatch && typeMatch && categoryMatch) {
      setForm({
        amount: amountMatch[0],
        type: typeMatch,
        category: categoryMatch[1],
        date,
      });
    } else {
      alert("Could not parse the command. Please try again clearly.");
    }
  };

  const handleLimitChange = (e) => {
    setLimitForm({ ...limitForm, [e.target.name]: e.target.value });
  };

  const handleSetLimit = () => {
    const cat = normalizeCategory(limitForm.category);
    setLimits({ ...limits, [cat]: +limitForm.amount });
    setLimitForm({ category: "", amount: "" });
  };

  const getInsights = () => {
    const categoryTotals = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });
    const maxCategory = Object.entries(categoryTotals).reduce((a, b) => (a[1] > b[1] ? a : b), ["", 0]);

    const thisMonth = new Date().getMonth();
    const currentMonthExpenses = transactions.filter(t => new Date(t.date).getMonth() === thisMonth && t.type === "expense");
    const lastMonthExpenses = transactions.filter(t => new Date(t.date).getMonth() === thisMonth - 1 && t.type === "expense");

    const currTotal = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
    const prevTotal = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
    const increase = prevTotal ? (((currTotal - prevTotal) / prevTotal) * 100).toFixed(1) : "N/A";

    const thisWeek = transactions.filter(t => {
      const d = new Date(t.date);
      const today = new Date();
      const diff = (today - d) / (1000 * 3600 * 24);
      return diff <= 7 && t.type === "expense";
    });
    const avgWeek = (thisWeek.reduce((sum, t) => sum + t.amount, 0) / 7).toFixed(2);

    return {
      maxCategory: maxCategory[0],
      percentIncrease: increase,
      avgDailyExpense: avgWeek,
    };
  };

  const insights = getInsights();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Advanced Finance Tracker</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="bg-gray-600 text-white px-4 py-2 rounded">
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" className="border p-2 rounded" />
        <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
          <option value="" disabled>Type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2 rounded" />
        <input name="date" type="date" value={form.date} onChange={handleChange} className="border p-2 rounded" />
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
        <button onClick={generatePDF} className="bg-green-600 text-white px-4 py-2 rounded">Export PDF</button>
        <button onClick={handleVoiceInput} className="bg-purple-600 text-white px-4 py-2 rounded">🎤 Speak</button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Category Budget Limits</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input name="category" value={limitForm.category} onChange={handleLimitChange} placeholder="Category" className="border p-2 rounded" />
          <input name="amount" type="number" value={limitForm.amount} onChange={handleLimitChange} placeholder="Limit" className="border p-2 rounded" />
          <button onClick={handleSetLimit} className="bg-yellow-500 text-white px-4 py-2 rounded col-span-2">Set Limit</button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Smart Insights</h2>
        <ul className="list-disc pl-6">
          <li>You spend most on <strong>{insights.maxCategory || "N/A"}</strong></li>
          <li>Your spending increased by <strong>{insights.percentIncrease}%</strong> this month</li>
          <li>Your average daily expense this week is <strong>₹{insights.avgDailyExpense}</strong></li>
        </ul>
      </div>

      <table className="w-full border text-left">
        <thead>
          <tr>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Limit Exceeded</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const totalInCategory = transactions.filter(x => x.category === t.category && x.type === "expense").reduce((sum, x) => sum + x.amount, 0);
            const limit = limits[t.category];
            const exceeded = limit && totalInCategory > limit;
            return (
              <tr key={t.id}>
                <td className="border p-2">₹{t.amount}</td>
                <td className="border p-2">{t.type}</td>
                <td className="border p-2">{t.category}</td>
                <td className="border p-2">{t.date}</td>
                <td className={`border p-2 ${exceeded ? 'text-red-600 font-bold' : ''}`}>{exceeded ? "Yes" : "No"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FinanceTrackerAdvanced;
