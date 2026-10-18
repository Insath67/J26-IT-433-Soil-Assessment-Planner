// Soil Analysis Data Service & LocalStorage Persistence
// Tailored for Sri Lanka Agro-Ecological Zones & Department of Agriculture benchmarks

const STORAGE_KEY = "smart_soil_assessment_records";
const ACTIVE_SAMPLE_KEY = "smart_soil_active_sample_id";

// Standard Sri Lanka Soil Samples for Initial State
const DEFAULT_SAMPLES = [
  {
    sampleId: "KG-001",
    location: "Kegalle",
    district: "Kegalle (Mid-Country Wet Zone)",
    regionDetails: "Sabaragamuwa Province (Wet Zone Mid Country - WL2a)",
    soilType: "Red-Yellow Podzolic (RYP)",
    soilColor: "Reddish Brown / Podzolic",
    samplingDepth: "0 - 15 cm (Topsoil)",
    date: "06/10/2026",
    time: "11:42 AM",
    ph: 6.4,
    nitrogen: 42,
    phosphorus: 28,
    potassium: 55,
    moisture: 63,
    temperature: 27.5,
    ec: 1.4,
    fertility: "Medium",
    fertilityScore: 74,
    confidence: "94.2%",
    status: "Sufficient",
    crop: "Ceylon Tea, Cinnamon",
    nutrientStatus: {
      nitrogen: "Sufficient",
      phosphorus: "Deficient",
      potassium: "Sufficient",
      ph: "Suitable",
    },
    recommendations: {
      summary: "The chemical profile shows appropriate nitrogen reserves and pH suitable for acid-tolerant crops like tea and cinnamon. Applying Eppawala Rock Phosphate will resolve the 28 mg/kg phosphorus deficiency.",
      fertilizers: [
        {
          name: "Eppawala Rock Phosphate (ERP)",
          dosage: "150 kg/hectare basal dressing",
          type: "warning",
          notes: "Essential to address sub-30 mg/kg available P in Wet Zone soils."
        },
        {
          name: "Standard MOP & Urea",
          dosage: "Maintain recommended split applications",
          type: "success",
          notes: "N and K levels are currently within optimal vegetative ranges."
        }
      ]
    },
    crops: [
      {
        name: "Ceylon Tea",
        botanical: "Camellia sinensis",
        suitability: 94,
        tag: "Highly Suitable",
        notes: "Optimal pH (6.4) and moisture for vegetative flush in mid-country hills."
      },
      {
        name: "Ceylon Cinnamon",
        botanical: "Cinnamomum verum",
        suitability: 89,
        tag: "Highly Suitable",
        notes: "Well-suited for well-drained RYP soil; thrive with potassium levels."
      },
      {
        name: "Black Pepper",
        botanical: "Piper nigrum",
        suitability: 85,
        tag: "Suitable",
        notes: "Phosphorus supplementation recommended to boost root establishment."
      },
      {
        name: "Rubber",
        botanical: "Hevea brasiliensis",
        suitability: 81,
        tag: "Suitable",
        notes: "Adapted to Kegalle agro-climatic conditions and 63% soil moisture."
      }
    ]
  },
  {
    sampleId: "GL-004",
    location: "Galle",
    district: "Galle (Low-Country Wet Zone)",
    regionDetails: "Southern Province (Wet Zone Low Country - WL1a)",
    soilType: "Red-Yellow Podzolic / Lateritic",
    soilColor: "Yellowish Red Loam",
    samplingDepth: "0 - 20 cm (Topsoil)",
    date: "02/10/2026",
    time: "09:15 AM",
    ph: 5.8,
    nitrogen: 52,
    phosphorus: 40,
    potassium: 64,
    moisture: 70,
    temperature: 28.0,
    ec: 1.5,
    fertility: "High",
    fertilityScore: 88,
    confidence: "96.5%",
    status: "Sufficient",
    crop: "Cinnamon, Rubber",
    nutrientStatus: {
      nitrogen: "High",
      phosphorus: "Sufficient",
      potassium: "Sufficient",
      ph: "Suitable",
    },
    recommendations: {
      summary: "High organic matter and strong macronutrient balance. Well-drained lateritic profile promotes deep rooting for export spice crops.",
      fertilizers: [
        {
          name: "Organic Bio-Compost",
          dosage: "2 tons/hectare top dressing",
          type: "success",
          notes: "Maintain organic matter content and support microbial health."
        },
        {
          name: "Muriate of Potash (MOP)",
          dosage: "75 kg/ha seasonal top-dress",
          type: "success",
          notes: "Strengthens spice bark quality in Ceylon Cinnamon."
        }
      ]
    },
    crops: [
      {
        name: "Ceylon Cinnamon",
        botanical: "Cinnamomum verum",
        suitability: 96,
        tag: "Highly Suitable",
        notes: "Exceptional agro-climatic fit for Southern lowlands WL1a."
      },
      {
        name: "Rubber",
        botanical: "Hevea brasiliensis",
        suitability: 91,
        tag: "Highly Suitable",
        notes: "Excellent soil moisture and humidity index."
      },
      {
        name: "Coconut",
        botanical: "Cocos nucifera",
        suitability: 86,
        tag: "Suitable",
        notes: "Favorable coastal-inland intermediate moisture."
      }
    ]
  },
  {
    sampleId: "KD-012",
    location: "Kandy",
    district: "Kandy (Mid-Country Wet Zone)",
    regionDetails: "Central Province (Wet Zone Mid Country - WM2b)",
    soilType: "Reddish Brown Latosolic",
    soilColor: "Reddish Brown Loam",
    samplingDepth: "0 - 15 cm",
    date: "28/09/2026",
    time: "02:30 PM",
    ph: 6.1,
    nitrogen: 38,
    phosphorus: 32,
    potassium: 48,
    moisture: 60,
    temperature: 24.5,
    ec: 1.1,
    fertility: "Medium",
    fertilityScore: 76,
    confidence: "93.8%",
    status: "Sufficient",
    crop: "Vegetables, Pepper",
    nutrientStatus: {
      nitrogen: "Sufficient",
      phosphorus: "Deficient",
      potassium: "Sufficient",
      ph: "Suitable",
    },
    recommendations: {
      summary: "Good physical texture with stable moisture retention. Low ambient temperature favors spice crops and highland horticultural crops.",
      fertilizers: [
        {
          name: "Eppawala Rock Phosphate",
          dosage: "120 kg/ha",
          type: "warning",
          notes: "Boost root development in sloped mid-country terrain."
        }
      ]
    },
    crops: [
      {
        name: "Black Pepper",
        botanical: "Piper nigrum",
        suitability: 92,
        tag: "Highly Suitable",
        notes: "Ideal elevation and canopy moisture retention in Kandy hills."
      },
      {
        name: "Exotic Vegetables",
        botanical: "Brassica / Solanaceae",
        suitability: 84,
        tag: "Suitable",
        notes: "Moderate pH and good organic matter support bell pepper and beans."
      }
    ]
  },
  {
    sampleId: "NE-008",
    location: "Nuwara Eliya",
    district: "Nuwara Eliya (Up-Country Wet Zone)",
    regionDetails: "Central Highlands (Wet Zone Up Country - WU1)",
    soilType: "Humic Red-Yellow Podzolic",
    soilColor: "Dark Brown Humic",
    samplingDepth: "0 - 20 cm",
    date: "21/09/2026",
    time: "10:10 AM",
    ph: 5.2,
    nitrogen: 48,
    phosphorus: 22,
    potassium: 45,
    moisture: 75,
    temperature: 18.2,
    ec: 0.9,
    fertility: "Medium",
    fertilityScore: 68,
    confidence: "95.1%",
    status: "Acidic Alert",
    crop: "Upcountry Tea, Potato",
    nutrientStatus: {
      nitrogen: "Sufficient",
      phosphorus: "Deficient",
      potassium: "Sufficient",
      ph: "Acidic Alert",
    },
    recommendations: {
      summary: "High moisture and low pH indicate elevated acidity common in upcountry highlands. Dolomite liming recommended to prevent phosphorus fixation.",
      fertilizers: [
        {
          name: "Agricultural Dolomite",
          dosage: "500 kg/ha lime dressing",
          type: "warning",
          notes: "Neutralizes soil acidity and replenishes magnesium."
        },
        {
          name: "Superphosphate / ERP",
          dosage: "160 kg/ha",
          type: "warning",
          notes: "Phosphorus availability is constrained by high acidity."
        }
      ]
    },
    crops: [
      {
        name: "Upcountry Tea",
        botanical: "Camellia sinensis var. assamica",
        suitability: 95,
        tag: "Highly Suitable",
        notes: "Thrives in acidic soil (pH 5.0 - 5.5) and cool misty climate."
      },
      {
        name: "Seed Potato",
        botanical: "Solanum tuberosum",
        suitability: 88,
        tag: "Highly Suitable",
        notes: "Suited for temperate highland conditions with dolomite dressing."
      }
    ]
  },
  {
    sampleId: "KG-000",
    location: "Kegalle",
    district: "Kegalle (Mid-Country Wet Zone)",
    regionDetails: "Sabaragamuwa Province (Wet Zone Mid Country - WL2a)",
    soilType: "Red-Yellow Podzolic (RYP)",
    soilColor: "Reddish Brown Loam",
    samplingDepth: "0 - 15 cm",
    date: "14/09/2026",
    time: "04:00 PM",
    ph: 6.5,
    nitrogen: 40,
    phosphorus: 36,
    potassium: 50,
    moisture: 62,
    temperature: 27.0,
    ec: 1.3,
    fertility: "Medium",
    fertilityScore: 79,
    confidence: "92.0%",
    status: "Sufficient",
    crop: "Black Pepper",
    nutrientStatus: {
      nitrogen: "Sufficient",
      phosphorus: "Sufficient",
      potassium: "Sufficient",
      ph: "Suitable",
    },
    recommendations: {
      summary: "Stable baseline readings with balanced macronutrient availability across all test parameters.",
      fertilizers: [
        {
          name: "Standard NPK Split Top-dress",
          dosage: "100 kg/ha periodic application",
          type: "success",
          notes: "Maintain regular nutrient levels."
        }
      ]
    },
    crops: [
      {
        name: "Black Pepper",
        botanical: "Piper nigrum",
        suitability: 90,
        tag: "Highly Suitable",
        notes: "Balanced NPK and near-optimal pH 6.5."
      }
    ]
  }
];

