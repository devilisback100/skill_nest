import React from 'react';
import './Achievements.css';

const Achievements = ({ userData }) => {
    const calculateAchievements = () => {
        const achievements = [];
        const totalPoints = userData.points;
        const skillCount = Object.keys(userData['Tech-skills']).length;

        if (totalPoints >= 1000) achievements.push({
            title: 'Skills Master',
            description: 'Accumulated 1000+ skill points',
            icon: '🏆'
        });

        if (skillCount >= 10) achievements.push({
            title: 'Jack of All Trades',
            description: 'Mastered 10+ different skills',
            icon: '🎯'
        });

        if (userData.projects?.length >= 5) achievements.push({
            title: 'Project Guru',
            description: 'Completed 5+ projects',
            icon: '💼'
        });

        return achievements;
    };

    const achievements = calculateAchievements();

    return (
        <div className="achievements-container">
            <h2>Achievements</h2>
            <div className="achievements-grid">
                {achievements.map((achievement, index) => (
                    <div key={index} className="achievement-card">
                        <div className="achievement-icon">{achievement.icon}</div>
                        <h3>{achievement.title}</h3>
                        <p>{achievement.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achievements;
