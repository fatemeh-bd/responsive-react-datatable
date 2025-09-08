import React from "react";
import Table from "./components/table/Table";
import { ColumnType } from "./components/table/types";

const App: React.FC = () => {
  const columns: ColumnType[] = [
    {
      data: "contractName",
      orderable: true,
      title: "نام قرارداد",
      searchable: false,
      width: 200,
    },
    {
      data: "startDate",
      orderable: true,
      title: "تاریخ شروع",
      searchable: false,
      width: 140,
    },
    {
      data: "endDate",
      orderable: true,
      title: "تاریخ پایان",
      searchable: false,
      width: 140,
    },
    {
      data: "createdAt",
      orderable: true,
      title: "تاریخ ایجاد",
      searchable: false,
      width: 140,
    },
  ];
  return (
    <div className="min-h-screen w-screen  p-6">
      <Table columns={columns} endpoint="endpoint" title="title" />
    </div>
  );
};

export default App;
