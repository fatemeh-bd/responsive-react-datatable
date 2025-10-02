import ExamplePage from "./pages/examplePage/ExamplePage";
import HomePage from "./pages/documentPage/HomePage";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GrVmMaintenance } from "react-icons/gr";
import WelcomePage from "./pages/welcomePage/WelcomePage";
import DocumentPage from "./pages/documentPage/HomePage";
import { BsTerminal } from "react-icons/bs";

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
    name: "Example",
    path: "/example",
    element: <ExamplePage />,
  },
];
