import React, { useState, useEffect } from 'react';
import './Profile_page.css';
import Update from './Update';

const ProfilePage = ({ userData, setUserData, techSkillPoints, softSkillsPoints }) => {
    const [name, setName] = useState(userData?.name || 'N/A');
    const [email, setEmail] = useState(userData?.email || 'N/A');
    const [usn, setUsn] = useState(userData?.usn || 'N/A');
    const [prevMonthPoints, setPrevMonthPoints] = useState(userData?.prev_month_points || 0);
    const [totalPoints, setTotalPoints] = useState(userData?.points || 0);
    const [techSkills, setTechSkills] = useState(userData?.['Tech-skills'] || {});
    const [softSkills, setSoftSkills] = useState(userData?.['Soft-skills'] || []);
    const [projects, setProjects] = useState([]);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [projectsVisible, setProjectsVisible] = useState(false);

    useEffect(() => {
        if (userData) {
            setTechSkills(userData['Tech-skills'] || {});
            setSoftSkills(userData['Soft-skills'] || []);
            setProjects(userData.projects || []);
            setName(userData.name || 'N/A');
            setEmail(userData.email || 'N/A');
            setUsn(userData.USN || 'N/A');
            setPrevMonthPoints(userData.prev_month_points || 0);
            setTotalPoints(userData.points || 0);

            fetch('https://skill-nest-backend.onrender.com/get_projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usn: userData.USN })
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
    }, [userData]);

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

    const sortedTechSkills = Object.keys(techSkills).sort((a, b) => {
        if (usedSkills.has(a) && !usedSkills.has(b)) return -1;
        if (!usedSkills.has(a) && usedSkills.has(b)) return 1;
        return a.localeCompare(b);
    });

    const sortedSoftSkills = softSkills.sort((a, b) => {
        if (usedSkills.has(a) && !usedSkills.has(b)) return -1;
        if (!usedSkills.has(a) && usedSkills.has(b)) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="profile-container">
            <h1>Profile Page</h1>

            <div className="user-data">
                <h3>Your Profile Information</h3>
                <div className="info">
                    <span>Name:</span><p>{name}</p>
                </div>
                <div className="info">
                    <span>USN:</span><p>{usn}</p>
                </div>
                <div className="info">
                    <span>Email:</span><p>{email}</p>
                </div>
                <div className="info">
                    <span>Previous Month Points:</span><p>{prevMonthPoints}</p>
                </div>
                <div className="info">
                    <span>Total Points:</span><p>{totalPoints}</p>
                </div>

                <div className="info">
                    <span>Tech Skills:</span>
                    <p>
                        {sortedTechSkills.length > 0
                            ? sortedTechSkills.map((skill, index) => (
                                <React.Fragment key={skill}>
                                    {index > 0 && ', '}
                                    <span
                                        style={{ 
                                            color: usedSkills.has(skill) ? '#007bff' : 'inherit',
                                            fontWeight: usedSkills.has(skill) ? 'bold' : 'normal'
                                        }}
                                    >
                                        {skill}
                                    </span>
                                </React.Fragment>
                            ))
                            : 'No tech skills added'}
                    </p>
                </div>

                <div className="info">
                    <span>Soft Skills:</span>
                    <p>
                        {sortedSoftSkills.length > 0
                            ? sortedSoftSkills.map((skill, index) => (
                                <React.Fragment key={skill}>
                                    {index > 0 && ', '}
                                    <span
                                        style={{ 
                                            color: usedSkills.has(skill) ? '#007bff' : 'inherit',
                                            fontWeight: usedSkills.has(skill) ? 'bold' : 'normal'
                                        }}
                                    >
                                        {skill}
                                    </span>
                                </React.Fragment>
                            ))
                            : 'No soft skills added'}
                    </p>
                </div>

                <button onClick={() => setUpdateModalVisible(true)}>Edit Profile</button>
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