import React, { useState } from "react";
import { parseChartData } from "../services/chartHelper";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const ChartGenerator = ({ onDataGenerated }) => {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);

  const handleGenerate = () => {
    const parsed = parseChartData(input);
    setData(parsed);
    if (onDataGenerated) {
      onDataGenerated(parsed);
    }
  };

  return (
    <div className="chart-generator">
      <div className="chart-input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Sales Q1:10 Q2:20 Q3:15 Q4:30"
          className="chart-input"
        />
        <button onClick={handleGenerate} className="chart-generate-button">
          Generate Chart
        </button>
      </div>

      {data.length > 0 && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#ccc" />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ChartGenerator;