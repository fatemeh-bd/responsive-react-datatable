import React from "react";
import Table from "./components/table/Table";

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-screen p-6" id="content-wrapper">
      <Table />
    </div>
  );
};

export default App;
