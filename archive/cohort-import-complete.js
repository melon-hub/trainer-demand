// Complete Cohort Import - 96 cohorts from AU Training Schedule
// Each row analyzed for correct fortnight alignment

const cohortData = [];
let rowNum = 1;

// Helper to add cohort
function addCohort(pathway, crewSize, startYear, startFortnight, location, rowNote = "") {
  const cohort = {
    id: cohortData.length + 1,
    name: `${pathway} - ${location} - ${startYear} FN${startFortnight}${rowNote ? ' - ' + rowNote : ''}`,
    pathway: pathway,
    startYear: startYear,
    startFortnight: startFortnight,
    crewSize: crewSize,
    location: location,
    crossLocationTraining: {}
  };
  
  // If NZ cohort with A209 pathway, set cross-location training
  if (location === "NZ" && pathway === "A209") {
    cohort.crossLocationTraining = { 1: "AU", 2: "AU" };  // LT-CAD and LT-FO phases
  }
  
  cohortData.push(cohort);
  console.log(`Row ${rowNum++}: ${pathway} ${crewSize}X ${location} - ${startYear} FN${startFortnight}`);
}

// Analyzing each row from the data dump
console.log("=== Extracting cohorts row by row ===");

// Row 1: A211 2 X CAD - First GS+SIM at Feb FN1
addCohort("A211", 2, 2025, 3, "AU");

// Row 2: A211 2 X CAD - First GS+SIM at Feb FN2
addCohort("A211", 2, 2025, 4, "AU");

// Row 3: A211 2 X CAD - First GS+SIM at Mar FN1
addCohort("A211", 2, 2025, 5, "AU");

// Row 4: A211 2 X CAD - First GS+SIM at Mar FN2
addCohort("A211", 2, 2025, 6, "AU");

// Row 5: A211 2 X CAD - First GS+SIM at Apr FN1
addCohort("A211", 2, 2025, 7, "AU");

// Row 6: A211 2 X CAD - First GS+SIM at Apr FN2
addCohort("A211", 2, 2025, 8, "AU");

// Row 7: A211 2 X CAD - First GS+SIM at May FN1
addCohort("A211", 2, 2025, 9, "AU");

// Row 8: A211 2 X CAD - First GS+SIM at May FN2
addCohort("A211", 2, 2025, 10, "AU");

// Row 9: A211 2 X CAD - First GS+SIM at Jun FN1
addCohort("A211", 2, 2025, 11, "AU");

// Row 10: A211 2 X CAD - First GS+SIM at Jun FN2
addCohort("A211", 2, 2025, 12, "AU");

// Row 11: A211 2 X CAD - First GS+SIM at Jul FN1
addCohort("A211", 2, 2025, 13, "AU");

// Row 12: A211 2 X CAD - First GS+SIM at Jul FN2
addCohort("A211", 2, 2025, 14, "AU");

// Row 13: A211 2 X CAD - First GS+SIM at Aug FN1
addCohort("A211", 2, 2025, 15, "AU");

// Row 14: A211 2 X CAD - First GS+SIM at Aug FN2
addCohort("A211", 2, 2025, 16, "AU");

// Row 15: A211 2 X CAD - First GS+SIM at Sep FN1
addCohort("A211", 2, 2025, 17, "AU");

// Row 16: 2 X FO - First GS+SIM at Sep FN2
addCohort("A210", 2, 2025, 18, "AU");

// Row 17: 2 X FO - First GS+SIM at Oct FN1
addCohort("A210", 2, 2025, 19, "AU");

// Row 18: 2 X FO - First GS+SIM at Oct FN2
addCohort("A210", 2, 2025, 20, "AU");

// Row 19: 2 X FO - First GS+SIM at Nov FN1
addCohort("A210", 2, 2025, 21, "AU");

// Row 20: 2 X FO - First GS+SIM at Nov FN2
addCohort("A210", 2, 2025, 22, "AU");

// Row 21: 2 X FO - First GS+SIM at Dec FN1
addCohort("A210", 2, 2025, 23, "AU");

// Row 22: 2 X FO - First GS+SIM at Dec FN2
addCohort("A210", 2, 2025, 24, "AU");

// Row 23: 2 X FO - First GS+SIM at Jan FN1 (2026)
addCohort("A210", 2, 2026, 1, "AU");

// Row 24: 2 X FO - First GS+SIM at Jan FN2 (2026)
addCohort("A210", 2, 2026, 2, "AU");

// Row 25: 2 X FO - First GS+SIM at Feb FN1 (2026)
addCohort("A210", 2, 2026, 3, "AU");

// Row 26: 2 X FO - First GS+SIM at Feb FN2 (2026)
addCohort("A210", 2, 2026, 4, "AU");

// Row 27: A211 2 X CAD - First GS+SIM at Oct FN1
addCohort("A211", 2, 2025, 19, "AU");

