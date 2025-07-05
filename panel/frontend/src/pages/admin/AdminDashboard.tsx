import { useAuthContext } from "@/api/auth/AuthProvider";
import { useFetchContext } from "@/api/FetchProvider";
import LinearDateCountChart from "@/components/charts/LinearDateCountChart";
import DashboardCard from "@/components/DashboardCard";
import { Heading } from "@/components/ui/heading";
import { User } from "@/lib/schema";
import { DollarSignIcon, ShuffleIcon, ZapIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { toggleFetch, users } = useFetchContext();
  const { user } = useAuthContext();
  const [isFetchInitiated, setIsFetchInitiated] = useState(false);

  useEffect(() => {
    if (!isFetchInitiated) {
      toggleFetch("users");
      toggleFetch("settings");
      setIsFetchInitiated(true);
    }
  }, [isFetchInitiated, toggleFetch]);

  function aggregateUsersByDate(users: User[]) {
    const data = users.reduce(
      (acc, user) => {
        if (!user.registerDate) return acc;

        const date = new Date(user?.registerDate);
        const dateString = date.toISOString().split("T")[0];

        if (!acc[dateString]) {
          acc[dateString] = 0;
        }

        acc[dateString]++;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.keys(data)
      .map((date) => ({
        date,
        count: data[date],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const userRegistrationData = aggregateUsersByDate(users);

  return (
    <div className="space-y-5">
      <Heading title={`Welcome back, ${user?.username}`} />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <DashboardCard
          icon={<DollarSignIcon />}
          title="Total users"
          value={users.length}
        />

        <DashboardCard
          icon={<ZapIcon />}
          title="Active subscriptions"
          value={users.filter((user) => user.subscription).length}
        />

        <DashboardCard icon={<ShuffleIcon />} title="Place holder" value={0} />
      </div>

      <div className="mt-8">
        <LinearDateCountChart
          title="User Registrations"
          data={userRegistrationData}
        />
      </div>
    </div>
  );
}
