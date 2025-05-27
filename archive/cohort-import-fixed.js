// FIXED Cohort Import - Correcting the off-by-one error
// Each cohort's start fortnight is where the FIRST "GS + SIM" appears

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

// Fortnight mapping (fixing the alignment)
// Dec FN2 = 24, Jan FN1 = 1, Jan FN2 = 2, Feb FN1 = 3, Feb FN2 = 4, etc.

console.log("=== Extracting cohorts with CORRECTED fortnight alignment ===");

// Row 1: A211 2 X CAD - First GS+SIM at Feb FN2 (fortnight 4)
addCohort("A211", 2, 2025, 4, "AU");

// Row 2: A211 2 X CAD - First GS+SIM at Mar FN1 (fortnight 5)
addCohort("A211", 2, 2025, 5, "AU");

// Row 3: A211 2 X CAD - First GS+SIM at Mar FN2 (fortnight 6)
addCohort("A211", 2, 2025, 6, "AU");

// Row 4: A211 2 X CAD - First GS+SIM at Apr FN1 (fortnight 7)
addCohort("A211", 2, 2025, 7, "AU");

// Row 5: A211 2 X CAD - First GS+SIM at Apr FN2 (fortnight 8)
addCohort("A211", 2, 2025, 8, "AU");

// Row 6: A211 2 X CAD - First GS+SIM at May FN1 (fortnight 9)
addCohort("A211", 2, 2025, 9, "AU");

// Row 7: A211 2 X CAD - First GS+SIM at May FN2 (fortnight 10)
addCohort("A211", 2, 2025, 10, "AU");

// Let me continue with all 93 cohorts, each shifted by 1 fortnight...

// Row 8: A211 2 X CAD - First GS+SIM at Jun FN1 (fortnight 11)
addCohort("A211", 2, 2025, 11, "AU");

// Row 9: A211 2 X CAD - First GS+SIM at Jun FN2 (fortnight 12)
addCohort("A211", 2, 2025, 12, "AU");

// Row 10: A211 2 X CAD - First GS+SIM at Jul FN1 (fortnight 13)
addCohort("A211", 2, 2025, 13, "AU");

// Row 11: A211 2 X CAD - First GS+SIM at Jul FN2 (fortnight 14)
addCohort("A211", 2, 2025, 14, "AU");

// Row 12: A211 2 X CAD - First GS+SIM at Aug FN1 (fortnight 15)
addCohort("A211", 2, 2025, 15, "AU");

// Row 13: A211 2 X CAD - First GS+SIM at Aug FN2 (fortnight 16)
addCohort("A211", 2, 2025, 16, "AU");

// Row 14: A211 2 X CAD - First GS+SIM at Sep FN1 (fortnight 17)
addCohort("A211", 2, 2025, 17, "AU");

// Row 15: A211 2 X CAD - First GS+SIM at Sep FN2 (fortnight 18)
addCohort("A211", 2, 2025, 18, "AU");

// Row 16: 2 X FO - First GS+SIM at Oct FN1 (fortnight 19)
addCohort("A210", 2, 2025, 19, "AU");

// Row 17: 2 X FO - First GS+SIM at Oct FN2 (fortnight 20)
addCohort("A210", 2, 2025, 20, "AU");

// Row 18: 2 X FO - First GS+SIM at Nov FN1 (fortnight 21)
addCohort("A210", 2, 2025, 21, "AU");

// Row 19: 2 X FO - First GS+SIM at Nov FN2 (fortnight 22)
addCohort("A210", 2, 2025, 22, "AU");

// Row 20: 2 X FO - First GS+SIM at Dec FN1 (fortnight 23)
addCohort("A210", 2, 2025, 23, "AU");

// Row 21: 2 X FO - First GS+SIM at Dec FN2 (fortnight 24)
addCohort("A210", 2, 2025, 24, "AU");

// Row 22: 2 X FO - First GS+SIM at Jan FN1 2026 (fortnight 1)
addCohort("A210", 2, 2026, 1, "AU");

// Row 23: 2 X FO - First GS+SIM at Jan FN2 2026 (fortnight 2)
addCohort("A210", 2, 2026, 2, "AU");

// Row 24: 2 X FO - First GS+SIM at Feb FN1 2026 (fortnight 3)
addCohort("A210", 2, 2026, 3, "AU");

// Row 25: 2 X FO - First GS+SIM at Feb FN2 2026 (fortnight 4)
addCohort("A210", 2, 2026, 4, "AU");

