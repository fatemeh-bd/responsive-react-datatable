import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useQueryParams } from "../hooks/useQueryParams";
import { ColorTheme } from "../types";

const PageSizeSelect = ({
  pageSize,
  onPageSizeChange,
  initialPageSize,
  theme,
  text,
}: {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  initialPageSize?: number;
  theme: ColorTheme;
  text: string;
}) => {
  const [size, setSize] = useState(pageSize);
  const { updateParams, removeParams } = useQueryParams();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setSize(newSize);
    removeParams("page");
    updateParams("pageSize", newSize?.toString());
    onPageSizeChange(newSize);
  };

  return (
    <div className="page-size-select-container relative flex items-center gap-1">
      <span
        style={{
          color: theme?.searchBoxTextColor,
        }}
        className="page-size-select-label md:text-base text-xs text-nowrap"
      >
        {text}
      </span>
      <div className="relative ">
        <select
          value={size}
          onChange={handleChange}
          style={{
            borderColor: theme?.searchBoxBorderColor,
            backgroundColor: theme?.searchBoxBgColor,
            color: theme?.searchBoxTextColor,
          }}
          className={`page-size-select my-0 flex items-center justify-between gap-3 text-right text-base rounded-lg placeholder:text-sm !outline-none w-full p-2 border focus:border-primary disabled:opacity-70 appearance-none pl-6 cursor-pointer max-md:py-1 max-md:h-8 max-md:min-w-12 max-md:text-sm`}
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
        <BiChevronDown
          style={{
            color: theme?.searchBoxTextColor,
          }}
          className="page-size-select-icon pointer-events-none shrink-0 absolute left-2 top-0 bottom-0 my-auto"
        />
      </div>
    </div>
  );
};

export default PageSizeSelect;
