import React, { useState } from 'react';
import { useApiCall } from '../../hooks/useApiCall';

const CreateBatch = ({ userData }) => {
    const callApi = useApiCall();
    const [batchName, setBatchName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateBatch = async () => {
        try {
            const batchId = `batch_${Date.now()}`;
            const response = await callApi('create_batch', 'POST', {
                batch_id: batchId,
                batch_name: batchName,
                admin_usn: userData.USN
            });

            if (response.status === 'success') {
                setSuccess('Batch created successfully');
                setBatchName('');
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Error creating batch');
        }
    };

    return (
        <div>
            <h3>Create Batch</h3>
            <input
                type="text"
                placeholder="Batch Name"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
            />
            <button onClick={handleCreateBatch}>Create Batch</button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default CreateBatch;
