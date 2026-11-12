"use client";
import { useState } from "react";
import Table, { type ColumnType, type RowId } from "react-responsive-datatable-kit";
const columns: ColumnType[] = [
  { data: "name", title: "Name", hideable: false },
  { data: "amount", title: "Amount" },
  { data: "email", title: "Email", hidden: true },
];
const rows = [{ id: 0, name: "سمیرا", amount: 12.5, email: "samira@example.com", notes: "جزئیات ردیف اول" },
  { id: 1, name: "Roya", amount: 25, email: "roya@example.com", notes: "Second person details" }];
export default function Features() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selected, setSelected] = useState<RowId[]>([]);
  const [loading, setLoading] = useState(true);
  return <><section aria-label="New table features">
    <button type="button" onClick={() => setTheme(value => value === "light" ? "dark" : "light")}>Toggle table theme</button>
    <Table mode="static" columns={columns} staticRows={rows} pageSize={1} theme={theme} className="fixture-features" style={{ padding: 8 }}
      tableName="features" pageQueryName="featuresPage" pageSizeQueryName="featuresSize" columnVisibility
      exportConfig={{ fileName: "features" }} expandableRows={{ render: row => <p>{row.notes}</p> }}
      isSelectable selectedIds={selected} onSelectChange={setSelected} listMode />
  </section><section aria-label="Loading layout stability">
    <button type="button" onClick={() => setLoading(value => !value)}>Toggle table loading</button>
    <Table mode="external" columns={[{ data: "name", title: "Name", width: 180 }, { data: "amount", title: "Amount", width: 140 }, { data: "notes", title: "Notes", width: 240 }]}
      externalRows={rows} totalItems={2} isLoading={loading} pageSize={3} height="180px"
      pageQueryName="loadingPage" pageSizeQueryName="loadingSize" />
  </section></>;
}
