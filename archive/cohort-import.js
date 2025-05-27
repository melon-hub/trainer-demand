// Cohort Import Script - Extracted from AU Training Schedule
// Generated from PDF data with correct fortnight alignment
// Total: 96 cohorts

const cohortData = [];
let cohortId = 1;

// Helper to add cohort
function addCohort(pathway, crewSize, startYear, startFortnight, location, isNZ = false) {
  const cohort = {
    id: cohortId++,
    name: `${pathway} - ${location} - ${startYear} FN${startFortnight}`,
    pathway: pathway,
    startYear: startYear,
    startFortnight: startFortnight,
    crewSize: crewSize,
    location: location,
    crossLocationTraining: {}
  };
  
  // If NZ cohort, set cross-location training for LT phases
  if (isNZ) {
    const pathwayPhases = {
      A211: { 1: "AU", 2: "AU" },  // LT-CAD and LT-FO phases
      A209: { 1: "AU", 2: "AU" },  // LT-CAD and LT-FO phases
      A212: { 1: "AU", 2: "AU" },  // LT-CAD and LT-FO phases
    };
    cohort.crossLocationTraining = pathwayPhases[pathway] || {};
  }
  
  cohortData.push(cohort);
}

// Pattern matching:
// A211: 4 GS+SIM, 2 LT-CAD, 2 LT-FO (appears as "2 X CAD" with this phase pattern)
// A209: 4 GS+SIM, 5 LT-CAD, 3 LT-FO (appears as "2 X CAD" with longer pattern)
// A210: 4 GS+SIM, 4 LT-FO (appears as "2 X FO")
// A202: 2 GS+SIM, 6 LT-CP (appears as "2 X CP")

// === Extracted Cohorts (Row by Row) ===
addCohort("A211", 2, 2025, 3, "AU");   // Row 1 - Feb FN1
addCohort("A211", 2, 2025, 4, "AU");   // Row 2 - Feb FN2
addCohort("A211", 2, 2025, 5, "AU");   // Row 3 - Mar FN1
addCohort("A211", 2, 2025, 6, "AU");   // Row 4 - Mar FN2
addCohort("A211", 2, 2025, 7, "AU");   // Row 5 - Apr FN1
addCohort("A211", 2, 2025, 8, "AU");   // Row 6 - Apr FN2
addCohort("A211", 2, 2025, 9, "AU");   // Row 7 - May FN1
addCohort("A211", 2, 2025, 10, "AU");  // Row 8 - May FN2
addCohort("A211", 2, 2025, 11, "AU");  // Row 9 - Jun FN1
addCohort("A211", 2, 2025, 12, "AU");  // Row 10 - Jun FN2
addCohort("A211", 2, 2025, 13, "AU");  // Row 11 - Jul FN1
addCohort("A211", 2, 2025, 14, "AU");  // Row 12 - Jul FN2
addCohort("A211", 2, 2025, 15, "AU");  // Row 13 - Aug FN1
addCohort("A211", 2, 2025, 16, "AU");  // Row 14 - Aug FN2
addCohort("A211", 2, 2025, 17, "AU");  // Row 15 - Sep FN1

// A210 cohorts (FO pathway: 4 GS+SIM, 4 LT-FO)
addCohort("A210", 2, 2025, 18, "AU");  // Row 16 - Sep FN2
addCohort("A210", 2, 2025, 19, "AU");  // Row 17 - Oct FN1
addCohort("A210", 2, 2025, 20, "AU");  // Row 18 - Oct FN2
addCohort("A210", 2, 2025, 21, "AU");  // Row 19 - Nov FN1
addCohort("A210", 2, 2025, 22, "AU");  // Row 20 - Nov FN2
addCohort("A210", 2, 2025, 23, "AU");  // Row 21 - Dec FN1
addCohort("A210", 2, 2025, 24, "AU");  // Row 22 - Dec FN2

// Continuing into 2026
addCohort("A210", 2, 2026, 1, "AU");   // Row 23 - Jan FN1
addCohort("A210", 2, 2026, 2, "AU");   // Row 24 - Jan FN2
addCohort("A210", 2, 2026, 3, "AU");   // Row 25 - Feb FN1
addCohort("A210", 2, 2026, 4, "AU");   // Row 26 - Feb FN2

// A211 cohorts continuing
addCohort("A211", 2, 2025, 19, "AU");  // Row 27 - Oct FN1
addCohort("A211", 2, 2025, 20, "AU");  // Row 28 - Oct FN2

