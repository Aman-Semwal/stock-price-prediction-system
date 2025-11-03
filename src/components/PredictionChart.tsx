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

interface PredictionChartProps {
  data: {
    dates: string[];
    prices: number[];
    predictions: number[];
  };
}

export const PredictionChart = ({ data }: PredictionChartProps) => {
  const chartData = data.dates.map((date, index) => ({
    date,
    actual: data.prices[index],
    predicted: data.predictions[index],
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
          dataKey="actual"
          stroke="hsl(var(--success))"
          strokeWidth={2}
          name="Actual Price"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="hsl(var(--destructive))"
          strokeWidth={2}
          name="Predicted Price"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