// Row 28: A211 2 X CAD - First GS+SIM at Oct FN2
addCohort("A211", 2, 2025, 20, "AU");

// Row 29: A209 2 X CAD - First GS+SIM at Oct FN1
addCohort("A209", 2, 2025, 19, "AU");

// Row 30: 2 X CP - First GS+SIM at Oct FN1
addCohort("A202", 2, 2025, 19, "AU");

// Row 31: 2 X CP - First GS+SIM at Oct FN2
addCohort("A202", 2, 2025, 20, "AU");

// Row 32: 2 X CP - First GS+SIM at Nov FN1
addCohort("A202", 2, 2025, 21, "AU");

// Row 33: 2 X CP - First GS+SIM at Nov FN2
addCohort("A202", 2, 2025, 22, "AU");

// Row 34: NZ 2 X CAD - First GS+SIM at Aug FN1
addCohort("A209", 2, 2025, 15, "NZ");

// Row 35: NZ 2 X CAD - First GS+SIM at Sep FN1
addCohort("A209", 2, 2025, 17, "NZ");

// Row 36: NZ 2 X CAD - First GS+SIM at Sep FN2
addCohort("A209", 2, 2025, 18, "NZ");

// Row 37: NZ 2 X CAD - First GS+SIM at Oct FN1
addCohort("A209", 2, 2025, 19, "NZ");

// Row 38: 2 X CAD - First GS+SIM at Oct FN2 (A211 pattern)
addCohort("A211", 2, 2025, 20, "AU");

// Row 39: 2 X FO - First GS+SIM at Nov FN1
addCohort("A210", 2, 2025, 21, "AU");

// Row 40: 2 X FO - First GS+SIM at Nov FN2
addCohort("A210", 2, 2025, 22, "AU");

// Row 41: 2 X FO - First GS+SIM at Dec FN1
addCohort("A210", 2, 2025, 23, "AU");

// Row 42: 2 X CP - First GS+SIM at Sep FN2
addCohort("A202", 2, 2025, 18, "AU");

// Row 43: 2 X CP - First GS+SIM at Oct FN1
addCohort("A202", 2, 2025, 19, "AU");

// Row 44: 2 X CP - First GS+SIM at Oct FN2
addCohort("A202", 2, 2025, 20, "AU");

// Empty row 45

// Row 46: 2 X CAD - First GS+SIM at Nov FN2 (A209 pattern)
addCohort("A209", 2, 2025, 22, "AU");

// Row 47: 2 X FO - First GS+SIM at Dec FN1
addCohort("A210", 2, 2025, 23, "AU");

// Row 48: 2 X FO - First GS+SIM at Dec FN2
addCohort("A210", 2, 2025, 24, "AU");

// Row 49: 2 X FO - First GS+SIM at Jan FN1 (2026)
addCohort("A210", 2, 2026, 1, "AU");

// Row 50: 2 X FO - First GS+SIM at Jan FN2 (2026)
addCohort("A210", 2, 2026, 2, "AU");

// Row 51: 2 X CP - First GS+SIM at Dec FN1
addCohort("A202", 2, 2025, 23, "AU");

// Row 52: 2 X CP - First GS+SIM at Dec FN2
addCohort("A202", 2, 2025, 24, "AU");

// Row 53: 2 X CP - First GS+SIM at Jan FN1 (2026)
addCohort("A202", 2, 2026, 1, "AU");

// Row 54: NZ 2 X CAD - First GS+SIM at Nov FN1
addCohort("A209", 2, 2025, 21, "NZ");

// Row 55: NZ 2 X CAD - First GS+SIM at Nov FN2
addCohort("A209", 2, 2025, 22, "NZ");

// Empty row 56

// Row 57: 2 X CAD - First GS+SIM at Jan FN2 (2026) (A209 pattern)
addCohort("A209", 2, 2026, 2, "AU");

// Row 58: 2 X CAD - First GS+SIM at Feb FN1 (2026) (A209 pattern)
addCohort("A209", 2, 2026, 3, "AU");

// Row 59: 2 X FO - First GS+SIM at Feb FN2 (2026)
addCohort("A210", 2, 2026, 4, "AU");

// Row 60: 2 X FO - First GS+SIM at Mar FN1 (2026)
addCohort("A210", 2, 2026, 5, "AU");

// Row 61: 2 X FO - First GS+SIM at Mar FN2 (2026)
addCohort("A210", 2, 2026, 6, "AU");

// Empty rows 62-63

// Row 64: 2 X CP - First GS+SIM at Mar FN1 (2026)
addCohort("A202", 2, 2026, 5, "AU");

// Row 65: 2 X CP - First GS+SIM at Mar FN2 (2026)
addCohort("A202", 2, 2026, 6, "AU");

// Row 66: 2 X CP - First GS+SIM at Apr FN1 (2026)
addCohort("A202", 2, 2026, 7, "AU");

