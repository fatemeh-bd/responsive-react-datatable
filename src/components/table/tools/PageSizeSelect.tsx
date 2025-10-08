import { useState } from "react";
import { useQueryParams } from "../hooks/useQueryParams";
import { ColorTheme, TextsConfig } from "../types";
import { ChevronDown } from "../icons";

const PageSizeSelect = ({
  pageSize,
  onPageSizeChange,
  initialPageSize,
  theme,
  textsConfig,
  pageQueryName,
}: {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  initialPageSize?: number;
  theme: ColorTheme;
  textsConfig: TextsConfig;
  pageQueryName: string;
}) => {
  const [size, setSize] = useState(pageSize);
  const { updateParams, removeParams } = useQueryParams();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setSize(newSize);
    removeParams(pageQueryName);
    updateParams("pageSize", newSize?.toString());
    onPageSizeChange(newSize);
  };

  return (
    <div className="page-size-select-container">
      <span className="page-size-select-label">{textsConfig?.pageSize}</span>
      <div className="pageSizeParent">
        <select
          value={size}
          onChange={handleChange}
          style={{
            borderColor: theme?.borderColor,
            backgroundColor: theme?.backgroundColor,
          }}
          className={`page-size-select cursorPointer`}
        >
          <option className="page-size-option" value={initialPageSize}>
            {initialPageSize}
          </option>
          <option className="page-size-option" value={20}>
            20
          </option>
          <option className="page-size-option" value={50}>
            50
          </option>
          <option className="page-size-option" value={100}>
            100
          </option>
          <option className="page-size-option" value={200}>
            200
          </option>
          <option className="page-size-option" value={300}>
            300
          </option>
        </select>
        <ChevronDown className="page-size-select-icon" />
      </div>
    </div>
  );
};

export default PageSizeSelect;
