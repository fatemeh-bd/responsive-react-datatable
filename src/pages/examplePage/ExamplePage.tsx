import { useState } from "react";
import Table from "../../components/table/Table";
import mock from "../../components/table/mockData.json";
import { ColumnType } from "../../components/table/types";
import { ActionDropDown } from "../../components/table/tools/actionDropDown/ActionDropDown";
import { rowRenderer } from "../../components/table/helper";

const ExamplePage = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeTab, setActiveTab] = useState("firstTab");

  const tabs = [
    { title: "First Tab", value: "firstTab" },
    { title: "Second Tab", value: "secondTab" },
  ];

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
          {tabs.reverse().map((item, index) => {
            return (
              <button
                key={index}
                className={`${tabStyle} ${
                  activeTab === item.value ? activeTabStyle : inactiveTabStyle
                }`}
                onClick={() => setActiveTab(item.value)}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4">
        {activeTab === "firstTab" && (
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

        {activeTab === "secondTab" && (
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