// Row 67: 2 X CAD - First GS+SIM at Apr FN2 (2026) (A209 pattern)
addCohort("A209", 2, 2026, 8, "AU");

// Row 68: 2 X CAD - First GS+SIM at May FN1 (2026) (A209 pattern)
addCohort("A209", 2, 2026, 9, "AU");

// Row 69: NZ 2 X CAD - First GS+SIM at Feb FN2 (2026)
addCohort("A209", 2, 2026, 4, "NZ");

// Row 70: NZ 2 X CAD - First GS+SIM at Mar FN1 (2026)
addCohort("A209", 2, 2026, 5, "NZ");

// Row 71: 2 X FO - First GS+SIM at Apr FN2 (2026)
addCohort("A210", 2, 2026, 8, "AU");

// Row 72: 2 X FO - First GS+SIM at May FN1 (2026)
addCohort("A210", 2, 2026, 9, "AU");

// Row 73: 2 X FO - First GS+SIM at May FN2 (2026)
addCohort("A210", 2, 2026, 10, "AU");

// Row 74: NZ 2 X CAD - First GS+SIM at Apr FN2 (2026)
addCohort("A209", 2, 2026, 8, "NZ");

// Row 75: 2 X CP - First GS+SIM at May FN1 (2026)
addCohort("A202", 2, 2026, 9, "AU");

// Row 76: 2 X CP - First GS+SIM at May FN2 (2026)
addCohort("A202", 2, 2026, 10, "AU");

// Row 77: 2 X CP - First GS+SIM at Jun FN1 (2026)
addCohort("A202", 2, 2026, 11, "AU");

// Row 78: 2 X CP - First GS+SIM at Jun FN2 (2026)
addCohort("A202", 2, 2026, 12, "AU");

// Row 79: 2 X CP - First GS+SIM at Jul FN1 (2026)
addCohort("A202", 2, 2026, 13, "AU");

// Empty row 80

// Row 81: 2 X CAD - First GS+SIM at Jun FN2 (2026) (A209 pattern)
addCohort("A209", 2, 2026, 12, "AU");

// Row 82: 2 X FO - First GS+SIM at Jul FN1 (2026)
addCohort("A210", 2, 2026, 13, "AU");

// Row 83: 2 X FO - First GS+SIM at Jul FN2 (2026)
addCohort("A210", 2, 2026, 14, "AU");

// Row 84: NZ 2 X CAD - First GS+SIM at Jun FN1 (2026)
addCohort("A209", 2, 2026, 11, "NZ");

// Row 85: NZ 2 X CAD - First GS+SIM at Jun FN2 (2026)
addCohort("A209", 2, 2026, 12, "NZ");

// Row 86: 2 X CAD - First GS+SIM at Aug FN1 (2026) (A209 pattern)
addCohort("A209", 2, 2026, 15, "AU");

// Row 87: 2 X FO - First GS+SIM at Aug FN2 (2026)
addCohort("A210", 2, 2026, 16, "AU");

// Row 88: 2 X CP - First GS+SIM at Jul FN2 (2026)
addCohort("A202", 2, 2026, 14, "AU");

// Row 89: 2 X CP - First GS+SIM at Aug FN1 (2026)
addCohort("A202", 2, 2026, 15, "AU");

// Row 90: 2 X CP - First GS+SIM at Aug FN2 (2026)
addCohort("A202", 2, 2026, 16, "AU");

// Row 91: 2 X CP - First GS+SIM at Sep FN1 (2026)
addCohort("A202", 2, 2026, 17, "AU");

// Row 92: 2 X CAD - First GS+SIM at Sep FN2 (2026) (A209 pattern)
addCohort("A209", 2, 2026, 18, "AU");

// Row 93: 2 X CAD - First GS+SIM at Oct FN1 (2026) (A209 pattern)
addCohort("A209", 2, 2026, 19, "AU");

// Row 94: 2 X FO - First GS+SIM at Oct FN2 (2026)
addCohort("A210", 2, 2026, 20, "AU");

// Row 95: 2 X FO - First GS+SIM at Nov FN1 (2026)
addCohort("A210", 2, 2026, 21, "AU");

// Row 96: 2 X FO - First GS+SIM at Nov FN2 (2026)
addCohort("A210", 2, 2026, 22, "AU");

// Two more rows found at end of data
// Row 97: 2 X CP - First GS+SIM at Sep FN2 (2026)
addCohort("A202", 2, 2026, 18, "AU");

// Row 98: 2 X CP - First GS+SIM at Oct FN1 (2026)
addCohort("A202", 2, 2026, 19, "AU");

// Generate import code
function generateImportCode() {
  console.log(`\n// Total cohorts extracted: ${cohortData.length}`);
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

console.log("\n=== FINAL IMPORT SUMMARY ===");
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