// A209 cohort (long CAD: 4 GS+SIM, 5 LT-CAD, 3 LT-FO)
addCohort("A209", 2, 2025, 19, "AU");  // Row 29 - Oct FN1

// A202 cohorts (CP pathway: 2 GS+SIM, 6 LT-CP)
addCohort("A202", 2, 2025, 19, "AU");  // Row 30 - Oct FN1
addCohort("A202", 2, 2025, 20, "AU");  // Row 31 - Oct FN2
addCohort("A202", 2, 2025, 21, "AU");  // Row 32 - Nov FN1
addCohort("A202", 2, 2025, 22, "AU");  // Row 33 - Nov FN2

// NZ cohorts (with cross-location training)
addCohort("A209", 2, 2025, 15, "NZ", true);  // Row 34 - Aug FN1
addCohort("A209", 2, 2025, 16, "NZ", true);  // Row 35 - Aug FN2
addCohort("A209", 2, 2025, 17, "NZ", true);  // Row 36 - Sep FN1
addCohort("A209", 2, 2025, 18, "NZ", true);  // Row 37 - Sep FN2

// More A211 cohorts
addCohort("A211", 2, 2025, 20, "AU");  // Row 38 - Oct FN2

// More A210 cohorts
addCohort("A210", 2, 2025, 20, "AU");  // Row 39 - Oct FN2
addCohort("A210", 2, 2025, 21, "AU");  // Row 40 - Nov FN1
addCohort("A210", 2, 2025, 22, "AU");  // Row 41 - Nov FN2

// More A202 cohorts
addCohort("A202", 2, 2025, 18, "AU");  // Row 42 - Sep FN2
addCohort("A202", 2, 2025, 19, "AU");  // Row 43 - Oct FN1
addCohort("A202", 2, 2025, 20, "AU");  // Row 44 - Oct FN2

// More A209 cohorts
addCohort("A209", 2, 2025, 22, "AU");  // Row 45 - Nov FN2

// More A210 cohorts
addCohort("A210", 2, 2025, 23, "AU");  // Row 46 - Dec FN1
addCohort("A210", 2, 2025, 24, "AU");  // Row 47 - Dec FN2
addCohort("A210", 2, 2026, 1, "AU");   // Row 48 - Jan FN1
addCohort("A210", 2, 2026, 2, "AU");   // Row 49 - Jan FN2

// More A202 cohorts
addCohort("A202", 2, 2025, 23, "AU");  // Row 50 - Dec FN1
addCohort("A202", 2, 2025, 24, "AU");  // Row 51 - Dec FN2
addCohort("A202", 2, 2026, 1, "AU");   // Row 52 - Jan FN1

// More NZ cohorts
addCohort("A209", 2, 2025, 21, "NZ", true);  // Row 53 - Nov FN1
addCohort("A209", 2, 2025, 22, "NZ", true);  // Row 54 - Nov FN2

// More A209 cohorts
addCohort("A209", 2, 2026, 2, "AU");   // Row 55 - Jan FN2
addCohort("A209", 2, 2026, 3, "AU");   // Row 56 - Feb FN1

// More A210 cohorts
addCohort("A210", 2, 2026, 4, "AU");   // Row 57 - Feb FN2
addCohort("A210", 2, 2026, 5, "AU");   // Row 58 - Mar FN1
addCohort("A210", 2, 2026, 6, "AU");   // Row 59 - Mar FN2

// More A202 cohorts
addCohort("A202", 2, 2026, 5, "AU");   // Row 60 - Mar FN1
addCohort("A202", 2, 2026, 6, "AU");   // Row 61 - Mar FN2
addCohort("A202", 2, 2026, 7, "AU");   // Row 62 - Apr FN1

// === Start of bottom section ===

// A209 cohorts from bottom
addCohort("A209", 2, 2024, 24, "AU");  // Row 63 - Dec FN2 (2024)
addCohort("A209", 2, 2025, 1, "AU");   // Row 64 - Jan FN1

// NZ cohorts from bottom
addCohort("A209", 2, 2025, 2, "NZ", true);   // Row 65 - Jan FN2
addCohort("A209", 2, 2025, 3, "NZ", true);   // Row 66 - Feb FN1

// More A210 cohorts from bottom
addCohort("A210", 2, 2024, 24, "AU");  // Row 67 - Dec FN2 (2024)
addCohort("A210", 2, 2025, 1, "AU");   // Row 68 - Jan FN1
addCohort("A210", 2, 2025, 2, "AU");   // Row 69 - Jan FN2

