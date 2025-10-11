import Table from "../../components/table/Table";
import { ColumnType } from "../../components/table/types";
import { rowRenderer } from "../../components/table/helper";
import { ActionDropDown } from "../../components/table/tools/actionDropDown/ActionDropDown";
import mock from "../../components/table/mockData.json";
const StaticAutoPageSizeTable = () => {
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
      render: rowRenderer(() => (
        <ActionDropDown
          options={[
            { label: "detail", href: "https://example.com" },
            { label: "show alert", onClick: () => alert("hi") },
          ]}
        />
      )),
    },
  ];
  return (
    <Table
      lang="en"
      mode="static"
      tableName="table2"
      autoPageSizeConfig={{
        enabled: true,
        containerSelector: "#content-wrapper",
        subtractSelectors: ["#footer", "#tabId"],
        optionalSelectorsForExtraBuffer: ["#footer", "#tabId"],
        rowHeight: 51.15,
        baseBufferRows: 3,
        extraBufferRows: 1,
      }}
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
    />
  );
};

export default StaticAutoPageSizeTable;
