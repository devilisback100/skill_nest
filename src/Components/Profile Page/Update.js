import React, { useState } from 'react';
import './Update.css';

function Update({ userData, setUserData, closeModal, techSkillPoints, softSkillsPoints }) {
    const [email, setEmail] = useState(userData.email || '');
    const [softSkills, setSoftSkills] = useState(userData['Soft-skills'] || []);
    const [techSkills, setTechSkills] = useState(userData['Tech-skills'] || {});
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

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const calculateTotalPoints = () => {
                let totalSoftSkillPoints = softSkills.reduce(
                    (sum, skill) => sum + (softSkillsPoints[skill] || 0),
                    0
                );
                let totalTechSkillPoints = Object.keys(techSkills).reduce(
                    (sum, skill) => sum + (techSkillPoints[skill] || 0),
                    0
                );
                return totalSoftSkillPoints + totalTechSkillPoints;
            };
            const updatedPoints = calculateTotalPoints();
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
            if (email !== userData.email) {
                await updateUserData('update_email', { usn: userData.USN, password: userData.password, new_email: email });
            }
            if (JSON.stringify(softSkills) !== JSON.stringify(userData['Soft-skills'])) {
                await updateUserData('update_soft_skills', { usn: userData.USN, password: userData.password, new_soft_skills: softSkills });
            }
            if (JSON.stringify(techSkills) !== JSON.stringify(userData['Tech-skills'])) {
                await updateUserData('update_tech_skills', { usn: userData.USN, password: userData.password, new_tech_skills: techSkills });
            }
            await updateUserData('update_points', { usn: userData.USN, password: userData.password, new_points: updatedPoints });
            alert('Profile updated successfully!');
            setUserData({
                ...userData,
                email,
                'Soft-skills': softSkills,
                'Tech-skills': techSkills,
                points: updatedPoints,
            });
            closeModal();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-container">
            <div className="update-modal">
                <h3>Update Profile</h3>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                <h4>Select Soft Skills</h4>
                <div className="skills-selector">
                    <select
                        value={newSoftSkill}
                        onChange={(e) => setNewSoftSkill(e.target.value)}
                    >
                        <option value="">Select a soft skill</option>
                        {Object.keys(softSkillsPoints).map((skill, index) => (
                            <option key={index} value={skill}>
                                {skill}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => handleAddSoftSkill(newSoftSkill)}>Add Soft Skill</button>
                </div>
                <div className="skills-list">
                    {softSkills.map((skill, index) => (
                        <span key={index} className="skill-item">
                            {skill}
                            <button onClick={() => handleRemoveSoftSkill(skill)}>Remove</button>
                        </span>
                    ))}
                </div>
                <h4>Select Tech Skills</h4>
                <div className="skills-selector">
                    <select
                        value={newTechSkill}
                        onChange={(e) => setNewTechSkill(e.target.value)}
                    >
                        <option value="">Select a tech skill</option>
                        {Object.keys(techSkillPoints).map((skill, index) => (
                            <option key={index} value={skill}>
                                {skill}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => handleAddTechSkill(newTechSkill)}>Add Tech Skill</button>
                </div>
                <div className="skills-list">
                    {Object.keys(techSkills).map((skill, index) => (
                        <span key={index} className="skill-item">
                            {skill}
                            <button onClick={() => handleRemoveTechSkill(skill)}>Remove</button>
                        </span>
                    ))}
                </div>
                <div className="points">
                    <span>Total Points: {calculateTotalPoints()}</span>
                </div>
                <div className="buttons">
                    <button onClick={handleUpdateProfile} disabled={loading}>
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button className="cancel-button" onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Update;
