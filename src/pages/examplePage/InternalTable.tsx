import Table from "../../components/table/Table";
import { ColumnType } from "../../components/table/types";
const InternalTable = () => {
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
  ];
  return (
    <Table
      lang="en"
      mode="internal"
      internalApiConfig={{
        baseUrl: "https://fatemeh-bd.github.io/responsive-react-datatable",
        endpoint: "/mockData.json",
        method: "GET",
        sortType: "desc",
        customBody: [
          {
            example: "test",
            isFilter: true, // Needed for mobile filter
            noRefresh: true, // Do not refetch API when this value changes
          },
        ],
        defaultSortBy: "id",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer your-token`,
        },
        onFetch: (response) => {
          console.log(response);
        },
      }}
      columns={columns}
      pageSize={10}
      height="570px"
      tableName="table4"
      colorTheme={{
        backgroundColor: "#000",
        borderColor: "#364153",
        cellTextColor: "#fff",
        headerTextColor: "#fff",
        headerBackgroundColor: "#364153",
        primaryColor: "#d24670",
      }}
      notify={(text) => alert(text)}
    />
  );
};

export default InternalTable;
