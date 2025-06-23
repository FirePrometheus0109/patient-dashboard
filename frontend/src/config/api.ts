import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const deletePatient = async (patientId: string) => {
  const response = await api.delete(`/patients/${patientId}`);
  return response.data;
};