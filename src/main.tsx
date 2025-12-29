import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Body from "./components/body";
import About from "./pages/about.tsx";
import Auth from "./pages/auth.tsx";
import { Provider } from "./components/ui/provider";
import { SearchProvider } from "./context/searchContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, 
        element: <Auth />,
      },
      {
        path: "/home", 
        element: <Body />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </Provider>
  </StrictMode>
);