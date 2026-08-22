import { Link } from "@tanstack/react-router";
import { ChevronDown, LoaderCircle, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export function Navbar() {
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-gray-200 border-b">
      <div className="flex justify-between items-center mx-auto px-6 max-w-7xl h-16">
        {/* Brand */}
        <Link to="/" className="font-bold text-gray-900 text-xl tracking-tight">
          AirOps
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex justify-center items-center bg-gray-900 rounded-full w-9 h-9 font-semibold text-white text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <span className="hidden sm:block font-medium text-gray-800 text-sm">
                    {user?.name}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="right-0 z-50 absolute bg-white shadow-lg mt-2 border border-gray-200 rounded-xl w-64 overflow-hidden">
                    {/* User information */}
                    <div className="px-4 py-4 border-gray-100 border-b">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user?.name}
                      </p>

                      <p className="mt-1 text-gray-500 text-xs truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu */}
                    <div className="p-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2.5 rounded-lg text-gray-700 text-sm transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <button
                        onClick={logout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 hover:bg-red-50 disabled:opacity-50 px-3 py-2 rounded-lg w-full font-medium text-red-600 text-sm transition-colors"
                      >
                        {isLoggingOut ? (
                          <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            Signing out...
                          </>
                        ) : (
                          <>
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700 text-sm transition-colors"
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                className="bg-gray-900 hover:bg-gray-800 shadow-sm px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
