import React from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import DocumentPage from "./pages/documentPage/HomePage";

const App: React.FC = () => {
  return (
    <div className="min-h-[95svh] relative" id="content-wrapper">
      <Routes>
        <Route path="/document/:version" element={<DocumentPage />} />
        {routes.map((route,index) => (
          <React.Fragment key={route.path||index}>
            <Route  path={route.path} element={route.element} />
            {route?.children?.map((item) => (
              <Route key={item.path} path={item.path} element={item.element} />
            ))}
          </React.Fragment>
        ))}
      </Routes>
    </div>
  );
};

export default App;
