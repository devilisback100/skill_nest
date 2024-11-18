import React, { useState } from 'react';
import './Update.css';

function Update({ userData, setUserData, closeModal, techSkillPoints, softSkillsPoints }) {
    const [email, setEmail] = useState(userData.email || '');
    const [softSkills, setSoftSkills] = useState(userData['Soft-skills'] || []);
    const [techSkills, setTechSkills] = useState(userData['Tech-skills'] || {});
    const [newSoftSkill, setNewSoftSkill] = useState('');
    const [newTechSkill, setNewTechSkill] = useState('');
    const [loading, setLoading] = useState(false);


    // Calculate the total points for selected skills
    const calculateTotalPoints = () => {
        let total = 0;

        // Sum points for soft skills (array)
        total += softSkills.reduce((sum, skill) => sum + (softSkillsPoints[skill] || 0), 0);

        // Sum points for tech skills (object with key-value pairs)
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
            // Recalculate the total points based on the updated skills
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

            // Calculate the new total points
            const updatedPoints = calculateTotalPoints();

            // Update the database
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

            // Update email if changed
            if (email !== userData.email) {
                await updateUserData('update_email', { usn: userData.USN, password: userData.password, new_email: email });
            }

            // Update soft skills if changed
            if (JSON.stringify(softSkills) !== JSON.stringify(userData['Soft-skills'])) {
                await updateUserData('update_soft_skills', { usn: userData.USN, password: userData.password, new_soft_skills: softSkills });
            }

            // Update tech skills if changed
            if (JSON.stringify(techSkills) !== JSON.stringify(userData['Tech-skills'])) {
                await updateUserData('update_tech_skills', { usn: userData.USN, password: userData.password, new_tech_skills: techSkills });
            }

            // Update total points in the database
            await updateUserData('update_points', { usn: userData.USN, password: userData.password, new_points: updatedPoints });

            // Update the local state with the new data
            alert('Profile updated successfully!');
            setUserData({
                ...userData,
                email,
                'Soft-skills': softSkills,
                'Tech-skills': techSkills,
                points: updatedPoints, // Replace the previous points with the recalculated total points
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

                {/* Email Field */}
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />

                {/* Soft Skills Section */}
                <h4>Select Soft Skills</h4>
                <div className="skills-selector">
                    <select
                        value={newSoftSkill}
                        onChange={(e) => setNewSoftSkill(e.target.value)}
                    >
                        <option value="">Select a soft skill</option>
                        {Object.keys(softSkillsPoints).map((skill, index) => (
                            <option key={index} value={skill}>
                                {skill} - {softSkillsPoints[skill]} points
                            </option>
                        ))}
                    </select>
                    <button onClick={() => handleAddSoftSkill(newSoftSkill)}>Add Soft Skill</button>
                </div>

                {/* List of selected soft skills */}
                <div className="skills-list">
                    {softSkills.map((skill, index) => (
                        <span key={index} className="skill-item">
                            {skill}
                            <button onClick={() => handleRemoveSoftSkill(skill)}>Remove</button>
                        </span>
                    ))}
                </div>

                {/* Tech Skills Section */}
                <h4>Select Tech Skills</h4>
                <div className="skills-selector">
                    <select
                        value={newTechSkill}
                        onChange={(e) => setNewTechSkill(e.target.value)}
                    >
                        <option value="">Select a tech skill</option>
                        {Object.keys(techSkillPoints).map((skill, index) => (
                            <option key={index} value={skill}>
                                {skill} - {techSkillPoints[skill]} points
                            </option>
                        ))}
                    </select>
                    <button onClick={() => handleAddTechSkill(newTechSkill)}>Add Tech Skill</button>
                </div>

                {/* List of selected tech skills */}
                <div className="skills-list">
                    {Object.keys(techSkills).map((skill, index) => (
                        <span key={index} className="skill-item">
                            {skill}
                            <button onClick={() => handleRemoveTechSkill(skill)}>Remove</button>
                        </span>
                    ))}
                </div>

                {/* Total Points */}
                <div className="points">
                    <span>Total Points: {calculateTotalPoints()}</span>
                </div>

                {/* Action Buttons */}
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
