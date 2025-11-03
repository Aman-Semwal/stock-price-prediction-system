import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MovingAverageChartProps {
  data: {
    dates: string[];
    prices: number[];
  };
}

const calculateMA = (data: number[], period: number): number[] => {
  const ma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      ma.push(NaN);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      ma.push(sum / period);
    }
  }
  return ma;
};

export const MovingAverageChart = ({ data }: MovingAverageChartProps) => {
  const ma50 = calculateMA(data.prices, 50);
  const ma100 = calculateMA(data.prices, 100);
  const ma200 = calculateMA(data.prices, 200);

  const chartData = data.dates.map((date, index) => ({
    date,
    price: data.prices[index],
    ma50: ma50[index],
    ma100: ma100[index],
    ma200: ma200[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend 
          wrapperStyle={{
            color: "hsl(var(--foreground))",
          }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Price"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="ma50"
          stroke="hsl(var(--success))"
          strokeWidth={1.5}
          name="MA50"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="ma100"
          stroke="hsl(var(--chart-4))"
          strokeWidth={1.5}
          name="MA100"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="ma200"
          stroke="hsl(var(--destructive))"
          strokeWidth={1.5}
          name="MA200"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
