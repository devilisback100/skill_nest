import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import './Profile_page.css';
import Update from './Update';
import { ApiContext } from '../../contexts/ApiContext';
import SkillProgress from './SkillProgress';
import Achievements from '../Achievements/Achievements';
import SkillRecommendations from './SkillRecommendations';

const ProfilePage = ({ userData, setUserData, techSkillPoints, softSkillsPoints }) => {
    const location = useLocation();
    const { user, readOnly, openUpdateModal } = location.state || {};
    const [name, setName] = useState(readOnly ? user?.name : userData?.name || 'N/A');
    const [email, setEmail] = useState(readOnly ? user?.email : userData?.email || 'N/A');
    const [usn, setUsn] = useState(readOnly ? user?.USN : userData?.USN || 'N/A');
    const [batchName, setBatchName] = useState('Loading...');
    const [prevMonthPoints, setPrevMonthPoints] = useState(readOnly ? user?.prev_month_points : userData?.prev_month_points || 0);
    const [totalPoints, setTotalPoints] = useState(readOnly ? user?.points : userData?.points || 0);
    const [techSkills, setTechSkills] = useState(readOnly ? user?.['Tech-skills'] : userData?.['Tech-skills'] || {});
    const [softSkills, setSoftSkills] = useState(readOnly ? user?.['Soft-skills'] : userData?.['Soft-skills'] || []);
    const [projects, setProjects] = useState(readOnly ? user?.projects : userData?.projects || []);
    const [socialProfiles, setSocialProfiles] = useState(readOnly ? user?.['Social_profiles'] : userData?.['Social_profiles'] || []);
    const [updateModalVisible, setUpdateModalVisible] = useState(openUpdateModal || false);
    const apiConfig = useContext(ApiContext);

    useEffect(() => {
        if (user || userData) {
            setTechSkills(user?.['Tech-skills'] || userData['Tech-skills'] || {});
            setSoftSkills(user?.['Soft-skills'] || userData['Soft-skills'] || []);
            setProjects(user?.projects || userData.projects || []);
            setName(user?.name || userData.name || 'N/A');
            setEmail(user?.email || userData.email || 'N/A');
            setUsn(user?.USN || userData?.USN || 'N/A');
            setPrevMonthPoints(user?.prev_month_points || userData?.prev_month_points || 0);
            setTotalPoints(user?.points || userData?.points || 0);
            setSocialProfiles(user?.['Social_profiles'] || userData['Social_profiles'] || []);

            if (!user?.projects && !userData.projects) {
                fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usn: user?.USN || userData.USN, batch_id: user?.batch_id || userData.batch_id })
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
    }, [user, userData, apiConfig]);

    useEffect(() => {
        const fetchBatchName = async () => {
            try {
                const batchId = readOnly ? user?.batch_id : userData?.batch_id;
                if (!batchId) {
                    setBatchName('No Batch ID');
                    return;
                }
                const response = await fetch(`${apiConfig.baseUrl}/get_batch_name`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ batch_id: batchId })
                });
                const data = await response.json();
                if (data.status === 'success' && data.batch_name) {
                    setBatchName(data.batch_name);
                } else {
                    setBatchName(user?.batch_name || 'N/A');
                }
            } catch (err) {
                setBatchName(user?.batch_name || 'N/A');
            }
        };
        fetchBatchName();
    }, [user, userData, apiConfig, readOnly]);

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

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="header-content">
                    <h1>{name}</h1>
                    <div className="user-details">
                        <p className="user-usn">USN: {usn}</p>
                        <span className="detail-separator">•</span>
                        <p className="user-batch">
                            Batch: {batchName === 'Loading...' ? <span className="loading-text">Loading...</span> : batchName}
                        </p>
                        <span className="detail-separator">•</span>
                        <p className="user-email">{email}</p>
                    </div>
                    {!readOnly && (
                        <button className="edit-profile-btn" onClick={() => setUpdateModalVisible(true)}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-value">{totalPoints}</span>
                    <span className="stat-label">Total Points</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{totalPoints - prevMonthPoints}</span>
                    <span className="stat-label">Monthly Growth</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{Object.keys(techSkills).length}</span>
                    <span className="stat-label">Tech Skills</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{softSkills.length}</span>
                    <span className="stat-label">Soft Skills</span>
                </div>
            </div>
            <div className="main-content">
                <div className="section skills-overview">
                    <h2>Skills Overview</h2>
                    <div className="skills-container">
                        <div className="tech-skills">
                            <SkillProgress skillsData={techSkills} type="tech" usedSkills={usedSkills} />
                        </div>
                        <div className="soft-skills">
                            <SkillProgress skillsData={softSkills} type="soft" usedSkills={usedSkills} />
                        </div>
                    </div>
                </div>
                <div className="section social-section">
                    <h2>Social Profiles</h2>
                    <div className="social-links">
                        {socialProfiles.map((profile, index) => (
                            <a key={index} href={profile.link} target="_blank" rel="noopener noreferrer" className="social-link">
                                <span>{profile.Social_profile_name}</span>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="section recommendations-section">
                    <h2>Recommended Skills</h2>
                    <SkillRecommendations
                        userSkills={techSkills}
                        techSkillPoints={techSkillPoints}
                        projectSkills={projects.flatMap(p => p.skills_needed || [])}
                    />
                </div>
                <div className="section achievements-section">
                    <h2>Achievements</h2>
                    <Achievements userData={readOnly ? user : userData} />
                </div>
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
        </div>
    );
};

export default ProfilePage;