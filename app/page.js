'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchQuantumData();
  }, []);

  const fetchQuantumData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/quantum');

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      setData(result);

      // Analyze the data
      if (result.probabilities) {
        const analyzed = analyzeQuantumData(result.probabilities);
        setAnalysis(analyzed);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeQuantumData = (probabilities) => {
    const states = Object.entries(probabilities);
    const total = states.reduce((sum, [_, prob]) => sum + prob, 0);

    // Sort by probability
    const sortedStates = states.sort((a, b) => b[1] - a[1]);

    // Calculate statistics
    const mean = total / states.length;
    const variance = states.reduce((sum, [_, prob]) => sum + Math.pow(prob - mean, 2), 0) / states.length;
    const stdDev = Math.sqrt(variance);

    // Find dominant states (top 10)
    const dominantStates = sortedStates.slice(0, 10);

    // Calculate entropy
    const entropy = -states.reduce((sum, [_, prob]) => {
      return prob > 0 ? sum + prob * Math.log2(prob) : sum;
    }, 0);

    // Count states with significant probability (>0.1%)
    const significantStates = states.filter(([_, prob]) => prob > 0.001).length;

    return {
      totalStates: states.length,
      totalProbability: total,
      mean,
      variance,
      stdDev,
      entropy,
      significantStates,
      dominantStates,
      minProbability: sortedStates[sortedStates.length - 1][1],
      maxProbability: sortedStates[0][1],
    };
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          SchröDice40 Quantum Analyzer
        </h1>
        <p style={{ color: '#888', fontSize: '18px' }}>
          Quantum Simulation with 65,536 Shots
        </p>
      </header>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{
            border: '4px solid #333',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#888' }}>Fetching quantum simulation data...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {error && (
        <div style={{
          background: '#ff000020',
          border: '1px solid #ff0000',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ff6b6b' }}>Error</h3>
          <p style={{ margin: 0 }}>{error}</p>
          <button
            onClick={fetchQuantumData}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              background: '#667eea',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {data && analysis && (
        <div>
          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <StatCard title="Total States" value={analysis.totalStates} />
            <StatCard title="Significant States" value={analysis.significantStates} subtitle=">0.1% probability" />
            <StatCard title="Entropy" value={analysis.entropy.toFixed(4)} subtitle="bits" />
            <StatCard title="Max Probability" value={(analysis.maxProbability * 100).toFixed(2) + '%'} />
          </div>

          {/* Statistical Analysis */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Statistical Analysis</h2>
            <div style={{
              background: '#1a1a1a',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #333'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <StatRow label="Mean Probability" value={analysis.mean.toFixed(6)} />
                <StatRow label="Standard Deviation" value={analysis.stdDev.toFixed(6)} />
                <StatRow label="Variance" value={analysis.variance.toFixed(8)} />
                <StatRow label="Min Probability" value={analysis.minProbability.toFixed(6)} />
                <StatRow label="Total Probability" value={analysis.totalProbability.toFixed(6)} />
              </div>
            </div>
          </section>

          {/* Dominant States */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Top 10 Dominant States</h2>
            <div style={{
              background: '#1a1a1a',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #333',
              overflowX: 'auto'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '12px', color: '#888' }}>Rank</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: '#888' }}>State</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#888' }}>Probability</th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#888' }}>Percentage</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: '#888' }}>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.dominantStates.map(([state, prob], idx) => (
                    <tr key={state} style={{ borderBottom: '1px solid #2a2a2a' }}>
                      <td style={{ padding: '12px', color: '#667eea', fontWeight: 'bold' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '14px' }}>
                        {state}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>
                        {prob.toFixed(6)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#4ade80' }}>
                        {(prob * 100).toFixed(2)}%
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{
                          background: '#333',
                          height: '8px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          width: '100%',
                          maxWidth: '200px'
                        }}>
                          <div style={{
                            background: 'linear-gradient(90deg, #667eea, #764ba2)',
                            height: '100%',
                            width: `${(prob / analysis.maxProbability) * 100}%`,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Raw Data Preview */}
          <section>
            <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Raw API Response</h2>
            <details style={{
              background: '#1a1a1a',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #333'
            }}>
              <summary style={{ cursor: 'pointer', padding: '10px', fontWeight: 'bold' }}>
                Click to expand raw data
              </summary>
              <pre style={{
                marginTop: '20px',
                padding: '20px',
                background: '#0a0a0a',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '12px',
                lineHeight: '1.6'
              }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '25px',
      borderRadius: '12px',
      border: '1px solid #333',
      textAlign: 'center'
    }}>
      <div style={{ color: '#888', fontSize: '14px', marginBottom: '10px' }}>
        {title}
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div>
      <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontFamily: 'monospace', color: '#4ade80' }}>
        {value}
      </div>
    </div>
  );
}
