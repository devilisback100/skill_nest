import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Profile_page.css';
import Update from './Update';
import SkillRecommendations from './SkillRecommendations';

const ProfilePage = ({ userData, setUserData, techSkillPoints, softSkillsPoints }) => {
    const location = useLocation();
    const { user, readOnly, openUpdateModal } = location.state || {};
    const [name, setName] = useState(user?.name || userData?.name || 'N/A');
    const [email, setEmail] = useState(user?.email || userData?.email || 'N/A');
    const [usn, setUsn] = useState(user?.usn || userData?.usn || 'N/A');
    const [prevMonthPoints, setPrevMonthPoints] = useState(user?.prev_month_points || userData?.prev_month_points || 0);
    const [totalPoints, setTotalPoints] = useState(user?.points || userData?.points || 0);
    const [techSkills, setTechSkills] = useState(user?.['Tech-skills'] || userData?.['Tech-skills'] || {});
    const [softSkills, setSoftSkills] = useState(user?.['Soft-skills'] || userData?.['Soft-skills'] || []);
    const [projects, setProjects] = useState(user?.projects || userData?.projects || []);
    const [socialProfiles, setSocialProfiles] = useState(user?.['Social_profiles'] || userData?.['Social_profiles'] || []);
    const [updateModalVisible, setUpdateModalVisible] = useState(openUpdateModal || false);
    const [projectsVisible, setProjectsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user || userData) {
            setTechSkills(user?.['Tech-skills'] || userData['Tech-skills'] || {});
            setSoftSkills(user?.['Soft-skills'] || userData['Soft-skills'] || []);
            setProjects(user?.projects || userData.projects || []);
            setName(user?.name || userData.name || 'N/A');
            setEmail(user?.email || userData.email || 'N/A');
            setUsn(user?.USN || userData.USN || 'N/A');
            setPrevMonthPoints(user?.prev_month_points || userData.prev_month_points || 0);
            setTotalPoints(user?.points || userData.points || 0);
            setSocialProfiles(user?.['Social_profiles'] || userData['Social_profiles'] || []);

            if (!user?.projects && !userData.projects) {
                fetch('https://skill-nest-backend.onrender.com/get_projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usn: user?.USN || userData.USN })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            setProjects(data.data || []);
                        } else {
                            console.error('Failed to fetch projects.');
                        }
                    })
                    .catch(err => console.error('Error fetching projects:', err));
            }
        }
    }, [user, userData]);

    const getUsedSkills = () => {
        const usedSkills = new Set();
        if (projects && projects.length > 0) {
            projects.forEach(project => {
                if (project.skills_needed) {
                    project.skills_needed.forEach(skill => usedSkills.add(skill));
                }
            });
        }
        return usedSkills;
    };

    const usedSkills = getUsedSkills();

    const sortSkills = (skills, isArray = false) => {
        const skillsArray = isArray ? skills : Object.keys(skills);
        const used = skillsArray.filter(skill => usedSkills.has(skill));
        const unused = skillsArray.filter(skill => !usedSkills.has(skill));

        return [
            ...used.sort((a, b) => a.localeCompare(b)),
            ...unused.sort((a, b) => a.localeCompare(b))
        ];
    };

    const sortedTechSkills = sortSkills(techSkills);
    const sortedSoftSkills = sortSkills(softSkills, true);

    const handleViewProjects = () => {
        navigate('/projects', {
            state: {
                viewedUser: user,
                readOnly: true
            }
        });
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>{name}'s Profile</h1>
                <p>{email}</p>
            </div>

            <div className="user-data">
                <div className="info-card">
                    <h3>Basic Information</h3>
                    <div className="info-item">
                        <span className="info-label">USN</span>
                        <span className="info-value">{usn}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Previous Month Points</span>
                        <span className="info-value">{prevMonthPoints}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Total Points</span>
                        <span className="info-value">{totalPoints}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Projects Count</span>
                        <span className="info-value">{projects.length}</span>
                    </div>
                </div>

                <div className="info-card">
                    <h3>Technical Skills</h3>
                    <div className="skills-grid">
                        {sortedTechSkills.map((skill) => (
                            <div
                                key={skill}
                                className={`skill-tag ${usedSkills.has(skill) ? 'used' : ''}`}
                            >
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="info-card">
                    <h3>Soft Skills</h3>
                    <div className="skills-grid">
                        {sortedSoftSkills.map((skill) => (
                            <div
                                key={skill}
                                className={`skill-tag ${usedSkills.has(skill) ? 'used' : ''}`}
                            >
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="info-card">
                    <h3>Social Profiles</h3>
                    <div className="social-profiles">
                        {socialProfiles.length > 0 ? (
                            socialProfiles.map((profile, index) => (
                                <div
                                    key={index}
                                    className="social-profile-item"
                                    data-platform={profile.Social_profile_name}
                                >
                                    <a href={profile.link} target="_blank" rel="noopener noreferrer">
                                        {profile.Social_profile_name}
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p>No social profiles added</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                {!readOnly && (
                    <button className="action-button primary-button" onClick={() => setUpdateModalVisible(true)}>
                        Edit Profile
                    </button>
                )}
                {readOnly && (
                    <button className="action-button secondary-button" onClick={handleViewProjects}>
                        View Projects
                    </button>
                )}
            </div>

            <div className="recommendations-wrapper">
                <SkillRecommendations
                    userSkills={techSkills}
                    techSkillPoints={techSkillPoints}
                    projectSkills={projects.flatMap(p => p.skills_needed || [])}
                />
            </div>

            {updateModalVisible && (
                <Update
                    userData={userData}
                    setUserData={setUserData}
                    techSkillPoints={techSkillPoints}
                    softSkillsPoints={softSkillsPoints}
                    closeModal={() => setUpdateModalVisible(false)}
                />
            )}

            {projectsVisible && (
                <div className="projects-section">
                    <h3>Your Projects</h3>
                    <div className="projects-list">
                        {projects.length > 0 ? projects.map((project, index) => (
                            <div key={index} className="project-item">
                                <h4>{project.title}</h4>
                                <p>{project.description}</p>
                                <a href={project.live_url} target="_blank" rel="noopener noreferrer">Live URL</a>
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub URL</a>
                                <div className="skills-list">
                                    {project.skills_needed.map((skill, index) => (
                                        <span key={index} className="skill-item">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div className="team-members-list">
                                    {project.team_members.map((member, index) => (
                                        <span key={index} className="team-member-item">
                                            {member}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )) : <p>No projects added</p>}
                    </div>
                    <button onClick={() => setProjectsVisible(false)}>Close Projects</button>
                    <button onClick={() => setProjectsVisible(false)}>Add New Project</button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;