import { useState } from "react";
import { inputClass } from "../inputs/Input";
import { BiChevronDown } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

const PageSizeSelect = ({
  pageSize,
  onPageSizeChange,
  initialPageSize,
}: {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  initialPageSize?: number;
}) => {
  const [size, setSize] = useState(pageSize);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setSize(newSize);
    searchParams?.delete("page");
    searchParams.set("pageSize", newSize?.toString());
    setSearchParams(searchParams, { replace: true });

    onPageSizeChange(newSize);
  };

  return (
    <div className="relative flex items-center gap-1">
      نمایش
      <select
        value={size}
        onChange={handleChange}
        className={`${inputClass} appearance-none pl-6 cursor-pointer`}
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
