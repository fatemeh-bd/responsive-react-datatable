import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { routes } from "../../routes";
import { CgMenuRight } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { useQueryParams } from "../table/hooks/useQueryParams";
import SidebarFooter from "./SidebarFooter";
import { CloseIcon } from "../table/icons";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { removeParams } = useQueryParams();

  return (
    <>
      <div className="flex fixed w-full z-[999] h-fit justify-between items-center md:hidden bg-[#364153] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <img src="logo.svg" alt="logo" height={40} width={40} />
          <h2 className="font-semibold text-white text-lg">React Table</h2>
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <IoClose size={28} className="text-white" />
          ) : (
            <CgMenuRight size={28} className="text-white" />
          )}
        </button>
      </div>
      <div className="lg:w-[300px] max-w-[300px] fixed z-[999] md:relative max-md:top-[4rem]">
        {/* Mobile Header */}

        {/* Sidebar */}
        <aside
          className={`flex flex-col justify-between bg-black border-r border-[#364153] w-screen md:w-[300px] min-h-screen p-4 h-full transition-all duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-[-100%] md:translate-x-0"
          }`}
        >
          <div className="sticky top-1">
            <div className="hidden md:flex flex-col items-center mx-auto gap-2 my-2">
              <img src="logo.svg" alt="logo" height={40} width={40} />
              <h2 className="font-semibold text-white text-xl">React Table</h2>
            </div>
            <nav className="flex flex-col">
              {routes.map((item, index) => (
                <React.Fragment key={index}>
                  <NavLink
                    to={item.path || ""}
                    className={({ isActive }) =>
                      `text-white flex justify-center gap-2 md:justify-between items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "!text-[#d24670] outline-[#d24670] outline-1"
                          : "hover:bg-gray-700"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg md:text-base">{item.name}</span>
                    {item.icon && <item.icon size={20} />}
                  </NavLink>

                  {item.children && (
                    <ul className="flex flex-col ml-8 md:list-disc mt-1">
                      {item.children.map((child, cIndex) => (
                        <li key={cIndex}>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `text-white flex justify-center gap-2 md:justify-between items-center py-2 pr-4 rounded-lg transition-all duration-200 ${
                                isActive
                                  ? "!text-[#d24670]"
                                  : "hover:text-rose-300"
                              }`
                            }
                            onClick={() => {
                              setIsOpen(false);
                              removeParams("pageSize");
                              removeParams("page");
                            }}
                          >
                            <span className="text-base">{child.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="h-[1px] w-full bg-gray-700 my-2 last:hidden"></div>
                </React.Fragment>
              ))}
            </nav>
          </div>
          <SidebarFooter />
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
