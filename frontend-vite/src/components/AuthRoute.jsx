import { Navigate } from "react-router-dom";

// Why: Centralize auth checks so we don't duplicate localStorage logic in every page.
// Use: Wrap private routes with ProtectedRoute and public-auth routes with PublicOnlyRoute.

export function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Why: If no logged-in user exists, block direct URL access and send to login.
  // Use: Require both identity and backend token so protected pages can't open with stale user data only.
  if (!user?.id || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Why: Logged-in users don't need login/signup again; move them to feed.
  if (user?.id && token) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}
