import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { usedata } from "../context/dataContext";
import { useTranslation } from "react-i18next";

const dataset = [
  { date: "04-Oct-2025", count: 2 },
  { date: "03-Oct-2025", count: 5 },
  { date: "02-Oct-2025", count: 8 },
];

const xLabels = ["01-Oct-2025", "02-Oct-2025", "03-Oct-2025"];

const pData = [10, 12, 18];
const uData = [5, 6, 15];

const userData = JSON.parse(localStorage.getItem("userDataLocal"));
const teamData = JSON.parse(localStorage.getItem("teamDataLocal"));
const activeUsers = JSON.parse(localStorage.getItem("registerData")) || [];

const colors = {
  light: {
    pv: "#6366F1",
    uv: "#F59E0B",
    bar: "#3B82F6",
    cardText: "#1F2937",
    axis: "#4b5563",
    card1: "linear-gradient(135deg,#FFE259,#FFA751)",
    card2: "linear-gradient(135deg,#FAD0C4,#FFD1FF)",
    card3: "linear-gradient(135deg,#D9A7FF,#FEC3FF)",
  },
  dark: {
    pv: "#A5B4FC",
    uv: "#FCD34D",
    bar: "#ffffff",
    cardText: "#e5e7eb",
    axis: "#ffffff",
    card1: "linear-gradient(135deg,#1e293b,#0f172a)",
    card2: "linear-gradient(135deg,#312e81,#1e1b4b)",
    card3: "linear-gradient(135deg,#0f766e,#064e3b)",
  },
  blue: {
    pv: "#6366F1",
    uv: "#F59E0B",
    bar: "#f5ed05",
    cardText: "#ffffff",
    axis: "#ffffff",
    card1: "linear-gradient(135deg,#2b5876,#4e4376)",
    card2: "linear-gradient(135deg,#005C97,#363795)",
    card3: "linear-gradient(135deg,#396afc,#2948ff)",
  },
};

const Dashboard = () => {
  const { theme } = usedata();
  const { t } = useTranslation();
  const themeColors = colors[theme];

  const barOptions = {
    chart: { id: "bar-chart", toolbar: { show: false } },
    xaxis: {
      categories: dataset.map((d) => d.date),
      labels: { style: { colors: themeColors.axis } },
    },
    yaxis: {
      labels: { style: { colors: themeColors.axis } },
    },
    plotOptions: {
      bar: { columnWidth: "40%", borderRadius: 6 },
    },
    dataLabels: { enabled: false },
    colors: [themeColors.bar],
    theme: { mode: theme },
  };

  const barSeries = [
    { name: t("usersRegistered"), data: dataset.map((d) => d.count) },
  ];

  const lineOptions = {
    chart: { id: "line-chart", toolbar: { show: false } },
    xaxis: {
      categories: xLabels,
      labels: { style: { colors: themeColors.axis } },
    },
    yaxis: {
      labels: { style: { colors: themeColors.axis } },
    },
    stroke: { curve: "smooth", width: 3 },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [themeColors.pv, themeColors.uv],
    theme: { mode: theme },
  };

  const lineSeries = [
    { name: t("totalUsers"), data: pData },
    { name: t("activeUsers"), data: uData },
  ];

  return (
    <div className="w-full px-2 pb-1 flex justify-center">
      <div className="px-2 w-full rounded-[5px]">
        <div className="w-full md:flex md:flex-row grid grid-cols-2 gap-4 lg:flex-row justify-around mt-3">
          <div
            className="lg:w-[30%] md:w-[30%] w-full rounded-2xl h-[120px] shadow-xl flex flex-col items-center justify-center gap-1 transition-all"
            style={{
              background: themeColors.card1,
              color: themeColors.cardText,
            }}
          >
            <span className="lg:text-6xl md:text-4xl font-semibold">
              {userData?.Data.length || "20"}
            </span>
            <span className="lg:text-2xl md:text-xl text-sm font-medium">
              {t("totalUsers")}
            </span>
          </div>

          <div
            className="lg:w-[30%] md:w-[30%] w-full rounded-2xl h-[120px] shadow-xl flex flex-col items-center justify-center gap-1 transition-all"
            style={{
              background: themeColors.card2,
              color: themeColors.cardText,
            }}
          >
            <span className="lg:text-6xl md:text-4xl font-semibold">
              {teamData?.TotalRecord}
            </span>
            <span className="lg:text-2xl md:text-xl text-sm font-medium">
              {t("totalTeams")}
            </span>
          </div>

          <div
            className="lg:w-[30%] md:w-[30%] w-full rounded-2xl h-[120px] shadow-xl flex flex-col items-center justify-center gap-1 transition-all"
            style={{
              background: themeColors.card3,
              color: themeColors.cardText,
            }}
          >
            <span className="lg:text-6xl md:text-4xl font-semibold">
              {activeUsers.length}
            </span>
            <span className="lg:text-2xl md:text-xl text-sm font-medium">
              {t("activeUsers")}
            </span>
          </div>
        </div>

        <div
          className="mt-10 flex justify-around flex-col lg:flex-row gap-10"
          style={{ color: themeColors.cardText }}
        >
          <div className="w-full lg:w-[45%] flex flex-col items-center">
            <h6 className="text-base mb-3 font-medium">
              {t("Date-wise User Registration Graph")}
            </h6>
            <div className="w-full max-w-[450px]">
              <Chart
                options={barOptions}
                series={barSeries}
                type="bar"
                height={270}
              />
            </div>
          </div>

          <div className="w-full lg:w-[45%] flex flex-col items-center">
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: themeColors.pv }}
                ></span>
                <span className="text-sm">{t("totalUsers")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: themeColors.uv }}
                ></span>
                <span className="text-sm">{t("activeUsers")}</span>
              </div>
            </div>

            <div className="w-full max-w-[450px]">
              <Chart
                options={lineOptions}
                series={lineSeries}
                type="line"
                height={270}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
