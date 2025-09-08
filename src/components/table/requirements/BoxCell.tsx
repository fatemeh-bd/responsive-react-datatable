import { Box_cell_type } from "./types";

const BoxCell = ({
  className,
  tooltip,
  lineClamp = "line-clamp-1",
  children,
  visible,
}: Box_cell_type) => {
  return (
    <div
      title={tooltip}
      // style={{ width: `auto` }}
      className={`block truncate mx-auto print:line-clamp-none print:text-wrap m-auto text-center ${lineClamp} ${
        className || ""
      } ${visible ? "!overflow-visible h-auto" : ""}`}
    >
      {children}
    </div>
  );
};

export default BoxCell;
