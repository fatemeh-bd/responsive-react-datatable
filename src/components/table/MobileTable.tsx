import React from "react";
import { ColorTheme, ColumnType, TextsConfig } from "./types";

const MobileTable = ({
  columns,
  isLoading,
  pageSize,
  rows,
  theme,
  textsConfig,
}: {
  columns: ColumnType[];
  isLoading?: boolean;
  pageSize: number;
  rows: Record<string, any>[];
  theme: ColorTheme;
  textsConfig: TextsConfig;
}) => {
  return <div>MobileTable</div>;
};

export default MobileTable;
