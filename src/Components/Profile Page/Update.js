import React, { useState } from 'react';
import './Update.css';

function Update({ userData, setUserData, closeModal }) {
    const [email, setEmail] = useState(userData.email || '');
    const [softSkills, setSoftSkills] = useState(userData['Soft-skills'] || []);
    const [techSkills, setTechSkills] = useState(userData['Tech-skills'] || {});
    const [newSoftSkill, setNewSoftSkill] = useState('');
    const [newTechSkill, setNewTechSkill] = useState('');
    const [loading, setLoading] = useState(false);

    // List of available tech skills with points
    const techSkillPoints = {
        "JavaScript": 60,
        "React.js": 70,
        "Python": 70,
        "Node.js": 75,
        "Java (Android)": 60,
        "Kotlin": 70,
        "Swift (iOS)": 65,
        "Flutter": 80,
        "C#": 65,
        "C++": 75,
        "Unity": 80,
        "Unreal Engine": 85,
        "MongoDB": 70,
        "SQL": 60,
        "Docker": 75,
        "Kubernetes": 80,
        "AWS": 85,
        "Azure": 80,
        "GitHub": 40,
        "Git": 45,
        "Firebase": 70,
        "TensorFlow": 80,
        "PyTorch": 85,
        "Scikit-learn": 65,
        "Pandas": 50,
        "NumPy": 45,
        "React Native": 75,
        "Next.js": 80,
        "Tailwind CSS": 50,
        "Bootstrap": 35,
        "GraphQL": 75,
        "TypeScript": 70,
        "Dart": 65,
        "XGBoost": 70,
        "LightGBM": 75,
        "GameMaker Studio": 55,
        "Jenkins": 70,
        "Blender": 60,
        "SASS": 45,
        "Three.js": 85,
        "Gatsby.js": 70,
        "Phaser": 65,
    };

    // List of soft skills (assuming points for each soft skill)
    const softSkillsPoints = {
        "Communication": 20,
        "Teamwork": 15,
        "Leadership": 25,
        "Problem-solving": 30,
        "Adaptability": 20,
        "Creativity": 25,
        "Time management": 15,
        "Critical thinking": 20,
        "Conflict resolution": 15,
        "Collaboration": 20,
        "Emotional Intelligence": 20,
        "Work ethic": 25,
        "Decision making": 20,
        "Organization": 15,
    };

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

        const updatedData = {
            email,
            softSkills,
            techSkills,
            // Add new points to the current points instead of replacing them
            totalPoints: userData.points + calculateTotalPoints(),
        };

        try {
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

            // Update the total points if it changes
            if (updatedData.totalPoints !== userData.points) {
                await updateUserData('update_points', { usn: userData.USN, password: userData.password, new_points: updatedData.totalPoints });
            }

            alert('Profile updated successfully!');
            setUserData({
                ...userData,
                email,
                'Soft-skills': softSkills,
                'Tech-skills': techSkills,
                points: updatedData.totalPoints
            });
            closeModal();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
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
