import { useAuthContext } from "@/api/auth/AuthProvider";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@@/ui/tabs";

export default function UserDashboard() {
  const { user } = useAuthContext();

  return (
    <div>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-5">
          <Heading
            title={`Welcome back to the user panel, ${user?.username}`}
          />

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
