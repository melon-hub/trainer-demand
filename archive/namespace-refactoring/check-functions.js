// List of functions we're trying to assign to namespace
const functionsToCheck = [
    'showNotification',
    'showCenterNotification', 
    'removeToast',
    'showAlertDialog',
    'showConfirmDialog',
    'updateCurrentScenarioDisplay',
    'markDirty',
    'calculateDemand',
    'calculateSupplyDeficit',
    'calculateLineTrainingPeriods',
    'getCategoryDemand',
    'calculateAverageDemand',
    'calculateMetricTrends',
    'calculateMetricsForPeriod',
    'updateDashboardV2',
    'updateDashboardForNavigation',
    'navigateDashboard',
    'updateMetricsCards',
    'updateDemandOverTimeChart',
    'updateTrainingDistributionChart',
    'updateUtilizationTrendChart',
    'updateSmartAlerts',
    'renderPipelineView',
    'renderGanttChart',
    'renderDemandTable',
    'renderSurplusDeficitTable',
    'updateAllTables',
    'handleDragStart',
    'handleDragEnd',
    'handleDragOver',
    'handleDrop',
    'setupGanttDragAndDrop',
    'renderPathwaysTable',
    'renderFTESummaryTable',
    'renderPrioritySettingsTable',
    'editPathway',
    'openAddPathwayModal',
    'handlePathwaySave',
    'openFTEModal',
    'showExportModal',
    'updateExportPreview',
    'exportToExcel',
    'handleFileSelect',
    'parseCSV',
    'confirmImport',
    'openScenariosPanel',
    'closeScenariosPanel',
    'renderScenarioList',
    'loadScenario',
    'saveCurrentScenario',
    'createNewScenario',
    'deleteScenario',
    'duplicateScenario',
    'showHelpModal',
    'loadHelpSection',
    'searchHelp',
    'startInteractiveTour',
    'saveDefaultFTE',
    'loadDefaultFTE',
    'saveDefaultPathways',
    'loadDefaultPathways',
    'getCurrentState',
    'migrateDataToLocations'
];

// Read app.js and check which functions exist
const fs = require('fs');
const content = fs.readFileSync('app.js', 'utf8');

console.log('Checking functions...\n');

functionsToCheck.forEach(func => {
    const functionRegex = new RegExp(`function\\s+${func}\\s*\\(`, 'g');
    const constRegex = new RegExp(`(?:const|let|var)\\s+${func}\\s*=`, 'g');
    
    const exists = functionRegex.test(content) || constRegex.test(content);
    
    if (!exists) {
        console.log(`❌ Missing: ${func}`);
    }
});

console.log('\nCheck complete.');