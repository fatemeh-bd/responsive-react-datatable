import Table from "../../components/table/Table";
import { ColumnType } from "../../components/table/types";
import { rowRenderer } from "../../components/table/helper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
const ExternalTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");

  const columns: ColumnType[] = [
    {
      data: "images",
      dontShowTitleInMobile: true,
      orderable: false,
      title: "image",
      searchable: false,
      width: 70,
      render: rowRenderer((_cell, _row) => (
        <img src={_cell[0]} className="md:size-12 size-32 mx-auto" />
      )),
    },
    {
      data: "title",
      orderable: false,
      title: "title",
      searchable: false,
      width: 150,
    },
    {
      data: "price",
      orderable: false,
      title: "price",
      searchable: false,
      width: 140,
    },
    {
      data: "rating",
      orderable: false,
      title: "rating",
      searchable: false,
      width: 80,
    },
    {
      data: "category",
      orderable: false,
      title: "category",
      searchable: false,
      width: 140,
    },
    {
      data: null,
      orderable: false,
      title: "operation",
      searchable: false,
      width: 140,
      render: rowRenderer((_cell, _row) => (
        <button
          className="bg-[#d24670] rounded-2xl px-4 py-1"
          onClick={() => alert(_row?.title)}
        >
          click me
        </button>
      )),
    },
  ];
  const { data, isFetching } = useQuery({
    queryKey: ["get-sample-datas", page, pageSize, search],
    queryFn: async () => {
      const response = await axios.get(
        `https://dummyjson.com/products/search?q=${search}&limit=${pageSize}&skip=${
          (page - 1) * pageSize
        }`
      );
      console.log(response?.data);
      return response?.data;
    },
  });
  return (
    <Table
      lang="en"
      isLoading={isFetching}
      mode="external"
      externalRows={data?.products}
      totalItems={data?.total}
      columns={columns}
      onPageChange={(value) => setPage(value)}
      onPageSizeChange={(value) => setPageSize(value)}
      onSearch={(value) => setSearch(value)}
      pageSize={5}
      height="570px"
      tableName="table1"
      // colorTheme={{
      //   backgroundColor: "#000",
      //   borderColor: "#364153",
      //   cellTextColor: "#fff",
      //   headerTextColor: "#fff",
      //   headerBackgroundColor: "#364153",
      //   primaryColor: "#d24670",
      // }}
      notify={(text) => alert(text)}
    />
  );
};

export default ExternalTable;
