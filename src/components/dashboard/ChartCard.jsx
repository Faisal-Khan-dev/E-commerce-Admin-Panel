import { Typography, Box } from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function ChartCard({ title, subtitle, data = [] }) {
  const hasData = data.length > 0;

  return (
    <Box
      sx={{
        bgcolor: "var(--bg-surface)",
        borderRadius: 3,
        border: "1px solid var(--border-color)",
        p: 3,
        width: "100%",
        height: 320,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "var(--text-secondary)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      <Box sx={{ height: 230 }}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 10,
                  fontSize: 12,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--color-primary)", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "var(--color-primary)", stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyCenter: "center" }}>
            <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
              No sales data available for this period
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ChartCard;