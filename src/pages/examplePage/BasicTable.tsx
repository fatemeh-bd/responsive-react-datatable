import Table from "../../components/table/Table";
import { ColumnType } from "../../components/table/types";
import mock from "../../components/table/mockData.json";
import { rowRenderer } from "../../components/table/helper";
const BasicTable = () => {
  const columns: ColumnType[] = [
    {
      data: "contractName",
      orderable: true,
      title: "contract Name",
      searchable: true,
      width: 200,
    },
    {
      data: "startDate",
      orderable: true,
      title: "start Date",
      searchable: true,
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
    {
      data: null,
      orderable: false,
      title: "Operation",
      searchable: false,
      width: 140,
      render: rowRenderer((_cell, _row) => (
        <button className="bg-rose-200 rounded-2xl py-1.5 font-bold text-base px-4 text-black">
          Detail of
          <span className="ml-1">{_row?.contractName?.slice(0, 5)}</span>{" "}
        </button>
      )),
    },
  ];
  return (
    <Table
      lang="en"
      mode="static"
      pageSize={12}
      height="615px"
      tableName="table1"
      colorTheme={{
        backgroundColor: "",
        borderColor: "#364153",
        cellTextColor: "#fff",
        headerTextColor: "#fff",
        headerBackgroundColor: "#364153",
        primaryColor: "#d24670",
      }}
      staticRows={mock?.data}
      totalItems={mock?.recordsFiltered}
      columns={columns}
      notify={(text) => alert(text)}
      listMode
    />
  );
};

export default BasicTable;
