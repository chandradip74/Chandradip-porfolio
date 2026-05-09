import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Root from "./Root";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const Achievement = lazy(() => import("./pages/Achievement"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-background">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, element: <Suspense fallback={<LoadingFallback />}><Home /></Suspense> },
      { path: "services", element: <Suspense fallback={<LoadingFallback />}><Services /></Suspense> },
      { path: "projects", element: <Suspense fallback={<LoadingFallback />}><Projects /></Suspense> },
      { path: "achievement", element: <Suspense fallback={<LoadingFallback />}><Achievement /></Suspense> },
      { path: "blog", element: <Suspense fallback={<LoadingFallback />}><Blog /></Suspense> },
      { path: "blog/:slug", element: <Suspense fallback={<LoadingFallback />}><BlogPost /></Suspense> },
      { path: "contact", element: <Suspense fallback={<LoadingFallback />}><Contact /></Suspense> },
    ],
  },
]);
