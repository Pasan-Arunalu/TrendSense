import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Body from "./components/body"; // Import Body here
import About from "./pages/about.tsx";
import Auth from "./pages/auth.tsx";
import { Provider } from "./components/ui/provider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      {
        index: true, 
        element: <Body />, 
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);