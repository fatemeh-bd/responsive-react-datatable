import ExamplePage from "./pages/examplePage/ExamplePage";
import HomePage from "./pages/documentPage/HomePage";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GrVmMaintenance } from "react-icons/gr";
import WellcomePage from "./pages/wellcomePage/WellcomePage";
import DocumentPage from "./pages/documentPage/HomePage";
export const routes = [
  {
    icon: IoDocumentTextOutline,
    name: "Documentation",
    path: "/",
    element: <WellcomePage />,
  },
  {
    icon: IoDocumentTextOutline,
    name: "Documentation",
    path: "/document",
    element: <DocumentPage />,
  },
  {
    icon: GrVmMaintenance,
    name: "Example",
    path: "/example",
    element: <ExamplePage />,
  },
];
