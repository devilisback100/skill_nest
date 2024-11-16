import React, { useState, useEffect } from 'react';
import './Profile_page.css';
import Update from './Update'; // Import the Update component

const ProfilePage = ({ userData, setUserData }) => {
    const [name, setName] = useState(userData?.name || 'N/A');
    const [email, setEmail] = useState(userData?.email || 'N/A');
    const [usn, setUsn] = useState(userData?.usn || 'N/A');
    const [prevMonthPoints, setPrevMonthPoints] = useState(userData?.prev_month_points || 0);
    const [totalPoints, setTotalPoints] = useState(userData?.points || 0);
    const [techSkills, setTechSkills] = useState(userData?.techSkills || {}); // Directly use userData for techSkills
    const [softSkills, setSoftSkills] = useState(userData?.softSkills || []); // Directly use userData for softSkills
    const [updateModalVisible, setUpdateModalVisible] = useState(false);

    // Log userData to confirm it's being passed properly
    console.log(userData);

    // If userData is passed correctly, update the state
    useEffect(() => {
        if (userData) {
            setTechSkills(userData['Tech-skills'] || {});
            setSoftSkills(userData['Soft-skills'] || []);
            setName(userData.name || 'N/A');
            setEmail(userData.email || 'N/A');
            setUsn(userData.USN || 'N/A');
            setPrevMonthPoints(userData.prev_month_points || 0);
            setTotalPoints(userData.points || 0);
        }
    }, [userData]); // Re-run when userData changes

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

                {/* Display Tech Skills */}
                <div className="info">
                    <span>Tech Skills:</span>
                    <p>{techSkills && Object.keys(techSkills).length > 0
                        ? Object.entries(techSkills).map(([skill, points]) => `${skill}: ${points}`).join(', ')
                        : 'No tech skills added'}</p>
                </div>

                {/* Display Soft Skills */}
                <div className="info">
                    <span>Soft Skills:</span>
                    <p>{softSkills && softSkills.length > 0
                        ? softSkills.join(', ')
                        : 'No soft skills added'}</p>
                </div>

                <button onClick={() => setUpdateModalVisible(true)}>Edit Profile</button>
            </div>

            {/* Update Modal */}
            {updateModalVisible && (
                <Update
                    userData={userData}
                    setUserData={setUserData}
                    closeModal={() => setUpdateModalVisible(false)}
                />
            )}
        </div>
    );
};

export default ProfilePage;
