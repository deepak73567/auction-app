import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const BiddersAuctioneerGraph = () => {
  const { totalAuctioneers = [], totalBidders = [] } = useSelector(
    (state) => state.superAdmin
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Number of Bidders",
        data: totalBidders,
        borderColor: "#D6482B",
        backgroundColor: "#D6482B",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Number of Auctioneers",
        data: totalAuctioneers,
        borderColor: "#1E90FF",
        backgroundColor: "#1E90FF",
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Bidders and Auctioneers Registration Trend",
        font: {
          size: 18,
        },
        color: "#4B5563",
      },
    },
  };

  return (
    <div className="w-full h-[400px] bg-white p-5 rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default BiddersAuctioneerGraph;
