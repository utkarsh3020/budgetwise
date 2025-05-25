import React from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const TransactionsList = ({
  filteredTransactions,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="font-semibold mb-4">Transaction List</h2>
      <table className="w-full table-auto text-left border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Recurring</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t) => (
            <tr key={t.id}>
              <td className="border border-gray-300 p-2">₹{t.amount}</td>
              <td className="border border-gray-300 p-2">{t.type}</td>
              <td className="border border-gray-300 p-2">{t.category}</td>
              <td className="border border-gray-300 p-2">{t.date}</td>
              <td className="border border-gray-300 p-2">
                {t.recurring ? "Yes" : "No"}
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(t.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-1"
                  >
                    Edit <CiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer flex items-center gap-1"
                  >
                    Delete <MdDelete size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;
