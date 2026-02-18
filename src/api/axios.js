import axios from "axios";

// Get baseURL from localStorage or use default
const getStoredBaseURL = () => {
    const stored = localStorage.getItem('fhirBaseURL');
    return stored || "https://fhir-bootcamp.medblocks.com/fhir";
};

const api = axios.create({
    baseURL: getStoredBaseURL()
});

// Function to update baseURL dynamically
export const updateBaseURL = (newBaseURL) => {
    api.defaults.baseURL = newBaseURL;
    localStorage.setItem('fhirBaseURL', newBaseURL);
};

// Initialize from localStorage on module load
api.defaults.baseURL = getStoredBaseURL();

export default api;
