import React, { useState } from "react";
import Table from "./components/table/Table";
import { ColumnType, OrderType } from "./components/table/types";
import mock from "./components/table/mockData.json";
import { rowRenderer } from "./components/table/helper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const App: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  // const columns: ColumnType[] = [
  //   {
  //     data: "contractName",
  //     orderable: true,
  //     title: "contract Name",
  //     searchable: false,
  //     width: 200,
  //   },
  //   {
  //     data: "startDate",
  //     orderable: true,
  //     title: "start Date",
  //     searchable: false,
  //     width: 140,
  //   },
  //   {
  //     data: "endDate",
  //     orderable: true,
  //     title: "end Date",
  //     searchable: false,
  //     width: 140,
  //   },
  //   {
  //     data: "createdAt",
  //     orderable: true,
  //     title: "created At",
  //     searchable: false,
  //     width: 140,
  //   },
  // ];
  const [sort, setSort] = useState<OrderType[]>([
    {
      column: 0,
      dir: "desc",
      name: "id",
    },
  ]);
  const [page, setPage] = useState(1);
  const { isLoading, data } = useQuery({
    queryKey: ["", sort, page],
    queryFn: async () => {
      const response = await axios.post(
        "http://10.10.10.22:8090/v1/Company/GetCompanyPaging",
        {
          draw: page,
          columns: [
            {
              data: "id",
              title: "ردیف",
              render: rowRenderer(
                (_cell, _row, index?: number) =>
                  (Number(page) - 1) * 10 + (index! + 1)
              ),
              orderable: true,
              width: 70,
              searchable: false,
              dontShowTitleInMobile: true,
            },
            ...columns,
          ]
            ?.filter((i) => i.data !== null)
            ?.map((item) => ({
              data: item?.data,
              name: item?.data,
              searchable: item?.searchable,
              orderable: item?.orderable,
              search: { value: "", regex: false, fixed: [] },
            })),
          order: sort,
          start: (page - 1) * 10,
          length: 10,
          search: { value: "", regex: false, fixed: [] },
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMjVjZjNlMS05MmRkLTQxNTktNmZhOC1mZTljOTMwMzgwMmEiLCJpc3MiOiJodHRwczovL2xvY2FsSG9zdDo1NDQ1IiwiaWF0IjoxNzU4NjI0ODQ5LCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYyOTFiYTkzLTJlNDEtNDVmOC04ZTBhLTYzMzgwZDk5ZGQwOCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiIwOTEyMTI1NjgxOSIsIkRpc3BsYXlOYW1lIjoiMDkxMjEyNTY4MTkiLCJVc2VySWQiOiI2MjkxYmE5My0yZTQxLTQ1ZjgtOGUwYS02MzM4MGQ5OWRkMDgiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiNjI5MWJhOTMtMmU0MS00NWY4LThlMGEtNjMzODBkOTlkZDA4IiwiVmVyaWZpZWQiOiJ0cnVlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoi2YXYr9uM2LHYp9mGIiwibmJmIjoxNzU4NjI0ODQ5LCJleHAiOjE3NjM4MDg4NDksImF1ZCI6IkFkbWluQXBpQnVzbmV0In0.J9pX7otA3Zz7045sPnMfHulWFmyCpSjNQ0zCRSttORk`,
          },
        }
      );
      return response?.data;
    },
  });
  const columns: ColumnType[] = [
    {
      data: "avatar",
      orderable: false,
      title: "پروفایل",
      dontShowTitleInMobile: true,
      searchable: false,
      width: 80,
      render: rowRenderer((_cell) => (
        <img
          className="size-10 mx-auto !cursor-pointer border-2 border-gray-50 rounded-full hover:shadow-md object-cover avatar"
          src={_cell}
        />
      )),
    },
    {
      data: "colleagueCompanyName",
      orderable: false,
      title: "صاحب قرارداد",
      searchable: true,
      width: 150,
    },
    {
      data: "name",
      orderable: false,
      title: "نام شرکت",
      searchable: true,
      width: 270,
    },

    {
      data: "phoneNumber",
      orderable: false,
      title: "شماره تلفن",
      searchable: true,
      width: 120,
    },
    {
      data: "economicCode",
      orderable: true,
      title: "کد اقتصادی",
      searchable: true,
      width: 120,
    },
    {
      data: "isActive",
      orderable: true,
      title: "فعال / غیرفعال",
      searchable: false,
      width: 100,
      render: rowRenderer((_cell) => _cell?.toString()),
    },

    {
      data: null,
      orderable: false,
      title: "عملیات",
      searchable: false,
      width: 120,
      render: rowRenderer((_cell, _row) => (
        <>
          <button className="py-2 px-6 text-sm bg-amber-300 text-black rounded-full">
            قرارداد ها
          </button>
        </>
      )),
    },
  ];
  return (
    <div className="min-h-screen w-6xl mx-auto p-6" id="content-wrapper">
      <Table
        lang="fa"
        mode="external"
        // internalApiConfig={{
        //   baseUrl: "http://10.10.10.22:8090",
        //   endpoint: "/v1/Company/GetCompanyPaging",
        //   method: "POST",
        //   headers: {
        //     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMjVjZjNlMS05MmRkLTQxNTktNmZhOC1mZTljOTMwMzgwMmEiLCJpc3MiOiJodHRwczovL2xvY2FsSG9zdDo1NDQ1IiwiaWF0IjoxNzU4NjI0ODQ5LCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYyOTFiYTkzLTJlNDEtNDVmOC04ZTBhLTYzMzgwZDk5ZGQwOCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiIwOTEyMTI1NjgxOSIsIkRpc3BsYXlOYW1lIjoiMDkxMjEyNTY4MTkiLCJVc2VySWQiOiI2MjkxYmE5My0yZTQxLTQ1ZjgtOGUwYS02MzM4MGQ5OWRkMDgiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiNjI5MWJhOTMtMmU0MS00NWY4LThlMGEtNjMzODBkOTlkZDA4IiwiVmVyaWZpZWQiOiJ0cnVlIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoi2YXYr9uM2LHYp9mGIiwibmJmIjoxNzU4NjI0ODQ5LCJleHAiOjE3NjM4MDg4NDksImF1ZCI6IkFkbWluQXBpQnVzbmV0In0.J9pX7otA3Zz7045sPnMfHulWFmyCpSjNQ0zCRSttORk`,
        //   },
        // }}
        // staticRows={mock?.data}
        // totalItems={mock?.recordsFiltered}
        isLoading={isLoading}
        totalItems={data?.recordsFiltered}
        externalRows={data?.data}
        onPageChange={(page) => {
          setPage(page);
        }}
        onSortChange={(order) => {
          console.log(order);
          setSort(order ? [order] : []);
        }}
        pageSize={10}
        columns={columns}
        isSelectable
        selectedIds={selectedIds}
        selectedKey="id"
        onSelectChange={(value) => setSelectedIds(value)}
        notify={(text) => alert(text)}
      />
    </div>
  );
};

export default App;
