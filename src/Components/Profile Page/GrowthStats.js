import React, { useEffect, useState, useContext } from 'react';
import './GrowthStats.css';
import { ApiContext } from '../../contexts/ApiContext';

const GrowthStats = ({ usn, batchId }) => {
    const apiConfig = useContext(ApiContext);
    const [growthStats, setGrowthStats] = useState(null);

    useEffect(() => {
        const fetchGrowthStats = async () => {
            try {
                const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.getUserGrowth}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usn, batch_id: batchId })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    setGrowthStats(result.data);
                }
            } catch (error) {
                console.error('Error fetching growth stats:', error);
            }
        };

        fetchGrowthStats();
    }, [usn, batchId, apiConfig]);

    if (!growthStats) {
        return <div>Loading growth statistics...</div>;
    }

    return (
        <div className="growth-stats">
            <h3>Growth Statistics</h3>
            <div className="stats-item">
                <span className="stats-label">Months Active:</span>
                <span className="stats-value">{growthStats.months_active}</span>
            </div>
            <div className="stats-item">
                <span className="stats-label">Monthly Growth:</span>
                <span className="stats-value">{growthStats.monthly_growth.toFixed(2)}%</span>
            </div>
            <div className="stats-item">
                <span className="stats-label">Date Joined:</span>
                <span className="stats-value">{growthStats.date_joined}</span>
            </div>
            <div className="stats-item">
                <span className="stats-label">Last Update:</span>
                <span className="stats-value">{growthStats.last_update}</span>
            </div>
            <h4>Points History</h4>
            <ul className="points-history">
                {growthStats.points_history.map((entry, index) => (
                    <li key={index}>
                        <span>{entry.month}: </span>
                        <span>{entry.points} points</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GrowthStats;
