import React from "react";
import { TableProps } from "./types";
import { useIsMobile } from "./useIsMobile";
import MobileTable from "./MobileTable";
import DesktopTable from "./DesktopTable";

const Table: React.FC<TableProps> = ({ startMobileSize }) => {
  const isMobile = useIsMobile(startMobileSize);
  return <div>{isMobile ? <MobileTable /> : <DesktopTable />}</div>;
};

export default React.memo(Table);
