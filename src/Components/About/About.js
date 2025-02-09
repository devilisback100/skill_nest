import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Achievements from '../Achievements/Achievements';
import './About.css';

const About = ({ userData }) => {
    const navigate = useNavigate();
    const [projectCount, setProjectCount] = useState(userData.projects ? userData.projects.length : 0);

    // Extract dependencies for useMemo
    const techSkillsLength = useMemo(() => Object.keys(userData['Tech-skills']).length, [userData]);
    const softSkillsLength = useMemo(() => userData['Soft-skills'].length, [userData]);
    const totalSkills = useMemo(() => techSkillsLength + softSkillsLength, [techSkillsLength, softSkillsLength]);

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
                    }
                })
                .catch(err => console.error('Error fetching projects:', err));
        }
    }, [userData.projects, userData.USN]);

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
                <div className="about-section about-skillnest">
                    <h2>About SkillNest</h2>
                    <p>SkillNest is a platform designed to help students and professionals track, showcase, and improve their technical and soft skills. Build your portfolio, connect with others, and demonstrate your expertise.</p>
                </div>

                <div className="about-section about-journey">
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

                <div className="about-section about-achievements">
                    <h2>Your Achievements</h2>
                    <Achievements userData={userData} />
                </div>

                <div className="about-section">
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
