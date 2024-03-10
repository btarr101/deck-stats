import { Component, Show, createMemo, onMount } from "solid-js";
import { EDHRecCardData } from "../../repo/edhrecRepo";
import { Chart, LinearScale } from "chart.js";
import { colorLerp, highColor, lowColor, toCSSColor } from "../../util";
import { Bar } from "solid-chartjs";
import { Cost, Popularity, Salt, Stat } from "../../model/stat";

const StatChart: Component<{
  stat: Stat;
  data: number[];
}> = (props) => {
  onMount(() => {
    Chart.register(LinearScale);
  });

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
    <div class="card w-full min-w-96">
      <div class="card-body flex flex-col justify-between">
        <h1 class="card-title text-4xl">{props.stat.name}</h1>
        <Show when={props.stat.description}>
          <span class="h-min">{props.stat.description}</span>
        </Show>
        <div class="w-full">
          <Bar
            data={chartData()}
            options={chartOptions}
            width={640}
            height={480}
          />
          <div class="stats w-full">
            <div class="stat">
              <div class="stat-title">Average</div>
              <div class="stat-value">{props.stat.display(average())}</div>
            </div>

            <div class="stat">
              <div class="stat-title">Total</div>
              <div class="stat-value">{props.stat.display(total())}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartSlide: Component<{ cardData: EDHRecCardData[] }> = (props) => {
  return (
    <div
      id="chart-slide"
      class="snap-center bg-info min-h-screen flex flex-col justify-evenly items-center"
    >
      <h1 class="text-6xl text-info-content container text-center">
        Here's an overview
      </h1>
      <div class="flex h-min w-full items-stretch space-x-4 overflow-x-scroll px-4">
        <StatChart
          stat={Salt}
          data={props.cardData.map((cardData) => cardData.salt as number)}
        />
        <StatChart
          stat={Cost}
          data={props.cardData.map((cardData) => cardData.price as number)}
        />
        <StatChart
          stat={Popularity}
          data={props.cardData.map((cardData) => cardData.popularity as number)}
        />
      </div>
    </div>
  );
};

export default ChartSlide;
