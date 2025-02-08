import React from 'react';
import './SkillProgress.css';

const SkillProgress = ({ skillsData, type }) => {
    const getSkillLevel = (points) => {
        if (points >= 85) return 'Expert';
        if (points >= 70) return 'Advanced';
        if (points >= 50) return 'Intermediate';
        return 'Beginner';
    };

    const getProgressColor = (points) => {
        if (points >= 85) return '#4CAF50';
        if (points >= 70) return '#2196F3';
        if (points >= 50) return '#FF9800';
        return '#F44336';
    };

    const skills = type === 'tech' ? Object.entries(skillsData) :
        skillsData.map(skill => [skill, points[skill]]);

    return (
        <div className="skill-progress"></div>
            <h3>{type === 'tech' ? 'Technical Skills Progress' : 'Soft Skills Progress'}</h3>
            <div className="skills-grid">
                {skills.map(([skill, points]) => (
                    <div key={skill} className="skill-card">
                        <h4>{skill}</h4>
                        <div className="progress-bar">
                            <div 
                                className="progress" 
                                style={{
                                    width: `${points}%`,
                                    backgroundColor: getProgressColor(points)
                                }}
                            />
                        </div>
                        <p className="skill-level">{getSkillLevel(points)}</p>
                        <p className="skill-points">{points} points</p>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default SkillProgress;
