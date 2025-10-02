import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, NavLink } from "react-router-dom";
import { routes } from "./routes";
import Sidebar from "./components/sidebar/Sidebar";
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <div className="flex">
          <div className="lg:w-[300px] max-w-[300px] fixed z-[99] md:relative">
            <Sidebar />
          </div>
          <div className="flex-1 px-4 py-12 max-w-7xl overflow-x-auto mx-auto">
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
