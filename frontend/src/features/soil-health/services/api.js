const API_BASE = import.meta.env.VITE_API_URL || `${(import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')}/soil-health`;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.detail || "API request failed");
      error.response = { data };
      throw error;
    }

    return { data };
  } finally {
    window.clearTimeout(timeout);
  }
}

const api = {
  get: path => request(path),
  post: (path, data) => request(path, {
    method: "POST",
    body: JSON.stringify(data),
  }),
};


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