"use client";
import { useState } from "react";
import Table, { rowRenderer, type ColumnType } from "react-responsive-datatable-kit";
const columns: ColumnType[] = [
  { data: "name", title: "Person", orderable: true, searchable: true },
  { data: null, title: "Action", render: rowRenderer((_cell, row) => <span>{row.name.length} letters</span>) },
];
export default function Interactive() {
  const [selected, setSelected] = useState<Array<number | string>>([]);
  return <section aria-label="Interactive client wrapper"><Table mode="static" lang="fa"
    tableName="interactive" pageQueryName="clientPage" pageSizeQueryName="clientSize"
    columns={columns} staticRows={[{ id: 0, name: "Ada" }, { id: 1, name: "Grace" }]}
    isSelectable selectedIds={selected} onSelectChange={setSelected} listMode
    rowClassName={() => "interactive-person-row"} />
    <output aria-label="Selected IDs">{selected.join(",")}</output>
    <section aria-label="Request recovery"><Table mode="internal" columns={columns}
      tableName="recovery" pageQueryName="requestPage" pageSizeQueryName="requestSize"
      internalApiConfig={{ endpoint: "/api/retry-fixture", method: "GET" }} /></section>
  </section>;
}
