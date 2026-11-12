import Table, { ActionDropDown } from "react-responsive-datatable-kit";
import Interactive from "../Interactive";
export default function Page() {
  return <main><h1>Release consumer</h1><Table mode="static"
    tableName="release" pageSize={1} columns={[{ data: "name", title: "Name", orderable: true }]}
    staticRows={[{ id: 0, name: "Packed React" }, { id: 1, name: "Next consumer" }]} />
    <ActionDropDown options={[{ label: "Documentation", href: "/" }]} /><Interactive /></main>;
}
