"use client";
import { useState } from "react";
import Table, { rowRenderer, type ColumnType } from "responsive-react-datatable";
const columns: ColumnType[] = [
  { data: "name", title: "Person", orderable: true, searchable: true },
  { data: null, title: "Action", render: rowRenderer((_cell, row) => <span>{row.name.length} letters</span>) },
];
export default function Interactive() {
  const [selected, setSelected] = useState<Array<number | string>>([]);
  return <section aria-label="Interactive client wrapper"><Table mode="static" lang="fa"
    tableName="interactive" pageQueryName="clientPage" pageSizeQueryName="clientSize"
    columns={columns} staticRows={[{ id: 0, name: "Ada" }, { id: 1, name: "Grace" }]}
    isSelectable selectedIds={selected} onSelectChange={setSelected} listMode />
    <output aria-label="Selected IDs">{selected.join(",")}</output></section>;
}
