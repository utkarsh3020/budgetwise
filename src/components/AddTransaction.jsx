import React from "react";
import { MdOutlineAddCircle, MdOutlineUpdate } from "react-icons/md";
import Mic from "./Mic";

const AddTransaction = (
  {
    form,
    handleAdd,
    handleChange,
    isEditing,
    handleCancel,
  }
) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
      <h2 className="font-semibold mb-4">
        {isEditing ? "Edit" : "Add"} Transaction
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border p-2 rounded"
          type="number"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="" className="dark:not-disabled:text-black" disabled>
            Type
          </option>
          <option value="income" className="dark:text-black">
            Income
          </option>
          <option value="expense" className="dark:text-black">
            Expense
          </option>
        </select>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2 rounded"
        />
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="Date"
          className="border p-2 rounded"
          type="date"
          max={new Date().toISOString().split("T")[0]}
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            name="recurring"
            checked={form.recurring}
            onChange={handleChange}
          />
          Repeat Monthly
        </label>
      </div>
      <div className="flex mt-4 gap-1.5">
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-1"
        >
          {isEditing ? (
            <>
              Update <MdOutlineUpdate />
            </>
          ) : (
            <>
              Add <MdOutlineAddCircle />{" "}
            </>
          )}
        </button>
        {isEditing ? (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded flex items-center gap-1"
          >
            Cancel
          </button>
        ) : (
          <Mic />
        )}
      </div>
    </div>
  );
};

export default AddTransaction;
