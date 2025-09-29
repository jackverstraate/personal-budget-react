import React, { useEffect, useRef } from "react";
import Chart from 'chart.js/auto'
import axios from "axios";

function BudgetChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const dataSource = {
      datasets: [
        {
          data: [],
          backgroundColor: [
            "#ffcd56",
            "#ff6384",
            "#36a2eb",
            "#fd6b19",
            "#2e752f",
            "#fcba03",
            "#332e75"
          ]
        }
      ],
      labels: []
    };

    axios.get("http://localhost:3000/budget").then((res) => {
      res.data.myBudget.forEach((item, i) => {
        dataSource.datasets[0].data[i] = item.budget;
        dataSource.labels[i] = item.title;
      });

      // destroy old chart before creating new one
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: dataSource
      });
    });
  }, []);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default BudgetChart;
