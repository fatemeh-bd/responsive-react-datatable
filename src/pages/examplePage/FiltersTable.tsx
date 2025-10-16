import axios from "axios";
import Table from "../../components/table/Table";
import { useState } from "react";
import { ColumnType } from "../../components/table/types";
import { useQuery } from "@tanstack/react-query";
import { rowRenderer } from "../../components/table/helper";
import { ChevronDown } from "../../components/table/icons";

// 🔹 SelectBox component
interface SelectBoxProps {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

// 🔸 FiltersTable component
const FiltersTable = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // 🔸 Columns
  const columns: ColumnType[] = [
    {
      data: "images",
      dontShowTitleInMobile: true,
      orderable: false,
      title: "image",
      searchable: false,
      width: 70,
      render: rowRenderer((_cell) => (
        <img src={_cell[0]} className="md:size-12 size-32 mx-auto" />
      )),
    },
    { data: "title", title: "title", width: 150 },
    { data: "price", title: "price", width: 140 },
    { data: "rating", title: "rating", width: 80 },
    { data: "category", title: "category", width: 140 },
    {
      data: null,
      title: "operation",
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

  // 🔹 Fetch data based on filters
  const { data, isFetching } = useQuery({
    queryKey: [
      "get-sample-datas",
      page,
      pageSize,
      search,
      selectedCategory,
      selectedBrand,
    ],
    queryFn: async () => {
      let url = "";

      if (selectedCategory) {
        // ✅ Filter by category endpoint
        url = `https://dummyjson.com/products/category/${selectedCategory}?limit=${pageSize}&skip=${
          (page - 1) * pageSize
        }`;
      } else {
        // ✅ Default: search all products
        url = `https://dummyjson.com/products/search?q=${search}&limit=${pageSize}&skip=${
          (page - 1) * pageSize
        }`;
      }

      const response = await axios.get(url);
      let products = response?.data?.products || [];

      // ✅ Apply brand filter client-side (dummyjson doesn't support brand filter on API)
      if (selectedBrand) {
        products = products.filter(
          (p: any) => p.brand?.toLowerCase() === selectedBrand.toLowerCase()
        );
      }

      return { ...response.data, products };
    },
  });

  // 🔹 Render table
  return (
    <Table
      lang="en"
      isLoading={isFetching}
      mode="external"
      externalRows={data?.products}
      totalItems={data?.total}
      columns={columns}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      onSearch={setSearch}
      pageSize={6}
      height="570px"
      tableName="table1"
      colorTheme={{
        backgroundColor: "#000",
        borderColor: "#364153",
        cellTextColor: "#fff",
        headerTextColor: "#fff",
        headerBackgroundColor: "#364153",
        primaryColor: "#d24670",
      }}
      // ✅ filters must be wrapped in Fragment (<> </>)
      filters={
        <>
          <SelectBox
            label="category"
            options={["beauty", "fragrances"]}
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setPage(1); // reset page on filter change
            }}
          />
          <SelectBox
            label="brand"
            options={[
              "Essence",
              "Calvin Klein",
              "Glamour Beauty",
              "Nail Couture",
              "Velvet Touch",
              "Chic Cosmetics",
            ]}
            value={selectedBrand}
            onChange={(val) => {
              setSelectedBrand(val);
              setPage(1);
            }}
          />
        </>
      }
      topFilter={
        <>
          <SelectBox
            label="category"
            options={["beauty", "fragrances"]}
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setPage(1); // reset page on filter change
            }}
          />
          <SelectBox
            label="brand"
            options={[
              "Essence",
              "Calvin Klein",
              "Glamour Beauty",
              "Nail Couture",
              "Velvet Touch",
              "Chic Cosmetics",
            ]}
            value={selectedBrand}
            onChange={(val) => {
              setSelectedBrand(val);
              setPage(1);
            }}
          />
        </>
      }
      actionButtons={
        <button className="bg-blue-600 py-2 px-4 rounded-xl">
          + New Record{" "}
        </button>
      }
      notify={(text) => alert(text)}
    />
  );
};

export default FiltersTable;

const SelectBox: React.FC<SelectBoxProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <span className="text-xs capitalize">{label}</span>
      <div className="relative">
        <select
          style={{
            borderColor: "#364153",
            backgroundColor: "#000",
          }}
          className="page-size-select cursorPointer !px-3 appearance-none pr-6"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          <option value="">All</option>
          {options.map((opt) => (
            <option key={opt} className="page-size-option" value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute top-0 bottom-0 right-2 my-auto pointer-events-none" />
      </div>
    </div>
  );
};
