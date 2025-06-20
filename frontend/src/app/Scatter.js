'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function Scattr({ url, iden, title }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(url);
      setData(response.data);
    }
    fetchData();
  }, []);

  // Group data by Weather_conditions
  const groupByWeather = (data) => {
    const grouped = {};
    data.forEach(item => {
      if (!grouped[item.Weather_conditions]) {
        grouped[item.Weather_conditions] = [];
      }
      grouped[item.Weather_conditions].push({
        x: item.Light_conditions,
        y: item.Count
      });
    });
    return grouped;
  };

  return (
    <div id={iden}>
      <div id="edacard2">
        {data ? (
          <div id="edaplot">
            <ResponsiveContainer width="96%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 70, left: 20 }}>
                <CartesianGrid />
                <XAxis
                  type="category"
                  dataKey="x"
                  name="Light Conditions"
                  tick={{ fontSize: 12 }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis type="number" dataKey="y" name="Accident Count" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend   layout="horizontal"
                verticalAlign="top"
                align="center"
                wrapperStyle={{ marginBottom: 10 }}  />
                {Object.entries(groupByWeather(data)).map(([condition, points], idx) => (
                  <Scatter
                    key={condition}
                    name={condition}
                    data={points}
                    fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a0522d"][idx % 5]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
            <div id="edatitle">{title}</div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default Scattr;
