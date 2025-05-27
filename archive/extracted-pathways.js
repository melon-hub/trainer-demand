// Extracted Training Pathways from AU Training Schedule
// Timeline: Dec 2024 FN2 to Sep 2026 FN1

// Reference pathways from the provided data
const referencePathways = {
  A202: { phases: [{ type: "GS+SIM", duration: 2 }, { type: "LT-CP", duration: 6 }] },  // 2 X CP pathway
  A210: { phases: [{ type: "GS+SIM", duration: 4 }, { type: "LT-FO", duration: 4 }] },  // 2 X FO pathway (was wrong before)
  A209: { phases: [{ type: "GS+SIM", duration: 4 }, { type: "LT-CAD", duration: 5 }, { type: "LT-FO", duration: 3 }] },  // 2 X CAD long pathway
  A212: { phases: [{ type: "GS+SIM", duration: 4 }, { type: "LT-CAD", duration: 3 }, { type: "LT-FO", duration: 5 }] },  // 2 X CAD variant
  A211: { phases: [{ type: "GS+SIM", duration: 4 }, { type: "LT-CAD", duration: 2 }, { type: "LT-FO", duration: 2 }] },  // 2 X CAD short pathway
  A203: { phases: [{ type: "GS+SIM", duration: 2 }, { type: "LT-CP", duration: 1 }] }   // 4 X CP pathway
};

// Pattern recognition helper
function identifyPathway(phasePattern) {
  // Look at the duration and sequence of phases to identify pathway
  // A211: 4 GS+SIM, 2 LT-CAD, 2 LT-FO
  // A209: 4 GS+SIM, 5 LT-CAD, 3 LT-FO
  // A212: 4 GS+SIM, 3 LT-CAD, 5 LT-FO
  // A210: 4 GS+SIM, 4 LT-FO
  // A202: 2 GS+SIM, 6 LT-CP
  // A203: 2 GS+SIM, 1 LT-CP
}

// Fortnight mapping (Dec 2024 FN2 = fortnight 24 of 2024)
const fortnightMap = {
  // 2024
  "Dec FN2": { year: 2024, fortnight: 24 },
  
  // 2025
  "Jan FN1": { year: 2025, fortnight: 1 },
  "Jan FN2": { year: 2025, fortnight: 2 },
  "Feb FN1": { year: 2025, fortnight: 3 },
  "Feb FN2": { year: 2025, fortnight: 4 },
  "Mar FN1": { year: 2025, fortnight: 5 },
  "Mar FN2": { year: 2025, fortnight: 6 },
  "Apr FN1": { year: 2025, fortnight: 7 },
  "Apr FN2": { year: 2025, fortnight: 8 },
  "May FN1": { year: 2025, fortnight: 9 },
  "May FN2": { year: 2025, fortnight: 10 },
  "Jun FN1": { year: 2025, fortnight: 11 },
  "Jun FN2": { year: 2025, fortnight: 12 },
  "Jul FN1": { year: 2025, fortnight: 13 },
  "Jul FN2": { year: 2025, fortnight: 14 },
  "Aug FN1": { year: 2025, fortnight: 15 },
  "Aug FN2": { year: 2025, fortnight: 16 },
  "Sep FN1": { year: 2025, fortnight: 17 },
  "Sep FN2": { year: 2025, fortnight: 18 },
  "Oct FN1": { year: 2025, fortnight: 19 },
  "Oct FN2": { year: 2025, fortnight: 20 },
  "Nov FN1": { year: 2025, fortnight: 21 },
  "Nov FN2": { year: 2025, fortnight: 22 },
  "Dec FN1": { year: 2025, fortnight: 23 },
  "Dec FN2": { year: 2025, fortnight: 24 },
  
  // 2026
  "Jan FN1": { year: 2026, fortnight: 1 },
  "Jan FN2": { year: 2026, fortnight: 2 },
  "Feb FN1": { year: 2026, fortnight: 3 },
  "Feb FN2": { year: 2026, fortnight: 4 },
  "Mar FN1": { year: 2026, fortnight: 5 },
  "Mar FN2": { year: 2026, fortnight: 6 },
  "Apr FN1": { year: 2026, fortnight: 7 },
  "Apr FN2": { year: 2026, fortnight: 8 },
  "May FN1": { year: 2026, fortnight: 9 },
  "May FN2": { year: 2026, fortnight: 10 },
  "Jun FN1": { year: 2026, fortnight: 11 },
  "Jun FN2": { year: 2026, fortnight: 12 },
  "Jul FN1": { year: 2026, fortnight: 13 },
  "Jul FN2": { year: 2026, fortnight: 14 },
  "Aug FN1": { year: 2026, fortnight: 15 },
  "Aug FN2": { year: 2026, fortnight: 16 },
  "Sep FN1": { year: 2026, fortnight: 17 }
};

