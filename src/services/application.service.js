import api from './api';

export const ApplicationService = {
  // Job Application endpoints
  applyForJob: async (applicationData) => {
    return api.post('/api/job-seeker/apply', applicationData);
  },
  
  // Job Provider Application Management
  getProviderApplications: async () => {
    console.log('Calling API: GET /api/provider/applications');
    try {
      const response = await api.get('/api/provider/applications');
      console.log('Provider applications response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching provider applications:', error);
      throw error;
    }
  },
  
  getApplicationsForJob: async (jobId) => {
    console.log(`Fetching applications for job ID: ${jobId}`);
    try {
      const response = await api.get(`/api/provider/jobs/${jobId}/applications`);
      return response;
    } catch (error) {
      console.error(`Error fetching applications for job ${jobId}:`, error);
      throw error;
    }
  },
  
  updateApplicationStatus: async (applicationId, status) => {
    console.log(`Updating application ${applicationId} status to ${status}`);
    try {
      const response = await api.put(`/api/provider/applications/${applicationId}/status`, { status });
      return response;
    } catch (error) {
      console.error(`Error updating application ${applicationId} status:`, error);
      throw error;
    }
  },
  
  getMyApplications: async () => {
    console.log('Calling API: GET /api/job-seeker/applications');
    try {
      const response = await api.get('/api/job-seeker/applications');
      console.log('API response:', response);
      return response;
    } catch (error) {
      console.error('API error details:', error);
      throw error;
    }
  },
  
  withdrawApplication: async (applicationId) => {
    console.log(`Withdrawing application with ID: ${applicationId}`);
    try {
      // Call the actual backend API endpoint
      const response = await api.put(`/api/job-seeker/applications/${applicationId}/withdraw`);
      console.log('Withdraw application response:', response);
      return response;
    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw error;
    }
  },
  
  getApplicationById: async (applicationId) => {
    return api.get(`/api/job-seeker/applications/${applicationId}`);
  },
  
  getMyApplicationsCount: async () => {
    return api.get('/api/job-seeker/applications/count');
  },
};

export default ApplicationService;
