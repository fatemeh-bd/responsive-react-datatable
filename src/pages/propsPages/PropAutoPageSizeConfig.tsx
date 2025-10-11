import React from "react";
import Table from "../../components/table/Table";
import { ColumnType } from "../../components/table/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import mock from "../../components/table/mockData.json";

const PropAutoPageSizeConfig = () => {
  const columns: ColumnType[] = [
    {
      data: "contractName",
      title: "Contract Name",
      orderable: true,
      searchable: true,
      width: 200,
    },
    {
      data: "startDate",
      title: "Start Date",
      orderable: true,
      searchable: true,
      width: 140,
    },
    {
      data: "endDate",
      title: "End Date",
      orderable: true,
      searchable: false,
      width: 140,
    },
    {
      data: "createdAt",
      title: "Created At",
      orderable: true,
      searchable: false,
      width: 140,
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-pink-400">
        AutoPageSizeConfig – Auto Page Size Configuration
      </h1>

      {/* Description */}
      <p className="text-white text-lg">
        The{" "}
        <code className="bg-blue-400/30 text-blue-400 py-1 px-2  rounded">
          autoPageSizeConfig
        </code>{" "}
        prop enables the table to dynamically calculate the number of rows to
        display based on the available vertical space. This is useful for
        responsive layouts or pages with varying content above or around the
        table.
      </p>

      {/* Code Example */}
      <h2 className="text-2xl font-semibold">Example Usage</h2>
      <SyntaxHighlighter
        language="tsx"
        style={oneDark}
        customStyle={{
          fontSize: "0.85rem",
          borderRadius: "0.5rem",
          padding: "1rem",
        }}
      >
        {`<Table
  autoPageSizeConfig={{
    enabled: true,
    containerSelector: "#content-wrapper",
    subtractSelectors: ["#footer", "#tab"],
    rowHeight: 51.15,
    baseBufferRows: 2,
  }}
/>`}
      </SyntaxHighlighter>

      {/* Options Table */}
      <h2 className="text-2xl font-semibold mt-8">Configuration Options</h2>
      <table className="w-full table-auto border-collapse border border-gray-700 text-left">
        <thead>
          <tr className="bg-gray-800">
            <th className="border border-gray-600 p-2">Option</th>
            <th className="border border-gray-600 p-2">Type</th>
            <th className="border border-gray-600 p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {[
            [
              "enabled",
              "boolean",
              "Enable or disable auto page size calculation.",
            ],
            [
              "containerSelector",
              "string",
              "Required. The selector for the parent element containing the table, e.g., #content-wrapper.",
            ],
            [
              "subtractSelectors",
              "string[]",
              "Optional. Elements inside the container whose heights should be subtracted (headers, filters, tabs).",
            ],
            [
              "rowHeight",
              "number",
              "Height of a single table row in pixels. Default: 51.15.",
            ],
            [
              "baseBufferRows",
              "number",
              "Rows to subtract from visible rows. Default: 2.",
            ],
          ].map(([opt, type, desc]) => (
            <tr key={opt}>
              <td className="border border-gray-600 p-2">
                <code>{opt}</code>
              </td>
              <td className="border border-gray-600 p-2">{type}</td>
              <td className="border border-gray-600 p-2">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* How it Works */}
      <h2 className="text-2xl font-semibold">How It Works</h2>
      <ol className="list-decimal list-inside space-y-2 text-pink-100">
        <li>
          <strong className="!text-pink-400">Parent Container:</strong> Measures
          the height of <code>#content-wrapper</code> or your specified
          container.
        </li>
        <li>
          <strong className="!text-pink-400">Subtract Fixed Elements:</strong>{" "}
          Heights of elements in <code>subtractSelectors</code> are subtracted.
        </li>
        <li>
          <strong className="!text-pink-400">Calculate Rows:</strong> Divide
          available height by <code>rowHeight</code> and subtract buffers.
        </li>
        <li>
          <strong className="!text-pink-400">Dynamic Updates:</strong> A{" "}
          <code>ResizeObserver</code> watches the container and recalculates
          rows when height changes.
        </li>
      </ol>

      {/* Dynamic Example */}
      <h2 className="text-2xl font-semibold">Example with Dynamic Page Size</h2>
      <div className="border border-gray-800 p-4 rounded bg-gray-900">
        <div id="wrapper" className="min-h-[400px]">
          <Table
            tableName="table3"
            columns={columns}
            mode="static"
            staticRows={mock.data}
            totalItems={mock.recordsFiltered}
            autoPageSizeConfig={{
              enabled: true,
              containerSelector: "#wrapper",
              subtractSelectors: ["#footer"],
              rowHeight: 51.15,
              baseBufferRows: 2,
            }}
            colorTheme={{
              backgroundColor: "",
              borderColor: "#364153",
              cellTextColor: "#fff",
              headerTextColor: "#fff",
              headerBackgroundColor: "#364153",
              primaryColor: "#d24670",
            }}
          />
        </div>
      </div>

      {/* Tips */}
      <h2 className="text-2xl flex items-center gap-2 font-bold text-yellow-400">
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="36px"
          width="36px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M7 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm-2-1h8v-2H5v2zm11.5-9.5c0 3.82-2.66 5.86-3.77 6.5H5.27c-1.11-.64-3.77-2.68-3.77-6.5C1.5 5.36 4.86 2 9 2s7.5 3.36 7.5 7.5zm4.87-2.13L20 8l1.37.63L22 10l.63-1.37L24 8l-1.37-.63L22 6l-.63 1.37zM19 6l.94-2.06L22 3l-2.06-.94L19 0l-.94 2.06L16 3l2.06.94L19 6z"></path>
        </svg>
        Tips
      </h2>
      <ul className="list-disc list-inside space-y-1 text-gray-200">
        <li>
          Always point <code>containerSelector</code> to the main wrapper of
          your table.
        </li>
        <li>
          Ensure <code>rowHeight</code> matches your table row styling (
          <code>&lt;tr&gt;</code> height or CSS line-height).
        </li>
      </ul>

      <p className="text-yellow-200">
        This setup ensures your table always fits perfectly in the available
        viewport without vertical scrolling, adapting automatically to different
        page layouts.
      </p>
    </div>
  );
};

export default PropAutoPageSizeConfig;
