import React, { useEffect, useState } from "react";
import { ButtonProps } from "./types";
// import Loader from "../loaders/Loader";
import { ColorType } from "./types";
// import ButtonLoader from "../loaders/ButtonLoader";
// import useProfileStore from "../../store/profile/profileStore";
// import { Link } from "react-router-dom";

const buttonThemeClasses: Record<
  ColorType,
  { default: string; outline: string }
> = {
  [ColorType.ERROR]: {
    default: "bg-error border-error text-white",
    outline: "bg-white text-error border-error",
  },
  [ColorType.SECONDARY]: {
    default: "bg-secondary-200 text-secondary-700",
    outline: "bg-white text-secondary-600 border-secondary-600",
  },
  [ColorType.SUCCESS]: {
    default: "bg-success border-success text-white",
    outline: "bg-white text-success border-success",
  },
  [ColorType.BLUE]: {
    default: "bg-blue border-blue text-white",
    outline: "bg-white text-blue border-blue",
  },
  [ColorType.BLACK]: {
    default: "bg-secondary-800 border-secondary-800 text-white",
    outline: "bg-white text-secondary-800 border-secondary-800",
  },
  [ColorType.PRIMARY]: {
    default: "bg-primary border-primary text-secondary-900",
    outline: "text-primary border-primary bg-primary bg-opacity-5",
  },
};

const MainButton: React.FC<
  ButtonProps & { href?: string; target?: "_blank" | "_self" }
> = ({
  className,
  children,
  outline,
  disabled,
  theme = ColorType.PRIMARY,
  Icon,
  loading,
  size,
  type,
  full = false,
  permissionIdTab = "",
  href,
  target = "_self",
  ...rest
}) => {
  const selectedTheme =
    buttonThemeClasses[theme][outline ? "outline" : "default"];
  const [isActive, setIsActive] = useState(true);

  const sharedClassNames = `${
    size === "lg" ? "min-w-[140px]" : ""
  } text-nowrap py-2 sm:px-4 px-3 md:min-w-[100px] min-w-fit
    sm:text-base text-sm rounded-lg border text-center flex items-center overflow-hidden
    justify-center gap-1 hover:shadow sm:min-h-[42px] min-h-[38px] ${
      full ? "w-full" : ""
    } ${selectedTheme} ${
    className ?? ""
  } disabled:bg-secondary-500 disabled:border-secondary-500 disabled:text-secondary-700 disabled:cursor-not-allowed active:scale-[0.97] ${
    loading ? "!bg-secondary-600" : ""
  }`;

  const content = loading ? (
    // <Loader />
    <></>
  ) : (
    <>
      {Icon && <Icon className="size-5" />}
      {children}
    </>
  );

  if (!isActive) return null;

  return href ? (
    <a
      target={target}
      href={href}
      className={sharedClassNames}
      aria-disabled={disabled || loading}
      onClick={(e) => {
        if (disabled || loading) e.preventDefault();
        rest.onClick?.(e as any);
      }}
    >
      {content}
    </a>
  ) : (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      className={sharedClassNames}
    >
      {content}
    </button>
  );
};

export default MainButton;
