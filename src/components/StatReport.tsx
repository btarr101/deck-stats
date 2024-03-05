import { Close } from "@suid/icons-material";
import {
  Card,
  CardContent,
  Stack,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@suid/material";
import { Line } from "solid-chartjs";
import { Component, createMemo } from "solid-js";
import { aboutDecimalPlaces } from "../util";

const StatReport: Component<{
  statName: string;
  description?: string;
  data: number[];
}> = (props) => {
  const chartData = createMemo(() => {
    const min = Math.min(...props.data);
    const max = Math.max(...props.data);

    const bucketCount = 10;
    const bucketOffset = min;
    const bucketSize = (max - min) / bucketCount;

    let buckets = Array(bucketCount).fill(0);
    for (const dataPoint of props.data) {
      if (isFinite(dataPoint)) {
        let bucketIndex = Math.floor((dataPoint - bucketOffset) / bucketSize);
        if (bucketIndex >= bucketCount) {
          bucketIndex = bucketCount - 1;
        }
        buckets[bucketIndex] += 1;
      }
    }

    const labels = [...Array(bucketCount).keys()].map((index) =>
      aboutDecimalPlaces(min + bucketSize * index, 2)
    );

    return {
      labels,
      datasets: [
        {
          data: buckets,
        },
      ],
    };
  });
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
  };

  const total = createMemo(() =>
    props.data.reduce((accum, next) => accum + next)
  );

  const average = createMemo(() =>
    props.data.reduce((accum, next) => (accum + next) / 2.0)
  );

  return (
    <Paper sx={{ padding: 2 }}>
      <h1>{props.statName}</h1>
      {props.description}
      <Line
        data={chartData()}
        options={chartOptions}
        width={500}
        height={200}
      />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>{aboutDecimalPlaces(total(), 2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Average</TableCell>
            <TableCell>{aboutDecimalPlaces(average(), 2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StatReport;
