// Import verification script
// Run this in Node.js to check specific cohorts

const fs = require('fs');

// Load the cohort data
eval(fs.readFileSync('./cohort-import-complete.js', 'utf8'));

// Helper functions
function findByRow(rowNum) {
    return cohortData.find(c => c.id === rowNum);
}

function findByPathway(pathway) {
    return cohortData.filter(c => c.pathway === pathway);
}

function findByLocation(location) {
    return cohortData.filter(c => c.location === location);
}

function findByYearAndFortnight(year, fortnight) {
    return cohortData.filter(c => c.startYear === year && c.startFortnight === fortnight);
}

function fortnightToMonth(year, fortnight) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = Math.floor((fortnight - 1) / 2);
    const fnPart = ((fortnight - 1) % 2) + 1;
    return `${months[monthIndex]} FN${fnPart}`;
}

// Cross-check examples
console.log("=== CROSS-CHECK EXAMPLES ===\n");

// Check specific rows
console.log("Row 1:", findByRow(1));
console.log("Row 34 (First NZ):", findByRow(34));
console.log("Row 93 (Last):", findByRow(93));

console.log("\n=== CHECK NZ COHORTS ===");
const nzCohorts = findByLocation('NZ');
console.log(`Total NZ cohorts: ${nzCohorts.length}`);
nzCohorts.forEach(c => {
    console.log(`Row ${c.id}: ${c.pathway} - ${c.startYear} ${fortnightToMonth(c.startYear, c.startFortnight)}`);
});

console.log("\n=== CHECK DUPLICATES ===");
// Check for any duplicate start times for same pathway
const duplicateCheck = {};
let duplicates = [];
cohortData.forEach(c => {
    const key = `${c.pathway}-${c.startYear}-${c.startFortnight}-${c.location}`;
    if (duplicateCheck[key]) {
        duplicates.push({ first: duplicateCheck[key], second: c });
    } else {
        duplicateCheck[key] = c;
    }
});

if (duplicates.length > 0) {
    console.log("Found duplicates:");
    duplicates.forEach(d => {
        console.log(`Duplicate: ${d.first.id} and ${d.second.id}`);
    });
} else {
    console.log("No duplicates found ✓");
}

console.log("\n=== PATHWAY DISTRIBUTION ===");
const pathwayStats = {};
cohortData.forEach(c => {
    pathwayStats[c.pathway] = (pathwayStats[c.pathway] || 0) + 1;
});
Object.entries(pathwayStats).forEach(([pathway, count]) => {
    console.log(`${pathway}: ${count} cohorts`);
});

console.log("\n=== YEAR/MONTH DISTRIBUTION ===");
const monthStats = {};
cohortData.forEach(c => {
    const month = fortnightToMonth(c.startYear, c.startFortnight);
    const key = `${c.startYear} ${month}`;
    monthStats[key] = (monthStats[key] || 0) + 1;
});
Object.entries(monthStats).sort().forEach(([month, count]) => {
    console.log(`${month}: ${count} cohorts`);
});

// Export function to generate scenario JSON
function generateScenarioJSON() {
    const scenario = {
        name: "AU Training Schedule Import",
        description: "Imported from AU training schedule PDF - 93 cohorts",
        dateCreated: new Date().toISOString(),
        activeCohorts: cohortData.map(c => ({
            name: c.name,
            pathway: c.pathway,
            startYear: c.startYear,
            startFortnight: c.startFortnight,
            crewSize: c.crewSize,
            location: c.location,
            crossLocationTraining: c.crossLocationTraining
        })),
        trainerFTE: {
            // You'll need to add your FTE data here
            2025: { CATB: 0, CATA: 0, STP: 0, RHS: 0, LHS: 0 },
            2026: { CATB: 0, CATA: 0, STP: 0, RHS: 0, LHS: 0 }
        }
    };
    
    fs.writeFileSync('au-training-schedule-scenario.json', JSON.stringify(scenario, null, 2));
    console.log("\n✓ Scenario JSON saved to au-training-schedule-scenario.json");
}

// Uncomment to generate scenario JSON
// generateScenarioJSON();

console.log("\n=== TO USE IN APP ===");
console.log("1. Open verify-import.html in a browser to visually check all cohorts");
console.log("2. Run the import code from cohort-import-complete.js in your app's console");
console.log("3. Or uncomment generateScenarioJSON() above to create a scenario file");