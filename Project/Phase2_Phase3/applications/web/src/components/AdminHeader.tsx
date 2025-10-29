import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  RiAdminLine,
  RiUserLine,
  RiLogoutBoxRLine,
  RiArrowDownSLine,
  RiShieldLine,
  RiSettings3Line,
} from "@remixicon/react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Switch Role Button */}
            <Link
              prefetch="intent"
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <RiSettings3Line className="h-4 w-4" />
              Switch Role
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-card border rounded-lg hover:bg-muted transition-colors text-left"
              >
                {/* User Avatar */}
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <RiUserLine className="h-4 w-4 text-primary" />
                  )}
                </div>

                {/* User Info */}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground">
                    {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin"}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <RiShieldLine className="h-3 w-3" />
                    <span>Administrator</span>
                  </div>
                </div>

                <RiArrowDownSLine className={`h-4 w-4 text-muted-foreground transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />

                  {/* Menu */}
                  <div className="absolute right-0 top-full mt-2 w-72 bg-card border rounded-lg shadow-lg z-20">
                    {/* Header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                          {user?.user_metadata?.avatar_url ? (
                            <img
                              src={user.user_metadata.avatar_url}
                              alt="User avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <RiAdminLine className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin User"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <div className="px-4 py-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <RiShieldLine className="h-3 w-3" />
                          <span>Role</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">Administrator</p>
                      </div>

                      {user?.user_metadata?.last_sign_in_at && (
                        <div className="px-4 py-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <span>Last Sign In</span>
                          </div>
                          <p className="text-sm text-foreground">
                            {new Date(user.user_metadata.last_sign_in_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      <div className="border-t mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <RiLogoutBoxRLine className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}