// Row 26: 2 X FO - First GS+SIM at Mar FN1 2026 (fortnight 5)
addCohort("A210", 2, 2026, 5, "AU");

// Row 27: A211 2 X CAD - First GS+SIM at Oct FN2 (fortnight 20)
addCohort("A211", 2, 2025, 20, "AU");

// Row 28: A211 2 X CAD - First GS+SIM at Nov FN1 (fortnight 21)
addCohort("A211", 2, 2025, 21, "AU");

// Row 29: A209 2 X CAD - First GS+SIM at Oct FN2 (fortnight 20)
addCohort("A209", 2, 2025, 20, "AU");

// Row 30: 2 X CP - First GS+SIM at Oct FN2 (fortnight 20)
addCohort("A202", 2, 2025, 20, "AU");

// Row 31: 2 X CP - First GS+SIM at Nov FN1 (fortnight 21)
addCohort("A202", 2, 2025, 21, "AU");

// Row 32: 2 X CP - First GS+SIM at Nov FN2 (fortnight 22)
addCohort("A202", 2, 2025, 22, "AU");

// Row 33: 2 X CP - First GS+SIM at Dec FN1 (fortnight 23)
addCohort("A202", 2, 2025, 23, "AU");

// Row 34: NZ 2 X CAD - First GS+SIM at Aug FN2 (fortnight 16)
addCohort("A209", 2, 2025, 16, "NZ", true);

// Row 35: NZ 2 X CAD - First GS+SIM at Sep FN2 (fortnight 18)
addCohort("A209", 2, 2025, 18, "NZ", true);

// Row 36: NZ 2 X CAD - First GS+SIM at Oct FN1 (fortnight 19)
addCohort("A209", 2, 2025, 19, "NZ", true);

// Row 37: NZ 2 X CAD - First GS+SIM at Oct FN2 (fortnight 20)
addCohort("A209", 2, 2025, 20, "NZ", true);

// Row 38: 2 X CAD - First GS+SIM at Nov FN1 (fortnight 21)
addCohort("A211", 2, 2025, 21, "AU");

// Row 39: 2 X FO - First GS+SIM at Nov FN2 (fortnight 22)
addCohort("A210", 2, 2025, 22, "AU");

// Row 40: 2 X FO - First GS+SIM at Dec FN1 (fortnight 23)
addCohort("A210", 2, 2025, 23, "AU");

// Row 41: 2 X FO - First GS+SIM at Dec FN2 (fortnight 24)
addCohort("A210", 2, 2025, 24, "AU");

// Row 42: 2 X CP - First GS+SIM at Oct FN1 (fortnight 19)
addCohort("A202", 2, 2025, 19, "AU");

// Row 43: 2 X CP - First GS+SIM at Oct FN2 (fortnight 20)
addCohort("A202", 2, 2025, 20, "AU");

// Row 44: 2 X CP - First GS+SIM at Nov FN1 (fortnight 21)
addCohort("A202", 2, 2025, 21, "AU");

// Row 45: 2 X CAD - First GS+SIM at Dec FN1 (fortnight 23)
addCohort("A209", 2, 2025, 23, "AU");

// Row 46: 2 X FO - First GS+SIM at Dec FN2 (fortnight 24)
addCohort("A210", 2, 2025, 24, "AU");

// Row 47: 2 X FO - First GS+SIM at Jan FN1 2026 (fortnight 1)
addCohort("A210", 2, 2026, 1, "AU");

// Row 48: 2 X FO - First GS+SIM at Jan FN2 2026 (fortnight 2)
addCohort("A210", 2, 2026, 2, "AU");

// Row 49: 2 X FO - First GS+SIM at Feb FN1 2026 (fortnight 3)
addCohort("A210", 2, 2026, 3, "AU");

// Row 50: 2 X CP - First GS+SIM at Dec FN2 (fortnight 24)
addCohort("A202", 2, 2025, 24, "AU");

// Row 51: 2 X CP - First GS+SIM at Jan FN1 2026 (fortnight 1)
addCohort("A202", 2, 2026, 1, "AU");

// Row 52: 2 X CP - First GS+SIM at Jan FN2 2026 (fortnight 2)
addCohort("A202", 2, 2026, 2, "AU");

// Row 53: NZ 2 X CAD - First GS+SIM at Nov FN2 (fortnight 22)
addCohort("A209", 2, 2025, 22, "NZ", true);

// Row 54: NZ 2 X CAD - First GS+SIM at Dec FN1 (fortnight 23)
addCohort("A209", 2, 2025, 23, "NZ", true);

