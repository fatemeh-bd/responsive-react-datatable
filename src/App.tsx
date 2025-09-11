import React from "react";
import Table from "./components/table/Table";
import { ColumnType } from "./components/table/requirements/types";

const App: React.FC = () => {
  const tableConfig = {
    // رنگ‌های اصلی
    borderColor: "border-gray-200",
    borderRadius: "rounded-xl",
    bgColor: "bg-white",
    shadowClass: "shadow-sm",

    // هدر
    headerTextColor: "text-gray-800",
    headerBorderColor: "border-gray-200",
    headerHoverClass: "hover:bg-gray-50",

    // ردیف‌ها
    rowBorderColor: "border-gray-100",
    rowHoverBgColor: "hover:bg-gray-50",

    // اسکلتون
    skeletonBgColor: "bg-gradient-to-r from-gray-200 to-gray-300",

    // متن‌ها
    noDataTextColor: "text-gray-500",
    mobileTitleColor: "text-gray-600",
    mobileContentColor: "text-gray-900",

    // لودر سفارشی
    loaderBgColor: "rgba(0, 0, 0, 0.1)",
    loaderSrc: "/loading-spinner.gif", // تصویر لودینگ سفارشی
    loaderWidth: 60,
    loaderHeight: 60,
    loaderClassName: "animate-spin",
    loaderZIndex: 50,

    // آیکون‌های مرتب‌سازی
    sortIconActiveColor: "text-blue-600",
    sortIconInactiveColor: "opacity-30 text-gray-400",

    // موبایل
    mobileCardBorderColor: "border-gray-200",
    mobileCardBgColor: "bg-white",
  };

  const columns: ColumnType[] = [
    {
      data: "contractName",
      orderable: true,
      title: "نام قرارداد",
      searchable: false,
      width: 200,
    },
    {
      data: "startDate",
      orderable: true,
      title: "تاریخ شروع",
      searchable: false,
      width: 140,
    },
    {
      data: "endDate",
      orderable: true,
      title: "تاریخ پایان",
      searchable: false,
      width: 140,
    },
    {
      data: "createdAt",
      orderable: true,
      title: "تاریخ ایجاد",
      searchable: false,
      width: 140,
    },
  ];
  return (
    <div className="min-h-screen w-screen  p-6">
      <Table
        isTestMode={true}
        columns={columns}
        endpoint="api/contracts"
        title="لیست قراردادها"
        tableName="contracts"
        pageSize={5}
        height={"400"}
        saveSearch={true}
        searchPlaceholder="جستجو در نام قرارداد، مشتری..."
        tableConfig={tableConfig}
        // فیلترهای سفارشی
        customBody={[
          {
            isFilter: true,
            name: "status",
            value: "active",
            label: "وضعیت",
            type: "select",
            options: [
              { value: "active", label: "فعال" },
              { value: "pending", label: "در انتظار" },
              { value: "completed", label: "تکمیل شده" },
              { value: "expired", label: "منقضی" },
            ],
          },
          {
            isFilter: true,
            name: "dateRange",
            value: { start: "", end: "" },
            label: "بازه زمانی",
            type: "dateRange",
          },
        ]}
        // فیلترهای بالا
        topFilter={
          <div className="flex gap-3 items-center">
            <div className="relative">
              <select className="pr-10 pl-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>همه دسته‌بندی‌ها</option>
                <option>توسعه نرم‌افزار</option>
                <option>مشاوره</option>
                <option>طراحی</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              اعمال فیلتر
            </button>
          </div>
        }
        // قابلیت انتخاب ردیف‌ها
        isSelectable={true}
        selectedIds={[]}
        onSelectChange={(ids) => {
          console.log("Selected IDs:", ids);
          // منطق انتخاب ردیف‌ها
        }}
        selectedKey="id"
      />
    </div>
  );
};

export default App;
