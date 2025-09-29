import React, { useEffect, useRef } from "react";
import * as d3chart from "d3";
import axios from "axios";

const D3chartPieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const width = 960;
    const height = 450;
    const radius = Math.min(width, height) / 2;


    const svg = d3chart
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");

    const color = d3chart
      .scaleOrdinal()
      .range([
        "#98abc5",
        "#8a89a6",
        "#7b6888",
        "#6b486b",
        "#a05d56",
        "#d0743c",
        "#ff8c00",
        "#36a2eb",
        "#ff6384",
      ]);

    const pie = d3chart.pie().sort(null).value((d) => d.value);
    const arc = d3chart.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.4);
    const outerArc = d3chart
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const key = (d) => d.data.label;

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    const change = (data) => {
      // ----- PIE SLICES -----
      const slice = svg.select(".slices").selectAll("path.slice").data(pie(data), key);

      slice
        .enter()
        .append("path")
        .attr("class", "slice")
        .style("fill", (d) => color(d.data.label));

      slice
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
          this._current = this._current || d;
          const interpolate = d3chart.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => arc(interpolate(t));
        });

      slice.exit().remove();

      // ----- TEXT LABELS -----
      const text = svg.select(".labels").selectAll("text").data(pie(data), key);

      text
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .text((d) => d.data.label);

      text
        .transition()
        .duration(1000)
        .attrTween("transform", function (d) {
          this._current = this._current || d;
          const interpolate = d3chart.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return `translate(${pos})`;
          };
        })
        .styleTween("text-anchor", function (d) {
          this._current = this._current || d;
          const interpolate = d3chart.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            const d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      text.exit().remove();

      // ----- SLICE TO TEXT POLYLINES -----
      const polyline = svg.select(".lines").selectAll("polyline").data(pie(data), key);

      polyline.enter().append("polyline");

      polyline
        .transition()
        .duration(1000)
        .attrTween("points", function (d) {
          this._current = this._current || d;
          const interpolate = d3chart.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      polyline.exit().remove();
    };

    // Fetch data
    const getBudgetData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/budget");
        const data = res.data.myBudget.map((item) => ({
          label: item.title,
          value: item.budget,
        }));
        change(data);
      } catch (err) {
        console.error("Error fetching budget data", err);
      }
    };

    getBudgetData();
  }, []);

  return <div ref={chartRef}></div>;
};

export default D3chartPieChart;
