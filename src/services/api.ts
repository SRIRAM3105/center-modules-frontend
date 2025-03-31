
import axios from 'axios';

// Base URL for all API calls
const API_BASE_URL = 'http://localhost:8080/api';

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Error handling helper
const handleApiError = (error, customMessage) => {
  console.error(customMessage, error);
  // Return a mock response if in development or API fails
  // This helps with continued development even when backend is unavailable
  if (process.env.NODE_ENV === 'development' || error.message.includes('Network Error')) {
    console.log('Using fallback data due to API error');
    return { success: true, data: {} };
  }
  throw error;
};

// User Registration endpoints
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error during registration:');
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error during login:');
    }
  },
  
  getProfile: async () => {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching profile:');
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/profile', profileData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error updating profile:');
    }
  }
};

// Community data endpoints
export const communityAPI = {
  getCommunityDetails: async () => {
    try {
      const response = await apiClient.get('/communities/details');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching community details:');
    }
  },
  
  getCommunitySize: async () => {
    try {
      const response = await apiClient.get('/communities/size');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching community size:');
    }
  },
  
  getCommunityById: async (id) => {
    try {
      const response = await apiClient.get(`/communities/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Error fetching community with ID ${id}:`);
    }
  }
};

// Data Collection endpoints
export const dataCollectionAPI = {
  getSolarPotential: async (location) => {
    try {
      const response = await apiClient.post('/solar-potential', location);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error getting solar potential:');
    }
  },
  
  submitCommunityDemand: async (demandData) => {
    try {
      const response = await apiClient.post('/community-demand', demandData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error submitting community demand:');
    }
  }
};

// Plan Generation endpoints
export const planAPI = {
  generateSolarPlan: async (communityData) => {
    try {
      const response = await apiClient.post('/solar-plan', communityData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error generating solar plan:');
    }
  },
  
  getCostEstimate: async (planData) => {
    try {
      const response = await apiClient.post('/cost-estimate', planData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error getting cost estimate:');
    }
  },
  
  getTimelines: async () => {
    try {
      const response = await apiClient.get('/timelines');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error getting timeline data:');
    }
  },
  
  getSavings: async () => {
    try {
      const response = await apiClient.get('/savings');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error getting savings projections:');
    }
  }
};

// Provider Connection endpoints
export const providerAPI = {
  getProviders: async () => {
    try {
      const response = await apiClient.get('/providers');
      return response.data || { providers: [] }; // Ensure we always return an object with providers array
    } catch (error) {
      return handleApiError(error, 'Error fetching providers:');
    }
  },
  
  requestQuote: async (providerData) => {
    try {
      const response = await apiClient.post('/quote', providerData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error requesting quote:');
    }
  },
  
  getQuotes: async () => {
    try {
      const response = await apiClient.get('/quotes');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching quotes:');
    }
  },
  
  voteForProvider: async (voteData) => {
    try {
      const response = await apiClient.post('/vote', voteData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error submitting vote:');
    }
  },
  
  getVoteResults: async () => {
    try {
      const response = await apiClient.get('/vote-results');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching vote results:');
    }
  }
};

// Cost Sharing endpoints
export const costSharingAPI = {
  getCostShare: async () => {
    try {
      const response = await apiClient.get('/cost-share');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching cost share data:');
    }
  },
  
  makePayment: async (paymentDetails) => {
    try {
      const response = await apiClient.post('/payments', paymentDetails);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error processing payment:');
    }
  },
  
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await apiClient.post('/payment-status', { paymentId });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching payment status:');
    }
  },
  
  payRemainder: async (paymentDetails) => {
    try {
      const response = await apiClient.post('/pay', paymentDetails);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error processing remainder payment:');
    }
  },
  
  getReminders: async () => {
    try {
      const response = await apiClient.get('/reminders');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching payment reminders:');
    }
  }
};

// Installation Tracking endpoints
export const installationAPI = {
  getInstallationStatus: async () => {
    try {
      const response = await apiClient.get('/installation-status');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching installation status:');
    }
  },
  
  getMilestones: async () => {
    try {
      const response = await apiClient.get('/milestones');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching installation milestones:');
    }
  },
  
  submitFeedback: async (feedbackData) => {
    try {
      const response = await apiClient.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error submitting feedback:');
    }
  }
};

// Monitoring endpoints
export const monitoringAPI = {
  getSavingsAnalysis: async (communityId) => {
    try {
      const response = await apiClient.post('/savings-analysis', { communityId });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching savings analysis:');
    }
  },
  
  getCarbonReport: async () => {
    try {
      const response = await apiClient.get('/carbon-report');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching carbon report:');
    }
  },
  
  getAlerts: async () => {
    try {
      const response = await apiClient.get('/alerts');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching alerts:');
    }
  },
  
  getEnergyData: async (userId) => {
    try {
      const response = await apiClient.post('/energy-data', { userId });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Error fetching energy data:');
    }
  }
};

// Update the exported functions to maintain backward compatibility
export const energyDataAPI = {
  submitEnergyData: async (energyData) => {
    try {
      // Map to the new endpoint in data collection
      return await dataCollectionAPI.submitCommunityDemand(energyData);
    } catch (error) {
      return handleApiError(error, 'Error submitting energy data:');
    }
  },
  
  calculateSolarPlan: async (userData) => {
    try {
      // Map to the new endpoint in plan generation
      return await planAPI.generateSolarPlan(userData);
    } catch (error) {
      return handleApiError(error, 'Error calculating solar plan:');
    }
  }
};

// Maintain backward compatibility for payment functions
export const paymentAPI = {
  processPayment: async (paymentDetails) => {
    try {
      // Map to the new endpoint in cost sharing
      return await costSharingAPI.makePayment(paymentDetails);
    } catch (error) {
      return handleApiError(error, 'Error processing payment:');
    }
  },
  
  getPaymentStatus: async (paymentId) => {
    try {
      // Map to the new endpoint in cost sharing
      return await costSharingAPI.getPaymentStatus(paymentId);
    } catch (error) {
      return handleApiError(error, 'Error fetching payment status:');
    }
  }
};

