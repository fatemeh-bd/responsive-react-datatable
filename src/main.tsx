import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, NavLink } from "react-router-dom";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <div className="flex">
          {/* سایدبار با ترکیب ساختار قبلی و دکمه‌های جدید */}
          <aside className="bg-black border-r border-[#364153] w-[300px] h-screen p-4 fixed">
            <div className="flex items-center mx-auto gap-2">
              <img src="logo.svg" alt="logo" height={50} width={50} />
              <h2 className="font-semibold text-white">React Table</h2>
            </div>
            {/* دکمه‌های ناوبری */}
            <nav className="mt-8 flex flex-col gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-white py-2 px-4 rounded-lg transition-colors ${
                    isActive
                      ? "!text-[#d24670] outline outline-[#d24670]"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                Documentation
              </NavLink>
              <div></div>

              <NavLink
                to="/example"
                className={({ isActive }) =>
                  `text-white py-2 px-4 rounded-lg transition-colors ${
                    isActive
                      ? "!text-[#d24670] outline outline-[#d24670]"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                Example
              </NavLink>
            </nav>
          </aside>
          {/* فضای خالی برای جلوگیری از تداخل محتوا با سایدبار */}
          <div className="w-[300px] shrink-0"></div>
          {/* محتوای اصلی */}
          <div className="flex-1 px-4 py-12 max-w-7xl mx-auto">
            <App />
            <h2 className="text-xl text-[#d24670] font-bold text-center mt-8">
              Design with{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 inline text-[#d24670]"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42
                 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>{" "}
              by{" "}
              <a
                target="_blank"
                href="https://github.com/fatemeh-bd"
                className="underline cursor-pointer"
              >
                Fatemeh baridaryan
              </a>{" "}
              &{" "}
              <a
                target="_blank"
                href="https://zephinax.com"
                className="underline cursor-pointer"
              >
                Zephinax
              </a>
            </h2>
          </div>
        </div>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
