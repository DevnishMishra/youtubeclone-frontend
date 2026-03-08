import { useState } from "react";
import {
  FaBars,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaYoutube,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function Header({ toggleSidebar, onSearch }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) onSearch(query.trim());
  };

  const handleLogout = () => {
    logout();
    setDropdown(false);
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 h-14">
      {/* ── Left: Hamburger + Logo ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <FaBars size={20} />
        </button>
        <Link to="/" className="flex items-center gap-1.5">
          <FaYoutube size={28} className="text-red-600" />
          <span className="text-lg font-bold hidden sm:block">
            YouTubeClone
          </span>
        </Link>
      </div>

      {/* ── Center: Search bar ─────────────────────────────────────── */}
      {/* Search bar in the header, filter by title */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-[40%] min-w-[140px]"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex-1 border border-gray-300 border-r-0 rounded-l-full
                     px-4 py-2 text-sm focus:outline-none focus:border-blue-400
                     transition-colors"
        />
        <button
          type="submit"
          className="border border-gray-300 bg-gray-50 hover:bg-gray-100
                     px-4 py-2 rounded-r-full transition-colors"
          aria-label="Search"
        >
          <FaSearch size={13} className="text-gray-500" />
        </button>
      </form>

      {/* ── Right: Auth ────────────────────────────────────────────── */}
      <div className="relative">
        {user ? (
          /* "his/her name should be present at the top after signing in" */
          <>
            <button
              onClick={() => setDropdown((o) => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full
                         border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {/* Avatar circle with first letter */}
              <div
                className="w-7 h-7 rounded-full bg-red-600 flex items-center
                              justify-center text-white font-bold text-xs flex-shrink-0"
              >
                {user.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
                {user.username}
              </span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white border border-gray-200
                              rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-sm">{user.username}</p>
                  <p className="text-gray-400 text-xs truncate">{user.email}</p>
                </div>
                {/* Channel creation only after sign-in */}
                <Link
                  to="/my-channel"
                  onClick={() => setDropdown(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm
                             hover:bg-gray-50 transition-colors"
                >
                  📺 My Channel
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm
                             text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt size={13} /> Sign Out
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 border border-blue-500 text-blue-600
                       px-4 py-1.5 rounded-full text-sm font-medium
                       hover:bg-blue-50 transition-colors"
          >
            <FaUserCircle size={15} />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
