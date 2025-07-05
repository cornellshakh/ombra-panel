import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";

type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
};

function DashboardCard({ icon, title, value }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          <div className="flex flex-row items-center">
            <div className="mr-1">{icon}</div>
            {title}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="ml-7">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

DashboardCard.displayName = "DashboardCard";
export default DashboardCard;
