import React from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../../routes";

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-black border-r border-[#364153] w-[300px] min-h-screen p-4 h-full">
      <div className="flex flex-col items-center mx-auto gap-2 my-8">
        <img src="logo.svg" alt="logo" height={50} width={50} />
        <h2 className="font-semibold text-white text-2xl">React Table</h2>
      </div>
      <nav className="flex flex-col sticky top-4">
        {routes.map((item, index) => {
          return (
            <React.Fragment key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-white flex justify-between items-center transition-all py-2 px-4 rounded-lg duration-200 ${
                    isActive
                      ? "!text-[#d24670] outline outline-[#d24670]"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                <span>{item.name}</span>
                {item.icon && <item.icon size={20} />}
              </NavLink>

              <div className="h-[1px] w-full bg-gray-700 my-2"></div>
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
