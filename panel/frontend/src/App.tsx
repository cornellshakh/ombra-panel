import { ApiProvider } from "@/api/ApiProvider";
import { AuthProvider, useAuthContext } from "@/api/auth/AuthProvider";
import ProtectedRoute from "@/api/auth/ProtectedRoute";
import RoleBasedRoute from "@/api/auth/RoleBasedRoute";
import { FetchProvider } from "@/api/FetchProvider";
import SignIn from "@/components/forms/SignIn";
import SignUp from "@/components/forms/SignUp";
import Admin from "@/pages/admin/admin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import DisplayUser from "@/pages/admin/DisplayUser";
import Games from "@/pages/admin/Games";
import Keys from "@/pages/admin/Keys";
import Logs from "@/pages/admin/Logs";
import Profile from "@/pages/admin/Profile";
import Roles from "@/pages/admin/Roles";
import Sessions from "@/pages/admin/Sessions";
import Users from "@/pages/admin/Users";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import SignOut from "@/pages/SignOut";
import UserDashboard from "@/pages/user/UserDashboard";
import { LoadingProvider } from "./pages/Loading";
import DynamicBreadcrumb from "@@/DynamicBreadcrumb";
import { Sidebar, SidebarButton, SidebarLabel } from "@@/Sidebar";
import ThemeProvider from "@@/ThemeProvider";
import { PermissionProvider } from "./api/auth/PermissionProvider";
import { Avatar, AvatarFallback } from "@@/ui/avatar";
import { Button } from "@@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@@/ui/dropdown-menu";
import { Toaster } from "@@/ui/sonner";
import { TooltipProvider } from "@@/ui/tooltip";
import {
  Gamepad2Icon,
  HomeIcon,
  KeyRoundIcon,
  MonitorDotIcon,
  PackageIcon,
  ServerIcon,
  SettingsIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Listings from "./pages/admin/Listings";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const location = useLocation();

  const noHeaderSidebarRoutes = ["/signIn", "/signUp"];
  const showHeaderSidebar = !noHeaderSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex">
      {showHeaderSidebar && (
        <TooltipProvider delayDuration={0}>
          <Sidebar>
            <SidebarButton
              icon={<HomeIcon width={20} height={20} />}
              text={t("sidebar.dashboard")}
              to="/dashboard"
            />

            <SidebarLabel text={t("sidebar.customer.title")} />
            <SidebarButton
              icon={<UserIcon width={20} height={20} />}
              text={t("sidebar.customer.users")}
              to="/users"
            />
            <SidebarButton
              icon={<ShieldCheckIcon width={20} height={20} />}
              text={t("sidebar.customer.roles")}
              to="/roles"
            />
            <SidebarButton
              icon={<MonitorDotIcon width={20} height={20} />}
              text={t("sidebar.customer.sessions")}
              to="/sessions"
            />

            <SidebarLabel text={t("sidebar.product.title")} />
            <SidebarButton
              icon={<PackageIcon width={20} height={20} />}
              text={t("sidebar.product.listings")}
              to="/listings"
            />
            <SidebarButton
              icon={<Gamepad2Icon width={20} height={20} />}
              text={t("sidebar.product.games")}
              to="/games"
            />
            <SidebarButton
              icon={<KeyRoundIcon width={20} height={20} />}
              text={t("sidebar.product.keys")}
              to="/keys"
            />

            <SidebarLabel text={t("sidebar.other.title")} />
            <SidebarButton
              icon={<SettingsIcon width={20} height={20} />}
              text={t("sidebar.other.settings")}
              to="/settings"
            />
            <SidebarButton
              icon={<ServerIcon width={20} height={20} />}
              text={t("sidebar.other.logs")}
              to="/logs"
            />
          </Sidebar>
        </TooltipProvider>
      )}
      <main className={"flex-1 m-5 overflow-y-auto"}>
        <div className="flex justify-between items-center mb-5">
          <DynamicBreadcrumb />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarFallback>
                    {user?.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/profile" className="w-full">
                  {t("button.profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/settings" className="w-full">
                  {t("sidebar.other.settings")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-red-500 focus:text-white">
                <Link to="/signOut" className="w-full">
                  {t("button.sign_out")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <LoadingProvider>
          <AuthProvider>
            <ApiProvider>
              <FetchProvider>
                <PermissionProvider>
                  <TooltipProvider delayDuration={0}>
                    <Routes>
                      <Route
                        path="/*"
                        element={
                          <ProtectedRoute>
                            <NotFound />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/signIn" element={<SignIn />} />
                      <Route
                        path="/signIn/forgotPassword"
                        element={<NotFound />}
                      />
                      <Route path="/signUp" element={<SignUp />} />
                      <Route
                        path="/signOut"
                        element={
                          <ProtectedRoute>
                            <SignOut />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Navigate to="/dashboard" />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <RoleBasedRoute
                                RequiredRoleComponent={AdminDashboard}
                                DefaultComponent={UserDashboard}
                                requiredRoles={["Admin"]}
                              />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/users"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Users />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/roles"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Roles />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/user/:userId"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <DisplayUser />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/sessions"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Sessions />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/listings"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Listings />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/games"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Games />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/keys"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Keys />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Settings />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/logs"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Logs />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Profile />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <RoleBasedRoute
                                RequiredRoleComponent={Admin}
                                DefaultComponent={UserDashboard}
                                requiredRoles={["Admin"]}
                              />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </TooltipProvider>
                </PermissionProvider>
              </FetchProvider>
            </ApiProvider>
          </AuthProvider>
        </LoadingProvider>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}
