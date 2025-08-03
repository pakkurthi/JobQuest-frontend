import api from './api';

export const JobService = {
  // Public endpoints
  getAllJobs: async (params) => {
    return api.get('/api/jobs/public/all', { params });
  },
  
  getFeaturedJobs: async () => {
    return api.get('/api/jobs/public/featured');
  },
  
  getJobById: async (id) => {
    return api.get(`/api/jobs/public/${id}`);
  },
  
  searchJobs: async (keyword, params) => {
    return api.get(`/api/jobs/public/search?keyword=${keyword}`, { params });
  },
  
  // Job Provider endpoints
  createJob: async (jobData) => {
    return api.post('/api/jobs/create', jobData);
  },
  
  updateJob: async (id, jobData) => {
    return api.put(`/api/jobs/${id}`, jobData);
  },
  
  deleteJob: async (id) => {
    return api.delete(`/api/jobs/${id}`);
  },
  
  getProviderJobs: async () => {
    return api.get('/api/jobs/my-jobs');
  },
};

export default JobService;
