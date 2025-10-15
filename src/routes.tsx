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
import ExternalTable from "./pages/examplePage/ExternalTable";
import ExternalTableCode from "./pages/examplePage/ExternalTable?raw";
import InternalTable from "./pages/examplePage/InternalTable";
import InternalTableCode from "./pages/examplePage/InternalTable?raw";
import InternalNotes from "./pages/examplePage/InternalNotes";
import FiltersTable from "./pages/examplePage/FiltersTable";
import FiltersTableCode from "./pages/examplePage/FiltersTable?raw";
import FiltersTableNotes from "./pages/examplePage/FiltersTableNotes";

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
        name: "Static",
        path: "/example/static",
        element: (
          <TabPage
            headerImports={`import Table, {type ColumnType, rowRenderer, } from 'responsive-react-datatable';
import mock from "../../components/table/mockData.json";`}
            view={<BasicTable />}
            code={BasicTableCode}
          />
        ),
      },

      {
        name: "External",
        path: "/example/external",
        element: (
          <TabPage
            headerImports={`import Table , { type ColumnType , rowRenderer} from 'responsive-react-datatable';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";`}
            view={<ExternalTable />}
            code={ExternalTableCode}
          />
        ),
      },
      {
        name: "Internal",
        path: "/example/internal",
        element: (
          <TabPage
            headerImports={`import Table , { type ColumnType , rowRenderer} from 'responsive-react-datatable';`}
            view={
              <>
                <InternalNotes />
                <InternalTable />
              </>
            }
            code={InternalTableCode}
          />
        ),
      },
      {
        name: "Static Auto PageSize",
        path: "/example/staticAutoPageSize",
        element: (
          <TabPage
            headerImports={`import Table, {type ColumnType, rowRenderer, ActionDropDown} from 'responsive-react-datatable';`}
            view={<StaticAutoPageSizeTable />}
            code={StaticAutoPageSizeTableCode}
          />
        ),
      },
      {
        name: "Table With Filters",
        path: "/example/filters",
        element: (
          <TabPage
            headerImports={`import Table , { type ColumnType , rowRenderer} from 'responsive-react-datatable';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { ChevronDown } from "../../components/table/icons";`}
            view={
              <>
                <FiltersTableNotes />
                <FiltersTable />
              </>
            }
            code={FiltersTableCode}
          />
        ),
      },
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
