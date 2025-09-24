import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useQueryParams } from "./useQueryParams";
import { ColorTheme } from "./types";

const PageSizeSelect = ({
  pageSize,
  onPageSizeChange,
  initialPageSize,
  theme,
}: {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  initialPageSize?: number;
  theme: ColorTheme;
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
    <div className="relative flex items-center gap-1">
      <span className="md:text-base text-xs">نمایش</span>
      <select
        value={size}
        onChange={handleChange}
        style={{ borderColor: theme?.searchBoxBorderColor }}
        className={`my-0 flex items-center justify-between  gap-3 text-right text-base bg-white rounded-lg placeholder:text-sm !outline-none w-full p-2 border focus:border-primary disabled:opacity-70 appearance-none pl-6 cursor-pointer max-md:py-1 max-md:h-8 max-md:min-w-12 max-md:text-sm`}
      >
        <option value={initialPageSize}>{initialPageSize}</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={200}>200</option>
        <option value={300}>300</option>
      </select>
      <BiChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
    </div>
  );
};

export default PageSizeSelect;
