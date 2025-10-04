// File: src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { competitorAPI } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [competitors, setCompetitors] = useState([]);
  const [insights, setInsights] = useState([]);
  const [selectedCompetitorId, setSelectedCompetitorId] = useState('');
  const [newComp, setNewComp] = useState({ name: '', website: '', twitter: '' });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loadingCompetitors, setLoadingCompetitors] = useState(true);
  const [addingCompetitor, setAddingCompetitor] = useState(false);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      setLoadingCompetitors(true);
      const res = await competitorAPI.getAll();
      setCompetitors(res.data);
    } catch (err) {
      alert('Error fetching competitors');
    } finally {
      setLoadingCompetitors(false);
    }
  };

  const addCompetitor = async (e) => {
    e.preventDefault();
    setAddingCompetitor(true);
    try {
      await competitorAPI.create(newComp);
      setNewComp({ name: '', website: '', twitter: '' });
      fetchCompetitors();
    } catch (err) {
      alert('Error adding competitor');
    } finally {
      setAddingCompetitor(false);
    }
  };

  const fetchInsights = async (id) => {
    try {
      const res = await competitorAPI.getInsights(id);
      setInsights(res.data);
      setSelectedCompetitorId(id);

      // Prepare chart data
      const labels = res.data.map((i) => new Date(i.date).toLocaleDateString());
      const data = res.data.map(() => 1);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Insights Count',
            data,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.1,
            fill: true,
          },
        ],
      });
    } catch (err) {
      alert('Error fetching insights');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header style={{ 
        background: 'white', 
        padding: '1rem 2rem', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ 
          margin: 0, 
          color: '#1e40af', 
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          🕵️ Competitive Intelligence Tracker
        </h1>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '0.5rem 1rem', 
            background: '#ef4444', 
            color: 'white', 
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Add Competitor Card */}
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Add New Competitor</h2>
          <form onSubmit={addCompetitor}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Competitor Name"
                value={newComp.name}
                onChange={(e) => setNewComp({ ...newComp, name: e.target.value })}
                required
                style={{ 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="url"
                placeholder="Website URL (https://...)"
                value={newComp.website}
                onChange={(e) => setNewComp({ ...newComp, website: e.target.value })}
                required
                style={{ 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="text"
                placeholder="Twitter Handle (@username)"
                value={newComp.twitter}
                onChange={(e) => setNewComp({ ...newComp, twitter: e.target.value })}
                style={{ 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
            </div>
            <button 
              type="submit" 
              disabled={addingCompetitor}
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: addingCompetitor ? '#9ca3af' : '#10b981', 
                color: 'white', 
                border: 'none',
                borderRadius: '6px',
                cursor: addingCompetitor ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
            >
              {addingCompetitor ? 'Adding...' : 'Add Competitor'}
            </button>
          </form>
        </div>

        {/* Competitors List */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Monitored Competitors</h2>
          
          {loadingCompetitors ? (
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <p style={{ margin: 0, color: '#6b7280' }}>Loading competitors...</p>
            </div>
          ) : competitors.length === 0 ? (
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <p style={{ margin: 0, color: '#6b7280' }}>No competitors added yet. Add one above to get started.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1rem' 
            }}>
              {competitors.map((comp) => (
                <div
                  key={comp._id}
                  style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: selectedCompetitorId === comp._id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{comp.name}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                    Website: {comp.website}
                  </p>
                  {comp.twitter && (
                    <p style={{ margin: '0 0 1rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                      Twitter: {comp.twitter}
                    </p>
                  )}
                  <button
                    onClick={() => fetchInsights(comp._id)}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      background: '#3b82f6', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      width: '100%'
                    }}
                  >
                    View Insights
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insights Display */}
        {insights.length > 0 && (
          <>
            {/* Insights List */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
                Recent Insights for {competitors.find(c => c._id === selectedCompetitorId)?.name}
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '1rem' 
              }}>
                {insights.slice(-6).reverse().map((insight) => (
                  <div
                    key={insight._id || insight.date}
                    style={{
                      background: '#fff',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem'
                    }}>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        color: '#6b7280' 
                      }}>
                        {new Date(insight.date).toLocaleDateString()}
                      </span>
                      <span style={{ 
                        background: '#e5e7eb',
                        color: '#4b5563',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        {insight.type || 'update'}
                      </span>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      color: '#374151', 
                      lineHeight: '1.5',
                      fontSize: '0.95rem'
                    }}>
                      {insight.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trends Chart */}
            <div style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '12px',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Insights Trends</h2>
              {chartData.labels.length > 0 ? (
                <Line 
                  data={chartData} 
                  options={{ 
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Number of Insights Over Time'
                      }
                    }
                  }} 
                />
              ) : (
                <p style={{ color: '#6b7280', textAlign: 'center' }}>No data for chart yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;