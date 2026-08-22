import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "../../auth/AuthContext";
import { getAccessToken } from "../../api/client";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
  beforeLoad() {
    if (!getAccessToken()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function RouteComponent() {
  const { user } = useAuth();
  if (!user)
    throw redirect({
      to: "/login",
    });
  return <div>Hello "/index"! {user.name}</div>;
}
