import ExamplePage from "./pages/examplePage/ExamplePage";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GrConfigure, GrVmMaintenance } from "react-icons/gr";
import WelcomePage from "./pages/welcomePage/WelcomePage";
import DocumentPage from "./pages/documentPage/HomePage";
import { BsTerminal } from "react-icons/bs";
import BasicTable from "./pages/examplePage/BasicTable";
import StaticAutoPageSizeTable from "./pages/examplePage/StaticAutoPageSizeTable";
import TabPage from "./pages/examplePage/TabPage";
import BasicTableCode from "./pages/examplePage/BasicTable.tsx?raw";
import StaticAutoPageSizeTableCode from "./pages/examplePage/StaticAutoPageSizeTable.tsx?raw";
import PropAutoPageSizeConfig from "./pages/propsPages/PropAutoPageSizeConfig";

export const routes = [
  {
    icon: BsTerminal,
    name: "Welcome",
    path: "/",
    element: <WelcomePage />,
  },
  {
    icon: IoDocumentTextOutline,
    name: "Documentation",
    path: "/document",
    element: <DocumentPage />,
  },
  {
    icon: GrVmMaintenance,
    name: "Examples",
    path: "/example",
    element: <ExamplePage />,
    children: [
      {
        name: "Basic",
        path: "/example/basic",
        element: (
          <TabPage
            headerImports={`import Table, {
    type ColumnType,
    rowRenderer,
  } from 'responsive-react-datatable';`}
            view={<BasicTable />}
            code={BasicTableCode}
          />
        ),
      },
      {
        name: "Static Auto PageSize",
        path: "/example/staticAutoPageSize",
        element: (
          <TabPage
            headerImports={`import Table, {
    type ColumnType,
    rowRenderer,
    ActionDropDown
  } from 'responsive-react-datatable';`}
            view={<StaticAutoPageSizeTable />}
            code={StaticAutoPageSizeTableCode}
          />
        ),
      },
      // {
      //   name: "Internal",
      //   path: "/example/internal",
      //   element: <ExamplePage />,
      // },
    ],
  },
  {
    icon: GrConfigure,
    name: "Props",
    children: [
      {
        name: "autoPageSizeConfig",
        path: "/props/autoPageSizeConfig",
        element: <PropAutoPageSizeConfig />,
      },
    ],
  },
];
