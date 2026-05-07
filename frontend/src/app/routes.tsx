import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Achievement from "./pages/Achievement";
import Contact from "./pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      { path: "projects", Component: Projects },
      { path: "achievement", Component: Achievement },
      { path: "contact", Component: Contact },
    ],
  },
]);
