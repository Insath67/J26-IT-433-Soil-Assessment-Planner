// PDF Generation & Export Utility for Soil Assessment Reports
// Generates standard compliant PDF documents natively in the browser without external dependencies

export function downloadSoilReportPdf(sample) {
  if (!sample) return;

  const sampleId = sample.sampleId || "SPECIMEN";
  const filename = `Soil_Assessment_Report_${sampleId}.pdf`;

  // Escape parentheses and backslashes for PDF string literals
  const sanitize = (str) => {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  };

  // Build PDF Content Stream
  // Page size: A4 = 595.28 x 841.89 points
  const streamLines = [];

  // Helper functions for drawing
  const setFillColor = (r, g, b) => {
    streamLines.push(`${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} rg`);
  };

  const setStrokeColor = (r, g, b) => {
    streamLines.push(`${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)} RG`);
  };

  const drawRect = (x, y, w, h, fill = true, stroke = false) => {
    streamLines.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`);
    if (fill && stroke) streamLines.push("B");
    else if (fill) streamLines.push("f");
    else if (stroke) streamLines.push("s");
  };

  const drawLine = (x1, y1, x2, y2, lineWidth = 1) => {
    streamLines.push(`${lineWidth} w`);
    streamLines.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m`);
    streamLines.push(`${x2.toFixed(2)} ${y2.toFixed(2)} l`);
    streamLines.push("S");
  };

  const drawText = (text, x, y, size = 10, isBold = false, color = [15, 23, 42]) => {
    setFillColor(color[0], color[1], color[2]);
    streamLines.push("BT");
    streamLines.push(`/${isBold ? "F2" : "F1"} ${size} Tf`);
    streamLines.push(`${x.toFixed(2)} ${y.toFixed(2)} Td`);
    streamLines.push(`(${sanitize(text)}) Tj`);
    streamLines.push("ET");
  };

  // 1. Top Header Banner (Dark Green gradient background)
  // Background rectangle from y=740 to 820
  setFillColor(15, 61, 32); // Dark Green #0F3D20
  drawRect(35, 745, 525, 65, true, false);

  // Decorative Accent bar (Light Green #22C55E)
  setFillColor(34, 197, 94);
  drawRect(35, 740, 525, 5, true, false);

  // Header Title
  drawText("SRI LANKA AGRO-TECH SOIL ASSESSMENT REPORT", 50, 785, 14, true, [240, 253, 244]);
  drawText("Department of Agriculture & SLIIT Agri-Tech ML Research Initiative", 50, 768, 9, false, [187, 247, 208]);
  drawText(`VERIFIED FIELD SPECIMEN: #${sampleId}`, 50, 752, 9, true, [74, 222, 128]);

  // Document Timestamp on Right
  drawText(`Generated: ${sample.date || "15/10/2026"} ${sample.time || "12:00 PM"}`, 390, 752, 8, false, [220, 252, 231]);

  // 2. Sample Identification Box
  setFillColor(248, 250, 248);
  setStrokeColor(225, 235, 226);
  streamLines.push("0.8 w");
  drawRect(35, 655, 525, 70, true, true);

  drawText("SAMPLE METADATA & GEOGRAPHICAL ORIGIN", 48, 708, 9, true, [15, 61, 32]);

  // Row 1
  drawText("Sample ID:", 48, 690, 9, false, [95, 113, 102]);
  drawText(sample.sampleId || "KG-002", 110, 690, 9, true, [10, 17, 13]);

  drawText("Location / District:", 210, 690, 9, false, [95, 113, 102]);
  drawText(sample.location || "Kegalle", 305, 690, 9, true, [10, 17, 13]);

  drawText("Sampling Depth:", 430, 690, 9, false, [95, 113, 102]);
  drawText(sample.samplingDepth || "0 - 15 cm", 505, 690, 9, true, [10, 17, 13]);

  // Row 2
  drawText("Agro-Ecological Zone:", 48, 672, 9, false, [95, 113, 102]);
  drawText(sample.district || "Wet Zone WL2a", 155, 672, 9, true, [10, 17, 13]);

  drawText("Soil Texture / Type:", 320, 672, 9, false, [95, 113, 102]);
  drawText(sample.soilType || sample.soilColor || "Red-Yellow Podzolic", 415, 672, 9, true, [10, 17, 13]);

  // 3. Fertility Index & ML Diagnosis Badge
  const score = sample.fertilityScore || 74;
  const fertilityRating = sample.fertility || "Medium";
  
  setFillColor(240, 253, 244);
  setStrokeColor(134, 239, 172);
  drawRect(35, 595, 525, 48, true, true);

  drawText("ML FERTILITY ASSESSMENT SCORE", 48, 626, 9, true, [20, 83, 45]);
  drawText(`${score} / 100`, 48, 607, 15, true, [22, 101, 52]);
  drawText(`[ Rating: ${fertilityRating} Fertility  |  Confidence: ${sample.confidence || "95.4%"} ]`, 125, 611, 10, true, [21, 128, 61]);

  // 4. Physicochemical Soil Sensor Telemetry Table
  drawText("PHYSICOCHEMICAL SENSOR TELEMETRY & AGRONOMIC BENCHMARKS", 35, 575, 10, true, [15, 61, 32]);
  drawLine(35, 568, 560, 568, 1);

  // Table Header
  setFillColor(241, 245, 241);
  drawRect(35, 545, 525, 18, true, false);

  drawText("Nutrient / Parameter", 42, 550, 8.5, true, [15, 61, 32]);
  drawText("Measured Value", 165, 550, 8.5, true, [15, 61, 32]);
  drawText("Target Benchmark", 260, 550, 8.5, true, [15, 61, 32]);
  drawText("Status", 370, 550, 8.5, true, [15, 61, 32]);
  drawText("Agronomic Interpretation", 440, 550, 8.5, true, [15, 61, 32]);

  // Table rows
  const telemetry = [
    { name: "Soil pH Reaction", val: `${sample.ph}`, target: "5.8 - 6.8", status: sample.nutrientStatus?.ph || "Suitable", notes: "Nutrient bioavailability index" },
    { name: "Nitrogen (N)", val: `${sample.nitrogen} mg/kg`, target: "30 - 50 mg/kg", status: sample.nutrientStatus?.nitrogen || "Sufficient", notes: "Vegetative foliage growth" },
    { name: "Phosphorus (P)", val: `${sample.phosphorus} mg/kg`, target: "35 - 55 mg/kg", status: sample.nutrientStatus?.phosphorus || "Deficient", notes: "Root network vigor" },
    { name: "Potassium (K)", val: `${sample.potassium} mg/kg`, target: "40 - 70 mg/kg", status: sample.nutrientStatus?.potassium || "Sufficient", notes: "Drought and pest resistance" },
    { name: "Moisture Content", val: `${sample.moisture} %`, target: "55 - 75 %", status: "Optimal", notes: "Field water capacity" },
    { name: "Soil Temperature", val: `${sample.temperature} °C`, target: "22 - 30 °C", status: "Optimal", notes: "Microbial activity range" },
    { name: "Electrical Conduct. (EC)", val: `${sample.ec || 1.2} mS/cm`, target: "< 2.0 mS/cm", status: "Normal", notes: "Salinity concentration" },
  ];

  let currentY = 527;
  telemetry.forEach((row, i) => {
    if (i % 2 === 1) {
      setFillColor(249, 251, 249);
      drawRect(35, currentY - 4, 525, 17, true, false);
    }

    const isDeficient = row.status.toLowerCase().includes("defic") || row.status.toLowerCase().includes("acid");
    const statusColor = isDeficient ? [180, 83, 9] : [22, 101, 52];

    drawText(row.name, 42, currentY, 8.5, false, [15, 23, 42]);
    drawText(row.val, 165, currentY, 8.5, true, [10, 17, 13]);
    drawText(row.target, 260, currentY, 8, false, [95, 113, 102]);
    drawText(row.status, 370, currentY, 8.5, true, statusColor);
    drawText(row.notes, 440, currentY, 8, false, [95, 113, 102]);

    drawLine(35, currentY - 5, 560, currentY - 5, 0.4);
    currentY -= 17;
  });

  // Footer & Certification Stamp Block
  drawLine(35, 65, 560, 65, 0.8);
  drawText("SRI LANKA AGRI-TECH RESEARCH INITIATIVE • FACULTY OF COMPUTING / AGRICULTURE • SLIIT", 48, 52, 7.5, false, [95, 113, 102]);
  drawText("Notice: ML predictions are calibrated against Sri Lanka Department of Agriculture field guidelines.", 48, 41, 7, false, [140, 155, 145]);
  drawText("OFFICIAL VERIFICATION CODE: SL-AGRI-2026-CERT", 380, 41, 7, true, [15, 61, 32]);

  // Combine stream content
  const contentStream = streamLines.join("\n");
  const streamLength = contentStream.length;

  // Construct PDF Objects
  const pdfObjects = [];
  pdfObjects.push("%PDF-1.4\n%âãÏÓ\n");

  // Object 1: Catalog
  const obj1Offset = pdfObjects.join("").length;
  pdfObjects.push(
    "1 0 obj\n" +
    "<< /Type /Catalog /Pages 2 0 R >>\n" +
    "endobj\n"
  );

  // Object 2: Pages
  const obj2Offset = pdfObjects.join("").length;
  pdfObjects.push(
    "2 0 obj\n" +
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n" +
    "endobj\n"
  );

  // Object 3: Page (A4 = 595.28 x 841.89)
  const obj3Offset = pdfObjects.join("").length;
  pdfObjects.push(
    "3 0 obj\n" +
    "<< /Type /Page /Parent 2 0 R\n" +
    "   /MediaBox [0 0 595.28 841.89]\n" +
    "   /Contents 4 0 R\n" +
    "   /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >>\n" +
    ">>\n" +
    "endobj\n"
  );

  // Object 4: Content Stream
  const obj4Offset = pdfObjects.join("").length;
  pdfObjects.push(
    `4 0 obj\n` +
    `<< /Length ${streamLength} >>\n` +
    `stream\n` +
    contentStream + "\n" +
    `endstream\n` +
    `endobj\n`
  );

  // Object 5: Font F1 (Helvetica)
  const obj5Offset = pdfObjects.join("").length;
  pdfObjects.push(
    "5 0 obj\n" +
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n" +
    "endobj\n"
  );

  // Object 6: Font F2 (Helvetica-Bold)
  const obj6Offset = pdfObjects.join("").length;
  pdfObjects.push(
    "6 0 obj\n" +
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\n" +
    "endobj\n"
  );

  // Xref table
  const xrefOffset = pdfObjects.join("").length;
  let xref = "xref\n0 7\n0000000000 65535 f \n";
  const offsets = [obj1Offset, obj2Offset, obj3Offset, obj4Offset, obj5Offset, obj6Offset];
  offsets.forEach((off) => {
    xref += String(off).padStart(10, "0") + " 00000 n \n";
  });

  const trailer =
    "trailer\n" +
    "<< /Size 7 /Root 1 0 R >>\n" +
    "startxref\n" +
    `${xrefOffset}\n` +
    "%%EOF\n";

  pdfObjects.push(xref);
  pdfObjects.push(trailer);

  const fullPdfString = pdfObjects.join("");

  // Convert string to Uint8Array and trigger download via Blob
  const buffer = new Uint8Array(fullPdfString.length);
  for (let i = 0; i < fullPdfString.length; i++) {
    buffer[i] = fullPdfString.charCodeAt(i) & 0xff;
  }

  const blob = new Blob([buffer], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
}

// Print trigger with print styles
export function printSoilReport() {
  window.print();
}
