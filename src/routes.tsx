import ExamplePage from "./pages/examplePage/ExamplePage";
import HomePage from "./pages/homePage/HomePage";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GrVmMaintenance } from "react-icons/gr";
export const routes = [
  {
    icon: IoDocumentTextOutline,
    name: "Documentation",
    path: "/",
    element: <HomePage />,
  },
  {
    icon: GrVmMaintenance,
    name: "Example",
    path: "/example",
    element: <ExamplePage />,
  },
];
