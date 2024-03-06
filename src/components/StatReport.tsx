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
import { Bar } from "solid-chartjs";
import { Component, Show, createMemo } from "solid-js";
import { Stat } from "../model/stat";
import { colorLerp, highColor, lowColor, toCSSColor } from "../util";

const StatReport: Component<{
  stat: Stat;
  data: number[];
}> = (props) => {
  const min = createMemo(() => Math.min(...props.data));
  const max = createMemo(() => Math.max(...props.data));

  const bucketCount = 10;
  const bucketSize = createMemo(() => (max() - min()) / bucketCount);

  const chartData = createMemo(() => {
    const bucketOffset = min();

    let buckets = Array(bucketCount).fill(0);
    for (const dataPoint of props.data) {
      if (isFinite(dataPoint)) {
        let bucketIndex = Math.floor((dataPoint - bucketOffset) / bucketSize());
        if (bucketIndex >= bucketCount) {
          bucketIndex = bucketCount;
        }
        buckets[bucketIndex] += 1;
      }
    }

    const labels = [...Array(bucketCount).keys()].map((index): string => {
      const mid = min() + bucketSize() * (index + 0.5);
      return `~${props.stat.display(mid)}`;
    });

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
    backgroundColor: (context: any) =>
      toCSSColor(
        colorLerp(
          lowColor,
          highColor,
          (min() +
            bucketSize() * (context.dataIndex + 0.5) -
            props.stat.range[0]) /
            (props.stat.range[1] - props.stat.range[0])
        )
      ),
  };

  const total = createMemo(() =>
    props.data.reduce((accum, next) => accum + next)
  );

  const average = createMemo(() =>
    props.data.reduce((accum, next) => (accum + next) / 2.0)
  );

  return (
    <Paper sx={{ padding: 2 }}>
      <h1>{props.stat.name}</h1>
      <Show when={props.stat.description}>
        {props.stat.description}
        <br />
      </Show>
      <Bar data={chartData()} options={chartOptions} width={500} height={200} />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>{props.stat.display(total())}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Average</TableCell>
            <TableCell>{props.stat.display(average())}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StatReport;
