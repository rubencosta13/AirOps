import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

interface SignInResponse {
  accessToken: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { accessToken } = await api<SignInResponse>("/auth/signin", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Temporary: we'll replace this with proper auth state.
      sessionStorage.setItem("access_token", accessToken);
      login(accessToken);
      await navigate({
        to: "/",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1>Sign in</h1>

        <p>Sign in to your AirOps account.</p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              style={{
                display: "block",
                width: "100%",
                marginTop: "0.5rem",
                padding: "0.6rem",
              }}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              style={{
                display: "block",
                width: "100%",
                marginTop: "0.5rem",
                padding: "0.6rem",
              }}
            />
          </label>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
