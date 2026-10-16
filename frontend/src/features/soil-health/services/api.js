import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || `${(import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')}/soil-health`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});


// Soil Samples

export const getSoilSamples = () => {
  return api.get("/soil");
};

export const getLatestSoilReading = () => {
  return api.get("/soil/latest");
};

export const getSoilSampleById = (id) => {
  return api.get(`/soil/${id}`);
};

export const createSoilSample = (data) => {
  return api.post("/soil", data);
};


// Fertility Analysis

export const analyzeSoil = (sampleId) => {
  return api.post(`/analysis/${sampleId}`);
};

export const getAnalysisResult = (sampleId) => {
  return api.get(`/analysis/${sampleId}`);
};


// IoT Device

export const getDeviceStatus = () => {
  return api.get("/device/status");
};

export const getLatestSensorReadings = () => {
  return api.get("/sensors/latest");
};


export default api;