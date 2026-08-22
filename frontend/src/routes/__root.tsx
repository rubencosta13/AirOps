import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthProvider } from "../auth/AuthContext";
import { Navbar } from "../components/Navbar";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <AuthProvider>
      <Navbar />

      <main className="mx-auto px-6 max-w-7xl">
        <Outlet />
      </main>
    </AuthProvider>
  );
}
