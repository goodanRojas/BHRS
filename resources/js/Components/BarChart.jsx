import { useEffect, useRef } from "react";
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from "chart.js";

// Register the necessary components
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "bar",  // Bar chart type
        data: {
          labels: data.labels, // Example: ['January', 'February', ...]
          datasets: [
            {
              label: data.title, // Graph title (Total Revenue, Occupancy Rate)
              data: data.values, // The values to plot on the y-axis
              backgroundColor: "rgba(75, 192, 192, 0.2)", // Bar color
              borderColor: "rgba(75, 192, 192, 1)", // Bar border color
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category', // x-axis uses category scale
              beginAtZero: true,
            },
            y: {
              type: 'linear', // y-axis uses linear scale
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default BarChart;
