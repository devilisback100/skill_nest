import { createContext } from 'react';
import { API_BASE_URL } from '../config';

export const ApiContext = createContext(null);

const apiConfig = {
    baseUrl: API_BASE_URL,
    endpoints: {
        login: '/check_usn_password',
        projects: '/get_projects',
        addProject: '/add_project',
        updateEmail: '/update_email',
        updateSoftSkills: '/update_soft_skills',
        updateTechSkills: '/update_tech_skills',
        updatePassword: '/update_password',
        updateSocialProfiles: '/update_social_profiles',
        updatePoints: '/update_points',
        getUserGrowth: '/get_user_growth',
        getBatchName: '/get_batch_name'
    }
};

export default apiConfig;
