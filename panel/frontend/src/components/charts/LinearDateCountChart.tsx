import { Card, CardContent, CardHeader, CardTitle } from "@@/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@@/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  date: {
    label: "Date",
  },
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type LinearDateCountChartProps = {
  title: string;
  data: { date: string; count: number }[];
};

function LinearDateCountChart({ title, data }: LinearDateCountChartProps) {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area dataKey="count" type="linear" fillOpacity={0.4} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

LinearDateCountChart.displayName = "LinearDateCountChart";
export default LinearDateCountChart;
