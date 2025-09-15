import { FZTableThemeConfigType } from "./contexts/FZTableThemeContext";

export const getTableCss = (config?: FZTableThemeConfigType) => `
table {
  border-collapse: collapse;
  white-space: nowrap;
}
thead {
  background-color: ${config?.secondary[100] || "#f9f9f9"} !important;
}
th {
  font-size: 0.875rem;
  font-weight: 700 !important;
  color: ${config?.secondary[900] || "#333333"};
}
td {
  color: ${config?.secondary[700] || "#7a7a7a"};
}
th,
td {
  text-align: center !important;
  vertical-align: middle !important;
}
tr {
  height: 51.15px;
  max-height: fit-content;
}
@media (max-width: 768px) {
  .swiper .avatar {
    width: 80px !important;
    height: 80px !important;
  }
}
`;