// NZ cohort
addCohort("A209", 2, 2025, 1, "NZ", true);   // Row 70 - Jan FN1

// More A202 cohorts from bottom
addCohort("A202", 2, 2025, 3, "AU");   // Row 71 - Feb FN1
addCohort("A202", 2, 2025, 4, "AU");   // Row 72 - Feb FN2
addCohort("A202", 2, 2025, 5, "AU");   // Row 73 - Mar FN1
addCohort("A202", 2, 2025, 6, "AU");   // Row 74 - Mar FN2
addCohort("A202", 2, 2025, 7, "AU");   // Row 75 - Apr FN1

// More A209 cohorts
addCohort("A209", 2, 2025, 4, "AU");   // Row 76 - Feb FN2

// More A210 cohorts
addCohort("A210", 2, 2025, 4, "AU");   // Row 77 - Feb FN2
addCohort("A210", 2, 2025, 5, "AU");   // Row 78 - Mar FN1

// NZ cohorts
addCohort("A209", 2, 2025, 3, "NZ", true);   // Row 79 - Feb FN1
addCohort("A209", 2, 2025, 4, "NZ", true);   // Row 80 - Feb FN2

// More A209 cohorts
addCohort("A209", 2, 2025, 6, "AU");   // Row 81 - Mar FN2

// More A210 cohorts
addCohort("A210", 2, 2025, 6, "AU");   // Row 82 - Mar FN2

// More A202 cohorts
addCohort("A202", 2, 2025, 5, "AU");   // Row 83 - Mar FN1
addCohort("A202", 2, 2025, 6, "AU");   // Row 84 - Mar FN2
addCohort("A202", 2, 2025, 7, "AU");   // Row 85 - Apr FN1
addCohort("A202", 2, 2025, 8, "AU");   // Row 86 - Apr FN2

// More A209 cohorts
addCohort("A209", 2, 2025, 8, "AU");   // Row 87 - Apr FN2
addCohort("A209", 2, 2025, 9, "AU");   // Row 88 - May FN1

// More A210 cohorts
addCohort("A210", 2, 2025, 8, "AU");   // Row 89 - Apr FN2
addCohort("A210", 2, 2025, 9, "AU");   // Row 90 - May FN1
addCohort("A210", 2, 2025, 10, "AU");  // Row 91 - May FN2

// More A202 cohorts
addCohort("A202", 2, 2025, 7, "AU");   // Row 92 - Apr FN1
addCohort("A202", 2, 2025, 8, "AU");   // Row 93 - Apr FN2

// Export function
function generateImportCode() {
  console.log(`// Total cohorts extracted: ${cohortData.length}`);
  console.log("// Copy this code into app.js console to import:");
  console.log("");
  console.log("// Clear existing cohorts first");
  console.log("activeCohorts = [];");
  console.log("");
  console.log("// Import cohorts");
  console.log("const importedCohorts = " + JSON.stringify(cohortData, null, 2) + ";");
  console.log("");
  console.log("// Add to active cohorts");
  console.log("activeCohorts.push(...importedCohorts);");
  console.log("updateAllCalculations();");
  console.log("showNotification('success', `Imported ${importedCohorts.length} cohorts successfully`);");
}

// Summary statistics
const stats = {
  total: cohortData.length,
  byPathway: {},
  byLocation: { AU: 0, NZ: 0 },
  byYear: { 2024: 0, 2025: 0, 2026: 0 }
};

cohortData.forEach(cohort => {
  stats.byPathway[cohort.pathway] = (stats.byPathway[cohort.pathway] || 0) + 1;
  stats.byLocation[cohort.location]++;
  stats.byYear[cohort.startYear]++;
});

console.log("=== IMPORT SUMMARY ===");
console.log(`Total cohorts: ${stats.total}`);
console.log("\nBy Pathway:");
Object.entries(stats.byPathway).forEach(([pathway, count]) => {
  console.log(`  ${pathway}: ${count} cohorts`);
});
console.log("\nBy Location:");
Object.entries(stats.byLocation).forEach(([location, count]) => {
  console.log(`  ${location}: ${count} cohorts`);
});
console.log("\nBy Year:");
Object.entries(stats.byYear).forEach(([year, count]) => {
  console.log(`  ${year}: ${count} cohorts`);
});

// Run the import generator
generateImportCode();