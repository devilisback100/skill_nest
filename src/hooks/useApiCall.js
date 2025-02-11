import { useContext } from 'react';
import { ApiContext } from '../contexts/ApiContext';

export const useApiCall = () => {
    const apiConfig = useContext(ApiContext);

    const callApi = async (endpoint, method, body) => {
        const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints[endpoint]}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return response.json();
    };

    return callApi;
};