// Helper function to determine cross-location configuration
function getCrossLocationConfig(pathwayName, phases) {
  if (!pathwayName.includes("NZ")) return {};
  
  // For NZ cohorts, all LT phases use AU trainers
  const config = {};
  phases.forEach((phase, index) => {
    if (phase.type.startsWith("LT-")) {
      config[index] = "AU";
    }
  });
  return config;
}

// Extracted cohorts from AU training schedule
// Based on where first "GS + SIM" aligns with fortnight headers
const extractedCohorts = [];

// Row 1: A211 - First GS+SIM at Feb FN1 (fortnight 3)
extractedCohorts.push({
  row: 1,
  pathwayName: "A211",
  crewSize: 2,
  matchedPathway: "A211",
  startYear: 2025,
  startFortnight: 3,  // Feb FN1
  location: "AU",
  crossLocationTraining: {}
});

// Row 2: A211 - First GS+SIM at Feb FN2 (fortnight 4)
extractedCohorts.push({
  row: 2,
  pathwayName: "A211",
  crewSize: 2,
  matchedPathway: "A211",
  startYear: 2025,
  startFortnight: 4,  // Feb FN2
  location: "AU",
  crossLocationTraining: {}
});

// Row 3: A211 - First GS+SIM at Mar FN1 (fortnight 5)
extractedCohorts.push({
  row: 3,
  pathwayName: "A211",
  crewSize: 2,
  matchedPathway: "A211",
  startYear: 2025,
  startFortnight: 5,  // Mar FN1
  location: "AU",
  crossLocationTraining: {}
});

// Row 4: A211 - First GS+SIM at Mar FN2 (fortnight 6)
extractedCohorts.push({
  row: 4,
  pathwayName: "A211",
  crewSize: 2,
  matchedPathway: "A211",
  startYear: 2025,
  startFortnight: 6,  // Mar FN2
  location: "AU",
  crossLocationTraining: {}
});

// Continue extracting remaining cohorts...
// Note: Looking for pattern - A211 has [GS+SIM:3, LT-CAD:8] total duration of 11 fortnights

// Function to convert extracted data to app.js cohort format
function convertToAppFormat(extractedCohort) {
  const pathway = referencePathways[extractedCohort.matchedPathway];
  
  return {
    name: `${extractedCohort.pathwayName} - Row ${extractedCohort.row}`,
    pathway: extractedCohort.matchedPathway,
    pathwayConfig: pathway.phases,
    startYear: extractedCohort.startYear,
    startFortnight: extractedCohort.startFortnight,
    crewSize: extractedCohort.crewSize,
    location: extractedCohort.location,
    crossLocationTraining: extractedCohort.crossLocationTraining || {}
  };
}

// Generate import code
function generateImportCode() {
  const cohorts = extractedCohorts.map(convertToAppFormat);
  
  console.log("// Import these cohorts into app.js");
  console.log("const importedCohorts = " + JSON.stringify(cohorts, null, 2) + ";");
  console.log("");
  console.log("// Add to activeCohorts array:");
  console.log("activeCohorts.push(...importedCohorts);");
}

// Instructions for use:
console.log("EXTRACTION INSTRUCTIONS:");
console.log("1. For each row in the PDF, note where the FIRST 'GS + SIM' cell appears");
console.log("2. Match this position to the fortnight column header (e.g., 'Feb FN1')");
console.log("3. Use the fortnightMap above to get the year and fortnight number");
console.log("4. Match the phase pattern to identify which reference pathway to use");
console.log("5. Add the cohort data to the extractedCohorts array");
console.log("6. Run generateImportCode() to get the import format");

// Example of correct fortnight determination:
// If row 15 has its first "GS + SIM" under the "Feb FN1" column:
// - Year: 2025
// - Fortnight: 3 (February fortnight 1)
// NOT based on counting cells from the beginning!