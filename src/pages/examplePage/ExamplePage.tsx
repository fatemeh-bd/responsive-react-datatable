import { useState } from "react";
import Table from "../../components/table/Table";
import mock from "../../components/table/mockData.json";
import { ColumnType } from "../../components/table/types";

const ExamplePage = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("tab2");

  const columns1: ColumnType[] = [
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
  ];

  const tabStyle =
    "py-2 px-4 rounded-t-lg transition-colors duration-200 cursor-pointer";
  const activeTabStyle = "bg-[#364153] text-[#d24670]";
  const inactiveTabStyle = "hover:bg-[#364153]";

  return (
    <div
      id="content-wrapper"
      className="flex flex-col gap-6 max-w-7xl mx-auto overflow-auto mt-8"
    >
      <div className="border-b-2 border-[#364153]">
        <div className="flex justify-end gap-1">
          <button
            className={`${tabStyle} ${
              activeTab === "tab1" ? activeTabStyle : inactiveTabStyle
            }`}
            onClick={() => setActiveTab("tab1")}
          >
            Second Tab
          </button>
          <button
            className={`${tabStyle} ${
              activeTab === "tab2" ? activeTabStyle : inactiveTabStyle
            }`}
            onClick={() => setActiveTab("tab2")}
          >
            First Tab
          </button>
        </div>
      </div>
      <div className="mt-4">
        {activeTab === "tab1" && (
          <div>
            <Table
              lang="en"
              saveSearch
              mode="static"
              tableName="table1"
              autoPageSizeConfig={{
                enabled: true,
                containerSelector: "#content-wrapper",
                subtractSelectors: ["#footer"],
                optionalSelectorsForExtraBuffer: ["#footer"],
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
              columns={columns1}
              isSelectable
              selectedIds={selectedIds}
              selectedKey="id"
              onSelectChange={(value) => setSelectedIds(value)}
              notify={(text) => alert(text)}
              listMode
            />
          </div>
        )}

        {activeTab === "tab2" && (
          <div>
            <Table
              lang="en"
              saveSearch
              mode="static"
              tableName="table2"
              autoPageSizeConfig={{
                enabled: true,
                containerSelector: "#content-wrapper",
                subtractSelectors: ["#footer"],
                optionalSelectorsForExtraBuffer: ["#footer"],
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
              columns={columns1}
              isSelectable
              selectedIds={selectedIds}
              selectedKey="id"
              onSelectChange={(value) => setSelectedIds(value)}
              notify={(text) => alert(text)}
              listMode
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamplePage;
