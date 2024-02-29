import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKipsQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
//import { gridTabIndexCellSelector } from "@mui/x-data-grid";
import { useMemo } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const pieData = [
  { name: "Group A", value: 600 },
  { name: "Group B", value: 400 }
];

const Row2 = () => {
  const { data: operationalData } = useGetKipsQuery();

  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[300]];

  const OperationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3),
            "Operational Expenses": operationalExpenses,
            "Non Operational Expenses": nonOperationalExpenses
          };
        }
      )
    );
  }, [operationalData]);

  const chartData = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(
        ({
          month,
          revenue,
          operationalExpenses,
          nonOperationalExpenses,
          expenses
        }) => {
          return {
            name: month.substring(0, 3),
            revenue: revenue,
            "Operational Expenses": operationalExpenses,
            "Non Operational Expenses": nonOperationalExpenses,
            expenses: expenses
          };
        }
      )
    );
  }, [operationalData]);

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title="Operational vs Non-Operational Expenses"
          sideText="+24%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={OperationalExpenses}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Non Operational Expenses"
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Operational Expenses"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="e">
        <BoxHeader title="Campaigns and Targets" sideText="+14%" />
        <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
          <PieChart
            width={110}
            height={100}
            margin={{
              top: 0,
              right: -10,
              left: 10,
              bottom: 0
            }}
          >
            <Pie
              stroke="none"
              data={pieData}
              innerRadius={18}
              outerRadius={38}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          <Box ml="-0.7rem" flexBasis={"40%"} textAlign={"center"}>
            <Typography variant="h5">Target Sales</Typography>
            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
              6500
            </Typography>
            <Typography variant="h6">
              Finance goals of the campaign that is desired
            </Typography>
          </Box>
          <Box flexBasis={"40%"}>
            <Typography variant="h5">Losses in Revenue</Typography>
            <Typography variant="h6">Losses are down 25%</Typography>
            <Typography mt="0.4rem" variant="h5">
              Profit Margins
            </Typography>
            <Typography variant="h6">
              Margins are up by 10% from last month.
            </Typography>
          </Box>
        </FlexBetween>
      </DashboardBox>

      <DashboardBox gridArea="f">
        <BoxHeader title="Revenue and Expenses Overview" sideText="+24%" />
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={400}
            data={chartData}
            margin={{
              top: 18,
              right: 15,
              bottom: 48,
              left: 5
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
              domain={[0, 23000]}
            />
            <Tooltip />
            <Legend />

            {/* Bar representing 'revenue' */}
            <Bar dataKey="revenue" barSize={30} fill="url(#colorRevenue)" />

            {/* Area representing 'nonOperationalExpenses' */}
            <defs>
              <linearGradient id="areaOperational" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.tertiary[500]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.tertiary[500]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="Operational Expenses"
              fillOpacity={1}
              dot={true}
              fill="url(#areaOperational)"
              stroke={palette.tertiary[500]}
            />

            {/* Line representing 'operationalExpenses' */}
            <Line
              type="monotone"
              dataKey="Non Operational Expenses"
              stroke={palette.primary.main}
            />

            {/* Scatter point representing 'expenses' */}
            <Scatter dataKey="expenses" fill={palette.secondary[500]} />
          </ComposedChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row2;
