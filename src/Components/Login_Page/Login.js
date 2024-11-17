import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUserData }) {
    const [usn, setUsn] = useState('');
    const [password, setPassword] = useState('');
    const [newUserModal, setNewUserModal] = useState(false); // Modal for adding a new user
    const [adminUSN, setAdminUSN] = useState(''); // Admin USN for validation
    const [adminPassword, setAdminPassword] = useState('');
    const [newUserData, setNewUserData] = useState({
        USN: '',
        password: '',
        name: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('https://skill-nest-backend.onrender.com/check_usn_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usn, password }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setUserData(data.data);
                navigate('/profile');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error connecting to the server.');
        }
    };

    const handleNewUserSubmit = async () => {
        try {
            setLoading(true);

            // Add default properties to the new user data
            const userPayload = {
                ...newUserData,
                profile_photo: 'path/to/profile/photo.jpg',
                points: 0,
                prev_month_points: 0,
                admin: false,
                'Soft-skills': [],
                'Tech-skills': {},
            };

            const response = await fetch('https://skill-nest-backend.onrender.com/add_new_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_usn: adminUSN,
                    current_password: adminPassword,
                    new_user_data: userPayload,
                }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                alert('New user added successfully!');
                setNewUserModal(false);
                setNewUserData({
                    USN: '',
                    password: '',
                    name: '',
                    email: '',
                });
            } else {
                setError(data.message);
            }
        } catch (err) {

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login</h1>
                <input
                    type="text"
                    placeholder="USN"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
                <button onClick={() => setNewUserModal(true)}>New User</button>
                {error && <p className="error">{error}</p>}
            </div>

            {/* Modal for New User */}
            {newUserModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Admin Validation</h2>
                        <input
                            type="text"
                            placeholder="Admin USN"
                            value={adminUSN}
                            onChange={(e) => setAdminUSN(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Admin Password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        <h3>New User Details</h3>
                        <input
                            type="text"
                            placeholder="New User USN"
                            value={newUserData.USN}
                            onChange={(e) =>
                                setNewUserData((prev) => ({ ...prev, USN: e.target.value }))
                            }
                        />
                        <input
                            type="password"
                            placeholder="New User Password"
                            value={newUserData.password}
                            onChange={(e) =>
                                setNewUserData((prev) => ({ ...prev, password: e.target.value }))
                            }
                        />
                        <input
                            type="text"
                            placeholder="New User Name"
                            value={newUserData.name}
                            onChange={(e) =>
                                setNewUserData((prev) => ({ ...prev, name: e.target.value }))
                            }
                        />
                        <input
                            type="email"
                            placeholder="New User Email"
                            value={newUserData.email}
                            onChange={(e) =>
                                setNewUserData((prev) => ({ ...prev, email: e.target.value }))
                            }
                        />
                        <button onClick={handleNewUserSubmit} disabled={loading}>
                            {loading ? 'Adding...' : 'Add User'}
                        </button>
                        <button onClick={() => setNewUserModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
