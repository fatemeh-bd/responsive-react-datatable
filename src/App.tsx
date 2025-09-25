import React, { useState } from "react";
import Table from "./components/table/Table";
import { ColumnType } from "./components/table/types";
import { rowRenderer } from "./components/table/helper";
import GithubReadmeFetcher from "./components/githubReadmeFetcher/GithubReadmeFetcher";
import Particles from "./components/particles/Particles";
import mock from "./components/table/mockData.json";
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
  // const columns: ColumnType[] = [
  //   {
  //     data: "avatar",
  //     orderable: false,
  //     title: "پروفایل",
  //     dontShowTitleInMobile: true,
  //     searchable: false,
  //     width: 80,
  //     render: rowRenderer((_cell) => (
  //       <img
  //         className="size-10 mx-auto !cursor-pointer border-2 border-gray-700 rounded-full hover:shadow-md object-cover avatar"
  //         src={_cell}
  //       />
  //     )),
  //   },
  //   {
  //     data: "colleagueCompanyName",
  //     orderable: false,
  //     title: "صاحب قرارداد",
  //     searchable: true,
  //     width: 150,
  //   },
  //   {
  //     data: "name",
  //     orderable: false,
  //     title: "نام شرکت",
  //     searchable: true,
  //     width: 270,
  //   },

  //   {
  //     data: "phoneNumber",
  //     orderable: false,
  //     title: "شماره تلفن",
  //     searchable: true,
  //     width: 120,
  //   },
  //   {
  //     data: "economicCode",
  //     orderable: true,
  //     title: "کد اقتصادی",
  //     searchable: true,
  //     width: 120,
  //   },
  //   {
  //     data: "isActive",
  //     orderable: true,
  //     title: "فعال / غیرفعال",
  //     searchable: false,
  //     width: 100,
  //     render: rowRenderer((_cell) => _cell?.toString()),
  //   },

  //   {
  //     data: null,
  //     orderable: false,
  //     title: "عملیات",
  //     searchable: false,
  //     width: 120,
  //     render: rowRenderer((_cell, _row) => (
  //       <>
  //         <button className="py-2 px-6 text-sm bg-[#d24670] text-white rounded-full">
  //           قرارداد ها
  //         </button>
  //       </>
  //     )),
  //   },
  // ];
  return (
    <div className="min-h-screen" id="content-wrapper">
      <div
        style={{ width: "100%", height: "100vh", position: "absolute" }}
        className="top-0"
      >
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        <Table
          lang="en"
          mode="static"
          pageSize={11}
          autoPageSizeConfig={{
            enabled: true,
            containerSelector: "#content-wrapper",
            subtractSelectors: [
              "#filters",
              "#topFilter",
              "#tabPage",
              "#paging",
              "#userCards",
              "#title",
            ],
            optionalSelectorsForExtraBuffer: [
              "#tabPage",
              "#topFilter",
              "#userCards",
              "#title",
            ],
            rowHeight: 51.15,
            baseBufferRows: 2,
            extraBufferRows: 1,
          }}
          colorTheme={{
            rowBg: "",
            borderColor: "#364153",
            rowBorder: "#364153",
            cellText: "#fff",
            headerText: "#fff",
            headerBg: "#364153",
            searchBoxBorderColor: "#364153",
            searchBoxBgColor: "",
            searchBoxTextColor: "#fff",
          }}
          // internalApiConfig={{
          //   baseUrl: "http://10.10.10.22:8090",
          //   endpoint: "/v1/Company/GetCompanyPaging",
          //   method: "POST",
          //   headers: {
          //     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMjVjZjNlMS05MmRkLTQxNTktNmZhOC1mZTljOTMwMzgwMmEiLCJpc3MiOiJodHRwczovL2xvY2FsSG9zdDo1NDQ1IiwiaWF0IjoxNzU4NjI0ODQ5LCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYyOTFiYTkzLTJlNDEtNDVmOC04ZTBhLTYzMzgwZDk5ZGQwOCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiIwOTEyMTI1NjgxOSIsIkRpc3BsYXlOYW1lIjoiMDkxMjEyNTY4MTkiLCJVc2VySWQiOiI2MjkxYmE5My0yZTQxLTQ1ZjgtOGUwYS02MzM4MGQ5OWRkMDgiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiNjI5MWJhOTMtMmU0MS00NWY4LThlMGEtNjMzODBkOTlkZDA4IiwiVmVyaWZpZWQiOiJ0cnVlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoi2YXYr9uM2LHYp9mGIiwibmJmIjoxNzU4NjI0ODQ5LCJleHAiOjE3NjM4MDg4NDksImF1ZCI6IkFkbWluQXBpQnVzbmV0In0.J9pX7otA3Zz7045sPnMfHulWFmyCpSjNQ0zCRSttORk`,
          //   },
          // }}

          staticRows={mock?.data}
          totalItems={mock?.recordsFiltered}
          columns={columns}
          isSelectable
          selectedIds={selectedIds}
          selectedKey="id"
          onSelectChange={(value) => setSelectedIds(value)}
          notify={(text) => alert(text)}
        />

        <GithubReadmeFetcher readmeUrl="https://github.com/fatemeh-bd/responsive-react-datatable/blob/main/README.md" />
      </div>
    </div>
  );
};

export default App;
