import React, { useState } from 'react';
import './Update.css';

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
                const response = await fetch(`https://skill-nest-backend.onrender.com/${route}`, {
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
                updatePromises.push(updateUserData('update_email', { usn: userData.USN, password: userData.password, new_email: email }));
            }
            if (JSON.stringify(softSkills) !== JSON.stringify(userData['Soft-skills'])) {
                updatePromises.push(updateUserData('update_soft_skills', { usn: userData.USN, password: userData.password, new_soft_skills: softSkills }));
            }
            if (JSON.stringify(techSkills) !== JSON.stringify(userData['Tech-skills'])) {
                updatePromises.push(updateUserData('update_tech_skills', { usn: userData.USN, password: userData.password, new_tech_skills: techSkills }));
            }
            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    throw new Error('New passwords do not match');
                }
                updatePromises.push(updateUserData('update_password', {
                    usn: userData.USN,
                    old_password: currentPassword,
                    new_password: newPassword
                }));
            }
            if (JSON.stringify(socialProfiles) !== JSON.stringify(userData['Social_profiles'])) {
                updatePromises.push(updateUserData('update_social_profiles', {
                    usn: userData.USN,
                    password: userData.password,
                    new_social_profiles: socialProfiles
                }));
            }
            updatePromises.push(updateUserData('update_points', { usn: userData.USN, password: userData.password, new_points: updatedPoints }));
            await Promise.all(updatePromises);
            alert('Profile updated successfully!');
            setUserData({
                ...userData,
                email,
                'Soft-skills': softSkills,
                'Tech-skills': techSkills,
                'Social_profiles': socialProfiles,
                points: updatedPoints,
                achievements: updatedAchievements,
            });
            closeModal();
        } catch (error) {
            alert(error.message || 'An error occurred while updating');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-container">
            <div className="update-modal">
                {/* Basic Information Section */}
                <div className="update-section">
                    <h3>Update Profile</h3>
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

                <div className="update-section">
                    <h4>Change Password</h4>
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

                <div className="update-section">
                    <h4>Social Profiles</h4>
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
                    </div>
                    <button onClick={handleAddSocialProfile}>Add Social Profile</button>
                    <div className="social-profiles-list">
                        {socialProfiles.map((profile, index) => (
                            <div key={index} className="skill-item">
                                <span>{profile.Social_profile_name}</span>
                                <button onClick={() => handleRemoveSocialProfile(profile.Social_profile_name)}>×</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="update-section">
                    <h4>Skills</h4>
                    <div className="skills-group">
                        <h5>Technical Skills</h5>
                        <div className="skills-selector">
                            <select
                                value={newTechSkill}
                                onChange={(e) => setNewTechSkill(e.target.value)}
                            >
                                <option value="">Select a tech skill</option>
                                {Object.keys(techSkillPoints).map((skill, index) => (
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
                        <div className="skills-selector">
                            <select
                                value={newSoftSkill}
                                onChange={(e) => setNewSoftSkill(e.target.value)}
                            >
                                <option value="">Select a soft skill</option>
                                {Object.keys(softSkillsPoints).map((skill, index) => (
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
        </div>
    );
}

export default Update;