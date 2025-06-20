'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ANOVAcasualtiesRoadCondition({alph,sampleSiz}) {
  const [anovaData, setAnovaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url=`http://127.0.0.1:8000/anova_casualties_road_condition?alpha=${alph}&sample_size=${sampleSiz}`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url); 
        setAnovaData(response.data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) {
    return <div>Loading ANOVA results...</div>;
  }

  if (error) {
    return <div>Error loading ANOVA results: {error}</div>;
  }

  if (!anovaData) {
    return null; 
  }

  const fValue = anovaData.f_value[0];
  const pValue = anovaData.p_value[0];
  const alpha = anovaData.alpha[0];
  const rejectNull = anovaData.reject_null[0];

  return (
    <div className="card-container">
      <div className="card">
        <h2>Analysis of Casualties by Road Surface Condition (ANOVA)</h2>
        {rejectNull ? (
          <p className="result-text success">
            Statistically significant differences were found in the average number of
            casualties across different road surface conditions (p &lt; {alpha}).
          </p>
        ) : (
          <p className="result-text">
            No statistically significant differences were found in the average number of
            casualties across different road surface conditions (p &gt;= {alpha}).
          </p>
        )}

        <h3>Average Casualties per Road Surface Condition:</h3>
        <ul className="condition-list">
          {anovaData.condition_means.map((condition) => (
            <li key={condition.Road_surface_conditions}>
              <strong>{condition.Road_surface_conditions}:</strong> {condition.mean_casualties.toFixed(2)}
            </li>
          ))}
        </ul>

        <details className="stat-details">
          <summary>Statistical Details</summary>
          <p><strong>F-statistic:</strong> {fValue.toFixed(2)}</p>
          <p><strong>P-value:</strong> {pValue.toExponential(2)}</p>
          <p><strong>Degrees of Freedom (Groups, Error):</strong> {anovaData.df.join(', ')}</p>
          <p><strong>Significance Level (Alpha):</strong> {alpha}</p>
          <p><strong>Sample Size:</strong>{sampleSiz}</p>
        </details>
      </div>
    </div>
  );
}

export default ANOVAcasualtiesRoadCondition;
