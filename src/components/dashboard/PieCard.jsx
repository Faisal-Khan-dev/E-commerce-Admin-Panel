import { Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getStatusColor } from "../../utils/statusChip";

function PieCard({ title, breakdown = {} }) {
  const data = Object.entries(breakdown)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

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
      <Typography
        sx={{
          fontWeight: 700,
          color: "var(--text-primary)",
          fontFamily: "var(--font-heading)",
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          height: 240,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {hasData ? (
          <PieChart width={220} height={220}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={true}
            >
              {data.map((entry, index) => {
                const color = getStatusColor(entry.name);
                return <Cell key={index} fill={color.text} />;
              })}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
            />
          </PieChart>
        ) : (
          <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
            No status data available
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default PieCard;