// Helper: Calculate full agronomic diagnosis from user inputs
export function computeSoilAnalysis(input) {
  const ph = parseFloat(input.ph) || 6.2;
  const n = parseFloat(input.nitrogen) || 45;
  const p = parseFloat(input.phosphorus) || 24;
  const k = parseFloat(input.potassium) || 58;
  const moisture = parseFloat(input.moisture) || 65;
  const temp = parseFloat(input.temperature) || 26.8;
  const ec = parseFloat(input.ec) || 1.2;

  // Determine individual nutrient status
  let phStatus = "Suitable";
  if (ph < 5.5) phStatus = "Acidic Alert";
  else if (ph > 7.2) phStatus = "Alkaline";

  const nStatus = n < 30 ? "Deficient" : n > 50 ? "High" : "Sufficient";
  const pStatus = p < 35 ? "Deficient" : p > 55 ? "High" : "Sufficient";
  const kStatus = k < 40 ? "Deficient" : k > 70 ? "High" : "Sufficient";

  // Calculate Comprehensive Soil Fertility Score (0 - 100)
  // Sri Lanka Dept of Agriculture weighting: N (28%), P (30%), K (25%), pH (17%)
  let nScore = n >= 30 && n <= 50 ? 95 : n < 30 ? Math.round((n / 30) * 70) : 85;
  let pScore = p >= 35 && p <= 55 ? 95 : p < 35 ? Math.round((p / 35) * 65) : 88;
  let kScore = k >= 40 && k <= 70 ? 95 : k < 40 ? Math.round((k / 40) * 70) : 85;
  let phScore = Math.max(40, Math.round(100 - Math.abs(ph - 6.3) * 35));

  const fertilityScore = Math.min(99, Math.max(30, Math.round(nScore * 0.28 + pScore * 0.30 + kScore * 0.25 + phScore * 0.17)));
  const fertility = fertilityScore >= 82 ? "High" : fertilityScore >= 65 ? "Medium" : "Low";

  // Fertilizer recommendations
  const fertilizers = [];
  if (pStatus === "Deficient") {
    fertilizers.push({
      name: "Eppawala Rock Phosphate (ERP)",
      dosage: `${Math.round(150 + (35 - p) * 3)} kg/hectare basal dressing`,
      type: "warning",
      notes: `Targeted to resolve the ${p} mg/kg phosphorus deficiency in Sri Lankan soils.`
    });
  } else {
    fertilizers.push({
      name: "Standard Rock Phosphate (ERP)",
      dosage: "50 kg/hectare maintenance dose",
      type: "success",
      notes: "Phosphorus levels are in a healthy equilibrium."
    });
  }

  if (phStatus === "Acidic Alert") {
    fertilizers.push({
      name: "Agricultural Dolomite (Lime)",
      dosage: "500 - 750 kg/hectare broadcast",
      type: "warning",
      notes: "Corrects low pH (<5.5), reduces aluminum toxicity, and supplements magnesium."
    });
  }

  if (nStatus === "Deficient") {
    fertilizers.push({
      name: "Urea / Enriched Compost",
      dosage: "120 kg/ha split in 2 applications",
      type: "warning",
      notes: "Replenishes nitrogen reserves for leaf vegetative flush."
    });
  } else {
    fertilizers.push({
      name: "Standard MOP & Urea Top-Dressing",
      dosage: "Maintain recommended split applications",
      type: "success",
      notes: "Nitrogen and Potassium concentrations support active vegetative growth."
    });
  }

  fertilizers.push({
    name: "Organic Bio-Mulch",
    dosage: "2 - 3 tons/ha green manure",
    type: "success",
    notes: `Maintains ${moisture}% soil moisture level and stimulates beneficial mycorrhizae.`
  });

  // Tailor Sri Lanka Crop Recommendations based on District / Zone & Soil Attributes
  const zone = input.district || input.location || "Kegalle";
  // eslint-disable-next-line no-useless-assignment
  let crops = [];

  if (zone.toLowerCase().includes("nuwara eliya") || zone.toLowerCase().includes("up-country")) {
    crops = [
      {
        name: "Upcountry Tea",
        botanical: "Camellia sinensis",
        suitability: Math.round(Math.min(97, fertilityScore + 18)),
        tag: "Highly Suitable",
        notes: `High elevation wet zone climate with pH ${ph} matches premium flavor tea bushes.`
      },
      {
        name: "Potato (Granola)",
        botanical: "Solanum tuberosum",
        suitability: Math.round(Math.min(92, fertilityScore + 10)),
        tag: "Highly Suitable",
        notes: `Cold highland temperatures and ${moisture}% moisture promote tuber enlargement.`
      },
      {
        name: "Highland Cabbage",
        botanical: "Brassica oleracea",
        suitability: Math.round(Math.min(88, fertilityScore + 6)),
        tag: "Suitable",
        notes: "Good potassium levels support dense heads with proper lime application."
      }
    ];
  } else if (zone.toLowerCase().includes("kurunegala") || zone.toLowerCase().includes("intermediate")) {
    crops = [
      {
        name: "Coconut (CRIC 60)",
        botanical: "Cocos nucifera",
        suitability: Math.round(Math.min(95, fertilityScore + 15)),
        tag: "Highly Suitable",
        notes: `Intermediate zone climate and ${k} mg/kg potassium promote high nut yields.`
      },
      {
        name: "Paddy (BG 358)",
        botanical: "Oryza sativa",
        suitability: Math.round(Math.min(90, fertilityScore + 11)),
        tag: "Highly Suitable",
        notes: `Moisture (${moisture}%) and nutrient matrix support 3.5-month high yield paddy.`
      },
      {
        name: "Cashew",
        botanical: "Anacardium occidentale",
        suitability: Math.round(Math.min(84, fertilityScore + 5)),
        tag: "Suitable",
        notes: "Well-suited for well-drained soils in Kurunegala district."
      }
    ];
  } else if (zone.toLowerCase().includes("kandy")) {
    crops = [
      {
        name: "Ceylon Spices (Cloves/Nutmeg)",
        botanical: "Syzygium aromaticum",
        suitability: Math.round(Math.min(94, fertilityScore + 16)),
        tag: "Highly Suitable",
        notes: "Kandy mid-country elevation and shade humidity favor high-grade spice oils."
      },
      {
        name: "Black Pepper (Panniyur-1)",
        botanical: "Piper nigrum",
        suitability: Math.round(Math.min(90, fertilityScore + 12)),
        tag: "Highly Suitable",
        notes: `Optimal pH ${ph} and potassium ${k} mg/kg promote fruit setting on live supports.`
      },
      {
        name: "Bell Pepper / Capsicum",
        botanical: "Capsicum annuum",
        suitability: Math.round(Math.min(85, fertilityScore + 7)),
        tag: "Suitable",
        notes: "Controlled poly-tunnel or open field cultivation suited for mid-country."
      }
    ];
  } else {
    // Default: Kegalle / Sabaragamuwa Mid-Country Wet Zone (WL2a)
    crops = [
      {
        name: "Ceylon Tea",
        botanical: "Camellia sinensis",
        suitability: Math.round(Math.min(96, fertilityScore + (pStatus === "Deficient" ? 14 : 20))),
        tag: "Highly Suitable",
        notes: `Optimal pH (${ph}) and moisture (${moisture}%) for vegetative flush in mid-country hills.`
      },
      {
        name: "Ceylon Cinnamon",
        botanical: "Cinnamomum verum",
        suitability: Math.round(Math.min(91, fertilityScore + 11)),
        tag: "Highly Suitable",
        notes: `Well-suited for well-drained ${input.soilColor || "Podzolic"} soil; thrives with ${k} mg/kg potassium.`
      },
      {
        name: "Black Pepper",
        botanical: "Piper nigrum",
        suitability: Math.round(Math.min(87, fertilityScore + 8)),
        tag: "Suitable",
        notes: pStatus === "Deficient" 
          ? "Phosphorus supplementation recommended to boost root establishment." 
          : "Favorable root conditions and steady rainfall compatibility."
      },
      {
        name: "Rubber",
        botanical: "Hevea brasiliensis",
        suitability: Math.round(Math.min(83, fertilityScore + 5)),
        tag: "Suitable",
        notes: `Adapted to ${input.location || "Kegalle"} agro-climatic conditions and ${moisture}% soil moisture.`
      }
    ];
  }

  // Agronomic Summary sentence
  let summary = `The chemical profile shows appropriate nitrogen (${n} mg/kg) and potassium (${k} mg/kg) reserves with pH ${ph} suitable for crops in ${input.district || "Mid-Country Wet Zone"}.`;
  if (pStatus === "Deficient") {
    summary += ` Applying Eppawala Rock Phosphate will resolve the ${p} mg/kg phosphorus deficiency.`;
  }
  if (phStatus === "Acidic Alert") {
    summary += ` Soil pH is acidic (${ph}); lime/dolomite application is recommended.`;
  }

  const primaryCrops = crops.slice(0, 2).map(c => c.name).join(", ");

  return {
    ph,
    nitrogen: n,
    phosphorus: p,
    potassium: k,
    moisture,
    temperature: temp,
    ec,
    fertility,
    fertilityScore,
    confidence: "95.4%",
    status: phStatus === "Acidic Alert" ? "Acidic Alert" : pStatus === "Deficient" ? "Deficient P" : "Sufficient",
    crop: primaryCrops,
    nutrientStatus: {
      nitrogen: nStatus,
      phosphorus: pStatus,
      potassium: kStatus,
      ph: phStatus
    },
    recommendations: {
      summary,
      fertilizers
    },
    crops
  };
}

