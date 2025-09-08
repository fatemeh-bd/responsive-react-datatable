import { useState } from "react";
import { inputClass } from "./requirements/utils";
import { BiChevronDown } from "react-icons/bi";

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setSize(newSize);

    // دریافت و ویرایش پارامترهای query به صورت دستی
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("page"); // حذف پارامتر page
    searchParams.set("pageSize", newSize.toString());

    // به‌روزرسانی URL بدون رفرش
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", newUrl);

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
        {initialPageSize && (
          <option value={initialPageSize}>{initialPageSize}</option>
        )}
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
