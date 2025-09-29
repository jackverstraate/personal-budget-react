import React, { useEffect, useState } from "react";
import axios from "axios";
import D3PieChart from "../D3Chart/D3Chart";

const ChartContainer = () => {
  const [budgetData, setBudgetData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/budget");
        setBudgetData(res.data.myBudget.map(item => ({
          label: item.title,
          value: item.budget
        })));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return <D3PieChart data={budgetData} />;
};

export default ChartContainer;