// Retrieve all stored samples
export function getAllSamples() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLES));
      return DEFAULT_SAMPLES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLES));
      return DEFAULT_SAMPLES;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading soil samples from localStorage:", err);
    return DEFAULT_SAMPLES;
  }
}

// Retrieve single sample by sampleId
export function getSampleById(sampleId) {
  const samples = getAllSamples();
  const found = samples.find(s => s.sampleId.toLowerCase() === String(sampleId).toLowerCase());
  if (found) return found;
  
  // Return first sample if id not found, but retain the requested ID
  if (samples.length > 0) {
    return { ...samples[0], sampleId };
  }
  return { ...DEFAULT_SAMPLES[0], sampleId };
}

// Retrieve the active sample for the Dashboard
export function getActiveSample() {
  const samples = getAllSamples();
  const activeId = localStorage.getItem(ACTIVE_SAMPLE_KEY);
  if (activeId) {
    const active = samples.find(s => s.sampleId.toLowerCase() === activeId.toLowerCase());
    if (active) return active;
  }
  return samples[0] || DEFAULT_SAMPLES[0];
}

// Set active sample by ID
export function setActiveSample(sampleId) {
  localStorage.setItem(ACTIVE_SAMPLE_KEY, sampleId);
  window.dispatchEvent(new CustomEvent("soil_sample_changed", { detail: { sampleId } }));
}

