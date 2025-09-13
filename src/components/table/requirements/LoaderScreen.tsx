import React from "react";

interface LoaderScreenProps {
  className?: string;
  bgColor?: string; // رنگ پس‌زمینه
  loaderSrc?: string; // مسیر تصویر لودینگ
  loaderWidth?: string | number; // عرض تصویر لودینگ
  loaderHeight?: string | number; // ارتفاع تصویر لودینگ
  loaderClassName?: string; // کلاس‌های اضافی برای تصویر لودینگ
  zIndex?: number; // z-index برای لودر
  containerStyle?: React.CSSProperties; // استایل‌های inline اضافی برای کانتینر
}

const LoaderScreen: React.FC<LoaderScreenProps> = ({
  className = "",
  bgColor = "rgba(42, 42, 42, 0.08)", // پیش‌فرض مشابه کد اصلی
  loaderSrc = "/loading.gif", // پیش‌فرض مشابه کد اصلی
  loaderWidth = 200, // پیش‌فرض مشابه کد اصلی
  loaderHeight = 200, // پیش‌فرض مشابه کد اصلی
  loaderClassName = "md:translate-x-[-80px]", // پیش‌فرض مشابه کد اصلی
  zIndex = 9999, // پیش‌فرض مشابه کد اصلی
  containerStyle = {},
}) => {
  return (
    <div
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: bgColor,
        zIndex: zIndex,
        pointerEvents: "none",
        ...containerStyle, // ادغام استایل‌های اضافی
      }}
    >
      <img
        className={loaderClassName}
        width={loaderWidth}
        height={loaderHeight}
        src={loaderSrc}
        alt="درحال بارگذاری..."
      />
    </div>
  );
};

export default LoaderScreen;
