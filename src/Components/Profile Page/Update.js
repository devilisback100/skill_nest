import React, { useState, useContext } from 'react';
import './Update.css';
import { ApiContext } from '../../contexts/ApiContext';
import CustomAlert from '../CustomAlert/CustomAlert'; // Import CustomAlert

function Update({ userData, setUserData, closeModal, techSkillPoints, softSkillsPoints }) {
    const [email, setEmail] = useState(userData.email || '');
    const [softSkills, setSoftSkills] = useState(userData['Soft-skills'] || []);
    const [techSkills, setTechSkills] = useState(userData['Tech-skills'] || {});
    const [socialProfiles, setSocialProfiles] = useState(userData['Social_profiles'] || []);
    const [newSocialPlatform, setNewSocialPlatform] = useState('');
    const [newSocialLink, setNewSocialLink] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newSoftSkill, setNewSoftSkill] = useState('');
    const [newTechSkill, setNewTechSkill] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(''); // Add state for alert message
    const [showAlert, setShowAlert] = useState(false); // Add state to control alert visibility
    const [expandedSections, setExpandedSections] = useState({
        basicInfo: false,
        password: false,
        social: false,
        skills: false
    });
    const [techSearchTerm, setTechSearchTerm] = useState("");
    const [softSearchTerm, setSoftSearchTerm] = useState("");
    const apiConfig = useContext(ApiContext);

    const calculateTotalPoints = () => {
        let total = 0;
        total += softSkills.reduce((sum, skill) => sum + (softSkillsPoints[skill] || 0), 0);
        for (const techSkill in techSkills) {
            total += techSkillPoints[techSkill] || 0;
        }
        return total;
    };

    const calculateAchievements = () => {
        const achievements = [];
        const totalPoints = calculateTotalPoints();
        const totalSkills = softSkills.length + Object.keys(techSkills).length;
        const projectCount = userData.projects ? userData.projects.length : 0;

        if (totalPoints >= 1000) achievements.push('Skills Master');
        if (totalSkills >= 10) achievements.push('Jack of All Trades');
        if (projectCount >= 5) achievements.push('Project Guru');
        if (totalSkills >= 20 && projectCount >= 5) achievements.push('Skillful Project Manager');
        if (totalSkills >= 45) achievements.push('Skill Legend');

        return achievements;
    };

    const handleAddSoftSkill = (skill) => {
        if (skill && !softSkills.includes(skill)) {
            setSoftSkills([...softSkills, skill]);
        }
    };

    const handleRemoveSoftSkill = (skill) => {
        setSoftSkills(softSkills.filter((s) => s !== skill));
    };

    const handleAddTechSkill = (skill) => {
        if (skill && !techSkills[skill]) {
            setTechSkills({ ...techSkills, [skill]: techSkillPoints[skill] });
        }
    };

    const handleRemoveTechSkill = (skill) => {
        const updatedSkills = { ...techSkills };
        delete updatedSkills[skill];
        setTechSkills(updatedSkills);
    };

    const handleAddSocialProfile = () => {
        if (newSocialPlatform && newSocialLink) {
            const newProfile = { Social_profile_name: newSocialPlatform, link: newSocialLink };
            setSocialProfiles([...socialProfiles, newProfile]);
            setNewSocialPlatform('');
            setNewSocialLink('');
        }
    };

    const handleRemoveSocialProfile = (platform) => {
        setSocialProfiles(socialProfiles.filter(profile => profile.Social_profile_name !== platform));
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const updatedPoints = calculateTotalPoints();
            const updatedAchievements = calculateAchievements();
            const updateUserData = async (route, data) => {
                const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints[route]}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Something went wrong');
                }
                return result;
            };
            const updatePromises = [];
            if (email !== userData.email) {
                updatePromises.push(updateUserData('updateEmail', { usn: userData.USN, password: userData.password, batch_id: userData.batch_id, new_email: email }));
            }
            if (JSON.stringify(softSkills) !== JSON.stringify(userData['Soft-skills'])) {
                updatePromises.push(updateUserData('updateSoftSkills', { usn: userData.USN, password: userData.password, batch_id: userData.batch_id, new_soft_skills: softSkills }));
            }
            if (JSON.stringify(techSkills) !== JSON.stringify(userData['Tech-skills'])) {
                updatePromises.push(updateUserData('updateTechSkills', { usn: userData.USN, password: userData.password, batch_id: userData.batch_id, new_tech_skills: techSkills }));
            }
            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    throw new Error('New passwords do not match');
                }
                updatePromises.push(updateUserData('updatePassword', {
                    usn: userData.USN,
                    old_password: currentPassword,
                    batch_id: userData.batch_id,
                    new_password: newPassword
                }));
            }
            if (JSON.stringify(socialProfiles) !== JSON.stringify(userData['Social_profiles'])) {
                updatePromises.push(updateUserData('updateSocialProfiles', {
                    usn: userData.USN,
                    password: userData.password,
                    batch_id: userData.batch_id,
                    new_social_profiles: socialProfiles
                }));
            }
            updatePromises.push(updateUserData('updatePoints', { usn: userData.USN, password: userData.password, batch_id: userData.batch_id, new_points: updatedPoints }));
            await Promise.all(updatePromises);
            setAlertMessage('Profile updated successfully!'); // Set alert message
            setShowAlert(true); // Show alert
            setUserData({
                ...userData,
                email,
                'Soft-skills': softSkills,
                'Tech-skills': techSkills,
                'Social_profiles': socialProfiles,
                points: updatedPoints,
                achievements: updatedAchievements,
            });
        } catch (error) {
            setAlertMessage(error.message || 'An error occurred while updating'); // Set alert message
            setShowAlert(true); // Show alert
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
        closeModal(); // Close the modal after the alert is acknowledged
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const filterSkills = (skills, searchTerm) => {
        return Object.keys(skills).filter(skill =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <div className="update-container">
            <div className="update-modal">
                {/* Basic Information Section */}
                <div className="update-section">
                    <h3>Update Profile</h3>
                    <div className={`section-content collapsible-content ${expandedSections.basicInfo ? 'expanded' : 'collapsed'}`}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    <button
                        className="see-more-button"
                        onClick={() => toggleSection('basicInfo')}
                    >
                        {expandedSections.basicInfo ? 'See Less' : 'See More'}
                    </button>
                </div>

                <div className="update-section">
                    <h4>Change Password</h4>
                    <div className={`section-content collapsible-content ${expandedSections.password ? 'expanded' : 'collapsed'}`}>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        className="see-more-button"
                        onClick={() => toggleSection('password')}
                    >
                        {expandedSections.password ? 'See Less' : 'See More'}
                    </button>
                </div>

                <div className="update-section">
                    <h4>Social Profiles</h4>
                    <div className={`section-content collapsible-content ${expandedSections.social ? 'expanded' : 'collapsed'}`}>
                        <div className="social-profiles-form">
                            <input
                                type="text"
                                placeholder="Platform (e.g., LinkedIn)"
                                value={newSocialPlatform}
                                onChange={(e) => setNewSocialPlatform(e.target.value)}
                            />
                            <input
                                type="url"
                                placeholder="Profile URL"
                                value={newSocialLink}
                                onChange={(e) => setNewSocialLink(e.target.value)}
                            />
                            <button onClick={handleAddSocialProfile}>Add</button>
                        </div>
                        <div className="social-profiles-list">
                            {socialProfiles.map((profile, index) => (
                                <div key={index} className="skill-item">
                                    <span>{profile.Social_profile_name}</span>
                                    <button onClick={() => handleRemoveSocialProfile(profile.Social_profile_name)}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        className="see-more-button"
                        onClick={() => toggleSection('social')}
                    >
                        {expandedSections.social ? 'See Less' : 'See More'}
                    </button>
                </div>

                <div className="update-section">
                    <h4>Skills</h4>
                    <div className={`section-content collapsible-content ${expandedSections.skills ? 'expanded' : 'collapsed'}`}>
                        <div className="skills-group">
                            <h5>Technical Skills</h5>
                            <div className="skills-search">
                                <input
                                    type="text"
                                    placeholder="Search technical skills..."
                                    value={techSearchTerm}
                                    onChange={(e) => setTechSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="skills-selector">
                                <select
                                    value={newTechSkill}
                                    onChange={(e) => setNewTechSkill(e.target.value)}
                                >
                                    <option value="">Select a tech skill</option>
                                    {filterSkills(techSkillPoints, techSearchTerm).map((skill, index) => (
                                        <option key={index} value={skill}>{skill}</option>
                                    ))}
                                </select>
                                <button onClick={() => handleAddTechSkill(newTechSkill)}>Add</button>
                            </div>
                            <div className="skills-list">
                                {Object.keys(techSkills).map((skill, index) => (
                                    <div key={index} className="skill-item">
                                        <span>{skill}</span>
                                        <button onClick={() => handleRemoveTechSkill(skill)}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="skills-group">
                            <h5>Soft Skills</h5>
                            <div className="skills-search">
                                <input
                                    type="text"
                                    placeholder="Search soft skills..."
                                    value={softSearchTerm}
                                    onChange={(e) => setSoftSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="skills-selector">
                                <select
                                    value={newSoftSkill}
                                    onChange={(e) => setNewSoftSkill(e.target.value)}
                                >
                                    <option value="">Select a soft skill</option>
                                    {filterSkills(softSkillsPoints, softSearchTerm).map((skill, index) => (
                                        <option key={index} value={skill}>{skill}</option>
                                    ))}
                                </select>
                                <button onClick={() => handleAddSoftSkill(newSoftSkill)}>Add</button>
                            </div>
                            <div className="skills-list">
                                {softSkills.map((skill, index) => (
                                    <div key={index} className="skill-item">
                                        <span>{skill}</span>
                                        <button onClick={() => handleRemoveSoftSkill(skill)}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        className="see-more-button"
                        onClick={() => toggleSection('skills')}
                    >
                        {expandedSections.skills ? 'See Less' : 'See More'}
                    </button>
                </div>

                <div className="points-display">
                    Total Points: {calculateTotalPoints()}
                </div>

                <div className="action-buttons">
                    <button
                        className="save-button"
                        onClick={handleUpdateProfile}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button className="cancel-button" onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </div>
            {showAlert && (
                <CustomAlert
                    message={alertMessage}
                    onClose={handleCloseAlert}
                />
            )}
        </div>
    );
}

export default Update;