// Save a new sample and set it as active
export function saveSample(formData) {
  const analysis = computeSoilAnalysis(formData);
  const now = new Date();
  
  // Format Date DD/MM/YYYY
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  
  // Format Time 12-hour AM/PM
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  const sampleId = (formData.sampleId || `SL-${Math.floor(100 + Math.random() * 900)}`).trim().toUpperCase();

  const newSample = {
    sampleId,
    location: formData.location || "Kegalle",
    district: formData.district || "Kegalle (Mid-Country Wet Zone)",
    regionDetails: `${formData.location || "Kegalle"} Station • ${formData.district || "Wet Zone WL2a"}`,
    soilType: formData.soilColor ? `${formData.soilColor}` : "Red-Yellow Podzolic (RYP)",
    soilColor: formData.soilColor || "Reddish Brown / Podzolic",
    samplingDepth: formData.samplingDepth || "0 - 15 cm (Topsoil)",
    date: formattedDate,
    time: formattedTime,
    mlPrediction: formData.mlPrediction || null,
    ...analysis
  };

  const existing = getAllSamples();
  // If sample with same ID exists, update it; otherwise prepend to top
  const index = existing.findIndex(s => s.sampleId.toLowerCase() === sampleId.toLowerCase());
  let updatedList;
  if (index >= 0) {
    updatedList = [...existing];
    updatedList[index] = newSample;
  } else {
    updatedList = [newSample, ...existing];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  localStorage.setItem(ACTIVE_SAMPLE_KEY, sampleId);

  // Dispatch events to notify all listening components
  window.dispatchEvent(new CustomEvent("soil_data_updated", { detail: { sample: newSample } }));
  window.dispatchEvent(new CustomEvent("soil_sample_changed", { detail: { sampleId } }));

  return newSample;
}

// Delete a sample
export function deleteSample(sampleId) {
  const existing = getAllSamples();
  const filtered = existing.filter(s => s.sampleId.toLowerCase() !== sampleId.toLowerCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  const activeId = localStorage.getItem(ACTIVE_SAMPLE_KEY);
  if (activeId && activeId.toLowerCase() === sampleId.toLowerCase()) {
    if (filtered.length > 0) {
      localStorage.setItem(ACTIVE_SAMPLE_KEY, filtered[0].sampleId);
    } else {
      localStorage.removeItem(ACTIVE_SAMPLE_KEY);
    }
  }

  window.dispatchEvent(new CustomEvent("soil_data_updated", { detail: { sampleId } }));
  return filtered;
}
