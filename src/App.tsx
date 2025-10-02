import React, { useState } from "react";
import { rowRenderer } from "./components/table/helper";
import Particles from "./components/particles/Particles";
import { Route, Routes } from "react-router-dom";
import DocumentPage from "./pages/documentPage/HomePage";
import ExamplePage from "./pages/examplePage/ExamplePage";
import WellcomePage from "./pages/welcomePage/WelcomePage";
import { routes } from "./routes";

const App: React.FC = () => {
  return (
    <div className="min-h-[95svh] relative" id="content-wrapper">
      <div
        style={{ width: "100%", height: "100svh", position: "absolute" }}
        className="top-0 -z-40"
      >
        <Particles
          particleColors={["#fafafa", "#fafafa"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
};

export default App;
