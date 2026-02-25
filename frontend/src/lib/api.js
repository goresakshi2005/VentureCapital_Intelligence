import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export const getCompanies = async (params) => {
  const response = await api.get('/companies/', { params });
  return response.data.results;
};

export const getCompany = async (id) => {
  const response = await api.get(`/companies/${id}/`);
  return response.data;
};

export const enrichCompany = async (url) => {
  const response = await api.post('/enrich/', { url });
  return response.data;
};

export const addCompany = async (url) => {
  const response = await api.post('/add-company/', { url });
  return response.data;
};

export const deleteCompany = async (id) => {
  const response = await api.delete(`/companies/${id}/`);
  return response.data;
};