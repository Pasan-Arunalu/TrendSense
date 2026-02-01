import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Provider } from "./components/ui/provider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/searchContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Auth from "./pages/auth";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import UserManagement from "./pages/admin/UserManagement";
import DataUpload from "./pages/admin/DataUpload";
import GeneratePrediction from "./pages/manager/GeneratePrediction";
import MyPredictions from "./pages/manager/MyPredictions";
import PendingReview from "./pages/owner/PendingReview";
import ReviewHistory from "./pages/owner/ReviewHistory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      // Admin routes
      {
        path: "admin/users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/upload",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <DataUpload />
          </ProtectedRoute>
        ),
      },
      // Manager routes
      {
        path: "manager/generate",
        element: (
          <ProtectedRoute allowedRoles={["manager", "admin"]}>
            <GeneratePrediction />
          </ProtectedRoute>
        ),
      },
      {
        path: "manager/predictions",
        element: (
          <ProtectedRoute allowedRoles={["manager", "admin"]}>
            <MyPredictions />
          </ProtectedRoute>
        ),
      },
      // Owner routes
      {
        path: "owner/pending",
        element: (
          <ProtectedRoute allowedRoles={["owner", "admin"]}>
            <PendingReview />
          </ProtectedRoute>
        ),
      },
      {
        path: "owner/history",
        element: (
          <ProtectedRoute allowedRoles={["owner", "admin"]}>
            <ReviewHistory />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Redirect old routes
  {
    path: "/home",
    element: <Navigate to="/dashboard" replace />,
  },
  // Catch-all redirect
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <SearchProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
              },
            }}
          />
        </SearchProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);