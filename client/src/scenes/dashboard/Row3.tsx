import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import {
  useGetKipsQuery,
  useGetProductsQuery,
  useGetTransactionsQuery
} from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
//import { gridTabIndexCellSelector } from "@mui/x-data-grid";
import { useMemo } from "react";
import {
  Cell,
  Pie,
  //   CartesianGrid,
  //   ResponsiveContainer,
  //   Scatter,
  //   ScatterChart,
  //   Tooltip,
  //   XAxis,
  //   YAxis,
  //   ZAxis
  PieChart
} from "recharts";

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];
  const { data: kpiData } = useGetKipsQuery();
  const { data: productData } = useGetProductsQuery();
  // console.log("productData:", productData);
  const { data: transactionsData } = useGetTransactionsQuery();
  // console.log(" transactionsData:", transactionsData);

  // const productExpenseData = useMemo(() => {
  //   return (
  //     productData &&
  //     productData.map(({ _id, price, expense }) => {
  //       return {
  //         id: _id,
  //         price: price,
  //         expense: expense
  //       };
  //     })
  //   );
  // }, [productData]);

  const productColumns = [
    {
      field: "_id",
      headerName: "Product Id",
      flex: 1
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`
    }
  ];

  const transactionsColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1
    },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.67
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `$${params.value}`
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length
    }
  ];

  const pieChartData = useMemo(() => {
    if (kpiData) {
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => {
          return [
            {
              name: key,
              value: value
            },
            {
              name: `${key} of Total`,
              value: totalExpenses - value
            }
          ];
        }
      );
    }
  }, [kpiData]);

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader
          title="Recent Orders"
          sideText={`${transactionsData?.length} latest transactions`}
        />
        <Box
          mt="0.5rem"
          p="0 0.8rem"
          height="74.6%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none"
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden"
            }
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={transactionsData || []}
            columns={transactionsColumns}
          />
        </Box>
      </DashboardBox>
      {/* <DashboardBox gridArea="g">
        <BoxHeader title="Product Prices vs Expenses" sideText={"+15%"} />
        <ResponsiveContainer width="100%" height={"100%"}>
          <ScatterChart
            margin={{
              top: 20,
              right: 55,
              bottom: 45,
              left: -5
            }}
          >
            <CartesianGrid stroke={palette.grey[800]} />
            <XAxis
              type="number"
              dataKey="price"
              name="price"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <YAxis
              type="number"
              dataKey="expense"
              name="expense"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <ZAxis type="number" range={[20]} />
            <Tooltip formatter={(v) => `$${v}`} />
            <Scatter
              name="Products Expenses Ratio"
              data={productExpenseData}
              fill={palette.secondary[500]}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </DashboardBox> */}

      <DashboardBox gridArea="h">
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length} products`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none"
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[800]} !important`
            },
            "&.MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[800]} !important`
            },
            "&.MuiDataGrid-columnSeparator": {
              visibility: "hidden"
            }
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            columns={productColumns}
            rows={productData || []}
          />
        </Box>
      </DashboardBox>
      <DashboardBox gridArea="i">
        <BoxHeader
          title="Expenses Breakdown By Category"
          sideText="stronks !"
        />
        <FlexBetween mt="-0.2rem" gap="0.5rem" p="0 3rem" textAlign="center">
          {pieChartData?.map((data, i) => (
            <Box key={`${data[0].name}-${i}`}>
              <PieChart width={100} height={100}>
                <Pie
                  stroke="none"
                  data={data}
                  innerRadius={18}
                  outerRadius={38}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
              <Typography variant="h5">{data[0].name}</Typography>
            </Box>
          ))}
        </FlexBetween>
      </DashboardBox>

      <DashboardBox gridArea="j">
        <BoxHeader
          title="Overall Summary and Explanation Data"
          sideText="+15%"
        />
        <Box
          height={"15px"}
          margin="1.25rem 1rem 0.4rem 1rem"
          bgcolor={palette.primary[800]}
          borderRadius="1rem"
        >
          <Box
            height={"15px"}
            bgcolor={palette.primary[600]}
            borderRadius="1rem"
            width={"60%"}
          ></Box>
        </Box>
        <Typography margin="0 1rem" variant="h6">
          J'ai enfin terminé mon premier dashboard réactif avec React, Vite,
          JavaScript, MongoDB, NodeJs et bien d'autres encore. Qu'en pensez vous
          ? La prochaine page vous attend dans la partie Machine learning !
          Let's go !
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row3;
