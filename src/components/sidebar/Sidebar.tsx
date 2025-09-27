import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="fixed top-0 right-0 w-64 h-screen bg-gray-800 p-4 flex flex-col z-10">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-white py-3 px-4 rounded-lg text-right text-lg transition-colors ${
            isActive ? "bg-teal-500" : "hover:bg-gray-700"
          }`
        }
      >
        خانه
      </NavLink>
      <NavLink
        to="/example"
        className={({ isActive }) =>
          `text-white py-3 px-4 rounded-lg text-right text-lg transition-colors ${
            isActive ? "bg-teal-500" : "hover:bg-gray-700"
          }`
        }
      >
        مثال
      </NavLink>
    </div>
  );
};

export default Sidebar;
