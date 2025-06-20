'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceArea, ResponsiveContainer, ReferenceLine } from 'recharts';

function TTestCasualtiesGender({ alph, sampleSiz }) {
  const [ttestData, setTtestData] = useState(null);
  const [plotData, setPlotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url = `http://127.0.0.1:8000/ttest_casualties_gender?alpha=${alph}&sample_size=${sampleSiz}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const response = await axios.get(url);
        setTtestData(response.data);
        setError(null);

        const t_critical = Math.abs(response.data.t_statistic[0]); 
        const plotRes = await axios.get(`http://127.0.0.1:8000/normal_distribution?alpha=${alph}&t_critical=${t_critical}`);
        setPlotData(plotRes.data);

      } catch (e) {
        setError(e.message);
        setTtestData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, alph]);

  if (loading) {
    return <div>Loading T-test results...</div>;
  }

  if (error) {
    return <div>Error loading T-test results: {error}</div>;
  }

  if (!ttestData) {
    return null; 
  }

  const tStatistic = ttestData?.t_statistic?.[0];
  const pValue = ttestData?.p_value?.[0];
  const alpha = ttestData?.alpha?.[0];
  const rejectNull = ttestData?.reject_null?.[0];
  const tCritical = ttestData?.t_critical;
  const df = ttestData?.df;

  const criticalValue = tCritical ? parseFloat(tCritical) : 0;

  return (
    <div className='r1'>
    <div className="card-container">
      <div className="card">
        <h2>Two Sample t-test: Casualties by Gender</h2>
        {rejectNull ? (
          <p className="result-text success">
            Statistically significant differences were found in the average number of
            casualties between female and male drivers (p &lt; {alpha}).
          </p>
        ) : (
          <p className="result-text">
            No statistically significant differences were found in the average number of
            casualties between female and male drivers (p &gt;= {alpha}).
          </p>
        )}

        <h3>Average Casualties by Gender:</h3>
        <ul className="group-list">
          {ttestData.group_means.map((group) => (
            <li key={group.Sex_of_driver}>
              <strong>{group.Sex_of_driver}:</strong> 
              {group.mean_casualties.toFixed(2)} casualties (SD: {group.sd_casualties.toFixed(2)}, Count: {group.count})
            </li>
          ))}
        </ul>

        <h3>Test Details:</h3>
        <details open className='stat-details'>
          <summary>Test Details</summary>
          <p><strong>T-statistic:</strong> {tStatistic.toFixed(2)}</p>
          <p><strong>P-value:</strong> {pValue.toExponential(2)}</p>
          <p><strong>Degrees of Freedom (approx.):</strong> {ttestData.df[0].toFixed(2)}</p>
          <p><strong>Confidence Interval:</strong> ({ttestData.conf_int[0].toFixed(4)}, {ttestData.conf_int[1].toFixed(4)})</p>
          <p><strong>Significance Level (Alpha):</strong> {alpha}</p>
          <p><strong>Sample Size:</strong> {sampleSiz}</p>
        </details>
        </div>
        </div>

        <div id="cardplot">
        <ResponsiveContainer width="90%" height="87%">
          <LineChart 
            data={plotData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis 
              dataKey="x" 
              domain={['auto', 'auto']}
              type="number"
              allowDataOverflow={true}
            />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
            />
            <ReferenceLine
              x={tStatistic}
              stroke="black"
              strokeWidth={2}
              strokeDasharray="5,5"
              label={{ 
                value: `T-Value:${tStatistic}`, 
                position: 'top',
                fill: 'red'
              }}
              z={10}
            />
            <ReferenceLine
              x={-criticalValue}
              stroke="red"
              strokeWidth={2}
              strokeDasharray="5,5"
              label={{ 
                value: `${-criticalValue}`, 
                position: 'top',
                fill: 'red'
              }}
              z={10}
            />
            <ReferenceLine
              x={criticalValue}
              stroke="red"
              strokeWidth={2}
              strokeDasharray="5,5"
              label={{ 
                value: `${criticalValue}`, 
                position: 'top',
                fill: 'red'
              }}
              z={10}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
        </div>
    
  );
}

export default TTestCasualtiesGender;
