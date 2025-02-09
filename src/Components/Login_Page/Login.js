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
    const [showPassword, setShowPassword] = useState(false);
    const [showAdminPassword, setShowAdminPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);  // Add this line

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setLoginLoading(true);  // Add this line
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
        } finally {
            setLoginLoading(false);  // Add this line
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
            setError('Error connecting to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Welcome to SkillNest</h1>
                    <p>Track, showcase, and improve your skills</p>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        id="usn"
                        placeholder=" "
                        value={usn}
                        onChange={(e) => setUsn(e.target.value)}
                    />
                    <label htmlFor="usn">USN</label>
                </div>

                <div className="input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="auth-buttons">
                    <button 
                        className="auth-button login-button" 
                        onClick={handleLogin}
                        disabled={loginLoading}
                    >
                        {loginLoading ? (
                            <div className="loader"></div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                    <button 
                        className="auth-button new-user-button" 
                        onClick={() => setNewUserModal(true)}
                    >
                        New User
                    </button>
                </div>
            </div>

            {newUserModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Admin Validation</h2>
                        <input
                            type="text"
                            placeholder="Admin USN"
                            value={adminUSN}
                            onChange={(e) => setAdminUSN(e.target.value)}
                        />
                        <div className="password-input-container">
                            <input
                                type={showAdminPassword ? "text" : "password"}
                                placeholder="Admin Password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowAdminPassword(!showAdminPassword)}
                            >
                                {showAdminPassword ? "👁️" : "👁"}
                            </button>
                        </div>
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
                        <button className="cancel-button" onClick={() => setNewUserModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
