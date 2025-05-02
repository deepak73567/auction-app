import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PaymentGraph = () => {
  const { monthlyRevenue = [] } = useSelector((state) => state.superAdmin);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const data = {
    labels: months,
    datasets: [
      {
        label: "Total Payment Received (₹)",
        data: monthlyRevenue,
        backgroundColor: "#D6482B",
        borderRadius: 8,
        barThickness: 30,
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
            return `₹${value.toLocaleString()}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Monthly Total Payment Received",
        font: {
          size: 18,
        },
        color: "#374151",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px] bg-white p-5 rounded-lg shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
};

export default PaymentGraph;
