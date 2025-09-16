import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useFZTableColors } from "./contexts/FZTableThemeContext";

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
  const colors = useFZTableColors();

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
      <span
        style={{ fontSize: "0.75rem", lineHeight: "1rem" }}
        className="md:text-base"
      >
        نمایش
      </span>
      <select
        value={size}
        onChange={handleChange}
        style={{
          textAlign: "right",
          backgroundColor: colors.white || "#ffffff",
          borderRadius: "0.5rem",
          outline: "none",
          display: "block",
          width: "100%",
          padding: "0.625rem",
          border: `1px solid ${colors.secondary500}`,
          fontSize: "1rem",
          lineHeight: "1.5rem",
          appearance: "none",
          paddingLeft: "1.5rem",
          cursor: "pointer",
        }}
        className="focus:border-primary disabled:opacity-70 disabled:cursor-not-allowed max-md:py-1 max-md:h-8 max-md:min-w-12 max-md:text-sm"
      >
        <option value={initialPageSize}>{initialPageSize}</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={200}>200</option>
        <option value={300}>300</option>
      </select>
      <BiChevronDown
        style={{
          color: colors.secondary500,
          position: "absolute",
          left: "0.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default PageSizeSelect;
