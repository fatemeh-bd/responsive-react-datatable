import ExamplePage from "./pages/examplePage/ExamplePage";
import HomePage from "./pages/homePage/HomePage";

const routes = [
  {
    name: "Documentation",
    path: "/",
    element: <HomePage />,
  },
  {
    name: "Example",
    path: "/example",
    element: <ExamplePage />,
  },
];
