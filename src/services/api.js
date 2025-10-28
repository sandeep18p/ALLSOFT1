import axios from 'axios';

const API_BASE_URL = 'https://apis.allsoft.co/api/documentManagement';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API methods
export const generateOTP = async (mobileNumber) => {
  try {
    const response = await api.post('/generateOTP', { mobile_number: mobileNumber });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateOTP = async (mobileNumber, otp) => {
  try {
    const response = await api.post('/validateOTP', {
      mobile_number: mobileNumber,
      otp: otp,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadDocument = async (file, data) => {
  try {
    debugger;
    const formData = new FormData();
    formData.append('file', file);
    console.log('Upload Document File:', file);
    console.log('Upload Document Data:', data);
    // Send data as JSON string matching Postman format
    formData.append('data', JSON.stringify(data));
    console.log('Upload Document Form Data:', formData);
    const response = await axios.post(`${API_BASE_URL}/saveDocumentEntry`, formData, {
      headers: {
        token: localStorage.getItem('authToken'),
      },
    });
    console.log('Upload Document Response:', response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchDocuments = async (searchParams) => {
  debugger
  console.log('Search Document Params:', searchParams);
  try {
    const response = await api.post('/searchDocumentEntry', searchParams);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDocumentTags = async (term = '') => {
  try {
    const response = await api.post('/documentTags', { term });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;

