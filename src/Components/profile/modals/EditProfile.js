import React, { useState, useContext } from 'react';
import './Update.css';
import { ApiContext } from '../../contexts/ApiContext';
import CustomAlert from '../CustomAlert/CustomAlert';
import '../../../styles/components/profile/modals.css';

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
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
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
            if (JSON.stringify(socialProfiles) !== JSON.stringify(userData['Social_profiles'])) {
                updatePromises.push(updateUserData('updateSocialProfiles', { usn: userData.USN, password: userData.password, batch_id: userData.batch_id, new_social_profiles: socialProfiles }));
            }
            if (newPassword && confirmPassword && newPassword === confirmPassword) {
                updatePromises.push(updateUserData('updatePassword', { usn: userData.USN, password: userData.password, batch_id: userData.batch_id, new_password: newPassword }));
            }
            const results = await Promise.all(updatePromises);
            setUserData({
                ...userData,
                email,
                'Soft-skills': softSkills,
                'Tech-skills': techSkills,
                'Social_profiles': socialProfiles,
                points: updatedPoints,
                achievements: updatedAchievements,
            });
            setAlertMessage('Profile updated successfully');
            setShowAlert(true);
        } catch (err) {
            setAlertMessage(err.message);
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-modal">
            {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
            <div className="update-modal-content">
                <h2>Update Profile</h2>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Soft Skills:</label>
                    <div className="skills-list">
                        {softSkills.map((skill, index) => (
                            <div key={index} className="skill-item">
                                {skill}
                                <button onClick={() => handleRemoveSoftSkill(skill)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <input type="text" value={newSoftSkill} onChange={(e) => setNewSoftSkill(e.target.value)} />
                    <button onClick={() => handleAddSoftSkill(newSoftSkill)}>Add Soft Skill</button>
                </div>
                <div className="form-group">
                    <label>Tech Skills:</label>
                    <div className="skills-list">
                        {Object.keys(techSkills).map((skill, index) => (
                            <div key={index} className="skill-item">
                                {skill}
                                <button onClick={() => handleRemoveTechSkill(skill)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <input type="text" value={newTechSkill} onChange={(e) => setNewTechSkill(e.target.value)} />
                    <button onClick={() => handleAddTechSkill(newTechSkill)}>Add Tech Skill</button>
                </div>
                <div className="form-group">
                    <label>Social Profiles:</label>
                    <div className="social-profiles-list">
                        {socialProfiles.map((profile, index) => (
                            <div key={index} className="social-profile-item">
                                {profile.Social_profile_name}: {profile.link}
                                <button onClick={() => handleRemoveSocialProfile(profile.Social_profile_name)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <input type="text" value={newSocialPlatform} onChange={(e) => setNewSocialPlatform(e.target.value)} placeholder="Platform" />
                    <input type="text" value={newSocialLink} onChange={(e) => setNewSocialLink(e.target.value)} placeholder="Link" />
                    <button onClick={handleAddSocialProfile}>Add Social Profile</button>
                </div>
                <div className="form-group">
                    <label>New Password:</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Current Password:</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <button onClick={handleUpdateProfile} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
                <button onClick={closeModal}>Cancel</button>
            </div>
        </div>
    );
}

export default Update;