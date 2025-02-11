import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { ApiContext } from '../../contexts/ApiContext';
import CustomAlert from '../CustomAlert/CustomAlert'; // Import CustomAlert

function Login({ setUserData }) {
    const [usn, setUsn] = useState('');
    const [password, setPassword] = useState('');
    const [batchId, setBatchId] = useState('');
    const [adminUSN, setAdminUSN] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminBatchId, setAdminBatchId] = useState(''); // Add this line
    const [newUserData, setNewUserData] = useState({
        USN: '',
        password: '',
        name: '',
        email: ''
        // Removed batch_id as it will come from admin's batch
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [newBatchData, setNewBatchData] = useState({
        batch_name: '',
        batch_id: '',
        admin_usn: '',
        admin_password: '',
        admin_name: '',
        admin_email: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'batch' or 'user'
    const [alertMessage, setAlertMessage] = useState(''); // Add state for alert message

    const navigate = useNavigate();
    const apiConfig = useContext(ApiContext);

    const handleLogin = async () => {
        try {
            setLoginLoading(true);
            const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.login}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usn, password, batch_id: batchId }),
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
            setLoginLoading(false);
        }
    };

    const handleNewUserSubmit = async () => {
        try {
            setLoading(true);
            const userPayload = {
                ...newUserData,
                profile_photo: '',
                points: 0,
                prev_month_points: 0,
                admin: false,
                'Soft-skills': [],
                'Tech-skills': {},
            };

            const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.addUserToBatch}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin_usn: adminUSN,
                    admin_password: adminPassword,
                    batch_id: adminBatchId,
                    new_user_data: userPayload
                }),
            });

            const data = await response.json();
            if (data.status === 'success') {
                setAlertMessage('New user added successfully!'); // Set alert message
                setShowModal(false);
                setNewUserData({
                    USN: '',
                    password: '',
                    name: '',
                    email: ''
                });
            } else {
                setAlertMessage(data.message); // Set alert message
            }
        } catch (err) {
            setAlertMessage('Error connecting to the server.'); // Set alert message
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBatch = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiConfig.baseUrl}/create_batch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBatchData)
            });

            const data = await response.json();
            if (data.status === 'success') {
                setAlertMessage('New batch created successfully!'); // Set alert message
                setShowModal(false);
                setNewBatchData({
                    batch_name: '',
                    batch_id: '',
                    admin_usn: '',
                    admin_password: '',
                    admin_name: '',
                    admin_email: ''
                });
            } else {
                setAlertMessage(data.message); // Set alert message
            }
        } catch (err) {
            setAlertMessage('Error creating batch.'); // Set alert message
        } finally {
            setLoading(false);
        }
    };

    const renderModalContent = () => {
        if (modalType === 'batch') {
            return (
                <>
                    <h2>Create New Batch</h2>
                    <input
                        type="text"
                        placeholder="Batch Name"
                        value={newBatchData.batch_name}
                        onChange={(e) => setNewBatchData(prev => ({ ...prev, batch_name: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Batch ID"
                        value={newBatchData.batch_id}
                        onChange={(e) => setNewBatchData(prev => ({ ...prev, batch_id: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Admin USN"
                        value={newBatchData.admin_usn}
                        onChange={(e) => setNewBatchData(prev => ({ ...prev, admin_usn: e.target.value }))}
                    />
                    <input
                        type="password"
                        placeholder="Admin Password"
                        value={newBatchData.admin_password}
                        onChange={(e) => setNewBatchData(prev => ({ ...prev, admin_password: e.target.value }))}
                    />
                    <input
                        type="text"
                        placeholder="Admin Name"
                        value={newBatchData.admin_name}
                        onChange={(e) => setNewBatchData(prev => ({ ...prev, admin_name: e.target.value }))}
                    />
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={newBatchData.admin_email}
                        onChange={(e) => setNewBatchData(prev => ({ ...prev, admin_email: e.target.value }))}
                    />
                    <button onClick={handleCreateBatch} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Batch'}
                    </button>
                </>
            );
        }

        return (
            <>
                <h2>Add New User</h2>
                <h3>Admin Validation</h3>
                <input
                    type="text"
                    placeholder="Admin Batch ID"
                    value={adminBatchId}
                    onChange={(e) => setAdminBatchId(e.target.value)}
                />
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
                    onChange={(e) => setNewUserData(prev => ({ ...prev, USN: e.target.value }))}
                />
                <input
                    type="password"
                    placeholder="New User Password"
                    value={newUserData.password}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                />
                <input
                    type="text"
                    placeholder="New User Name"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                    type="email"
                    placeholder="New User Email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                />
                <button onClick={handleNewUserSubmit} disabled={loading}>
                    {loading ? 'Adding...' : 'Add User'}
                </button>
            </>
        );
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Welcome to SkillNest</h1>
                    <p>Track, showcase, and improve your skills</p>
                </div>

                <div className="welcome-buttons">
                    <button
                        className="welcome-button"
                        onClick={() => {
                            setModalType('batch');
                            setShowModal(true);
                        }}
                    >
                        Create New Batch
                    </button>
                    <button
                        className="welcome-button"
                        onClick={() => {
                            setModalType('user');
                            setShowModal(true);
                        }}
                    >
                        Add New User
                    </button>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        id="batchId"
                        placeholder=" "
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                    />
                    <label htmlFor="batchId">Batch ID</label>
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
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {renderModalContent()}
                        <button className="cancel-button" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {alertMessage && (
                <CustomAlert
                    message={alertMessage}
                    onClose={() => setAlertMessage('')}
                />
            )}
        </div>
    );
}

export default Login;
