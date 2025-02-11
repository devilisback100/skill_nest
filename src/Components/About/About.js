import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = ({ userData }) => {
    const navigate = useNavigate();

    const handleQuickAction = (action) => {
        switch (action) {
            case 'updateSkills':
                navigate('/profile', { state: { openUpdateModal: true } });
                break;
            case 'addProject':
                navigate('/projects', { state: { openAddProject: true } });
                break;
            case 'viewAchievements':
                navigate('/profile', { state: { scrollToAchievements: true } });
                break;
            case 'findTeam':
                navigate('/team-builder', { state: { openTeamFinder: true } });
                break;
            default:
                break;
        }
    };

    return (
        <div className="about-container">
            <div className="about-section about-skillnest">
                <h2>About SkillNest</h2>
                <p>
                    This project addresses the challenge of <strong>skill tracking, professional portfolio management, and competitive learning</strong>.
                    It provides a <strong>centralized platform</strong> where users can:
                </p>
                <ul>
                    <li>Showcase their <strong>technical and soft skills</strong></li>
                    <li>Document <strong>projects</strong> and track <strong>achievements</strong></li>
                    <li>Monitor and improve their <strong>professional growth</strong> over time</li>
                </ul>
                <p>
                    Additionally, users can <strong>compete with friends, large groups, and classmates</strong> across multiple batches to
                    track and compare progress in a competitive environment, while also receiving <strong>AI-powered skill recommendations</strong> for continuous improvement.
                </p>
                <h3>AI-Powered Team Formation</h3>
                <p>
                    For <strong>recruiters and project managers</strong>, SkillNest offers an <strong>AI-driven team selection system</strong>.
                    Simply provide a <strong>problem statement or project details</strong>, and our AI will:
                </p>
                <ul>
                    <li>Analyze the required skills and project needs</li>
                    <li>Scan available batches to find the best-matching team members</li>
                    <li>Suggest an optimized team for maximum efficiency</li>
                </ul>
                <p>This ensures that projects are handled by the right people with the right expertise.</p>
            </div>

            <div className="about-section">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <button className="action-btn" onClick={() => handleQuickAction('updateSkills')}>
                        Update Skills
                    </button>
                    <button className="action-btn" onClick={() => handleQuickAction('addProject')}>
                        Add Project
                    </button>
                    <button className="action-btn" onClick={() => handleQuickAction('viewAchievements')}>
                        View Achievements
                    </button>
                    <button className="action-btn" onClick={() => handleQuickAction('findTeam')}>
                        Find a Team
                    </button>
                </div>
            </div>
        </div>
    );
};

export default About;
