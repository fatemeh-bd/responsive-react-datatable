import { useCallback } from "react";
import Checkbox from "./checkbox/CheckBox";
import { ColorTheme, Selectable } from "../types";

interface SelectableCheckboxProps {
  row: any;
  selectableProps: Selectable;
  theme: ColorTheme;
}

export const SelectableCheckbox: React.FC<SelectableCheckboxProps> = ({
  row,
  selectableProps,
  theme,
}) => {
  const selectedKey = selectableProps.selectedKey || "id";
  const selectedIds = selectableProps.selectedIds || [];
  const id = row[selectedKey];
  const handleCheckboxChange = useCallback(
    (row: any) => {
      if (!selectableProps) return;
      const { selectedIds, selectedKey, onSelectChange } = selectableProps;
      const id = row?.[selectedKey || "id"];
      if (id === null || id === undefined) return;

      const newSelectedIds = selectedIds?.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...(selectedIds || []), id];

      onSelectChange?.(newSelectedIds);
    },
    [selectableProps]
  );
  return (
    <Checkbox
      ariaLabel={`Select row ${id}`}
      className="selectableCheckbox"
      primaryColor={theme.primaryColor}
      primaryTextColor={theme.primaryTextColor}
      checked={selectedIds.includes(id)}
      value={id}
      onChange={() => handleCheckboxChange(row)}
    />
  );
};
