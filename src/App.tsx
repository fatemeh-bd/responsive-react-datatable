import React, { useState } from "react";
import Table from "./components/table/Table";
import { ColumnType } from "./components/table/types";
const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const columns: ColumnType[] = [
    {
      data: "contractName",
      orderable: true,
      title: "contract Name",
      searchable: false,
      width: 200,
    },
    {
      data: "startDate",
      orderable: true,
      title: "start Date",
      searchable: false,
      width: 140,
    },
    {
      data: "endDate",
      orderable: true,
      title: "end Date",
      searchable: false,
      width: 140,
    },
    {
      data: "createdAt",
      orderable: true,
      title: "created At",
      searchable: false,
      width: 140,
    },
  ];

  return (
    <div className="min-h-screen w-6xl mx-auto p-6" id="content-wrapper">
      <Table
        columns={columns}
        isSelectable
        selectedIds={selectedIds}
        selectedKey="id"
        onSelectChange={(value) => setSelectedIds(value)}
      />
    </div>
  );
};

export default App;
