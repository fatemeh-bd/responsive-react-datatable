import React, { useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { routes } from "../../routes";
import { CgMenuRight } from "react-icons/cg";
import { IoClose } from "react-icons/io5";
import { useQueryParams } from "../table/hooks/useQueryParams";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { removeParams } = useQueryParams();

  return (
    <>
      {/* Mobile Header */}
      <div className="flex w-screen justify-between items-center md:hidden bg-[#364153] z-[999] px-4 py-2.5">
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

      {/* Sidebar */}
      <aside
        className={`bg-black border-r border-[#364153] w-screen md:w-[300px] min-h-screen p-4 h-full z-[999] transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-[-100%] md:translate-x-0"
        }`}
      >
        <div className="sticky top-4">
          <div className="hidden md:flex flex-col items-center mx-auto gap-2 my-8">
            <img src="logo.svg" alt="logo" height={50} width={50} />
            <h2 className="font-semibold text-white text-2xl">React Table</h2>
          </div>

          <nav className="flex flex-col">
            {routes.map((item, index) => (
              <React.Fragment key={index}>
                {item.children ? (
                  // اگه آیتم فرزند داره، کلیک‌پذیر نباشه
                  <div className="text-white flex justify-center gap-2 md:justify-between items-center py-2 px-4 rounded-lg transition-all duration-200 cursor-default select-none">
                    <span className="text-lg md:text-base">{item.name}</span>
                    {item.icon && <item.icon size={20} />}
                  </div>
                ) : (
                  // آیتم‌های بدون فرزند همون NavLink باشن
                  <NavLink
                    to={item.path}
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
                )}

                {/* لیست بچه‌ها */}
                {item?.children && (
                  <ul className="flex flex-col ml-8 list-disc">
                    {item.children.map((child, cIndex) => (
                      <li key={cIndex}>
                        <NavLink
                          to={child.path}
                          className={({ isActive }) =>
                            `text-white flex justify-center gap-2 md:justify-between items-center py-2 pr-4 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "!text-[#d24670] opacity-100"
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
      </aside>
    </>
  );
};

export default Sidebar;
