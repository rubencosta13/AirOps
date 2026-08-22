import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAccessToken } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";
import { Lock, LogOut, Mail } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
  beforeLoad() {
    if (!getAccessToken()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function ProfilePage() {
  const { user, logout, isLoggingOut } = useAuth();

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center px-6 py-12">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <main className="px-6 py-10 min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-2xl">
        {/* Profile card */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="flex justify-center items-center bg-gray-900 rounded-full w-20 h-20 shrink-0">
                <span className="font-semibold text-white text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* User information */}
              <div className="min-w-0">
                <h1 className="font-semibold text-gray-900 text-2xl">
                  {user.name}
                </h1>

                <div className="flex items-center gap-2 mt-1 text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mt-6">
          <h2 className="mb-3 font-semibold text-gray-900 text-lg">
            Account settings
          </h2>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {/* Change password */}
            <button
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="flex items-center gap-4 hover:bg-gray-50 px-6 py-5 w-full text-left transition"
            >
              <div className="flex justify-center items-center bg-gray-100 rounded-lg w-10 h-10">
                <Lock className="w-5 h-5 text-gray-700" />
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900">Change password</p>
                <p className="mt-0.5 text-gray-500 text-sm">
                  Update your account password
                </p>
              </div>

              <span className="text-gray-400 text-xl">
                {showPasswordForm ? "−" : "+"}
              </span>
            </button>

            {/* Password form */}
            {showPasswordForm && (
              <div className="px-6 pb-6">
                <div className="bg-gray-50 p-5 border border-gray-200 rounded-xl">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                        Current password
                      </label>
                      <input
                        type="password"
                        className="bg-white px-3 py-2.5 border border-gray-300 focus:border-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 w-full"
                        placeholder="Current password"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                        New password
                      </label>
                      <input
                        type="password"
                        className="bg-white px-3 py-2.5 border border-gray-300 focus:border-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 w-full"
                        placeholder="New password"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                        Confirm new password
                      </label>
                      <input
                        type="password"
                        className="bg-white px-3 py-2.5 border border-gray-300 focus:border-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 w-full"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      type="button"
                      className="bg-gray-900 hover:bg-gray-800 px-4 py-2.5 rounded-lg font-medium text-white text-sm transition"
                    >
                      Update password
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="border-gray-200 border-t" />

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="flex items-center gap-4 hover:bg-red-50 disabled:opacity-60 px-6 py-5 w-full text-left transition"
            >
              <div className="flex justify-center items-center bg-red-100 rounded-lg w-10 h-10">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>

              <div className="flex-1">
                <p className="font-medium text-red-600">
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </p>
                <p className="mt-0.5 text-gray-500 text-sm">
                  Sign out of your AirOps account
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
