"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type MetricChartCardProps = {
  title: string;
  totalLabel: string;
  totalValue: string | number;
  labels: string[];
  values: number[];
  colors: string[];
};

export function MetricChartCard({
  title,
  totalLabel,
  totalValue,
  labels,
  values,
  colors,
}: MetricChartCardProps) {
  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderRadius: 10,
        borderSkipped: false,
        maxBarThickness: 34,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        displayColors: false,
        backgroundColor: "#102033",
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#64748b", font: { size: 11, weight: 600 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148,163,184,0.16)", drawTicks: false },
        border: { display: false },
        ticks: {
          color: "#94a3b8",
          font: { size: 10 },
          precision: 0,
        },
      },
    },
  };

  return (
    <section className="rounded-[20px] bg-white/78 p-4 shadow-none ring-1 ring-slate-200/55 backdrop-blur-sm md:rounded-[26px] md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-[0_16px_38px_rgba(17,34,68,0.06)] md:ring-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</p>
          <p className="mt-2 text-sm text-slate-500">{totalLabel}</p>
        </div>
        <p className="font-[family:var(--font-display)] text-[2rem] font-semibold tracking-tight text-brand-navy">{totalValue}</p>
      </div>
      <div className="mt-5 h-56">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}

type DistributionChartCardProps = {
  title: string;
  labels: string[];
  values: number[];
  colors: string[];
};

export function DistributionChartCard({
  title,
  labels,
  values,
  colors,
}: DistributionChartCardProps) {
  const data: ChartData<"doughnut"> = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: "#ffffff",
        borderWidth: 4,
        hoverOffset: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          color: "#475569",
          font: { size: 11, weight: 600 },
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: "#102033",
        padding: 10,
      },
    },
  };

  return (
    <section className="rounded-[20px] bg-white/78 p-4 shadow-none ring-1 ring-slate-200/55 backdrop-blur-sm md:rounded-[26px] md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-[0_16px_38px_rgba(17,34,68,0.06)] md:ring-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <div className="mt-4 h-64">
        <Doughnut data={data} options={options} />
      </div>
    </section>
  );
}