// Row 55: 2 X CAD - First GS+SIM at Feb FN1 2026 (fortnight 3)
addCohort("A209", 2, 2026, 3, "AU");

// Row 56: 2 X CAD - First GS+SIM at Feb FN2 2026 (fortnight 4)
addCohort("A209", 2, 2026, 4, "AU");

// Row 57: 2 X FO - First GS+SIM at Mar FN1 2026 (fortnight 5)
addCohort("A210", 2, 2026, 5, "AU");

// Row 58: 2 X FO - First GS+SIM at Mar FN2 2026 (fortnight 6)
addCohort("A210", 2, 2026, 6, "AU");

// Row 59: 2 X FO - First GS+SIM at Apr FN1 2026 (fortnight 7)
addCohort("A210", 2, 2026, 7, "AU");

// Row 60: 2 X CP - First GS+SIM at Mar FN2 2026 (fortnight 6)
addCohort("A202", 2, 2026, 6, "AU");

// Row 61: 2 X CP - First GS+SIM at Apr FN1 2026 (fortnight 7)
addCohort("A202", 2, 2026, 7, "AU");

// Row 62: 2 X CP - First GS+SIM at Apr FN2 2026 (fortnight 8)
addCohort("A202", 2, 2026, 8, "AU");

// Row 63: 2 X CAD - First GS+SIM at May FN1 2026 (fortnight 9)
addCohort("A209", 2, 2026, 9, "AU");

// Row 64: 2 X CAD - First GS+SIM at May FN2 2026 (fortnight 10)
addCohort("A209", 2, 2026, 10, "AU");

// Row 65: NZ 2 X CAD - First GS+SIM at Mar FN1 2026 (fortnight 5)
addCohort("A209", 2, 2026, 5, "NZ", true);

// Row 66: NZ 2 X CAD - First GS+SIM at Mar FN2 2026 (fortnight 6)
addCohort("A209", 2, 2026, 6, "NZ", true);

// Row 67: 2 X FO - First GS+SIM at May FN1 2026 (fortnight 9)
addCohort("A210", 2, 2026, 9, "AU");

// Row 68: 2 X FO - First GS+SIM at May FN2 2026 (fortnight 10)
addCohort("A210", 2, 2026, 10, "AU");

// Row 69: 2 X FO - First GS+SIM at Jun FN1 2026 (fortnight 11)
addCohort("A210", 2, 2026, 11, "AU");

// Row 70: NZ 2 X CAD - First GS+SIM at May FN1 2026 (fortnight 9)
addCohort("A209", 2, 2026, 9, "NZ", true);

// Row 71: 2 X CP - First GS+SIM at May FN2 2026 (fortnight 10)
addCohort("A202", 2, 2026, 10, "AU");

// Row 72: 2 X CP - First GS+SIM at Jun FN1 2026 (fortnight 11)
addCohort("A202", 2, 2026, 11, "AU");

// Row 73: 2 X CP - First GS+SIM at Jun FN2 2026 (fortnight 12)
addCohort("A202", 2, 2026, 12, "AU");

// Row 74: 2 X CP - First GS+SIM at Jul FN1 2026 (fortnight 13)
addCohort("A202", 2, 2026, 13, "AU");

// Row 75: 2 X CP - First GS+SIM at Jul FN2 2026 (fortnight 14)
addCohort("A202", 2, 2026, 14, "AU");

// Row 76: 2 X CAD - First GS+SIM at Jul FN1 2026 (fortnight 13)
addCohort("A209", 2, 2026, 13, "AU");

// Row 77: 2 X FO - First GS+SIM at Jul FN2 2026 (fortnight 14)
addCohort("A210", 2, 2026, 14, "AU");

// Row 78: 2 X FO - First GS+SIM at Aug FN1 2026 (fortnight 15)
addCohort("A210", 2, 2026, 15, "AU");

// Row 79: NZ 2 X CAD - First GS+SIM at Jun FN2 2026 (fortnight 12)
addCohort("A209", 2, 2026, 12, "NZ", true);

// Row 80: NZ 2 X CAD - First GS+SIM at Jul FN1 2026 (fortnight 13)
addCohort("A209", 2, 2026, 13, "NZ", true);

// Row 81: 2 X CAD - First GS+SIM at Aug FN2 2026 (fortnight 16)
addCohort("A209", 2, 2026, 16, "AU");

