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
    <div className="page-size-select-container relative flex items-center gap-1">
      <span className="page-size-select-label md:text-base text-xs text-nowrap text-inherit">
        {textsConfig?.pageSize}
      </span>
      <div className="relative w-max">
        <select
          value={size}
          onChange={handleChange}
          style={{
            borderColor: theme?.borderColor,
            backgroundColor: theme?.searchBoxBgColor,
          }}
          className={`page-size-select text-inherit my-0 flex items-center justify-between gap-3 text-right text-base rounded-lg placeholder:text-sm !outline-none w-full p-2 border focus:border-primary disabled:opacity-70 appearance-none pl-6 max-sm:pl-4 cursor-pointer max-md:py-1 max-md:min-w-12 max-md:text-sm`}
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
        <ChevronDown className="page-size-select-icon pointer-events-none text-inherit size-5 shrink-0 absolute left-1 top-0 bottom-0 my-auto" />
      </div>
    </div>
  );
};

export default PageSizeSelect;
