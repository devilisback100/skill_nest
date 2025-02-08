import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = ({ userData }) => {
    const navigate = useNavigate();
    const [projectCount, setProjectCount] = useState(userData.projects ? userData.projects.length : 0);
    const totalSkills = Object.keys(userData['Tech-skills']).length + userData['Soft-skills'].length;
    const joinDate = new Date(userData.joinDate || Date.now()).toLocaleDateString();

    useEffect(() => {
        if (!userData.projects) {
            fetch('https://skill-nest-backend.onrender.com/get_projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usn: userData.USN })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        setProjectCount(data.data.length);
                    } else {
                        console.error('Failed to fetch projects.');
                    }
                })
                .catch(err => console.error('Error fetching projects:', err));
        }
    }, [userData]);

    const handleUpdateSkills = () => {
        navigate('/profile', { state: { openUpdateModal: true } });
    };

    const handleAddProject = () => {
        navigate('/projects', { state: { openAddProject: true } });
    };

    const handleViewAchievements = () => {
        const achievementsSection = document.querySelector('.achievements-section');
        if (achievementsSection) {
            achievementsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const achievements = [
        { condition: totalSkills >= 5, icon: '🌟', title: 'Skill Explorer', description: 'Acquired 5+ skills' },
        { condition: userData.points >= 2500, icon: '🏅', title: 'Skill Legend', description: 'Earned 2500+ points' },
        { condition: userData.points >= 2000, icon: '🥇', title: 'Skill Grandmaster', description: 'Earned 2000+ points' },
        { condition: userData.points >= 1500, icon: '🥈', title: 'Skill Master', description: 'Earned 1500+ points' },
        { condition: userData.points >= 1000, icon: '🥉', title: 'Skill Prodigy', description: 'Earned 1000+ points' },
        { condition: userData.points >= 500, icon: '🏆', title: 'Point Master', description: 'Earned 500+ points' },
        { condition: projectCount >= 10, icon: '🏆', title: 'Project Legend', description: 'Completed 10+ projects' },
        { condition: projectCount >= 5, icon: '🏅', title: 'Project Master', description: 'Completed 5+ projects' },
        { condition: projectCount >= 3, icon: '💼', title: 'Project Expert', description: 'Completed 3+ projects' }
    ];

    const sortedAchievements = achievements.filter(achievement => achievement.condition).sort((a, b) => b.condition - a.condition);

    return (
        <div className="about-container">
            <div className="about-header">
                <div className="user-stats">
                    <div className="stat-card">
                        <h3>{totalSkills}</h3>
                        <p>Total Skills</p>
                    </div>
                    <div className="stat-card">
                        <h3>{projectCount}</h3>
                        <p>Projects</p>
                    </div>
                    <div className="stat-card">
                        <h3>{userData.points}</h3>
                        <p>Points</p>
                    </div>
                </div>
            </div>

            <div className="about-sections">
                <div className="about-section">
                    <h2>About SkillNest</h2>
                    <p>SkillNest is a platform designed to help students and professionals track, showcase, and improve their technical and soft skills. Build your portfolio, connect with others, and demonstrate your expertise.</p>
                </div>

                <div className="about-section">
                    <h2>Your Journey</h2>
                    <div className="journey-timeline">
                        <div className="timeline-item">
                            <div className="timeline-icon">🎯</div>
                            <div className="timeline-content">
                                <h3>Joined SkillNest</h3>
                                <p>{joinDate}</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-icon">📈</div>
                            <div className="timeline-content">
                                <h3>Skills Growth</h3>
                                <p>Mastered {totalSkills} skills and counting</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-icon">💼</div>
                            <div className="timeline-content">
                                <h3>Project Portfolio</h3>
                                <p>Completed {projectCount} projects</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="achievements-section">
                    <h2>Your Achievements</h2>
                    <div className="achievements-grid">
                        {sortedAchievements.map((achievement, index) => (
                            <div key={index} className="achievement-item">
                                <span className="achievement-icon">{achievement.icon}</span>
                                <h3>{achievement.title}</h3>
                                <p>{achievement.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button className="action-btn" onClick={handleUpdateSkills}>
                            Update Skills
                        </button>
                        <button className="action-btn" onClick={handleAddProject}>
                            Add Project
                        </button>
                        <button className="action-btn" onClick={handleViewAchievements}>
                            View Achievements
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
