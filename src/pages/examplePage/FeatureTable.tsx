import { useState } from "react";
import Table from "../../components/table/Table";
import type { ColumnType, RowId, TableTheme } from "../../components/table/types";

const columns: ColumnType[] = [
  { data: "name", title: "Name", orderable: true, searchable: true, hideable: false },
  { data: "role", title: "Role", orderable: true },
  { data: "status", title: "Status", render: cell => <span className="docs-status">{String(cell)}</span> },
  { data: "email", title: "Email", hidden: true },
];
const rows = [
  { id: 0, name: "Mina Rahimi", role: "Designer", status: "Active", email: "mina@example.com", notes: "Leads the product design system. Available for new projects." },
  { id: 1, name: "Arman Kazemi", role: "Developer", status: "Active", email: "arman@example.com", notes: "Builds accessible interfaces and maintains the component library." },
  { id: 2, name: "Leila Ahmadi", role: "Product manager", status: "Away", email: "leila@example.com", notes: "Coordinates the next release. Returns on Monday." },
  { id: 3, name: "Nima Farahani", role: "Developer", status: "Active", email: "nima@example.com", notes: "Works on API integration and performance." },
  { id: 4, name: "Sara Moradi", role: "Researcher", status: "Active", email: "sara@example.com", notes: "Turns customer feedback into practical product improvements." },
];

export default function FeatureTable({ theme = "light", feature = "all" }: { theme?: TableTheme; feature?: string }) {
  const [selected, setSelected] = useState<RowId[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  return <>{feature === "loading" && <button type="button" className="table-tool-button" style={{ margin: 16 }} onClick={() => setLoading(value => !value)}>{loading ? "Show data" : "Show loading"}</button>}
    <Table mode="static" columns={columns} staticRows={feature === "filters" ? rows.filter(row => row.name.toLowerCase().includes(name.toLowerCase())) : rows} pageSize={3}
    isLoading={feature === "loading" && loading}
    theme={theme} className="people-table" style={{ padding: 16 }}
    tableName="docs-people" pageQueryName="docsPage" pageSizeQueryName="docsSize"
    isSelectable={feature === "all" || feature === "selection"} selectedIds={selected} onSelectChange={setSelected}
    columnVisibility={feature === "all" || feature === "columns"}
    exportConfig={feature === "all" || feature === "exports" ? { fileName: "people", formats: ["csv", "xlsx", "pdf"] } : false}
    expandableRows={feature === "all" || feature === "details" ? { render: row => <div><strong>{row.name}</strong><p>{row.email}</p><p>{row.notes}</p></div> } : undefined}
    filters={feature === "filters" ? <input aria-label="Filter by name" placeholder="Filter by name" value={name} onChange={event => setName(event.target.value)} /> : undefined}
    onClearFilters={() => setName("")}
    listMode /></>;
}
