import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Projects.css';

function Projects({ techSkillPoints, userData, setUserData }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { viewedUser, readOnly, openAddProject } = location.state || {};
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        liveUrl: '',
        githubUrl: '',
        skillsNeeded: [],
        teamProject: false,
        teamMembers: []
    });

    const [newSkillNeeded, setNewSkillNeeded] = useState('');
    const [newTeamMember, setNewTeamMember] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAddProjectForm, setShowAddProjectForm] = useState(openAddProject || false);

    const targetUsn = useMemo(() => viewedUser?.USN || userData?.USN, [viewedUser, userData]);

    useEffect(() => {
        let isMounted = true;

        const fetchProjects = async () => {
            try {
                const response = await fetch('https://skill-nest-backend.onrender.com/get_projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usn: targetUsn })
                });
                const data = await response.json();
                if (isMounted && data.status === 'success') {
                    setProjects(data.data || []);
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Error fetching projects.');
            }
        };

        if (targetUsn) {
            fetchProjects();
        }

        return () => {
            isMounted = false;
        };
    }, [targetUsn]);

    const handleAddProject = async () => {
        if (loading) return;
        if (newProject.title && newProject.description) {
            setLoading(true);
            try {
                const response = await fetch('https://skill-nest-backend.onrender.com/add_project', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usn: userData.USN,
                        password: userData.password,
                        title: newProject.title,
                        description: newProject.description,
                        live_url: newProject.liveUrl,
                        github_url: newProject.githubUrl,
                        skills_needed: newProject.skillsNeeded,
                        team_project: newProject.teamProject,
                        team_members: newProject.teamMembers
                    })
                });

                const data = await response.json();
                if (data.status === 'success') {
                    setProjects(prevProjects => [...prevProjects, newProject]);
                    setNewProject({
                        title: '',
                        description: '',
                        liveUrl: '',
                        githubUrl: '',
                        skillsNeeded: [],
                        teamProject: false,
                        teamMembers: []
                    });
                    setShowAddProjectForm(false);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Error connecting to the server.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please fill in the project title and description.');
        }
    };

    const handleAddSkillNeeded = () => {
        if (newSkillNeeded && !newProject.skillsNeeded.includes(newSkillNeeded)) {
            setNewProject({
                ...newProject,
                skillsNeeded: [...newProject.skillsNeeded, newSkillNeeded]
            });
            setNewSkillNeeded('');
        }
    };

    const handleAddTeamMember = () => {
        if (newTeamMember && !newProject.teamMembers.includes(newTeamMember)) {
            setNewProject({
                ...newProject,
                teamMembers: [...newProject.teamMembers, newTeamMember]
            });
            setNewTeamMember('');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };
    const headerText = viewedUser ? `${viewedUser.name}'s Projects` : 'Your Projects';

    return (
        <div className="projects-container">
            <div className="projects-header">
                <h3>{headerText}</h3>
                {viewedUser && (
                    <button onClick={handleBack} className="back-button">
                        Back to Profile
                    </button>
                )}
            </div>
            <div className="projects-list">
                {projects.length > 0 ? projects.map((project, index) => (
                    <div key={index} className="project-card">
                        <div className="project-header">
                            <h4>{project.title}</h4>
                            <div className="project-links">
                                <a href={project.live_url} target="_blank" rel="noopener noreferrer">Live URL</a>
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub URL</a>
                            </div>
                        </div>
                        <p>{project.description}</p>
                        <div className="skills-list">
                            {project.skills_needed && project.skills_needed.map((skill, index) => (
                                <span key={index} className="skill-item">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <div className="team-members-list">
                            {project.team_members && project.team_members.map((member, index) => (
                                <span key={index} className="team-member-item">
                                    {member}
                                </span>
                            ))}
                        </div>
                    </div>
                )) : <p>No projects added</p>}
            </div>

            {!readOnly && <button onClick={() => setShowAddProjectForm(true)}>Add New Project</button>}

            {showAddProjectForm && (
                <div className="project-form">
                    <h3>Add New Project</h3>
                    <input
                        type="text"
                        placeholder="Project Title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Project Description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Live URL"
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="GitHub URL"
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    />
                    <div className="skills-selector">
                        <select
                            value={newSkillNeeded}
                            onChange={(e) => setNewSkillNeeded(e.target.value)}
                        >
                            <option value="">Select a skill needed</option>
                            {Object.keys(techSkillPoints).map((skill, index) => (
                                <option key={index} value={skill}>
                                    {skill}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleAddSkillNeeded}>Add Skill Needed</button>
                    </div>
                    <div className="skills-list">
                        {newProject.skillsNeeded.map((skill, index) => (
                            <span key={index} className="skill-item">
                                {skill}
                            </span>
                        ))}
                    </div>
                    <div className="team-project">
                        <label>
                            <input
                                type="checkbox"
                                checked={newProject.teamProject}
                                onChange={(e) => setNewProject({ ...newProject, teamProject: e.target.checked })}
                            />
                            Team Project
                        </label>
                        {newProject.teamProject && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Add Team Member"
                                    value={newTeamMember}
                                    onChange={(e) => setNewTeamMember(e.target.value)}
                                />
                                <button onClick={handleAddTeamMember}>Add Team Member</button>
                                <div className="team-members-list">
                                    {newProject.teamMembers.map((member, index) => (
                                        <span key={index} className="team-member-item">
                                            {member}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <button onClick={handleAddProject} disabled={loading}>
                        {loading ? 'Adding...' : 'Add Project'}
                    </button>
                    {error && <p className="error">{error}</p>}
                    <button className="cancel-button" onClick={() => setShowAddProjectForm(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Projects;
