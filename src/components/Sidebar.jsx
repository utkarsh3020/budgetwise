import React, { useState } from "react";
import { IoBarChartSharp } from "react-icons/io5";
import { LuChartLine, LuLayoutDashboard, LuLogOut } from "react-icons/lu";
import {
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdCurrencyRupee,
} from "react-icons/md";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Close sidebar by default on small screens
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 968) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-100 dark:bg-gray-900 p-4 space-y-4 h-full transition-all duration-300 dark:text-white sm:block hidden`}
    >
      <button
        className="text-sm text-gray-600 dark:text-gray-300 mb-4"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <MdArrowBackIosNew size={24} />
        ) : (
          <MdArrowForwardIos size={24} />
        )}
      </button>
      {sidebarOpen && (
        <h2 className="text-xl font-bold mb-4">BudgetWise</h2>
      )}
      <nav className="space-y-2">
        <NavLink to="/" className={({ isActive}) => `flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 dark:bg-gray-700" : ""}`}>
          <LuLayoutDashboard size={24} className={sidebarOpen && "mr-2"} />
          {sidebarOpen && "Dashboard"}
        </NavLink>
        <NavLink to="/transactions" className={({ isActive}) => `flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 dark:bg-gray-700" : ""}`}>
          <MdCurrencyRupee size={24} className={sidebarOpen && "mr-2"} />
          {sidebarOpen && "Transactions"}
        </NavLink>
        <NavLink to="/insights" className={({ isActive}) => `flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 dark:bg-gray-700" : ""}`}>
          <LuChartLine size={24} className={sidebarOpen && "mr-2"} />
          {sidebarOpen && "Insights"}
        </NavLink>
        {/* <NavLink to="/login" className={({ isActive}) => `flex items-center w-full text-left px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 dark:bg-gray-700" : ""}`}>
          <LuLogOut size={24} className={sidebarOpen && "mr-2"} />
          {sidebarOpen && "Logout"}
        </NavLink> */}
      </nav>
    </aside>
  );
};

export default Sidebar;