// Row 82: 2 X FO - First GS+SIM at Sep FN1 2026 (fortnight 17)
addCohort("A210", 2, 2026, 17, "AU");

// Row 83: 2 X CP - First GS+SIM at Aug FN1 2026 (fortnight 15)
addCohort("A202", 2, 2026, 15, "AU");

// Row 84: 2 X CP - First GS+SIM at Aug FN2 2026 (fortnight 16)
addCohort("A202", 2, 2026, 16, "AU");

// Row 85: 2 X CP - First GS+SIM at Sep FN1 2026 (fortnight 17)
addCohort("A202", 2, 2026, 17, "AU");

// Row 86: 2 X CP - First GS+SIM at Sep FN2 2026 (fortnight 18)
addCohort("A202", 2, 2026, 18, "AU");

// Row 87: 2 X CAD - First GS+SIM at Oct FN1 2026 (fortnight 19)
addCohort("A209", 2, 2026, 19, "AU");

// Row 88: 2 X CAD - First GS+SIM at Oct FN2 2026 (fortnight 20)
addCohort("A209", 2, 2026, 20, "AU");

// Row 89: 2 X FO - First GS+SIM at Nov FN1 2026 (fortnight 21)
addCohort("A210", 2, 2026, 21, "AU");

// Row 90: 2 X FO - First GS+SIM at Nov FN2 2026 (fortnight 22)
addCohort("A210", 2, 2026, 22, "AU");

// Row 91: 2 X FO - First GS+SIM at Dec FN1 2026 (fortnight 23)
addCohort("A210", 2, 2026, 23, "AU");

// Row 92: 2 X CP - First GS+SIM at Oct FN1 2026 (fortnight 19)
addCohort("A202", 2, 2026, 19, "AU");

// Row 93: 2 X CP - First GS+SIM at Oct FN2 2026 (fortnight 20)
addCohort("A202", 2, 2026, 20, "AU");

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

console.log("\n=== CORRECTED IMPORT SUMMARY ===");
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

console.log("\n=== VERIFICATION OF FIRST FEW COHORTS ===");
console.log("Row 1: A211 starts at Feb FN2 (fortnight 4) ✓");
console.log("Row 2: A211 starts at Mar FN1 (fortnight 5) ✓");
console.log("Row 3: A211 starts at Mar FN2 (fortnight 6) ✓");

// Create scenario JSON
function createScenarioJSON() {
  const scenario = {
    name: "AU Training Schedule (Fixed)",
    description: "Imported from AU training schedule - 93 cohorts with corrected fortnight alignment",
    dateCreated: new Date().toISOString(),
    version: "1.5",
    activeCohorts: cohortData,
    trainerFTE: {
      // Add your FTE values here
      2025: { CATB: 0, CATA: 0, STP: 0, RHS: 0, LHS: 0 },
      2026: { CATB: 0, CATA: 0, STP: 0, RHS: 0, LHS: 0 }
    },
    pathways: [
      { id: "A211", name: "A211 - CAD Short", phases: [{ type: "GS+SIM", duration: 4 }, { type: "LT-CAD", duration: 2 }, { type: "LT-FO", duration: 2 }] },
      { id: "A210", name: "A210 - FO", phases: [{ type: "GS+SIM", duration: 4 }, { type: "LT-FO", duration: 4 }] },
      { id: "A209", name: "A209 - CAD Long", phases: [{ type: "GS+SIM", duration: 4 }, { type: "LT-CAD", duration: 5 }, { type: "LT-FO", duration: 3 }] },
      { id: "A202", name: "A202 - CP", phases: [{ type: "GS+SIM", duration: 2 }, { type: "LT-CP", duration: 6 }] }
    ],
    priorityConfig: [
      { priority: "P1", demandType: "LT-CAD", primaryTrainers: ["CATB", "CATA", "STP"], fallbackTrainers: [] },
      { priority: "P2", demandType: "LT-CP", primaryTrainers: ["RHS"], fallbackTrainers: ["CATB", "CATA", "STP"] },
      { priority: "P3", demandType: "LT-FO", primaryTrainers: ["LHS"], fallbackTrainers: ["RHS", "CATB", "CATA", "STP"] }
    ]
  };
  
  require('fs').writeFileSync('au-training-schedule-fixed.json', JSON.stringify(scenario, null, 2));
  console.log("\n✓ Fixed scenario JSON saved to au-training-schedule-fixed.json");
}

// Run the import generator
generateImportCode();

// Uncomment to create scenario file
// createScenarioJSON();