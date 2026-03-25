import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  // Read the logged-in user once so the navbar can show identity across all pages.
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  // Use the first letter like Instagram/Threads style avatar initials when no profile image exists.
  const userInitial = storedUser?.username?.charAt(0)?.toUpperCase() || "G";

  const handleLogout = () => {
    // Clear the saved session so protected UI does not keep showing old user data.
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
    navigate("/");
  };

  return (
    // Match auth pages with a glassy shell and subtle cyan/teal ambient glow.
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="pointer-events-none absolute -left-16 top-0 h-32 w-32 rounded-full bg-cyan-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-2 h-28 w-28 rounded-full bg-teal-200/60 blur-3xl" />

      <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
            MiniSocial
          </p>
        </div>

        <div className="flex items-center" style={{ columnGap: "36px" }}>
          {/* Keep route actions as separate buttons for clearer scan and click targets. */}
          <nav
            className="flex items-center text-sm font-medium"
            style={{ marginLeft: "24px", marginRight: "24px", columnGap: "34px" }}
          >
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `inline-flex h-10 min-w-[120px] items-center justify-center rounded-[6px] border border-slate-400 px-5 text-center no-underline transition duration-200 ${isActive ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-blue-600 hover:text-white"}`
              }
            >
              Feed
            </NavLink>

            <NavLink
              to="/create-post"
              className={({ isActive }) =>
                `inline-flex h-10 min-w-[120px] items-center justify-center rounded-[6px] border border-slate-400 px-5 text-center no-underline transition duration-200 ${isActive ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-blue-600 hover:text-white"}`
              }
            >
              Create Post
            </NavLink>
          </nav>

          {/* Small identity chip gives quick context about who is currently logged in. */}
          <div className="hidden items-center gap-3 rounded-full border border-white/80 bg-white/90 px-2 py-1 shadow-[0_8px_20px_rgba(15,23,42,0.1)] ring-1 ring-cyan-100 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-semibold text-white">
              {userInitial}
            </div>
            <div className="pr-2">
              <p className="text-sm font-semibold text-slate-800">
                {storedUser?.username || "Guest"}
              </p>
              <p className="text-xs text-slate-500">
                Logged in
              </p>
            </div>
          </div>

          {/* Keep logout visually separate so it reads like an action, not another navigation link. */}
          <button
            type="button"
            className="inline-flex h-15 min-w-[120px] items-center justify-center rounded-[6px] border border-slate-400 bg-white px-5 text-center no-underline text-slate-700 transition duration-200 hover:bg-blue-600 hover:text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;