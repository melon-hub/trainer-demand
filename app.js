/**
 * Pilot Trainer Supply/Demand Planner
 * Organized with namespace pattern for better maintainability
 */

// Create main application namespace
const TrainerApp = {
    // Configuration
    Config: {
        START_YEAR: 2024,
        END_YEAR: 2034,
        FORTNIGHTS_PER_YEAR: 24,
        DEBUG_MODE: false
    },
    
    // Utility functions
    Utils: {},
    
    // Calculation functions
    Calculations: {},
    
    // UI Management
    UI: {
        Dashboard: {},
        Planner: {},
        Settings: {},
        Scenarios: {},
        Modals: {},
        Charts: {}
    },
    
    // Data Management
    Data: {},
    
    // State Management
    State: {},
    
    // Import/Export
    ImportExport: {},
    
    // Help System
    Help: {}
};

// Legacy global constants for backward compatibility
const START_YEAR = TrainerApp.Config.START_YEAR;
const END_YEAR = TrainerApp.Config.END_YEAR;
const FORTNIGHTS_PER_YEAR = TrainerApp.Config.FORTNIGHTS_PER_YEAR;
const DEBUG_MODE = TrainerApp.Config.DEBUG_MODE;

// Add to Config namespace
TrainerApp.Config.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
TrainerApp.Config.FORTNIGHT_TO_MONTH = {
    1: 0, 2: 0,       // Jan
    3: 1, 4: 1,       // Feb
    5: 2, 6: 2,       // Mar
    7: 3, 8: 3,       // Apr
    9: 4, 10: 4,      // May
    11: 5, 12: 5,     // Jun
    13: 6, 14: 6,     // Jul
    15: 7, 16: 7,     // Aug
    17: 8, 18: 8,     // Sep
    19: 9, 20: 9,     // Oct
    21: 10, 22: 10,   // Nov
    23: 11, 24: 11    // Dec
};
TrainerApp.Config.TRAINER_CATEGORIES = ['CATB', 'CATA', 'STP', 'RHS', 'LHS'];
TrainerApp.Config.TRAINER_QUALIFICATIONS = {
    'CATB': ['LT-CAD', 'LT-CP', 'LT-FO'],  // Can do all LT types
    'CATA': ['LT-CAD', 'LT-CP', 'LT-FO'],  // Can do all LT types
    'STP': ['LT-CAD', 'LT-CP', 'LT-FO'],   // Can do all LT types
    'RHS': ['LT-CP', 'LT-FO'],              // Can do LT-CP and LT-FO (NOT LT-CAD)
    'LHS': ['LT-FO']                        // Can only do LT-FO
};

// Legacy globals for backward compatibility
const MONTHS = TrainerApp.Config.MONTHS;
const FORTNIGHT_TO_MONTH = TrainerApp.Config.FORTNIGHT_TO_MONTH;
const TRAINER_CATEGORIES = TrainerApp.Config.TRAINER_CATEGORIES;
const TRAINER_QUALIFICATIONS = TrainerApp.Config.TRAINER_QUALIFICATIONS;

// Move state to State namespace
TrainerApp.State.priorityConfig = [
    {
        priority: 'P1',
        trainingType: 'LT-CAD',
        primaryTrainers: ['CATB', 'CATA', 'STP'],  // Only these can do LT-CAD
        cascadingFrom: []  // No cascading needed - only primary trainers can do this
    },
    {
        priority: 'P2',
        trainingType: 'LT-CP',
        primaryTrainers: ['RHS'],  // RHS is primary for LT-CP
        cascadingFrom: ['CATB', 'CATA', 'STP']  // Can receive help from P1 pool surplus
    },
    {
        priority: 'P3',
        trainingType: 'LT-FO',
        primaryTrainers: ['LHS'],  // LHS is primary for LT-FO
        cascadingFrom: ['CATB', 'CATA', 'STP', 'RHS']  // Can receive help from all other pools
    }
];

TrainerApp.State.currentLocation = 'AU';  // Default location

TrainerApp.State.helpState = {
    currentSection: 'getting-started',
    searchQuery: '',
    tourActive: false
};

TrainerApp.State.dragState = {
    isDragging: false,
    draggedCohort: null,
    originalStartYear: null,
    originalStartFortnight: null,
    mouseStartX: null,
    currentDropYear: null,
    currentDropFortnight: null,
    cellWidth: 50 // Will be updated from CSS
};

TrainerApp.State.locationData = {
    AU: {
        pathways: [],
        trainerFTE: {},
        priorityConfig: [],
        activeCohorts: []
    },
    NZ: {
        pathways: [],
        trainerFTE: {},
        priorityConfig: [],
        activeCohorts: []
    }
};

// Legacy globals for backward compatibility
let priorityConfig = TrainerApp.State.priorityConfig;
var currentLocation = TrainerApp.State.currentLocation;
let helpState = TrainerApp.State.helpState;
let dragState = TrainerApp.State.dragState;
let locationData = TrainerApp.State.locationData;

// Data Structures - Training pathways (legacy - will be migrated)
let pathways = [
    {
        id: "A202",
        name: "A202 - CP",
        type: "CP",
        comments: "",
        startRank: "",
        endRank: "",
        usableMonths: 0,
        phases: [
            { 
                name: "GS+SIM", 
                duration: 2, 
                trainerDemandType: null,
                ratio: 8
            },
            { 
                name: "LT-CP", 
                duration: 6, 
                trainerDemandType: "LT-CP",
                ratio: 2
            }
        ]
    },
    {
        id: "A210",
        name: "A210 - FO",
        type: "FO",
        comments: "",
        startRank: "",
        endRank: "",
        usableMonths: 0,
        phases: [
            { 
                name: "GS+SIM", 
                duration: 4, 
                trainerDemandType: null,
                ratio: 8
            },
            { 
                name: "LT-FO", 
                duration: 4, 
                trainerDemandType: "LT-FO",
                ratio: 2
            },
            { 
                name: "LT-FO", 
                duration: 3, 
                trainerDemandType: "LT-FO",
                ratio: 2
            }
        ]
    },
    {
        id: "A209",
        name: "A209 - CAD",
        type: "CAD",
        comments: "",
        startRank: "",
        endRank: "",
        usableMonths: 0,
        phases: [
            { 
                name: "GS+SIM", 
                duration: 4, 
                trainerDemandType: null,
                ratio: 8
            },
            { 
                name: "LT-CAD", 
                duration: 4, 
                trainerDemandType: "LT-CAD",
                ratio: 2
            },
            { 
                name: "LT-FO", 
                duration: 3, 
                trainerDemandType: "LT-FO",
                ratio: 2
            }
        ]
    },
    {
        id: "A212",
        name: "A212 - CAD",
        type: "CAD",
        comments: "",
        startRank: "",
        endRank: "",
        usableMonths: 0,
        phases: [
            { 
                name: "GS+SIM", 
                duration: 4, 
                trainerDemandType: null,
                ratio: 8
            },
            { 
                name: "LT-CAD", 
                duration: 3, 
                trainerDemandType: "LT-CAD",
                ratio: 2
            },
            { 
                name: "LT-FO", 
                duration: 5, 
                trainerDemandType: "LT-FO",
                ratio: 2
            }
        ]
    },
    {
        id: "A211",
        name: "A211 - CAD",
        type: "CAD",
        comments: "",
        startRank: "",
        endRank: "",
        usableMonths: 0,
        phases: [
            { 
                name: "GS+SIM", 
                duration: 4, 
                trainerDemandType: null,
                ratio: 8
            },
            { 
                name: "LT-CAD", 
                duration: 2, 
                trainerDemandType: "LT-CAD",
                ratio: 2
            },
            { 
                name: "LT-FO", 
                duration: 2, 
                trainerDemandType: "LT-FO",
                ratio: 2
            }
        ]
    },
    {
        id: "A203",
        name: "A203 - CP",
        type: "CP",
        comments: "",
        startRank: "",
        endRank: "",
        usableMonths: 0,
        phases: [
            { 
                name: "GS+SIM", 
                duration: 2, 
                trainerDemandType: null,
                ratio: 8
            },
            { 
                name: "LT-CP", 
                duration: 1, 
                trainerDemandType: "LT-CP",
                ratio: 2
            }
        ]
    }
];

let trainerFTE = {};
// Initialize FTE data for each year and category
for (let year = START_YEAR; year <= END_YEAR; year++) {
    trainerFTE[year] = {};
    TRAINER_CATEGORIES.forEach(category => {
        trainerFTE[year][category] = 240; // Default 240 FTE per category per year (10 per fortnight)
    });
}

// Initialize with demo data
let activeCohorts = [
    {
        id: 1,
        numTrainees: 12,
        pathwayId: "A202",
        startYear: 2024,
        startFortnight: 3,
        location: 'AU',
        crossLocationTraining: {}
    }
];
let nextCohortId = 2;

// View state for filters and grouping
let viewState = {
    groupBy: 'none',
    collapsedGroups: [],
    currentScenarioId: null,
    isDirty: false, // Track if current state has unsaved changes
    currentView: '12months',  // 'all', '6months', '12months'
    viewOffset: 0,       // Offset in months from current date
    surplusDeficitView: 'simple',  // 'simple' or 'detailed'
    currentLocation: 'AU',  // Track current location in view state
    demandSplitByLocation: false,  // Toggle for split view in demand table
    showCrossLocationCommencements: false
};

// Dashboard navigation state - now location-specific
let dashboardViewOffset = {
    AU: 0,
    NZ: 0
};

// Navigate dashboard view
function navigateDashboard(months) {
    if (months === 0) {
        // Reset to today
        dashboardViewOffset[currentLocation] = 0;
    } else {
        dashboardViewOffset[currentLocation] += months;
    }
    
    // Update time display
    const currentDate = new Date();
    const viewDate = new Date(currentDate);
    viewDate.setMonth(viewDate.getMonth() + dashboardViewOffset[currentLocation]);
    
    const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('dashboard-time-display').textContent = dashboardViewOffset[currentLocation] === 0 ? 'Current View' : monthName;
    
    // Only update time-sensitive components for smooth navigation
    updateDashboardForNavigation();
}

// Lightweight dashboard update for navigation (no full reset)
function updateDashboardForNavigation() {
    // Only update metrics that change with time
    updateMetricsV2();
    
    // Update charts smoothly (they already have update logic)
    updateChartsV2();
    
    // Update detail cards that show time-based data
    updateDetailCards();
    
    // Update time-sensitive charts
    updateTrainerHeatmap();
    updateSupplyDemandChart();
    
    // Skip static updates that don't change with navigation:
    // - updatePipelineV2() 
    // - updateAlertsV2()
    // - updatePhaseBreakdown()
    // - updateWorkloadChart()
}

// Scenarios storage - lazy loaded
let scenarios = null;
let selectedForComparison = new Set(); // Track scenarios selected for comparison

// Lazy load scenarios when needed
function getScenarios() {
    if (scenarios === null) {
        perfMonitor.start('loadScenarios');
        const stored = localStorage.getItem('pilotTrainerScenarios');
        scenarios = stored ? JSON.parse(stored) : [];
        perfMonitor.end('loadScenarios');
        // console.log(`[PERF] Loaded ${scenarios.length} scenarios from localStorage`);
    }
    return scenarios;
}

// Helper to check if scenarios are loaded
function scenariosLoaded() {
    return scenarios !== null;
}

// Ensure scenarios are loaded (use this before modifying scenarios)
function ensureScenarios() {
    if (scenarios === null) {
        getScenarios();
    }
}

// DOM Elements - will be initialized after DOM loads
let dashboardView, plannerView, settingsView, scenariosView;
let navTabs, addCohortForm, pathwaySelect, editFTEBtn, saveDefaultFTEBtn, addPathwayBtn, toggleFTEBtn, editPriorityBtn;
let fteModal, pathwayModal, cohortModal, priorityModal, modalCloseButtons, modalCancelButtons;

// Initialize DOM elements after DOMContentLoaded
function initializeDOMElements() {
    dashboardView = document.getElementById('dashboard-view');
    plannerView = document.getElementById('planner-view');
    settingsView = document.getElementById('settings-view');
    scenariosView = document.getElementById('scenarios-view');
    navTabs = document.querySelectorAll('.nav-tab');
    addCohortForm = document.getElementById('add-cohort-form');
    pathwaySelect = document.getElementById('pathway');
    editFTEBtn = document.getElementById('edit-fte-btn');
    saveDefaultFTEBtn = document.getElementById('save-default-fte-btn');
    addPathwayBtn = document.getElementById('add-pathway-btn');
    toggleFTEBtn = document.getElementById('toggle-fte-btn');
    editPriorityBtn = document.getElementById('edit-priority-btn');
    
    // Modal Elements
    fteModal = document.getElementById('fte-modal');
    pathwayModal = document.getElementById('pathway-modal');
    cohortModal = document.getElementById('cohort-modal');
    priorityModal = document.getElementById('priority-modal');
    modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCancelButtons = document.querySelectorAll('.modal-cancel');
}

// Get time range for current view
function getTimeRangeForView() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    
    // For limited views, calculate range based on current month plus offset
    if (viewState.currentView !== 'all') {
        // Apply offset to current month
        let offsetMonth = currentMonth + viewState.viewOffset;
        let offsetYear = currentYear;
        
        // Adjust for year boundaries
        while (offsetMonth < 1) {
            offsetMonth += 12;
            offsetYear--;
        }
        while (offsetMonth > 12) {
            offsetMonth -= 12;
            offsetYear++;
        }
        
        let startMonth, endMonth, startYear, endYear;
        
        switch (viewState.currentView) {
            case '6months':
                // Show 2 months before and 4 months after the offset month
                startMonth = offsetMonth - 2;
                endMonth = offsetMonth + 3;
                break;
            case '12months':
                // Show 2 months before and 10 months after the offset month
                startMonth = offsetMonth - 2;
                endMonth = offsetMonth + 9;
                break;
        }
        
        // Adjust for year boundaries
        startYear = offsetYear;
        endYear = offsetYear;
        
        if (startMonth < 1) {
            startMonth += 12;
            startYear--;
        }
        
        if (endMonth > 12) {
            endYear += Math.floor((endMonth - 1) / 12);
            endMonth = ((endMonth - 1) % 12) + 1;
        }
        
        // Convert months to fortnights
        const startFortnight = (startMonth - 1) * 2 + 1;
        const endFortnight = endMonth * 2;
        
        return { startYear, startFortnight, endYear, endFortnight };
    }
    
    // Default 'all' view
    return {
        startYear: START_YEAR,
        startFortnight: 1,
        endYear: END_YEAR,
        endFortnight: FORTNIGHTS_PER_YEAR
    };
}

// Performance monitoring
const perfMonitor = {
    enabled: false, // Set to true to enable performance logging
    timings: {},
    
    start(operation) {
        if (!this.enabled) return;
        this.timings[operation] = { start: performance.now(), children: {} };
    },
    
    end(operation) {
        if (!this.enabled || !this.timings[operation]) return;
        const duration = performance.now() - this.timings[operation].start;
        // console.log(`[PERF] ${operation}: ${duration.toFixed(2)}ms`);
        return duration;
    },
    
    measure(operation, fn) {
        this.start(operation);
        const result = fn();
        this.end(operation);
        return result;
    },
    
    async measureAsync(operation, fn) {
        this.start(operation);
        const result = await fn();
        this.end(operation);
        return result;
    },
    
    report() {
        // Uncomment for performance debugging
        // console.group('[PERF] Performance Report');
        // Object.entries(this.timings).forEach(([op, data]) => {
        //     const duration = performance.now() - data.start;
        //     console.log(`${op}: ${duration.toFixed(2)}ms`);
        // });
        // console.groupEnd();
    }
};

// Switch location
function switchLocation(newLocation) {
    // Ensure we have a valid location
    if (!newLocation || (newLocation !== 'AU' && newLocation !== 'NZ')) {
        return;
    }
    
    if (currentLocation === newLocation) return;
    
    perfMonitor.start('switchLocation');
    // console.log(`[PERF] Starting location switch from ${currentLocation} to ${newLocation}`);
    
    // Show loading indicator
    const loadingMsg = showNotification(`Switching to ${newLocation}...`, 'info', 0);
    
    // Use requestAnimationFrame to ensure UI updates
    requestAnimationFrame(() => {
        perfMonitor.start('switchLocation.saveCurrentData');
        // Save current location data
        locationData[currentLocation].pathways = pathways;
        locationData[currentLocation].trainerFTE = trainerFTE;
        locationData[currentLocation].priorityConfig = priorityConfig;
        locationData[currentLocation].activeCohorts = activeCohorts;
        perfMonitor.end('switchLocation.saveCurrentData');
        
        perfMonitor.start('switchLocation.loadNewData');
        // Switch to new location
        currentLocation = newLocation;
        viewState.currentLocation = newLocation;
        
        // Save location preference
        localStorage.setItem('currentLocation', newLocation);
        
        // Load new location data
        pathways = locationData[newLocation].pathways;
        trainerFTE = locationData[newLocation].trainerFTE;
        priorityConfig = locationData[newLocation].priorityConfig;
        activeCohorts = locationData[newLocation].activeCohorts;
        perfMonitor.end('switchLocation.loadNewData');
        
        perfMonitor.start('switchLocation.updateUI');
        // Update UI tabs immediately
        document.querySelectorAll('.location-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.location === newLocation);
        });
        document.querySelectorAll('.location-toggle').forEach(toggle => {
            toggle.classList.toggle('active', toggle.dataset.location === newLocation);
        });
        
        // Update HTML data attribute for CSS styling
        document.documentElement.setAttribute('data-location', newLocation);
        
        // Update cross-location button visibility
        const crossLocBtn = document.getElementById('commencement-cross-loc-btn');
        if (crossLocBtn) {
            crossLocBtn.style.display = newLocation === 'AU' ? '' : 'none';
        }
        perfMonitor.end('switchLocation.updateUI');
        
        // Defer heavy rendering operations
        setTimeout(() => {
            perfMonitor.start('switchLocation.renderViews');
            // Only update visible views
            const activeView = document.querySelector('.view.active');
            
            if (activeView) {
                if (activeView.id === 'dashboard-view') {
                    perfMonitor.start('switchLocation.updateDashboard');
                    // Initialize dashboard view offset if not already set for new location
                    if (dashboardViewOffset[newLocation] === undefined) {
                        dashboardViewOffset[newLocation] = 0;
                    }
                    // Destroy existing charts to prevent conflicts
                    if (window.demandChartV2) {
                        window.demandChartV2.destroy();
                        window.demandChartV2 = null;
                    }
                    if (window.distributionChartV2) {
                        window.distributionChartV2.destroy();
                        window.distributionChartV2 = null;
                    }
                    // Update dashboard with slight delay to ensure UI is ready
                    setTimeout(() => {
                        updateDashboardV2();
                        perfMonitor.end('switchLocation.updateDashboard');
                    }, 50);
                } else if (activeView.id === 'planner-view') {
                    perfMonitor.start('switchLocation.updateTables');
                    updateAllTables();
                    perfMonitor.end('switchLocation.updateTables');
                    
                    // Check for deficits after location switch
                    checkForDeficits();
                    
                    perfMonitor.start('switchLocation.renderGantt');
                    renderGanttChart();
                    perfMonitor.end('switchLocation.renderGantt');
                } else if (activeView.id === 'settings-view') {
                    renderPathwaysTable();
                    renderPrioritySettingsTable();
                }
            }
            perfMonitor.end('switchLocation.renderViews');
            
            populatePathwaySelect();
            
            // Remove loading message
            if (loadingMsg && loadingMsg.remove) {
                loadingMsg.remove();
            }
            
            // Show completion notification
            showNotification(`Switched to ${newLocation} location`, 'success');
            
            perfMonitor.end('switchLocation');
            perfMonitor.report();
        }, 10);
    });
}

// Migrate existing data to location-aware structure
function migrateDataToLocations() {
    // Check if migration is needed
    if (locationData.AU.pathways.length > 0) {
        return; // Already migrated
    }
    
    // Migrate pathways to AU
    locationData.AU.pathways = [...pathways];
    
    // Migrate FTE to AU
    locationData.AU.trainerFTE = JSON.parse(JSON.stringify(trainerFTE));
    
    // Migrate priority config to AU
    locationData.AU.priorityConfig = JSON.parse(JSON.stringify(priorityConfig));
    
    // Migrate active cohorts to AU (add location property and crossLocationTraining)
    locationData.AU.activeCohorts = activeCohorts.map(cohort => ({
        ...cohort,
        location: 'AU',
        crossLocationTraining: cohort.crossLocationTraining || {}
    }));
    
    // Initialize NZ with copy of AU pathways
    locationData.NZ.pathways = JSON.parse(JSON.stringify(pathways));
    
    // Initialize NZ FTE
    locationData.NZ.trainerFTE = {};
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        locationData.NZ.trainerFTE[year] = {};
        TRAINER_CATEGORIES.forEach(category => {
            locationData.NZ.trainerFTE[year][category] = 240; // Default FTE
        });
    }
    
    // Copy priority config to NZ
    locationData.NZ.priorityConfig = JSON.parse(JSON.stringify(priorityConfig));
    
    // Empty cohorts for NZ
    locationData.NZ.activeCohorts = [
        {
            id: 101,
            numTrainees: 1,
            pathwayId: "H209",
            startYear: 2025,
            startFortnight: 13,  // July is fortnight 13
            location: 'NZ',
            crossLocationTraining: {}
        },
        {
            id: 102,
            numTrainees: 1,
            pathwayId: "H209",
            startYear: 2025,
            startFortnight: 13,  // July is fortnight 13
            location: 'NZ',
            crossLocationTraining: {}
        }
    ];
    
    // Update current references to point to AU data
    pathways = locationData.AU.pathways;
    trainerFTE = locationData.AU.trainerFTE;
    priorityConfig = locationData.AU.priorityConfig;
    activeCohorts = locationData.AU.activeCohorts;
}

// Dashboard v2 Functions
let demandChartV2 = null;
let distributionChartV2 = null;
let acknowledgedAlerts = new Set(JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]'));

function initDashboardToggle() {
    // Always use enhanced dashboard
    const classicDashboard = document.getElementById('dashboard-classic');
    const enhancedDashboard = document.getElementById('dashboard-enhanced');
    
    if (classicDashboard) {
        classicDashboard.style.display = 'none';
    }
    if (enhancedDashboard) {
        enhancedDashboard.style.display = 'block';
    }
    
    // Always update enhanced dashboard
    updateDashboardV2();
}

function calculateMetricTrends() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + dashboardViewOffset);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentFortnight = (currentMonth * 2) + (currentDate.getDate() <= 14 ? 1 : 2);
    
    // Calculate previous period (1 month ago)
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
    }
    const prevFortnight = (prevMonth * 2) + 1;
    
    // Current metrics
    const currentMetrics = calculateMetricsForPeriod(currentYear, currentFortnight);
    const prevMetrics = calculateMetricsForPeriod(prevYear, prevFortnight);
    
    // Calculate trends
    const trends = {
        totalTrainees: {
            current: currentMetrics.totalTrainees,
            previous: prevMetrics.totalTrainees,
            change: currentMetrics.totalTrainees - prevMetrics.totalTrainees,
            percentage: prevMetrics.totalTrainees > 0 ? 
                ((currentMetrics.totalTrainees - prevMetrics.totalTrainees) / prevMetrics.totalTrainees * 100).toFixed(1) : 0
        },
        utilization: {
            current: currentMetrics.utilization,
            previous: prevMetrics.utilization,
            change: currentMetrics.utilization - prevMetrics.utilization,
            percentage: (currentMetrics.utilization - prevMetrics.utilization).toFixed(1)
        },
        upcomingCompletions: {
            current: currentMetrics.upcomingCompletions,
            previous: prevMetrics.upcomingCompletions,
            change: currentMetrics.upcomingCompletions - prevMetrics.upcomingCompletions,
            percentage: prevMetrics.upcomingCompletions > 0 ? 
                ((currentMetrics.upcomingCompletions - prevMetrics.upcomingCompletions) / prevMetrics.upcomingCompletions * 100).toFixed(1) : 0
        },
        capacityWarnings: {
            current: currentMetrics.capacityWarnings,
            previous: prevMetrics.capacityWarnings,
            change: currentMetrics.capacityWarnings - prevMetrics.capacityWarnings,
            percentage: prevMetrics.capacityWarnings > 0 ? 
                ((currentMetrics.capacityWarnings - prevMetrics.capacityWarnings) / prevMetrics.capacityWarnings * 100).toFixed(1) : 0
        }
    };
    
    return trends;
}

function calculateMetricsForPeriod(year, fortnight) {
    let totalTrainees = 0;
    let upcomingCompletions = 0;
    
    // Use location-specific data
    const locationCohorts = (locationData && currentLocation && locationData[currentLocation]) ? 
        locationData[currentLocation].activeCohorts : activeCohorts;
    const locationPathways = (locationData && currentLocation && locationData[currentLocation]) ? 
        locationData[currentLocation].pathways : pathways;
    
    locationCohorts.forEach(cohort => {
        const pathway = locationPathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        const duration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
        let endFortnight = cohort.startFortnight + duration - 1;
        let endYear = cohort.startYear;
        
        while (endFortnight > FORTNIGHTS_PER_YEAR) {
            endFortnight -= FORTNIGHTS_PER_YEAR;
            endYear++;
        }
        
        // Check if cohort is in training during this period
        const startPassed = cohort.startYear < year || 
            (cohort.startYear === year && cohort.startFortnight <= fortnight);
        const endNotReached = endYear > year || 
            (endYear === year && endFortnight >= fortnight);
            
        if (startPassed && endNotReached) {
            totalTrainees += cohort.numTrainees;
        }
        
        // Check if completing in next 3 months from this period
        const monthsAhead = 6;
        let futureYear = year;
        let futureFortnight = fortnight + monthsAhead;
        while (futureFortnight > FORTNIGHTS_PER_YEAR) {
            futureFortnight -= FORTNIGHTS_PER_YEAR;
            futureYear++;
        }
        
        const completingSoon = (endYear === year && endFortnight > fortnight && endFortnight <= fortnight + monthsAhead) ||
            (endYear === futureYear && endFortnight <= futureFortnight);
            
        if (completingSoon) {
            upcomingCompletions += cohort.numTrainees;
        }
    });
    
    // Calculate trainer utilization
    const { demand } = calculateDemand();
    const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? locationData[currentLocation].trainerFTE : trainerFTE;
    const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
        sum + (locationFTE[year]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR;
    const currentDemand = demand[year]?.[fortnight]?.total || 0;
    const utilization = totalSupply > 0 ? Math.round((currentDemand / totalSupply) * 100) : 0;
    
    // Count capacity warnings
    let capacityWarnings = 0;
    for (let checkYear in demand) {
        for (let fn in demand[checkYear]) {
            const supply = totalSupply;
            const demandValue = demand[checkYear][fn].total;
            if (demandValue > supply) {
                capacityWarnings++;
            }
        }
    }
    
    return {
        totalTrainees,
        utilization,
        upcomingCompletions,
        capacityWarnings
    };
}

// FTE Default Management
function saveDefaultFTE() {
    const defaultFTE = {
        AU: JSON.parse(JSON.stringify(locationData.AU.trainerFTE)),
        NZ: JSON.parse(JSON.stringify(locationData.NZ.trainerFTE))
    };
    localStorage.setItem('defaultFTE', JSON.stringify(defaultFTE));
}

function saveDefaultPathways() {
    const defaultPathways = {
        AU: JSON.parse(JSON.stringify(locationData.AU.pathways)),
        NZ: JSON.parse(JSON.stringify(locationData.NZ.pathways))
    };
    localStorage.setItem('defaultPathways', JSON.stringify(defaultPathways));
    // console.log('Saved pathways to localStorage');
}

function loadDefaultPathways() {
    const defaultPathways = localStorage.getItem('defaultPathways');
    if (defaultPathways) {
        try {
            const parsed = JSON.parse(defaultPathways);
            if (parsed.AU) {
                locationData.AU.pathways = JSON.parse(JSON.stringify(parsed.AU));
            }
            if (parsed.NZ) {
                locationData.NZ.pathways = JSON.parse(JSON.stringify(parsed.NZ));
            }
            // Update global pathways with current location
            pathways = locationData[currentLocation].pathways;
            return true;
        } catch (e) {
            console.error('Failed to load default pathways:', e);
        }
    }
    return false;
}

function loadDefaultFTE() {
    const defaultFTE = localStorage.getItem('defaultFTE');
    if (defaultFTE) {
        try {
            const parsed = JSON.parse(defaultFTE);
            if (parsed.AU) {
                locationData.AU.trainerFTE = JSON.parse(JSON.stringify(parsed.AU));
            }
            if (parsed.NZ) {
                locationData.NZ.trainerFTE = JSON.parse(JSON.stringify(parsed.NZ));
            }
            return true;
        } catch (e) {
            console.error('Error loading default FTE:', e);
        }
    }
    return false;
}

// Migrate old scenarios to include AU/NZ stats
function migrateScenarioStats() {
    const scenarios = getScenarios();
    let migrated = 0;
    
    scenarios.forEach(scenario => {
        // Check if scenario needs migration (missing AU/NZ stats)
        if (!scenario.stats.auCohorts && !scenario.stats.nzCohorts) {
            if (scenario.state.locationData) {
                // New format scenario with locationData
                scenario.stats.auCohorts = scenario.state.locationData.AU?.activeCohorts?.length || 0;
                scenario.stats.nzCohorts = scenario.state.locationData.NZ?.activeCohorts?.length || 0;
                scenario.stats.auTrainees = scenario.state.locationData.AU?.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0;
                scenario.stats.nzTrainees = scenario.state.locationData.NZ?.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0;
            } else if (scenario.state.cohorts) {
                // Legacy format - check cohorts for location property
                const auCohorts = scenario.state.cohorts.filter(c => !c.location || c.location === 'AU');
                const nzCohorts = scenario.state.cohorts.filter(c => c.location === 'NZ');
                
                scenario.stats.auCohorts = auCohorts.length;
                scenario.stats.nzCohorts = nzCohorts.length;
                scenario.stats.auTrainees = auCohorts.reduce((sum, c) => sum + c.numTrainees, 0);
                scenario.stats.nzTrainees = nzCohorts.reduce((sum, c) => sum + c.numTrainees, 0);
            } else {
                // Fallback - all cohorts go to AU
                scenario.stats.auCohorts = scenario.stats.totalCohorts || 0;
                scenario.stats.nzCohorts = 0;
                scenario.stats.auTrainees = scenario.stats.totalTrainees || 0;
                scenario.stats.nzTrainees = 0;
            }
            migrated++;
        }
    });
    
    if (migrated > 0) {
        // Save the migrated scenarios
        localStorage.setItem('pilotTrainerScenarios', JSON.stringify(scenarios));
        console.log(`Migrated ${migrated} scenarios to include AU/NZ stats`);
    }
}

// Setup keyboard shortcuts for navigation
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        // Only work in planner view
        if (!document.getElementById('planner-view').classList.contains('active')) {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                document.getElementById('nav-left')?.click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                document.getElementById('nav-right')?.click();
                break;
            case 'Home':
                e.preventDefault();
                document.getElementById('today-btn')?.click();
                break;
        }
    });
}

// Setup column highlighting system
let highlightedColumns = new Set();

function setupColumnHighlighting() {
    // Clear highlights when clicking outside of headers
    document.addEventListener('click', (e) => {
        // Check if click is on a header cell
        const isHeaderClick = e.target.closest('.month-header, .fortnight-header');
        const isWithinTable = e.target.closest('.table-container, .gantt-container');
        
        if (!isHeaderClick && isWithinTable) {
            clearAllHighlights();
        }
    });
    
    // Escape key to clear
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearAllHighlights();
        }
    });
}

function handleColumnClick(e, year, fortnight) {
    e.stopPropagation();
    
    const columnId = `${year}-${fortnight}`;
    
    // Show hint on first use
    if (highlightedColumns.size === 0 && !localStorage.getItem('columnHighlightHintShown')) {
        showNotification('💡 Tip: Ctrl+Click for multi-select, Shift+Click for range select', 'info', 5000);
        localStorage.setItem('columnHighlightHintShown', 'true');
    }
    
    if (e.ctrlKey || e.metaKey) {
        // Multi-select mode
        if (highlightedColumns.has(columnId)) {
            highlightedColumns.delete(columnId);
        } else {
            highlightedColumns.add(columnId);
        }
    } else if (e.shiftKey && highlightedColumns.size > 0) {
        // Range select
        const lastColumn = Array.from(highlightedColumns).pop();
        selectRange(lastColumn, columnId);
    } else {
        // Single select - clear others first
        highlightedColumns.clear();
        highlightedColumns.add(columnId);
    }
    
    applyHighlights();
}

function selectRange(startCol, endCol) {
    const [startYear, startFn] = startCol.split('-').map(Number);
    const [endYear, endFn] = endCol.split('-').map(Number);
    
    let currentYear = startYear;
    let currentFn = startFn;
    
    // Clear existing highlights for clean range
    highlightedColumns.clear();
    
    // Determine direction
    const goingForward = (endYear > startYear) || (endYear === startYear && endFn >= startFn);
    
    while (true) {
        highlightedColumns.add(`${currentYear}-${currentFn}`);
        
        if (currentYear === endYear && currentFn === endFn) break;
        
        if (goingForward) {
            currentFn++;
            if (currentFn > FORTNIGHTS_PER_YEAR) {
                currentFn = 1;
                currentYear++;
            }
        } else {
            currentFn--;
            if (currentFn < 1) {
                currentFn = FORTNIGHTS_PER_YEAR;
                currentYear--;
            }
        }
        
        // Safety check
        if (currentYear < START_YEAR || currentYear > END_YEAR) break;
    }
}

function applyHighlights() {
    // Remove all existing highlights and edge classes
    document.querySelectorAll('.column-highlighted, .column-left-edge, .column-right-edge').forEach(el => {
        el.classList.remove('column-highlighted', 'column-left-edge', 'column-right-edge');
    });
    
    // Convert Set to sorted array to find edges
    const sortedColumns = Array.from(highlightedColumns).sort((a, b) => {
        const [yearA, fnA] = a.split('-').map(Number);
        const [yearB, fnB] = b.split('-').map(Number);
        return yearA !== yearB ? yearA - yearB : fnA - fnB;
    });
    
    // Apply new highlights with edge detection
    sortedColumns.forEach((columnId, index) => {
        const prevId = index > 0 ? sortedColumns[index - 1] : null;
        const nextId = index < sortedColumns.length - 1 ? sortedColumns[index + 1] : null;
        
        // Check if this column is adjacent to previous/next
        const isLeftEdge = !prevId || !isAdjacent(prevId, columnId);
        const isRightEdge = !nextId || !isAdjacent(columnId, nextId);
        
        // Highlight all cells with matching data-column attribute
        document.querySelectorAll(`[data-column="${columnId}"]`).forEach(el => {
            el.classList.add('column-highlighted');
            if (isLeftEdge) el.classList.add('column-left-edge');
            if (isRightEdge) el.classList.add('column-right-edge');
        });
    });
    
    // Show/hide clear button
    updateClearHighlightsButton();
}

// Helper function to check if two columns are adjacent
function isAdjacent(col1, col2) {
    const [year1, fn1] = col1.split('-').map(Number);
    const [year2, fn2] = col2.split('-').map(Number);
    
    if (year1 === year2) {
        return fn2 === fn1 + 1;
    } else if (year2 === year1 + 1) {
        return fn1 === FORTNIGHTS_PER_YEAR && fn2 === 1;
    }
    return false;
}

function clearAllHighlights() {
    highlightedColumns.clear();
    document.querySelectorAll('.column-highlighted, .column-left-edge, .column-right-edge').forEach(el => {
        el.classList.remove('column-highlighted', 'column-left-edge', 'column-right-edge');
    });
    updateClearHighlightsButton();
}

function updateClearHighlightsButton() {
    const button = document.getElementById('clear-highlights-btn');
    const countSpan = document.getElementById('highlight-count');
    
    if (button) {
        const hasHighlights = highlightedColumns.size > 0;
        button.classList.toggle('visible', hasHighlights);
        
        if (countSpan) {
            countSpan.textContent = highlightedColumns.size;
        }
    }
}

// Setup sticky navigation shadow effect
function setupStickyNavigation() {
    const viewControlsSection = document.querySelector('.view-controls-section');
    if (!viewControlsSection) return;
    
    let ticking = false;
    
    function updateStickyClass() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 10) {
            viewControlsSection.classList.add('sticky');
        } else {
            viewControlsSection.classList.remove('sticky');
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateStickyClass);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Initialize the application
function init() {
    perfMonitor.start('init');
    // console.log('[PERF] Starting application initialization');
    
    // Initialize DOM elements first
    initializeDOMElements();
    
    perfMonitor.start('init.migrate');
    migrateDataToLocations(); // Migrate data first
    migrateScenarioStats(); // Migrate scenario stats to include AU/NZ split
    perfMonitor.end('init.migrate');
    
    perfMonitor.start('init.loadDefaults');
    // Load default FTE if available
    if (loadDefaultFTE()) {
        // console.log('Loaded default FTE from localStorage');
        // console.log('AU FTE after loading defaults:', locationData.AU.trainerFTE);
        // console.log('NZ FTE after loading defaults:', locationData.NZ.trainerFTE);
    } else {
        // console.log('No default FTE found in localStorage');
    }
    
    // Load default pathways if available
    if (loadDefaultPathways()) {
        // console.log('Loaded default pathways from localStorage');
    } else {
        // console.log('No default pathways found in localStorage');
    }
    perfMonitor.end('init.loadDefaults');
    
    perfMonitor.start('init.loadLocation');
    // Load saved location preference
    const savedLocation = localStorage.getItem('currentLocation');
    if (savedLocation && (savedLocation === 'AU' || savedLocation === 'NZ')) {
        currentLocation = savedLocation;
        viewState.currentLocation = savedLocation;
    }
    
    // Load the correct location data
    if (locationData && locationData[currentLocation]) {
        pathways = locationData[currentLocation].pathways;
        trainerFTE = locationData[currentLocation].trainerFTE;
        priorityConfig = locationData[currentLocation].priorityConfig;
        activeCohorts = locationData[currentLocation].activeCohorts;
        // console.log('Setting global trainerFTE from location data:');
        // console.log('Current location:', currentLocation);
        // console.log('Global trainerFTE now:', trainerFTE);
    }
    
    // Update UI to reflect saved location
    document.querySelectorAll('.location-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.location === currentLocation);
    });
    document.querySelectorAll('.location-toggle').forEach(toggle => {
        toggle.classList.toggle('active', toggle.dataset.location === currentLocation);
    });
    
    // Set HTML attribute
    document.documentElement.setAttribute('data-location', currentLocation);
    
    perfMonitor.end('init.loadLocation');
    
    perfMonitor.start('init.darkMode');
    // Initialize dark mode FIRST to prevent flash
    initDarkMode();
    perfMonitor.end('init.darkMode');
    
    perfMonitor.start('init.dashboardToggle');
    // Initialize dashboard toggle
    initDashboardToggle();
    perfMonitor.end('init.dashboardToggle');
    
    perfMonitor.start('init.loadScenario');
    // Auto-load last scenario BEFORE initial render
    const lastScenarioId = localStorage.getItem('lastScenarioId');
    let scenarioLoaded = false;
    const loadedScenarios = getScenarios();
    if (lastScenarioId && loadedScenarios.length > 0) {
        const scenario = loadedScenarios.find(s => s.id === parseInt(lastScenarioId));
        if (scenario) {
            // console.log(`Auto-loading last scenario: ${scenario.name}`);
            // Load scenario data directly without UI updates
            loadScenarioDataOnly(scenario);
            scenarioLoaded = true;
            // console.log('After loading scenario:');
            // console.log('AU FTE after scenario:', locationData.AU.trainerFTE);
            // console.log('Global trainerFTE after scenario:', trainerFTE);
            // Delay notification until after UI is ready
            setTimeout(() => {
                showNotification(`Loaded: ${scenario.name}`, 'info');
            }, 500);
        }
    }
    perfMonitor.end('init.loadScenario');
    
    perfMonitor.start('init.setupUI');
    setupEventListeners();
    populatePathwaySelect();
    populateYearSelect();
    populateFortnightSelect();
    adjustColumnWidths(); // Set initial column widths
    
    // Ensure location toggles reflect current state after event listeners are attached
    // Force update the visual state
    document.querySelectorAll('.location-toggle').forEach(toggle => {
        const isActive = toggle.dataset.location === currentLocation;
        toggle.classList.toggle('active', isActive);
        
        // Also ensure the HTML attribute is set correctly
        if (isActive) {
            document.documentElement.setAttribute('data-location', currentLocation);
        }
    });
    
    // Mark UI elements as initialized to prevent flicker
    document.querySelector('.view-controls')?.classList.add('initialized');
    perfMonitor.end('init.setupUI');
    
    perfMonitor.start('init.renderViews');
    // Now render everything once
    updateAllTables();
    renderGanttChart();
    perfMonitor.end('init.renderViews');
    
    // Ensure sync is established after initial render
    setTimeout(() => {
        setupSynchronizedScrolling();
        updateNavigationButtons(); // Initialize navigation button state
    }, 100);
    
    // Extra sync for ALL view after everything settles
    setTimeout(() => {
        if (viewState.currentView === 'all') {
            setupSynchronizedScrolling();
            // console.log('Extra sync setup for ALL view on init');
        }
    }, 500);
    
    perfMonitor.start('init.switchView');
    // Restore last active tab or start with dashboard
    const lastActiveTab = localStorage.getItem('activeTab') || 'dashboard';
    switchView(lastActiveTab);
    perfMonitor.end('init.switchView');
    
    // Force dashboard update if we loaded a scenario and we're on dashboard
    if (scenarioLoaded && lastActiveTab === 'dashboard') {
        setTimeout(() => {
            // console.log('Force updating dashboard after scenario load');
            // console.log('Global trainerFTE at dashboard update:', trainerFTE);
            // console.log('Location FTE at dashboard update:', locationData[currentLocation].trainerFTE);
            updateDashboardV2();
        }, 200);
    }
    
    // Mark initial load complete
    setTimeout(() => {
        isInitialLoad = false;
        document.body.classList.add('initialized');
        perfMonitor.end('init');
        perfMonitor.report();
    }, 100);
    
    // Extra sync setup after everything is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (plannerView.classList.contains('active')) {
                setupSynchronizedScrolling();
                // console.log('Final sync setup after page load');
            }
        }, 500);
    });
    
    // Setup sticky navigation shadow
    setupStickyNavigation();
    
    // Setup keyboard shortcuts for navigation
    setupKeyboardShortcuts();
    
    // Setup column highlighting
    setupColumnHighlighting();
    
    // Initialize deficit detection
    initializeDeficitDetection();
    
    // Show refresh notification if page was reloaded
    if (performance.navigation && performance.navigation.type === 1) {
        // Type 1 is reload
        setTimeout(() => {
            showCenterNotification('Page refreshed');
        }, 100);
    } else if (performance.getEntriesByType && performance.getEntriesByType("navigation").length > 0) {
        // Modern API
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries[0].type === "reload") {
            setTimeout(() => {
                showCenterNotification('Page refreshed');
            }, 100);
        }
    }
}

// Helper function to generate data cell with column tracking
function generateDataCell(year, fortnight, content, additionalClasses = '', additionalStyles = '') {
    return `<td class="data-cell ${additionalClasses}" 
               data-column="${year}-${fortnight}" 
               ${additionalStyles ? `style="${additionalStyles}"` : ''}>${content}</td>`;
}

// Generate table headers with months and fortnights
function generateTableHeaders(includeYearColumn = true, includeLabels = true) {
    let monthHeaders = '';
    let fortnightHeaders = '';
    
    // Get time range based on current view
    const range = getTimeRangeForView();
    
    // First column header for month row (spans 2 rows)
    if (includeYearColumn && includeLabels) {
        monthHeaders += '<th rowspan="2" class="sticky-first-column">Metric</th>';
    }
    
    // Generate month headers for the range
    let currentYear = range.startYear;
    let currentFn = range.startFortnight;
    let monthCounts = {};
    
    // First pass: count fortnights per month within the range
    let tempYear = range.startYear;
    let tempFn = range.startFortnight;
    while (tempYear < range.endYear || (tempYear === range.endYear && tempFn <= range.endFortnight)) {
        const monthIndex = Math.floor((tempFn - 1) / 2);
        const monthKey = `${MONTHS[monthIndex]}-${tempYear}`;
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
        
        tempFn++;
        if (tempFn > FORTNIGHTS_PER_YEAR) {
            tempFn = 1;
            tempYear++;
        }
    }
    
    // Second pass: create month headers
    currentYear = range.startYear;
    currentFn = range.startFortnight;
    let lastMonth = null;
    let monthSpan = 0;
    
    while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
        const monthIndex = Math.floor((currentFn - 1) / 2);
        const monthKey = `${MONTHS[monthIndex]}-${currentYear}`;
        
        if (lastMonth !== monthKey) {
            if (lastMonth && monthSpan > 0) {
                monthHeaders += `<th colspan="${monthSpan}" class="month-header">${lastMonth}</th>`;
            }
            lastMonth = monthKey;
            monthSpan = 0;
        }
        monthSpan++;
        
        // Add fortnight header with click handler and data attribute
        fortnightHeaders += `<th class="fortnight-header" data-column="${currentYear}-${currentFn}" 
                                 onclick="handleColumnClick(event, ${currentYear}, ${currentFn})"
                                 style="cursor: pointer;">FN${String(currentFn).padStart(2, '0')}</th>`;
        
        currentFn++;
        if (currentFn > FORTNIGHTS_PER_YEAR) {
            currentFn = 1;
            currentYear++;
        }
    }
    
    // Add the last month header
    if (lastMonth && monthSpan > 0) {
        monthHeaders += `<th colspan="${monthSpan}" class="month-header">${lastMonth}</th>`;
    }
    
    return {
        monthRow: `<tr>${monthHeaders}</tr>`,
        fortnightRow: `<tr>${fortnightHeaders}</tr>`
    };
}

// Setup Event Listeners
function setupEventListeners() {
    // Navigation tabs
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchView(e.target.dataset.view);
        });
    });

    // Add Cohort form
    if (addCohortForm) {
        addCohortForm.addEventListener('submit', handleAddCohort);
    }

    // Edit FTE button
    if (editFTEBtn) {
        editFTEBtn.addEventListener('click', openFTEModal);
    }

    // Save Default FTE button
    if (saveDefaultFTEBtn) {
        saveDefaultFTEBtn.addEventListener('click', () => {
            saveDefaultFTE();
            showNotification('FTE values saved as default', 'success');
        });
    }

    // Add Pathway button
    if (addPathwayBtn) {
        addPathwayBtn.addEventListener('click', openAddPathwayModal);
    }

    // Toggle FTE Summary button
    if (toggleFTEBtn) {
        toggleFTEBtn.addEventListener('click', toggleFTESummary);
    }
    
    // Render commencement summary on page load (no longer collapsible)
    renderCommencementSummary();
    
    // Edit Priority button
    if (editPriorityBtn) {
        editPriorityBtn.addEventListener('click', openPriorityModal);
    }
    
    // Location tab switching (Settings page)
    const locationTabs = document.querySelectorAll('.location-tab');
    locationTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const newLocation = e.target.dataset.location;
            switchLocation(newLocation);
        });
    });
    
    // Location toggle switching (Header)
    const locationToggles = document.querySelectorAll('.location-toggle');
    locationToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Use currentTarget to ensure we get the button, not child elements
            const newLocation = e.currentTarget.dataset.location;
            
            if (newLocation) {
                switchLocation(newLocation);
            }
        });
    });

    // Modal controls
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    modalCancelButtons.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // FTE Edit form
    const fteEditForm = document.getElementById('fte-edit-form');
    if (fteEditForm) {
        fteEditForm.addEventListener('submit', handleFTEUpdate);
    }

    // Pathway Edit form
    const pathwayEditForm = document.getElementById('pathway-edit-form');
    if (pathwayEditForm) {
        pathwayEditForm.addEventListener('submit', handlePathwaySave);
    }

    // Add Phase button
    const addPhaseBtn = document.getElementById('add-phase-btn');
    if (addPhaseBtn) {
        addPhaseBtn.addEventListener('click', addPhaseInput);
    }
    
    // Cohort Edit form
    const cohortEditForm = document.getElementById('cohort-edit-form');
    if (cohortEditForm) {
        cohortEditForm.addEventListener('submit', handleCohortUpdate);
    }
    
    // Cross-location training checkbox
    const enableCrossLocation = document.getElementById('enable-cross-location');
    if (enableCrossLocation) {
        enableCrossLocation.addEventListener('change', (e) => {
            const crossLocationConfig = document.getElementById('cross-location-config');
            crossLocationConfig.style.display = e.target.checked ? 'block' : 'none';
            
            if (e.target.checked) {
                const cohortId = parseInt(document.getElementById('cohort-edit-form').dataset.editingCohortId);
                const cohort = activeCohorts.find(c => c.id === cohortId);
                if (cohort) {
                    generateCrossLocationUI(cohort);
                }
            }
        });
    }
    
    // Pathway dropdown change event to adjust modal width
    const editPathwaySelect = document.getElementById('edit-pathway');
    if (editPathwaySelect) {
        editPathwaySelect.addEventListener('change', (e) => {
            const pathwayId = e.target.value;
            const pathway = pathways.find(p => p.id === pathwayId);
            
            if (pathway) {
                const modal = document.querySelector('#cohort-modal .modal-content');
                if (modal) {
                    // Calculate total duration of LT phases
                    let totalLTDuration = 0;
                    pathway.phases.forEach(phase => {
                        if (phase.trainerDemandType) {
                            totalLTDuration += phase.duration;
                        }
                    });
                    
                    // Simple width calculation
                    if (totalLTDuration > 0) {
                        // Location column (80px) + fortnight columns (45px each) + padding
                        const tableWidth = 80 + (totalLTDuration * 45);
                        // Add 10% for padding, borders, and breathing room
                        const modalWidth = Math.ceil(tableWidth * 1.1) + 100; // +100 for modal padding
                        modal.style.maxWidth = modalWidth + 'px';
                    } else {
                        modal.style.maxWidth = '';
                    }
                }
                
                // Update cross-location UI if enabled
                if (enableCrossLocation.checked) {
                    const cohortId = parseInt(document.getElementById('cohort-edit-form').dataset.editingCohortId);
                    const cohort = activeCohorts.find(c => c.id === cohortId);
                    if (cohort) {
                        // Create a temporary cohort object with the new pathway
                        const tempCohort = { ...cohort, pathwayId: pathwayId };
                        generateCrossLocationUI(tempCohort);
                    }
                }
            }
        });
    }
    
    // Group by filter
    const groupByFilter = document.getElementById('group-by-filter');
    if (groupByFilter) {
        groupByFilter.addEventListener('change', handleGroupByChange);
    }
    
    // Scenarios management
    const saveCurrentBtn = document.getElementById('save-current-scenario');
    const updateCurrentBtn = document.getElementById('update-current-scenario');
    const scenarioSearchInput = document.getElementById('scenario-search');
    
    if (saveCurrentBtn) {
        saveCurrentBtn.addEventListener('click', saveCurrentScenario);
    }
    
    if (updateCurrentBtn) {
        updateCurrentBtn.addEventListener('click', updateCurrentScenario);
    }
    
    if (scenarioSearchInput) {
        scenarioSearchInput.addEventListener('input', filterScenarios);
    }
    
    // Export/Import buttons
    const newScenarioBtn = document.getElementById('new-scenario');
    const exportAllBtn = document.getElementById('export-all-scenarios');
    const importBtn = document.getElementById('import-scenarios');
    const importFileInput = document.getElementById('import-file-input');
    const compareBtn = document.getElementById('compare-scenarios');
    
    if (newScenarioBtn) {
        newScenarioBtn.addEventListener('click', createNewScenario);
    }
    
    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', exportAllScenarios);
    }
    
    if (importBtn) {
        importBtn.addEventListener('click', () => importFileInput.click());
    }
    
    if (importFileInput) {
        importFileInput.addEventListener('change', importScenarios);
    }
    
    if (compareBtn) {
        compareBtn.addEventListener('click', compareScenarios);
    }
    
    // Sort dropdown
    const scenarioSort = document.getElementById('scenario-sort');
    if (scenarioSort) {
        scenarioSort.addEventListener('change', () => {
            renderScenarioList();
            filterScenarios(); // Re-apply search filter
        });
    }
    
    // View toggle buttons
    const viewGridBtn = document.getElementById('view-grid');
    const viewListBtn = document.getElementById('view-list');
    const scenarioList = document.getElementById('scenario-list');
    
    if (viewGridBtn && viewListBtn) {
        viewGridBtn.addEventListener('click', () => {
            viewGridBtn.classList.add('active');
            viewListBtn.classList.remove('active');
            scenarioList.classList.remove('list-view');
            localStorage.setItem('scenarioViewMode', 'grid');
        });
        
        viewListBtn.addEventListener('click', () => {
            viewListBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
            scenarioList.classList.add('list-view');
            localStorage.setItem('scenarioViewMode', 'list');
        });
        
        // Load saved view preference
        const savedViewMode = localStorage.getItem('scenarioViewMode');
        if (savedViewMode === 'list') {
            viewListBtn.click();
        }
    }
    
    // Scenario Save Modal
    const scenarioSaveModal = document.getElementById('scenario-save-modal');
    const scenarioSaveForm = document.getElementById('scenario-save-form');
    const scenarioModalClose = scenarioSaveModal?.querySelector('.modal-close');
    const scenarioModalCancel = scenarioSaveModal?.querySelector('.modal-cancel');
    
    if (scenarioSaveForm) {
        scenarioSaveForm.addEventListener('submit', handleScenarioSave);
    }
    
    if (scenarioModalClose) {
        scenarioModalClose.addEventListener('click', closeScenarioModal);
    }
    
    if (scenarioModalCancel) {
        scenarioModalCancel.addEventListener('click', closeScenarioModal);
    }
    
    // Close modal on outside click
    if (scenarioSaveModal) {
        scenarioSaveModal.addEventListener('click', (e) => {
            if (e.target === scenarioSaveModal) {
                closeScenarioModal();
            }
        });
    }
    
    // Training Planner
    const trainingPlannerBtn = document.getElementById('training-planner-btn');
    const trainingPlannerModal = document.getElementById('training-planner-modal');
    const plannerTabs = document.querySelectorAll('.planner-tab');
    const validateBulkBtn = document.getElementById('validate-bulk');
    const applyBulkBtn = document.getElementById('apply-bulk');
    const targetForm = document.getElementById('target-form');
    const applyOptimizedBtn = document.getElementById('apply-optimized');
    
    // Smart Optimizer elements
    const analyzeFeasibilityBtn = document.getElementById('analyze-feasibility');
    const smartInputPhase = document.getElementById('smart-input-phase');
    const smartResultsPhase = document.getElementById('smart-results-phase');
    const smartOptionsPhase = document.getElementById('smart-options-phase');
    
    if (trainingPlannerBtn) {
        trainingPlannerBtn.addEventListener('click', () => {
            trainingPlannerModal.classList.add('active');
            
            // Make sure grid tab is active and generate grid automatically
            switchPlannerTab('grid');
            setTimeout(() => {
                const gridContainer = document.getElementById('grid-container');
                // Always generate grid on initial modal open
                generateEntryGrid();
            }, 100);
        });
    }
    
    // Export Training Button
    const exportTrainingBtn = document.getElementById('export-training-btn');
    const exportTrainingModal = document.getElementById('export-training-modal');
    
    if (exportTrainingBtn) {
        exportTrainingBtn.addEventListener('click', () => {
            exportTrainingModal.classList.add('active');
            initializeExportModal();
        });
    }
    
    // Import Training Button
    const importTrainingBtn = document.getElementById('import-training-btn');
    const importTrainingModal = document.getElementById('import-training-modal');
    
    if (importTrainingBtn) {
        importTrainingBtn.addEventListener('click', () => {
            importTrainingModal.classList.add('active');
            initializeImportModal();
        });
    }
    
    // Setup close buttons for export/import modals
    document.querySelectorAll('#export-training-modal .modal-close, #export-training-modal .modal-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            exportTrainingModal.classList.remove('active');
        });
    });
    
    document.querySelectorAll('#import-training-modal .modal-close, #import-training-modal .modal-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            importTrainingModal.classList.remove('active');
        });
    });
    
    // Close modals when clicking outside
    [exportTrainingModal, importTrainingModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    });
    
    // Function to validate and reset period if needed
    const validateAndResetPeriod = () => {
        const gridStartMonth = document.getElementById('grid-start-month');
        const gridStartYear = document.getElementById('grid-start-year');
        const gridEndMonth = document.getElementById('grid-end-month');
        const gridEndYear = document.getElementById('grid-end-year');
        
        if (gridStartMonth && gridStartYear && gridEndMonth && gridEndYear) {
            const startMonth = parseInt(gridStartMonth.value);
            const startYear = parseInt(gridStartYear.value);
            const endMonth = parseInt(gridEndMonth.value);
            const endYear = parseInt(gridEndYear.value);
            
            // Check if end date is before start date or period exceeds 12 months
            const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
            if (endYear < startYear || (endYear === startYear && endMonth < startMonth) || monthsDiff > 12) {
                // Reset to default 6-month period from current date
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                
                gridStartMonth.value = currentMonth;
                gridStartYear.value = currentYear;
                
                let defaultEndMonth = currentMonth + 5;
                let defaultEndYear = currentYear;
                if (defaultEndMonth > 11) {
                    defaultEndMonth -= 12;
                    defaultEndYear += 1;
                }
                
                gridEndMonth.value = defaultEndMonth;
                gridEndYear.value = defaultEndYear;
            }
        }
    };
    
    // Close modal handlers
    const plannerModalClose = trainingPlannerModal?.querySelector('.modal-close');
    if (plannerModalClose) {
        plannerModalClose.addEventListener('click', () => {
            validateAndResetPeriod();
            trainingPlannerModal.classList.remove('active');
        });
    }
    
    // Close on outside click
    trainingPlannerModal?.addEventListener('click', (e) => {
        if (e.target === trainingPlannerModal) {
            validateAndResetPeriod();
            trainingPlannerModal.classList.remove('active');
        }
    });
    
    plannerTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchPlannerTab(e.target.dataset.tab);
            
            // Auto-show grid when grid tab is selected
            if (e.target.dataset.tab === 'grid') {
                // Check if grid is not already visible
                const gridContainer = document.getElementById('grid-container');
                if (gridContainer && gridContainer.style.display === 'none') {
                    // Small delay to ensure tab is fully switched
                    setTimeout(() => {
                        // Only generate if grid is empty, otherwise just show it
                        if (!gridContainer.innerHTML) {
                            generateEntryGrid();
                        } else {
                            // Just show the existing grid
                            gridContainer.style.display = 'block';
                            document.getElementById('grid-footer').style.display = 'flex';
                            
                            // Re-apply appropriate modal width based on current period
                            const startMonth = parseInt(document.getElementById('grid-start-month').value);
                            const startYear = parseInt(document.getElementById('grid-start-year').value);
                            const endMonth = parseInt(document.getElementById('grid-end-month').value);
                            const endYear = parseInt(document.getElementById('grid-end-year').value);
                            const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
                            
                            const modal = document.querySelector('#training-planner-modal .modal-content');
                            if (modal) {
                                if (monthsDiff > 9) {
                                    modal.style.maxWidth = '1500px';
                                } else if (monthsDiff > 6) {
                                    modal.style.maxWidth = '1200px';
                                } else {
                                    modal.style.maxWidth = '900px';
                                }
                            }
                        }
                    }, 100);
                }
            }
        });
    });
    
    if (validateBulkBtn) {
        validateBulkBtn.addEventListener('click', validateBulkInput);
    }
    
    if (applyBulkBtn) {
        applyBulkBtn.addEventListener('click', applyBulkSchedule);
    }
    
    if (targetForm) {
        targetForm.addEventListener('submit', optimizeForTarget);
        
        // Re-run optimization when smooth schedule is toggled
        const smoothScheduleCheckbox = document.getElementById('smooth-schedule');
        const considerExistingCheckbox = document.getElementById('consider-existing');
        
        if (smoothScheduleCheckbox) {
            smoothScheduleCheckbox.addEventListener('change', () => {
                // Only re-run if we have values and previous results
                const hasValues = document.getElementById('target-cp').value || 
                                 document.getElementById('target-fo').value || 
                                 document.getElementById('target-cad').value;
                const hasDate = document.getElementById('target-date').value;
                const hasResults = document.getElementById('optimization-results').innerHTML.trim().length > 0;
                
                if (hasValues && hasDate && hasResults) {
                    // Prevent form submission default behavior
                    const event = new Event('submit', { cancelable: true });
                    optimizeForTarget(event);
                }
            });
        }
        
        if (considerExistingCheckbox) {
            considerExistingCheckbox.addEventListener('change', () => {
                // Only re-run if we have values and previous results
                const hasValues = document.getElementById('target-cp').value || 
                                 document.getElementById('target-fo').value || 
                                 document.getElementById('target-cad').value;
                const hasDate = document.getElementById('target-date').value;
                const hasResults = document.getElementById('optimization-results').innerHTML.trim().length > 0;
                
                if (hasValues && hasDate && hasResults) {
                    // Prevent form submission default behavior
                    const event = new Event('submit', { cancelable: true });
                    optimizeForTarget(event);
                }
            });
        }
    }
    
    if (applyOptimizedBtn) {
        applyOptimizedBtn.addEventListener('click', applyOptimizedSchedule);
    }
    
    // Smart Optimizer event listener
    if (analyzeFeasibilityBtn) {
        analyzeFeasibilityBtn.addEventListener('click', handleSmartOptimization);
    }
    
    // Copy optimization results button
    const copyOptimizationBtn = document.getElementById('copy-optimization-results');
    if (copyOptimizationBtn) {
        copyOptimizationBtn.addEventListener('click', copyOptimizationResults);
    }
    
    // Copy table data button
    const copyTableDataBtn = document.getElementById('copy-table-data');
    if (copyTableDataBtn) {
        copyTableDataBtn.addEventListener('click', copyTableData);
    }
    
    // Merge cohorts button
    const mergeCohortsBtn = document.getElementById('merge-cohorts-btn');
    if (mergeCohortsBtn) {
        mergeCohortsBtn.addEventListener('click', showMergeCohortsDialog);
    }
    
    // View control buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            viewButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update view state
            viewState.currentView = e.target.dataset.view;
            viewState.viewOffset = 0; // Reset offset when changing views
            
            // Update navigation buttons
            updateNavigationButtons();
            
            // Re-render all tables
            updateAllTables();
            renderGanttChart();
            
            // For ALL view, ensure sync is working
            if (viewState.currentView === 'all') {
                // Extra timeout for ALL view to ensure everything is rendered
                setTimeout(() => {
                    setupSynchronizedScrolling();
                    // console.log('Extra sync setup for ALL view');
                }, 200);
            }
        });
    });
    
    // Today button
    const todayBtn = document.getElementById('today-btn');
    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            // Reset offset to 0 to show current month
            viewState.viewOffset = 0;
            updateNavigationButtons();
            
            if (viewState.currentView !== 'all') {
                // Re-render tables with reset offset
                updateAllTables();
                renderGanttChart();
            }
            
            // Then scroll to today
            setTimeout(() => {
                scrollToToday();
            }, 100);
        });
    }
    
    // Surplus/Deficit View Toggle button
    const toggleSDViewBtn = document.getElementById('toggle-sd-view');
    if (toggleSDViewBtn) {
        toggleSDViewBtn.addEventListener('click', () => {
            // Toggle between simple and detailed views
            if (viewState.surplusDeficitView === 'simple') {
                viewState.surplusDeficitView = 'detailed';
            } else {
                viewState.surplusDeficitView = 'simple';
            }
            
            // Update button text
            const btnText = toggleSDViewBtn.querySelector('.toggle-view-text');
            if (btnText) {
                if (viewState.surplusDeficitView === 'simple') {
                    btnText.textContent = 'Show Detailed View';
                } else {
                    btnText.textContent = 'Show Simple View';
                }
            }
            
            // Re-render the surplus/deficit table
            renderSurplusDeficitTable();
            
            // Re-establish scroll sync
            setTimeout(() => {
                setupSynchronizedScrolling();
            }, 100);
        });
    }
    
    // Window resize handler to adjust column widths
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (viewState.currentView !== 'all') {
                adjustColumnWidths();
            }
        }, 250);
    });
    
    // Navigation arrow handlers
    const navLeft = document.getElementById('nav-left');
    const navRight = document.getElementById('nav-right');
    
    if (navLeft) {
        navLeft.addEventListener('click', () => {
            if (viewState.currentView !== 'all') {
                // Move view one month back
                viewState.viewOffset -= 1;
                updateNavigationButtons();
                updateAllTables();
                renderGanttChart();
            }
        });
    }
    
    if (navRight) {
        navRight.addEventListener('click', () => {
            if (viewState.currentView !== 'all') {
                // Move view one month forward
                viewState.viewOffset += 1;
                updateNavigationButtons();
                updateAllTables();
                renderGanttChart();
            }
        });
    }
    
    // Initialize navigation buttons state
    updateNavigationButtons();
    
    // Grid Entry Event Listeners
    setupGridEntryListeners();
    
    // Enhanced Dashboard Event Listeners
    // Pipeline filter
    const pipelineFilter = document.getElementById('pipeline-filter');
    if (pipelineFilter) {
        pipelineFilter.addEventListener('change', updatePipelineV2);
    }
    
    // Alert filter
    const alertFilter = document.getElementById('alert-filter');
    if (alertFilter) {
        alertFilter.addEventListener('change', updateAlertsV2);
    }
    
    // Clear acknowledged alerts
    const clearAlertsBtn = document.getElementById('clear-acknowledged');
    if (clearAlertsBtn) {
        clearAlertsBtn.addEventListener('click', () => {
            acknowledgedAlerts.clear();
            localStorage.setItem('acknowledgedAlerts', '[]');
            updateAlertsV2();
            showNotification('Cleared acknowledged alerts', 'success');
        });
    }
    
    // Export dashboard button
    const exportDashboardBtn = document.getElementById('export-dashboard');
    if (exportDashboardBtn) {
        exportDashboardBtn.addEventListener('click', exportDashboard);
    }
    
    // Chart export buttons
    document.querySelectorAll('.btn-export-chart').forEach(btn => {
        btn.addEventListener('click', () => exportChart(btn.dataset.chart));
    });
    
    // Load demo data button
    const loadDemoBtn = document.getElementById('load-demo-data');
    if (loadDemoBtn) {
        loadDemoBtn.addEventListener('click', () => {
            addDemoDashboardData();
        });
    }
}

// Setup Grid Entry Event Listeners
function setupGridEntryListeners() {
    const showGridBtn = document.getElementById('show-grid');
    const gridCancelBtn = document.getElementById('grid-cancel');
    const gridClearBtn = document.getElementById('grid-clear');
    const gridApplyBtn = document.getElementById('grid-apply');
    const gridStartMonth = document.getElementById('grid-start-month');
    const gridStartYear = document.getElementById('grid-start-year');
    const gridEndMonth = document.getElementById('grid-end-month');
    const gridEndYear = document.getElementById('grid-end-year');
    
    // Store previous valid values
    let previousStartMonth = null;
    let previousStartYear = null;
    let previousEndMonth = null;
    let previousEndYear = null;
    
    // Set default start month/year to current month/year
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    if (gridStartMonth) {
        gridStartMonth.value = currentMonth;
        previousStartMonth = currentMonth;
    }
    if (gridStartYear) {
        gridStartYear.value = currentYear;
        previousStartYear = currentYear;
    }
    
    // Set default end month to 5 months from now (for 6 months total)
    let endMonth = currentMonth + 5;
    let endYear = currentYear;
    if (endMonth > 11) {
        endMonth -= 12;
        endYear += 1;
    }
    
    if (gridEndMonth) {
        gridEndMonth.value = endMonth;
        previousEndMonth = endMonth;
    }
    if (gridEndYear) {
        gridEndYear.value = endYear;
        previousEndYear = endYear;
    }
    
    if (showGridBtn) {
        showGridBtn.addEventListener('click', generateEntryGrid);
    }
    
    if (gridCancelBtn) {
        gridCancelBtn.addEventListener('click', () => {
            // Validate and reset period if needed
            const startMonth = parseInt(gridStartMonth.value);
            const startYear = parseInt(gridStartYear.value);
            const endMonth = parseInt(gridEndMonth.value);
            const endYear = parseInt(gridEndYear.value);
            
            // Check if end date is before start date or period exceeds 12 months
            const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
            if (endYear < startYear || (endYear === startYear && endMonth < startMonth) || monthsDiff > 12) {
                // Reset to default 6-month period from current date
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                
                gridStartMonth.value = currentMonth;
                gridStartYear.value = currentYear;
                
                let defaultEndMonth = currentMonth + 5;
                let defaultEndYear = currentYear;
                if (defaultEndMonth > 11) {
                    defaultEndMonth -= 12;
                    defaultEndYear += 1;
                }
                
                gridEndMonth.value = defaultEndMonth;
                gridEndYear.value = defaultEndYear;
                
                // Update stored previous values
                previousStartMonth = currentMonth;
                previousStartYear = currentYear;
                previousEndMonth = defaultEndMonth;
                previousEndYear = defaultEndYear;
            }
            
            // Close the modal
            const modal = document.getElementById('training-planner-modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    if (gridClearBtn) {
        gridClearBtn.addEventListener('click', () => {
            showConfirmDialog(
                'Clear Grid',
                'Clear all entries in the grid?',
                () => {
                    // Clear all input values in the grid
                    const inputs = document.querySelectorAll('#grid-container input[type="number"]');
                    inputs.forEach(input => {
                        input.value = '';
                    });
                    
                    // Reset totals
                    gridData = {};
                    updateGridTotals();
                    
                    showNotification('Grid cleared', 'info');
                },
                null // No action on "No"
            );
        });
    }
    
    // Add event listeners to auto-refresh grid when dropdowns change
    const refreshGrid = (changedElement) => {
        // Check if period is within 12-month limit
        const startMonth = parseInt(gridStartMonth.value);
        const startYear = parseInt(gridStartYear.value);
        const endMonth = parseInt(gridEndMonth.value);
        const endYear = parseInt(gridEndYear.value);
        
        // Check if end date is before start date
        if (endYear < startYear || (endYear === startYear && endMonth < startMonth)) {
            // Only show warning if user changed a month (not year)
            // This allows users to change year first, then adjust month
            if (changedElement === gridStartMonth || changedElement === gridEndMonth) {
                showAlertDialog(
                    'Invalid Date Range',
                    'End date cannot be before start date.',
                    () => {
                        // Restore previous values
                        if (changedElement === gridStartMonth) {
                            gridStartMonth.value = previousStartMonth;
                        } else if (changedElement === gridEndMonth) {
                            gridEndMonth.value = previousEndMonth;
                        }
                    }
                );
                return;
            }
            // If year was changed, don't regenerate grid yet - wait for month adjustment
            return;
        }
        
        const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
        
        // Check if period exceeds 12 months
        if (monthsDiff > 12) {
            // If user changed year, give them a chance to adjust month
            // Only show warning if they changed month or if the difference is way too large
            if (changedElement === gridStartMonth || changedElement === gridEndMonth || monthsDiff > 24) {
                showAlertDialog(
                    'Period Too Long',
                    'Maximum planning period is 12 months.',
                    () => {
                        // Only restore the changed element
                        if (changedElement === gridStartMonth) {
                            gridStartMonth.value = previousStartMonth;
                        } else if (changedElement === gridEndMonth) {
                            gridEndMonth.value = previousEndMonth;
                        } else if (changedElement === gridStartYear) {
                            gridStartYear.value = previousStartYear;
                        } else if (changedElement === gridEndYear) {
                            gridEndYear.value = previousEndYear;
                        }
                    }
                );
                return;
            }
            // If year was changed and difference is <= 24 months, don't regenerate grid yet
            return;
        }
        
        if (monthsDiff > 0) {
            // Update previous values since this is a valid selection
            previousStartMonth = startMonth;
            previousStartYear = startYear;
            previousEndMonth = endMonth;
            previousEndYear = endYear;
            
            // Only regenerate if grid is already visible
            const gridContainer = document.getElementById('grid-container');
            if (gridContainer && gridContainer.style.display !== 'none') {
                generateEntryGrid();
            }
        }
    };
    
    if (gridStartMonth) {
        gridStartMonth.addEventListener('change', () => refreshGrid(gridStartMonth));
    }
    if (gridStartYear) {
        gridStartYear.addEventListener('change', () => refreshGrid(gridStartYear));
    }
    if (gridEndMonth) {
        gridEndMonth.addEventListener('change', () => refreshGrid(gridEndMonth));
    }
    if (gridEndYear) {
        gridEndYear.addEventListener('change', () => refreshGrid(gridEndYear));
    }
    
    if (gridApplyBtn) {
        gridApplyBtn.addEventListener('click', applyGridEntries);
    }
}

// Update view button states
function updateViewButtons() {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewState.currentView);
    });
}

// Update navigation button states
function updateNavigationButtons() {
    const navLeft = document.getElementById('nav-left');
    const navRight = document.getElementById('nav-right');
    
    if (!navLeft || !navRight) return;
    
    if (viewState.currentView === 'all') {
        // Disable navigation for ALL view
        navLeft.disabled = true;
        navRight.disabled = true;
        navLeft.style.display = 'none';
        navRight.style.display = 'none';
    } else {
        // Enable navigation for limited views
        navLeft.style.display = 'block';
        navRight.style.display = 'block';
        navLeft.disabled = false;
        navRight.disabled = false;
        
        // Check if we're at the limits
        const range = getTimeRangeForView();
        if (range.startYear <= START_YEAR) {
            navLeft.disabled = true;
        }
        if (range.endYear >= END_YEAR) {
            navRight.disabled = true;
        }
    }
}

// Scroll to today's date
function scrollToToday() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate();
    
    // Calculate fortnight based on day of month (1-15 = first half, 16+ = second half)
    const isFirstHalf = currentDay <= 15;
    const currentFortnight = (currentMonth - 1) * 2 + (isFirstHalf ? 1 : 2);
    
    // console.log(`Today: ${currentYear}-${currentMonth}-${currentDay}, Fortnight: ${currentFortnight}`);
    
    // Get the current time range
    const range = getTimeRangeForView();
    
    // Check if today is within the current view
    const todayInView = (currentYear > range.startYear || 
                        (currentYear === range.startYear && currentFortnight >= range.startFortnight)) &&
                       (currentYear < range.endYear || 
                        (currentYear === range.endYear && currentFortnight <= range.endFortnight));
    
    if (!todayInView) {
        // console.log('Today is not within the current view range');
        return;
    }
    
    // Calculate how many columns from the start of the view to today
    let columnIndex = 0;
    
    // Start from the beginning of the current view
    let tempYear = range.startYear;
    let tempFn = range.startFortnight;
    
    // Count each column until we reach today's fortnight
    while (tempYear < currentYear || (tempYear === currentYear && tempFn < currentFortnight)) {
        columnIndex++;
        
        // Move to next fortnight
        tempFn++;
        if (tempFn > FORTNIGHTS_PER_YEAR) {
            tempFn = 1;
            tempYear++;
        }
        
        // Safety check to prevent infinite loop
        if (columnIndex > 300) {
            console.error('Column counting exceeded limits');
            break;
        }
    }
    
    // console.log(`Today is Year ${currentYear} FN${currentFortnight}`);
    // console.log(`View starts at Year ${range.startYear} FN${range.startFortnight}`);
    // console.log(`Column index (0-based): ${columnIndex}`);
    
    // Apply -3 month offset (6 fortnights) to center the view
    const scrollColumn = Math.max(0, columnIndex - 6);
    
    // Get actual column width from CSS variable or default
    const columnWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--column-width') || '50');
    const scrollPosition = scrollColumn * columnWidth;
    
    // Scroll all synchronized containers
    const containers = [
        document.getElementById('fte-summary-table-container'),
        document.getElementById('gantt-chart-container'),
        document.getElementById('demand-table-container'),
        document.getElementById('surplus-deficit-container')
    ];
    
    containers.forEach(container => {
        if (container) {
            container.scrollLeft = scrollPosition;
        }
    });
}


// View Management
function switchView(viewName) {
    // Save the active tab to localStorage
    localStorage.setItem('activeTab', viewName);
    
    navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === viewName);
    });

    // Hide all views
    dashboardView.classList.remove('active');
    plannerView.classList.remove('active');
    settingsView.classList.remove('active');
    scenariosView.classList.remove('active');

    // Show selected view
    switch(viewName) {
        case 'dashboard':
            dashboardView.classList.add('active');
            // Check which dashboard version to update
            const dashboardVersion = localStorage.getItem('dashboardVersion') || 'classic';
            // Always use enhanced dashboard
            updateDashboardV2();
            break;
        case 'planner':
            plannerView.classList.add('active');
            // Setup sync when switching to planner
            setTimeout(() => {
                setupSynchronizedScrolling();
                // console.log('Sync setup after switching to planner view');
                // Scroll to today and update view buttons
                scrollToToday();
                updateViewButtons();
                // Adjust modal height for split view if needed
                adjustPlannerModalHeight();
            }, 100);
            break;
        case 'settings':
            settingsView.classList.add('active');
            renderPrioritySettingsTable();
            renderPathwaysTable();
            break;
        case 'scenarios':
            scenariosView.classList.add('active');
            renderScenarioList();
            updateScenarioCount();
            updateComparisonUI();
            break;
    }
}

// Populate Pathway Select
function populatePathwaySelect() {
    pathwaySelect.innerHTML = '<option value="">Select a pathway</option>';
    
    // Group pathways by type
    const pathwaysByType = {};
    pathways.forEach(pathway => {
        const type = pathway.type || 'Other';
        if (!pathwaysByType[type]) {
            pathwaysByType[type] = [];
        }
        pathwaysByType[type].push(pathway);
    });
    
    // Add pathways by type with optgroups
    const typeOrder = ['CP', 'FO', 'CAD', 'Other'];
    typeOrder.forEach(type => {
        if (pathwaysByType[type] && pathwaysByType[type].length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = type;
            
            pathwaysByType[type].forEach(pathway => {
                const option = document.createElement('option');
                option.value = pathway.id;
                option.textContent = pathway.name;
                optgroup.appendChild(option);
            });
            
            pathwaySelect.appendChild(optgroup);
        }
    });
}

// Populate Year Select
function populateYearSelect() {
    const yearSelect = document.getElementById('start-year');
    yearSelect.innerHTML = '<option value="">Select year</option>';
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Populate Fortnight Select
function populateFortnightSelect() {
    const fortnightSelect = document.getElementById('start-fortnight');
    fortnightSelect.innerHTML = '<option value="">Select fortnight</option>';
    for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
        const option = document.createElement('option');
        option.value = fn;
        const monthIndex = FORTNIGHT_TO_MONTH[fn];
        const monthName = MONTHS[monthIndex];
        const isFirstHalf = fn % 2 === 1;
        option.textContent = `FN${String(fn).padStart(2, '0')} - ${monthName} ${isFirstHalf ? '(1st half)' : '(2nd half)'}`;
        fortnightSelect.appendChild(option);
    }
}

// Handle Add Cohort
function handleAddCohort(e) {
    e.preventDefault();
    const formData = new FormData(addCohortForm);
    
    const cohort = {
        id: nextCohortId++,
        numTrainees: parseInt(formData.get('numTrainees')),
        pathwayId: formData.get('pathway'),
        startYear: parseInt(formData.get('startYear')),
        startFortnight: parseInt(formData.get('startFortnight')),
        location: currentLocation,  // Add location to new cohorts
        crossLocationTraining: {}  // Initialize empty cross-location training
    };

    activeCohorts.push(cohort);
    
    // Keep form values for easy multiple additions
    // Only reset the number of trainees to default
    document.getElementById('num-trainees').value = '2';
    
    updateAllTables();
    renderGanttChart();
    markDirty();
}

// Update All Tables
function updateAllTables() {
    perfMonitor.start('updateAllTables');
    
    // Store scroll positions before update
    const containers = document.querySelectorAll('.table-container');
    const scrollPositions = Array.from(containers).map(c => ({
        element: c,
        left: c.scrollLeft,
        top: c.scrollTop
    }));
    
    perfMonitor.start('updateAllTables.renderFTE');
    renderFTESummaryTable();
    perfMonitor.end('updateAllTables.renderFTE');
    
    perfMonitor.start('updateAllTables.renderDemand');
    renderDemandTable();
    perfMonitor.end('updateAllTables.renderDemand');
    
    perfMonitor.start('updateAllTables.renderSupplyDeficit');
    renderSurplusDeficitTable();
    perfMonitor.end('updateAllTables.renderSupplyDeficit');
    
    // Always update trainee summary
    perfMonitor.start('updateAllTables.updateTraineeSummary');
    updateGanttTraineeSummary();
    perfMonitor.end('updateAllTables.updateTraineeSummary');
    
    // Always render commencement summary since it's no longer collapsible
    perfMonitor.start('updateAllTables.renderCommencement');
    renderCommencementSummary();
    perfMonitor.end('updateAllTables.renderCommencement');
    
    // Restore scroll positions
    scrollPositions.forEach(pos => {
        if (pos.element && pos.element.scrollLeft !== undefined) {
            pos.element.scrollLeft = pos.left;
            pos.element.scrollTop = pos.top;
        }
    });
    
    // After tables are rendered, adjust widths and re-establish sync
    // Use requestAnimationFrame here for smooth sync setup
    requestAnimationFrame(() => {
        adjustColumnWidths();
        setupSynchronizedScrolling();
        // console.log('Sync re-established after table update');
    });
    
    // Update dashboard if it's active
    if (dashboardView && dashboardView.classList.contains('active')) {
        // Always use enhanced dashboard
        updateDashboardV2();
    }
    
    // Check for deficits after updating tables
    checkForDeficits();
    
    perfMonitor.end('updateAllTables');
}

// Adjust column widths based on current view
function adjustColumnWidths() {
    const range = getTimeRangeForView();
    
    // Calculate total columns
    let totalColumns = 0;
    let tempYear = range.startYear;
    let tempFn = range.startFortnight;
    
    while (tempYear < range.endYear || (tempYear === range.endYear && tempFn <= range.endFortnight)) {
        totalColumns++;
        tempFn++;
        if (tempFn > FORTNIGHTS_PER_YEAR) {
            tempFn = 1;
            tempYear++;
        }
    }
    
    // Set column width based on view
    let columnWidth;
    if (viewState.currentView === 'all') {
        columnWidth = 50; // Default width for all view
    } else {
        // Get actual container width
        const container = document.getElementById('demand-table-container');
        const containerWidth = container ? container.offsetWidth : (window.innerWidth - 100);
        
        // Calculate available width (container width minus sticky column and scrollbar)
        const availableWidth = containerWidth - 220; // 200px sticky column + 20px for scrollbar
        const optimalWidth = Math.floor(availableWidth / totalColumns);
        
        // Clamp between min and max widths
        // Adjust based on number of columns
        let minWidth, maxWidth;
        if (totalColumns <= 12) {
            // 6 months view
            minWidth = 60;
            maxWidth = 120;
        } else if (totalColumns <= 24) {
            // 12 months view
            minWidth = 40;
            maxWidth = 60;
        } else {
            // Shouldn't happen with current views
            minWidth = 40;
            maxWidth = 50;
        }
        columnWidth = Math.max(minWidth, Math.min(maxWidth, optimalWidth));
    }
    
    // Apply to CSS custom property
    document.documentElement.style.setProperty('--column-width', `${columnWidth}px`);
    
    // Debug log
    // console.log('Column width adjusted:', {
    //     view: viewState.currentView,
    //     totalColumns,
    //     viewportWidth: window.innerWidth,
    //     calculatedWidth: columnWidth
    // });
}

// Global variable to store scroll handlers
window.scrollHandlers = window.scrollHandlers || [];

// Setup synchronized horizontal scrolling for all tables
function setupSynchronizedScrolling() {
    // Remove any existing handlers
    window.scrollHandlers.forEach(({ container, handler }) => {
        if (container) {
            container.removeEventListener('scroll', handler);
        }
    });
    window.scrollHandlers = [];
    
    const containers = [
        document.getElementById('fte-summary-table-container'),
        document.getElementById('gantt-chart-container'),
        document.getElementById('commencement-summary-container'),
        document.getElementById('demand-table-container'),
        document.getElementById('surplus-deficit-container')
    ];
    
    let isScrolling = false;
    
    containers.forEach((container, index) => {
        if (container) {
            const handler = function(e) {
                if (!isScrolling) {
                    isScrolling = true;
                    
                    containers.forEach((other, otherIndex) => {
                        if (other && otherIndex !== index) {
                            other.scrollLeft = e.target.scrollLeft;
                        }
                    });
                    
                    requestAnimationFrame(() => {
                        isScrolling = false;
                    });
                }
            };
            
            container.addEventListener('scroll', handler);
            window.scrollHandlers.push({ container, handler });
        }
    });
    
    // console.log(`Sync established for ${containers.filter(c => c).length} containers`);
}

// Toggle FTE Summary
function toggleFTESummary() {
    const icon = toggleFTEBtn.querySelector('.toggle-icon');
    const isExpanded = toggleFTEBtn.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
        toggleFTEBtn.setAttribute('aria-expanded', 'false');
        icon.textContent = '+';
    } else {
        toggleFTEBtn.setAttribute('aria-expanded', 'true');
        icon.textContent = '−';
    }
    
    // Re-render the table with the new expanded state
    renderFTESummaryTable();
}

// Render Commencement Summary table
function renderCommencementSummary() {
    const container = document.getElementById("commencement-summary-container");
    if (!container) return;
    
    // Hide/show cross-location toggle based on current location
    const crossLocBtn = document.getElementById('commencement-cross-loc-btn');
    if (crossLocBtn) {
        crossLocBtn.style.display = currentLocation === 'AU' ? '' : 'none';
    }
    
    // Get time range based on current view
    const range = getTimeRangeForView();
    
    // Calculate commencements by month/fortnight and type
    const commencements = {};
    
    // Get cohorts to display based on cross-location toggle
    let cohortsToShow = activeCohorts;
    
    if (viewState.showCrossLocationCommencements && currentLocation) {
        // Include cohorts from other location if they have cross-location training here
        const otherLocation = currentLocation === 'AU' ? 'NZ' : 'AU';
        const otherLocationCohorts = locationData[otherLocation]?.activeCohorts || [];
        
        // Add cohorts from other location that train here
        const crossLocationCohorts = otherLocationCohorts.filter(cohort => {
            return cohort.crossLocationTraining && 
                   cohort.crossLocationTraining[currentLocation] && 
                   cohort.crossLocationTraining[currentLocation].phases &&
                   Object.keys(cohort.crossLocationTraining[currentLocation].phases).length > 0;
        });
        
        cohortsToShow = [...activeCohorts, ...crossLocationCohorts];
    }
    
    cohortsToShow.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        const year = cohort.startYear;
        const fortnight = cohort.startFortnight;
        
        // Check if this cohort is within the current view range
        if (year < range.startYear || year > range.endYear) return;
        if (year === range.startYear && fortnight < range.startFortnight) return;
        if (year === range.endYear && fortnight > range.endFortnight) return;
        
        const key = `${year}-${fortnight}`;
        if (!commencements[key]) {
            commencements[key] = { CP: 0, FO: 0, CAD: 0, total: 0 };
        }
        
        commencements[key][pathway.type] += cohort.numTrainees;
        commencements[key].total += cohort.numTrainees;
    });
    
    // Generate table HTML with horizontal layout
    const headers = generateTableHeaders(true, true);
    
    let html = '<div class="table-wrapper"><table class="data-table commencement-table">';
    html += '<thead>';
    html += headers.monthRow;
    html += headers.fortnightRow;
    html += '</thead>';
    
    html += '<tbody>';
    
    // CP row
    html += '<tr>';
    html += '<td class="sticky-col type-label">CP</td>';
    
    let currentYear = range.startYear;
    let currentFortnight = range.startFortnight;
    
    while (currentYear < range.endYear || (currentYear === range.endYear && currentFortnight <= range.endFortnight)) {
        const key = `${currentYear}-${currentFortnight}`;
        const data = commencements[key] || { CP: 0, FO: 0, CAD: 0, total: 0 };
        html += generateDataCell(currentYear, currentFortnight, data.CP || '-');
        
        currentFortnight++;
        if (currentFortnight > 24) {
            currentFortnight = 1;
            currentYear++;
        }
    }
    html += '</tr>';
    
    // FO row
    html += '<tr>';
    html += '<td class="sticky-col type-label">FO</td>';
    
    currentYear = range.startYear;
    currentFortnight = range.startFortnight;
    
    while (currentYear < range.endYear || (currentYear === range.endYear && currentFortnight <= range.endFortnight)) {
        const key = `${currentYear}-${currentFortnight}`;
        const data = commencements[key] || { CP: 0, FO: 0, CAD: 0, total: 0 };
        html += generateDataCell(currentYear, currentFortnight, data.FO || '-');
        
        currentFortnight++;
        if (currentFortnight > 24) {
            currentFortnight = 1;
            currentYear++;
        }
    }
    html += '</tr>';
    
    // CAD row
    html += '<tr>';
    html += '<td class="sticky-col type-label">CAD</td>';
    
    currentYear = range.startYear;
    currentFortnight = range.startFortnight;
    
    while (currentYear < range.endYear || (currentYear === range.endYear && currentFortnight <= range.endFortnight)) {
        const key = `${currentYear}-${currentFortnight}`;
        const data = commencements[key] || { CP: 0, FO: 0, CAD: 0, total: 0 };
        html += generateDataCell(currentYear, currentFortnight, data.CAD || '-');
        
        currentFortnight++;
        if (currentFortnight > 24) {
            currentFortnight = 1;
            currentYear++;
        }
    }
    html += '</tr>';
    
    // NZ row when cross-location is toggled on and we're in AU view
    if (viewState.showCrossLocationCommencements && currentLocation === 'AU') {
        // Calculate NZ commencements
        const nzCommencements = {};
        const nzCohorts = locationData.NZ?.activeCohorts || [];
        
        nzCohorts.forEach(cohort => {
            const nzPathways = locationData.NZ.pathways;
            const pathway = nzPathways.find(p => p.id === cohort.pathwayId);
            if (!pathway) return;
            
            const year = cohort.startYear;
            const fortnight = cohort.startFortnight;
            
            if (year < range.startYear || year > range.endYear) return;
            if (year === range.startYear && fortnight < range.startFortnight) return;
            if (year === range.endYear && fortnight > range.endFortnight) return;
            
            const key = `${year}-${fortnight}`;
            if (!nzCommencements[key]) {
                nzCommencements[key] = { FO: 0, CAD: 0 };
            }
            
            if (pathway.type === 'FO' || pathway.type === 'CAD') {
                nzCommencements[key][pathway.type] += cohort.numTrainees;
            }
        });
        
        html += '<tr>';
        html += '<td class="sticky-col type-label" style="font-style: italic; color: #3498db;">NZ (FO + CAD)</td>';
        
        currentYear = range.startYear;
        currentFortnight = range.startFortnight;
        
        while (currentYear < range.endYear || (currentYear === range.endYear && currentFortnight <= range.endFortnight)) {
            const key = `${currentYear}-${currentFortnight}`;
            const data = nzCommencements[key] || { FO: 0, CAD: 0 };
            const nzTotal = data.FO + data.CAD;
            html += generateDataCell(currentYear, currentFortnight, nzTotal || '-', '', 'font-style: italic; color: #3498db; background: rgba(52, 152, 219, 0.05);');
            
            currentFortnight++;
            if (currentFortnight > 24) {
                currentFortnight = 1;
                currentYear++;
            }
        }
        html += '</tr>';
    }
    
    // FO + CAD row (AU total)
    html += '<tr class="summary-row">';
    html += '<td class="sticky-col type-label" style="font-style: italic; color: var(--text-secondary);">FO + CAD</td>';
    
    currentYear = range.startYear;
    currentFortnight = range.startFortnight;
    
    while (currentYear < range.endYear || (currentYear === range.endYear && currentFortnight <= range.endFortnight)) {
        const key = `${currentYear}-${currentFortnight}`;
        const data = commencements[key] || { CP: 0, FO: 0, CAD: 0, total: 0 };
        const foAndCad = data.FO + data.CAD;
        html += generateDataCell(currentYear, currentFortnight, foAndCad || '-', '', 'font-style: italic; color: var(--text-secondary);');
        
        currentFortnight++;
        if (currentFortnight > 24) {
            currentFortnight = 1;
            currentYear++;
        }
    }
    html += '</tr>';
    
    // Total row
    html += '<tr class="total-row">';
    html += '<td class="sticky-col type-label">Total</td>';
    
    currentYear = range.startYear;
    currentFortnight = range.startFortnight;
    
    while (currentYear < range.endYear || (currentYear === range.endYear && currentFortnight <= range.endFortnight)) {
        const key = `${currentYear}-${currentFortnight}`;
        const data = commencements[key] || { CP: 0, FO: 0, CAD: 0, total: 0 };
        html += `<td class="data-cell total-cell">${data.total || '-'}</td>`;
        
        currentFortnight++;
        if (currentFortnight > 24) {
            currentFortnight = 1;
            currentYear++;
        }
    }
    html += '</tr>';
    
    html += '</tbody></table></div>';
    
    container.innerHTML = html;
    
    // Update trainee summary
    updateGanttTraineeSummary();
}

// Render FTE Summary Table
function renderFTESummaryTable() {
    const container = document.getElementById('fte-summary-table-container');
    const headers = generateTableHeaders(true, true);
    const isExpanded = toggleFTEBtn.getAttribute('aria-expanded') === 'true';
    const range = getTimeRangeForView();
    
    let html = '<div class="table-wrapper"><table class="data-table">';
    html += '<thead>';
    html += headers.monthRow;
    html += headers.fortnightRow;
    html += '</thead>';
    html += '<tbody>';
    
    // Total Supply row (always visible)
    html += '<tr class="total-supply-row">';
    html += '<td class="sticky-first-column total-supply-cell">Total Supply</td>';
    
    let currentYear = range.startYear;
    let currentFn = range.startFortnight;
    
    // Debug log FTE values
    const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? 
        locationData[currentLocation].trainerFTE : trainerFTE;
    // console.log('FTE Summary Table Debug:');
    // console.log('  Current Location:', currentLocation);
    // console.log('  Using locationData FTE:', !!(locationData && currentLocation && locationData[currentLocation]));
    // console.log('  Sample FTE values for', currentYear + ':', locationFTE[currentYear]);
    
    while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
        const totalFTE = TRAINER_CATEGORIES.reduce((sum, cat) => sum + (locationFTE[currentYear]?.[cat] || 0), 0);
        const fortnightlyTotal = (totalFTE / FORTNIGHTS_PER_YEAR).toFixed(0);
        html += generateDataCell(currentYear, currentFn, fortnightlyTotal, 'total-supply-cell');
        
        currentFn++;
        if (currentFn > FORTNIGHTS_PER_YEAR) {
            currentFn = 1;
            currentYear++;
        }
    }
    html += '</tr>';
    
    // Category details (only shown when expanded)
    if (isExpanded) {
        TRAINER_CATEGORIES.forEach(category => {
            html += '<tr class="category-detail">';
            html += `<td class="sticky-first-column category-detail-cell">${category} Supply</td>`;
            
            currentYear = range.startYear;
            currentFn = range.startFortnight;
            
            while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
                const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? 
                    locationData[currentLocation].trainerFTE : trainerFTE;
                const fortnightlyFTE = ((locationFTE[currentYear]?.[category] || 0) / FORTNIGHTS_PER_YEAR).toFixed(0);
                html += generateDataCell(currentYear, currentFn, fortnightlyFTE, 'category-detail-cell');
                
                currentFn++;
                if (currentFn > FORTNIGHTS_PER_YEAR) {
                    currentFn = 1;
                    currentYear++;
                }
            }
            
            html += '</tr>';
        });
    }
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Render Demand Table
function renderDemandTable() {
    const container = document.getElementById('demand-table-container');
    const { demand, crossLocationDemand } = calculateDemand();
    const headers = generateTableHeaders(true, true);
    const range = getTimeRangeForView();
    const activeLocation = document.querySelector('.location-tab.active')?.dataset.location || currentLocation || 'AU';
    
    let html = '<div class="table-wrapper"><table class="data-table">';
    html += '<thead>';
    html += headers.monthRow;
    html += headers.fortnightRow;
    html += '</thead>';
    html += '<tbody>';
    
    // Demand rows by training type (using priority config order)
    priorityConfig.forEach(config => {
        if (viewState.demandSplitByLocation) {
            // Split view - show local demand first
            html += '<tr>';
            html += `<td class="sticky-first-column">${config.trainingType} (${currentLocation})</td>`;
            
            let currentYear = range.startYear;
            let currentFn = range.startFortnight;
            
            while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
                const demandData = demand[currentYear]?.[currentFn] || { byTrainingType: {} };
                const totalValue = demandData.byTrainingType[config.trainingType] || 0;
                
                // Calculate cross-location value
                let crossLocValue = 0;
                if (crossLocationDemand[currentYear]?.[currentFn]?.[currentLocation]?.byTrainingType?.[config.trainingType] > 0) {
                    crossLocValue = crossLocationDemand[currentYear][currentFn][currentLocation].byTrainingType[config.trainingType];
                }
                
                // Local demand is total minus cross-location
                const localValue = totalValue - crossLocValue;
                
                html += generateDataCell(currentYear, currentFn, localValue.toFixed(0), '', 'background: rgba(0, 123, 255, 0.05);');
                
                currentFn++;
                if (currentFn > FORTNIGHTS_PER_YEAR) {
                    currentFn = 1;
                    currentYear++;
                }
            }
            html += '</tr>';
            
            // Cross-location demand row
            const otherLocation = activeLocation === 'AU' ? 'NZ' : 'AU';
            html += '<tr>';
            html += `<td class="sticky-first-column" style="padding-left: 30px; font-style: italic; color: #3498db;">${config.trainingType} (from ${otherLocation})</td>`;
            
            currentYear = range.startYear;
            currentFn = range.startFortnight;
            
            while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
                let crossLocValue = 0;
                if (crossLocationDemand[currentYear]?.[currentFn]?.[currentLocation]?.byTrainingType?.[config.trainingType] > 0) {
                    crossLocValue = crossLocationDemand[currentYear][currentFn][currentLocation].byTrainingType[config.trainingType];
                }
                
                if (crossLocValue > 0) {
                    html += generateDataCell(currentYear, currentFn, crossLocValue.toFixed(0), '', 
                        'background: rgba(52, 152, 219, 0.1); color: #2980b9; font-weight: 600;');
                } else {
                    html += generateDataCell(currentYear, currentFn, '-', '', 
                        'background: rgba(52, 152, 219, 0.05); color: #999;');
                }
                
                currentFn++;
                if (currentFn > FORTNIGHTS_PER_YEAR) {
                    currentFn = 1;
                    currentYear++;
                }
            }
            html += '</tr>';
        } else {
            // Regular merged view
            html += '<tr>';
            html += `<td class="sticky-first-column">${config.trainingType} Demand</td>`;
            
            let currentYear = range.startYear;
            let currentFn = range.startFortnight;
            
            while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
                const demandData = demand[currentYear]?.[currentFn] || { byTrainingType: {} };
                const value = demandData.byTrainingType[config.trainingType] || 0;
            
            // Check if this includes cross-location demand
            let crossLocValue = 0;
            if (crossLocationDemand[currentYear]?.[currentFn]?.[currentLocation]?.byTrainingType?.[config.trainingType] > 0) {
                crossLocValue = crossLocationDemand[currentYear][currentFn][currentLocation].byTrainingType[config.trainingType];
            }
            
            // Calculate local demand (total - cross-location)
            const localValue = value - crossLocValue;
            
            let cellContent = '';
            let tooltip = '';
            
            if (crossLocValue > 0) {
                // Show total value with highlighting for cross-location
                cellContent = `${value.toFixed(0)}<span style="position: absolute; top: 4px; right: 4px; width: 6px; height: 6px; background: #3498db; border-radius: 50%;"></span>`;
                tooltip = `title="Total: ${value.toFixed(0)} (Local: ${localValue.toFixed(0)} + Cross-location: ${crossLocValue.toFixed(0)} from ${currentLocation === 'AU' ? 'NZ' : 'AU'})\n● = Includes cross-location trainer demand"`;
            } else {
                cellContent = value.toFixed(0);
            }
            
            // Use a temporary wrapper to add tooltip
            const cell = generateDataCell(currentYear, currentFn, cellContent, '', 'position: relative;');
            if (tooltip) {
                html += cell.replace('<td', `<td ${tooltip}`);
            } else {
                html += cell;
            }
            
            currentFn++;
            if (currentFn > FORTNIGHTS_PER_YEAR) {
                currentFn = 1;
                currentYear++;
            }
        }
        
        html += '</tr>';
        }
    });
    
    // Total Demand row
    if (viewState.demandSplitByLocation) {
        // Split view total - local demand
        html += '<tr>';
        html += `<td class="sticky-first-column total-row">Total (${currentLocation})</td>`;
        
        let totalYear = range.startYear;
        let totalFn = range.startFortnight;
        
        while (totalYear < range.endYear || (totalYear === range.endYear && totalFn <= range.endFortnight)) {
            const demandData = demand[totalYear]?.[totalFn] || { total: 0 };
            
            let crossLocTotal = 0;
            if (crossLocationDemand[totalYear]?.[totalFn]?.[currentLocation]?.total > 0) {
                crossLocTotal = crossLocationDemand[totalYear][totalFn][currentLocation].total;
            }
            
            const localTotal = demandData.total - crossLocTotal;
            html += generateDataCell(totalYear, totalFn, localTotal.toFixed(0), 'total-row', 'background: rgba(0, 123, 255, 0.05);');
            
            totalFn++;
            if (totalFn > FORTNIGHTS_PER_YEAR) {
                totalFn = 1;
                totalYear++;
            }
        }
        html += '</tr>';
        
        // Cross-location total row
        const otherLocation = activeLocation === 'AU' ? 'NZ' : 'AU';
        html += '<tr>';
        html += `<td class="sticky-first-column total-row" style="padding-left: 30px; font-style: italic; color: #3498db;">Total (from ${otherLocation})</td>`;
        
        totalYear = range.startYear;
        totalFn = range.startFortnight;
        
        while (totalYear < range.endYear || (totalYear === range.endYear && totalFn <= range.endFortnight)) {
            let crossLocTotal = 0;
            if (crossLocationDemand[totalYear]?.[totalFn]?.[currentLocation]?.total > 0) {
                crossLocTotal = crossLocationDemand[totalYear][totalFn][currentLocation].total;
            }
            
            if (crossLocTotal > 0) {
                html += generateDataCell(totalYear, totalFn, crossLocTotal.toFixed(0), 'total-row', 
                    'background: rgba(52, 152, 219, 0.1); color: #2980b9; font-weight: 600;');
            } else {
                html += generateDataCell(totalYear, totalFn, '-', 'total-row', 
                    'background: rgba(52, 152, 219, 0.05); color: #999;');
            }
            
            totalFn++;
            if (totalFn > FORTNIGHTS_PER_YEAR) {
                totalFn = 1;
                totalYear++;
            }
        }
        html += '</tr>';
        
        // Grand total row
        html += '<tr>';
        html += '<td class="sticky-first-column total-row" style="font-weight: bold;">Grand Total</td>';
        
        totalYear = range.startYear;
        totalFn = range.startFortnight;
        
        while (totalYear < range.endYear || (totalYear === range.endYear && totalFn <= range.endFortnight)) {
            const demandData = demand[totalYear]?.[totalFn] || { total: 0 };
            html += generateDataCell(totalYear, totalFn, demandData.total.toFixed(0), 'total-row', 'font-weight: bold;');
            
            totalFn++;
            if (totalFn > FORTNIGHTS_PER_YEAR) {
                totalFn = 1;
                totalYear++;
            }
        }
        html += '</tr>';
    } else {
        // Regular merged view total
        html += '<tr>';
        html += '<td class="sticky-first-column total-row">Total Demand</td>';
        
        let totalYear = range.startYear;
        let totalFn = range.startFortnight;
        
        while (totalYear < range.endYear || (totalYear === range.endYear && totalFn <= range.endFortnight)) {
            const demandData = demand[totalYear]?.[totalFn] || { total: 0 };
            
            // Check for cross-location total
            let crossLocTotal = 0;
            if (crossLocationDemand[totalYear]?.[totalFn]?.[currentLocation]?.total > 0) {
                crossLocTotal = crossLocationDemand[totalYear][totalFn][currentLocation].total;
            }
            
            let cellContent = demandData.total.toFixed(0);
            let cellTooltip = '';
            if (crossLocTotal > 0) {
                const localTotal = demandData.total - crossLocTotal;
                cellTooltip = `title="Total: ${demandData.total.toFixed(0)} (Local: ${localTotal.toFixed(0)} + Cross-location: ${crossLocTotal.toFixed(0)})"`;
            }
            
            const cell = generateDataCell(totalYear, totalFn, cellContent, 'total-row');
            if (cellTooltip) {
                html += cell.replace('<td', `<td ${cellTooltip}`);
            } else {
                html += cell;
            }
            
            totalFn++;
            if (totalFn > FORTNIGHTS_PER_YEAR) {
                totalFn = 1;
                totalYear++;
            }
        }
        
        html += '</tr>';
    }
    html += '</tbody></table></div>';
    
    // Add footnote if there's cross-location demand
    let hasCrossLocationDemand = false;
    for (let year in crossLocationDemand) {
        for (let fn in crossLocationDemand[year]) {
            if (crossLocationDemand[year][fn][currentLocation]) {
                hasCrossLocationDemand = true;
                break;
            }
        }
        if (hasCrossLocationDemand) break;
    }
    
    if (hasCrossLocationDemand) {
        html += '<div class="table-footnote">* Includes cross-location trainer demand from other regions</div>';
    }
    
    container.innerHTML = html;
}

// Render Cross-Location Summary
function renderCrossLocationSummary() {
    const container = document.getElementById('cross-location-summary-container');
    if (!container) return;
    
    const { crossLocationDemand } = calculateDemand();
    const activeLocation = document.querySelector('.location-tab.active')?.dataset.location || currentLocation || 'AU';
    const otherLocation = activeLocation === 'AU' ? 'NZ' : 'AU';
    const range = getTimeRangeForView();
    
    // Check if there's any cross-location demand
    let hasAnyDemand = false;
    for (let year in crossLocationDemand) {
        for (let fn in crossLocationDemand[year]) {
            if (Object.keys(crossLocationDemand[year][fn]).length > 0) {
                hasAnyDemand = true;
                break;
            }
        }
        if (hasAnyDemand) break;
    }
    
    if (!hasAnyDemand) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No cross-location trainer movements in the selected period</p>';
        return;
    }
    
    // Build summary table
    let html = '<div class="table-wrapper"><table class="data-table">';
    html += '<thead><tr>';
    html += '<th class="sticky-first-column">Period</th>';
    html += `<th>Trainers from ${otherLocation} to ${activeLocation}</th>`;
    html += '<th>Training Type</th>';
    html += '<th>Cohorts Using Cross-Location</th>';
    html += '</tr></thead>';
    html += '<tbody>';
    
    // Process cross-location demand by period
    let currentYear = range.startYear;
    let currentFn = range.startFortnight;
    
    while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
        if (crossLocationDemand[currentYear]?.[currentFn]?.[activeLocation]) {
            const demand = crossLocationDemand[currentYear][currentFn][activeLocation];
            
            // Find cohorts using cross-location for this period
            const cohorts = activeCohorts.filter(cohort => {
                if (!cohort.crossLocationTraining) return false;
                
                // Check if this cohort uses cross-location training in this period
                const pathway = pathways.find(p => p.id === cohort.pathwayId);
                if (!pathway) return false;
                
                // Calculate if cohort is in LT phase during this period
                let cohortYear = cohort.startYear;
                let cohortFn = cohort.startFortnight;
                let globalFn = 1;
                
                for (let phase of pathway.phases) {
                    for (let i = 0; i < phase.duration; i++) {
                        if (cohortYear === currentYear && cohortFn === currentFn && phase.trainerDemandType) {
                            // Check if this phase uses cross-location
                            const crossLoc = cohort.crossLocationTraining[activeLocation];
                            if (crossLoc?.phases?.[phase.name]?.includes(globalFn)) {
                                return true;
                            }
                        }
                        
                        cohortFn++;
                        if (cohortFn > FORTNIGHTS_PER_YEAR) {
                            cohortFn = 1;
                            cohortYear++;
                        }
                        globalFn++;
                    }
                }
                return false;
            });
            
            Object.entries(demand.byTrainingType).forEach(([type, count]) => {
                html += '<tr>';
                html += `<td class="sticky-first-column">${currentYear} FN${String(currentFn).padStart(2, '0')}</td>`;
                html += `<td class="data-cell">${count.toFixed(1)}</td>`;
                html += `<td>${type}</td>`;
                html += `<td>${cohorts.map(c => c.name).join(', ') || '-'}</td>`;
                html += '</tr>';
            });
        }
        
        currentFn++;
        if (currentFn > FORTNIGHTS_PER_YEAR) {
            currentFn = 1;
            currentYear++;
        }
    }
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Render Surplus/Deficit Table
function renderSurplusDeficitTable() {
    if (viewState.surplusDeficitView === 'detailed') {
        renderSurplusDeficitTableDetailed();
    } else {
        renderSurplusDeficitTableSimple();
    }
}

// Detailed view - shows training type capacity with trainer category breakdown
function renderSurplusDeficitTableDetailed() {
    const container = document.getElementById('surplus-deficit-container');
    const { demand } = calculateDemand();
    const headers = generateTableHeaders(true, true);
    const range = getTimeRangeForView();
    
    let html = '<div class="table-wrapper"><table class="data-table">';
    html += '<thead>';
    html += headers.monthRow;
    html += headers.fortnightRow;
    html += '</thead>';
    html += '<tbody>';
    
    // Calculate and display surplus/deficit by training type with category breakdown
    const trainingTypes = [
        { type: 'LT-CAD', label: 'CAD Training' },
        { type: 'LT-CP', label: 'CP Training' },
        { type: 'LT-FO', label: 'FO Training' }
    ];
    
    // Get current location's FTE data
    const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? 
        locationData[currentLocation].trainerFTE : trainerFTE;
    
    trainingTypes.forEach(({ type, label }) => {
        // Main training type row
        html += '<tr class="training-type-main">';
        html += `<td class="sticky-first-column">${label}</td>`;
        
        let currentYear = range.startYear;
        let currentFn = range.startFortnight;
        
        while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
            const demandData = demand[currentYear]?.[currentFn];
            const demandForType = demandData?.byTrainingType[type] || 0;
            
            // Calculate available trainers based on priority cascading
            let availableCapacity = 0;
            
            if (type === 'LT-CAD') {
                availableCapacity = ['CATB', 'CATA', 'STP'].reduce((sum, cat) => 
                    sum + (locationFTE[currentYear]?.[cat] || 0) / FORTNIGHTS_PER_YEAR, 0);
            } else if (type === 'LT-CP') {
                const rhsCapacity = (locationFTE[currentYear]?.['RHS'] || 0) / FORTNIGHTS_PER_YEAR;
                const universalCapacity = ['CATB', 'CATA', 'STP'].reduce((sum, cat) => 
                    sum + (locationFTE[currentYear]?.[cat] || 0) / FORTNIGHTS_PER_YEAR, 0);
                const cadDemand = demandData?.byTrainingType['LT-CAD'] || 0;
                const universalSurplus = Math.max(0, universalCapacity - cadDemand);
                availableCapacity = rhsCapacity + universalSurplus;
            } else if (type === 'LT-FO') {
                const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
                    sum + (locationFTE[currentYear]?.[cat] || 0) / FORTNIGHTS_PER_YEAR, 0);
                const higherPriorityDemand = (demandData?.byTrainingType['LT-CAD'] || 0) + 
                                           (demandData?.byTrainingType['LT-CP'] || 0);
                availableCapacity = Math.max(0, totalSupply - higherPriorityDemand);
            }
            
            const surplusDeficit = availableCapacity - demandForType;
            const isDeficit = surplusDeficit < 0;
            const cellClass = isDeficit ? 'deficit' : (surplusDeficit > 0 ? 'surplus' : '');
            
            html += generateDataCell(currentYear, currentFn, surplusDeficit.toFixed(0), cellClass);
            
            currentFn++;
            if (currentFn > FORTNIGHTS_PER_YEAR) {
                currentFn = 1;
                currentYear++;
            }
        }
        html += '</tr>';
        
        // Trainer category breakdown rows
        const relevantCategories = type === 'LT-CAD' ? ['CATB', 'CATA', 'STP'] :
                                  type === 'LT-CP' ? ['RHS', 'CATB', 'CATA', 'STP'] :
                                  TRAINER_CATEGORIES;
        
        relevantCategories.forEach(category => {
            const canPerformTraining = TRAINER_QUALIFICATIONS[category].includes(type);
            if (!canPerformTraining) return;
            
            html += '<tr class="category-breakdown">';
            html += `<td class="sticky-first-column category-indent">&nbsp;&nbsp;↳ ${category}</td>`;
            
            let catYear = range.startYear;
            let catFn = range.startFortnight;
            
            while (catYear < range.endYear || (catYear === range.endYear && catFn <= range.endFortnight)) {
                const categorySupply = (locationFTE[catYear]?.[category] || 0) / FORTNIGHTS_PER_YEAR;
                const allocated = demand[catYear]?.[catFn]?.allocated?.[category] || 0;
                const available = categorySupply - allocated;
                
                // For this training type, show how much of this category could contribute
                let contribution = 0;
                if (type === 'LT-CAD' && (category === 'CATB' || category === 'CATA' || category === 'STP')) {
                    contribution = Math.max(0, available);
                } else if (type === 'LT-CP') {
                    if (category === 'RHS') {
                        contribution = Math.max(0, available);
                    } else {
                        // Universal trainers contribute only after CAD demand
                        const cadDemand = demand[catYear]?.[catFn]?.byTrainingType['LT-CAD'] || 0;
                        const catShare = categorySupply / 3; // Split evenly among CATB/CATA/STP
                        contribution = Math.max(0, catShare - (cadDemand / 3));
                    }
                } else if (type === 'LT-FO') {
                    // FO gets whatever is left after higher priorities
                    contribution = Math.max(0, available);
                }
                
                const cellClass = contribution > 0 ? 'available' : '';
                html += generateDataCell(catYear, catFn, contribution > 0 ? contribution.toFixed(0) : '-', `category-cell ${cellClass}`);
                
                catFn++;
                if (catFn > FORTNIGHTS_PER_YEAR) {
                    catFn = 1;
                    catYear++;
                }
            }
            html += '</tr>';
        });
        
        // Add spacing between training types
        if (type !== 'LT-FO') {
            html += '<tr class="spacing-row"><td colspan="100%" style="height: 10px;"></td></tr>';
        }
    });
    
    // Separator row
    html += '<tr class="separator-row"><td colspan="100%" class="separator-cell"></td></tr>';
    
    // Total Net S/D row
    html += '<tr>';
    html += '<td class="sticky-first-column total-row">Total Net S/D</td>';
    
    let netYear = range.startYear;
    let netFn = range.startFortnight;
    
    while (netYear < range.endYear || (netYear === range.endYear && netFn <= range.endFortnight)) {
        const totalYearlyFTE = TRAINER_CATEGORIES.reduce((sum, cat) => sum + (locationFTE[netYear]?.[cat] || 0), 0);
        const totalFortnightlyFTE = totalYearlyFTE / FORTNIGHTS_PER_YEAR;
        
        const demandData = demand[netYear]?.[netFn] || { byTrainingType: {} };
        const totalLineTrainingDemand = 
            (demandData.byTrainingType['LT-CAD'] || 0) +
            (demandData.byTrainingType['LT-CP'] || 0) +
            (demandData.byTrainingType['LT-FO'] || 0);
        
        const totalNetSD = totalFortnightlyFTE - totalLineTrainingDemand;
        const isDeficit = totalNetSD < 0;
        html += generateDataCell(netYear, netFn, totalNetSD.toFixed(0), `total-row ${isDeficit ? 'deficit' : 'surplus'}`);
        
        netFn++;
        if (netFn > FORTNIGHTS_PER_YEAR) {
            netFn = 1;
            netYear++;
        }
    }
    
    html += '</tr>';
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Simple view - shows actual capacity by training type after cascading
function renderSurplusDeficitTableSimple() {
    const container = document.getElementById('surplus-deficit-container');
    const { demand } = calculateDemand();
    const headers = generateTableHeaders(true, true);
    const range = getTimeRangeForView();
    
    let html = '<div class="table-wrapper"><table class="data-table">';
    html += '<thead>';
    html += headers.monthRow;
    html += headers.fortnightRow;
    html += '</thead>';
    html += '<tbody>';
    
    // Calculate and display surplus/deficit by training type
    const trainingTypes = [
        { type: 'LT-CAD', label: 'CAD Training' },
        { type: 'LT-CP', label: 'CP Training' },
        { type: 'LT-FO', label: 'FO Training' }
    ];
    
    trainingTypes.forEach(({ type, label }) => {
        html += '<tr>';
        html += `<td class="sticky-first-column">${label}</td>`;
        
        let currentYear = range.startYear;
        let currentFn = range.startFortnight;
        
        while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
            // For training type view, we need to show actual surplus/deficit
            // This requires recalculating with proper cascading allocation
            const demandData = demand[currentYear]?.[currentFn];
            const demandForType = demandData?.byTrainingType[type] || 0;
            
            // Get trainer supply for this period
            const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? 
                locationData[currentLocation].trainerFTE : trainerFTE;
            
            // Calculate available trainers based on priority cascading
            let availableCapacity = 0;
            
            if (type === 'LT-CAD') {
                // CAD can only use CATB, CATA, STP
                availableCapacity = ['CATB', 'CATA', 'STP'].reduce((sum, cat) => 
                    sum + (locationFTE[currentYear]?.[cat] || 0) / FORTNIGHTS_PER_YEAR, 0);
            } else if (type === 'LT-CP') {
                // CP uses RHS first, then surplus from CATB/CATA/STP after CAD
                const rhsCapacity = (locationFTE[currentYear]?.['RHS'] || 0) / FORTNIGHTS_PER_YEAR;
                const universalCapacity = ['CATB', 'CATA', 'STP'].reduce((sum, cat) => 
                    sum + (locationFTE[currentYear]?.[cat] || 0) / FORTNIGHTS_PER_YEAR, 0);
                const cadDemand = demandData?.byTrainingType['LT-CAD'] || 0;
                const universalSurplus = Math.max(0, universalCapacity - cadDemand);
                availableCapacity = rhsCapacity + universalSurplus;
            } else if (type === 'LT-FO') {
                // FO can use all trainers, but only after higher priority demands are met
                const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
                    sum + (locationFTE[currentYear]?.[cat] || 0) / FORTNIGHTS_PER_YEAR, 0);
                const higherPriorityDemand = (demandData?.byTrainingType['LT-CAD'] || 0) + 
                                           (demandData?.byTrainingType['LT-CP'] || 0);
                
                // FO gets whatever is left after CAD and CP
                availableCapacity = Math.max(0, totalSupply - higherPriorityDemand);
            }
            
            const surplusDeficit = availableCapacity - demandForType;
            const isDeficit = surplusDeficit < 0;
            const cellClass = isDeficit ? 'deficit' : (surplusDeficit > 0 ? 'surplus' : '');
            
            html += generateDataCell(currentYear, currentFn, surplusDeficit.toFixed(0), cellClass);
            
            currentFn++;
            if (currentFn > FORTNIGHTS_PER_YEAR) {
                currentFn = 1;
                currentYear++;
            }
        }
        html += '</tr>';
    });
    
    // Separator row
    html += '<tr class="separator-row"><td colspan="100%" class="separator-cell"></td></tr>';
    
    // Total Net S/D row
    html += '<tr>';
    html += '<td class="sticky-first-column total-row">Total Net S/D</td>';
    
    let netYear = range.startYear;
    let netFn = range.startFortnight;
    
    while (netYear < range.endYear || (netYear === range.endYear && netFn <= range.endFortnight)) {
        const totalYearlyFTE = TRAINER_CATEGORIES.reduce((sum, cat) => sum + (trainerFTE[netYear]?.[cat] || 0), 0);
        const totalFortnightlyFTE = totalYearlyFTE / FORTNIGHTS_PER_YEAR;
        
        const demandData = demand[netYear]?.[netFn] || { byTrainingType: {} };
        const totalLineTrainingDemand = 
            (demandData.byTrainingType['LT-CAD'] || 0) +
            (demandData.byTrainingType['LT-CP'] || 0) +
            (demandData.byTrainingType['LT-FO'] || 0);
        
        const totalNetSD = totalFortnightlyFTE - totalLineTrainingDemand;
        const isDeficit = totalNetSD < 0;
        html += generateDataCell(netYear, netFn, totalNetSD.toFixed(0), `total-row ${isDeficit ? 'deficit' : 'surplus'}`);
        
        netFn++;
        if (netFn > FORTNIGHTS_PER_YEAR) {
            netFn = 1;
            netYear++;
        }
    }
    
    html += '</tr>';
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Helper function to calculate available capacity for a specific training type
function calculateCapacityForTrainingType(trainingType, year, fortnight, demandData) {
    // Get FTE for this period
    const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? 
        locationData[currentLocation].trainerFTE : trainerFTE;
    
    const supply = {};
    TRAINER_CATEGORIES.forEach(cat => {
        supply[cat] = (locationFTE[year]?.[cat] || 0) / FORTNIGHTS_PER_YEAR;
    });
    
    // Calculate capacity based on training type and trainer qualifications
    let capacity = 0;
    
    switch (trainingType) {
        case 'LT-CAD':
            // Only CATB, CATA, STP can do CAD training
            capacity = supply['CATB'] + supply['CATA'] + supply['STP'];
            break;
            
        case 'LT-CP':
            // RHS is primary, plus any surplus from CATB/CATA/STP after CAD allocation
            capacity = supply['RHS'];
            
            // Add surplus from universal trainers after CAD demand
            const cadDemand = demandData?.byTrainingType['LT-CAD'] || 0;
            const universalSupply = supply['CATB'] + supply['CATA'] + supply['STP'];
            const universalSurplus = Math.max(0, universalSupply - cadDemand);
            capacity += universalSurplus;
            break;
            
        case 'LT-FO':
            // LHS is primary, plus surplus from all others after their primary allocations
            capacity = supply['LHS'];
            
            // Add surplus from RHS after CP demand
            const cpDemandForRHS = demandData?.byTrainingType['LT-CP'] || 0;
            const rhsSupply = supply['RHS'];
            const rhsSurplus = Math.max(0, rhsSupply - cpDemandForRHS);
            capacity += rhsSurplus;
            
            // Add surplus from universal trainers after CAD and CP demand
            const totalHigherPriorityDemand = (demandData?.byTrainingType['LT-CAD'] || 0) + 
                                              (demandData?.byTrainingType['LT-CP'] || 0);
            const universalSupplyForFO = supply['CATB'] + supply['CATA'] + supply['STP'];
            const universalSurplusForFO = Math.max(0, universalSupplyForFO - totalHigherPriorityDemand);
            capacity += universalSurplusForFO;
            break;
    }
    
    return capacity;
}

// Calculate Demand with priority-based allocation
function calculateDemand() {
    const demand = {};
    const ltCpDeficit = {};
    const crossLocationDemand = {}; // Track demand that uses other location's trainers

    // Initialize demand structure
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        demand[year] = {};
        ltCpDeficit[year] = {};
        crossLocationDemand[year] = {};
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            demand[year][fn] = {
                total: 0,
                cohortCount: 0,
                byTrainingType: {},  // Changed from byPriority
                byCategory: {},
                allocated: {},
                unallocated: {},
                crossLocation: {} // Track cross-location usage
            };
            ltCpDeficit[year][fn] = 0;
            crossLocationDemand[year][fn] = {};
            
            // Initialize by training type (excluding GS+SIM)
            ['LT-CAD', 'LT-CP', 'LT-FO'].forEach(type => {
                demand[year][fn].byTrainingType[type] = 0;
                demand[year][fn].unallocated[type] = 0;
            });
            
            // Initialize by category
            TRAINER_CATEGORIES.forEach(cat => {
                demand[year][fn].byCategory[cat] = 0;
                demand[year][fn].allocated[cat] = 0;
            });
        }
    }

    // Calculate raw demand from cohorts
    const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
    cohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        // Only process cohorts for the current location view
        const viewingLocation = (typeof currentLocation !== 'undefined' && currentLocation) ? currentLocation : 'AU';
        const cohortName = cohort.name || `Cohort ${cohort.id}`;
        
        // Handle cohorts that might not have location property (legacy data)
        const cohortLocation = cohort.location || viewingLocation;
        if (cohortLocation !== viewingLocation) {
            return;
        }

        let currentYear = cohort.startYear;
        let currentFortnight = cohort.startFortnight;
        let phaseStartFortnight = 0; // Track fortnight within overall cohort timeline

        pathway.phases.forEach(phase => {
            for (let i = 0; i < phase.duration; i++) {
                if (currentYear > END_YEAR) break;
                
                // Only track demand for line training phases with trainerDemandType
                if (phase.trainerDemandType) {
                    const phaseDemand = cohort.numTrainees;
                    // Calculate globalFortnight the same way as in generateCrossLocationUI
                    const globalFortnight = (currentYear - 2024) * FORTNIGHTS_PER_YEAR + currentFortnight;
                    
                    // Check if this fortnight uses cross-location training
                    let usesCrossLocation = false;
                    let crossLocationFrom = null;
                    
                    // console.log(`Checking cross-location for ${cohortName}, ${phase.name}, fortnight ${globalFortnight}`);
                    // console.log('Cross-location config:', JSON.stringify(cohort.crossLocationTraining, null, 2));
                    // console.log('Cohort location:', cohort.location, 'Current viewing location:', viewingLocation);
                    
                    if (cohort.crossLocationTraining) {
                        Object.entries(cohort.crossLocationTraining).forEach(([location, data]) => {
                            // console.log(`  Checking location ${location}, phases:`, data.phases);
                            if (data.phases && data.phases[phase.name]) {
                                // console.log(`  Phase ${phase.name} fortnights:`, data.phases[phase.name]);
                                if (data.phases[phase.name].includes(globalFortnight)) {
                                    usesCrossLocation = true;
                                    crossLocationFrom = location;
                                    // console.log(`  ✓ Found cross-location: using ${location} trainers for fortnight ${globalFortnight}`);
                                }
                            }
                        });
                    }
                    
                    if (usesCrossLocation && crossLocationFrom) {
                        // This cohort is using trainers from another location
                        // Don't add demand to current location - it's using the other location's trainers
                        // console.log(`Cross-location: Cohort ${cohort.name} (${cohort.location}) using ${crossLocationFrom} trainers for ${phase.name} in ${currentYear} FN${currentFortnight} - NO demand in ${viewingLocation}`);
                        
                        // Track this in crossLocationDemand for the OTHER location to pick up
                        if (!crossLocationDemand[currentYear][currentFortnight][crossLocationFrom]) {
                            crossLocationDemand[currentYear][currentFortnight][crossLocationFrom] = {
                                total: 0,
                                byTrainingType: {}
                            };
                        }
                        crossLocationDemand[currentYear][currentFortnight][crossLocationFrom].total += phaseDemand;
                        if (!crossLocationDemand[currentYear][currentFortnight][crossLocationFrom].byTrainingType[phase.trainerDemandType]) {
                            crossLocationDemand[currentYear][currentFortnight][crossLocationFrom].byTrainingType[phase.trainerDemandType] = 0;
                        }
                        crossLocationDemand[currentYear][currentFortnight][crossLocationFrom].byTrainingType[phase.trainerDemandType] += phaseDemand;
                    } else {
                        // Normal demand for current location (home trainers)
                        demand[currentYear][currentFortnight].total += phaseDemand;
                        demand[currentYear][currentFortnight].cohortCount += 1;
                        demand[currentYear][currentFortnight].byTrainingType[phase.trainerDemandType] += phaseDemand;
                    }
                } else {
                    // Still count cohorts for GS+SIM phases
                    demand[currentYear][currentFortnight].cohortCount += 1;
                }

                // Track LT-CP demand for deficit calculation
                if (phase.trainerDemandType === 'LT-CP') {
                    const phaseDemand = cohort.numTrainees;
                    ltCpDeficit[currentYear][currentFortnight] += phaseDemand;
                }

                // Move to next fortnight
                currentFortnight++;
                if (currentFortnight > FORTNIGHTS_PER_YEAR) {
                    currentFortnight = 1;
                    currentYear++;
                }
            }
            
            // Update phase start fortnight for next phase
            phaseStartFortnight += phase.duration;
        });
    });

    // Perform cascading allocation based on priority config
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            const fortnightDemand = demand[year][fn];
            const supply = {};
            
            // Get available supply for this fortnight
            const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? locationData[currentLocation].trainerFTE : trainerFTE;
            TRAINER_CATEGORIES.forEach(cat => {
                supply[cat] = locationFTE[year][cat] / FORTNIGHTS_PER_YEAR;
            });
            
            // Allocate by priority order defined in priorityConfig
            priorityConfig.forEach(config => {
                const trainingDemand = fortnightDemand.byTrainingType[config.trainingType] || 0;
                if (trainingDemand > 0) {
                    let remainingDemand = trainingDemand;
                    
                    // First, allocate from primary trainers
                    config.primaryTrainers.forEach(cat => {
                        if (remainingDemand > 0 && TRAINER_QUALIFICATIONS[cat].includes(config.trainingType)) {
                            const available = supply[cat] - fortnightDemand.allocated[cat];
                            const toAllocate = Math.min(available, remainingDemand);
                            if (toAllocate > 0) {
                                fortnightDemand.allocated[cat] += toAllocate;
                                remainingDemand -= toAllocate;
                            }
                        }
                    });
                    
                    // Then, if needed, cascade from other pools
                    if (remainingDemand > 0) {
                        config.cascadingFrom.forEach(cat => {
                            if (remainingDemand > 0 && TRAINER_QUALIFICATIONS[cat].includes(config.trainingType)) {
                                const available = supply[cat] - fortnightDemand.allocated[cat];
                                const toAllocate = Math.min(available, remainingDemand);
                                if (toAllocate > 0) {
                                    fortnightDemand.allocated[cat] += toAllocate;
                                    remainingDemand -= toAllocate;
                                }
                            }
                        });
                    }
                    
                    // Track unallocated demand
                    fortnightDemand.unallocated[config.trainingType] = remainingDemand;
                }
            });
            
            // GS+SIM is no longer tracked in demand calculations
            
            // Calculate LT-CP deficit based on actual allocation
            const ltCpAllocated = Object.keys(fortnightDemand.allocated).reduce((sum, cat) => {
                // Count allocation that went to LT-CP from trainers that can do it
                if (TRAINER_QUALIFICATIONS[cat].includes('LT-CP')) {
                    // This is simplified - in reality we'd need to track what portion went to LT-CP
                    return sum + (fortnightDemand.allocated[cat] * 
                        (fortnightDemand.byTrainingType['LT-CP'] / fortnightDemand.total || 0));
                }
                return sum;
            }, 0);
            
            ltCpDeficit[year][fn] = Math.max(0, (fortnightDemand.byTrainingType['LT-CP'] || 0) - ltCpAllocated);
        }
    }

    // Now process ALL cohorts again to capture cross-location demand for the current view
    const activeLocation = document.querySelector('.location-tab.active')?.dataset.location || 'AU';
    
    const viewingLocation2 = document.querySelector('.location-toggle.active')?.textContent || 'AU';
    // console.log(`\n=== SECOND PASS: Looking for cohorts using ${activeLocation} trainers (viewing: ${viewingLocation2}) ===`);
    // console.log(`Total cohorts to check: ${activeCohorts.length}`);
    
    // We need to check ALL location's cohorts, not just the current view
    const allCohorts = [
        ...locationData.AU.activeCohorts,
        ...locationData.NZ.activeCohorts
    ];
    // console.log(`Checking ALL cohorts from both locations: ${allCohorts.length} total`);
    
    allCohorts.forEach(cohort => {
        // Need to find the pathway from the correct location's data
        const cohortPathways = cohort.location === 'AU' ? locationData.AU.pathways : locationData.NZ.pathways;
        const pathway = cohortPathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        const cohortName = cohort.name || `Cohort ${cohort.id}`;
        // console.log(`Checking cohort ${cohortName} from ${cohort.location}`);
        
        // Skip if this cohort is from the current location (already processed above)
        if (cohort.location === activeLocation) {
            // console.log(`- Skipping ${cohortName} - already processed in first pass`);
            return;
        }
        
        // Check if this cohort uses trainers from the current location
        if (!cohort.crossLocationTraining || !cohort.crossLocationTraining[activeLocation]) {
            // console.log(`- Skipping ${cohortName} - no cross-location config for ${activeLocation}`);
            return;
        }
        
        // console.log(`- ${cohortName} HAS cross-location config for ${activeLocation}:`, cohort.crossLocationTraining[activeLocation]);
        
        let currentYear = cohort.startYear;
        let currentFortnight = cohort.startFortnight;
        let phaseStartFortnight = 0;
        
        pathway.phases.forEach(phase => {
            for (let i = 0; i < phase.duration; i++) {
                if (currentYear > END_YEAR) break;
                
                if (phase.trainerDemandType) {
                    // Calculate globalFortnight the same way as in generateCrossLocationUI
                    const globalFortnight = (currentYear - 2024) * FORTNIGHTS_PER_YEAR + currentFortnight;
                    
                    // Check if this specific fortnight uses current location's trainers
                    if (cohort.crossLocationTraining[activeLocation].phases?.[phase.name]?.includes(globalFortnight)) {
                        const phaseDemand = cohort.numTrainees;
                        
                        // console.log(`Adding cross-location demand: Cohort ${cohortName} (${cohort.location}) using ${activeLocation} trainers for ${phase.name} in ${currentYear} FN${currentFortnight}`);
                        
                        // Add this demand to the current location
                        demand[currentYear][currentFortnight].total += phaseDemand;
                        demand[currentYear][currentFortnight].byTrainingType[phase.trainerDemandType] += phaseDemand;
                        
                        // Mark as cross-location demand for footnotes
                        demand[currentYear][currentFortnight].crossLocation[phase.trainerDemandType] = 
                            (demand[currentYear][currentFortnight].crossLocation[phase.trainerDemandType] || 0) + phaseDemand;
                        
                        // Also track in crossLocationDemand for split view
                        if (!crossLocationDemand[currentYear][currentFortnight][activeLocation]) {
                            crossLocationDemand[currentYear][currentFortnight][activeLocation] = {
                                total: 0,
                                byTrainingType: {}
                            };
                        }
                        crossLocationDemand[currentYear][currentFortnight][activeLocation].total += phaseDemand;
                        if (!crossLocationDemand[currentYear][currentFortnight][activeLocation].byTrainingType[phase.trainerDemandType]) {
                            crossLocationDemand[currentYear][currentFortnight][activeLocation].byTrainingType[phase.trainerDemandType] = 0;
                        }
                        crossLocationDemand[currentYear][currentFortnight][activeLocation].byTrainingType[phase.trainerDemandType] += phaseDemand;
                    }
                }
                
                currentFortnight++;
                if (currentFortnight > FORTNIGHTS_PER_YEAR) {
                    currentFortnight = 1;
                    currentYear++;
                }
            }
            phaseStartFortnight += phase.duration;
        });
    });
    
    return { demand, ltCpDeficit, crossLocationDemand };
}


// Track if we're in initial load to prevent flicker
let isInitialLoad = true;

// Render Gantt Chart
function renderGanttChart() {
    const container = document.getElementById('gantt-chart-container');
    
    if (activeCohorts.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No cohorts added yet. Add a cohort to see the Gantt chart.</p>';
        return;
    }
    
    // Sort and group cohorts
    let cohortGroups = {};
    
    if (viewState.groupBy === 'type') {
        // Group cohorts by pathway type
        activeCohorts.forEach(cohort => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            if (!pathway) return;
            
            const type = pathway.type || 'Other';
            if (!cohortGroups[type]) {
                cohortGroups[type] = [];
            }
            cohortGroups[type].push(cohort);
        });
        
        // Sort cohorts within each group
        Object.keys(cohortGroups).forEach(type => {
            cohortGroups[type].sort((a, b) => {
                if (a.startYear !== b.startYear) {
                    return a.startYear - b.startYear;
                }
                return a.startFortnight - b.startFortnight;
            });
        });
    } else {
        // No grouping - just sort all cohorts
        cohortGroups['All'] = [...activeCohorts].sort((a, b) => {
            if (a.startYear !== b.startYear) {
                return a.startYear - b.startYear;
            }
            return a.startFortnight - b.startFortnight;
        });
    }
    
    // Get time range
    const range = getTimeRangeForView();
    
    // Start building the Gantt chart HTML
    let html = '<div class="table-wrapper"><table class="gantt-table data-table">';
    
    // Create header with months and fortnights
    html += '<thead>';
    
    // Month row with custom first column
    html += '<tr>';
    html += '<th rowspan="2" class="sticky-first-column gantt-first-column">Cohort</th>';
    
    // Generate month headers for the range
    let currentYear = range.startYear;
    let currentFn = range.startFortnight;
    let monthCounts = {};
    
    // First pass: count fortnights per month within the range
    let tempYear = range.startYear;
    let tempFn = range.startFortnight;
    while (tempYear < range.endYear || (tempYear === range.endYear && tempFn <= range.endFortnight)) {
        const monthIndex = Math.floor((tempFn - 1) / 2);
        const monthKey = `${MONTHS[monthIndex]}-${tempYear}`;
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
        
        tempFn++;
        if (tempFn > FORTNIGHTS_PER_YEAR) {
            tempFn = 1;
            tempYear++;
        }
    }
    
    // Second pass: create month headers
    currentYear = range.startYear;
    currentFn = range.startFortnight;
    let lastMonth = null;
    let monthSpan = 0;
    
    while (currentYear < range.endYear || (currentYear === range.endYear && currentFn <= range.endFortnight)) {
        const monthIndex = Math.floor((currentFn - 1) / 2);
        const monthKey = `${MONTHS[monthIndex]}-${currentYear}`;
        
        if (lastMonth !== monthKey) {
            if (lastMonth && monthSpan > 0) {
                html += `<th colspan="${monthSpan}" class="month-header">${lastMonth}</th>`;
            }
            lastMonth = monthKey;
            monthSpan = 0;
        }
        monthSpan++;
        
        currentFn++;
        if (currentFn > FORTNIGHTS_PER_YEAR) {
            currentFn = 1;
            currentYear++;
        }
    }
    
    // Add the last month header
    if (lastMonth && monthSpan > 0) {
        html += `<th colspan="${monthSpan}" class="month-header">${lastMonth}</th>`;
    }
    
    html += '</tr>';
    
    // Fortnight row
    html += '<tr>';
    
    let fnYear = range.startYear;
    let fnNum = range.startFortnight;
    
    while (fnYear < range.endYear || (fnYear === range.endYear && fnNum <= range.endFortnight)) {
        html += `<th class="fortnight-header gantt-fortnight-header" 
                     data-column="${fnYear}-${fnNum}" 
                     onclick="handleColumnClick(event, ${fnYear}, ${fnNum})"
                     style="cursor: pointer;">FN${String(fnNum).padStart(2, '0')}</th>`;
        
        fnNum++;
        if (fnNum > FORTNIGHTS_PER_YEAR) {
            fnNum = 1;
            fnYear++;
        }
    }
    
    html += '</tr>';
    html += '</thead>';
    
    html += '<tbody>';
    
    // Render cohorts by group
    const groupOrder = ['CP', 'FO', 'CAD', 'All', 'Other'];
    const sortedGroups = Object.keys(cohortGroups).sort((a, b) => {
        return groupOrder.indexOf(a) - groupOrder.indexOf(b);
    });
    
    sortedGroups.forEach(groupName => {
        const cohorts = cohortGroups[groupName];
        
        // Add group header if grouping is enabled
        if (viewState.groupBy === 'type' && groupName !== 'All') {
            const isCollapsed = viewState.collapsedGroups.includes(groupName);
            html += `<tr class="group-header">`;
            html += `<td class="sticky-first-column group-header-cell" colspan="1">`;
            html += `<button class="group-toggle-btn" onclick="toggleGroup('${groupName}')">`;
            html += `<span class="toggle-icon">${isCollapsed ? '+' : '−'}</span> `;
            html += `${groupName} (${cohorts.length} cohorts)</button>`;
            html += `</td>`;
            
            // Fill remaining cells based on time range
            let fillYear = range.startYear;
            let fillFn = range.startFortnight;
            
            while (fillYear < range.endYear || (fillYear === range.endYear && fillFn <= range.endFortnight)) {
                html += `<td class="group-header-cell"></td>`;
                
                fillFn++;
                if (fillFn > FORTNIGHTS_PER_YEAR) {
                    fillFn = 1;
                    fillYear++;
                }
            }
            html += '</tr>';
            
            // Skip cohorts if group is collapsed
            if (isCollapsed) return;
        }
        
        // Render cohorts in this group
        cohorts.forEach((cohort, index) => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            if (!pathway) return;
        
        html += `<tr data-cohort-id="${cohort.id}" class="gantt-cohort-row">`;
        
        // Cohort label with edit and remove buttons
        const cohortLabel = `${cohort.numTrainees} x ${pathway.name}`;
        html += `<td class="sticky-first-column gantt-cohort-cell" title="${cohortLabel}">
            <div class="gantt-cohort-content">
                <span>${cohortLabel}</span>
                <div class="gantt-cohort-buttons">
                    <button onclick="editCohort(${cohort.id})" class="gantt-edit-btn" title="Edit cohort">✎</button>
                    <button onclick="removeCohort(${cohort.id})" class="gantt-remove-btn" title="Remove cohort">×</button>
                </div>
            </div>
        </td>`;
        
        // Create cells for each fortnight
        let currentYear = START_YEAR;
        let currentFortnight = 1;
        let cohortYear = cohort.startYear;
        let cohortFortnight = cohort.startFortnight;
        let phaseIndex = 0;
        let phaseProgress = 0;
        let currentPhase = null;
        
        // Track which cells should be filled
        const cellData = {};
        
        // Calculate cell data for this cohort
        let tempYear = cohort.startYear;
        let tempFortnight = cohort.startFortnight;
        let globalFortnightCounter = 0;
        
        pathway.phases.forEach((phase, pIndex) => {
            for (let i = 0; i < phase.duration; i++) {
                globalFortnightCounter++;
                const key = `${tempYear}-${tempFortnight}`;
                
                // Check if this fortnight uses cross-location training
                let usesCrossLocation = false;
                let crossLocationTo = null;
                
                if (cohort.crossLocationTraining && phase.trainerDemandType) {
                    // Calculate globalFortnight for comparison (same as demand calculation)
                    const globalFortnight = (tempYear - 2024) * FORTNIGHTS_PER_YEAR + tempFortnight;
                    
                    Object.entries(cohort.crossLocationTraining).forEach(([location, data]) => {
                        if (data.phases && data.phases[phase.trainerDemandType] && 
                            data.phases[phase.trainerDemandType].includes(globalFortnight)) {
                            usesCrossLocation = true;
                            crossLocationTo = location;
                            if (DEBUG_MODE) {
                                console.log(`Cross-location found: Cohort ${cohort.id}, Phase ${phase.trainerDemandType}, Global Fortnight ${globalFortnight}, To: ${location}`);
                            }
                        }
                    });
                }
                
                cellData[key] = {
                    phase: phase,
                    phaseIndex: pIndex,
                    isStart: i === 0,
                    isEnd: i === phase.duration - 1,
                    progress: i + 1,
                    totalDuration: phase.duration,
                    usesCrossLocation: usesCrossLocation,
                    crossLocationTo: crossLocationTo
                };
                
                tempFortnight++;
                if (tempFortnight > FORTNIGHTS_PER_YEAR) {
                    tempFortnight = 1;
                    tempYear++;
                }
            }
        });
        
        // Render cells based on time range
        let renderYear = range.startYear;
        let renderFn = range.startFortnight;
        
        while (renderYear < range.endYear || (renderYear === range.endYear && renderFn <= range.endFortnight)) {
            const cellKey = `${renderYear}-${renderFn}`;
            const cell = cellData[cellKey];
            
            if (cell) {
                const phaseColors = {
                    'GS+SIM': '#7f8c8d',  // Darker gray
                    'Ground School': '#7f8c8d',
                    'LT-CAD': '#2980b9',  // Darker blue
                    'LT-CP': '#27ae60',   // Green
                    'LT-FO': '#e67e22',   // Darker orange
                    'Flight Training': '#c0392b',  // Darker red
                    'Line Training': '#27ae60'
                };
                
                let backgroundColor = phaseColors[cell.phase.name] || '#9b59b6';
                let cellContent = '';
                let cellStyle = `background-color: ${backgroundColor} !important;`;
                
                // Add phase name if it's the start of the phase
                // For short phases (1-2 fortnights), use smaller font or abbreviation
                if (cell.isStart) {
                    if (cell.phase.duration >= 3) {
                        const displayName = cell.phase.name === 'GS+SIM' ? 'GS' : cell.phase.name;
                        cellContent = `<span style="font-size: 10px; color: white; font-weight: 500;">${displayName}</span>`;
                    } else if (cell.phase.duration === 2) {
                        // For 2-fortnight phases, use abbreviated text
                        const abbreviation = cell.phase.name === 'GS+SIM' ? 'GS' : cell.phase.name.replace('LT-', '');
                        cellContent = `<span style="font-size: 9px; color: white; font-weight: 500;">${abbreviation}</span>`;
                    }
                    // For 1-fortnight phases, no text (too small)
                }
                
                let tooltip = `${cohort.numTrainees} x ${pathway.name}\n${cell.phase.name}\nFortnight ${cell.progress}/${cell.totalDuration}\nYear ${renderYear}, Fortnight ${renderFn}`;
                
                // Add cross-location indicator
                if (cell.usesCrossLocation) {
                    tooltip += `\n⚡ Using ${cell.crossLocationTo} trainers`;
                    
                    // Add white dot indicator only (smaller size)
                    cellContent += `<span style="position: absolute; top: 2px; right: 2px; width: 4px; height: 4px; background: #ffffff; border: 1px solid rgba(0,0,0,0.3); border-radius: 50%; z-index: 100;"></span>`;
                }
                
                // Add draggable attribute to the first cell of the first phase
                const isDraggable = cell.phaseIndex === 0 && cell.isStart;
                const draggableAttrs = isDraggable ? `draggable="true" data-cohort-id="${cohort.id}" class="gantt-phase-cell data-cell draggable-cohort"` : `class="gantt-phase-cell data-cell"`;
                
                html += `<td ${draggableAttrs} data-column="${renderYear}-${renderFn}" style="${cellStyle} ${isDraggable ? 'cursor: grab;' : ''} position: relative; overflow: visible;" title="${tooltip}">${cellContent}</td>`;
            } else {
                // Empty cell
                html += `<td class="gantt-empty-cell data-cell" data-column="${renderYear}-${renderFn}"></td>`;
            }
            
            renderFn++;
            if (renderFn > FORTNIGHTS_PER_YEAR) {
                renderFn = 1;
                renderYear++;
            }
        }
        
        html += '</tr>';
        });
    });
    
    // Add cross-location cohorts section
    // console.log('=== Starting cross-location cohorts section ===');
    // console.log('Global currentLocation:', currentLocation);
    // console.log('locationData:', locationData);
    
    // Use the global currentLocation variable instead of querying DOM
    const otherLocation = currentLocation === 'AU' ? 'NZ' : 'AU';
    const crossLocationCohorts = [];
    
    // Find cohorts from other locations that use current location's trainers
    const otherLocationCohorts = locationData[otherLocation]?.activeCohorts || [];
    // console.log(`Checking for cross-location cohorts: currentLocation=${currentLocation}, otherLocation=${otherLocation}`);
    // console.log(`Other location cohorts count: ${otherLocationCohorts.length}`);
    
    otherLocationCohorts.forEach(cohort => {
        if (cohort.crossLocationTraining && cohort.crossLocationTraining[currentLocation]) {
            // console.log(`Cohort ${cohort.id} has cross-location training to ${currentLocation}:`, cohort.crossLocationTraining[currentLocation]);
            // Check if any phases have cross-location training
            const hasRelevantTraining = Object.values(cohort.crossLocationTraining[currentLocation].phases || {}).some(fortnights => fortnights.length > 0);
            if (hasRelevantTraining) {
                // console.log(`Adding cohort ${cohort.id} to cross-location display`);
                crossLocationCohorts.push(cohort);
            }
        }
    });
    
    // console.log(`Total cross-location cohorts found: ${crossLocationCohorts.length}`);
    
    // Render cross-location cohorts if any exist
    if (crossLocationCohorts.length > 0) {
        // Add group header for cross-location cohorts
        html += `<tr class="group-header cross-location-group">`;
        html += `<td class="sticky-first-column group-header-cell" colspan="1">`;
        html += `<span style="color: #3498db; font-weight: bold;">📍 Training from ${otherLocation}</span>`;
        html += `</td>`;
        
        // Fill remaining cells
        let fillYear = range.startYear;
        let fillFn = range.startFortnight;
        
        while (fillYear < range.endYear || (fillYear === range.endYear && fillFn <= range.endFortnight)) {
            html += `<td class="group-header-cell" style="background: rgba(52, 152, 219, 0.1);"></td>`;
            
            fillFn++;
            if (fillFn > FORTNIGHTS_PER_YEAR) {
                fillFn = 1;
                fillYear++;
            }
        }
        html += '</tr>';
        
        // Render each cross-location cohort
        crossLocationCohorts.forEach(cohort => {
            const cohortPathways = locationData[otherLocation].pathways;
            const pathway = cohortPathways.find(p => p.id === cohort.pathwayId);
            if (!pathway) return;
            
            html += `<tr class="gantt-cohort-row cross-location-row">`;
            
            // Cohort label
            const cohortLabel = `${cohort.numTrainees} x ${pathway.name} (${otherLocation})`;
            html += `<td class="sticky-first-column gantt-cohort-cell" style="background: rgba(52, 152, 219, 0.05);" title="${cohortLabel}">`;
            html += `<div class="cohort-info">`;
            html += `<span class="cohort-label">${cohortLabel}</span>`;
            html += `</div>`;
            html += `</td>`;
            
            // Calculate which fortnights to show
            let tempYear = cohort.startYear;
            let tempFortnight = cohort.startFortnight;
            let globalFortnightCounter = 0;
            const crossLocationCells = {};
            
            pathway.phases.forEach((phase, pIndex) => {
                for (let i = 0; i < phase.duration; i++) {
                    globalFortnightCounter++;
                    
                    // Calculate globalFortnight the same way as in demand calculation
                    const globalFortnight = (tempYear - 2024) * FORTNIGHTS_PER_YEAR + tempFortnight;
                    
                    // Check if this fortnight uses cross-location training
                    if (phase.trainerDemandType && cohort.crossLocationTraining[currentLocation]?.phases?.[phase.trainerDemandType]?.includes(globalFortnight)) {
                        const key = `${tempYear}-${tempFortnight}`;
                        crossLocationCells[key] = {
                            phase: phase,
                            progress: i + 1,
                            totalDuration: phase.duration
                        };
                        // console.log(`Cross-location cell added for cohort ${cohort.id}: ${key}, phase: ${phase.trainerDemandType}`);
                    }
                    
                    tempFortnight++;
                    if (tempFortnight > FORTNIGHTS_PER_YEAR) {
                        tempFortnight = 1;
                        tempYear++;
                    }
                }
            });
            
            // Render cells
            let renderYear = range.startYear;
            let renderFn = range.startFortnight;
            
            while (renderYear < range.endYear || (renderYear === range.endYear && renderFn <= range.endFortnight)) {
                const cellKey = `${renderYear}-${renderFn}`;
                const cell = crossLocationCells[cellKey];
                
                if (cell) {
                    const phaseColors = {
                        'LT-CAD': '#2980b9',
                        'LT-CP': '#27ae60',
                        'LT-FO': '#e67e22'
                    };
                    
                    const backgroundColor = phaseColors[cell.phase.name] || '#9b59b6';
                    const tooltip = `${cohort.numTrainees} x ${pathway.name}\n${cell.phase.name} (from ${otherLocation})\nUsing ${currentLocation} trainers`;
                    
                    // Show the training type abbreviation
                    const abbreviation = cell.phase.name.replace('LT-', '');
                    
                    html += `<td class="gantt-phase-cell data-cell" data-column="${renderYear}-${renderFn}" style="background-color: ${backgroundColor} !important; position: relative;" title="${tooltip}">`;
                    html += `<span style="font-size: 9px; color: white; font-weight: 500;">${abbreviation}</span>`;
                    html += `</td>`;
                } else {
                    html += `<td class="gantt-empty-cell data-cell" data-column="${renderYear}-${renderFn}"></td>`;
                }
                
                renderFn++;
                if (renderFn > FORTNIGHTS_PER_YEAR) {
                    renderFn = 1;
                    renderYear++;
                }
            }
            
            html += '</tr>';
        });
    }
    
    html += '</tbody>';
    html += '</table></div>';
    
    // Add legend for cross-location indicators
    html += '<div class="gantt-legend" style="margin-top: 10px; padding: 10px; background: var(--bg-secondary); border-radius: 6px; font-size: 13px; color: var(--text-secondary);">';
    html += '<div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">';
    html += '<span style="font-weight: 600;">Legend:</span>';
    html += '<div style="display: flex; align-items: center; gap: 5px;">';
    html += '<span style="width: 4px; height: 4px; background: #ffffff; border: 1px solid rgba(0,0,0,0.3); border-radius: 50%; display: inline-block;"></span>';
    html += '<span>Cross-location training (using trainers from other location)</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
    
    // Setup drag and drop event listeners
    setupGanttDragAndDrop();
    
    // Re-establish synchronized scrolling after rendering
    const timeout = viewState.currentView === 'all' ? 150 : 100;
    setTimeout(() => {
        setupSynchronizedScrolling();
        // console.log('Sync re-established after Gantt chart render');
    }, timeout);
}

// Setup Gantt Drag and Drop
function setupGanttDragAndDrop() {
    // Update cell width from CSS
    const columnWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--column-width') || '50');
    dragState.cellWidth = columnWidth;
    
    // Find all draggable cohort cells
    const draggableCells = document.querySelectorAll('.draggable-cohort');
    const ganttTable = document.querySelector('.gantt-table');
    
    draggableCells.forEach(cell => {
        // Drag start
        cell.addEventListener('dragstart', handleDragStart);
        
        // Visual feedback during drag
        cell.addEventListener('dragend', handleDragEnd);
    });
    
    // Add drop zone listeners to all cells
    if (ganttTable) {
        ganttTable.addEventListener('dragover', handleDragOver);
        ganttTable.addEventListener('drop', handleDrop);
    }
}

function handleDragStart(e) {
    const cohortId = parseInt(e.target.dataset.cohortId);
    const cohort = activeCohorts.find(c => c.id === cohortId);
    
    if (!cohort) return;
    
    // Store drag state
    dragState.isDragging = true;
    dragState.draggedCohort = cohort;
    dragState.originalStartYear = cohort.startYear;
    dragState.originalStartFortnight = cohort.startFortnight;
    dragState.mouseStartX = e.clientX;
    
    // Add dragging class for visual feedback
    e.target.classList.add('dragging');
    e.target.style.cursor = 'grabbing';
    
    // Set drag effect
    e.dataTransfer.effectAllowed = 'move';
    
    // Store cohort ID in data transfer
    e.dataTransfer.setData('text/plain', cohortId);
}

function handleDragEnd(e) {
    // Remove dragging class
    e.target.classList.remove('dragging');
    e.target.style.cursor = 'grab';
    
    // Reset drag state
    dragState.isDragging = false;
    dragState.draggedCohort = null;
    
    // Remove any drop indicators
    const dropIndicators = document.querySelectorAll('.drop-indicator');
    dropIndicators.forEach(indicator => indicator.remove());
}

function handleDragOver(e) {
    if (!dragState.isDragging) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Calculate which cell we're over
    const cell = e.target.closest('td');
    if (!cell || !cell.classList.contains('data-cell')) return;
    
    // Get the row and cell index
    const row = cell.closest('tr');
    const cells = Array.from(row.querySelectorAll('td.data-cell'));
    const cellIndex = cells.indexOf(cell);
    
    if (cellIndex === -1) return;
    
    // Calculate the year and fortnight from cell position
    const range = getTimeRangeForView();
    let targetYear = range.startYear;
    let targetFortnight = range.startFortnight;
    
    // Advance by cellIndex fortnights
    for (let i = 0; i < cellIndex; i++) {
        targetFortnight++;
        if (targetFortnight > FORTNIGHTS_PER_YEAR) {
            targetFortnight = 1;
            targetYear++;
        }
    }
    
    // Update current drop position
    dragState.currentDropYear = targetYear;
    dragState.currentDropFortnight = targetFortnight;
    
    // Show drop indicator
    showDropIndicator(cell, targetYear, targetFortnight);
}

function handleDrop(e) {
    e.preventDefault();
    
    if (!dragState.isDragging || !dragState.draggedCohort) return;
    
    const cohortId = parseInt(e.dataTransfer.getData('text/plain'));
    const cohort = activeCohorts.find(c => c.id === cohortId);
    
    if (!cohort || !dragState.currentDropYear || !dragState.currentDropFortnight) return;
    
    // Get pathway details for the notification
    const pathway = pathways.find(p => p.id === cohort.pathwayId);
    const cohortLabel = pathway ? `${cohort.numTrainees} x ${pathway.name}` : `Cohort ${cohort.id}`;
    
    // Check if the position has actually changed
    if (cohort.startYear === dragState.currentDropYear && 
        cohort.startFortnight === dragState.currentDropFortnight) {
        // No change - show info message
        showNotification('No changes made', 'info');
        return;
    }
    
    // Get month name for the new position
    const newMonthIndex = FORTNIGHT_TO_MONTH[dragState.currentDropFortnight];
    const newMonthName = MONTHS[newMonthIndex];
    
    // Update cohort dates
    cohort.startYear = dragState.currentDropYear;
    cohort.startFortnight = dragState.currentDropFortnight;
    
    // Recalculate and re-render
    updateAllTables();
    renderGanttChart();
    markDirty();  // Mark scenario as modified
    
    // Show success message with detailed information
    showNotification(`${cohortLabel} moved to ${newMonthName} ${cohort.startYear}, FN${cohort.startFortnight}`, 'success');
}

function showDropIndicator(cell, year, fortnight) {
    // Remove existing indicators
    const existingIndicators = document.querySelectorAll('.drop-indicator');
    existingIndicators.forEach(indicator => indicator.remove());
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'drop-indicator';
    indicator.style.position = 'absolute';
    indicator.style.left = cell.offsetLeft + 'px';
    indicator.style.top = cell.offsetTop + 'px';
    indicator.style.width = cell.offsetWidth + 'px';
    indicator.style.height = cell.offsetHeight + 'px';
    indicator.style.border = '2px dashed #3498db';
    indicator.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    indicator.style.pointerEvents = 'none';
    indicator.style.zIndex = '1000';
    
    cell.closest('.table-wrapper').appendChild(indicator);
}

// Render Priority Settings Table
function renderPrioritySettingsTable() {
    const container = document.getElementById('priority-settings-container');
    let html = `
        <table class="priority-settings-table">
            <thead>
                <tr>
                    <th>Priority Level</th>
                    <th>Training Type</th>
                    <th>Primary Trainers</th>
                    <th>Can Receive Help From</th>
                </tr>
            </thead>
            <tbody>
    `;

    priorityConfig.forEach(config => {
        const primaryList = config.primaryTrainers.join(', ');
        const cascadeList = config.cascadingFrom.length > 0 ? config.cascadingFrom.join(', ') : 'None';
        
        html += `
            <tr>
                <td><strong>${config.priority}</strong></td>
                <td>${config.trainingType}</td>
                <td>${primaryList}</td>
                <td>${cascadeList}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
    
    // Update trainee summary
    updateGanttTraineeSummary();
}

// Update trainee summary in Training Commencement Summary header
function updateGanttTraineeSummary() {
    const summaryElement = document.getElementById('trainee-summary');
    if (!summaryElement) return;
    
    // Get time range based on current view
    const range = getTimeRangeForView();
    
    // Count trainees by type in the visible time range
    let cpCount = 0;
    let foCount = 0;
    let cadCount = 0;
    
    activeCohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        // Check if cohort is active in the visible time range
        let cohortEndYear = cohort.startYear;
        let cohortEndFortnight = cohort.startFortnight;
        
        // Calculate end date
        pathway.phases.forEach(phase => {
            cohortEndFortnight += phase.duration;
            while (cohortEndFortnight > FORTNIGHTS_PER_YEAR) {
                cohortEndFortnight -= FORTNIGHTS_PER_YEAR;
                cohortEndYear++;
            }
        });
        
        // Check if cohort overlaps with view range
        const cohortStartsBeforeOrInRange = 
            cohort.startYear < range.endYear || 
            (cohort.startYear === range.endYear && cohort.startFortnight <= range.endFortnight);
            
        const cohortEndsAfterOrInRange = 
            cohortEndYear > range.startYear || 
            (cohortEndYear === range.startYear && cohortEndFortnight >= range.startFortnight);
            
        if (cohortStartsBeforeOrInRange && cohortEndsAfterOrInRange) {
            // Cohort is in view range
            if (pathway.type === 'CP') {
                cpCount += cohort.numTrainees;
            } else if (pathway.type === 'FO') {
                foCount += cohort.numTrainees;
            } else if (pathway.type === 'CAD') {
                cadCount += cohort.numTrainees;
            }
        }
    });
    
    const totalCount = cpCount + foCount + cadCount;
    
    // Build summary HTML
    let summaryHtml = '';
    if (cpCount > 0) summaryHtml += `<strong>CP:</strong> ${cpCount} `;
    if (foCount > 0) summaryHtml += `<strong>FO:</strong> ${foCount} `;
    if (cadCount > 0) summaryHtml += `<strong>CAD:</strong> ${cadCount} `;
    
    if (summaryHtml) {
        summaryHtml += `<span style="margin-left: 10px;">(Total: ${totalCount})</span>`;
    } else {
        summaryHtml = 'No trainees in view';
    }
    
    summaryElement.innerHTML = summaryHtml;
}

// Render Pathways Table
function renderPathwaysTable() {
    const container = document.getElementById('pathways-table-container');
    
    // Sort pathways by type (CP first) and then by ID
    const cpPathways = pathways.filter(p => p.type === 'CP').sort((a, b) => a.id.localeCompare(b.id));
    const otherPathways = pathways.filter(p => p.type !== 'CP').sort((a, b) => a.id.localeCompare(b.id));
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Pathway Name</th>
                    <th>Type</th>
                    <th>Start Rank</th>
                    <th>End Rank</th>
                    <th>Usable (months)</th>
                    <th>Phases</th>
                    <th>Duration</th>
                    <th>Comments</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Render CP pathways
    if (cpPathways.length > 0) {
        html += '<tr><td colspan="10" style="background-color: #f0f0f0; font-weight: bold; padding: 10px;">Captain (CP) Pathways</td></tr>';
        cpPathways.forEach(pathway => {
            const totalDuration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
            const phaseSummary = pathway.phases.map(p => `${p.name} (${p.duration}fn)`).join(', ');
            
            html += `
                <tr>
                    <td>${pathway.id}</td>
                    <td>${pathway.name}</td>
                    <td>${pathway.type}</td>
                    <td>${pathway.startRank || '-'}</td>
                    <td>${pathway.endRank || '-'}</td>
                    <td>${pathway.usableMonths || 0}</td>
                    <td style="font-size: 0.9em;">${phaseSummary}</td>
                    <td>${totalDuration}fn</td>
                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${pathway.comments || '-'}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="editPathway('${pathway.id}')">Edit</button>
                    </td>
                </tr>
            `;
        });
    }
    
    // Render FO/CAD pathways
    if (otherPathways.length > 0) {
        html += '<tr><td colspan="10" style="background-color: #f0f0f0; font-weight: bold; padding: 10px;">First Officer (FO) / Cadet (CAD) Pathways</td></tr>';
        otherPathways.forEach(pathway => {
            const totalDuration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
            const phaseSummary = pathway.phases.map(p => `${p.name} (${p.duration}fn)`).join(', ');
            
            html += `
                <tr>
                    <td>${pathway.id}</td>
                    <td>${pathway.name}</td>
                    <td>${pathway.type}</td>
                    <td>${pathway.startRank || '-'}</td>
                    <td>${pathway.endRank || '-'}</td>
                    <td>${pathway.usableMonths || 0}</td>
                    <td style="font-size: 0.9em;">${phaseSummary}</td>
                    <td>${totalDuration}fn</td>
                    <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${pathway.comments || '-'}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="editPathway('${pathway.id}')">Edit</button>
                    </td>
                </tr>
            `;
        });
    }

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Modal Management
// FTE editor state
let fteYearOffset = 0; // Year offset for FTE editor

function openFTEModal() {
    // console.log('Opening FTE modal...');
    const container = document.getElementById('fte-edit-container');
    
    let html = '<div style="max-height: 500px; overflow-y: auto;">';
    
    // Info about FTE settings
    html += '<div style="margin-bottom: 15px; padding: 10px; background-color: var(--bg-secondary); border-radius: 5px; border-left: 4px solid #2196f3;">';
    html += '<p style="margin: 0; font-size: 0.9em; color: var(--text-primary);"><strong>Note:</strong> These FTE values are for the current location (' + currentLocation + '). ';
    html += 'Changes here will apply to the current scenario. To save as system defaults (persistent across refreshes), use "Save as Default" below.</p>';
    html += '<p style="margin: 5px 0 0 0; font-size: 0.85em; color: var(--text-secondary);"><em>Tip: You can copy/paste values between cells. Select cells with click+drag or Shift+click.</em></p>';
    html += '</div>';
    
    // Year navigation
    html += '<div style="margin-bottom: 15px; display: flex; justify-content: center; align-items: center; gap: 15px;">';
    html += '<button type="button" class="btn btn-secondary" onclick="navigateFTEYears(-1)">◀ Previous</button>';
    html += '<span id="fte-year-display" style="font-weight: bold; font-size: 1.1em;"></span>';
    html += '<button type="button" class="btn btn-secondary" onclick="navigateFTEYears(1)">Next ▶</button>';
    html += '</div>';

    html += generateFTEInputFields();
    html += '</div>';

    container.innerHTML = html;
    
    // Update year display
    const currentYear = new Date().getFullYear();
    const startYear = Math.max(START_YEAR, currentYear - 1 + fteYearOffset);
    const endYear = Math.min(END_YEAR, currentYear + 1 + fteYearOffset);
    const yearDisplay = document.getElementById('fte-year-display');
    if (yearDisplay) {
        yearDisplay.textContent = `${startYear} - ${endYear}`;
    }
    
    // Setup selection handlers
    setupFTESelection();
    
    fteModal.classList.add('active');
    
    // Debug: Check if inputs are created and accessible
    setTimeout(() => {
        const inputs = container.querySelectorAll('input[type="number"]');
        // console.log('FTE inputs created:', inputs.length);
        if (inputs.length > 0) {
            // console.log('First input:', inputs[0], 'disabled:', inputs[0].disabled, 'readonly:', inputs[0].readOnly);
        }
    }, 100);
}

function generateFTEInputFields() {
    let html = '';
    
    // Calculate which years to show
    const currentYear = new Date().getFullYear();
    const startYear = Math.max(START_YEAR, currentYear - 1 + fteYearOffset);
    const endYear = Math.min(END_YEAR, currentYear + 1 + fteYearOffset);
    
    // Update year display
    const yearDisplay = document.getElementById('fte-year-display');
    if (yearDisplay) {
        yearDisplay.textContent = `${startYear} - ${endYear}`;
    }
    
    // Create a simple table for years with FTE per fortnight
    html += '<table class="fte-edit-table" style="width: 100%; border-collapse: collapse;">';
    html += '<thead>';
    html += '<tr>';
    html += '<th style="text-align: left; padding: 10px; background-color: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary);">Year</th>';
    
    // Add column headers for each trainer category
    TRAINER_CATEGORIES.forEach(category => {
        html += `<th style="text-align: center; padding: 10px; background-color: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-primary);">${category}</th>`;
    });
    html += '</tr>';
    html += '</thead>';
    html += '<tbody id="fte-table-body">';
    
    // Add rows for each year
    for (let year = startYear; year <= endYear; year++) {
        html += '<tr>';
        html += `<td style="padding: 10px; font-weight: 500; border: 1px solid var(--border-color); background-color: var(--bg-secondary); color: var(--text-primary);">${year}</td>`;
        
        TRAINER_CATEGORIES.forEach(category => {
            // Use location-specific FTE if available
            const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? 
                locationData[currentLocation].trainerFTE : trainerFTE;
            const fortnightlyFTE = locationFTE[year][category] / FORTNIGHTS_PER_YEAR;
            html += `<td class="fte-cell" style="padding: 8px; text-align: center; border: 1px solid var(--border-color); cursor: cell;">`;
            html += `<input type="number" id="fte-${year}-${category}" name="fte-${year}-${category}" `;
            html += `value="${fortnightlyFTE.toFixed(1)}" min="0" step="0.5" style="width: 80px; text-align: center; border: 1px solid #ccc; background: white; color: inherit; user-select: text; pointer-events: auto;" `;
            html += `data-year="${year}" data-category="${category}" `;
            html += `onpaste="handleFTEPaste(event, ${year}, '${category}')" onkeydown="handleFTEKeyDown(event, ${year}, '${category}')" `;
            // html += `onfocus="this.select(); console.log('FTE input focused:', this.id)" onclick="console.log('FTE input clicked:', this.id)" onmousedown="handleFTEMouseDown(event, ${year}, '${category}')"`;
            html += `></td>`;
        });
        html += '</tr>';
    }
    
    html += '</tbody>';
    html += '</table>';
    
    return html;
}

// FTE cell selection state
let fteSelection = {
    startCell: null,
    endCell: null,
    isSelecting: false,
    selectedCells: new Set()
};

function navigateFTEYears(direction) {
    fteYearOffset += direction;
    
    // Ensure we stay within bounds
    const currentYear = new Date().getFullYear();
    const minOffset = START_YEAR - (currentYear - 1);
    const maxOffset = END_YEAR - (currentYear + 1);
    fteYearOffset = Math.max(minOffset, Math.min(maxOffset, fteYearOffset));
    
    // Regenerate the table
    const container = document.getElementById('fte-edit-container');
    if (container) {
        const wrapper = container.querySelector('div');
        if (wrapper) {
            const existingTable = wrapper.querySelector('.fte-edit-table');
            if (existingTable) {
                const newTableHTML = generateFTEInputFields();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newTableHTML;
                existingTable.replaceWith(tempDiv.firstChild);
                
                // Update year display
                const yearDisplay = document.getElementById('fte-year-display');
                if (yearDisplay) {
                    const currentYear = new Date().getFullYear();
                    const startYear = Math.max(START_YEAR, currentYear - 1 + fteYearOffset);
                    const endYear = Math.min(END_YEAR, currentYear + 1 + fteYearOffset);
                    yearDisplay.textContent = `${startYear} - ${endYear}`;
                }
                
                // Setup selection handlers
                setupFTESelection();
            }
        }
    }
}

function handleFTEMouseDown(event, year, category) {
    // Don't prevent default for input elements - they need to focus
    if (event.target.tagName === 'INPUT') {
        // console.log('Allowing input focus for:', event.target.id);
        return;
    }
    
    event.preventDefault();
    
    // Clear previous selection
    document.querySelectorAll('.fte-cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
    
    fteSelection.isSelecting = true;
    fteSelection.startCell = { year, category };
    fteSelection.endCell = { year, category };
    fteSelection.selectedCells.clear();
    
    // Add selection class
    const cell = event.target.closest('.fte-cell');
    if (cell) {
        cell.classList.add('selected');
        fteSelection.selectedCells.add(`${year}-${category}`);
    }
    
    // Add document-level mouse events
    document.addEventListener('mousemove', handleFTEMouseMove);
    document.addEventListener('mouseup', handleFTEMouseUp);
    
    // Enable copy functionality
    document.addEventListener('copy', handleFTECopy);
}

function handleFTEMouseMove(event) {
    if (!fteSelection.isSelecting) return;
    
    // Find the cell under the mouse
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const input = element?.closest('input[data-year][data-category]');
    
    if (input) {
        const year = parseInt(input.dataset.year);
        const category = input.dataset.category;
        
        if (year && category) {
            fteSelection.endCell = { year, category };
            updateFTESelection();
        }
    }
}

function handleFTEMouseUp() {
    fteSelection.isSelecting = false;
    document.removeEventListener('mousemove', handleFTEMouseMove);
    document.removeEventListener('mouseup', handleFTEMouseUp);
}

function updateFTESelection() {
    // Clear previous selection
    document.querySelectorAll('.fte-cell.selected').forEach(cell => {
        cell.classList.remove('selected');
    });
    fteSelection.selectedCells.clear();
    
    if (!fteSelection.startCell || !fteSelection.endCell) return;
    
    // Calculate selection bounds
    const startYearIndex = fteSelection.startCell.year - START_YEAR;
    const endYearIndex = fteSelection.endCell.year - START_YEAR;
    const startCatIndex = TRAINER_CATEGORIES.indexOf(fteSelection.startCell.category);
    const endCatIndex = TRAINER_CATEGORIES.indexOf(fteSelection.endCell.category);
    
    const minYear = Math.min(fteSelection.startCell.year, fteSelection.endCell.year);
    const maxYear = Math.max(fteSelection.startCell.year, fteSelection.endCell.year);
    const minCat = Math.min(startCatIndex, endCatIndex);
    const maxCat = Math.max(startCatIndex, endCatIndex);
    
    // Select all cells in the rectangle
    for (let y = minYear; y <= maxYear; y++) {
        for (let c = minCat; c <= maxCat; c++) {
            const category = TRAINER_CATEGORIES[c];
            const input = document.getElementById(`fte-${y}-${category}`);
            if (input) {
                const cell = input.closest('.fte-cell');
                if (cell) {
                    cell.classList.add('selected');
                    fteSelection.selectedCells.add(`${y}-${category}`);
                }
            }
        }
    }
}

function handleFTECopy(event) {
    if (fteSelection.selectedCells.size === 0) return;
    
    event.preventDefault();
    
    // Get selected values in order
    const values = [];
    const cells = Array.from(fteSelection.selectedCells).sort((a, b) => {
        const [yearA, catA] = a.split('-');
        const [yearB, catB] = b.split('-');
        const catIndexA = TRAINER_CATEGORIES.indexOf(catA);
        const catIndexB = TRAINER_CATEGORIES.indexOf(catB);
        
        if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
        return catIndexA - catIndexB;
    });
    
    let currentYear = null;
    let rowValues = [];
    
    cells.forEach(cellKey => {
        const [year, category] = cellKey.split('-');
        if (currentYear && year !== currentYear) {
            values.push(rowValues.join('\t'));
            rowValues = [];
        }
        currentYear = year;
        
        const input = document.getElementById(`fte-${year}-${category}`);
        if (input) {
            rowValues.push(input.value);
        }
    });
    
    if (rowValues.length > 0) {
        values.push(rowValues.join('\t'));
    }
    
    // Copy to clipboard
    event.clipboardData.setData('text/plain', values.join('\n'));
}

function setupFTESelection() {
    // Add selection styles if not already present
    if (!document.getElementById('fte-selection-styles')) {
        const style = document.createElement('style');
        style.id = 'fte-selection-styles';
        style.textContent = `
            .fte-cell.selected {
                background-color: rgba(52, 152, 219, 0.2) !important;
            }
            .dark-mode .fte-cell.selected {
                background-color: rgba(52, 152, 219, 0.3) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function saveFTEAsDefault() {
    // First, save the current form values
    const form = document.getElementById('fte-edit-form');
    if (form) {
        // Trigger form save first
        const event = new Event('submit', { cancelable: true });
        form.dispatchEvent(event);
    }
    
    // Then save as default
    saveDefaultFTE();
    showNotification(`Default FTE values saved for ${currentLocation}. These will persist across browser refreshes.`, 'success');
}

// Handle paste event in FTE cells
function handleFTEPaste(event, year, category) {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    const values = pastedData.split(/[\t\n\r,; ]+/).filter(v => v.trim() !== '');
    
    if (values.length === 0) return;
    
    // Get current position
    const yearIndex = year - START_YEAR;
    const categoryIndex = TRAINER_CATEGORIES.indexOf(category);
    
    let valueIndex = 0;
    
    // Paste across categories first, then years
    for (let y = yearIndex; y <= END_YEAR - START_YEAR && valueIndex < values.length; y++) {
        for (let c = categoryIndex; c < TRAINER_CATEGORIES.length && valueIndex < values.length; c++) {
            const targetYear = START_YEAR + y;
            const targetCategory = TRAINER_CATEGORIES[c];
            const input = document.getElementById(`fte-${targetYear}-${targetCategory}`);
            
            if (input) {
                const value = parseFloat(values[valueIndex]);
                if (!isNaN(value)) {
                    input.value = value.toFixed(1);
                }
                valueIndex++;
            }
        }
        // Reset to first category for next row
        if (valueIndex < values.length && y < END_YEAR - START_YEAR) {
            categoryIndex = 0;
        }
    }
}

// Handle keyboard navigation in FTE grid
function handleFTEKeyDown(event, year, category) {
    const categoryIndex = TRAINER_CATEGORIES.indexOf(category);
    let newYear = year;
    let newCategory = category;
    
    switch(event.key) {
        case 'ArrowUp':
            if (year > START_YEAR) {
                newYear = year - 1;
                event.preventDefault();
            }
            break;
        case 'ArrowDown':
            if (year < END_YEAR) {
                newYear = year + 1;
                event.preventDefault();
            }
            break;
        case 'ArrowLeft':
            if (categoryIndex > 0) {
                newCategory = TRAINER_CATEGORIES[categoryIndex - 1];
                event.preventDefault();
            }
            break;
        case 'ArrowRight':
            if (categoryIndex < TRAINER_CATEGORIES.length - 1) {
                newCategory = TRAINER_CATEGORIES[categoryIndex + 1];
                event.preventDefault();
            }
            break;
        case 'Enter':
            if (event.shiftKey && year > START_YEAR) {
                newYear = year - 1;
            } else if (year < END_YEAR) {
                newYear = year + 1;
            }
            event.preventDefault();
            break;
        case 'Tab':
            // Let default tab behavior work
            return;
        default:
            return;
    }
    
    // Focus the new cell
    const newInput = document.getElementById(`fte-${newYear}-${newCategory}`);
    if (newInput) {
        newInput.focus();
        newInput.select();
    }
}

// Removed switchFTEInputMode function as it's no longer needed

function openAddPathwayModal() {
    document.getElementById('pathway-modal-title').textContent = 'Add New Pathway';
    document.getElementById('pathway-name').value = '';
    
    // Restructure form for better layout
    const pathwayForm = document.getElementById('pathway-edit-form');
    
    // Clear and rebuild form structure
    const existingGroups = pathwayForm.querySelectorAll('.form-group, .pathway-form-row, .rank-form-row');
    existingGroups.forEach(group => group.remove());
    
    // Add pathway name, type, and comments in three-column layout
    const mainFieldsHtml = `
        <div class="pathway-form-row three-column">
            <div class="form-group">
                <label for="pathway-name">Pathway Name:</label>
                <input type="text" id="pathway-name" name="pathwayName" required>
            </div>
            <div class="form-group pathway-type-group">
                <label for="pathway-type">Pathway Type:</label>
                <select id="pathway-type" name="pathwayType" required>
                    <option value="CP">Captain (CP)</option>
                    <option value="FO">First Officer (FO)</option>
                    <option value="CAD">Cadet (CAD)</option>
                </select>
            </div>
            <div class="form-group comments-group">
                <label for="pathway-comments">Comments:</label>
                <input type="text" id="pathway-comments" name="pathwayComments" 
                    placeholder="Short notes...">
            </div>
        </div>
    `;
    pathwayForm.insertAdjacentHTML('afterbegin', mainFieldsHtml);
    
    // Add rank fields and usable months in three-column layout
    const rankGroup = pathwayForm.querySelector('.rank-form-row');
    if (!rankGroup) {
        const commentsGroupElement = pathwayForm.querySelector('.comments-group');
        const rankHtml = `
            <div class="rank-form-row">
                <div class="form-group">
                    <label for="start-rank">Start Rank</label>
                    <input type="text" id="start-rank" name="startRank" 
                        placeholder="e.g., NBFO">
                </div>
                <div class="form-group">
                    <label for="end-rank">End Rank</label>
                    <input type="text" id="end-rank" name="endRank" 
                        placeholder="e.g., NBCP">
                </div>
                <div class="form-group">
                    <label for="usable-months">Usable After (months)</label>
                    <input type="number" id="usable-months" name="usableMonths" min="0" value="0"
                        placeholder="Months after start">
                </div>
            </div>
        `;
        commentsGroupElement.insertAdjacentHTML('afterend', rankHtml);
    }
    
    // Clear all fields
    const commentsField = document.getElementById('pathway-comments');
    if (commentsField) {
        commentsField.value = '';
    }
    document.getElementById('start-rank').value = '';
    document.getElementById('end-rank').value = '';
    document.getElementById('usable-months').value = '0';
    
    // Clear any editing ID from previous edits
    delete pathwayForm.dataset.editingPathwayId;
    
    document.getElementById('pathway-phases-container').innerHTML = '';
    addPhaseInput(); // Add one initial phase
    pathwayModal.classList.add('active');
}

function openPriorityModal() {
    const container = document.getElementById('priority-edit-container');
    
    // Add description before the form
    let html = '<p style="margin-bottom: 15px;">Edit the priority order and trainer assignments for each training type:</p>';
    html += '<div class="priority-edit-form">';
    
    priorityConfig.forEach((config, index) => {
        html += `
            <div class="priority-edit-group" style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                <h4>Priority ${index + 1} (${config.priority})</h4>
                <div class="form-group">
                    <label>Training Type:</label>
                    <select name="training-type-${index}" required>
                        <option value="LT-CAD" ${config.trainingType === 'LT-CAD' ? 'selected' : ''}>LT-CAD</option>
                        <option value="LT-CP" ${config.trainingType === 'LT-CP' ? 'selected' : ''}>LT-CP</option>
                        <option value="LT-FO" ${config.trainingType === 'LT-FO' ? 'selected' : ''}>LT-FO</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Primary Trainers:</label>
                    <div class="checkbox-group">
        `;
        
        TRAINER_CATEGORIES.forEach(cat => {
            const isChecked = config.primaryTrainers.includes(cat);
            const canDoTraining = TRAINER_QUALIFICATIONS[cat].includes(config.trainingType);
            html += `
                <label style="display: block; margin: 5px 0;">
                    <input type="checkbox" name="primary-${index}-${cat}" value="${cat}" 
                        ${isChecked ? 'checked' : ''} 
                        ${!canDoTraining ? 'disabled' : ''}>
                    ${cat} ${!canDoTraining ? '(Cannot perform this training)' : ''}
                </label>
            `;
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    priorityModal.classList.add('active');
    
    // Add event listener for the form if not already added
    const form = document.getElementById('priority-edit-form');
    if (!form.dataset.listenerAdded) {
        form.addEventListener('submit', handlePriorityUpdate);
        form.dataset.listenerAdded = 'true';
    }
}

function closeModals() {
    // Close all modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Handle FTE Update
function handleFTEUpdate(e) {
    e.preventDefault();
    
    // Update the FTE values - values are entered as fortnightly
    // Only update years that have inputs in the current view
    const currentYear = new Date().getFullYear();
    const startYear = Math.max(START_YEAR, currentYear - 1 + fteYearOffset);
    const endYear = Math.min(END_YEAR, currentYear + 1 + fteYearOffset);
    
    for (let year = startYear; year <= endYear; year++) {
        TRAINER_CATEGORIES.forEach(category => {
            const inputElement = document.getElementById(`fte-${year}-${category}`);
            if (inputElement) {
                const fortnightlyValue = parseFloat(inputElement.value) || 0;
                // Store as yearly total (fortnightly * 24)
                // Update location-specific FTE
                if (locationData && currentLocation && locationData[currentLocation]) {
                    locationData[currentLocation].trainerFTE[year][category] = fortnightlyValue * FORTNIGHTS_PER_YEAR;
                } else {
                    trainerFTE[year][category] = fortnightlyValue * FORTNIGHTS_PER_YEAR;
                }
            }
        });
    }

    // Ensure global trainerFTE is also updated
    trainerFTE = locationData[currentLocation].trainerFTE;
    
    // Close modal and refresh all tables
    closeModals();
    updateAllTables();
    
    // Ensure FTE summary is re-rendered with current state
    renderFTESummaryTable();
    
    // Update dashboard charts with new FTE values
    if (document.getElementById('dashboard-view').classList.contains('active')) {
        updateSupplyDemandChart();
        updateTrainerHeatmap();
    }
    
    // Save FTE as default whenever it's edited
    saveDefaultFTE();
    // console.log('Saved FTE as default after edit');
    
    markDirty();
}

// Handle Priority Update
function handlePriorityUpdate(e) {
    e.preventDefault();
    
    // Update priority configuration
    priorityConfig.forEach((config, index) => {
        // Update training type
        const trainingTypeSelect = document.querySelector(`select[name="training-type-${index}"]`);
        config.trainingType = trainingTypeSelect.value;
        
        // Update primary trainers
        config.primaryTrainers = [];
        TRAINER_CATEGORIES.forEach(cat => {
            const checkbox = document.querySelector(`input[name="primary-${index}-${cat}"]`);
            if (checkbox && checkbox.checked && !checkbox.disabled) {
                config.primaryTrainers.push(cat);
            }
        });
        
        // Recalculate cascading based on new configuration
        config.cascadingFrom = [];
        // For each priority level, add trainers from higher priorities
        for (let j = 0; j < index; j++) {
            priorityConfig[j].primaryTrainers.forEach(trainer => {
                if (!config.primaryTrainers.includes(trainer) && 
                    TRAINER_QUALIFICATIONS[trainer].includes(config.trainingType)) {
                    config.cascadingFrom.push(trainer);
                }
            });
        }
    });
    
    // Close modal and refresh
    closeModals();
    renderPrioritySettingsTable();
    updateAllTables();
}

// Handle Pathway Save
function handlePathwaySave(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pathwayName = formData.get('pathwayName');
    const pathwayType = formData.get('pathwayType') || 'FO';
    const pathwayComments = formData.get('pathwayComments') || '';
    const startRank = formData.get('startRank') || '';
    const endRank = formData.get('endRank') || '';
    const usableMonths = parseInt(formData.get('usableMonths') || '0');
    const editingPathwayId = e.target.dataset.editingPathwayId;

    const phases = [];
    const phaseRows = document.querySelectorAll('#pathway-phases-container tbody tr');
    
    phaseRows.forEach((row, index) => {
        const phaseNameSelect = row.querySelector(`select[name="phase-name-${index}"]`);
        const phaseName = phaseNameSelect ? phaseNameSelect.value : '';
        const durationInput = row.querySelector(`input[name="phase-duration-${index}"]`);
        const ratioInput = row.querySelector(`input[name="phase-ratio-${index}"]`);
        
        const duration = durationInput ? parseInt(durationInput.value) : 0;
        const ratio = ratioInput ? parseInt(ratioInput.value) : 0;

        if (phaseName && duration && ratio) {
            // Determine trainerDemandType based on phase name
            let trainerDemandType = null;
            if (phaseName === 'LT-CAD') trainerDemandType = 'LT-CAD';
            else if (phaseName === 'LT-CP') trainerDemandType = 'LT-CP';
            else if (phaseName === 'LT-FO') trainerDemandType = 'LT-FO';
            
            phases.push({ 
                name: phaseName, 
                duration, 
                ratio,
                trainerDemandType
            });
        }
    });

    if (phases.length > 0) {
        if (editingPathwayId) {
            // Edit existing pathway
            const pathwayIndex = pathways.findIndex(p => p.id === editingPathwayId);
            if (pathwayIndex !== -1) {
                pathways[pathwayIndex] = {
                    ...pathways[pathwayIndex],
                    name: pathwayName,
                    type: pathwayType,
                    comments: pathwayComments,
                    startRank: startRank,
                    endRank: endRank,
                    usableMonths: usableMonths,
                    phases: phases
                };
            }
            // Clear the editing ID
            delete e.target.dataset.editingPathwayId;
        } else {
            // Add new pathway - generate a new ID
            const newId = "A" + (Math.max(...pathways.map(p => parseInt(p.id.slice(1)))) + 1);
            const newPathway = {
                id: newId,
                name: pathwayName,
                type: pathwayType,
                comments: pathwayComments,
                startRank: startRank,
                endRank: endRank,
                usableMonths: usableMonths,
                phases: phases
            };
            pathways.push(newPathway);
        }

        // Update location-specific pathways
        locationData[currentLocation].pathways = pathways;
        
        // Save pathways to localStorage
        saveDefaultPathways();
        
        populatePathwaySelect();
        closeModals();
        renderPathwaysTable();
        markDirty();
    }
}

// Add Phase Input
function addPhaseInput() {
    const container = document.getElementById('pathway-phases-container');
    const tbody = container.querySelector('tbody');
    if (!tbody) {
        // Initialize table if it doesn't exist
        container.innerHTML = `
            <table class="phases-table">
                <thead>
                    <tr>
                        <th class="phase-number">#</th>
                        <th class="phase-name-col">Phase Name</th>
                        <th class="duration-col">Duration (fortnights)</th>
                        <th class="ratio-col">Student:Trainer Ratio</th>
                        <th class="actions-col">Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    }
    
    const phaseCount = container.querySelectorAll('tbody tr').length;
    const phaseNumber = phaseCount + 1;
    
    const phaseHtml = `
        <tr class="phase-row">
            <td class="phase-number">${phaseNumber}</td>
            <td>
                <select name="phase-name-${phaseCount}" required>
                    <option value="">Select phase</option>
                    <option value="GS+SIM">GS+SIM</option>
                    <option value="LT-CAD">LT-CAD</option>
                    <option value="LT-CP">LT-CP</option>
                    <option value="LT-FO">LT-FO</option>
                </select>
            </td>
            <td>
                <input type="number" name="phase-duration-${phaseCount}" min="1" required>
            </td>
            <td>
                <input type="number" name="phase-ratio-${phaseCount}" min="1" required>
            </td>
            <td class="actions-col">
                <button type="button" class="remove-phase-btn" onclick="removePhase(this)">Remove</button>
            </td>
        </tr>
    `;

    const tableBody = container.querySelector('tbody');
    tableBody.insertAdjacentHTML('beforeend', phaseHtml);
}

// Remove Phase
function removePhase(button) {
    const row = button.closest('tr');
    row.remove();
    
    // Update phase numbers
    const container = document.getElementById('pathway-phases-container');
    const rows = container.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        const numberCell = row.querySelector('.phase-number');
        if (numberCell) {
            numberCell.textContent = index + 1;
        }
    });
}

// Edit Pathway
function editPathway(pathwayId) {
    const pathway = pathways.find(p => p.id === pathwayId);
    if (!pathway) return;
    
    // Update modal title
    document.getElementById('pathway-modal-title').textContent = 'Edit Pathway';
    
    // Fill in pathway name
    document.getElementById('pathway-name').value = pathway.name;
    
    // Restructure form for better layout
    const pathwayForm = document.getElementById('pathway-edit-form');
    
    // Clear and rebuild form structure
    const existingGroups = pathwayForm.querySelectorAll('.form-group, .pathway-form-row, .rank-form-row');
    existingGroups.forEach(group => group.remove());
    
    // Add pathway name, type, and comments in three-column layout
    const mainFieldsHtml = `
        <div class="pathway-form-row three-column">
            <div class="form-group">
                <label for="pathway-name">Pathway Name:</label>
                <input type="text" id="pathway-name" name="pathwayName" required value="${pathway.name}">
            </div>
            <div class="form-group pathway-type-group">
                <label for="pathway-type">Pathway Type:</label>
                <select id="pathway-type" name="pathwayType" required>
                    <option value="CP" ${pathway.type === 'CP' ? 'selected' : ''}>Captain (CP)</option>
                    <option value="FO" ${pathway.type === 'FO' ? 'selected' : ''}>First Officer (FO)</option>
                    <option value="CAD" ${pathway.type === 'CAD' ? 'selected' : ''}>Cadet (CAD)</option>
                </select>
            </div>
            <div class="form-group comments-group">
                <label for="pathway-comments">Comments:</label>
                <input type="text" id="pathway-comments" name="pathwayComments" 
                    placeholder="Short notes..." value="${pathway.comments || ''}">
            </div>
        </div>
    `;
    pathwayForm.insertAdjacentHTML('afterbegin', mainFieldsHtml);
    
    // Add rank fields and usable months in three-column layout
    const rankHtml = `
        <div class="rank-form-row">
            <div class="form-group">
                <label for="start-rank">Start Rank</label>
                <input type="text" id="start-rank" name="startRank" 
                    placeholder="e.g., NBFO" value="${pathway.startRank || ''}">
            </div>
            <div class="form-group">
                <label for="end-rank">End Rank</label>
                <input type="text" id="end-rank" name="endRank" 
                    placeholder="e.g., NBCP" value="${pathway.endRank || ''}">
            </div>
            <div class="form-group">
                <label for="usable-months">Usable After (months)</label>
                <input type="number" id="usable-months" name="usableMonths" min="0" 
                    value="${pathway.usableMonths || 0}" placeholder="Months after start">
            </div>
        </div>
    `;
    pathwayForm.querySelector('.pathway-form-row').insertAdjacentHTML('afterend', rankHtml);
    
    // Clear existing phases and initialize table
    const phasesContainer = document.getElementById('pathway-phases-container');
    phasesContainer.innerHTML = `
        <table class="phases-table">
            <thead>
                <tr>
                    <th class="phase-number">#</th>
                    <th class="phase-name-col">Phase Name</th>
                    <th class="duration-col">Duration (fortnights)</th>
                    <th class="ratio-col">Student:Trainer Ratio</th>
                    <th class="actions-col">Actions</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
    
    // Add existing phases
    const tbody = phasesContainer.querySelector('tbody');
    pathway.phases.forEach((phase, index) => {
        const phaseHtml = `
            <tr class="phase-row">
                <td class="phase-number">${index + 1}</td>
                <td>
                    <select name="phase-name-${index}" required>
                        <option value="">Select phase</option>
                        <option value="GS+SIM" ${phase.name === 'GS+SIM' ? 'selected' : ''}>GS+SIM</option>
                        <option value="LT-CAD" ${phase.name === 'LT-CAD' ? 'selected' : ''}>LT-CAD</option>
                        <option value="LT-CP" ${phase.name === 'LT-CP' ? 'selected' : ''}>LT-CP</option>
                        <option value="LT-FO" ${phase.name === 'LT-FO' ? 'selected' : ''}>LT-FO</option>
                    </select>
                </td>
                <td>
                    <input type="number" name="phase-duration-${index}" min="1" value="${phase.duration}" required>
                </td>
                <td>
                    <input type="number" name="phase-ratio-${index}" min="1" value="${phase.ratio}" required>
                </td>
                <td class="actions-col">
                    <button type="button" class="remove-phase-btn" onclick="removePhase(this)">Remove</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', phaseHtml);
    });
    
    // Store the pathway ID for saving
    pathwayForm.dataset.editingPathwayId = pathwayId;
    
    // Open modal
    pathwayModal.classList.add('active');
}

// Edit Cohort
function editCohort(cohortId) {
    const cohort = activeCohorts.find(c => c.id === cohortId);
    if (!cohort) return;
    
    // Populate the edit form dropdowns
    const editPathwaySelect = document.getElementById('edit-pathway');
    editPathwaySelect.innerHTML = '<option value="">Select a pathway</option>';
    
    // Group pathways by type
    const pathwaysByType = {};
    pathways.forEach(pathway => {
        const type = pathway.type || 'Other';
        if (!pathwaysByType[type]) {
            pathwaysByType[type] = [];
        }
        pathwaysByType[type].push(pathway);
    });
    
    // Add pathways by type with optgroups
    const typeOrder = ['CP', 'FO', 'CAD', 'Other'];
    typeOrder.forEach(type => {
        if (pathwaysByType[type] && pathwaysByType[type].length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = type;
            
            pathwaysByType[type].forEach(pathway => {
                const option = document.createElement('option');
                option.value = pathway.id;
                option.textContent = pathway.name;
                option.selected = pathway.id === cohort.pathwayId;
                optgroup.appendChild(option);
            });
            
            editPathwaySelect.appendChild(optgroup);
        }
    });
    
    const editYearSelect = document.getElementById('edit-start-year');
    editYearSelect.innerHTML = '<option value="">Select year</option>';
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        option.selected = year === cohort.startYear;
        editYearSelect.appendChild(option);
    }
    
    const editFortnightSelect = document.getElementById('edit-start-fortnight');
    editFortnightSelect.innerHTML = '<option value="">Select fortnight</option>';
    for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
        const option = document.createElement('option');
        option.value = fn;
        const monthIndex = FORTNIGHT_TO_MONTH[fn];
        const monthName = MONTHS[monthIndex];
        const isFirstHalf = fn % 2 === 1;
        option.textContent = `FN${String(fn).padStart(2, '0')} - ${monthName} ${isFirstHalf ? '(1st half)' : '(2nd half)'}`;
        option.selected = fn === cohort.startFortnight;
        editFortnightSelect.appendChild(option);
    }
    
    // Set the values
    document.getElementById('edit-num-trainees').value = cohort.numTrainees;
    
    // Set location
    const editLocationSelect = document.getElementById('edit-location');
    if (editLocationSelect) {
        editLocationSelect.value = cohort.location || currentLocation;
    }
    
    // Handle cross-location training
    const enableCrossLocationCheckbox = document.getElementById('enable-cross-location');
    const crossLocationConfig = document.getElementById('cross-location-config');
    
    // Check if cohort has cross-location training
    const hasCrossLocation = cohort.crossLocationTraining && 
        Object.keys(cohort.crossLocationTraining).length > 0;
    
    enableCrossLocationCheckbox.checked = hasCrossLocation;
    crossLocationConfig.style.display = hasCrossLocation ? 'block' : 'none';
    
    // Generate cross-location configuration UI
    if (hasCrossLocation || enableCrossLocationCheckbox.checked) {
        generateCrossLocationUI(cohort);
    }
    
    // Store the cohort ID for saving
    document.getElementById('cohort-edit-form').dataset.editingCohortId = cohortId;
    
    // Simple width calculation to prevent table scrolling
    const pathway = pathways.find(p => p.id === cohort.pathwayId);
    if (pathway) {
        const modal = document.querySelector('#cohort-modal .modal-content');
        if (modal) {
            // Count total LT fortnights
            let totalLTFortnights = 0;
            pathway.phases.forEach(phase => {
                if (phase.trainerDemandType) {
                    totalLTFortnights += phase.duration;
                }
            });
            
            if (totalLTFortnights > 0) {
                // Location column (80px) + fortnight columns (45px each) + padding
                const tableWidth = 80 + (totalLTFortnights * 45);
                // Add 10% for padding, borders, and breathing room
                const modalWidth = Math.ceil(tableWidth * 1.1) + 100; // +100 for modal padding
                modal.style.maxWidth = modalWidth + 'px';
            } else {
                modal.style.maxWidth = '';
            }
        }
    }
    
    // Open modal
    cohortModal.classList.add('active');
    
    // Initialize split functionality
    initSplitCohort();
}

// Generate cross-location training UI
function generateCrossLocationUI(cohort) {
    const pathway = pathways.find(p => p.id === cohort.pathwayId);
    if (!pathway) return;
    
    const container = document.getElementById('cross-location-config');
    const otherLocation = cohort.location === 'AU' ? 'NZ' : 'AU';
    let html = '';
    
    // Collect all LT phases with their details
    let ltPhases = [];
    let allLTFortnights = [];  // Track all individual fortnights
    let currentFortnight = cohort.startFortnight;
    let currentYear = cohort.startYear;
    
    pathway.phases.forEach((phase, phaseIndex) => {
        if (phase.trainerDemandType) {
            const phaseFortnights = [];
            
            // Collect all fortnights for this phase
            for (let i = 0; i < phase.duration; i++) {
                const globalFortnight = (currentYear - 2024) * FORTNIGHTS_PER_YEAR + currentFortnight;
                phaseFortnights.push({
                    fortnight: currentFortnight,
                    year: currentYear,
                    globalFortnight: globalFortnight,
                    phase: phase.name
                });
                allLTFortnights.push({
                    fortnight: currentFortnight,
                    year: currentYear,
                    globalFortnight: globalFortnight,
                    phase: phase.name
                });
                
                currentFortnight++;
                if (currentFortnight > FORTNIGHTS_PER_YEAR) {
                    currentFortnight = 1;
                    currentYear++;
                }
            }
            
            ltPhases.push({
                name: phase.name,
                fortnights: phaseFortnights
            });
        } else {
            // Skip non-LT phases
            currentFortnight += phase.duration;
            while (currentFortnight > FORTNIGHTS_PER_YEAR) {
                currentFortnight -= FORTNIGHTS_PER_YEAR;
                currentYear++;
            }
        }
    });
    
    if (ltPhases.length === 0) {
        container.innerHTML = '<p>No line training phases in this pathway</p>';
        return;
    }
    
    // Create unified table
    html += `<div class="cross-location-phase">`;
    html += `<h4>Line Training Configuration</h4>`;
    html += `<div class="cross-location-timeline">`;
    html += `<table class="cross-location-table">`;
    
    // Build headers
    html += `<thead>`;
    
    // Month row
    html += `<tr>`;
    html += `<th rowspan="2" class="sticky-col">Period</th>`;
    
    // Count fortnights per month for all LT fortnights
    let monthSpans = {};
    let monthOrder = [];
    allLTFortnights.forEach(fn => {
        const monthIndex = Math.floor((fn.fortnight - 1) / 2);
        const monthKey = `${MONTHS[monthIndex]}-${fn.year}`;
        if (!monthSpans[monthKey]) {
            monthSpans[monthKey] = 0;
            monthOrder.push(monthKey);
        }
        monthSpans[monthKey]++;
    });
    
    // Generate month headers
    monthOrder.forEach(monthKey => {
        html += `<th colspan="${monthSpans[monthKey]}" class="month-header">${monthKey}</th>`;
    });
    html += `</tr>`;
    
    // Fortnight row
    html += `<tr>`;
    allLTFortnights.forEach(fn => {
        html += `<th class="fortnight-header">FN${String(fn.fortnight).padStart(2, '0')}</th>`;
    });
    html += `</tr>`;
    
    // Phase row with merged cells
    html += `<tr>`;
    html += `<th class="fortnight-header" style="font-weight: 600;">Phase</th>`;
    
    // Track phase spans for merging
    let i = 0;
    let isFirst = true;
    while (i < allLTFortnights.length) {
        const currentPhase = allLTFortnights[i].phase;
        let span = 1;
        
        // Count how many consecutive fortnights have the same phase
        while (i + span < allLTFortnights.length && allLTFortnights[i + span].phase === currentPhase) {
            span++;
        }
        
        // Add the merged cell with inline styles - match fortnight header exactly
        const borderLeft = isFirst ? '1px' : '3px';
        const borderColor = isFirst ? '#dee2e6' : '#999';
        html += `<th colspan="${span}" class="fortnight-header phase-indicator" style="border-left-width: ${borderLeft}; border-left-color: ${borderColor};">${currentPhase}</th>`;
        
        // Move to the next different phase
        i += span;
        isFirst = false;
    }
    html += `</tr>`;
    
    html += `</thead>`;
    
    // Body with radio buttons
    html += `<tbody>`;
    
    // Home location row
    html += `<tr>`;
    html += `<td class="location-label">${cohort.location} (home)</td>`;
    
    allLTFortnights.forEach((fn, index) => {
        const usesCrossLocation = cohort.crossLocationTraining?.[otherLocation]?.phases?.[fn.phase]?.includes(fn.globalFortnight);
        
        html += `<td class="radio-cell">`;
        html += `<input type="radio" name="cross-loc-${index}" value="${cohort.location}" 
                ${!usesCrossLocation ? 'checked' : ''} data-phase="${fn.phase}" data-fortnight="${fn.globalFortnight}">`;
        html += `</td>`;
    });
    html += `</tr>`;
    
    // Other location row
    html += `<tr>`;
    html += `<td class="location-label">${otherLocation}</td>`;
    
    allLTFortnights.forEach((fn, index) => {
        const usesCrossLocation = cohort.crossLocationTraining?.[otherLocation]?.phases?.[fn.phase]?.includes(fn.globalFortnight);
        
        html += `<td class="radio-cell">`;
        html += `<input type="radio" name="cross-loc-${index}" value="${otherLocation}" 
                ${usesCrossLocation ? 'checked' : ''} data-phase="${fn.phase}" data-fortnight="${fn.globalFortnight}">`;
        html += `</td>`;
    });
    html += `</tr>`;
    
    html += `</tbody>`;
    html += `</table>`;
    html += `</div>`;
    html += `</div>`;
    
    // Add summary
    html += `<div class="cross-location-summary" id="cross-location-summary">`;
    html += updateCrossLocationSummary(cohort);
    html += `</div>`;
    
    container.innerHTML = html;
}

// Update cross-location summary
function updateCrossLocationSummary(cohort) {
    const crossLoc = cohort.crossLocationTraining;
    if (!crossLoc || Object.keys(crossLoc).length === 0) {
        return 'No cross-location training configured';
    }
    
    let summary = [];
    Object.entries(crossLoc).forEach(([location, data]) => {
        if (data.phases) {
            Object.entries(data.phases).forEach(([phase, fortnights]) => {
                if (fortnights.length > 0) {
                    summary.push(`Using ${location} trainers for ${fortnights.length} fortnights in ${phase}`);
                }
            });
        }
    });
    
    return summary.length > 0 ? summary.join('<br>') : 'No cross-location training configured';
}

// Handle Cohort Update
function handleCohortUpdate(e) {
    e.preventDefault();
    
    const cohortId = parseInt(e.target.dataset.editingCohortId);
    const cohortIndex = activeCohorts.findIndex(c => c.id === cohortId);
    
    if (cohortIndex !== -1) {
        const formData = new FormData(e.target);
        
        // Process cross-location training data
        let crossLocationTraining = {};
        // console.log('enableCrossLocation checkbox value:', formData.get('enableCrossLocation'));
        if (formData.get('enableCrossLocation')) {
            // console.log('Cross-location enabled, processing radio buttons...');
            const radioButtons = document.querySelectorAll('#cross-location-config input[type="radio"]:checked');
            // console.log(`Found ${radioButtons.length} checked radio buttons`);
            
            radioButtons.forEach(radio => {
                const location = radio.value;
                const phase = radio.dataset.phase;
                const fortnight = parseInt(radio.dataset.fortnight);
                const cohortLocation = formData.get('location');
                
                // console.log(`Radio: location=${location}, phase=${phase}, fortnight=${fortnight}, cohortLocation=${cohortLocation}`);
                
                // Only save if using different location than cohort's home
                if (location !== cohortLocation) {
                    // console.log(`Adding cross-location: ${phase} fortnight ${fortnight} uses ${location} trainers`);
                    if (!crossLocationTraining[location]) {
                        crossLocationTraining[location] = { phases: {} };
                    }
                    if (!crossLocationTraining[location].phases[phase]) {
                        crossLocationTraining[location].phases[phase] = [];
                    }
                    crossLocationTraining[location].phases[phase].push(fortnight);
                }
            });
            
            // console.log('Final crossLocationTraining:', JSON.stringify(crossLocationTraining, null, 2));
        } else {
            // console.log('Cross-location NOT enabled');
        }
        
        activeCohorts[cohortIndex] = {
            ...activeCohorts[cohortIndex],
            numTrainees: parseInt(formData.get('numTrainees')),
            pathwayId: formData.get('pathway'), // Keep as string since pathways now use string IDs
            startYear: parseInt(formData.get('startYear')),
            startFortnight: parseInt(formData.get('startFortnight')),
            location: formData.get('location') || currentLocation,
            crossLocationTraining: crossLocationTraining
        };
        
        // console.log('Updated cohort:', activeCohorts[cohortIndex]);
        // console.log('Cohort cross-location config:', JSON.stringify(activeCohorts[cohortIndex].crossLocationTraining, null, 2));
        
        // Debug: Check what's actually stored
        if (activeCohorts[cohortIndex].crossLocationTraining && Object.keys(activeCohorts[cohortIndex].crossLocationTraining).length > 0) {
            // console.log('Cross-location details:');
            Object.entries(activeCohorts[cohortIndex].crossLocationTraining).forEach(([loc, data]) => {
                // console.log(`  Location ${loc}:`, data);
                if (data.phases) {
                    Object.entries(data.phases).forEach(([phase, fortnights]) => {
                        // console.log(`    Phase ${phase}: fortnights`, fortnights);
                    });
                }
            });
        }
        
        // Clear the editing ID
        delete e.target.dataset.editingCohortId;
        
        // Close modal and refresh
        closeModals();
        updateAllTables();
        renderGanttChart();
        markDirty();
    }
}

// Remove Cohort
function removeCohort(cohortId) {
    const cohort = activeCohorts.find(c => c.id === cohortId);
    if (!cohort) return;
    
    const pathway = pathways.find(p => p.id === cohort.pathwayId);
    const cohortLabel = pathway ? `${cohort.numTrainees} x ${pathway.name}` : 'this cohort';
    
    showConfirmDialog(
        'Remove Cohort',
        `Are you sure you want to remove ${cohortLabel}?`,
        () => {
            activeCohorts = activeCohorts.filter(c => c.id !== cohortId);
            updateAllTables();
            renderGanttChart();
            setupSynchronizedScrolling();
            markDirty();
            showNotification(`Cohort removed: ${cohortLabel}`, 'success');
        }
    );
}

// Show merge cohorts dialog
function showMergeCohortsDialog() {
    // Group cohorts by identical settings
    const mergeable = {};
    
    // Get current location's cohorts
    const currentCohorts = locationData[currentLocation].activeCohorts;
    
    currentCohorts.forEach(cohort => {
        // Create a key from cohort properties that must match for merging
        const key = `${cohort.pathwayId}_${cohort.startYear}_${cohort.startFortnight}_${cohort.location}_${JSON.stringify(cohort.crossLocationTraining || {})}`;
        
        if (!mergeable[key]) {
            mergeable[key] = [];
        }
        mergeable[key].push(cohort);
    });
    
    // Filter to only show groups with 2+ cohorts
    const mergeableGroups = Object.values(mergeable).filter(group => group.length > 1);
    
    if (mergeableGroups.length === 0) {
        showNotification('No mergeable cohorts found. Cohorts must have identical pathway, start date, location, and cross-location settings.', 'info');
        return;
    }
    
    // Create and show dialog
    let html = `
        <div class="modal active" id="merge-dialog">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Merge Cohorts</h2>
                    <button class="modal-close" onclick="document.getElementById('merge-dialog').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <p style="margin: 0 0 10px 0; font-size: 0.95em;">Select cohort groups to merge. Only cohorts with identical settings can be merged.</p>
                    <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 15px;">
                        <button class="btn btn-secondary" onclick="selectAllMergeGroups()" style="padding: 5px 12px; font-size: 0.9em; white-space: nowrap;">✓ All</button>
                        <button class="btn btn-secondary" onclick="deselectAllMergeGroups()" style="padding: 5px 12px; font-size: 0.9em; white-space: nowrap;">✗ None</button>
                        <div style="flex: 1;"></div>
                        <span id="merge-selection-count" style="font-weight: bold; color: var(--text-secondary); white-space: nowrap;">0 selected</span>
                    </div>
                    
                    <div id="merge-summary" style="background: var(--bg-secondary); padding: 10px; border-radius: 4px; margin-bottom: 15px; display: none;">
                        <strong>Summary:</strong> <span id="merge-summary-text"></span>
                    </div>
                    
                    <div style="max-height: 400px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 4px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead style="position: sticky; top: 0; background: var(--bg-secondary); z-index: 10;">
                                <tr>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid var(--border-color); width: 40px;">
                                        <input type="checkbox" id="merge-select-all-checkbox" onchange="toggleAllMergeGroups(this)" style="cursor: pointer;">
                                    </th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid var(--border-color);">Pathway</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid var(--border-color);">Location</th>
                                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid var(--border-color);">Start</th>
                                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid var(--border-color);">Cohorts</th>
                                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid var(--border-color);">Total Trainees</th>
                                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid var(--border-color);">Details</th>
                                </tr>
                            </thead>
                            <tbody>
    `;
    
    mergeableGroups.forEach((group, index) => {
        const pathway = pathways.find(p => p.id === group[0].pathwayId);
        const totalTrainees = group.reduce((sum, c) => sum + c.numTrainees, 0);
        const avgSize = Math.round(totalTrainees / group.length);
        
        html += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 10px;">
                    <input type="checkbox" class="merge-group-checkbox" value="${index}" onchange="updateMergeSelection()" style="cursor: pointer;">
                </td>
                <td style="padding: 10px; font-weight: bold;">${pathway.name}</td>
                <td style="padding: 10px;">${group[0].location}</td>
                <td style="padding: 10px;">Y${group[0].startYear} F${group[0].startFortnight}</td>
                <td style="padding: 10px; text-align: center;">
                    <span style="background: var(--bg-tertiary); padding: 2px 8px; border-radius: 12px;">${group.length}</span>
                </td>
                <td style="padding: 10px; text-align: center;">
                    <strong>${totalTrainees}</strong>
                    <span style="font-size: 0.85em; color: var(--text-secondary);">(avg ${avgSize})</span>
                </td>
                <td style="padding: 10px; text-align: center;">
                    <button class="btn btn-secondary" onclick="toggleMergeDetails(${index})" style="padding: 2px 8px; font-size: 0.85em;">
                        <span id="merge-details-icon-${index}">▶</span> Details
                    </button>
                </td>
            </tr>
            <tr id="merge-details-${index}" style="display: none; background: var(--bg-secondary);">
                <td colspan="7" style="padding: 15px 10px 15px 50px;">
                    <div>
                        <strong style="display: block; margin-bottom: 10px;">Individual cohorts to be merged:</strong>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--border-color);">
                                    <th style="padding: 5px; text-align: left; font-size: 0.85em;">Cohort ID</th>
                                    <th style="padding: 5px; text-align: center; font-size: 0.85em;">Trainees</th>
                                    <th style="padding: 5px; text-align: left; font-size: 0.85em;">Comment</th>
                                    <th style="padding: 5px; text-align: left; font-size: 0.85em;">Cross-Location Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${group.map(c => {
                                    const crossLocDetails = c.crossLocationTraining && Object.keys(c.crossLocationTraining).length > 0 
                                        ? Object.entries(c.crossLocationTraining).map(([loc, data]) => {
                                            const phases = Object.entries(data.phases || {}).map(([phase, fortnights]) => 
                                                `${phase}: fortnights ${fortnights.join(', ')}`
                                            ).join('; ');
                                            return `${loc}: ${phases}`;
                                        }).join(' | ')
                                        : 'None';
                                    
                                    return `
                                        <tr style="border-bottom: 1px solid var(--border-color);">
                                            <td style="padding: 5px; font-size: 0.85em;">#${c.id}</td>
                                            <td style="padding: 5px; text-align: center; font-size: 0.85em; font-weight: bold;">${c.numTrainees}</td>
                                            <td style="padding: 5px; font-size: 0.85em; color: var(--text-secondary);">${c.comment || 'No comment'}</td>
                                            <td style="padding: 5px; font-size: 0.85em; color: var(--text-secondary);">${crossLocDetails}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                        <div style="margin-top: 10px; font-size: 0.9em; color: var(--text-primary);">
                            <strong>After merge:</strong> ${totalTrainees} trainees in a single cohort starting Year ${group[0].startYear}, Fortnight ${group[0].startFortnight}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += `
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer" style="margin-top: 20px;">
                        <button id="merge-selected-btn" class="btn btn-primary" onclick="performMerge()" disabled>Merge Selected</button>
                        <button class="btn btn-secondary" onclick="document.getElementById('merge-dialog').remove()">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Store mergeable groups for performMerge function
    window.mergeableGroups = mergeableGroups;
    
    // Initialize selection count
    updateMergeSelection();
}

// Helper functions for merge dialog
function toggleAllMergeGroups(checkbox) {
    const checkboxes = document.querySelectorAll('.merge-group-checkbox');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
    updateMergeSelection();
}

function selectAllMergeGroups() {
    const checkboxes = document.querySelectorAll('.merge-group-checkbox');
    checkboxes.forEach(cb => cb.checked = true);
    document.getElementById('merge-select-all-checkbox').checked = true;
    updateMergeSelection();
}

function deselectAllMergeGroups() {
    const checkboxes = document.querySelectorAll('.merge-group-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    document.getElementById('merge-select-all-checkbox').checked = false;
    updateMergeSelection();
}

function updateMergeSelection() {
    const checkboxes = document.querySelectorAll('.merge-group-checkbox:checked');
    const count = checkboxes.length;
    
    // Update count display
    document.getElementById('merge-selection-count').textContent = `${count} selected`;
    
    // Enable/disable merge button
    const mergeBtn = document.getElementById('merge-selected-btn');
    mergeBtn.disabled = count === 0;
    
    // Update summary
    const summaryDiv = document.getElementById('merge-summary');
    const summaryText = document.getElementById('merge-summary-text');
    
    if (count > 0) {
        let totalGroups = count;
        let totalCohorts = 0;
        let totalTrainees = 0;
        
        checkboxes.forEach(checkbox => {
            const groupIndex = parseInt(checkbox.value);
            const group = window.mergeableGroups[groupIndex];
            totalCohorts += group.length;
            totalTrainees += group.reduce((sum, c) => sum + c.numTrainees, 0);
        });
        
        const cohortsToRemove = totalCohorts - totalGroups;
        summaryText.textContent = `Will merge ${totalCohorts} cohorts into ${totalGroups} cohorts (removing ${cohortsToRemove} cohorts, keeping ${totalTrainees} total trainees)`;
        summaryDiv.style.display = 'block';
    } else {
        summaryDiv.style.display = 'none';
    }
    
    // Update select all checkbox state
    const allCheckboxes = document.querySelectorAll('.merge-group-checkbox');
    const selectAllCheckbox = document.getElementById('merge-select-all-checkbox');
    if (count === allCheckboxes.length && count > 0) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else if (count > 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
}

function toggleMergeDetails(index) {
    const detailsRow = document.getElementById(`merge-details-${index}`);
    const icon = document.getElementById(`merge-details-icon-${index}`);
    
    if (detailsRow.style.display === 'none') {
        detailsRow.style.display = 'table-row';
        icon.textContent = '▼';
    } else {
        detailsRow.style.display = 'none';
        icon.textContent = '▶';
    }
}

// Perform the merge operation
function performMerge() {
    const checkboxes = document.querySelectorAll('.merge-group-checkbox:checked');
    if (checkboxes.length === 0) {
        showNotification('Please select at least one group to merge', 'warning');
        return;
    }
    
    let mergedCount = 0;
    let totalMerged = 0;
    
    checkboxes.forEach(checkbox => {
        const groupIndex = parseInt(checkbox.value);
        const group = window.mergeableGroups[groupIndex];
        
        if (group && group.length > 1) {
            // Keep the first cohort and add all trainees to it
            const keepCohort = group[0];
            const totalTrainees = group.reduce((sum, c) => sum + c.numTrainees, 0);
            
            // Update the kept cohort
            keepCohort.numTrainees = totalTrainees;
            
            // Remove the other cohorts
            const removeIds = group.slice(1).map(c => c.id);
            locationData[currentLocation].activeCohorts = locationData[currentLocation].activeCohorts.filter(c => !removeIds.includes(c.id));
            
            // Update global activeCohorts if needed
            activeCohorts = locationData[currentLocation].activeCohorts;
            
            mergedCount++;
            totalMerged += group.length - 1;
        }
    });
    
    // Close dialog
    document.getElementById('merge-dialog').remove();
    
    // Recalculate demand after merge
    calculateDemand();
    
    // Update UI
    updateAllTables();
    renderGanttChart();
    setupSynchronizedScrolling();
    markDirty();
    
    showNotification(`Merged ${mergedCount} group(s), removing ${totalMerged} cohort(s)`, 'success');
}

// Split cohort functionality
function initSplitCohort() {
    const splitIntoInput = document.getElementById('split-into');
    const splitSizeInput = document.getElementById('split-size');
    const splitPreview = document.getElementById('split-preview');
    const splitBtn = document.getElementById('split-cohort-btn');
    const numTraineesInput = document.getElementById('edit-num-trainees');
    
    function updateSplitPreview() {
        const totalTrainees = parseInt(numTraineesInput.value) || 0;
        const splitCount = parseInt(splitIntoInput.value) || 2;
        
        if (totalTrainees > 0) {
            const baseSize = Math.floor(totalTrainees / splitCount);
            const remainder = totalTrainees % splitCount;
            
            splitSizeInput.value = baseSize;
            
            if (remainder > 0) {
                splitPreview.textContent = `Will create ${splitCount - remainder} cohorts with ${baseSize} trainees and ${remainder} cohorts with ${baseSize + 1} trainees`;
            } else {
                splitPreview.textContent = `Will create ${splitCount} cohorts with ${baseSize} trainees each`;
            }
        } else {
            splitSizeInput.value = '';
            splitPreview.textContent = '';
        }
    }
    
    // Update preview when inputs change
    splitIntoInput.addEventListener('input', updateSplitPreview);
    numTraineesInput.addEventListener('input', updateSplitPreview);
    
    // Handle split button click
    splitBtn.addEventListener('click', () => {
        const cohortId = parseInt(document.getElementById('cohort-edit-form').dataset.editingCohortId);
        const cohort = locationData[currentLocation].activeCohorts.find(c => c.id === cohortId);
        if (!cohort) return;
        
        const totalTrainees = parseInt(numTraineesInput.value) || cohort.numTrainees;
        const splitCount = parseInt(splitIntoInput.value) || 2;
        
        if (splitCount < 2 || splitCount > totalTrainees) {
            showNotification('Invalid split count', 'error');
            return;
        }
        
        const baseSize = Math.floor(totalTrainees / splitCount);
        const remainder = totalTrainees % splitCount;
        
        // Create new cohorts
        const newCohorts = [];
        for (let i = 0; i < splitCount; i++) {
            const size = i < remainder ? baseSize + 1 : baseSize;
            newCohorts.push({
                ...cohort,
                id: Date.now() + i, // Generate unique IDs
                numTrainees: size
            });
        }
        
        // Replace original cohort with new ones
        const cohortIndex = locationData[currentLocation].activeCohorts.findIndex(c => c.id === cohortId);
        locationData[currentLocation].activeCohorts.splice(cohortIndex, 1, ...newCohorts);
        
        // Update global activeCohorts if needed
        activeCohorts = locationData[currentLocation].activeCohorts;
        
        // Close modal
        document.getElementById('cohort-edit-modal').classList.remove('active');
        
        // Update UI
        updateAllTables();
        renderGanttChart();
        setupSynchronizedScrolling();
        markDirty();
        
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        showNotification(`Split ${totalTrainees} x ${pathway.name} into ${splitCount} cohorts`, 'success');
    });
    
    // Initialize preview
    updateSplitPreview();
}

// Handle group by change
function handleGroupByChange(e) {
    viewState.groupBy = e.target.value;
    viewState.collapsedGroups = []; // Reset collapsed groups when changing grouping
    renderGanttChart();
}

// Toggle group collapse/expand
function toggleGroup(groupName) {
    const index = viewState.collapsedGroups.indexOf(groupName);
    if (index > -1) {
        viewState.collapsedGroups.splice(index, 1);
    } else {
        viewState.collapsedGroups.push(groupName);
    }
    renderGanttChart();
}

// Toggle Commencement Cross-Location View
function toggleCommencementCrossLocation() {
    viewState.showCrossLocationCommencements = !viewState.showCrossLocationCommencements;
    
    // Update button text and style
    const btn = document.querySelector('[onclick="toggleCommencementCrossLocation()"]');
    const text = document.getElementById('commencement-cross-loc-text');
    const icon = document.getElementById('commencement-cross-loc-icon');
    
    if (viewState.showCrossLocationCommencements) {
        text.textContent = 'Cross-Location ON';
        icon.textContent = '✓';
        btn.style.background = '#2ecc71';
        btn.style.color = 'white';
    } else {
        text.textContent = 'Cross-Location OFF';
        icon.textContent = '🌐';
        btn.style.background = '';
        btn.style.color = '';
    }
    
    // Re-render the commencement summary
    renderCommencementSummary();
}

// Toggle Demand Split View
function toggleDemandSplitView() {
    viewState.demandSplitByLocation = !viewState.demandSplitByLocation;
    
    // Update button text
    const btnText = document.getElementById('split-view-text');
    const btnIcon = document.getElementById('split-view-icon');
    if (viewState.demandSplitByLocation) {
        btnText.textContent = 'Merged View';
        btnIcon.textContent = '🔀';
    } else {
        btnText.textContent = 'Split by Location';
        btnIcon.textContent = '📊';
    }
    
    renderDemandTable();
    setupSynchronizedScrolling();
    
    // Adjust modal height dynamically if in planner view
    if (document.getElementById('planner-view').style.display !== 'none') {
        adjustPlannerModalHeight();
    }
}

// Adjust planner view height based on content
function adjustPlannerModalHeight() {
    // Check if we're in the planner view
    const plannerView = document.getElementById('planner-view');
    if (!plannerView || !plannerView.classList.contains('active')) return;
    
    // Specifically target the demand table container
    const demandContainer = document.getElementById('demand-table-container');
    
    if (demandContainer && viewState.demandSplitByLocation) {
        // In split view, remove height restrictions to show all rows
        demandContainer.style.maxHeight = 'none';
        demandContainer.style.overflowY = 'visible';
        
        // Keep horizontal scroll for wide tables
        demandContainer.style.overflowX = 'auto';
    } else if (demandContainer) {
        // In merged view, restore normal height with scroll
        demandContainer.style.maxHeight = '400px';
        demandContainer.style.overflowY = 'auto';
        demandContainer.style.overflowX = 'auto';
    }
    
    // Ensure synchronized scrolling still works
    setTimeout(() => {
        setupSynchronizedScrolling();
    }, 50);
}

// Training Planner Functions
function switchPlannerTab(tabName) {
    document.querySelectorAll('.planner-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    document.querySelectorAll('.planner-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    // Reset modal width when switching away from grid tab
    const modal = document.querySelector('#training-planner-modal .modal-content');
    if (modal && tabName !== 'grid') {
        modal.style.maxWidth = '800px';
    }
}

// Parse bulk input text
function parseBulkInput(inputText) {
    const lines = inputText.trim().split('\n');
    const cohorts = [];
    const errors = [];
    
    const monthMap = {
        'jan': 0, 'january': 0, 'feb': 1, 'february': 1, 'mar': 2, 'march': 2,
        'apr': 3, 'april': 3, 'may': 4, 'jun': 5, 'june': 5,
        'jul': 6, 'july': 6, 'aug': 7, 'august': 7, 'sep': 8, 'september': 8,
        'oct': 9, 'october': 9, 'nov': 10, 'november': 10, 'dec': 11, 'december': 11
    };
    
    lines.forEach((line, index) => {
        if (!line.trim()) return;
        
        const lineNum = index + 1;
        const trimmedLine = line.trim();
        
        // Try multiple format patterns
        let parsed = false;
        
        // Format 1: "Month Year: X FO, Y CP, Z CAD" (original format)
        let match = trimmedLine.match(/^(\w+)\s+(\d{2,4}):\s*(.+)$/i);
        if (match) {
            const monthStr = match[1].toLowerCase();
            let year = parseInt(match[2]);
            
            // Handle 2-digit years
            if (year < 100) {
                year = year >= 50 ? 1900 + year : 2000 + year;
            }
            
            const traineesStr = match[3];
            
            if (!monthMap.hasOwnProperty(monthStr)) {
                errors.push(`Line ${lineNum}: Invalid month "${match[1]}". Use Jan, Feb, Mar, etc.`);
                return;
            }
            
            const month = monthMap[monthStr];
            const startFortnight = (month * 2) + 1;
            
            // Parse trainees with flexible format
            const traineeParts = traineesStr.split(/[,;]/);
            traineeParts.forEach(part => {
                parseSingleCohort(part.trim(), year, startFortnight, lineNum, cohorts, errors);
            });
            parsed = true;
        }
        
        // Format 2: "Month Year Number Type [PathwayID]" (e.g., "Jan 25 4 CAD A209")
        if (!parsed) {
            match = trimmedLine.match(/^(\w+)\s+(\d{2,4})\s+(\d+)\s+(\w+)(?:\s+(\w+))?$/i);
            if (match) {
                const monthStr = match[1].toLowerCase();
                let year = parseInt(match[2]);
                const count = parseInt(match[3]);
                const typeOrPathway = match[4].toUpperCase();
                const pathwayId = match[5] ? match[5].toUpperCase() : null;
                
                // Handle 2-digit years
                if (year < 100) {
                    year = year >= 50 ? 1900 + year : 2000 + year;
                }
                
                if (!monthMap.hasOwnProperty(monthStr)) {
                    errors.push(`Line ${lineNum}: Invalid month "${match[1]}". Use Jan, Feb, Mar, etc.`);
                    return;
                }
                
                const month = monthMap[monthStr];
                const startFortnight = (month * 2) + 1;
                
                // Find pathway by ID or type
                let pathway;
                if (pathwayId) {
                    pathway = pathways.find(p => p.id === pathwayId);
                    if (!pathway) {
                        errors.push(`Line ${lineNum}: No pathway found with ID "${pathwayId}". Available: ${pathways.map(p => p.id).join(', ')}`);
                        return;
                    }
                } else {
                    pathway = pathways.find(p => p.type === typeOrPathway);
                    if (!pathway) {
                        errors.push(`Line ${lineNum}: No pathway found for type "${typeOrPathway}". Use CP, FO, or CAD.`);
                        return;
                    }
                }
                
                cohorts.push({
                    year: year,
                    fortnight: startFortnight,
                    numTrainees: count,
                    pathwayId: pathway.id,
                    type: pathway.type
                });
                parsed = true;
            }
        }
        
        // Format 3: "Number Type Month Year" (e.g., "4 CAD Jan 25")
        if (!parsed) {
            match = trimmedLine.match(/^(\d+)\s+(\w+)\s+(\w+)\s+(\d{2,4})(?:\s+(\w+))?$/i);
            if (match) {
                const count = parseInt(match[1]);
                const typeOrPathway = match[2].toUpperCase();
                const monthStr = match[3].toLowerCase();
                let year = parseInt(match[4]);
                const pathwayId = match[5] ? match[5].toUpperCase() : null;
                
                // Handle 2-digit years
                if (year < 100) {
                    year = year >= 50 ? 1900 + year : 2000 + year;
                }
                
                if (!monthMap.hasOwnProperty(monthStr)) {
                    errors.push(`Line ${lineNum}: Invalid month "${match[3]}". Use Jan, Feb, Mar, etc.`);
                    return;
                }
                
                const month = monthMap[monthStr];
                const startFortnight = (month * 2) + 1;
                
                // Find pathway by ID or type
                let pathway;
                if (pathwayId) {
                    pathway = pathways.find(p => p.id === pathwayId);
                    if (!pathway) {
                        errors.push(`Line ${lineNum}: No pathway found with ID "${pathwayId}". Available: ${pathways.map(p => p.id).join(', ')}`);
                        return;
                    }
                } else {
                    pathway = pathways.find(p => p.type === typeOrPathway);
                    if (!pathway) {
                        errors.push(`Line ${lineNum}: No pathway found for type "${typeOrPathway}". Use CP, FO, or CAD.`);
                        return;
                    }
                }
                
                cohorts.push({
                    year: year,
                    fortnight: startFortnight,
                    numTrainees: count,
                    pathwayId: pathway.id,
                    type: pathway.type
                });
                parsed = true;
            }
        }
        
        if (!parsed) {
            errors.push(`Line ${lineNum}: Invalid format "${trimmedLine}". Try: "Jan 2025: 4 CAD" or "Jan 25 4 CAD A209" or "4 CAD Jan 2025"`);
        }
    });
    
    return { cohorts, errors };
}

// Helper function to parse single cohort entry
function parseSingleCohort(text, year, startFortnight, lineNum, cohorts, errors) {
    // Format: "X Type [PathwayID]" (e.g., "4 CAD", "2 FO A210")
    const match = text.match(/^(\d+)\s+(\w+)(?:\s+(\w+))?$/i);
    if (!match) {
        errors.push(`Line ${lineNum}: Invalid trainee format "${text}". Expected format: "4 CAD" or "2 FO A210"`);
        return;
    }
    
    const count = parseInt(match[1]);
    const typeOrPathway = match[2].toUpperCase();
    const pathwayId = match[3] ? match[3].toUpperCase() : null;
    
    // Find pathway by ID or type
    let pathway;
    if (pathwayId) {
        pathway = pathways.find(p => p.id === pathwayId);
        if (!pathway) {
            errors.push(`Line ${lineNum}: No pathway found with ID "${pathwayId}". Available: ${pathways.map(p => p.id).join(', ')}`);
            return;
        }
    } else {
        pathway = pathways.find(p => p.type === typeOrPathway);
        if (!pathway) {
            errors.push(`Line ${lineNum}: No pathway found for type "${typeOrPathway}". Use CP, FO, or CAD.`);
            return;
        }
    }
    
    cohorts.push({
        year: year,
        fortnight: startFortnight,
        numTrainees: count,
        pathwayId: pathway.id,
        type: pathway.type
    });
}

// Validate bulk input
function validateBulkInput() {
    const inputText = document.getElementById('bulk-input').value;
    const { cohorts, errors } = parseBulkInput(inputText);
    const validationDiv = document.getElementById('bulk-validation');
    const applyBtn = document.getElementById('apply-bulk');
    
    let html = '';
    
    // Show parsing summary
    if (!inputText.trim()) {
        html = '<div class="validation-info">Enter cohort schedules to validate</div>';
    } else {
        html += '<div class="validation-summary">';
        html += `<p>Parsed ${cohorts.length} cohorts from ${inputText.trim().split('\n').filter(l => l.trim()).length} lines</p>`;
        html += '</div>';
    }
    
    if (errors.length > 0) {
        html += '<div class="validation-errors">';
        html += '<h4>Parsing Errors:</h4>';
        errors.forEach(error => {
            html += `<div class="validation-error">❌ ${error}</div>`;
        });
        html += '</div>';
    }
    
    if (cohorts.length > 0) {
        // Check constraints
        const warnings = [];
        const groupedByTime = {};
        const totalTrainees = { cp: 0, fo: 0, cad: 0 };
        
        // Group cohorts by year-fortnight and count totals
        cohorts.forEach(cohort => {
            const key = `${cohort.year}-${cohort.fortnight}`;
            if (!groupedByTime[key]) {
                groupedByTime[key] = { fo: 0, cad: 0, cp: 0, month: '', year: cohort.year };
            }
            groupedByTime[key][cohort.type.toLowerCase()] += cohort.numTrainees;
            groupedByTime[key].month = MONTHS[Math.floor((cohort.fortnight - 1) / 2)];
            totalTrainees[cohort.type.toLowerCase()] += cohort.numTrainees;
        });
        
        // Check GS+SIM constraint (16 FO/CAD max)
        Object.entries(groupedByTime).forEach(([key, data]) => {
            const total = data.fo + data.cad;
            if (total > 16) {
                warnings.push(`${data.month} ${data.year}: ${total} FO/CAD exceeds GS+SIM limit of 16 (${data.fo} FO + ${data.cad} CAD)`);
            }
        });
        
        // Check trainer capacity
        Object.entries(groupedByTime).forEach(([key, data]) => {
            const cpDemand = data.cp * 3; // Rough estimate: CP needs more trainer hours
            const foDemand = data.fo * 2;
            const cadDemand = data.cad * 2;
            const totalDemand = cpDemand + foDemand + cadDemand;
            
            if (totalDemand > 100) { // Arbitrary threshold
                warnings.push(`${data.month} ${data.year}: High trainer demand (${totalDemand} trainer-hours)`);
            }
        });
        
        if (warnings.length > 0) {
            html += '<div class="validation-warnings">';
            html += '<h4>Warnings:</h4>';
            warnings.forEach(warning => {
                html += `<div class="validation-warning">⚠️ ${warning}</div>`;
            });
            html += '</div>';
        }
        
        // Show totals
        html += '<div class="validation-totals">';
        html += '<h4>Total Trainees by Type:</h4>';
        html += '<div class="totals-grid">';
        html += `<div class="total-item">CP: ${totalTrainees.cp}</div>`;
        html += `<div class="total-item">FO: ${totalTrainees.fo}</div>`;
        html += `<div class="total-item">CAD: ${totalTrainees.cad}</div>`;
        html += `<div class="total-item">Total: ${totalTrainees.cp + totalTrainees.fo + totalTrainees.cad}</div>`;
        html += '</div>';
        html += '</div>';
        
        // Show preview
        html += '<div class="validation-preview">';
        html += '<h4>Schedule Preview:</h4>';
        const sortedTimes = Object.entries(groupedByTime).sort((a, b) => {
            const [aKey] = a;
            const [bKey] = b;
            const [aYear, aFn] = aKey.split('-').map(Number);
            const [bYear, bFn] = bKey.split('-').map(Number);
            if (aYear !== bYear) return aYear - bYear;
            return aFn - bFn;
        });
        
        sortedTimes.forEach(([key, data]) => {
            const parts = [];
            if (data.cp > 0) parts.push(`${data.cp} CP`);
            if (data.fo > 0) parts.push(`${data.fo} FO`);
            if (data.cad > 0) parts.push(`${data.cad} CAD`);
            html += `<div class="schedule-item">
                <strong>${data.month} ${data.year}:</strong> ${parts.join(', ')}
            </div>`;
        });
        html += '</div>';
        
        if (errors.length === 0 && warnings.length === 0) {
            html += '<div class="validation-success">✅ All checks passed. Ready to apply schedule.</div>';
            applyBtn.disabled = false;
            window.pendingBulkCohorts = cohorts;
        } else if (errors.length === 0) {
            html += '<div class="validation-info">⚠️ Schedule has warnings but can be applied.</div>';
            applyBtn.disabled = false;
            window.pendingBulkCohorts = cohorts;
        } else {
            applyBtn.disabled = true;
        }
    } else if (inputText.trim() && errors.length === 0) {
        html += '<div class="validation-info">No valid cohorts found</div>';
        applyBtn.disabled = true;
    }
    
    validationDiv.innerHTML = html;
}

// Apply bulk schedule
function applyBulkSchedule() {
    if (!window.pendingBulkCohorts) return;
    
    window.pendingBulkCohorts.forEach(cohort => {
        activeCohorts.push({
            id: nextCohortId++,
            numTrainees: cohort.numTrainees,
            pathwayId: cohort.pathwayId,
            startYear: cohort.year,
            startFortnight: cohort.fortnight,
            location: currentLocation,
            crossLocationTraining: {}
        });
    });
    
    updateAllTables();
    renderGanttChart();
    markDirty();
    
    // Close modal and reset
    document.getElementById('training-planner-modal').classList.remove('active');
    document.getElementById('bulk-input').value = '';
    document.getElementById('bulk-validation').innerHTML = '';
    document.getElementById('apply-bulk').disabled = true;
    window.pendingBulkCohorts = null;
}

// Optimize for target
function optimizeForTarget(e) {
    e.preventDefault();
    
    const cpInput = document.getElementById('target-cp');
    const foInput = document.getElementById('target-fo');
    const cadInput = document.getElementById('target-cad');
    const dateInput = document.getElementById('target-date');
    
    // Debug logging
    // console.log('CP Input:', cpInput.value, 'Parsed:', parseInt(cpInput.value) || 0);
    
    const targetCP = parseInt(cpInput.value) || 0;
    const targetFO = parseInt(foInput.value) || 0;
    const targetCAD = parseInt(cadInput.value) || 0;
    const targetDate = new Date(dateInput.value);
    const considerExisting = document.getElementById('consider-existing')?.checked ?? true;
    const smoothSchedule = document.getElementById('smooth-schedule')?.checked ?? false;
    // console.log('Optimizer starting with smoothSchedule =', smoothSchedule);
    
    if (targetCP + targetFO + targetCAD === 0) {
        showNotification('Please enter at least one target', 'warning');
        return;
    }
    
    // Calculate optimal schedule
    const targets = {
        cp: targetCP,
        fo: targetFO,
        cad: targetCAD
    };
    const schedule = calculateOptimalSchedule(targets, targetDate, considerExisting, smoothSchedule);
    
    // Debug logging
    // console.log('Optimization result:', schedule);
    
    // Display results
    const resultsDiv = document.getElementById('optimization-results');
    let html = '<div class="optimization-results-container">';
    
    if (schedule.feasible) {
        html += '<div class="optimization-header">';
        html += '<h4>Optimization Results</h4>';
        
        if (schedule.capacityAnalysis && schedule.capacityAnalysis.conflicts.some(c => c.type === 'Trainer' && c.severity === 'warning')) {
            html += '<div class="validation-success">✅ Target is achievable with trainer capacity constraints</div>';
        } else {
            html += '<div class="validation-success">✅ Target is achievable</div>';
        }
        
        // Add completion summary
        if (schedule.cohorts && schedule.cohorts.length > 0) {
            html += '<div class="completion-summary">';
            const summary = calculateCompletionSummary(schedule.cohorts, targetDate);
            ['CP', 'FO', 'CAD'].forEach(type => {
                const target = targets[type.toLowerCase()] || 0;
                if (target > 0 && summary[type]) {
                    html += `<span class="summary-item">${type}: ${summary[type].onTime}/${target} by target date</span>`;
                }
            });
            html += '</div>';
        }
        html += '</div>';
        
        html += '<div class="optimization-content">';
        
        // Left column - Warnings and constraints
        html += '<div class="optimization-column warnings-column">';
        
        // Show capacity constraints if relevant
        if (schedule.capacityAnalysis && considerExisting) {
            const gsSimConflicts = schedule.capacityAnalysis.conflicts.filter(c => c.type === 'GS+SIM');
            const trainerWarnings = schedule.capacityAnalysis.conflicts.filter(c => c.type === 'Trainer' && c.severity === 'warning');
            const trainerSmoothed = schedule.capacityAnalysis.conflicts.filter(c => c.type === 'Trainer' && c.severity === 'info');
            
            if (gsSimConflicts.length > 0) {
                html += '<div class="capacity-constraints">';
                html += '<h5>GS+SIM Capacity Constraints Worked Around:</h5>';
                
                // Group by pathway type to reduce noise
                const gsSimByType = {};
                gsSimConflicts.forEach(conflict => {
                    const type = conflict.pathwayType || 'FO/CAD';
                    if (!gsSimByType[type]) {
                        gsSimByType[type] = [];
                    }
                    gsSimByType[type].push(conflict.time);
                });
                
                html += '<ul>';
                Object.entries(gsSimByType).forEach(([type, times]) => {
                    html += `<li>${type}: Avoided conflicts in ${times.join(', ')}</li>`;
                });
                html += '</ul>';
                html += '</div>';
            }
            
            if (smoothSchedule && trainerSmoothed.length > 0) {
                html += '<div class="capacity-info">';
                html += '<h5>📊 Schedule Smoothing Applied:</h5>';
                html += '<p>Training has been optimized to maintain trainer capacity:</p>';
                
                // Calculate completion breakdown by target date
                const targetYear = targetDate.getFullYear();
                const targetMonth = targetDate.getMonth();
                const cohortsList = schedule.cohorts || schedule.partialSchedule || [];
                
                const completionsByType = { CP: { byTarget: 0, afterTarget: 0 }, 
                                          FO: { byTarget: 0, afterTarget: 0 }, 
                                          CAD: { byTarget: 0, afterTarget: 0 } };
                
                cohortsList.forEach(cohort => {
                    const parts = cohort.completionDate.split(' ');
                    const completionMonth = MONTHS.indexOf(parts[0]);
                    const completionYear = parseInt(parts[1]);
                    const pathway = pathways.find(p => p.id === cohort.pathwayId);
                    const type = pathway?.type || cohort.type;
                    
                    // For January 1st targets, any completion in January is considered after target
                    const targetDay = targetDate.getDate();
                    if (completionYear < targetYear || 
                        (completionYear === targetYear && completionMonth < targetMonth) ||
                        (completionYear === targetYear && completionMonth === targetMonth && targetDay !== 1)) {
                        completionsByType[type].byTarget += cohort.numTrainees;
                    } else {
                        completionsByType[type].afterTarget += cohort.numTrainees;
                    }
                });
                
                html += '<div class="completion-breakdown">';
                html += '<p><strong>Completion Summary:</strong></p>';
                html += '<ul>';
                
                ['CP', 'FO', 'CAD'].forEach(type => {
                    const target = parseInt(document.getElementById(`target-${type.toLowerCase()}`).value) || 0;
                    if (target > 0) {
                        const byTarget = completionsByType[type].byTarget;
                        const afterTarget = completionsByType[type].afterTarget;
                        const total = byTarget + afterTarget;
                        
                        html += `<li><strong>${type}:</strong> ${byTarget}/${target} complete by target date`;
                        if (afterTarget > 0) {
                            // Find when the remaining will complete
                            let latestDate = null;
                            cohortsList.forEach(cohort => {
                                const pathway = pathways.find(p => p.id === cohort.pathwayId);
                                if ((pathway?.type || cohort.type) === type) {
                                    const parts = cohort.completionDate.split(' ');
                                    const month = MONTHS.indexOf(parts[0]);
                                    const year = parseInt(parts[1]);
                                    if (year > targetYear || (year === targetYear && month > targetMonth)) {
                                        if (!latestDate || year > latestDate.year || 
                                            (year === latestDate.year && month > latestDate.month)) {
                                            latestDate = { month, year, date: cohort.completionDate };
                                        }
                                    }
                                }
                            });
                            html += `, remaining ${afterTarget} by ${latestDate?.date || 'TBD'}`;
                        }
                        html += '</li>';
                    }
                });
                
                html += '</ul>';
                html += '</div>';
                
                // Group by pathway type to avoid duplicates
                const smoothingByType = {};
                trainerSmoothed.forEach(item => {
                    if (!smoothingByType[item.pathwayType]) {
                        smoothingByType[item.pathwayType] = new Set();
                    }
                    smoothingByType[item.pathwayType].add(item.time);
                });
                
                if (Object.keys(smoothingByType).length > 0) {
                    html += '<p style="margin-top: 10px;">Training spread across additional months to maintain capacity:</p>';
                    html += '<ul>';
                    Object.entries(smoothingByType).forEach(([type, monthsSet]) => {
                        const months = Array.from(monthsSet).sort();
                        html += `<li>${type}: ${months.length} cohort${months.length > 1 ? 's' : ''} delayed to avoid trainer deficits</li>`;
                    });
                    html += '</ul>';
                }
                
                html += '</div>';
            } else if (trainerWarnings.length > 0) {
                html += '<div class="capacity-warning">';
                html += '<h5>⚠️ Trainer Capacity Warnings:</h5>';
                html += '<p>The following periods would have trainer deficits (negative S/D):</p>';
                html += '<ul>';
                trainerWarnings.forEach(warning => {
                    html += `<li><strong>${warning.time}:</strong> ${warning.reason}`;
                    if (warning.details && warning.details.length > 0) {
                        html += '<ul style="margin-top: 5px;">';
                        // Group by training type
                        const detailsByType = {};
                        warning.details.forEach(detail => {
                            if (detail.trainingType) {
                                if (!detailsByType[detail.trainingType]) {
                                    detailsByType[detail.trainingType] = [];
                                }
                                detailsByType[detail.trainingType].push(detail);
                            }
                        });
                        
                        Object.entries(detailsByType).forEach(([trainingType, details]) => {
                            if (details.length > 0) {
                                const d = details[0]; // Use first detail for this type
                                html += `<li style="font-size: 0.9em;">${trainingType}: ${d.allocated}/${d.demand} trainers (deficit: -${d.deficit})`;
                                if (d.remainingCapacity) {
                                    const remaining = d.remainingCapacity[trainingType] || 0;
                                    if (remaining > 0) {
                                        html += ` - ${remaining.toFixed(1)} trainers available for other ${trainingType} training`;
                                    }
                                }
                                html += '</li>';
                            }
                        });
                        html += '</ul>';
                    }
                    html += '</li>';
                });
                html += '</ul>';
                html += '<p style="font-style: italic; color: #666;">Note: Training may proceed but could be slower due to trainer shortages.</p>';
                html += '<p style="margin-top: 10px;"><strong>💡 Tip:</strong> Enable "Smooth schedule" to automatically spread training and avoid these deficits.</p>';
                html += '</div>';
            }
            
        }
        
        html += '</div>'; // Close warnings column
        
        // Right column - Schedule
        html += '<div class="optimization-column schedule-column">';
        
        if (!schedule.cohorts || schedule.cohorts.length === 0) {
            html += '<div class="validation-info">No cohorts scheduled for target date.</div>';
            document.getElementById('apply-optimized').disabled = true;
        } else {
            html += '<div class="optimization-schedule">';
            html += '<h5>New Cohorts to Schedule:</h5>';
            
            schedule.cohorts.forEach(cohort => {
                const pathway = pathways.find(p => p.id === cohort.pathwayId);
                const month = MONTHS[Math.floor((cohort.startFortnight - 1) / 2)];
                html += `
                    <div class="schedule-item">
                        <div class="schedule-item-header">
                            <span>${month} ${cohort.startYear}</span>
                            <span>${cohort.numTrainees} x ${pathway?.name || cohort.type}</span>
                        </div>
                        <div class="schedule-item-details">
                            Start: FN${String(cohort.startFortnight).padStart(2, '0')} | Completes: ${cohort.completionDate}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            html += `<div class="validation-info">Total new cohorts: ${schedule.cohorts.length}</div>`;
            
            document.getElementById('apply-optimized').disabled = false;
            window.pendingOptimizedSchedule = schedule.cohorts;
        }
        
        html += '</div>'; // Close schedule column
        html += '</div>'; // Close optimization-content
        
    } else {
        html += '<div class="optimization-header">';
        html += '<h4>Optimization Results</h4>';
        if (schedule.smoothingExtended) {
            html += '<div class="validation-warning">⚠️ Schedule extended due to smoothing</div>';
        } else {
            html += '<div class="validation-error">❌ Target not achievable by specified date</div>';
        }
        html += '</div>';
        
        html += '<div class="optimization-content">';
        
        // Left column - Analysis
        html += '<div class="optimization-column warnings-column">';
        html += '<h5>Analysis</h5>';
        html += '<div class="validation-info">' + schedule.reason + '</div>';
        
        if (schedule.unmetDemand && schedule.unmetDemand.length > 0) {
            html += '<div class="validation-details">';
            html += '<p><strong>Analysis:</strong></p>';
            html += '<ul>';
            schedule.unmetDemand.forEach(u => {
                // Use byTargetDate if available (new format), otherwise fall back to scheduled
                const completeByTarget = u.byTargetDate !== undefined ? u.byTargetDate : u.scheduled;
                html += `<li><strong>${u.type}:</strong> ${completeByTarget} of ${u.needed} trainees can complete by target date`;
                
                if (u.afterTargetDate > 0) {
                    html += ` (${u.afterTargetDate} complete after target)`;
                } else if (u.shortfall > 0) {
                    html += ` (${u.shortfall} short)`;
                }
                
                if (u.achievableDate) {
                    html += `<br><span style="color: #0d6efd;">→ Full target achievable by: ${u.achievableDate}</span>`;
                }
                html += '</li>';
            });
            html += '</ul>';
            html += '</div>';
        }
        
        // Show trainer capacity breakdown if available
        if (schedule.capacityAnalysis && schedule.capacityAnalysis.conflicts.length > 0) {
            const trainerConflicts = schedule.capacityAnalysis.conflicts.filter(c => c.type === 'Trainer' && c.severity === 'warning');
            if (trainerConflicts.length > 0) {
                html += '<div class="capacity-warning" style="margin-top: 15px;">';
                html += '<h5>⚠️ Trainer Capacity Analysis:</h5>';
                html += '<p>The following periods have insufficient trainer capacity:</p>';
                html += '<ul style="font-size: 0.9em;">';
                
                // Group by time period
                const conflictsByTime = {};
                trainerConflicts.forEach(conflict => {
                    if (!conflictsByTime[conflict.time]) {
                        conflictsByTime[conflict.time] = [];
                    }
                    conflictsByTime[conflict.time].push(...(conflict.details || []));
                });
                
                Object.entries(conflictsByTime).forEach(([time, details]) => {
                    html += `<li><strong>${time}:</strong><ul>`;
                    // Group by training type
                    const byType = {};
                    details.forEach(d => {
                        if (d.trainingType && !byType[d.trainingType]) {
                            byType[d.trainingType] = d;
                        }
                    });
                    Object.values(byType).forEach(d => {
                        html += `<li>${d.trainingType}: ${d.allocated}/${d.demand} trainers allocated (deficit: ${d.deficit})</li>`;
                    });
                    html += '</ul></li>';
                });
                html += '</ul>';
                html += '</div>';
            }
        }
        
        html += '</div>'; // Close warnings column
        
        // Right column - Partial Schedule
        html += '<div class="optimization-column schedule-column">';
        
        if (schedule.partialSchedule && schedule.partialSchedule.length > 0) {
            html += '<h5>Partial Schedule</h5>';
            html += '<p>What can be achieved:</p>';
            html += '<div class="optimization-schedule">';
            
            schedule.partialSchedule.forEach(cohort => {
                const pathway = pathways.find(p => p.id === cohort.pathwayId);
                const month = MONTHS[Math.floor((cohort.startFortnight - 1) / 2)];
                const completionParts = cohort.completionDate.split(' ');
                const completionYear = parseInt(completionParts[1]);
                const targetYear = targetDate.getFullYear();
                const isLate = completionYear > targetYear || 
                    (completionYear === targetYear && MONTHS.indexOf(completionParts[0]) > targetDate.getMonth());
                
                html += `
                    <div class="schedule-item ${isLate ? 'schedule-item-late' : ''}">
                        <div class="schedule-item-header">
                            <span>${month} ${cohort.startYear}</span>
                            <span>${cohort.numTrainees} x ${pathway?.name || cohort.type}</span>
                        </div>
                        <div class="schedule-item-details">
                            Completes: ${cohort.completionDate}
                            ${isLate ? '<span class="late-indicator"> (After target)</span>' : ''}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            html += '<div class="apply-partial-info">';
            html += '<p><strong>💡 You can still apply this partial schedule</strong></p>';
            html += '<p>This will schedule what\'s possible within constraints. You\'ll see exactly which cohorts complete after your target date.</p>';
            html += '</div>';
            
            // Enable apply button for partial schedules
            document.getElementById('apply-optimized').disabled = false;
            window.pendingOptimizedSchedule = schedule.partialSchedule;
        } else {
            html += '<div class="validation-info">No cohorts can be scheduled.</div>';
            document.getElementById('apply-optimized').disabled = true;
        }
        
        html += '</div>'; // Close schedule column
        html += '</div>'; // Close optimization-content
    }
    
    html += '</div>'; // Close optimization-results-container
    resultsDiv.innerHTML = html;
}

// Calculate completion summary
function calculateCompletionSummary(cohorts, targetDate) {
    const summary = {};
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    
    cohorts.forEach(cohort => {
        const type = cohort.type;
        if (!summary[type]) {
            summary[type] = { total: 0, onTime: 0, late: 0 };
        }
        
        summary[type].total += cohort.numTrainees;
        
        // Check if completes by target date
        const completionParts = cohort.completionDate.split(' ');
        const completionYear = parseInt(completionParts[1]);
        const completionMonth = MONTHS.indexOf(completionParts[0]);
        const targetDay = targetDate.getDate();
        
        // For January 1st targets, any completion in January is considered late
        if (completionYear < targetYear || 
            (completionYear === targetYear && completionMonth < targetMonth) ||
            (completionYear === targetYear && completionMonth === targetMonth && targetDay !== 1)) {
            summary[type].onTime += cohort.numTrainees;
        } else {
            summary[type].late += cohort.numTrainees;
        }
    });
    
    return summary;
}

// Calculate available trainer capacity using priority-based allocation
function calculateAvailableTrainerCapacity(timeKey, existingDemand, trainerSupply) {
    // Parse existing demand by training type
    const demandByType = existingDemand || { 'LT-CAD': 0, 'LT-CP': 0, 'LT-FO': 0 };
    
    // Get trainer FTE for this time period
    const fteByCategory = {};
    const [year, fn] = timeKey.split('-').map(Number);
    let fteYear = year;
    if (!trainerFTE[year]) {
        // Find the last year with data
        for (let y = year - 1; y >= START_YEAR; y--) {
            if (trainerFTE[y]) {
                fteYear = y;
                break;
            }
        }
    }
    
    TRAINER_CATEGORIES.forEach(cat => {
        fteByCategory[cat] = (trainerFTE[fteYear]?.[cat] || 0) / FORTNIGHTS_PER_YEAR;
    });
    
    // Allocate trainers based on priority
    const allocation = {};
    const availableByCategory = { ...fteByCategory };
    
    // P1: LT-CAD (CATB, CATA, STP only)
    const ltCadDemand = demandByType['LT-CAD'] || 0;
    const ltCadPrimaryTrainers = ['CATB', 'CATA', 'STP'];
    let ltCadAllocated = 0;
    
    ltCadPrimaryTrainers.forEach(cat => {
        const available = availableByCategory[cat] || 0;
        const allocate = Math.min(available, ltCadDemand - ltCadAllocated);
        ltCadAllocated += allocate;
        availableByCategory[cat] -= allocate;
    });
    
    allocation['LT-CAD'] = {
        demand: ltCadDemand,
        allocated: ltCadAllocated,
        deficit: Math.max(0, ltCadDemand - ltCadAllocated)
    };
    
    // P2: LT-CP (RHS primary, then cascade from CATB, CATA, STP)
    const ltCpDemand = demandByType['LT-CP'] || 0;
    let ltCpAllocated = 0;
    
    // First use RHS
    const rhsAvailable = availableByCategory['RHS'] || 0;
    const rhsAllocate = Math.min(rhsAvailable, ltCpDemand);
    ltCpAllocated += rhsAllocate;
    availableByCategory['RHS'] -= rhsAllocate;
    
    // Then cascade from P1 pool if needed
    if (ltCpAllocated < ltCpDemand) {
        ['CATB', 'CATA', 'STP'].forEach(cat => {
            const available = availableByCategory[cat] || 0;
            const allocate = Math.min(available, ltCpDemand - ltCpAllocated);
            ltCpAllocated += allocate;
            availableByCategory[cat] -= allocate;
        });
    }
    
    allocation['LT-CP'] = {
        demand: ltCpDemand,
        allocated: ltCpAllocated,
        deficit: Math.max(0, ltCpDemand - ltCpAllocated)
    };
    
    // P3: LT-FO (LHS primary, then cascade from everyone)
    const ltFoDemand = demandByType['LT-FO'] || 0;
    let ltFoAllocated = 0;
    
    // First use LHS
    const lhsAvailable = availableByCategory['LHS'] || 0;
    const lhsAllocate = Math.min(lhsAvailable, ltFoDemand);
    ltFoAllocated += lhsAllocate;
    availableByCategory['LHS'] -= lhsAllocate;
    
    // Then cascade from all others if needed
    if (ltFoAllocated < ltFoDemand) {
        ['CATB', 'CATA', 'STP', 'RHS'].forEach(cat => {
            const available = availableByCategory[cat] || 0;
            const allocate = Math.min(available, ltFoDemand - ltFoAllocated);
            ltFoAllocated += allocate;
            availableByCategory[cat] -= allocate;
        });
    }
    
    allocation['LT-FO'] = {
        demand: ltFoDemand,
        allocated: ltFoAllocated,
        deficit: Math.max(0, ltFoDemand - ltFoAllocated)
    };
    
    // Calculate total remaining capacity for each training type
    const remainingCapacity = {};
    
    // For LT-CAD: only CATB, CATA, STP
    remainingCapacity['LT-CAD'] = (availableByCategory['CATB'] || 0) + 
                                  (availableByCategory['CATA'] || 0) + 
                                  (availableByCategory['STP'] || 0);
    
    // For LT-CP: RHS + CATB, CATA, STP
    remainingCapacity['LT-CP'] = (availableByCategory['RHS'] || 0) + 
                                 (availableByCategory['CATB'] || 0) + 
                                 (availableByCategory['CATA'] || 0) + 
                                 (availableByCategory['STP'] || 0);
    
    // For LT-FO: Everyone
    remainingCapacity['LT-FO'] = Object.values(availableByCategory).reduce((sum, val) => sum + val, 0);
    
    return {
        allocation,
        remainingCapacity,
        availableByCategory,
        totalSupply: Object.values(fteByCategory).reduce((sum, val) => sum + val, 0)
    };
}

// Calculate optimal schedule
function calculateOptimalSchedule(targets, targetDate, considerExisting = true, smoothSchedule = false) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentFortnight = (currentMonth * 2) + (today.getDate() <= 14 ? 1 : 2);
    
    // Get pathway info - store pathway ID properly
    const pathwayInfo = {};
    pathways.forEach(p => {
        if (!pathwayInfo[p.type]) {
            const totalDuration = p.phases.reduce((sum, phase) => sum + phase.duration, 0);
            pathwayInfo[p.type] = {
                duration: totalDuration,
                pathway: p,
                pathwayId: p.id,  // Store the ID properly
                maxPerCohort: p.type === 'CP' ? 12 : 16
            };
        }
    });
    
    // Calculate target date info first
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetEndFortnight = (targetMonth * 2) + (targetDate.getDate() <= 14 ? 1 : 2);
    
    // Note: We don't count existing completions toward targets anymore
    // The 'considerExisting' flag is only for checking capacity constraints
    const existingCompletions = { cp: 0, fo: 0, cad: 0 };
    
    // Analyze existing cohorts for capacity constraints
    const capacityAnalysis = {
        gsSimUsage: {}, // Track GS+SIM usage by time
        trainerDemand: {}, // Track trainer demand by time
        trainerSupply: {}, // Track trainer supply by time
        conflicts: []
    };
    
    // Calculate trainer supply for each fortnight
    for (let year = currentYear; year <= targetYear + 1; year++) {
        // Check if we have FTE data for this year, if not use the last available year
        let fteYear = year;
        if (!trainerFTE[year]) {
            // Find the last year with data
            for (let y = year - 1; y >= START_YEAR; y--) {
                if (trainerFTE[y]) {
                    fteYear = y;
                    break;
                }
            }
        }
        
        const totalYearlyFTE = TRAINER_CATEGORIES.reduce((sum, cat) => sum + (trainerFTE[fteYear]?.[cat] || 0), 0);
        const totalFortnightlyFTE = totalYearlyFTE / FORTNIGHTS_PER_YEAR;
        
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            const timeKey = `${year}-${fn}`;
            capacityAnalysis.trainerSupply[timeKey] = totalFortnightlyFTE;
        }
    }
    
    const cohorts = [];
    
    if (considerExisting && activeCohorts.length > 0) {
        activeCohorts.forEach(cohort => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            if (!pathway) return;
            
            // Track GS+SIM usage for all types (CP has limit of 10, FO/CAD have 16)
            if (pathway.type === 'FO' || pathway.type === 'CAD' || pathway.type === 'CP') {
                const gsSimKey = `${cohort.startYear}-${cohort.startFortnight}`;
                capacityAnalysis.gsSimUsage[gsSimKey] = (capacityAnalysis.gsSimUsage[gsSimKey] || 0) + cohort.numTrainees;
            }
            
            // Track trainer demand throughout the training period
            let currentYear = cohort.startYear;
            let currentFortnight = cohort.startFortnight;
            
            pathway.phases.forEach(phase => {
                for (let i = 0; i < phase.duration; i++) {
                    if (currentYear > END_YEAR) break;
                    
                    const timeKey = `${currentYear}-${currentFortnight}`;
                    if (!capacityAnalysis.trainerDemand[timeKey]) {
                        capacityAnalysis.trainerDemand[timeKey] = { total: 0, byTrainingType: {} };
                    }
                    
                    // Only count trainer demand for phases that require trainers (not GS+SIM)
                    if (phase.trainerDemandType) {
                        const phaseDemand = cohort.numTrainees; // Direct 1:1 trainer demand
                        capacityAnalysis.trainerDemand[timeKey].total += phaseDemand;
                        capacityAnalysis.trainerDemand[timeKey].byTrainingType[phase.trainerDemandType] = 
                            (capacityAnalysis.trainerDemand[timeKey].byTrainingType[phase.trainerDemandType] || 0) + phaseDemand;
                    }
                    
                    // Move to next fortnight
                    currentFortnight++;
                    if (currentFortnight > FORTNIGHTS_PER_YEAR) {
                        currentFortnight = 1;
                        currentYear++;
                    }
                }
            });
        });
    }
    
    // Create schedule for each type
    const unmetDemand = [];
    const cpMonthsUsed = new Set(); // Track which months already have CP cohorts
    
    // First, track existing CP cohorts by month if considering existing
    if (considerExisting && activeCohorts.length > 0) {
        activeCohorts.forEach(cohort => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            if (pathway && pathway.type === 'CP') {
                const monthKey = `${cohort.startYear}-${Math.floor((cohort.startFortnight - 1) / 2)}`;
                cpMonthsUsed.add(monthKey);
            }
        });
    }
    
    ['CP', 'FO', 'CAD'].forEach(type => {
        const needed = targets[type.toLowerCase()] || 0;
        if (needed === 0) return;
        
        const info = pathwayInfo[type];
        if (!info) return;
        
        // Calculate latest possible start
        let latestStart = targetEndFortnight - info.duration + 1;
        let latestYear = targetYear;
        while (latestStart < 1) {
            latestStart += FORTNIGHTS_PER_YEAR;
            latestYear--;
        }
        
        // Check if we need to start in the past
        if (latestYear < currentYear || 
            (latestYear === currentYear && latestStart < currentFortnight)) {
            // Calculate when it could be achieved
            const totalCohorts = Math.ceil(needed / info.maxPerCohort);
            let projectedMonth = currentMonth + 1;
            let projectedYear = currentYear;
            
            // Add time for cohorts plus training duration
            projectedMonth += (totalCohorts - 1) + Math.ceil(info.duration / 2);
            while (projectedMonth >= 12) {
                projectedMonth -= 12;
                projectedYear++;
            }
            
            unmetDemand.push({
                type,
                needed,
                scheduled: 0,
                shortfall: needed,
                reason: `Training takes ${info.duration} fortnights. Would need to start in the past.`,
                achievableDate: `${MONTHS[projectedMonth]} ${projectedYear}`
            });
            return;
        }
        
        // Schedule cohorts
        let remainingTrainees = needed;
        let scheduled = 0;
        
        // Calculate starting position based on type
        let startYear = currentYear;
        let startFn;
        
        if (type === 'CP') {
            // CP must start in first fortnight of month
            let nextMonth = currentMonth + 1;
            if (nextMonth >= 12) {
                nextMonth = 0;
                startYear++;
            }
            startFn = (nextMonth * 2) + 1; // Always first fortnight for CP
        } else {
            // FO/CAD can start in any fortnight
            startFn = currentFortnight + 1;
            if (startFn > FORTNIGHTS_PER_YEAR) {
                startFn = 1;
                startYear++;
            }
        }
        
        // If smoothing is enabled, extend the search beyond target date
        const searchLimitYear = smoothSchedule ? targetYear + 2 : latestYear;
        const searchLimitFn = smoothSchedule ? FORTNIGHTS_PER_YEAR : latestStart;
        
        while (remainingTrainees > 0 && 
               (startYear < searchLimitYear || (startYear === searchLimitYear && startFn <= searchLimitFn))) {
            let cohortSize = Math.min(remainingTrainees, info.maxPerCohort);
            
            // For CP, check if this month already has a cohort
            if (type === 'CP') {
                const monthKey = `${startYear}-${Math.floor((startFn - 1) / 2)}`;
                if (cpMonthsUsed.has(monthKey)) {
                    // Skip to next month - CP already scheduled this month
                    const currMonthIndex = Math.floor((startFn - 1) / 2);
                    const nextMonthIndex = currMonthIndex + 1;
                    if (nextMonthIndex >= 12) {
                        startFn = 1;
                        startYear++;
                    } else {
                        startFn = (nextMonthIndex * 2) + 1;
                    }
                    continue;
                }
            }
            
            // Check GS+SIM constraint if considering existing
            if (considerExisting && (type === 'FO' || type === 'CAD' || type === 'CP')) {
                const gsSimKey = `${startYear}-${startFn}`;
                const existingGsSim = capacityAnalysis.gsSimUsage[gsSimKey] || 0;
                const gsSimLimit = type === 'CP' ? 10 : 16; // CP has limit of 10, FO/CAD have 16
                const gsSimAvailable = gsSimLimit - existingGsSim;
                
                if (gsSimAvailable <= 0) {
                    // Skip this slot - no GS+SIM capacity
                    const conflictKey = `${startYear}-${startFn}`;
                    const existingConflict = capacityAnalysis.conflicts.find(c => 
                        c.type === 'GS+SIM' && c.key === conflictKey
                    );
                    
                    if (!existingConflict) {
                        capacityAnalysis.conflicts.push({
                            type: 'GS+SIM',
                            key: conflictKey,
                            time: `${MONTHS[Math.floor((startFn - 1) / 2)]} ${startYear}`,
                            reason: `Already ${existingGsSim} ${type} trainees starting (limit: ${gsSimLimit})`,
                            pathwayType: type
                        });
                    }
                    
                    // Move to next available slot
                    if (type === 'CP') {
                        // CP: Skip to first fortnight of next month
                        const currMonthIndex = Math.floor((startFn - 1) / 2);
                        const nextMonthIndex = currMonthIndex + 1;
                        if (nextMonthIndex >= 12) {
                            startFn = 1;
                            startYear++;
                        } else {
                            startFn = (nextMonthIndex * 2) + 1;
                        }
                    } else {
                        // FO/CAD: Try next fortnight
                        startFn++;
                        if (startFn > FORTNIGHTS_PER_YEAR) {
                            startFn = 1;
                            startYear++;
                        }
                    }
                    continue;
                }
                
                // Reduce cohort size if needed
                cohortSize = Math.min(cohortSize, gsSimAvailable);
            }
            
            // Check trainer capacity constraint if considering existing
            if (considerExisting) {
                // Check if this cohort would cause trainer deficit
                let hasTrainerDeficit = false;
                let deficitDetails = [];
                
                // Get pathway phases to check trainer demand
                const pathway = info.pathway;
                let checkYear = startYear;
                let checkFn = startFn;
                
                // Check each fortnight of the training
                // Use a flag to break out of nested loops
                let shouldBreak = false;
                
                pathway.phases.forEach(phase => {
                    if (shouldBreak) return;
                    
                    for (let i = 0; i < phase.duration; i++) {
                        if (phase.trainerDemandType) {
                            const timeKey = `${checkYear}-${checkFn}`;
                            const existingDemandByType = capacityAnalysis.trainerDemand[timeKey]?.byTrainingType || {};
                            
                            // Create a copy of existing demand to test with new cohort
                            const testDemand = { ...existingDemandByType };
                            testDemand[phase.trainerDemandType] = (testDemand[phase.trainerDemandType] || 0) + cohortSize;
                            
                            // Use priority-based allocation to check capacity
                            const capacityCheck = calculateAvailableTrainerCapacity(timeKey, testDemand);
                            
                            // Check if this training type has a deficit
                            const typeAllocation = capacityCheck.allocation[phase.trainerDemandType];
                            if (typeAllocation && typeAllocation.deficit > 0) {
                                hasTrainerDeficit = true;
                                deficitDetails.push({
                                    time: `${MONTHS[Math.floor((checkFn - 1) / 2)]} ${checkYear}`,
                                    trainingType: phase.trainerDemandType,
                                    deficit: typeAllocation.deficit.toFixed(1),
                                    allocated: typeAllocation.allocated.toFixed(1),
                                    demand: typeAllocation.demand.toFixed(1),
                                    remainingCapacity: capacityCheck.remainingCapacity
                                });
                                
                                // If smoothing is on, we should break immediately on first deficit
                                if (smoothSchedule) {
                                    shouldBreak = true;
                                    break;
                                }
                            }
                        }
                        
                        // Move to next fortnight
                        checkFn++;
                        if (checkFn > FORTNIGHTS_PER_YEAR) {
                            checkFn = 1;
                            checkYear++;
                        }
                    }
                });
                
                // If trainer deficit detected
                if (hasTrainerDeficit) {
                    // console.log(`Deficit detected for ${type} ${cohortSize} trainees at ${startYear}-${startFn}, smoothSchedule=${smoothSchedule}`);
                    // console.log('Deficit details:', deficitDetails);
                    
                    if (smoothSchedule) {
                        // With smoothing, we MUST skip this slot to prevent negative capacity
                        // console.log(`Smoothing: Skipping ${type} cohort at ${startYear}-${startFn} to prevent deficit`);
                        
                        capacityAnalysis.conflicts.push({
                            type: 'Trainer',
                            pathwayType: type,
                            time: `${MONTHS[Math.floor((startFn - 1) / 2)]} ${startYear}`,
                            reason: `${type} training delayed to maintain trainer capacity (would cause ${deficitDetails[0]?.deficit || 'deficit'} deficit)`,
                            details: deficitDetails,
                            severity: 'info',
                            skipped: true
                        });
                        
                        // Move to next available slot WITHOUT scheduling this cohort
                        if (type === 'CP') {
                            // CP: Skip to first fortnight of next month
                            const currMonthIndex = Math.floor((startFn - 1) / 2);
                            const nextMonthIndex = currMonthIndex + 1;
                            if (nextMonthIndex >= 12) {
                                startFn = 1;
                                startYear++;
                            } else {
                                startFn = (nextMonthIndex * 2) + 1;
                            }
                        } else {
                            // FO/CAD: Try next fortnight
                            startFn++;
                            if (startFn > FORTNIGHTS_PER_YEAR) {
                                startFn = 1;
                                startYear++;
                            }
                        }
                        
                        // IMPORTANT: Continue to next iteration WITHOUT adding this cohort
                        continue;
                    } else {
                        // Add warning but don't skip
                        capacityAnalysis.conflicts.push({
                            type: 'Trainer',
                            time: `${MONTHS[Math.floor((startFn - 1) / 2)]} ${startYear}`,
                            reason: `Would cause trainer deficit`,
                            details: deficitDetails,
                            severity: 'warning'
                        });
                    }
                }
            }
            
            // Calculate completion
            let endFn = startFn + info.duration - 1;
            let endYear = startYear;
            while (endFn > FORTNIGHTS_PER_YEAR) {
                endFn -= FORTNIGHTS_PER_YEAR;
                endYear++;
            }
            
            // Verify completion by target
            if (!smoothSchedule && (endYear > targetYear || 
                (endYear === targetYear && endFn > targetEndFortnight))) {
                break; // Won't complete in time (unless smoothing is enabled)
            }
            
            // Update capacity tracking BEFORE adding to cohorts
            // This ensures next cohorts see the updated demand
            if (considerExisting) {
                // Update GS+SIM usage
                if (type === 'FO' || type === 'CAD' || type === 'CP') {
                    const gsSimKey = `${startYear}-${startFn}`;
                    capacityAnalysis.gsSimUsage[gsSimKey] = (capacityAnalysis.gsSimUsage[gsSimKey] || 0) + cohortSize;
                }
                
                // Update trainer demand for the new cohort
                const pathway = info.pathway;
                let trackYear = startYear;
                let trackFn = startFn;
                
                pathway.phases.forEach(phase => {
                    for (let i = 0; i < phase.duration; i++) {
                        if (phase.trainerDemandType) {
                            const timeKey = `${trackYear}-${trackFn}`;
                            if (!capacityAnalysis.trainerDemand[timeKey]) {
                                capacityAnalysis.trainerDemand[timeKey] = { total: 0, byTrainingType: {} };
                            }
                            capacityAnalysis.trainerDemand[timeKey].total += cohortSize;
                            capacityAnalysis.trainerDemand[timeKey].byTrainingType[phase.trainerDemandType] = 
                                (capacityAnalysis.trainerDemand[timeKey].byTrainingType[phase.trainerDemandType] || 0) + cohortSize;
                        }
                        
                        // Move to next fortnight
                        trackFn++;
                        if (trackFn > FORTNIGHTS_PER_YEAR) {
                            trackFn = 1;
                            trackYear++;
                        }
                    }
                });
            }
            
            cohorts.push({
                startYear: startYear,
                startFortnight: startFn,
                numTrainees: cohortSize,
                pathwayId: info.pathwayId,
                type: type,
                completionDate: `${MONTHS[Math.floor((endFn - 1) / 2)]} ${endYear}`
            });
            
            // Track CP month usage
            if (type === 'CP') {
                const monthKey = `${startYear}-${Math.floor((startFn - 1) / 2)}`;
                cpMonthsUsed.add(monthKey);
            }
            
            remainingTrainees -= cohortSize;
            scheduled += cohortSize;
            
            // Move to next available slot
            if (type === 'CP') {
                // CP: Skip to first fortnight of next month
                const currentMonthIdx = Math.floor((startFn - 1) / 2);
                const nextMonthIdx = currentMonthIdx + 1;
                if (nextMonthIdx >= 12) {
                    startFn = 1;
                    startYear++;
                } else {
                    startFn = (nextMonthIdx * 2) + 1;
                }
            } else {
                // FO/CAD: Try next fortnight
                startFn++;
                if (startFn > FORTNIGHTS_PER_YEAR) {
                    startFn = 1;
                    startYear++;
                }
            }
        }
        
        // Check if we scheduled everything needed (considering existing)
        if (scheduled < needed) {
            // Calculate when the full target could be achieved
            let achievableDate = null;
            if (cohorts.length > 0) {
                // Find the latest completion in the partial schedule
                let latestCompletion = null;
                cohorts.filter(c => c.type === type).forEach(cohort => {
                    const completionParts = cohort.completionDate.split(' ');
                    const monthIndex = MONTHS.indexOf(completionParts[0]);
                    const year = parseInt(completionParts[1]);
                    if (!latestCompletion || year > latestCompletion.year || 
                        (year === latestCompletion.year && monthIndex > latestCompletion.month)) {
                        latestCompletion = { month: monthIndex, year: year };
                    }
                });
                
                // Calculate when remaining trainees could complete
                if (latestCompletion) {
                    const remainingCohorts = Math.ceil((needed - scheduled) / info.maxPerCohort);
                    let projectedMonth = latestCompletion.month + remainingCohorts + Math.ceil(info.duration / 2);
                    let projectedYear = latestCompletion.year;
                    while (projectedMonth >= 12) {
                        projectedMonth -= 12;
                        projectedYear++;
                    }
                    
                    achievableDate = `${MONTHS[projectedMonth]} ${projectedYear}`;
                } else {
                    // If no cohorts scheduled at all, calculate from current date
                    const totalCohorts = Math.ceil(needed / info.maxPerCohort);
                    let projectedMonth = currentMonth + totalCohorts + Math.ceil(info.duration / 2);
                    let projectedYear = currentYear;
                    while (projectedMonth >= 12) {
                        projectedMonth -= 12;
                        projectedYear++;
                    }
                    
                    achievableDate = `${MONTHS[projectedMonth]} ${projectedYear}`;
                }
            } else if (scheduled === 0 && needed > 0) {
                // No cohorts could be scheduled at all - calculate earliest possible
                const totalCohorts = Math.ceil(needed / info.maxPerCohort);
                let projectedMonth = currentMonth + 1; // Start from next month
                let projectedYear = currentYear;
                
                // Add time for all cohorts plus training duration
                projectedMonth += (totalCohorts - 1) + Math.ceil(info.duration / 2);
                while (projectedMonth >= 12) {
                    projectedMonth -= 12;
                    projectedYear++;
                }
                
                achievableDate = `${MONTHS[projectedMonth]} ${projectedYear}`;
            }
            
            unmetDemand.push({
                type,
                needed,
                scheduled,
                shortfall: needed - scheduled,
                achievableDate
            });
        }
    });
    
    // Sort chronologically
    cohorts.sort((a, b) => {
        if (a.startYear !== b.startYear) return a.startYear - b.startYear;
        return a.startFortnight - b.startFortnight;
    });
    
    // Check if smoothing caused us to miss the target date
    let smoothingExtendedDate = false;
    const completionsByType = { CP: { byTarget: 0, afterTarget: 0 }, 
                               FO: { byTarget: 0, afterTarget: 0 }, 
                               CAD: { byTarget: 0, afterTarget: 0 } };
    
    if (cohorts.length > 0) {
        cohorts.forEach(cohort => {
            const parts = cohort.completionDate.split(' ');
            const completionYear = parseInt(parts[1]);
            const completionMonth = MONTHS.indexOf(parts[0]);
            
            // Check if completes after target date
            // For January target dates, ANY completion in January is considered AFTER the 1st
            const targetDay = targetDate.getDate();
            const completesAfterTarget = completionYear > targetYear || 
                (completionYear === targetYear && completionMonth > targetMonth) ||
                (completionYear === targetYear && completionMonth === targetMonth && targetDay === 1);
            
            if (completesAfterTarget) {
                smoothingExtendedDate = true;
                completionsByType[cohort.type].afterTarget += cohort.numTrainees;
            } else {
                completionsByType[cohort.type].byTarget += cohort.numTrainees;
            }
        });
    }
    
    // Build detailed unmet demand based on what completes by target
    const detailedUnmetDemand = [];
    ['CP', 'FO', 'CAD'].forEach(type => {
        const target = targets[type.toLowerCase()] || 0;
        const byTarget = completionsByType[type].byTarget;
        const afterTarget = completionsByType[type].afterTarget;
        
        if (target > 0 && (byTarget < target || afterTarget > 0)) {
            // Find latest completion date for this type
            let latestDate = null;
            cohorts.filter(c => c.type === type && c.completionDate).forEach(cohort => {
                const parts = cohort.completionDate.split(' ');
                const year = parseInt(parts[1]);
                const month = MONTHS.indexOf(parts[0]);
                if (!latestDate || year > latestDate.year || 
                    (year === latestDate.year && month > latestDate.month)) {
                    latestDate = { year, month, date: cohort.completionDate };
                }
            });
            
            detailedUnmetDemand.push({
                type,
                needed: target,
                scheduled: byTarget + afterTarget,
                byTargetDate: byTarget,
                afterTargetDate: afterTarget,
                shortfall: Math.max(0, target - (byTarget + afterTarget)),
                achievableDate: latestDate?.date || 'TBD'
            });
        }
    });
    
    if (unmetDemand.length > 0 || smoothingExtendedDate || detailedUnmetDemand.length > 0) {
        return {
            feasible: false, // Not feasible if we have unmet demand or smoothing extended the date
            reason: smoothingExtendedDate 
                ? 'Schedule smoothing extended training beyond target date to avoid trainer deficits' 
                : 'Cannot meet all training targets by the specified date',
            unmetDemand: detailedUnmetDemand.length > 0 ? detailedUnmetDemand : unmetDemand,
            partialSchedule: cohorts,
            capacityAnalysis,
            smoothingExtended: smoothingExtendedDate,
            completionsByType
        };
    }
    
    return { 
        feasible: true, 
        cohorts,
        capacityAnalysis
    };
}

// Copy table data to clipboard
function copyTableData() {
    const range = getTimeRangeForView();
    let resultText = `=== TABLE DATA EXPORT ===\n`;
    resultText += `View: ${viewState.currentView === 'all' ? 'All' : viewState.currentView}\n`;
    resultText += `Range: ${range.startYear} FN${range.startFortnight} to ${range.endYear} FN${range.endFortnight}\n\n`;
    
    // Get active cohorts
    resultText += `ACTIVE COHORTS:\n`;
    activeCohorts.forEach((cohort, idx) => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        resultText += `${idx + 1}. ${cohort.numTrainees} x ${pathway?.name || 'Unknown'} - Start: ${cohort.startYear} FN${cohort.startFortnight}\n`;
    });
    
    // Get FTE Summary
    resultText += `\nFTE SUMMARY:\n`;
    TRAINER_CATEGORIES.forEach(cat => {
        const totalFTE = trainerFTE[range.startYear]?.[cat] || 0;
        resultText += `${cat}: ${totalFTE} annual (${(totalFTE / FORTNIGHTS_PER_YEAR).toFixed(1)} per fortnight)\n`;
    });
    
    // Get demand snapshot
    const { demand } = calculateDemand();
    resultText += `\nDEMAND SNAPSHOT:\n`;
    
    // Sample a few key periods
    let year = range.startYear;
    let fn = range.startFortnight;
    for (let i = 0; i < 5 && (year < range.endYear || (year === range.endYear && fn <= range.endFortnight)); i++) {
        const demandData = demand[year]?.[fn];
        if (demandData) {
            resultText += `${year} FN${fn}: `;
            resultText += `Total=${demandData.total.toFixed(1)} `;
            resultText += `(LT-CAD=${(demandData.byTrainingType['LT-CAD'] || 0).toFixed(1)}, `;
            resultText += `LT-CP=${(demandData.byTrainingType['LT-CP'] || 0).toFixed(1)}, `;
            resultText += `LT-FO=${(demandData.byTrainingType['LT-FO'] || 0).toFixed(1)})\n`;
        }
        
        fn += 2; // Sample every 2 fortnights
        if (fn > FORTNIGHTS_PER_YEAR) {
            fn = 1;
            year++;
        }
    }
    
    // Get deficit information from demand calculation
    resultText += `\nCURRENT DEFICIT ANALYSIS:\n`;
    const supplyDeficit = calculateDemand();
    if (supplyDeficit.ltCpDeficit) {
        const deficitKeys = Object.keys(supplyDeficit.ltCpDeficit).slice(0, 5);
        deficitKeys.forEach(timeKey => {
            const deficit = supplyDeficit.ltCpDeficit[timeKey];
            if (deficit < 0) {
                resultText += `${timeKey}: LT-CP Training Deficit = ${deficit.toFixed(1)}\n`;
            }
        });
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(resultText).then(() => {
        const btn = document.getElementById('copy-table-data');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        showNotification('Data copied to clipboard', 'success');
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        showNotification('Failed to copy to clipboard', 'error');
        console.error('Copy failed:', err);
    });
}

// Copy optimization results to clipboard
function copyOptimizationResults() {
    const resultsDiv = document.getElementById('optimization-results');
    if (!resultsDiv || resultsDiv.innerHTML.trim().length === 0) {
        showNotification('No optimization results to copy', 'warning');
        return;
    }
    
    // Gather all the input data
    const targetDate = document.getElementById('target-date').value;
    const targetCP = document.getElementById('target-cp').value || '0';
    const targetFO = document.getElementById('target-fo').value || '0';
    const targetCAD = document.getElementById('target-cad').value || '0';
    const smoothSchedule = document.getElementById('smooth-schedule').checked;
    const considerExisting = document.getElementById('consider-existing').checked;
    
    // Extract the text content from the results
    let resultText = `=== OPTIMIZER RESULTS ===\n`;
    resultText += `Target Date: ${targetDate}\n`;
    resultText += `Targets: CP=${targetCP}, FO=${targetFO}, CAD=${targetCAD}\n`;
    resultText += `Options: Smooth Schedule=${smoothSchedule}, Consider Existing=${considerExisting}\n\n`;
    
    // Get the schedule data if available
    if (window.pendingOptimizedSchedule) {
        resultText += `\nSCHEDULE DATA:\n`;
        window.pendingOptimizedSchedule.forEach((cohort, idx) => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            resultText += `${idx + 1}. ${cohort.numTrainees} x ${pathway?.name || cohort.type} - Start: ${MONTHS[Math.floor((cohort.startFortnight - 1) / 2)]} ${cohort.startYear} (FN${cohort.startFortnight}), Completes: ${cohort.completionDate}\n`;
        });
    }
    
    // Extract the displayed analysis
    const analysisElements = resultsDiv.querySelectorAll('.validation-info, .validation-details, .capacity-warning');
    if (analysisElements.length > 0) {
        resultText += `\nANALYSIS:\n`;
        analysisElements.forEach(el => {
            resultText += el.textContent.trim() + '\n';
        });
    }
    
    // Get trainer capacity details
    const capacityDetails = resultsDiv.querySelectorAll('.capacity-warning li');
    if (capacityDetails.length > 0) {
        resultText += `\nTRAINER CAPACITY DETAILS:\n`;
        capacityDetails.forEach(detail => {
            resultText += detail.textContent.trim() + '\n';
        });
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(resultText).then(() => {
        // Show feedback
        const btn = document.getElementById('copy-optimization-results');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        showNotification('Optimization results copied to clipboard', 'success');
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        showNotification('Failed to copy to clipboard', 'error');
        console.error('Copy failed:', err);
    });
}

// Apply optimized schedule
function applyOptimizedSchedule() {
    if (!window.pendingOptimizedSchedule) return;
    
    // Find the earliest cohort to scroll to
    let earliestCohort = null;
    
    window.pendingOptimizedSchedule.forEach(cohort => {
        activeCohorts.push({
            id: nextCohortId++,
            numTrainees: cohort.numTrainees,
            pathwayId: cohort.pathwayId,
            startYear: cohort.startYear,
            startFortnight: cohort.startFortnight,
            location: currentLocation,
            crossLocationTraining: {}
        });
        
        // Track earliest cohort
        if (!earliestCohort || 
            cohort.startYear < earliestCohort.startYear || 
            (cohort.startYear === earliestCohort.startYear && cohort.startFortnight < earliestCohort.startFortnight)) {
            earliestCohort = cohort;
        }
    });
    
    updateAllTables();
    renderGanttChart();
    markDirty();
    
    // Scroll Gantt chart to the first new cohort
    if (earliestCohort) {
        const ganttContainer = document.querySelector('.gantt-container');
        if (ganttContainer) {
            // Calculate the column position for the cohort's start date
            const monthsSinceStart = ((earliestCohort.startYear - START_YEAR) * 12) + 
                                    Math.floor((earliestCohort.startFortnight - 1) / 2);
            const columnWidth = 100; // Approximate width of month column
            const scrollPosition = Math.max(0, (monthsSinceStart * columnWidth) - 200); // Offset to show context
            
            ganttContainer.scrollLeft = scrollPosition;
        }
    }
    
    // Close modal and reset
    document.getElementById('training-planner-modal').classList.remove('active');
    document.getElementById('target-form').reset();
    document.getElementById('optimization-results').innerHTML = '';
    document.getElementById('apply-optimized').disabled = true;
    window.pendingOptimizedSchedule = null;
}

// Scenario Management Functions
function openScenariosPanel() {
    const panel = document.getElementById('scenarios-panel');
    const overlay = document.getElementById('scenarios-overlay');
    panel.classList.add('active');
    overlay.classList.add('active');
    renderScenarioList();
}

function closeScenariosPanel() {
    const panel = document.getElementById('scenarios-panel');
    const overlay = document.getElementById('scenarios-overlay');
    panel.classList.remove('active');
    overlay.classList.remove('active');
}

function getCurrentState() {
    // Save current location data before creating state
    locationData[currentLocation].pathways = pathways;
    locationData[currentLocation].trainerFTE = trainerFTE;
    locationData[currentLocation].priorityConfig = priorityConfig;
    locationData[currentLocation].activeCohorts = activeCohorts;
    
    return {
        cohorts: activeCohorts,
        trainerFTE: trainerFTE,
        pathways: pathways,
        priorityConfig: priorityConfig,
        viewState: {
            groupBy: viewState.groupBy,
            collapsedGroups: viewState.collapsedGroups,
            currentLocation: currentLocation
        },
        // Include all location data
        locationData: locationData,
        currentLocation: currentLocation
    };
}

function saveCurrentScenario() {
    // Show the modal and populate preview
    showScenarioSaveModal();
}

function showScenarioSaveModal() {
    const modal = document.getElementById('scenario-save-modal');
    const form = document.getElementById('scenario-save-form');
    const nameInput = document.getElementById('scenario-name');
    const descInput = document.getElementById('scenario-description');
    
    // Clear form
    form.reset();
    
    // Update preview
    updateScenarioPreview();
    
    // Show modal (using flex for centering)
    modal.style.display = 'flex';
    
    // Focus name input
    setTimeout(() => nameInput.focus(), 100);
}

function updateScenarioPreview(name = null, description = null) {
    // If we're duplicating, use the pending scenario's stats
    const scenario = window.pendingDuplicateScenario;
    
    if (scenario) {
        // Use the duplicate scenario's stats
        document.getElementById('preview-cohorts').textContent = scenario.stats.totalCohorts;
        document.getElementById('preview-trainees').textContent = scenario.stats.totalTrainees;
    } else {
        // Calculate AU/NZ breakdown using locationData
        const auCohorts = locationData.AU.activeCohorts || [];
        const nzCohorts = locationData.NZ.activeCohorts || [];
        const auTrainees = auCohorts.reduce((sum, c) => sum + c.numTrainees, 0);
        const nzTrainees = nzCohorts.reduce((sum, c) => sum + c.numTrainees, 0);
        const totalCohorts = auCohorts.length + nzCohorts.length;
        const totalTrainees = auTrainees + nzTrainees;
        
        // Display with location breakdown
        let cohortsText = `${totalCohorts}`;
        if (totalCohorts > 0) {
            cohortsText += ` (AU: ${auCohorts.length}, NZ: ${nzCohorts.length})`;
        }
        
        let traineesText = `${totalTrainees}`;
        if (totalTrainees > 0) {
            traineesText += ` (AU: ${auTrainees}, NZ: ${nzTrainees})`;
        }
        
        document.getElementById('preview-cohorts').textContent = cohortsText;
        document.getElementById('preview-trainees').textContent = traineesText;
    }
    
    // Calculate date range across both locations
    let allCohorts;
    let scenarioPathways;
    
    if (scenario) {
        allCohorts = scenario.state.cohorts || [];
        scenarioPathways = scenario.state.pathways;
    } else {
        // Combine cohorts from both locations
        allCohorts = [...(locationData.AU.activeCohorts || []), ...(locationData.NZ.activeCohorts || [])];
        scenarioPathways = pathways; // Current location's pathways
    }
    
    if (allCohorts.length > 0) {
        const dates = allCohorts.map(c => ({
            year: c.startYear,
            fortnight: c.startFortnight
        }));
        const minDate = dates.reduce((min, d) => 
            (d.year < min.year || (d.year === min.year && d.fortnight < min.fortnight)) ? d : min
        );
        const maxDate = dates.reduce((max, d) => 
            (d.year > max.year || (d.year === max.year && d.fortnight > max.fortnight)) ? d : max
        );
        document.getElementById('preview-daterange').textContent = 
            `${minDate.year} FN${minDate.fortnight} - ${maxDate.year} FN${maxDate.fortnight}`;
    } else {
        document.getElementById('preview-daterange').textContent = 'No cohorts';
    }
    
    // Calculate pathways in use by location
    if (allCohorts.length > 0) {
        const pathwayCountByLocation = { AU: {}, NZ: {} };
        
        if (scenario) {
            // For saved scenarios, use the cohort's location property
            allCohorts.forEach(cohort => {
                const cohortLocation = cohort.location || 'AU';
                const pathway = scenarioPathways.find(p => p.id === cohort.pathwayId);
                if (pathway) {
                    const type = pathway.type;
                    if (!pathwayCountByLocation[cohortLocation]) {
                        pathwayCountByLocation[cohortLocation] = {};
                    }
                    pathwayCountByLocation[cohortLocation][type] = 
                        (pathwayCountByLocation[cohortLocation][type] || 0) + cohort.numTrainees;
                }
            });
        } else {
            // For current state, process each location separately
            ['AU', 'NZ'].forEach(loc => {
                const locCohorts = locationData[loc].activeCohorts || [];
                const locPathways = locationData[loc].pathways || [];
                
                locCohorts.forEach(cohort => {
                    const pathway = locPathways.find(p => p.id === cohort.pathwayId);
                    if (pathway) {
                        const type = pathway.type;
                        pathwayCountByLocation[loc][type] = 
                            (pathwayCountByLocation[loc][type] || 0) + cohort.numTrainees;
                    }
                });
            });
        }
        
        // Format pathways display with location breakdown
        const pathwaysList = [];
        ['AU', 'NZ'].forEach(loc => {
            const locCounts = pathwayCountByLocation[loc];
            if (Object.keys(locCounts).length > 0) {
                const locList = Object.entries(locCounts)
                    .map(([type, count]) => `${count} ${type}`)
                    .join(', ');
                pathwaysList.push(`${loc}: ${locList}`);
            }
        });
        
        document.getElementById('preview-pathways').textContent = pathwaysList.join(' | ') || 'None';
    } else {
        document.getElementById('preview-pathways').textContent = 'None';
    }
}

function handleScenarioSave(event) {
    event.preventDefault();
    
    const name = document.getElementById('scenario-name').value.trim();
    const description = document.getElementById('scenario-description').value.trim();
    
    if (!name) return;
    
    let scenario;
    const isDuplicate = !!window.pendingDuplicateScenario;
    
    if (isDuplicate) {
        // We're saving a duplicate
        scenario = window.pendingDuplicateScenario;
        scenario.name = name;
        scenario.description = description;
        scenario.date = new Date().toISOString();
        
        // Clear the pending duplicate
        window.pendingDuplicateScenario = null;
    } else {
        // Creating a new scenario from current state
        scenario = {
            id: Date.now(),
            name: name,
            description: description,
            date: new Date().toISOString(),
            state: getCurrentState(),
            stats: {
                totalCohorts: (locationData.AU.activeCohorts?.length || 0) + (locationData.NZ.activeCohorts?.length || 0),
                totalTrainees: (locationData.AU.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0) + 
                              (locationData.NZ.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0),
                auCohorts: locationData.AU.activeCohorts?.length || 0,
                nzCohorts: locationData.NZ.activeCohorts?.length || 0,
                auTrainees: locationData.AU.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0,
                nzTrainees: locationData.NZ.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0
            }
        };
    }
    
    ensureScenarios();
    scenarios.push(scenario);
    localStorage.setItem('pilotTrainerScenarios', JSON.stringify(scenarios));
    
    if (!isDuplicate) {
        viewState.currentScenarioId = scenario.id;
        viewState.isDirty = false;
    }
    
    updateCurrentScenarioDisplay();
    renderScenarioList();
    
    // Close modal
    closeScenarioModal();
    
    // Show success feedback
    const message = isDuplicate ? 
        'Scenario duplicated successfully!' : 'Scenario saved successfully!';
    showNotification(message, 'success');
    
    // Check if we need to create a new scenario after save
    if (window.pendingNewScenario) {
        window.pendingNewScenario = false;
        setTimeout(() => createNewScenario(), 100);
    }
}

function closeScenarioModal() {
    const modal = document.getElementById('scenario-save-modal');
    modal.style.display = 'none';
    
    // Clear any pending duplicate
    window.pendingDuplicateScenario = null;
    window.pendingNewScenario = false;
}

function showNotification(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icons for different types
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <span class="toast-close" onclick="removeToast(this)">×</span>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto remove after specified duration (0 means no auto-remove)
    if (duration > 0) {
        setTimeout(() => {
            removeToast(toast.querySelector('.toast-close'));
        }, duration);
    }
    
    // Return the toast element so it can be removed manually
    return toast;
}

// Show centered notification (for page refresh)
function showCenterNotification(message) {
    // Create centered toast container if it doesn't exist
    let centerContainer = document.getElementById('center-toast-container');
    if (!centerContainer) {
        centerContainer = document.createElement('div');
        centerContainer.id = 'center-toast-container';
        centerContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
        `;
        document.body.appendChild(centerContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast info';
    toast.style.cssText = 'animation: fadeInOut 1.2s ease-in-out; text-align: center; justify-content: center;';
    
    toast.innerHTML = `
        <span class="toast-message">${message}</span>
    `;
    
    // Add to center container
    centerContainer.appendChild(toast);
    
    // Remove after animation
    setTimeout(() => {
        toast.remove();
        if (centerContainer.children.length === 0) {
            centerContainer.remove();
        }
    }, 1200);
}

function removeToast(closeBtn) {
    const toast = closeBtn.closest('.toast');
    toast.style.animation = 'slideOut 0.3s ease-in';
    
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Make removeToast globally accessible for onclick handlers
window.removeToast = removeToast;

// Show alert dialog with OK button
function showAlertDialog(title, message, callback) {
    const dialog = document.getElementById('alert-dialog');
    const titleElement = document.getElementById('alert-title');
    const messageElement = document.getElementById('alert-message');
    const okButton = document.getElementById('alert-ok');
    
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    // Show dialog
    dialog.style.display = 'block';
    
    // Handle OK button click
    const handleOK = () => {
        dialog.style.display = 'none';
        okButton.removeEventListener('click', handleOK);
        if (callback) callback();
    };
    
    okButton.addEventListener('click', handleOK);
}

// Show confirmation dialog with Yes/No buttons
function showConfirmDialog(title, message, yesCallback, noCallback) {
    const dialog = document.getElementById('confirm-dialog');
    const titleElement = document.getElementById('confirm-title');
    const messageElement = document.getElementById('confirm-message');
    const yesButton = document.getElementById('confirm-yes');
    const noButton = document.getElementById('confirm-no');
    
    titleElement.textContent = title;
    messageElement.textContent = message;
    
    // Show dialog
    dialog.style.display = 'block';
    
    // Handle Yes button click
    const handleYes = () => {
        dialog.style.display = 'none';
        yesButton.removeEventListener('click', handleYes);
        noButton.removeEventListener('click', handleNo);
        if (yesCallback) yesCallback();
    };
    
    // Handle No button click
    const handleNo = () => {
        dialog.style.display = 'none';
        yesButton.removeEventListener('click', handleYes);
        noButton.removeEventListener('click', handleNo);
        if (noCallback) noCallback();
    };
    
    yesButton.addEventListener('click', handleYes);
    noButton.addEventListener('click', handleNo);
}

function updateCurrentScenario() {
    if (!viewState.currentScenarioId) {
        showNotification('No scenario is currently loaded to update.', 'warning');
        return;
    }
    
    if (!confirm('Are you sure you want to update the current scenario? This will overwrite the saved version.')) {
        return;
    }
    
    // Find the current scenario
    const scenarioIndex = getScenarios().findIndex(s => s.id === viewState.currentScenarioId);
    if (scenarioIndex === -1) {
        showNotification('Current scenario not found.', 'error');
        return;
    }
    
    // Update the scenario
    scenarios[scenarioIndex] = {
        ...scenarios[scenarioIndex],
        date: new Date().toISOString(),
        state: getCurrentState(),
        stats: {
            totalCohorts: (locationData.AU.activeCohorts?.length || 0) + (locationData.NZ.activeCohorts?.length || 0),
            totalTrainees: (locationData.AU.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0) + 
                          (locationData.NZ.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0),
            auCohorts: locationData.AU.activeCohorts?.length || 0,
            nzCohorts: locationData.NZ.activeCohorts?.length || 0,
            auTrainees: locationData.AU.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0,
            nzTrainees: locationData.NZ.activeCohorts?.reduce((sum, c) => sum + c.numTrainees, 0) || 0
        }
    };
    
    // Save to localStorage
    localStorage.setItem('pilotTrainerScenarios', JSON.stringify(scenarios));
    
    // Update state
    viewState.isDirty = false;
    
    // Update UI
    updateCurrentScenarioDisplay();
    renderScenarioList();
    
    // Show success message
    showNotification('Scenario updated successfully', 'success');
}

function loadScenarioWithoutConfirm(scenarioId) {
    const scenario = getScenarios().find(s => s.id === scenarioId);
    if (!scenario) return;
    
    loadScenarioData(scenario);
}

// Load scenario data without updating UI (for initial load)
function loadScenarioDataOnly(scenario) {
    // Save this as the last loaded scenario
    localStorage.setItem('lastScenarioId', scenario.id);
    
    // Update current scenario tracking
    viewState.currentScenarioId = scenario.id;
    viewState.isDirty = false;
    
    // Load the scenario state
    if (scenario.state.locationData) {
        // New format with location data
        locationData = JSON.parse(JSON.stringify(scenario.state.locationData));
        
        // Check if we should preserve existing FTE values
        const savedDefaultFTE = localStorage.getItem('defaultFTE');
        if (savedDefaultFTE) {
            // Preserve saved FTE instead of using scenario's FTE
            // console.log('Preserving saved default FTE values for new format scenario');
            // Override scenario FTE with saved defaults
            try {
                const parsed = JSON.parse(savedDefaultFTE);
                if (parsed.AU) {
                    locationData.AU.trainerFTE = JSON.parse(JSON.stringify(parsed.AU));
                }
                if (parsed.NZ) {
                    locationData.NZ.trainerFTE = JSON.parse(JSON.stringify(parsed.NZ));
                }
            } catch (e) {
                console.error('Error applying saved FTE to scenario:', e);
            }
        }
        
        // Check if we should preserve existing pathway values
        const savedDefaultPathways = localStorage.getItem('defaultPathways');
        if (savedDefaultPathways) {
            // Preserve saved pathways instead of using scenario's pathways
            // console.log('Preserving saved default pathways for new format scenario');
            try {
                const parsed = JSON.parse(savedDefaultPathways);
                if (parsed.AU) {
                    locationData.AU.pathways = JSON.parse(JSON.stringify(parsed.AU));
                }
                if (parsed.NZ) {
                    locationData.NZ.pathways = JSON.parse(JSON.stringify(parsed.NZ));
                }
            } catch (e) {
                console.error('Error applying saved pathways to scenario:', e);
            }
        }
        
        // Only use scenario's location if we don't have a saved preference
        const savedLocation = localStorage.getItem('currentLocation');
        if (!savedLocation) {
            currentLocation = scenario.state.currentLocation || 'AU';
            viewState.currentLocation = currentLocation;
        }
        
        // Load data for current location
        pathways = locationData[currentLocation].pathways;
        trainerFTE = locationData[currentLocation].trainerFTE;
        priorityConfig = locationData[currentLocation].priorityConfig;
        activeCohorts = locationData[currentLocation].activeCohorts;
    } else {
        // Legacy format - load into AU location
        activeCohorts = [...scenario.state.cohorts];
        priorityConfig = [...scenario.state.priorityConfig];
        
        // Check if we should preserve existing pathway values
        const savedDefaultPathways = localStorage.getItem('defaultPathways');
        if (savedDefaultPathways) {
            // Keep our saved pathway values, don't use scenario's pathways
            // console.log('Preserving saved default pathways instead of using scenario pathways');
            try {
                const parsed = JSON.parse(savedDefaultPathways);
                if (parsed.AU) {
                    pathways = JSON.parse(JSON.stringify(parsed.AU));
                } else {
                    // Fallback to scenario pathways if no AU pathways saved
                    pathways = [...scenario.state.pathways];
                }
            } catch (e) {
                console.error('Error applying saved pathways:', e);
                pathways = [...scenario.state.pathways];
            }
        } else {
            // No saved defaults, use scenario's pathways
            pathways = [...scenario.state.pathways];
        }
        
        // Check if we should preserve existing FTE values
        const savedDefaultFTE = localStorage.getItem('defaultFTE');
        if (savedDefaultFTE) {
            // Keep our saved FTE values, don't use scenario's FTE
            // console.log('Preserving saved default FTE values instead of using scenario FTE');
            // LocationData FTE should already be set from loadDefaultFTE()
            // Update global trainerFTE from the preserved locationData
            trainerFTE = locationData[currentLocation].trainerFTE;
        } else {
            // No saved defaults, use scenario's FTE
            trainerFTE = JSON.parse(JSON.stringify(scenario.state.trainerFTE));
            locationData.AU.trainerFTE = trainerFTE;
            locationData.NZ.trainerFTE = JSON.parse(JSON.stringify(trainerFTE));
        }
        
        // Migrate to location format
        locationData.AU.pathways = pathways;
        locationData.AU.priorityConfig = priorityConfig;
        
        // Separate cohorts by location
        const auCohorts = activeCohorts.filter(c => c.location === 'AU' || !c.location);
        const nzCohorts = activeCohorts.filter(c => c.location === 'NZ');
        
        locationData.AU.activeCohorts = auCohorts;
        locationData.NZ.activeCohorts = nzCohorts;
        
        // Copy settings to NZ location
        if (savedDefaultPathways) {
            try {
                const parsed = JSON.parse(savedDefaultPathways);
                if (parsed.NZ) {
                    locationData.NZ.pathways = JSON.parse(JSON.stringify(parsed.NZ));
                } else {
                    locationData.NZ.pathways = [...pathways];
                }
            } catch (e) {
                locationData.NZ.pathways = [...pathways];
            }
        } else {
            locationData.NZ.pathways = [...pathways];
        }
        locationData.NZ.priorityConfig = [...priorityConfig];
        
        // Don't override the saved location preference
        // The location should already be set from localStorage in init()
        
        // Update activeCohorts to current location's cohorts
        activeCohorts = locationData[currentLocation].activeCohorts;
    }
    
    viewState.groupBy = scenario.state.viewState?.groupBy || 'none';
    viewState.collapsedGroups = [...(scenario.state.viewState?.collapsedGroups || [])];
    
    // Update location tabs UI
    document.querySelectorAll('.location-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.location === currentLocation);
    });
    
    // Update current scenario display
    updateCurrentScenarioDisplay();
}

function loadScenario(scenarioId) {
    const scenario = getScenarios().find(s => s.id === scenarioId);
    if (!scenario) return;
    
    if (viewState.isDirty) {
        if (!confirm('You have unsaved changes. Load scenario anyway?')) {
            return;
        }
    }
    
    loadScenarioData(scenario);
}

function loadScenarioData(scenario) {
    // Save this as the last loaded scenario
    localStorage.setItem('lastScenarioId', scenario.id);
    
    // Update current scenario tracking
    viewState.currentScenarioId = scenario.id;
    viewState.isDirty = false;
    
    // Load the scenario state
    if (scenario.state.locationData) {
        // New format with location data
        // Check if we should preserve existing FTE values
        const savedDefaultFTE = localStorage.getItem('defaultFTE');
        if (savedDefaultFTE) {
            // Preserve saved FTE instead of using scenario's FTE
            // console.log('Preserving saved default FTE values for new format scenario');
            locationData = JSON.parse(JSON.stringify(scenario.state.locationData));
            // Override scenario FTE with saved defaults
            try {
                const parsed = JSON.parse(savedDefaultFTE);
                if (parsed.AU) {
                    locationData.AU.trainerFTE = JSON.parse(JSON.stringify(parsed.AU));
                }
                if (parsed.NZ) {
                    locationData.NZ.trainerFTE = JSON.parse(JSON.stringify(parsed.NZ));
                }
            } catch (e) {
                console.error('Error applying saved FTE to scenario:', e);
            }
        } else {
            // No saved defaults, use scenario's data as-is
            locationData = JSON.parse(JSON.stringify(scenario.state.locationData));
        }
        
        // Only use scenario's location if we don't have a saved preference
        const savedLocation = localStorage.getItem('currentLocation');
        if (!savedLocation) {
            currentLocation = scenario.state.currentLocation || 'AU';
            viewState.currentLocation = currentLocation;
        }
        
        // Load data for current location
        pathways = locationData[currentLocation].pathways;
        trainerFTE = locationData[currentLocation].trainerFTE;
        priorityConfig = locationData[currentLocation].priorityConfig;
        activeCohorts = locationData[currentLocation].activeCohorts;
    } else {
        // Legacy format - load into AU location
        activeCohorts = [...scenario.state.cohorts];
        priorityConfig = [...scenario.state.priorityConfig];
        
        // Check if we should preserve existing pathway values
        const savedDefaultPathways = localStorage.getItem('defaultPathways');
        if (savedDefaultPathways) {
            // Keep our saved pathway values, don't use scenario's pathways
            // console.log('Preserving saved default pathways instead of using scenario pathways');
            try {
                const parsed = JSON.parse(savedDefaultPathways);
                if (parsed.AU) {
                    pathways = JSON.parse(JSON.stringify(parsed.AU));
                } else {
                    // Fallback to scenario pathways if no AU pathways saved
                    pathways = [...scenario.state.pathways];
                }
            } catch (e) {
                console.error('Error applying saved pathways:', e);
                pathways = [...scenario.state.pathways];
            }
        } else {
            // No saved defaults, use scenario's pathways
            pathways = [...scenario.state.pathways];
        }
        
        // Check if we should preserve existing FTE values
        const savedDefaultFTE = localStorage.getItem('defaultFTE');
        if (savedDefaultFTE) {
            // Keep our saved FTE values, don't use scenario's FTE
            // console.log('Preserving saved default FTE values instead of using scenario FTE');
            // LocationData FTE should already be set from loadDefaultFTE()
            // Update global trainerFTE from the preserved locationData
            trainerFTE = locationData[currentLocation].trainerFTE;
        } else {
            // No saved defaults, use scenario's FTE
            trainerFTE = JSON.parse(JSON.stringify(scenario.state.trainerFTE));
            locationData.AU.trainerFTE = trainerFTE;
            locationData.NZ.trainerFTE = JSON.parse(JSON.stringify(trainerFTE));
        }
        
        // Migrate to location format
        locationData.AU.pathways = pathways;
        locationData.AU.priorityConfig = priorityConfig;
        
        // Separate cohorts by location
        const auCohorts = activeCohorts.filter(c => c.location === 'AU' || !c.location);
        const nzCohorts = activeCohorts.filter(c => c.location === 'NZ');
        
        console.log('Legacy format migration:');
        // console.log('Total cohorts:', activeCohorts.length);
        // console.log('AU cohorts:', auCohorts.length);
        // console.log('NZ cohorts:', nzCohorts.length);
        // console.log('NZ cohorts with cross-location training:',
        //                         nzCohorts.filter(c => c.crossLocationTraining && c.crossLocationTraining.AU).length);
        
        locationData.AU.activeCohorts = auCohorts;
        locationData.NZ.activeCohorts = nzCohorts;
        
        // Copy settings to NZ location
        if (savedDefaultPathways) {
            try {
                const parsed = JSON.parse(savedDefaultPathways);
                if (parsed.NZ) {
                    locationData.NZ.pathways = JSON.parse(JSON.stringify(parsed.NZ));
                } else {
                    locationData.NZ.pathways = [...pathways];
                }
            } catch (e) {
                locationData.NZ.pathways = [...pathways];
            }
        } else {
            locationData.NZ.pathways = [...pathways];
        }
        if (!savedDefaultFTE) {
            // Only copy FTE if we're not preserving defaults
            locationData.NZ.trainerFTE = JSON.parse(JSON.stringify(trainerFTE));
        }
        locationData.NZ.priorityConfig = [...priorityConfig];
        
        // Don't override the saved location preference during scenario load
        // The user's location preference should persist
        
        // Update activeCohorts to current location's cohorts
        activeCohorts = locationData[currentLocation].activeCohorts;
        
        // Force a complete recalculation after migration
        console.log('Forcing demand recalculation after legacy migration');
    }
    
    viewState.groupBy = scenario.state.viewState?.groupBy || 'none';
    viewState.collapsedGroups = [...(scenario.state.viewState?.collapsedGroups || [])];
    
    // Update location tabs UI
    document.querySelectorAll('.location-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.location === currentLocation);
    });
    
    // Get current view before switching
    const currentView = document.querySelector('.nav-link.active')?.getAttribute('onclick')?.match(/switchView\('(.+?)'\)/)?.[1] || 'planner';
    
    // Refresh all views
    updateAllTables();
    renderGanttChart();
    populatePathwaySelect();
    
    // Update dashboard
    updateDashboardV2();
    
    // Re-establish synchronized scrolling after a delay to ensure all tables are rendered
    setTimeout(() => {
        setupSynchronizedScrolling();
        
        // Ensure cross-location cohorts are properly displayed
        if (currentLocation === 'AU') {
            const nzCohorts = locationData.NZ?.activeCohorts || [];
            const crossLocCount = nzCohorts.filter(c => 
                c.crossLocationTraining && 
                c.crossLocationTraining.AU && 
                Object.keys(c.crossLocationTraining.AU.phases || {}).length > 0
            ).length;
            // console.log(`Cross-location cohorts from NZ using AU trainers: ${crossLocCount}`);
        }
    }, 150);
    
    updateCurrentScenarioDisplay();
    
    // Stay on current view or switch to planner if needed
    if (currentView && currentView !== 'planner') {
        switchView(currentView);
    } else {
        switchView('planner');
    }
    
    // Show success message
    showNotification(`Loaded scenario: ${scenario.name}`, 'success');
}

function deleteScenario(scenarioId) {
    if (!confirm('Are you sure you want to delete this scenario?')) return;
    
    ensureScenarios();
    const deletedScenario = scenarios.find(s => s.id === scenarioId);
    scenarios = scenarios.filter(s => s.id !== scenarioId);
    localStorage.setItem('pilotTrainerScenarios', JSON.stringify(scenarios));
    
    if (viewState.currentScenarioId === scenarioId) {
        viewState.currentScenarioId = null;
    }
    
    renderScenarioList();
    
    // Show success message
    showNotification(`Deleted scenario: ${deletedScenario?.name || 'Unknown'}`, 'success');
}

function duplicateScenario(scenarioId) {
    const originalScenario = getScenarios().find(s => s.id === scenarioId);
    if (!originalScenario) return;
    
    // Create a deep copy of the scenario
    const duplicatedScenario = {
        id: Date.now(),
        name: `Copy of ${originalScenario.name}`,
        description: originalScenario.description,
        date: Date.now(),
        state: JSON.parse(JSON.stringify(originalScenario.state)),
        stats: JSON.parse(JSON.stringify(originalScenario.stats))
    };
    
    // Store temporarily for the modal to access
    window.pendingDuplicateScenario = duplicatedScenario;
    
    // Open the save modal with pre-filled data
    const modal = document.getElementById('scenario-save-modal');
    const nameInput = document.getElementById('scenario-name');
    const descriptionInput = document.getElementById('scenario-description');
    
    nameInput.value = duplicatedScenario.name;
    descriptionInput.value = duplicatedScenario.description || '';
    
    // Update preview
    updateScenarioPreview(duplicatedScenario.name, duplicatedScenario.description);
    
    modal.style.display = 'flex';
    nameInput.focus();
    nameInput.select();
}

function createNewScenario() {
    // Check if there are unsaved changes
    if (viewState.isDirty) {
        const choice = confirm('You have unsaved changes. Would you like to save the current scenario first?\n\nClick OK to save first, or Cancel to discard changes.');
        
        if (choice) {
            // User wants to save first
            showScenarioSaveModal();
            // Set a flag to create new scenario after save
            window.pendingNewScenario = true;
            return;
        }
    }
    
    // Reset to default state
    // Clear all cohorts
    activeCohorts = [];
    locationData.AU.activeCohorts = [];
    locationData.NZ.activeCohorts = [];
    
    // Reset FTE to defaults if no saved defaults exist
    const savedDefaultFTE = localStorage.getItem('defaultFTE');
    if (!savedDefaultFTE) {
        // Reset to system defaults
        for (let year = START_YEAR; year <= END_YEAR; year++) {
            if (!trainerFTE[year]) trainerFTE[year] = {};
            TRAINER_CATEGORIES.forEach(category => {
                trainerFTE[year][category] = 240; // Default FTE
            });
        }
        // Copy to location data
        locationData.AU.trainerFTE = JSON.parse(JSON.stringify(trainerFTE));
        locationData.NZ.trainerFTE = JSON.parse(JSON.stringify(trainerFTE));
    }
    
    // Clear scenario tracking
    viewState.currentScenarioId = null;
    viewState.isDirty = false;
    
    // Update UI
    updateAllTables();
    renderGanttChart();
    updateCurrentScenarioDisplay();
    
    // Switch to planner view to start building
    switchView('planner');
    
    showNotification('New scenario created. Start adding cohorts!', 'success');
}

function renderScenarioList() {
    const container = document.getElementById('scenario-list');
    
    const loadedScenarios = getScenarios();
    if (loadedScenarios.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No saved scenarios yet</p>';
        updateScenarioCount();
        return;
    }
    
    // Get sort preference
    const sortSelect = document.getElementById('scenario-sort');
    const sortValue = sortSelect ? sortSelect.value : 'date-desc';
    
    // Sort scenarios
    const sortedScenarios = [...loadedScenarios].sort((a, b) => {
        switch (sortValue) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'size-desc':
                return b.stats.totalTrainees - a.stats.totalTrainees;
            case 'size-asc':
                return a.stats.totalTrainees - b.stats.totalTrainees;
            default:
                return 0;
        }
    });
    
    container.innerHTML = sortedScenarios.map(scenario => {
        const date = new Date(scenario.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const isSelected = selectedForComparison.has(scenario.id);
        return `
            <div class="scenario-card ${isSelected ? 'selected-for-compare' : ''}" data-scenario-id="${scenario.id}" onclick="handleCardClick(event, ${scenario.id})">
                <input type="checkbox" class="select-checkbox" ${isSelected ? 'checked' : ''} 
                       style="display: none; position: absolute; top: 10px; right: 10px;">
                <div class="scenario-card-header">
                    <div>
                        <div class="scenario-name">${scenario.name}</div>
                        <div class="scenario-date">${dateStr}</div>
                    </div>
                </div>
                ${scenario.description ? `<div class="scenario-description">${scenario.description}</div>` : ''}
                <div class="scenario-stats">
                    <div class="scenario-stat">
                        <span>Cohorts:</span>
                        <strong>${scenario.stats.totalCohorts}</strong>
                        ${scenario.stats.auCohorts !== undefined ? 
                            `<div class="location-split">AU: ${scenario.stats.auCohorts} &nbsp;|&nbsp; NZ: ${scenario.stats.nzCohorts}</div>` : 
                            ''}
                    </div>
                    <div class="scenario-stat">
                        <span>Trainees:</span>
                        <strong>${scenario.stats.totalTrainees}</strong>
                        ${scenario.stats.auTrainees !== undefined ? 
                            `<div class="location-split">AU: ${scenario.stats.auTrainees} &nbsp;|&nbsp; NZ: ${scenario.stats.nzTrainees}</div>` : 
                            ''}
                    </div>
                </div>
                <div class="scenario-actions">
                    <button class="load-btn" onclick="loadScenario(${scenario.id})">Load</button>
                    <button class="duplicate-btn" onclick="duplicateScenario(${scenario.id})">Duplicate</button>
                    <button class="export-btn" onclick="exportScenario(${scenario.id})">Export</button>
                    <button class="delete-btn" onclick="deleteScenario(${scenario.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Update scenario count
    updateScenarioCount();
}

function updateCurrentScenarioDisplay() {
    const nameSpan = document.getElementById('current-scenario-name');
    const updateBtn = document.getElementById('update-current-scenario');
    
    if (viewState.currentScenarioId) {
        const scenario = getScenarios().find(s => s.id === viewState.currentScenarioId);
        if (scenario) {
            const displayName = scenario.name + (viewState.isDirty ? ' (modified)' : '');
            nameSpan.textContent = displayName;
            // Show update button only if we have a loaded scenario with changes
            if (updateBtn) {
                updateBtn.style.display = viewState.isDirty ? 'inline-block' : 'none';
            }
        }
    } else {
        const displayName = viewState.isDirty ? 'Unsaved Changes' : 'New Scenario';
        nameSpan.textContent = displayName;
        // Hide update button if no scenario is loaded
        if (updateBtn) {
            updateBtn.style.display = 'none';
        }
    }
}

function updateScenarioCount() {
    const countSpan = document.querySelector('.scenario-count');
    if (countSpan) {
        const count = scenarios.length;
        countSpan.textContent = `${count} scenario${count !== 1 ? 's' : ''}`;
    }
}

function filterScenarios() {
    const searchInput = document.getElementById('scenario-search');
    const searchTerm = searchInput.value.toLowerCase();
    const scenarioCards = document.querySelectorAll('.scenario-card');
    
    scenarioCards.forEach(card => {
        const name = card.querySelector('.scenario-name').textContent.toLowerCase();
        const shouldShow = name.includes(searchTerm);
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

// Mark state as dirty when changes are made
function markDirty() {
    viewState.isDirty = true;
    updateCurrentScenarioDisplay();
}

// Export single scenario
function exportScenario(scenarioId) {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        scenario: scenario
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `scenario_${scenario.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification(`Exported scenario: ${scenario.name}`, 'success');
}

// Export all scenarios
function exportAllScenarios() {
    const loadedScenarios = getScenarios();
    if (loadedScenarios.length === 0) {
        showNotification('No scenarios to export', 'warning');
        return;
    }
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        scenarios: loadedScenarios
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `all_scenarios_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification(`Exported ${loadedScenarios.length} scenario${loadedScenarios.length > 1 ? 's' : ''}`, 'success');
}

// Import scenarios
function importScenarios(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Validate import data
            if (!importData.version || (!importData.scenario && !importData.scenarios)) {
                throw new Error('Invalid scenario file format');
            }
            
            const importedScenarios = importData.scenario ? [importData.scenario] : importData.scenarios;
            let imported = 0;
            let skipped = 0;
            
            for (const scenario of importedScenarios) {
                // Check for name conflicts
                ensureScenarios();
                const existingScenario = scenarios.find(s => s.name === scenario.name);
                
                if (existingScenario) {
                    const action = await showImportConflictDialog(scenario.name);
                    
                    if (action === 'skip') {
                        skipped++;
                        continue;
                    } else if (action.startsWith('rename:')) {
                        scenario.name = action.substring(7);
                    } else if (action === 'overwrite') {
                        scenarios = scenarios.filter(s => s.name !== scenario.name);
                    }
                }
                
                // Convert legacy cross-location format if needed
                if (scenario.state && scenario.state.cohorts) {
                    scenario.state.cohorts = scenario.state.cohorts.map(cohort => {
                        if (cohort.crossLocationTraining && cohort.location === 'NZ') {
                            // Check if it's the old format (fortnight numbers as keys)
                            const keys = Object.keys(cohort.crossLocationTraining);
                            if (keys.length > 0 && !isNaN(keys[0])) {
                                // console.log('Converting legacy cross-location format for cohort:', cohort);
                                cohort.crossLocationTraining = convertLegacyCrossLocation(cohort, scenario.state.pathways);
                            }
                        }
                        return cohort;
                    });
                }
                
                // Also check locationData if present
                if (scenario.state && scenario.state.locationData) {
                    Object.keys(scenario.state.locationData).forEach(location => {
                        if (scenario.state.locationData[location].activeCohorts) {
                            scenario.state.locationData[location].activeCohorts = 
                                scenario.state.locationData[location].activeCohorts.map(cohort => {
                                    if (cohort.crossLocationTraining && cohort.location === 'NZ') {
                                        const keys = Object.keys(cohort.crossLocationTraining);
                                        if (keys.length > 0 && !isNaN(keys[0])) {
                                            // console.log('Converting legacy cross-location format in locationData for cohort:', cohort);
                                            cohort.crossLocationTraining = convertLegacyCrossLocation(
                                                cohort, 
                                                scenario.state.locationData[location].pathways
                                            );
                                        }
                                    }
                                    return cohort;
                                });
                        }
                    });
                }
                
                // Generate new ID and update date
                scenario.id = Date.now() + imported;
                scenario.date = new Date().toISOString();
                
                scenarios.push(scenario);
                imported++;
            }
            
            // Save to localStorage
            localStorage.setItem('pilotTrainerScenarios', JSON.stringify(scenarios));
            renderScenarioList();
            
            let message = `Imported ${imported} scenario${imported !== 1 ? 's' : ''}`;
            if (skipped > 0) {
                message += `, skipped ${skipped}`;
            }
            showNotification(message, 'success');
            
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Failed to import scenarios: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Clear the file input for next use
    event.target.value = '';
}

// Convert legacy cross-location training format to new format
function convertLegacyCrossLocation(cohort, pathways) {
    // Convert { "1": "AU", "2": "AU", ... } to new format
    const oldFormat = cohort.crossLocationTraining;
    const newFormat = {};
    
    // Get the pathway for this cohort
    const pathway = pathways.find(p => p.id === cohort.pathwayId);
    if (!pathway) {
        console.warn('Could not find pathway for cohort:', cohort);
        return {};
    }
    
    // Group old format by location
    const locationFortnights = {};
    Object.entries(oldFormat).forEach(([localFortnight, location]) => {
        if (!locationFortnights[location]) {
            locationFortnights[location] = [];
        }
        locationFortnights[location].push(parseInt(localFortnight));
    });
    
    // Build new format
    Object.entries(locationFortnights).forEach(([location, fortnights]) => {
        newFormat[location] = { phases: {} };
        
        // Map local fortnights to phases and convert to global fortnights
        let currentLocalFortnight = 1;
        pathway.phases.forEach(phase => {
            if (phase.trainerDemandType) {
                const phaseFortnights = fortnights.filter(fn => 
                    fn >= currentLocalFortnight && fn < currentLocalFortnight + phase.duration
                );
                
                if (phaseFortnights.length > 0) {
                    // Convert to global fortnights
                    const globalFortnights = phaseFortnights.map(localFn => {
                        // Calculate the actual year and fortnight for this local fortnight
                        const totalFortnights = cohort.startFortnight + localFn - 2;
                        const yearOffset = Math.floor(totalFortnights / 24);
                        const yearFortnight = (totalFortnights % 24) + 1;
                        
                        // Calculate global fortnight (from start of 2024)
                        return ((cohort.startYear - 2024 + yearOffset) * 24) + yearFortnight;
                    });
                    
                    newFormat[location].phases[phase.trainerDemandType] = globalFortnights;
                }
            }
            currentLocalFortnight += phase.duration;
        });
    });
    
    // console.log('Converted cross-location format:', oldFormat, '->', newFormat);
    return newFormat;
}

// Scenario Comparison Functions
function handleCardClick(event, scenarioId) {
    // Don't trigger selection if clicking on action buttons
    if (event.target.closest('.scenario-actions') || event.target.closest('button')) {
        return;
    }
    
    // Toggle selection
    toggleScenarioSelection(scenarioId);
}

function toggleScenarioSelection(scenarioId) {
    if (selectedForComparison.has(scenarioId)) {
        selectedForComparison.delete(scenarioId);
    } else {
        // Only allow 2 scenarios to be selected
        if (selectedForComparison.size >= 2) {
            showNotification('Only 2 scenarios can be compared at a time', 'warning');
            return;
        }
        selectedForComparison.add(scenarioId);
    }
    
    // Update compare button state and UI
    updateComparisonUI();
    
    // Re-render the list to update selected state
    renderScenarioList();
}

function updateComparisonUI() {
    const compareBtn = document.getElementById('compare-scenarios');
    if (compareBtn) {
        compareBtn.disabled = selectedForComparison.size !== 2;
        
        // Update button text to show selection count
        if (selectedForComparison.size === 0) {
            compareBtn.textContent = 'Compare';
        } else if (selectedForComparison.size === 1) {
            compareBtn.textContent = 'Compare (1 selected)';
        } else {
            compareBtn.textContent = 'Compare (2 selected)';
        }
        
        // Show/hide checkboxes based on selection
        const checkboxes = document.querySelectorAll('.scenario-card .select-checkbox');
        if (selectedForComparison.size > 0) {
            checkboxes.forEach(cb => cb.style.display = 'block');
        } else {
            checkboxes.forEach(cb => cb.style.display = 'none');
        }
    }
}

function compareScenarios() {
    if (selectedForComparison.size !== 2) {
        showNotification('Please select exactly 2 scenarios to compare', 'warning');
        return;
    }
    
    const [id1, id2] = Array.from(selectedForComparison);
    const loadedScenarios = getScenarios();
    const scenario1 = loadedScenarios.find(s => s.id === id1);
    const scenario2 = loadedScenarios.find(s => s.id === id2);
    
    if (!scenario1 || !scenario2) {
        showNotification('Error loading scenarios for comparison', 'error');
        return;
    }
    
    // Show comparison modal
    const modal = document.getElementById('comparison-modal');
    const content = document.getElementById('comparison-content');
    const title = document.getElementById('comparison-title');
    
    title.textContent = `Comparing: ${scenario1.name} vs ${scenario2.name}`;
    
    // Generate comparison HTML
    content.innerHTML = generateComparisonHTML(scenario1, scenario2);
    
    modal.style.display = 'flex';
    
    // Add close handlers if not already added
    if (!modal.dataset.handlersAdded) {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
                // Clear selections
                selectedForComparison.clear();
                updateComparisonUI();
                renderScenarioList();
            };
        }
        
        // Close on outside click
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                selectedForComparison.clear();
                updateComparisonUI();
                renderScenarioList();
            }
        };
        
        modal.dataset.handlersAdded = 'true';
    }
}

function generateComparisonHTML(scenario1, scenario2) {
    // Compare basic stats
    const stats1 = scenario1.stats;
    const stats2 = scenario2.stats;
    
    // Compare cohorts
    const cohorts1 = scenario1.state.cohorts || [];
    const cohorts2 = scenario2.state.cohorts || [];
    
    // Compare FTE
    const fte1 = scenario1.state.trainerFTE || {};
    const fte2 = scenario2.state.trainerFTE || {};
    
    let html = '<div class="comparison-grid">';
    
    // Left column - Scenario 1
    html += `
        <div class="comparison-column">
            <h3>${scenario1.name}</h3>
            <div class="scenario-date" style="margin-bottom: 20px;">${new Date(scenario1.date).toLocaleString()}</div>
            
            <div class="comparison-section">
                <h4>Summary Statistics</h4>
                <div class="diff-item diff-unchanged">
                    <strong>Total Cohorts:</strong> ${stats1.totalCohorts}
                </div>
                <div class="diff-item diff-unchanged">
                    <strong>Total Trainees:</strong> ${stats1.totalTrainees}
                </div>
                <div class="diff-item diff-unchanged">
                    <strong>CP:</strong> ${stats1.cpCount} trainees
                </div>
                <div class="diff-item diff-unchanged">
                    <strong>FO:</strong> ${stats1.foCount} trainees
                </div>
                <div class="diff-item diff-unchanged">
                    <strong>CAD:</strong> ${stats1.cadCount} trainees
                </div>
            </div>
            
            <div class="comparison-section">
                <h4>Trainer FTE Summary</h4>
                ${generateFTESummary(fte1)}
            </div>
        </div>
    `;
    
    // Right column - Scenario 2
    html += `
        <div class="comparison-column">
            <h3>${scenario2.name}</h3>
            <div class="scenario-date" style="margin-bottom: 20px;">${new Date(scenario2.date).toLocaleString()}</div>
            
            <div class="comparison-section">
                <h4>Summary Statistics</h4>
                <div class="diff-item ${getDiffClass(stats1.totalCohorts, stats2.totalCohorts)}">
                    <strong>Total Cohorts:</strong> ${stats2.totalCohorts} 
                    ${getDiffIndicator(stats1.totalCohorts, stats2.totalCohorts)}
                </div>
                <div class="diff-item ${getDiffClass(stats1.totalTrainees, stats2.totalTrainees)}">
                    <strong>Total Trainees:</strong> ${stats2.totalTrainees}
                    ${getDiffIndicator(stats1.totalTrainees, stats2.totalTrainees)}
                </div>
                <div class="diff-item ${getDiffClass(stats1.cpCount, stats2.cpCount)}">
                    <strong>CP:</strong> ${stats2.cpCount} trainees
                    ${getDiffIndicator(stats1.cpCount, stats2.cpCount)}
                </div>
                <div class="diff-item ${getDiffClass(stats1.foCount, stats2.foCount)}">
                    <strong>FO:</strong> ${stats2.foCount} trainees
                    ${getDiffIndicator(stats1.foCount, stats2.foCount)}
                </div>
                <div class="diff-item ${getDiffClass(stats1.cadCount, stats2.cadCount)}">
                    <strong>CAD:</strong> ${stats2.cadCount} trainees
                    ${getDiffIndicator(stats1.cadCount, stats2.cadCount)}
                </div>
            </div>
            
            <div class="comparison-section">
                <h4>Trainer FTE Summary</h4>
                ${generateFTESummary(fte2, fte1)}
            </div>
        </div>
    `;
    
    html += '</div>';
    
    // Add detailed differences section
    html += `
        <div class="comparison-section" style="margin-top: 30px;">
            <h4>Detailed Differences</h4>
            ${generateDetailedDifferences(scenario1, scenario2)}
        </div>
    `;
    
    return html;
}

function getDiffClass(val1, val2) {
    if (val1 === val2) return 'diff-unchanged';
    if (val1 < val2) return 'diff-added';
    return 'diff-removed';
}

function getDiffIndicator(val1, val2) {
    const diff = val2 - val1;
    if (diff === 0) return '';
    if (diff > 0) return `<span style="color: green;">(+${diff})</span>`;
    return `<span style="color: red;">(${diff})</span>`;
}

function generateFTESummary(fte, compareFte = null) {
    let html = '';
    const categories = ['CATB', 'CATA', 'STP', 'RHS', 'LHS'];
    
    categories.forEach(cat => {
        let total = 0;
        let compareTotal = 0;
        
        Object.keys(fte).forEach(year => {
            total += (fte[year] && fte[year][cat]) || 0;
            if (compareFte) {
                compareTotal += (compareFte[year] && compareFte[year][cat]) || 0;
            }
        });
        
        const diffClass = compareFte ? getDiffClass(compareTotal, total) : 'diff-unchanged';
        html += `<div class="diff-item ${diffClass}">
            <strong>${cat}:</strong> ${total} FTE
            ${compareFte ? getDiffIndicator(compareTotal, total) : ''}
        </div>`;
    });
    
    return html;
}

function generateDetailedDifferences(scenario1, scenario2) {
    const cohorts1 = scenario1.state.cohorts || [];
    const cohorts2 = scenario2.state.cohorts || [];
    
    // Find cohorts only in scenario1
    const onlyIn1 = cohorts1.filter(c1 => 
        !cohorts2.some(c2 => 
            c2.year === c1.year && 
            c2.fortnight === c1.fortnight && 
            c2.pathwayId === c1.pathwayId
        )
    );
    
    // Find cohorts only in scenario2
    const onlyIn2 = cohorts2.filter(c2 => 
        !cohorts1.some(c1 => 
            c1.year === c2.year && 
            c1.fortnight === c2.fortnight && 
            c1.pathwayId === c2.pathwayId
        )
    );
    
    let html = '';
    
    if (onlyIn1.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += `<h5>Cohorts only in ${scenario1.name}:</h5>`;
        onlyIn1.forEach(cohort => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            html += `<div class="diff-item diff-removed">
                ${pathway ? pathway.name : 'Unknown'} - ${cohort.numTrainees} trainees 
                (${cohort.year} F${cohort.fortnight})
            </div>`;
        });
        html += '</div>';
    }
    
    if (onlyIn2.length > 0) {
        html += '<div style="margin-bottom: 20px;">';
        html += `<h5>Cohorts only in ${scenario2.name}:</h5>`;
        onlyIn2.forEach(cohort => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            html += `<div class="diff-item diff-added">
                ${pathway ? pathway.name : 'Unknown'} - ${cohort.numTrainees} trainees 
                (${cohort.year} F${cohort.fortnight})
            </div>`;
        });
        html += '</div>';
    }
    
    if (onlyIn1.length === 0 && onlyIn2.length === 0) {
        html += '<p style="color: #666;">No differences in cohort schedules</p>';
    }
    
    return html;
}

// Show import conflict dialog
function showImportConflictDialog(scenarioName) {
    return new Promise(resolve => {
        const modal = document.getElementById('import-rename-modal');
        const message = document.getElementById('import-conflict-message');
        const input = document.getElementById('import-rename-input');
        const renameBtn = document.getElementById('import-rename-btn');
        const overwriteBtn = document.getElementById('import-overwrite-btn');
        const skipBtn = document.getElementById('import-skip-btn');
        
        message.textContent = `A scenario named "${scenarioName}" already exists.`;
        input.value = scenarioName;
        modal.style.display = 'flex';
        
        // Focus and select the input
        setTimeout(() => {
            input.focus();
            input.select();
        }, 100);
        
        const cleanup = () => {
            modal.style.display = 'none';
            renameBtn.onclick = null;
            overwriteBtn.onclick = null;
            skipBtn.onclick = null;
        };
        
        renameBtn.onclick = () => {
            const newName = input.value.trim();
            if (newName && newName !== scenarioName) {
                cleanup();
                resolve('rename:' + newName);
            }
        };
        
        overwriteBtn.onclick = () => {
            cleanup();
            resolve('overwrite');
        };
        
        skipBtn.onclick = () => {
            cleanup();
            resolve('skip');
        };
        
        // Allow Enter to rename
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                renameBtn.click();
            }
        };
    });
}

// Dark Mode Functions
function initDarkMode() {
    // Remove loading class from html
    document.documentElement.classList.remove('dark-mode-loading');
    
    // Check for saved dark mode preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    // Set up dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        // Show the toggle now that dark mode is initialized
        darkModeToggle.classList.add('show');
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeIcon(isDarkMode);
    
    // Update charts if dashboard is active
    if (dashboardView && dashboardView.classList.contains('active')) {
        // Charts need to be recreated for proper theming
        setTimeout(() => {
            updateCharts();
        }, 100);
    }
}

function updateDarkModeIcon(isDarkMode) {
    const icon = document.querySelector('.dark-mode-icon');
    if (icon) {
        icon.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

// Dashboard Functions
let demandChart = null;
let distributionChart = null;

function updateDashboard() {
    updateMetrics();
    updateCharts();
    updatePipeline();
    updateAlerts();
}

function updateMetrics() {
    // Calculate total trainees in training
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentFortnight = (currentMonth * 2) + (currentDate.getDate() <= 14 ? 1 : 2);
    
    let totalTrainees = 0;
    let upcomingCompletions = 0;
    
    activeCohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        const duration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
        let endFortnight = cohort.startFortnight + duration - 1;
        let endYear = cohort.startYear;
        
        while (endFortnight > FORTNIGHTS_PER_YEAR) {
            endFortnight -= FORTNIGHTS_PER_YEAR;
            endYear++;
        }
        
        // Check if cohort is currently in training
        const startPassed = cohort.startYear < currentYear || 
            (cohort.startYear === currentYear && cohort.startFortnight <= currentFortnight);
        const endNotReached = endYear > currentYear || 
            (endYear === currentYear && endFortnight >= currentFortnight);
            
        if (startPassed && endNotReached) {
            totalTrainees += cohort.numTrainees;
        }
        
        // Check if completing in next 3 months (6 fortnights)
        const monthsAhead = 6;
        let futureYear = currentYear;
        let futureFortnight = currentFortnight + monthsAhead;
        while (futureFortnight > FORTNIGHTS_PER_YEAR) {
            futureFortnight -= FORTNIGHTS_PER_YEAR;
            futureYear++;
        }
        
        const completingSoon = (endYear === currentYear && endFortnight > currentFortnight && endFortnight <= currentFortnight + monthsAhead) ||
            (endYear === futureYear && endFortnight <= futureFortnight);
            
        if (completingSoon) {
            upcomingCompletions += cohort.numTrainees;
        }
    });
    
    // Calculate trainer utilization
    const { demand } = calculateDemand();
    const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
        sum + (trainerFTE[currentYear]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR;
    const currentDemand = demand[currentYear]?.[currentFortnight]?.total || 0;
    const utilization = totalSupply > 0 ? Math.round((currentDemand / totalSupply) * 100) : 0;
    
    // Count capacity warnings
    let capacityWarnings = 0;
    for (let year in demand) {
        for (let fn in demand[year]) {
            const supply = totalSupply;
            const demandValue = demand[year][fn].total;
            if (demandValue > supply) {
                capacityWarnings++;
            }
        }
    }
    
    // Update DOM
    document.getElementById('total-trainees').textContent = totalTrainees;
    document.getElementById('trainer-utilization').textContent = utilization + '%';
    document.getElementById('upcoming-completions').textContent = upcomingCompletions;
    document.getElementById('capacity-warnings').textContent = capacityWarnings;
}

function updateCharts() {
    updateDemandChart();
    updateDistributionChart();
}

function updateDemandChart() {
    const ctx = document.getElementById('demand-chart').getContext('2d');
    const { demand } = calculateDemand();
    
    // Prepare data for the next 12 months
    const labels = [];
    const demandData = [];
    const supplyData = [];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    for (let i = 0; i < 12; i++) {
        let month = currentMonth + i;
        let year = currentYear;
        if (month >= 12) {
            month -= 12;
            year++;
        }
        
        labels.push(`${MONTHS[month]} ${year}`);
        
        // Calculate average demand for the month (2 fortnights)
        const fn1 = (month * 2) + 1;
        const fn2 = (month * 2) + 2;
        const monthDemand = ((demand[year]?.[fn1]?.total || 0) + 
                            (demand[year]?.[fn2]?.total || 0)) / 2;
        demandData.push(monthDemand);
        
        // Calculate supply
        const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
            sum + (trainerFTE[year]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR;
        supplyData.push(totalSupply);
    }
    
    if (demandChart) {
        demandChart.destroy();
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#666';
    const gridColor = isDarkMode ? '#444' : '#e0e0e0';
    
    demandChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Trainer Demand',
                data: demandData,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.1
            }, {
                label: 'Trainer Supply',
                data: supplyData,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'FTE',
                        color: textColor
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function updateDistributionChart() {
    const canvas = document.getElementById('distribution-chart');
    if (canvas) {
        // Legacy - redirect to supply-demand overview
        updateSupplyDemandOverview();
        return;
    }
    
    updateSupplyDemandOverview();
}

let supplyDemandOverviewChart = null;

function updateSupplyDemandOverview() {
    const ctx = document.getElementById('supply-demand-overview')?.getContext('2d');
    if (!ctx) return;
    
    const { demand, crossLocationDemand } = calculateDemand();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Prepare data for the next 12 months
    const labels = [];
    const supplyData = [];
    const localDemandData = [];
    const crossLocationData = [];
    
    for (let i = 0; i < 12; i++) {
        let month = currentMonth + i;
        let year = currentYear;
        if (month >= 12) {
            month -= 12;
            year++;
        }
        
        labels.push(`${MONTHS[month].substr(0, 3)} ${year}`);
        
        // Calculate monthly averages (2 fortnights per month)
        const fn1 = (month * 2) + 1;
        const fn2 = (month * 2) + 2;
        
        // Total supply from current location
        const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? locationData[currentLocation].trainerFTE : trainerFTE;
        const monthlySupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
            sum + (locationFTE[year]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR; // Use fortnightly FTE capacity
        
        // Get demand for current location
        const totalDemand1 = demand[year]?.[fn1]?.total || 0;
        const totalDemand2 = demand[year]?.[fn2]?.total || 0;
        
        // Cross-location demand is demand from other location using current location's trainers
        const crossDemand1 = crossLocationDemand[year]?.[fn1]?.[currentLocation]?.total || 0;
        const crossDemand2 = crossLocationDemand[year]?.[fn2]?.[currentLocation]?.total || 0;
        
        // Local demand is total demand minus cross-location demand
        // Total demand already includes cross-location, so subtract to get just local
        const localDemand = ((totalDemand1 - crossDemand1 + totalDemand2 - crossDemand2) / 2);
        const crossDemand = (crossDemand1 + crossDemand2) / 2;
        
        supplyData.push(monthlySupply);
        localDemandData.push(localDemand);
        crossLocationData.push(crossDemand); // Just the cross-location portion
    }
    
    if (supplyDemandOverviewChart) {
        supplyDemandOverviewChart.destroy();
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#666';
    const gridColor = isDarkMode ? '#444' : '#e0e0e0';
    
    supplyDemandOverviewChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Trainer Supply',
                data: supplyData,
                borderColor: '#2ecc71',
                backgroundColor: 'transparent',
                borderWidth: 3,
                borderDash: [5, 5],
                tension: 0.1,
                order: 0
            }, {
                label: 'Local Demand',
                data: localDemandData,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.3)',
                fill: 'origin',
                tension: 0.3,
                order: 2
            }, {
                label: 'Cross-Location Demand',
                data: crossLocationData,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.3)',
                fill: '+1',
                tension: 0.3,
                order: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        footer: function(tooltipItems) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            // Get data from the chart's datasets
                            const chart = tooltipItems[0].chart;
                            const supply = chart.data.datasets[2].data[dataIndex] || 0; // Trainer Supply
                            const localDemand = chart.data.datasets[0].data[dataIndex] || 0; // AU Demand
                            const crossDemand = chart.data.datasets[1].data[dataIndex] || 0; // NZ Training in AU
                            const totalDemand = localDemand + crossDemand;
                            const balance = supply - totalDemand;
                            
                            return [
                                `Total Demand: ${totalDemand.toFixed(1)} FTE`,
                                `${balance >= 0 ? 'Surplus' : 'Deficit'}: ${Math.abs(balance).toFixed(1)} FTE`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'FTE',
                        color: textColor
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function updatePipeline() {
    const timeline = document.getElementById('pipeline-timeline');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentFortnight = (currentMonth * 2) + (currentDate.getDate() <= 14 ? 1 : 2);
    
    // Group cohorts by start month
    const pipeline = {};
    
    activeCohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        const monthKey = `${MONTHS[Math.floor((cohort.startFortnight - 1) / 2)]} ${cohort.startYear}`;
        if (!pipeline[monthKey]) {
            pipeline[monthKey] = [];
        }
        
        pipeline[monthKey].push({
            pathway: pathway.name,
            type: pathway.type,
            trainees: cohort.numTrainees
        });
    });
    
    // Sort pipeline entries chronologically
    const sortedPipeline = Object.entries(pipeline).sort((a, b) => {
        const [monthA, yearA] = a[0].split(' ');
        const [monthB, yearB] = b[0].split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateA - dateB;
    });
    
    let html = '<div class="pipeline-grid">';
    sortedPipeline.forEach(([month, cohorts]) => {
        html += `
            <div class="pipeline-month">
                <h4>${month}</h4>
                <div class="pipeline-cohorts">
        `;
        cohorts.forEach(cohort => {
            html += `
                <div class="pipeline-cohort ${cohort.type.toLowerCase()}">
                    <span class="cohort-type">${cohort.type}</span>
                    <span class="cohort-count">${cohort.trainees}</span>
                    <span class="cohort-pathway">${cohort.pathway}</span>
                </div>
            `;
        });
        html += '</div></div>';
    });
    html += '</div>';
    
    timeline.innerHTML = html;
}

function updateAlerts() {
    const container = document.getElementById('alerts-container');
    const alerts = [];
    
    // Check for capacity issues
    const { demand } = calculateDemand();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentFortnight = (currentMonth * 2) + (currentDate.getDate() <= 14 ? 1 : 2);
    
    // Check next 6 months for capacity issues
    for (let i = 0; i < 12; i++) {
        let checkFn = currentFortnight + i;
        let checkYear = currentYear;
        while (checkFn > FORTNIGHTS_PER_YEAR) {
            checkFn -= FORTNIGHTS_PER_YEAR;
            checkYear++;
        }
        
        const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
            sum + (trainerFTE[checkYear]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR;
        const demandValue = demand[checkYear]?.[checkFn]?.total || 0;
        
        if (demandValue > totalSupply) {
            const deficit = demandValue - totalSupply;
            alerts.push({
                type: 'danger',
                message: `Trainer deficit of ${deficit.toFixed(1)} FTE in ${MONTHS[Math.floor((checkFn - 1) / 2)]} ${checkYear}`
            });
        }
    }
    
    // Check for upcoming large cohorts
    activeCohorts.forEach(cohort => {
        if (cohort.numTrainees >= 10) {
            const startsSoon = cohort.startYear === currentYear && 
                cohort.startFortnight >= currentFortnight && 
                cohort.startFortnight <= currentFortnight + 2;
            
            if (startsSoon) {
                alerts.push({
                    type: 'warning',
                    message: `Large cohort of ${cohort.numTrainees} trainees starting in ${MONTHS[Math.floor((cohort.startFortnight - 1) / 2)]}`
                });
            }
        }
    });
    
    if (alerts.length === 0) {
        alerts.push({
            type: 'info',
            message: 'No immediate capacity concerns detected'
        });
    }
    
    container.innerHTML = alerts.map(alert => `
        <div class="alert-item alert-${alert.type}">
            ${alert.type === 'danger' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
            ${alert.message}
        </div>
    `).join('');
}

// Dashboard V2 Functions
function updateDashboardV2() {
    // console.log('Updating Dashboard V2', {
    //     activeCohorts: activeCohorts.length,
    //     currentLocation: currentLocation,
    //     pathways: pathways.length,
    //     trainerFTE: Object.keys(trainerFTE).length
    // });
    
    updateMetricsV2();
    updateChartsV2();
    updatePipelineV2();
    updateAlertsV2();
    // Enhanced visualizations
    updateTrainerHeatmap();
    updateSupplyDemandChart();
    updatePhaseBreakdown();
    updateWorkloadChart();
    updateDetailCards();
}

function updateMetricsV2() {
    const trends = calculateMetricTrends();
    
    // Update values
    document.getElementById('total-trainees-v2').textContent = trends.totalTrainees.current;
    document.getElementById('trainer-utilization-v2').textContent = trends.utilization.current + '%';
    document.getElementById('upcoming-completions-v2').textContent = trends.upcomingCompletions.current;
    document.getElementById('capacity-warnings-v2').textContent = trends.capacityWarnings.current;
    
    // Update trends
    updateTrendDisplay('total-trainees', trends.totalTrainees);
    updateTrendDisplay('trainer-utilization', trends.utilization);
    updateTrendDisplay('upcoming-completions', trends.upcomingCompletions);
    updateTrendDisplay('capacity-warnings', trends.capacityWarnings);
    
    // Update details
    document.getElementById('total-trainees-detail').textContent = 
        `${trends.totalTrainees.change >= 0 ? '+' : ''}${trends.totalTrainees.change} from last month`;
    document.getElementById('trainer-utilization-detail').textContent = 
        `${trends.utilization.change >= 0 ? '+' : ''}${trends.utilization.change}% from last month`;
    document.getElementById('upcoming-completions-detail').textContent = 
        `${trends.upcomingCompletions.change >= 0 ? '+' : ''}${trends.upcomingCompletions.change} from last month`;
    document.getElementById('capacity-warnings-detail').textContent = 
        `${trends.capacityWarnings.change >= 0 ? '+' : ''}${trends.capacityWarnings.change} from last month`;
}

function updateTrendDisplay(metricName, trend) {
    const trendElement = document.getElementById(`${metricName}-trend`);
    if (!trendElement) return;
    
    const isPositiveGood = metricName !== 'capacity-warnings';
    let trendClass = 'stable';
    let arrow = '→';
    
    if (trend.change > 0) {
        trendClass = isPositiveGood ? 'up' : 'down';
        arrow = '↑';
    } else if (trend.change < 0) {
        trendClass = isPositiveGood ? 'down' : 'up';
        arrow = '↓';
    }
    
    trendElement.className = `metric-trend ${trendClass}`;
    trendElement.innerHTML = `<span class="trend-arrow">${arrow}</span> ${Math.abs(trend.percentage)}%`;
}

function updateChartsV2() {
    updateDemandChartV2();
    updateDistributionChartV2();
}

function updateDemandChartV2() {
    const ctx = document.getElementById('demand-chart-v2')?.getContext('2d');
    if (!ctx) return;
    
    const { demand } = calculateDemand();
    
    // Prepare data for the next 12 months
    const labels = [];
    const demandData = [];
    const supplyData = [];
    
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + (dashboardViewOffset[currentLocation] || 0));
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Get location-specific FTE
    const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? 
        locationData[currentLocation].trainerFTE : trainerFTE;
    
    for (let i = 0; i < 12; i++) {
        let month = currentMonth + i;
        let year = currentYear;
        if (month >= 12) {
            month -= 12;
            year++;
        }
        
        labels.push(`${MONTHS[month]} ${year}`);
        
        // Calculate average demand for the month (2 fortnights)
        const fn1 = (month * 2) + 1;
        const fn2 = (month * 2) + 2;
        const monthDemand = ((demand[year]?.[fn1]?.total || 0) + 
                            (demand[year]?.[fn2]?.total || 0)) / 2;
        demandData.push(monthDemand);
        
        // Calculate supply using location-specific FTE
        const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
            sum + (locationFTE[year]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR;
        supplyData.push(totalSupply);
    }
    
    // Update existing chart if possible, otherwise destroy and recreate
    if (demandChartV2) {
        // Try to update data instead of destroying
        try {
            demandChartV2.data.labels = labels;
            demandChartV2.data.datasets[0].data = demandData;
            demandChartV2.data.datasets[1].data = supplyData;
            demandChartV2.update('none'); // No animation for smooth navigation
            return; // Exit if update successful
        } catch (e) {
            // If update fails, destroy and recreate
            demandChartV2.destroy();
        }
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#666';
    const gridColor = isDarkMode ? '#444' : '#e0e0e0';
    
    demandChartV2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Trainer Demand',
                data: demandData,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.1,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'Trainer Supply',
                data: supplyData,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderDash: [5, 5],
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            if (context.datasetIndex === 0) { // Demand line
                                const supply = supplyData[context.dataIndex];
                                const demand = context.parsed.y;
                                const utilization = supply > 0 ? (demand / supply * 100).toFixed(1) : 0;
                                return `Utilization: ${utilization}%`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'FTE',
                        color: textColor
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            onClick: function(event, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const label = labels[index];
                    showNotification(`Clicked on ${label}`, 'info');
                }
            }
        }
    });
}

function updateDistributionChartV2() {
    const canvas = document.getElementById('distribution-chart-v2');
    if (canvas) {
        // Legacy - redirect to supply-demand overview v2
        updateSupplyDemandOverviewV2();
        return;
    }
    
    updateSupplyDemandOverviewV2();
}

let supplyDemandOverviewChartV2 = null;

function updateSupplyDemandOverviewV2() {
    const ctx = document.getElementById('supply-demand-overview-v2')?.getContext('2d');
    if (!ctx) return;
    
    const { demand, crossLocationDemand } = calculateDemand();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + (dashboardViewOffset[currentLocation] || 0));
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Prepare data for the next 12 months
    const labels = [];
    const supplyData = [];
    const localDemandData = [];
    const crossLocationData = [];
    const totalDemandData = []; // For stacking
    const otherLocationLabel = currentLocation === 'AU' ? 'NZ' : 'AU';
    
    for (let i = 0; i < 12; i++) {
        let month = currentMonth + i;
        let year = currentYear;
        if (month >= 12) {
            month -= 12;
            year++;
        }
        
        labels.push(`${MONTHS[month].substr(0, 3)} ${year}`);
        
        // Calculate monthly averages (2 fortnights per month)
        const fn1 = (month * 2) + 1;
        const fn2 = (month * 2) + 2;
        
        // Total supply from current location
        const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? locationData[currentLocation].trainerFTE : trainerFTE;
        const monthlySupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
            sum + (locationFTE[year]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR; // Use fortnightly FTE capacity
        
        // Get demand for current location
        const totalDemand1 = demand[year]?.[fn1]?.total || 0;
        const totalDemand2 = demand[year]?.[fn2]?.total || 0;
        const totalMonthlyDemand = (totalDemand1 + totalDemand2) / 2;
        
        // Get cross-location demand (trainees from other location using our trainers)
        const crossLocationPortion1 = demand[year]?.[fn1]?.crossLocation || {};
        const crossLocationPortion2 = demand[year]?.[fn2]?.crossLocation || {};
        
        // Sum up cross-location demand across all training types
        let crossDemand1 = 0;
        let crossDemand2 = 0;
        Object.values(crossLocationPortion1).forEach(value => crossDemand1 += value);
        Object.values(crossLocationPortion2).forEach(value => crossDemand2 += value);
        const crossDemand = (crossDemand1 + crossDemand2) / 2;
        
        // Local demand is total minus cross-location
        const localDemand = totalMonthlyDemand - crossDemand;
        
        // Debug cross-location calculation
        if (i === 0 && (crossDemand1 > 0 || crossDemand2 > 0)) {
            // console.log(`Cross-location debug for ${labels[i]}:`);
            // console.log(`  crossLocationPortion1:`, crossLocationPortion1);
            // console.log(`  crossLocationPortion2:`, crossLocationPortion2);
            // console.log(`  crossDemand1:`, crossDemand1);
            // console.log(`  crossDemand2:`, crossDemand2);
            // console.log(`  Average crossDemand:`, crossDemand);
        }
        
        supplyData.push(monthlySupply);
        localDemandData.push(localDemand);
        crossLocationData.push(crossDemand); // Just the cross-location portion
        totalDemandData.push(totalMonthlyDemand); // Total for reference
        
        // Debug logging for first month
        if (i === 0) {
            // console.log(`Supply/Demand Overview Debug for ${labels[i]}:`);
            // console.log(`  Year:`, year);
            // console.log(`  Location FTE for year:`, locationFTE[year]);
            // console.log(`  Annual FTE total:`, TRAINER_CATEGORIES.reduce((sum, cat) => sum + (locationFTE[year]?.[cat] || 0), 0));
            // console.log(`  Monthly Supply (fortnightly average):`, monthlySupply);
            // console.log(`  Local Demand:`, localDemand);
            // console.log(`  Cross-location Demand:`, crossDemand);
            // console.log(`  Total Demand:`, localDemand + crossDemand);
            // console.log(`  Raw demand data fn1:`, demand[year]?.[fn1]);
            // console.log(`  Raw demand data fn2:`, demand[year]?.[fn2]);
        }
    }
    
    // Debug the data arrays
    // console.log('Chart Data Debug:');
    // console.log('  Supply data:', supplyData.slice(0, 3));
    // console.log('  Local demand data:', localDemandData.slice(0, 3));
    // console.log('  Cross-location data:', crossLocationData.slice(0, 3));
    // console.log('  Labels:', labels.slice(0, 3));
    
    // Update existing chart if possible, otherwise destroy and recreate
    if (supplyDemandOverviewChartV2) {
        try {
            supplyDemandOverviewChartV2.data.labels = labels;
            // Dataset order must match the order when chart was created:
            // 0: localDemandData (AU Demand)
            // 1: crossLocationData (NZ Training in AU)  
            // 2: supplyData (Trainer Supply)
            supplyDemandOverviewChartV2.data.datasets[0].data = localDemandData;
            supplyDemandOverviewChartV2.data.datasets[1].data = crossLocationData;
            supplyDemandOverviewChartV2.data.datasets[2].data = supplyData;
            supplyDemandOverviewChartV2.update('none'); // No animation for smooth navigation
            return; // Exit if update successful
        } catch (e) {
            // If update fails, destroy and recreate
            supplyDemandOverviewChartV2.destroy();
        }
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#666';
    const gridColor = isDarkMode ? '#444' : '#e0e0e0';
    
    supplyDemandOverviewChartV2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${currentLocation} Demand`,
                data: localDemandData,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.3)',
                fill: true,
                stack: 'demand',
                borderWidth: 2,
                tension: 0.3,
                order: 2
            }, {
                label: `${otherLocationLabel} Training in ${currentLocation}`,
                data: crossLocationData,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.3)',
                fill: true,
                stack: 'demand',
                borderWidth: 2,
                tension: 0.3,
                order: 1
            }, {
                label: 'Trainer Supply',
                data: supplyData,
                borderColor: '#2ecc71',
                backgroundColor: 'transparent',
                borderWidth: 3,
                borderDash: [5, 5],
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.1,
                fill: false,
                stack: 'supply',
                order: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        footer: function(tooltipItems) {
                            const dataIndex = tooltipItems[0].dataIndex;
                            // Get data from the chart's datasets
                            const chart = tooltipItems[0].chart;
                            const supply = chart.data.datasets[2].data[dataIndex] || 0; // Trainer Supply
                            const localDemand = chart.data.datasets[0].data[dataIndex] || 0; // AU Demand
                            const crossDemand = chart.data.datasets[1].data[dataIndex] || 0; // NZ Training in AU
                            const totalDemand = localDemand + crossDemand;
                            const balance = supply - totalDemand;
                            
                            return [
                                `Total Demand: ${totalDemand.toFixed(1)} FTE`,
                                `${balance >= 0 ? 'Surplus' : 'Deficit'}: ${Math.abs(balance).toFixed(1)} FTE`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'FTE',
                        color: textColor
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

function updatePipelineV2() {
    const container = document.getElementById('pipeline-timeline-v2');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentFortnight = (currentMonth * 2) + (currentDate.getDate() <= 14 ? 1 : 2);
    
    // Get filter value
    const filter = document.getElementById('pipeline-filter')?.value || 'all';
    
    // Process cohorts with progress information
    const pipelineData = [];
    
    activeCohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        const duration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
        const startDate = new Date(cohort.startYear, Math.floor((cohort.startFortnight - 1) / 2), 
            cohort.startFortnight % 2 === 1 ? 1 : 15);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + (duration * 14)); // 14 days per fortnight
        
        const now = new Date();
        const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        const elapsedDays = (now - startDate) / (1000 * 60 * 60 * 24);
        const remainingDays = Math.max(0, (endDate - now) / (1000 * 60 * 60 * 24));
        const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
        
        // Determine status
        let status = 'in-progress';
        if (progress === 0) status = 'starting-soon';
        if (progress === 100) status = 'completed';
        if (remainingDays <= 30 && progress < 100) status = 'completing-soon';
        
        // Apply filter
        if (filter !== 'all' && status !== filter) return;
        
        pipelineData.push({
            cohort,
            pathway,
            progress,
            remainingDays: Math.ceil(remainingDays),
            status,
            startDate,
            endDate
        });
    });
    
    // Sort by status and remaining days
    pipelineData.sort((a, b) => {
        if (a.status === 'completing-soon' && b.status !== 'completing-soon') return -1;
        if (b.status === 'completing-soon' && a.status !== 'completing-soon') return 1;
        return a.remainingDays - b.remainingDays;
    });
    
    // Generate HTML
    let html = '';
    pipelineData.forEach(item => {
        const urgentClass = item.remainingDays <= 7 ? 'urgent' : '';
        const progressClass = item.status;
        
        html += `
            <div class="pipeline-cohort-enhanced">
                <div class="pipeline-cohort-progress">
                    <div class="cohort-info">
                        <strong>${item.pathway.type} Training</strong> - ${item.cohort.numTrainees} trainees
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar ${progressClass}" style="width: ${item.progress}%"></div>
                    </div>
                    <div class="progress-percentage">${Math.round(item.progress)}%</div>
                </div>
                <div class="pipeline-cohort-details">
                    <span>${item.pathway.name}</span>
                    <span class="separator">•</span>
                    <span>Started ${MONTHS[item.startDate.getMonth()]} ${item.startDate.getFullYear()}</span>
                    <span class="separator">•</span>
                    <span class="days-remaining ${urgentClass}">
                        ${item.status === 'completed' ? 'Completed' : 
                          item.status === 'starting-soon' ? 'Starting soon' :
                          `${item.remainingDays} days remaining`}
                    </span>
                </div>
            </div>
        `;
    });
    
    if (pipelineData.length === 0) {
        html = '<div style="text-align: center; color: #999; padding: 20px;">No cohorts match the selected filter</div>';
    }
    
    container.innerHTML = html;
}

function updateAlertsV2() {
    const container = document.getElementById('alerts-container-v2');
    const alertBadge = document.getElementById('alert-count');
    const filter = document.getElementById('alert-filter')?.value || 'all';
    
    const alerts = [];
    
    // Check for capacity issues
    const { demand } = calculateDemand();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentFortnight = (currentMonth * 2) + (currentDate.getDate() <= 14 ? 1 : 2);
    
    // Check next 6 months for capacity issues
    for (let i = 0; i < 12; i++) {
        let checkFn = currentFortnight + i;
        let checkYear = currentYear;
        while (checkFn > FORTNIGHTS_PER_YEAR) {
            checkFn -= FORTNIGHTS_PER_YEAR;
            checkYear++;
        }
        
        const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
            sum + (trainerFTE[checkYear]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR;
        const demandValue = demand[checkYear]?.[checkFn]?.total || 0;
        
        if (demandValue > totalSupply) {
            const deficit = demandValue - totalSupply;
            alerts.push({
                id: `deficit-${checkYear}-${checkFn}`,
                type: 'danger',
                icon: '🚨',
                message: `Trainer deficit of ${deficit.toFixed(1)} FTE in ${MONTHS[Math.floor((checkFn - 1) / 2)]} ${checkYear}`,
                details: `Demand: ${demandValue.toFixed(1)} FTE, Supply: ${totalSupply.toFixed(1)} FTE`
            });
        }
    }
    
    // Check for upcoming large cohorts
    activeCohorts.forEach(cohort => {
        if (cohort.numTrainees >= 10) {
            const startsSoon = cohort.startYear === currentYear && 
                cohort.startFortnight >= currentFortnight && 
                cohort.startFortnight <= currentFortnight + 2;
            
            if (startsSoon) {
                alerts.push({
                    id: `large-cohort-${cohort.id}`,
                    type: 'warning',
                    icon: '⚠️',
                    message: `Large cohort of ${cohort.numTrainees} trainees starting in ${MONTHS[Math.floor((cohort.startFortnight - 1) / 2)]}`,
                    details: `Consider splitting into smaller groups for better trainer allocation`
                });
            }
        }
    });
    
    if (alerts.length === 0) {
        alerts.push({
            id: 'no-issues',
            type: 'info',
            icon: 'ℹ️',
            message: 'No immediate capacity concerns detected',
            details: 'All trainer allocations are within capacity'
        });
    }
    
    // Filter alerts
    const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);
    
    // Update badge count (excluding acknowledged)
    const unacknowledgedCount = alerts.filter(a => !acknowledgedAlerts.has(a.id) && a.type !== 'info').length;
    alertBadge.textContent = unacknowledgedCount;
    alertBadge.style.display = unacknowledgedCount > 0 ? 'inline-block' : 'none';
    
    // Generate HTML
    container.innerHTML = filteredAlerts.map(alert => {
        const isAcknowledged = acknowledgedAlerts.has(alert.id);
        return `
            <div class="alert-item-enhanced alert-${alert.type} ${isAcknowledged ? 'acknowledged' : ''}" data-alert-id="${alert.id}">
                <div class="alert-content">
                    <div style="font-size: 1.2em; margin-bottom: 5px;">
                        ${alert.icon} ${alert.message}
                    </div>
                    <div style="font-size: 0.9em; color: #666;">
                        ${alert.details}
                    </div>
                </div>
                ${alert.type !== 'info' ? `
                    <div class="alert-actions">
                        ${!isAcknowledged ? `<button class="btn-acknowledge" onclick="acknowledgeAlert('${alert.id}')">Acknowledge</button>` : ''}
                        <button class="btn-dismiss" onclick="dismissAlert('${alert.id}')">Dismiss</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Alert management functions
function acknowledgeAlert(alertId) {
    acknowledgedAlerts.add(alertId);
    localStorage.setItem('acknowledgedAlerts', JSON.stringify(Array.from(acknowledgedAlerts)));
    updateAlertsV2();
}

function dismissAlert(alertId) {
    const element = document.querySelector(`[data-alert-id="${alertId}"]`);
    if (element) {
        element.style.transition = 'opacity 0.3s, transform 0.3s';
        element.style.opacity = '0';
        element.style.transform = 'translateX(100%)';
        setTimeout(() => {
            element.remove();
        }, 300);
    }
}

// Export functions
function exportChart(chartId) {
    const chart = chartId === 'demand-v2' ? demandChartV2 : distributionChartV2;
    if (!chart) return;
    
    const canvas = chart.canvas;
    canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chartId}-${new Date().toISOString().split('T')[0]}.png`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

function exportDashboard() {
    // Create CSV data
    const trends = calculateMetricTrends();
    const currentDate = new Date().toISOString().split('T')[0];
    
    let csvContent = "Pilot Trainer Dashboard Export\n";
    csvContent += `Date: ${currentDate}\n`;
    csvContent += `Location: ${currentLocation}\n\n`;
    
    csvContent += "Key Metrics\n";
    csvContent += "Metric,Current Value,Change,Percentage\n";
    csvContent += `Total Trainees,${trends.totalTrainees.current},${trends.totalTrainees.change},${trends.totalTrainees.percentage}%\n`;
    csvContent += `Trainer Utilization,${trends.utilization.current}%,${trends.utilization.change}%,${trends.utilization.percentage}%\n`;
    csvContent += `Upcoming Completions,${trends.upcomingCompletions.current},${trends.upcomingCompletions.change},${trends.upcomingCompletions.percentage}%\n`;
    csvContent += `Capacity Warnings,${trends.capacityWarnings.current},${trends.capacityWarnings.change},${trends.capacityWarnings.percentage}%\n\n`;
    
    // Add demand data
    const { demand } = calculateDemand();
    const currentYear = new Date().getFullYear();
    csvContent += "Monthly Trainer Demand\n";
    csvContent += "Month,Demand (FTE),Supply (FTE),Utilization %\n";
    
    for (let i = 0; i < 12; i++) {
        let month = new Date().getMonth() + i;
        let year = currentYear;
        if (month >= 12) {
            month -= 12;
            year++;
        }
        
        const fn1 = (month * 2) + 1;
        const fn2 = (month * 2) + 2;
        const monthDemand = ((demand[year]?.[fn1]?.total || 0) + (demand[year]?.[fn2]?.total || 0)) / 2;
        const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
            sum + (trainerFTE[year]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR;
        const utilization = totalSupply > 0 ? (monthDemand / totalSupply * 100).toFixed(1) : 0;
        
        csvContent += `${MONTHS[month]} ${year},${monthDemand.toFixed(1)},${totalSupply.toFixed(1)},${utilization}\n`;
    }
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${currentDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Dashboard exported successfully', 'success');
}

// New Dashboard Visualization Functions
function updateTrainerHeatmap() {
    const container = document.getElementById('trainer-heatmap');
    if (!container) return;
    
    const { demand } = calculateDemand();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + (dashboardViewOffset[currentLocation] || 0));
    const currentYear = currentDate.getFullYear();
    
    // console.log('Heat map data:', {
    //     demand: demand,
    //     currentYear: currentYear,
    //     trainerFTE: trainerFTE[currentYear],
    //     hasData: demand && demand[currentYear]
    // });
    
    // Check if we have any data to display
    const hasCurrentYearData = demand && demand[currentYear] && Object.keys(demand[currentYear]).length > 0;
    const hasAnyData = demand && Object.keys(demand).some(year => 
        Object.keys(demand[year] || {}).length > 0
    );
    
    if (!hasAnyData) {
        container.innerHTML = `
            <div style="text-align: center; color: #999; padding: 40px;">
                No training demand data available<br>
                <small>Load a scenario or add cohorts to see utilization heat map</small>
            </div>
        `;
        return;
    }
    
    // Create heat map grid
    let html = '<div class="heatmap-label"></div>'; // Empty corner cell
    
    // Month headers for the 12-month view window
    const currentMonth = currentDate.getMonth();
    for (let i = 0; i < 12; i++) {
        let month = currentMonth + i;
        let year = currentYear;
        if (month >= 12) {
            month -= 12;
            year++;
        }
        html += `<div class="heatmap-month">${MONTHS[month].substr(0, 3)}</div>`;
    }
    
    // For each trainer category
    TRAINER_CATEGORIES.forEach(category => {
        html += `<div class="heatmap-label">${category}</div>`;
        
        // For each month in the 12-month view window
        const currentMonth = currentDate.getMonth();
        for (let i = 0; i < 12; i++) {
            let month = currentMonth + i;
            let year = currentYear;
            if (month >= 12) {
                month -= 12;
                year++;
            }
            
            const fn1 = (month * 2) + 1;
            const fn2 = (month * 2) + 2;
            
            // Get demand for this category and month
            const categoryDemand = getCategoryDemand(demand, year, [fn1, fn2], category);
            const categorySupply = (trainerFTE[year]?.[category] || 0) / FORTNIGHTS_PER_YEAR;
            const utilization = categorySupply > 0 ? (categoryDemand / categorySupply) * 100 : 0;
            
            // Determine color based on utilization
            let bgColor = '#f5f5f5'; // Gray for no data
            let textColor = '#999';
            let displayText = '-';
            
            if (categorySupply > 0 && (categoryDemand > 0 || utilization === 0)) {
                displayText = `${utilization.toFixed(0)}%`;
                if (utilization > 100) {
                    bgColor = '#ffebee'; // Light red
                    textColor = '#c62828';
                } else if (utilization > 80) {
                    bgColor = '#fff8e1'; // Light amber
                    textColor = '#f57f17';
                } else if (utilization > 60) {
                    bgColor = '#e3f2fd'; // Light blue
                    textColor = '#1565c0';
                } else {
                    bgColor = '#e8f5e9'; // Light green
                    textColor = '#2e7d32';
                }
            }
            
            html += `<div class="heatmap-cell" style="background: ${bgColor}; color: ${textColor};" 
                     title="${category} - ${MONTHS[month]}: ${categorySupply > 0 ? utilization.toFixed(1) + '% utilized' : 'No supply data'}">
                     ${displayText}
                     </div>`;
        }
    });
    
    container.innerHTML = html;
}

function getCategoryDemand(demand, year, fortnights, category) {
    let totalDemand = 0;
    
    fortnights.forEach(fn => {
        const fnDemand = demand[year]?.[fn];
        if (!fnDemand) return;
        
        // Calculate demand based on priority allocation
        let categoryAllocation = 0;
        
        // Check each priority level
        priorityConfig.forEach(priority => {
            const trainingDemand = fnDemand.byTrainingType[priority.trainingType] || 0;
            
            // Handle both old and new priority config formats
            let canServe = false;
            let isPrimary = false;
            
            if (priority.primaryTrainers && priority.cascadingFrom) {
                // New format
                canServe = priority.primaryTrainers.includes(category) || 
                          priority.cascadingFrom.includes(category);
                isPrimary = priority.primaryTrainers.includes(category);
            } else if (priority.servedBy && priority.preferredCategories) {
                // Old format
                canServe = priority.servedBy.includes(category);
                isPrimary = priority.preferredCategories.includes(category);
            }
            
            if (canServe) {
                if (isPrimary) {
                    // This is a primary trainer, gets full allocation
                    categoryAllocation += trainingDemand;
                } else {
                    // This is cascading support, gets partial allocation
                    categoryAllocation += trainingDemand * 0.3; // Assume 30% overflow
                }
            }
        });
        
        totalDemand += categoryAllocation;
    });
    
    return totalDemand / fortnights.length; // Average
}

function updateTrainerGauges() {
    const container = document.getElementById('trainer-gauges');
    if (!container) return;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentFortnight = (currentDate.getMonth() * 2) + (currentDate.getDate() <= 14 ? 1 : 2);
    
    const { demand } = calculateDemand();
    
    // Check if we have FTE data
    const hasSupplyData = TRAINER_CATEGORIES.some(cat => (trainerFTE[currentYear]?.[cat] || 0) > 0);
    
    if (!hasSupplyData) {
        container.innerHTML = `
            <div style="text-align: center; color: #999; padding: 40px; grid-column: 1 / -1;">
                No trainer supply data available<br>
                <small>Configure FTE in Settings to see utilization</small>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    TRAINER_CATEGORIES.forEach(category => {
        const categorySupply = (trainerFTE[currentYear]?.[category] || 0) / FORTNIGHTS_PER_YEAR;
        const categoryDemand = getCategoryDemand(demand, currentYear, [currentFortnight], category);
        const utilization = categorySupply > 0 ? (categoryDemand / categorySupply) * 100 : 0;
        
        html += `
            <div class="gauge-container">
                <div class="gauge-chart">
                    <canvas id="gauge-${category}" width="120" height="120"></canvas>
                    <div class="gauge-value">${categorySupply > 0 ? Math.round(utilization) + '%' : '-'}</div>
                </div>
                <div class="gauge-label">${category}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Draw gauges
    setTimeout(() => {
        TRAINER_CATEGORIES.forEach(category => {
            drawGauge(`gauge-${category}`, 
                getCategoryDemand(demand, currentYear, [currentFortnight], category),
                (trainerFTE[currentYear]?.[category] || 0) / FORTNIGHTS_PER_YEAR);
        });
    }, 100);
}

function drawGauge(canvasId, demand, supply) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = 60;
    const centerY = 60;
    const radius = 50;
    
    // Clear canvas
    ctx.clearRect(0, 0, 120, 120);
    
    // Draw background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 15;
    ctx.stroke();
    
    // Calculate utilization
    const utilization = supply > 0 ? Math.min(demand / supply, 1.5) : 0;
    
    // Determine color
    let color = '#2ecc71'; // Green
    if (utilization > 1) {
        color = '#e74c3c'; // Red
    } else if (utilization > 0.8) {
        color = '#f39c12'; // Orange
    }
    
    // Draw utilization arc
    const endAngle = Math.PI * 0.75 + (utilization * Math.PI * 1.5);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 15;
    ctx.stroke();
}

let supplyDemandChart = null;

function updateSupplyDemandChart() {
    const ctx = document.getElementById('supply-demand-chart')?.getContext('2d');
    if (!ctx) return;
    
    const { demand } = calculateDemand();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + (dashboardViewOffset[currentLocation] || 0));
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Prepare data for the next 12 months
    const labels = [];
    const supplyData = [];
    const demandData = [];
    const surplusDeficitData = [];
    
    for (let i = 0; i < 12; i++) {
        let month = currentMonth + i;
        let year = currentYear;
        if (month >= 12) {
            month -= 12;
            year++;
        }
        
        labels.push(`${MONTHS[month]} ${year}`);
        
        // Calculate supply and demand for the month
        const fn1 = (month * 2) + 1;
        const fn2 = (month * 2) + 2;
        
        // Total supply from current location
        const locationFTE = (locationData && currentLocation && locationData[currentLocation]) ? locationData[currentLocation].trainerFTE : trainerFTE;
        const monthlySupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
            sum + (locationFTE[year]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR; // Use fortnightly FTE capacity // Convert annual to monthly
        
        // Total demand (average of two fortnights)
        const monthlyDemand = ((demand[year]?.[fn1]?.total || 0) + 
                              (demand[year]?.[fn2]?.total || 0)) / 2;
        
        supplyData.push(monthlySupply);
        demandData.push(monthlyDemand);
        surplusDeficitData.push(monthlySupply - monthlyDemand);
        
        // Debug logging
        if (i === 0) {  // Log first month only to avoid spam
            // console.log(`Supply/Demand Debug for ${MONTHS[month]} ${year}:`);
            // console.log(`  Location: ${currentLocation}`);
            // console.log(`  Annual FTE Total:`, TRAINER_CATEGORIES.reduce((sum, cat) => sum + (locationFTE[year]?.[cat] || 0), 0));
            // console.log(`  Monthly Supply (fortnightly):`, monthlySupply);
            // console.log(`  Monthly Demand:`, monthlyDemand);
            // console.log(`  Demand data for fn1 (${fn1}):`, demand[year]?.[fn1]);
            // console.log(`  Demand data for fn2 (${fn2}):`, demand[year]?.[fn2]);
        }
    }
    
    // Check if we have any data
    const hasData = supplyData.some(s => s > 0) || demandData.some(d => d > 0);
    
    if (!hasData) {
        if (supplyDemandChart) {
            supplyDemandChart.destroy();
            supplyDemandChart = null;
        }
        
        const canvas = document.getElementById('supply-demand-chart');
        const wrapper = canvas.closest('.chart-wrapper');
        
        const existingMsg = wrapper.querySelector('#supply-demand-empty-msg');
        if (existingMsg) existingMsg.remove();
        
        canvas.style.display = 'none';
        
        const emptyMsg = document.createElement('div');
        emptyMsg.id = 'supply-demand-empty-msg';
        emptyMsg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #999; width: 80%;';
        emptyMsg.innerHTML = 'No supply/demand data available<br><small>Configure FTE and add cohorts to see forecast</small>';
        wrapper.appendChild(emptyMsg);
        
        return;
    } else {
        const emptyMsg = document.getElementById('supply-demand-empty-msg');
        if (emptyMsg) emptyMsg.remove();
        document.getElementById('supply-demand-chart').style.display = 'block';
    }
    
    if (supplyDemandChart) {
        supplyDemandChart.destroy();
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#666';
    const gridColor = isDarkMode ? '#444' : '#e0e0e0';
    
    supplyDemandChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Supply',
                data: supplyData,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                fill: '+1',
                tension: 0.4
            }, {
                label: 'Demand',
                data: demandData,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                fill: 'origin',
                tension: 0.4
            }, {
                label: 'Surplus/Deficit',
                data: surplusDeficitData,
                borderColor: '#3498db',
                backgroundColor: (context) => {
                    const value = context.parsed?.y;
                    if (value === undefined || value === null) return 'rgba(52, 152, 219, 0.1)';
                    return value >= 0 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)';
                },
                fill: true,
                tension: 0.4,
                hidden: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            if (context.datasetIndex < 2) {
                                const supply = supplyData[context.dataIndex];
                                const demand = demandData[context.dataIndex];
                                const diff = supply - demand;
                                return `${diff >= 0 ? 'Surplus' : 'Deficit'}: ${Math.abs(diff).toFixed(1)} FTE`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'FTE',
                        color: textColor
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

let phaseBreakdownChart = null;
let phaseBreakdownUpdating = false;

function updatePhaseBreakdown() {
    // Prevent multiple simultaneous updates
    if (phaseBreakdownUpdating) return;
    phaseBreakdownUpdating = true;
    
    const ctx = document.getElementById('phase-breakdown-chart')?.getContext('2d');
    if (!ctx) {
        phaseBreakdownUpdating = false;
        return;
    }
    
    // console.log('Phase breakdown data:', {
    //     activeCohorts: activeCohorts.length,
    //     currentLocation: currentLocation,
    //     locationCohorts: locationData[currentLocation]?.activeCohorts?.length
    // });
    
    // Count trainees in each phase
    const phaseData = {
        'Ground School': 0,
        'Simulator': 0,
        'Line Training - CAD': 0,
        'Line Training - CP': 0,
        'Line Training - FO': 0
    };
    
    // Use cohorts from current location or fall back to activeCohorts
    const locationCohorts = (locationData && currentLocation && locationData[currentLocation]) ? locationData[currentLocation].activeCohorts : null;
    const cohorts = locationCohorts && locationCohorts.length > 0 ? locationCohorts : activeCohorts;
    
    // Check if we have any cohorts
    if (!cohorts || cohorts.length === 0) {
        // Show empty state
        if (phaseBreakdownChart) {
            phaseBreakdownChart.destroy();
            phaseBreakdownChart = null;
        }
        
        const canvas = document.getElementById('phase-breakdown-chart');
        const wrapper = canvas.closest('.chart-wrapper');
        
        // Remove any existing empty message first
        const existingMsg = wrapper.querySelector('#phase-empty-msg');
        if (existingMsg) existingMsg.remove();
        
        canvas.style.display = 'none';
        
        const emptyMsg = document.createElement('div');
        emptyMsg.id = 'phase-empty-msg';
        emptyMsg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #999; width: 80%;';
        emptyMsg.innerHTML = 'No active training cohorts<br><small>Add cohorts to see phase distribution</small>';
        wrapper.appendChild(emptyMsg);
        
        phaseBreakdownUpdating = false;
        return;
    } else {
        // Remove empty message if exists
        const emptyMsg = document.getElementById('phase-empty-msg');
        if (emptyMsg) emptyMsg.remove();
        document.getElementById('phase-breakdown-chart').style.display = 'block';
    }
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentFortnight = (currentDate.getMonth() * 2) + (currentDate.getDate() <= 14 ? 1 : 2);
    
    cohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        // Determine which phase the cohort is in
        let elapsedFortnights = 0;
        if (cohort.startYear < currentYear) {
            elapsedFortnights = (currentYear - cohort.startYear) * FORTNIGHTS_PER_YEAR;
        }
        elapsedFortnights += currentFortnight - cohort.startFortnight;
        
        if (elapsedFortnights < 0) return; // Not started yet
        
        let currentPhaseIndex = 0;
        let phaseProgress = elapsedFortnights;
        
        for (let i = 0; i < pathway.phases.length; i++) {
            if (phaseProgress < pathway.phases[i].duration) {
                currentPhaseIndex = i;
                break;
            }
            phaseProgress -= pathway.phases[i].duration;
        }
        
        if (currentPhaseIndex < pathway.phases.length) {
            const phase = pathway.phases[currentPhaseIndex];
            const phaseName = phase.name.includes('GS') ? 'Ground School' :
                            phase.name.includes('SIM') ? 'Simulator' :
                            phase.trainerDemandType || 'Other';
            
            if (phaseData.hasOwnProperty(phaseName)) {
                phaseData[phaseName] += cohort.numTrainees;
            }
        }
    });
    
    // Update existing chart if possible, otherwise destroy and recreate
    if (phaseBreakdownChart) {
        try {
            phaseBreakdownChart.data.labels = Object.keys(phaseData);
            phaseBreakdownChart.data.datasets[0].data = Object.values(phaseData);
            phaseBreakdownChart.update('none'); // No animation for smooth navigation
            return; // Exit if update successful
        } catch (e) {
            // If update fails, destroy and recreate
            phaseBreakdownChart.destroy();
        }
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#666';
    
    phaseBreakdownChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(phaseData),
            datasets: [{
                label: 'Trainees',
                data: Object.values(phaseData),
                backgroundColor: [
                    '#3498db',
                    '#9b59b6',
                    '#e74c3c',
                    '#f39c12',
                    '#2ecc71'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
    
    phaseBreakdownUpdating = false;
}

let workloadChart = null;
function updateWorkloadChart() {
    const ctx = document.getElementById('workload-chart')?.getContext('2d');
    if (!ctx) return;
    
    // Calculate workload distribution across trainer categories
    const { demand } = calculateDemand();
    const currentYear = new Date().getFullYear();
    const workloadData = {};
    
    TRAINER_CATEGORIES.forEach(category => {
        workloadData[category] = 0;
    });
    
    // Check if we have any demand
    const hasDemand = Object.values(demand).some(yearData => 
        Object.values(yearData).some(fnData => fnData.total > 0)
    );
    
    if (!hasDemand) {
        // Show empty state
        if (workloadChart) {
            workloadChart.destroy();
            workloadChart = null;
        }
        
        const canvas = document.getElementById('workload-chart');
        const wrapper = canvas.closest('.chart-wrapper');
        
        // Remove any existing empty message first
        const existingMsg = wrapper.querySelector('#workload-empty-msg');
        if (existingMsg) existingMsg.remove();
        
        canvas.style.display = 'none';
        
        const emptyMsg = document.createElement('div');
        emptyMsg.id = 'workload-empty-msg';
        emptyMsg.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #999; width: 80%;';
        emptyMsg.innerHTML = 'No workload data available<br><small>Add training cohorts to see distribution</small>';
        wrapper.appendChild(emptyMsg);
        
        return;
    } else {
        // Remove empty message if exists
        const emptyMsg = document.getElementById('workload-empty-msg');
        if (emptyMsg) emptyMsg.remove();
        document.getElementById('workload-chart').style.display = 'block';
    }
    
    // Sum up demand for next 6 months
    for (let i = 0; i < 12; i++) {
        const month = new Date().getMonth() + i;
        const year = month >= 12 ? currentYear + 1 : currentYear;
        const actualMonth = month % 12;
        const fn1 = (actualMonth * 2) + 1;
        const fn2 = (actualMonth * 2) + 2;
        
        TRAINER_CATEGORIES.forEach(category => {
            workloadData[category] += getCategoryDemand(demand, year, [fn1, fn2], category);
        });
    }
    
    // Update existing chart if possible, otherwise destroy and recreate
    if (workloadChart) {
        try {
            workloadChart.data.labels = labels;
            workloadChart.data.datasets[0].data = data;
            workloadChart.update('none'); // No animation for smooth navigation
            return; // Exit if update successful
        } catch (e) {
            // If update fails, destroy and recreate
            workloadChart.destroy();
        }
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#666';
    
    workloadChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Object.keys(workloadData),
            datasets: [{
                data: Object.values(workloadData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    ticks: {
                        color: textColor
                    }
                }
            }
        }
    });
}

function updateDetailCards() {
    const { demand } = calculateDemand();
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + (dashboardViewOffset[currentLocation] || 0));
    const currentYear = currentDate.getFullYear();
    const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
    
    // console.log('UpdateDetailCards - demand:', demand);
    // console.log('UpdateDetailCards - cohorts:', cohorts.length);
    
    // Find peak demand period
    let peakDemand = 0;
    let peakMonth = '';
    let peakYear = currentYear;
    
    for (let year = currentYear; year <= currentYear + 1; year++) {
        for (let month = 0; month < 12; month++) {
            const fn1 = (month * 2) + 1;
            const fn2 = (month * 2) + 2;
            const monthlyDemand = (demand[year]?.[fn1]?.total || 0) + (demand[year]?.[fn2]?.total || 0);
            
            if (monthlyDemand > peakDemand) {
                peakDemand = monthlyDemand;
                peakMonth = MONTHS[month];
                peakYear = year;
            }
        }
    }
    
    const peakPeriodEl = document.getElementById('peak-demand-period');
    const peakDetailEl = document.getElementById('peak-demand-detail');
    if (peakPeriodEl) peakPeriodEl.textContent = peakMonth ? `${peakMonth} ${peakYear}` : '-';
    if (peakDetailEl) peakDetailEl.textContent = peakDemand > 0 ? `${(peakDemand / 2).toFixed(1)} FTE average` : '-';
    
    // Calculate supply/demand balance
    const totalSupply = TRAINER_CATEGORIES.reduce((sum, cat) => 
        sum + (trainerFTE[currentYear]?.[cat] || 0), 0) / FORTNIGHTS_PER_YEAR;
    const avgDemand = calculateAverageDemand(demand, currentYear);
    const balance = totalSupply - avgDemand;
    
    const balanceEl = document.getElementById('supply-balance');
    const balanceDetailEl = document.getElementById('balance-detail');
    if (balanceEl) balanceEl.textContent = totalSupply > 0 ? (balance >= 0 ? 'Balanced' : 'Deficit') : '-';
    if (balanceDetailEl) balanceDetailEl.textContent = totalSupply > 0 ? `${Math.abs(balance).toFixed(1)} FTE ${balance >= 0 ? 'surplus' : 'shortage'}` : '-';
    
    // Calculate training efficiency
    const completionRate = calculateCompletionRate();
    const efficiencyEl = document.getElementById('training-efficiency');
    const efficiencyDetailEl = document.getElementById('efficiency-detail');
    if (efficiencyEl) efficiencyEl.textContent = `${completionRate}%`;
    if (efficiencyDetailEl) efficiencyDetailEl.textContent = 'On-time completion rate';
    
    // Calculate forecast confidence
    const dataPoints = cohorts.length;
    const confidence = Math.min(95, 50 + (dataPoints * 2.5));
    const confidenceEl = document.getElementById('forecast-confidence');
    const confidenceDetailEl = document.getElementById('confidence-detail');
    if (confidenceEl) confidenceEl.textContent = `${Math.round(confidence)}%`;
    if (confidenceDetailEl) confidenceDetailEl.textContent = `Based on ${dataPoints} active cohorts`;
}

function calculateAverageDemand(demand, year) {
    let total = 0;
    let count = 0;
    
    for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
        if (demand[year]?.[fn]?.total) {
            total += demand[year][fn].total;
            count++;
        }
    }
    
    return count > 0 ? total / count : 0;
}

function calculateCompletionRate() {
    // Simple calculation - in real app would track actual vs planned completion
    const avgUtilization = 75; // Placeholder
    return Math.min(100, Math.round(100 - (Math.abs(avgUtilization - 80) * 2)));
}

// Make functions available globally for inline onclick
window.removeCohort = removeCohort;
window.editCohort = editCohort;
window.editPathway = editPathway;
window.removePhase = removePhase;
window.navigateFTEYears = navigateFTEYears;
window.handleFTEPaste = handleFTEPaste;
window.handleFTEKeyDown = handleFTEKeyDown;
window.handleFTEMouseDown = handleFTEMouseDown;
window.toggleGroup = toggleGroup;
window.loadScenario = loadScenario;
window.deleteScenario = deleteScenario;
window.updateCurrentScenario = updateCurrentScenario;
window.acknowledgeAlert = acknowledgeAlert;
window.dismissAlert = dismissAlert;
window.exportChart = exportChart;
window.toggleCommencementCrossLocation = toggleCommencementCrossLocation;
window.navigateDashboard = navigateDashboard;
window.saveFTEAsDefault = saveFTEAsDefault;
window.toggleDemandSplitView = toggleDemandSplitView;
window.showHelpModal = showHelpModal;

// Merge dialog functions
window.selectAllMergeGroups = selectAllMergeGroups;
window.deselectAllMergeGroups = deselectAllMergeGroups;
window.updateMergeSelection = updateMergeSelection;
window.toggleMergeDetails = toggleMergeDetails;
window.performMerge = performMerge;

// Additional functions
window.removeToast = removeToast;
window.handleCardClick = handleCardClick;
window.duplicateScenario = duplicateScenario;
window.exportAllScenarios = exportAllScenarios;
window.importScenarios = importScenarios;
window.exportScenario = exportScenario;
window.compareScenarios = compareScenarios;

// Test function for debugging sync
window.testSync = function() {
    const containers = [
        'fte-summary-table-container',
        'gantt-chart-container',
        'demand-table-container',
        'surplus-deficit-container'
    ];
    
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            const table = container.querySelector('.data-table');
            const wrapper = container.querySelector('.table-wrapper');
            // console.log(`${id}:`);
            // console.log(`  Container: width=${container.clientWidth}, scrollWidth=${container.scrollWidth}`);
            // console.log(`  Wrapper: width=${wrapper?.clientWidth}, scrollWidth=${wrapper?.scrollWidth}`);
            // console.log(`  Table: width=${table?.clientWidth}, scrollWidth=${table?.scrollWidth}`);
            // console.log(`  Scrollable: ${container.scrollWidth > container.clientWidth}`);
        } else {
            // console.log(`${id}: NOT FOUND`);
        }
    });
    
    // Check CSS column width
    const columnWidth = getComputedStyle(document.documentElement).getPropertyValue('--column-width');
    // console.log(`CSS column width: ${columnWidth}`);
    
    // Count columns
    const firstTable = document.querySelector('.data-table');
    if (firstTable) {
        const headerCells = firstTable.querySelectorAll('thead tr:last-child th');
        // console.log(`Number of header columns: ${headerCells.length}`);
    }
};

// Grid Entry Functions
let gridData = {};

function generateEntryGrid() {
    const startMonth = parseInt(document.getElementById('grid-start-month').value);
    const startYear = parseInt(document.getElementById('grid-start-year').value);
    const endMonth = parseInt(document.getElementById('grid-end-month').value);
    const endYear = parseInt(document.getElementById('grid-end-year').value);
    
    // Check if end date is before start date
    if (endYear < startYear || (endYear === startYear && endMonth < startMonth)) {
        // This should already be handled by refreshGrid, but adding as safety check
        showAlertDialog(
            'Invalid Date Range',
            'End date cannot be before start date.',
            null
        );
        return;
    }
    
    // Calculate month difference
    const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    
    // Check if period is too long
    if (monthsDiff > 12) {
        showAlertDialog(
            'Period Too Long',
            'Maximum planning period is 12 months.',
            null
        );
        return;
    }
    
    // Adjust modal width based on period length
    const modal = document.querySelector('#training-planner-modal .modal-content');
    if (monthsDiff > 9) {
        modal.style.maxWidth = '1500px';
    } else if (monthsDiff > 6) {
        modal.style.maxWidth = '1200px';
    } else {
        modal.style.maxWidth = '900px';  // Increased from 800px for 6-month view
    }
    
    // Calculate fortnight range
    const fortnights = [];
    let currentMonth = startMonth;
    let currentYear = startYear;
    
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
        fortnights.push({
            year: currentYear,
            month: currentMonth,
            monthName: MONTHS[currentMonth],
            fn1: (currentMonth * 2) + 1,
            fn2: (currentMonth * 2) + 2
        });
        
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }
    
    // Group pathways by type and sort by ID
    const pathwaysByType = {
        'CP': pathways.filter(p => p.type === 'CP').sort((a, b) => a.id.localeCompare(b.id)),
        'FO': pathways.filter(p => p.type === 'FO').sort((a, b) => a.id.localeCompare(b.id)),
        'CAD': pathways.filter(p => p.type === 'CAD').sort((a, b) => a.id.localeCompare(b.id))
    };
    
    // Build grid HTML
    let html = '<table class="grid-entry-table">';
    
    // Header rows
    html += '<thead>';
    html += '<tr>';
    html += '<th class="pathway-header" rowspan="2">Pathway</th>';
    
    // Month headers
    fortnights.forEach(fn => {
        html += `<th class="month-header" colspan="2">${fn.monthName} ${fn.year}</th>`;
    });
    html += '</tr>';
    
    // Fortnight headers
    html += '<tr>';
    fortnights.forEach(fn => {
        html += `<th>FN${fn.fn1}</th>`;
        html += `<th>FN${fn.fn2}</th>`;
    });
    html += '</tr>';
    html += '</thead>';
    
    html += '<tbody>';
    
    // Initialize grid data
    gridData = {};
    
    // CP Section
    if (pathwaysByType.CP.length > 0) {
        html += '<tr class="type-header"><td colspan="' + (fortnights.length * 2 + 1) + '">CP</td></tr>';
        
        pathwaysByType.CP.forEach(pathway => {
            const totalDuration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
            html += '<tr>';
            html += `<td class="pathway-cell" style="width: fit-content;">${pathway.name} (${totalDuration}fn)</td>`;
            
            fortnights.forEach(fn => {
                const key1 = `${pathway.id}-${fn.year}-${fn.fn1}`;
                const key2 = `${pathway.id}-${fn.year}-${fn.fn2}`;
                html += `<td><input type="number" min="0" data-key="${key1}" data-type="CP" data-pathway="${pathway.id}" data-year="${fn.year}" data-fn="${fn.fn1}"></td>`;
                html += `<td><input type="number" min="0" data-key="${key2}" data-type="CP" data-pathway="${pathway.id}" data-year="${fn.year}" data-fn="${fn.fn2}"></td>`;
            });
            
            html += '</tr>';
        });
        
        // CP Total row
        html += '<tr class="total-row cp-total">';
        html += '<td class="pathway-cell">CP Total</td>';
        fortnights.forEach(fn => {
            html += `<td class="total-cell" data-type="CP" data-year="${fn.year}" data-fn="${fn.fn1}">0</td>`;
            html += `<td class="total-cell" data-type="CP" data-year="${fn.year}" data-fn="${fn.fn2}">0</td>`;
        });
        html += '</tr>';
    }
    
    // FO Section
    if (pathwaysByType.FO.length > 0) {
        html += '<tr class="type-header"><td colspan="' + (fortnights.length * 2 + 1) + '">FO</td></tr>';
        
        pathwaysByType.FO.forEach(pathway => {
            const totalDuration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
            html += '<tr>';
            html += `<td class="pathway-cell" style="width: fit-content;">${pathway.name} (${totalDuration}fn)</td>`;
            
            fortnights.forEach(fn => {
                const key1 = `${pathway.id}-${fn.year}-${fn.fn1}`;
                const key2 = `${pathway.id}-${fn.year}-${fn.fn2}`;
                html += `<td><input type="number" min="0" data-key="${key1}" data-type="FO" data-pathway="${pathway.id}" data-year="${fn.year}" data-fn="${fn.fn1}"></td>`;
                html += `<td><input type="number" min="0" data-key="${key2}" data-type="FO" data-pathway="${pathway.id}" data-year="${fn.year}" data-fn="${fn.fn2}"></td>`;
            });
            
            html += '</tr>';
        });
    }
    
    // CAD Section
    if (pathwaysByType.CAD.length > 0) {
        html += '<tr class="type-header"><td colspan="' + (fortnights.length * 2 + 1) + '">CAD</td></tr>';
        
        pathwaysByType.CAD.forEach(pathway => {
            const totalDuration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
            html += '<tr>';
            html += `<td class="pathway-cell" style="width: fit-content;">${pathway.name} (${totalDuration}fn)</td>`;
            
            fortnights.forEach(fn => {
                const key1 = `${pathway.id}-${fn.year}-${fn.fn1}`;
                const key2 = `${pathway.id}-${fn.year}-${fn.fn2}`;
                html += `<td><input type="number" min="0" data-key="${key1}" data-type="CAD" data-pathway="${pathway.id}" data-year="${fn.year}" data-fn="${fn.fn1}"></td>`;
                html += `<td><input type="number" min="0" data-key="${key2}" data-type="CAD" data-pathway="${pathway.id}" data-year="${fn.year}" data-fn="${fn.fn2}"></td>`;
            });
            
            html += '</tr>';
        });
    }
    
    // FO+CAD Total row
    html += '<tr class="total-row focad-total summary-row">';
    html += '<td class="pathway-cell">FO+CAD Total</td>';
    fortnights.forEach(fn => {
        html += `<td class="total-cell" data-type="FOCAD" data-year="${fn.year}" data-fn="${fn.fn1}">0</td>`;
        html += `<td class="total-cell" data-type="FOCAD" data-year="${fn.year}" data-fn="${fn.fn2}">0</td>`;
    });
    html += '</tr>';
    
    html += '</tbody>';
    html += '</table>';
    
    // Show grid
    const container = document.getElementById('grid-container');
    container.innerHTML = html;
    container.style.display = 'block';
    
    // Show footer
    document.getElementById('grid-footer').style.display = 'flex';
    
    // Add event listeners to inputs
    container.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', updateGridTotals);
        input.addEventListener('keydown', handleGridNavigation);
        input.addEventListener('paste', handleGridPaste);
    });
    
    // Add paste handler to the entire grid for broader paste support
    container.addEventListener('paste', handleGridPaste);
}

function updateGridTotals() {
    const container = document.getElementById('grid-container');
    const totals = {};
    let totalCohorts = 0;
    let totalTrainees = 0;
    
    // Calculate totals
    container.querySelectorAll('input[type="number"]').forEach(input => {
        const value = parseInt(input.value) || 0;
        if (value > 0) {
            totalCohorts++;
            totalTrainees += value;
            
            const year = input.dataset.year;
            const fn = input.dataset.fn;
            const type = input.dataset.type;
            const key = `${year}-${fn}`;
            
            if (!totals[key]) {
                totals[key] = { CP: 0, FO: 0, CAD: 0 };
            }
            
            totals[key][type] += value;
        }
    });
    
    // Update total cells
    container.querySelectorAll('.total-cell').forEach(cell => {
        const year = cell.dataset.year;
        const fn = cell.dataset.fn;
        const type = cell.dataset.type;
        const key = `${year}-${fn}`;
        
        let value = 0;
        if (totals[key]) {
            if (type === 'CP') {
                value = totals[key].CP;
            } else if (type === 'FOCAD') {
                value = totals[key].FO + totals[key].CAD;
            }
        }
        
        cell.textContent = value;
    });
    
    // Update footer totals
    document.getElementById('grid-total-cohorts').textContent = `Total Cohorts: ${totalCohorts}`;
    document.getElementById('grid-total-trainees').textContent = `Total Trainees: ${totalTrainees}`;
}

function handleGridNavigation(e) {
    const input = e.target;
    const container = document.getElementById('grid-container');
    const inputs = Array.from(container.querySelectorAll('input[type="number"]'));
    const currentIndex = inputs.indexOf(input);
    
    if (e.key === 'Tab' && !e.shiftKey) {
        // Tab forward - default behavior
        return;
    } else if (e.key === 'Tab' && e.shiftKey) {
        // Tab backward - default behavior
        return;
    } else if (e.key === 'Enter') {
        // Enter - move to next input
        e.preventDefault();
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    } else if (e.key === 'ArrowRight') {
        // Right arrow - move to next cell in row
        e.preventDefault();
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    } else if (e.key === 'ArrowLeft') {
        // Left arrow - move to previous cell in row
        e.preventDefault();
        if (currentIndex > 0) {
            inputs[currentIndex - 1].focus();
        }
    }
}

function handleGridPaste(e) {
    e.preventDefault();
    
    // Get paste data
    const pasteData = e.clipboardData.getData('text');
    if (!pasteData) return;
    
    // Parse the pasted data (tab-separated for Excel)
    const rows = pasteData.trim().split('\n');
    const data = rows.map(row => row.split('\t'));
    
    // Get the starting cell
    let startInput = e.target;
    if (!startInput.tagName || startInput.tagName !== 'INPUT') {
        // If paste wasn't on an input, find the first empty input
        const container = document.getElementById('grid-container');
        startInput = container.querySelector('input[type="number"]:not([value]), input[type="number"][value=""]');
        if (!startInput) {
            showNotification('Please click on a cell to start pasting', 'info');
            return;
        }
    }
    
    // Get all inputs in the grid
    const container = document.getElementById('grid-container');
    const allInputs = Array.from(container.querySelectorAll('input[type="number"]'));
    const startIndex = allInputs.indexOf(startInput);
    
    if (startIndex === -1) return;
    
    // Calculate grid dimensions
    const gridRows = container.querySelectorAll('tbody tr:not(.total-row):not(.type-header)');
    const inputsPerRow = gridRows[0] ? gridRows[0].querySelectorAll('input[type="number"]').length : 0;
    
    if (inputsPerRow === 0) return;
    
    // Paste the data
    let currentIndex = startIndex;
    let changesMade = false;
    
    for (let row = 0; row < data.length; row++) {
        for (let col = 0; col < data[row].length; col++) {
            if (currentIndex >= allInputs.length) break;
            
            const value = data[row][col].trim();
            const numValue = parseInt(value);
            
            // Only paste if it's a valid number
            if (!isNaN(numValue) && numValue >= 0) {
                allInputs[currentIndex].value = numValue;
                changesMade = true;
            }
            
            currentIndex++;
        }
        
        // Move to the start of next row
        const currentRow = Math.floor(startIndex / inputsPerRow);
        const nextRowStartIndex = ((currentRow + row + 1) * inputsPerRow) + (startIndex % inputsPerRow);
        currentIndex = nextRowStartIndex;
        
        if (currentIndex >= allInputs.length) break;
    }
    
    // Update totals if changes were made
    if (changesMade) {
        updateGridTotals();
        showNotification('Data pasted successfully', 'success');
    }
}

function clearEntryGrid() {
    // This function is no longer used - clear functionality is inline in the Clear button handler
    document.getElementById('grid-container').innerHTML = '';
    document.getElementById('grid-container').style.display = 'none';
    document.getElementById('grid-footer').style.display = 'none';
    gridData = {};
    
    // Reset modal width
    const modal = document.querySelector('#training-planner-modal .modal-content');
    if (modal) {
        modal.style.maxWidth = '800px';
    }
}

function applyGridEntries() {
    const container = document.getElementById('grid-container');
    const cohorts = [];
    
    // Collect all non-empty entries
    container.querySelectorAll('input[type="number"]').forEach(input => {
        const value = parseInt(input.value) || 0;
        if (value > 0) {
            cohorts.push({
                pathwayId: input.dataset.pathway,
                year: parseInt(input.dataset.year),
                fortnight: parseInt(input.dataset.fn),
                numTrainees: value
            });
        }
    });
    
    if (cohorts.length === 0) {
        showNotification('No cohorts to add', 'warning');
        return;
    }
    
    // Add cohorts to active cohorts
    cohorts.forEach(cohort => {
        activeCohorts.push({
            id: nextCohortId++,
            numTrainees: cohort.numTrainees,
            pathwayId: cohort.pathwayId,
            startYear: cohort.year,
            startFortnight: cohort.fortnight,
            location: currentLocation,
            crossLocationTraining: {}
        });
    });
    
    // Update tables and close modal
    updateAllTables();
    renderGanttChart();
    markDirty();
    
    // Close modal
    document.getElementById('training-planner-modal').classList.remove('active');
    
    // Show success notification
    showNotification(`Added ${cohorts.length} cohorts`, 'success');
    
    // Clear grid
    clearEntryGrid();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Test function to add A320 cohorts
window.addTestCohorts = function() {
    // Clear existing cohorts first
    activeCohorts = [];
    
    // Add first A320 cohort
    activeCohorts.push({
        id: 1,
        name: 'A320-01',
        location: 'NZ',
        numTrainees: 6,
        pathwayId: '3', // CAD pathway
        startYear: 2025,
        startFortnight: 13, // July 2025
        crossLocationTraining: {}
    });

    // Add second A320 cohort with some cross-location training pre-configured
    activeCohorts.push({
        id: 2,
        name: 'A320-02',
        location: 'NZ',
        numTrainees: 6,
        pathwayId: '3', // CAD pathway
        startYear: 2025,
        startFortnight: 15, // August 2025
        crossLocationTraining: {
            'AU': {
                phases: {
                    'LT-FO': [9, 10, 11]  // Use AU trainers for fortnights 9, 10, 11
                }
            }
        }
    });
    
    // Switch to NZ view
    document.querySelector('.location-toggle[data-location="NZ"]')?.click();
    
    // Switch to planner view if not already there
    const plannerTab = document.querySelector('[data-view="planner"]');
    if (plannerTab && !plannerTab.classList.contains('active')) {
        plannerTab.click();
    }
    
    updateAllTables();
    renderGanttChart();
    // console.log('Added 2 test A320 cohorts (A320-02 has cross-location training configured)');
    // console.log('Current cohorts:', activeCohorts);
};

// Function to add demo data for dashboard
window.addDemoDashboardData = function() {
    // Clear and add varied cohorts for better visualization
    const demoYear = new Date().getFullYear();
    const demoMonth = new Date().getMonth();
    const demoFortnight = (demoMonth * 2) + 1;
    
    const demoCohorts = [
        // CAD cohorts
        { id: 100, numTrainees: 12, pathwayId: "A209", startYear: demoYear, startFortnight: demoFortnight - 8, location: currentLocation, crossLocationTraining: {} },
        { id: 101, numTrainees: 8, pathwayId: "A211", startYear: demoYear, startFortnight: demoFortnight - 6, location: currentLocation, crossLocationTraining: {} },
        { id: 102, numTrainees: 10, pathwayId: "A212", startYear: demoYear, startFortnight: demoFortnight - 4, location: currentLocation, crossLocationTraining: {} },
        
        // FO cohorts
        { id: 103, numTrainees: 15, pathwayId: "A210", startYear: demoYear, startFortnight: demoFortnight - 7, location: currentLocation, crossLocationTraining: {} },
        { id: 104, numTrainees: 12, pathwayId: "A210", startYear: demoYear, startFortnight: demoFortnight - 3, location: currentLocation, crossLocationTraining: {} },
        { id: 105, numTrainees: 10, pathwayId: "A210", startYear: demoYear, startFortnight: demoFortnight + 1, location: currentLocation, crossLocationTraining: {} },
        
        // CP cohorts
        { id: 106, numTrainees: 6, pathwayId: "A202", startYear: demoYear, startFortnight: demoFortnight - 5, location: currentLocation, crossLocationTraining: {} },
        { id: 107, numTrainees: 8, pathwayId: "A203", startYear: demoYear, startFortnight: demoFortnight - 2, location: currentLocation, crossLocationTraining: {} },
        { id: 108, numTrainees: 4, pathwayId: "A202", startYear: demoYear, startFortnight: demoFortnight, location: currentLocation, crossLocationTraining: {} },
        
        // Future cohorts
        { id: 109, numTrainees: 14, pathwayId: "A209", startYear: demoYear, startFortnight: demoFortnight + 3, location: currentLocation, crossLocationTraining: {} },
        { id: 110, numTrainees: 16, pathwayId: "A210", startYear: demoYear, startFortnight: demoFortnight + 5, location: currentLocation, crossLocationTraining: {} },
        { id: 111, numTrainees: 6, pathwayId: "A203", startYear: demoYear, startFortnight: demoFortnight + 7, location: currentLocation, crossLocationTraining: {} }
    ];
    
    // Update the location data
    locationData[currentLocation].activeCohorts = demoCohorts;
    activeCohorts = demoCohorts;
    nextCohortId = 112;
    
    // Update all views
    updateAllTables();
    renderGanttChart();
    
    // Update dashboard if on dashboard view
    if (dashboardView.classList.contains('active')) {
        // Always use enhanced dashboard
        updateDashboardV2();
    }
    
    showNotification('Demo data loaded successfully', 'success');
    return 'Demo data added';
};

// Global function for toggling dashboard view
window.toggleDashboardView = function(version) {
    const toggleButtons = document.querySelectorAll('.toggle-option');
    const classicDashboard = document.getElementById('dashboard-classic');
    const enhancedDashboard = document.getElementById('dashboard-enhanced');
    
    // Update active state
    toggleButtons.forEach(btn => {
        if (btn.dataset.version === version) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Show/hide dashboards
    if (version === 'classic') {
        classicDashboard.style.display = 'block';
        enhancedDashboard.style.display = 'none';
        updateDashboard();
    } else {
        classicDashboard.style.display = 'none';
        enhancedDashboard.style.display = 'block';
        updateDashboardV2();
    }
    
    // Save preference
    localStorage.setItem('dashboardVersion', version);
};

// Get localStorage usage stats
function getStorageStats() {
    let stats = {
        totalSize: 0,
        items: {},
        scenarioCount: 0,
        largestScenario: null,
        largestScenarioSize: 0
    };
    
    // Calculate size of each localStorage item
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            const value = localStorage[key];
            const size = (value.length + key.length) * 2; // UTF-16 = 2 bytes per char
            stats.items[key] = {
                size: size,
                sizeKB: (size / 1024).toFixed(2) + ' KB'
            };
            stats.totalSize += size;
        }
    }
    
    // Analyze scenarios specifically
    try {
        const scenarios = JSON.parse(localStorage.getItem('pilotTrainerScenarios') || '[]');
        stats.scenarioCount = scenarios.length;
        
        scenarios.forEach(scenario => {
            const scenarioSize = JSON.stringify(scenario).length * 2;
            if (scenarioSize > stats.largestScenarioSize) {
                stats.largestScenarioSize = scenarioSize;
                stats.largestScenario = scenario.name;
            }
        });
    } catch (e) {
        console.error('Error parsing scenarios:', e);
    }
    
    stats.totalSizeKB = (stats.totalSize / 1024).toFixed(2) + ' KB';
    stats.totalSizeMB = (stats.totalSize / 1024 / 1024).toFixed(2) + ' MB';
    stats.percentUsed = ((stats.totalSize / (5 * 1024 * 1024)) * 100).toFixed(1) + '%'; // Assume 5MB limit
    
    return stats;
}

// Log storage stats to console (for debugging)
function logStorageStats() {
    const stats = getStorageStats();
    // console.log('=== LocalStorage Usage Stats ===');
    // console.log(`Total Size: ${stats.totalSizeMB} MB (${stats.percentUsed} of typical 5MB limit)`);
    // console.log(`Scenarios: ${stats.scenarioCount} scenarios stored`);
    if (stats.largestScenario) {
        // console.log(`Largest Scenario: "${stats.largestScenario}" (${(stats.largestScenarioSize / 1024).toFixed(2)} KB)`);
    }
    // console.log('\nBreakdown by key:');
    console.table(stats.items);
    return stats;
}

// ========================================
// Help System Implementation
// ========================================

// Help content database
const helpContent = {
    'getting-started': {
        title: 'Getting Started',
        content: `
            <h2>Welcome to Pilot Trainer Supply/Demand Planner</h2>
            <p>This application helps you manage pilot training cohorts and forecast trainer supply and demand across multiple years. It's designed to optimize training capacity by tracking trainer availability, cohort scheduling, and identifying capacity constraints.</p>
            
            <h3>Key Concepts</h3>
            <ul>
                <li><strong>FTE (Full-Time Equivalent):</strong> A measure of trainer capacity. 1 FTE = 1 full-time trainer working standard hours.</li>
                <li><strong>Fortnights:</strong> The system uses 2-week periods (fortnights) as the base time unit, with 24 fortnights per year.</li>
                <li><strong>Cohorts:</strong> Groups of pilot trainees who progress through training phases together.</li>
                <li><strong>Pathways:</strong> Pre-defined training programs consisting of multiple phases (Ground School, Simulator, Line Training).</li>
                <li><strong>Line Training (LT):</strong> The final phase requiring 1:1 trainer-to-trainee ratio.</li>
            </ul>
            
            <h3>Quick Start Guide</h3>
            <ol>
                <li><strong>Configure Trainer Capacity:</strong> Navigate to Settings → Edit FTE and enter your annual trainer numbers by category.</li>
                <li><strong>Review Training Pathways:</strong> Check Settings → Training Pathways to ensure durations match your organization.</li>
                <li><strong>Schedule Training Cohorts:</strong> Go to Planner → Add New Cohort or use the Training Planner for bulk entry.</li>
                <li><strong>Monitor Performance:</strong> View the Dashboard to track utilization, identify bottlenecks, and see upcoming completions.</li>
                <li><strong>Save Your Work:</strong> Create scenarios to save different planning options and compare alternatives.</li>
            </ol>
            
            <div class="help-tip">
                <strong>💡 Tip:</strong> Start with the Dashboard to get an overview of your current training situation. The Enhanced Dashboard provides more detailed analytics and visualizations.
            </div>
        `
    },
    'dashboard': {
        title: 'Dashboard',
        content: `
            <h2>Understanding the Dashboard</h2>
            <p>The Dashboard provides a comprehensive overview of your training operations with key metrics and visualizations.</p>
            
            <h3>Key Performance Indicators (KPIs)</h3>
            <ul>
                <li><strong>Trainees in Training:</strong> Total number of pilots currently in any training phase (GS+SIM or Line Training).</li>
                <li><strong>Trainer Utilization:</strong> Percentage of available trainer capacity being used. Target range: 80-90% for optimal efficiency.</li>
                <li><strong>Upcoming Completions:</strong> Number of trainees who will complete all training phases within the next 3 months.</li>
                <li><strong>Capacity Warnings:</strong> Number of future periods where trainer demand exceeds available supply.</li>
            </ul>
            
            <h3>Charts Explained</h3>
            <h4>Trainer Demand Over Time</h4>
            <p>Shows projected trainer demand compared to available supply. Red areas indicate shortages.</p>
            
            <h4>Supply & Demand Overview</h4>
            <p>Visualizes the balance between trainer capacity and training demand across all categories.</p>
            
            <h4>Heat Map (Enhanced Dashboard)</h4>
            <p>Monthly utilization by trainer category. Colors indicate:</p>
            <ul>
                <li>🟢 Green: 0-60% (Underutilized)</li>
                <li>🔵 Blue: 60-80% (Optimal)</li>
                <li>🟡 Amber: 80-100% (High utilization)</li>
                <li>🔴 Red: >100% (Over capacity)</li>
            </ul>
            
            <div class="help-warning">
                <strong>⚠️ Warning:</strong> Utilization over 100% means you don't have enough trainers to meet demand. Consider cross-location training or adjusting cohort schedules.
            </div>
        `
    },
    'planner': {
        title: 'Training Planner',
        content: `
            <h2>Training Planner Guide</h2>
            <p>The Planner is where you schedule training cohorts and analyze capacity.</p>
            
            <h3>Adding Cohorts</h3>
            <h4>Individual Entry</h4>
            <ol>
                <li>Enter the number of trainees</li>
                <li>Select a pathway (CP, FO, or CAD)</li>
                <li>Choose start year and fortnight</li>
                <li>Click "Add Cohort"</li>
            </ol>
            
            <h4>Bulk Entry Options</h4>
            <ul>
                <li><strong>Grid Entry:</strong> Excel-like interface for quick data entry. You can paste from spreadsheets!</li>
                <li><strong>Target Optimizer:</strong> Set pilot targets and let the system optimize the schedule.</li>
                <li><strong>Bulk Input:</strong> Enter multiple cohorts using natural language (e.g., "Jan 2025: 12 FO, 8 CP").</li>
            </ul>
            
            <h3>Gantt Chart (Visual Timeline)</h3>
            <p>Interactive timeline displaying all scheduled training cohorts:</p>
            <ul>
                <li><strong>Blue bars:</strong> Ground School + Simulator phases (no trainer required)</li>
                <li><strong>Green bars:</strong> Line Training phases (requires 1:1 trainer-to-trainee ratio)</li>
                <li><strong>🏁 Flag icons:</strong> Indicates cross-location training (using trainers from other location)</li>
                <li><strong>Drag & Drop:</strong> Click and drag cohort bars to reschedule</li>
            </ul>
            
            <div class="help-tip">
                <strong>💡 Drag & Drop:</strong> You can drag cohorts on the Gantt chart to reschedule them. The system will recalculate demand automatically.
            </div>
            
            <h3>Reading the Tables</h3>
            <h4>Demand Table</h4>
            <p>Shows trainer requirements by category and time period. Use "Split by Location" to see local vs. cross-location demand.</p>
            
            <h4>Surplus/Deficit Analysis</h4>
            <p>Shows whether you have enough trainers:</p>
            <ul>
                <li>Positive numbers (green): Surplus capacity</li>
                <li>Negative numbers (red): Trainer shortage</li>
            </ul>
        `
    },
    'settings': {
        title: 'Settings',
        content: `
            <h2>Settings Configuration</h2>
            <p>Customize the application to match your organization's training structure.</p>
            
            <h3>Priority Settings</h3>
            <p>Defines how trainers are allocated when demand exceeds supply:</p>
            <ol>
                <li><strong>P1 (LT-CAD):</strong> Highest priority, served by CATB/CATA/STP only</li>
                <li><strong>P2 (LT-CP):</strong> Served by RHS, with overflow from P1 trainers</li>
                <li><strong>P3 (LT-FO):</strong> Served by LHS, with overflow from all other trainers</li>
            </ol>
            
            <h3>Training Pathways</h3>
            <p>Configure training programs with their phases:</p>
            <ul>
                <li><strong>CP (Captain):</strong> Shortest pathway, typically 3-8 fortnights</li>
                <li><strong>FO (First Officer):</strong> Medium pathway, typically 11 fortnights</li>
                <li><strong>CAD (Cadet):</strong> Longest pathway, typically 8-12 fortnights</li>
            </ul>
            
            <h3>FTE Management</h3>
            <p>Set trainer capacity by year and category:</p>
            <ul>
                <li><strong>Annual FTE:</strong> Enter yearly values (e.g., 240)</li>
                <li><strong>Fortnightly FTE:</strong> Automatically calculated (Annual ÷ 24)</li>
                <li><strong>Quick Fill:</strong> Use buttons to rapidly configure multiple years</li>
            </ul>
            
            <div class="help-example">
                <strong>Example FTE Calculation:</strong><br>
                Annual FTE: 240<br>
                Fortnightly FTE: 240 ÷ 24 = 10<br>
                This means 10 trainers available each fortnight
            </div>
        `
    },
    'scenarios': {
        title: 'Scenarios',
        content: `
            <h2>Scenario Management</h2>
            <p>Save and compare different training plans to make informed decisions.</p>
            
            <h3>Creating Scenarios</h3>
            <ol>
                <li>Set up your cohorts, FTE, and pathways</li>
                <li>Click "Save As New Scenario"</li>
                <li>Give it a descriptive name (e.g., "Q1 2025 Aggressive Plan")</li>
                <li>Add optional notes about assumptions</li>
            </ol>
            
            <h3>Working with Scenarios</h3>
            <ul>
                <li><strong>Load:</strong> Apply a saved scenario to continue working on it</li>
                <li><strong>Update:</strong> Save changes to the current scenario</li>
                <li><strong>Duplicate:</strong> Create a copy to test variations</li>
                <li><strong>Compare:</strong> See differences between two scenarios</li>
                <li><strong>Export/Import:</strong> Share scenarios or backup your work</li>
            </ul>
            
            <h3>Best Practices</h3>
            <ul>
                <li>Create a baseline scenario with current plans</li>
                <li>Test "what-if" scenarios for different growth rates</li>
                <li>Document key assumptions in the description</li>
                <li>Export important scenarios for backup</li>
            </ul>
            
            <div class="help-tip">
                <strong>💡 Pro Tip:</strong> Use descriptive names like "Conservative-NoGrowth-2025" or "Aggressive-20%-Growth" to quickly identify scenarios later.
            </div>
        `
    },
    'calculations': {
        title: 'Calculations Explained',
        content: `
            <h2>How Calculations Work</h2>
            <p>Understanding the math behind the planner helps you make better decisions.</p>
            
            <h3>Supply Calculation</h3>
            <div class="help-calculator" id="supply-calc">
                <h4>FTE to Fortnightly Capacity</h4>
                <div class="calc-input">
                    <label>Annual FTE per Category:</label>
                    <input type="number" id="calc-annual-fte" value="240" min="0">
                </div>
                <div class="calc-input">
                    <label>Number of Categories:</label>
                    <input type="number" id="calc-categories" value="5" min="1" max="5">
                </div>
                <button class="btn btn-secondary" onclick="calculateSupplyExample()">Calculate</button>
                <div class="calc-result" id="supply-result" style="display:none;"></div>
            </div>
            
            <h3>Demand Calculation</h3>
            <div class="help-example">
                <strong>Example:</strong><br>
                Cohort: 12 FO trainees in Line Training<br>
                Trainer Ratio: 1:1<br>
                Demand: 12 × 1 = 12 FTE<br><br>
                Multiple cohorts in the same period add up.
            </div>
            
            <h3>Utilization Formula</h3>
            <code>Utilization % = (Total Demand ÷ Total Supply) × 100</code>
            
            <h3>Cross-Location Training</h3>
            <p>When NZ uses AU trainers:</p>
            <ol>
                <li>Demand is added to AU's total</li>
                <li>Demand is subtracted from NZ's local demand</li>
                <li>Both locations see the impact in their tables</li>
            </ol>
            
            <h3>Cascading Allocation</h3>
            <p>When demand exceeds supply for primary trainers:</p>
            <ol>
                <li>P1 (LT-CAD) gets first allocation from CATB/CATA/STP</li>
                <li>P2 (LT-CP) uses RHS first, then surplus from P1 pool</li>
                <li>P3 (LT-FO) uses LHS first, then surplus from all other pools</li>
            </ol>
            
            <div class="help-warning">
                <strong>Important:</strong> The system assumes perfect trainer flexibility within their qualified areas. Real-world constraints (leave, location, qualifications) may reduce effective capacity by 10-20%.
            </div>
        `
    },
    'tips': {
        title: 'Tips & Tricks',
        content: `
            <h2>Tips & Best Practices</h2>
            
            <h3>Capacity Planning</h3>
            <ul>
                <li>🎯 Aim for 80-90% utilization - leaves room for unexpected events</li>
                <li>📅 Plan 3-6 months ahead minimum</li>
                <li>🌊 Consider seasonal variations (holidays, peak travel)</li>
                <li>🔄 Review and adjust monthly</li>
            </ul>
            
            <h3>Cross-Location Training</h3>
            <ul>
                <li>✈️ Use sparingly - travel costs add up quickly</li>
                <li>📍 Best for short-term peak demands</li>
                <li>🗓️ Plan 2-3 months in advance for logistics</li>
                <li>💰 Factor in accommodation and per diem costs</li>
            </ul>
            
            <h3>Optimization Strategies</h3>
            <ul>
                <li>🔀 Stagger cohort starts to smooth demand</li>
                <li>📊 Use the optimizer to find efficient schedules</li>
                <li>🎛️ Adjust pathway durations if flexible</li>
                <li>👥 Consider smaller, more frequent cohorts</li>
            </ul>
            
            <h3>Data Management</h3>
            <ul>
                <li>💾 Save scenarios before major changes</li>
                <li>📝 Document assumptions in scenario descriptions</li>
                <li>📤 Export important scenarios regularly</li>
                <li>🔍 Use descriptive names for easy searching</li>
            </ul>
            
            <h3>Keyboard Shortcuts</h3>
            <ul>
                <li><kbd>F1</kbd> - Open help</li>
                <li><kbd>Ctrl</kbd> + <kbd>S</kbd> - Save current scenario</li>
                <li><kbd>Esc</kbd> - Close modals</li>
            </ul>
            
            <div class="help-tip">
                <strong>🚀 Power User Tip:</strong> Use the bulk input feature with Excel. Copy your planning data from Excel and paste directly into the grid entry tool!
            </div>
        `
    },
    'qa': {
        title: 'Questions & Answers',
        content: `
            <h2>Frequently Asked Questions</h2>
            <div class="qa-search-box">
                <input type="text" id="qa-search" class="qa-search-input" placeholder="Type your question here..." onkeyup="searchQA(this.value)">
            </div>
            <div id="qa-results" class="qa-results"></div>
        `
    }
};

// Q&A Database
const qaDatabase = [
    {
        id: 1,
        questions: [
            "How do I handle trainer shortage?",
            "What to do when demand exceeds supply?",
            "Not enough trainers available",
            "trainer deficit",
            "shortage of trainers"
        ],
        keywords: ["shortage", "deficit", "exceed", "insufficient", "not enough"],
        answer: {
            summary: "When demand exceeds supply, use cross-location training, adjust cohort timing, or optimize allocation priorities.",
            full: `
                <h4>Handling Trainer Shortages - Step by Step</h4>
                <p>When you see red cells in your Surplus/Deficit table, try these solutions in order:</p>
                <ol>
                    <li><strong>Quick Fix - Cross-Location Training:</strong>
                        <ul>
                            <li>Right-click the affected cohort in the Gantt chart</li>
                            <li>Select "Edit Cohort"</li>
                            <li>Enable "Cross-location trainer usage"</li>
                            <li>Select the specific fortnights needing external trainers</li>
                        </ul>
                    </li>
                    <li><strong>Reschedule Cohorts:</strong>
                        <ul>
                            <li>Drag cohorts on the Gantt chart to periods with green (surplus) capacity</li>
                            <li>Consider delaying non-critical training by 1-2 fortnights</li>
                        </ul>
                    </li>
                    <li><strong>Split Large Cohorts:</strong>
                        <ul>
                            <li>Edit cohorts with 10+ trainees</li>
                            <li>Use the "Split Cohort" feature to create smaller groups</li>
                            <li>Stagger their start dates by 2-4 weeks</li>
                        </ul>
                    </li>
                    <li><strong>Long-term Solution:</strong>
                        <ul>
                            <li>Go to Settings → Edit FTE</li>
                            <li>Increase trainer numbers for future years</li>
                            <li>Focus on the trainer categories showing consistent shortages</li>
                        </ul>
                    </li>
                </ol>
                <div class="help-warning">
                    <strong>⚠️ Important:</strong> Cross-location training should be planned 2-3 months in advance to arrange travel and accommodation.
                </div>
            `
        },
        relatedTopics: ["cross-location", "priorities", "optimization"]
    },
    {
        id: 2,
        questions: [
            "How is utilization calculated?",
            "What does utilization percentage mean?",
            "utilization formula",
            "calculate utilization"
        ],
        keywords: ["utilization", "calculate", "percentage", "formula"],
        answer: {
            summary: "Utilization = (Total Demand ÷ Total Supply) × 100%. It shows how much of your trainer capacity is being used.",
            full: `
                <h4>Understanding Utilization</h4>
                <p>Utilization measures how effectively you're using available trainer capacity.</p>
                <div class="help-example">
                    <strong>Formula:</strong> Utilization % = (Demand ÷ Supply) × 100<br><br>
                    <strong>Example:</strong><br>
                    Supply: 50 trainer FTE<br>
                    Demand: 45 trainer FTE<br>
                    Utilization: 45 ÷ 50 × 100 = 90%
                </div>
                <p><strong>Target Ranges:</strong></p>
                <ul>
                    <li>🟢 0-60%: Underutilized (too many trainers)</li>
                    <li>🔵 60-80%: Good flexibility</li>
                    <li>🟡 80-95%: Optimal efficiency</li>
                    <li>🔴 95-100%: Very tight (risky)</li>
                    <li>⚫ >100%: Over capacity (shortage)</li>
                </ul>
            `
        },
        relatedTopics: ["calculations", "supply", "demand"]
    },
    {
        id: 3,
        questions: [
            "What does FTE mean?",
            "What is FTE?",
            "FTE meaning",
            "full time equivalent"
        ],
        keywords: ["FTE", "full-time", "equivalent", "meaning"],
        answer: {
            summary: "FTE (Full-Time Equivalent) is a unit measuring trainer capacity. 1 FTE = 1 full-time trainer working standard hours.",
            full: `
                <h4>FTE (Full-Time Equivalent) Explained</h4>
                <p>FTE is a standardized way to measure workforce capacity:</p>
                <ul>
                    <li>1.0 FTE = 1 full-time trainer</li>
                    <li>0.5 FTE = Half-time trainer</li>
                    <li>2.0 FTE = 2 full-time trainers</li>
                </ul>
                <div class="help-example">
                    <strong>Example:</strong><br>
                    You have:<br>
                    - 10 full-time trainers = 10.0 FTE<br>
                    - 4 half-time trainers = 2.0 FTE<br>
                    - Total capacity = 12.0 FTE
                </div>
                <p><strong>In This System:</strong> Annual FTE is divided by 24 to get fortnightly capacity.</p>
            `
        },
        relatedTopics: ["settings", "calculations"]
    },
    {
        id: 4,
        questions: [
            "How to add multiple cohorts?",
            "Bulk add cohorts",
            "Add many cohorts at once",
            "mass cohort entry"
        ],
        keywords: ["multiple", "bulk", "many", "mass", "cohorts"],
        answer: {
            summary: "Use Training Planner → Grid Entry for Excel-like input, or Bulk Input for text-based entry of multiple cohorts.",
            full: `
                <h4>Adding Multiple Cohorts Efficiently</h4>
                <p>Three methods for bulk cohort entry:</p>
                
                <h5>1. Grid Entry (Recommended)</h5>
                <ul>
                    <li>Click "Training Planner" button</li>
                    <li>Select "Grid Entry" tab</li>
                    <li>Enter numbers in the grid</li>
                    <li>Or paste from Excel!</li>
                </ul>
                
                <h5>2. Bulk Text Input</h5>
                <p>Use natural language like:</p>
                <code>Jan 2025: 12 FO, 8 CP<br>Feb 2025: 10 CAD</code>
                
                <h5>3. Target Optimizer</h5>
                <p>Set total pilot targets and let the system create an optimized schedule.</p>
                
                <div class="help-tip">
                    <strong>Pro Tip:</strong> Copy your training plan from Excel and paste directly into the Grid Entry tool!
                </div>
            `
        },
        relatedTopics: ["planner", "optimization"]
    },
    {
        id: 5,
        questions: [
            "How to set up cross-location training?",
            "Cross location training",
            "Use trainers from another location",
            "borrow trainers"
        ],
        keywords: ["cross-location", "location", "borrow", "another"],
        answer: {
            summary: "Edit a cohort and enable 'cross-location trainer usage', then select which fortnights will use trainers from the other location.",
            full: `
                <h4>Setting Up Cross-Location Training</h4>
                <ol>
                    <li><strong>Edit the cohort:</strong> Right-click on Gantt chart or click edit icon</li>
                    <li><strong>Enable cross-location:</strong> Check "Enable cross-location trainer usage"</li>
                    <li><strong>Select fortnights:</strong> Choose which periods need external trainers</li>
                    <li><strong>Save changes:</strong> System will show flags 🏁 for cross-location periods</li>
                </ol>
                
                <p><strong>Visual Indicators:</strong></p>
                <ul>
                    <li>🏁 Flags on cohort bars</li>
                    <li>Striped pattern in tables</li>
                    <li>Footnotes showing trainer source</li>
                </ul>
                
                <div class="help-warning">
                    <strong>Important:</strong> Cross-location training adds cost and complexity. Use only when necessary and plan 2-3 months ahead.
                </div>
            `
        },
        relatedTopics: ["planner", "tips"]
    },
    {
        id: 6,
        questions: [
            "Why doesn't my math add up?",
            "Numbers don't match",
            "Calculation seems wrong",
            "Math error"
        ],
        keywords: ["math", "add up", "wrong", "error", "match"],
        answer: {
            summary: "Common causes: forgetting fortnightly conversion (÷24), cross-location demand, or cascading allocation effects.",
            full: `
                <h4>Common Calculation Issues</h4>
                
                <h5>1. Annual vs Fortnightly FTE</h5>
                <p>Annual FTE must be divided by 24 for fortnightly capacity:</p>
                <code>240 annual FTE ÷ 24 = 10 fortnightly FTE</code>
                
                <h5>2. Cross-Location Effects</h5>
                <p>Cross-location training appears in both locations:</p>
                <ul>
                    <li>Added to receiving location's demand</li>
                    <li>Subtracted from sending location's demand</li>
                </ul>
                
                <h5>3. Cascading Allocation</h5>
                <p>Trainers cascade from higher to lower priorities, which can make simple math appear wrong.</p>
                
                <h5>4. Rounding</h5>
                <p>The system rounds to whole numbers for display but uses decimals internally.</p>
                
                <div class="help-tip">
                    Check the "Split by Location" view to see local vs cross-location demand separately.
                </div>
            `
        },
        relatedTopics: ["calculations", "cross-location"]
    },
    {
        id: 7,
        questions: [
            "What's the difference between CP, FO, and CAD?",
            "Pathway types explained",
            "What does CP FO CAD mean?",
            "pilot training types"
        ],
        keywords: ["CP", "FO", "CAD", "pathway", "types", "captain", "first officer", "cadet"],
        answer: {
            summary: "CP = Captain upgrade training, FO = First Officer training, CAD = Cadet (ab-initio) training. They differ in duration and complexity.",
            full: `
                <h4>Understanding Training Pathway Types</h4>
                <p>The system supports three standard pilot training pathways:</p>
                
                <h5>🎖️ CP (Captain)</h5>
                <ul>
                    <li><strong>Purpose:</strong> Upgrade experienced First Officers to Captain</li>
                    <li><strong>Duration:</strong> Shortest pathway (typically 3-8 fortnights)</li>
                    <li><strong>Phases:</strong> Brief ground school + simulator, followed by line training</li>
                    <li><strong>Trainer Type:</strong> Requires RHS trainers for line training (P2 priority)</li>
                </ul>
                
                <h5>✈️ FO (First Officer)</h5>
                <ul>
                    <li><strong>Purpose:</strong> Train pilots to become First Officers</li>
                    <li><strong>Duration:</strong> Medium pathway (typically 11 fortnights)</li>
                    <li><strong>Phases:</strong> Moderate ground school + simulator, then line training</li>
                    <li><strong>Trainer Type:</strong> Requires LHS trainers for line training (P3 priority)</li>
                </ul>
                
                <h5>🎓 CAD (Cadet)</h5>
                <ul>
                    <li><strong>Purpose:</strong> Train new pilots from zero experience (ab-initio)</li>
                    <li><strong>Duration:</strong> Longest pathway (typically 8-12 fortnights)</li>
                    <li><strong>Phases:</strong> Extended ground school + simulator, then line training</li>
                    <li><strong>Trainer Type:</strong> Requires specialized CATB/CATA/STP trainers (P1 priority)</li>
                </ul>
                
                <div class="help-tip">
                    <strong>💡 Planning Tip:</strong> CAD training gets first priority for trainer allocation because it requires specialized trainers who can't be substituted.
                </div>
            `
        },
        relatedTopics: ["settings", "priorities", "planner"]
    }
];

// Show help modal
function showHelpModal() {
    const modal = document.getElementById('help-modal');
    modal.style.display = 'flex';
    
    // Load default section
    loadHelpSection('getting-started');
    
    // Focus search box
    document.getElementById('help-search').focus();
}

// Load help section
function loadHelpSection(section) {
    const content = helpContent[section];
    if (!content) return;
    
    const contentDiv = document.getElementById('help-content');
    contentDiv.innerHTML = content.content;
    
    // Update active nav item
    document.querySelectorAll('.help-nav-item').forEach(item => {
        if (item.dataset.section === section) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update state
    helpState.currentSection = section;
    
    // Initialize Q&A if needed
    if (section === 'qa') {
        initializeQA();
    }
}

// Initialize Q&A section
function initializeQA() {
    // Display all questions by default
    displayQAResults(qaDatabase);
}

// Search Q&A
function searchQA(query) {
    if (!query || query.trim() === '') {
        displayQAResults(qaDatabase);
        return;
    }
    
    const results = fuzzySearchQA(query.toLowerCase());
    displayQAResults(results);
}

// Fuzzy search implementation
function fuzzySearchQA(query) {
    const words = query.split(' ').filter(w => w.length > 2);
    
    return qaDatabase.map(qa => {
        let score = 0;
        
        // Check exact matches in questions
        qa.questions.forEach(q => {
            if (q.toLowerCase().includes(query)) {
                score += 10;
            }
            words.forEach(word => {
                if (q.toLowerCase().includes(word)) {
                    score += 3;
                }
            });
        });
        
        // Check keywords
        qa.keywords.forEach(keyword => {
            if (query.includes(keyword)) {
                score += 5;
            }
            words.forEach(word => {
                if (keyword.includes(word) || word.includes(keyword)) {
                    score += 2;
                }
            });
        });
        
        // Check answer content
        const answerText = qa.answer.summary.toLowerCase() + qa.answer.full.toLowerCase();
        words.forEach(word => {
            if (answerText.includes(word)) {
                score += 1;
            }
        });
        
        return { ...qa, score };
    })
    .filter(qa => qa.score > 0)
    .sort((a, b) => b.score - a.score);
}

// Display Q&A results
function displayQAResults(results) {
    const container = document.getElementById('qa-results');
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="qa-item">
                <div class="qa-question">No results found</div>
                <div class="qa-answer">Try rephrasing your question or browse the help sections for more information.</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = results.map(qa => {
        const matchScore = qa.score ? `<span class="qa-match-score">${Math.min(95, qa.score * 5)}% match</span>` : '';
        return `
            <div class="qa-item" onclick="expandQA(${qa.id})">
                <div class="qa-question">
                    ${qa.questions[0]}
                    ${matchScore}
                </div>
                <div class="qa-answer">${qa.answer.summary}</div>
                <div id="qa-full-${qa.id}" style="display: none;">
                    ${qa.answer.full}
                </div>
            </div>
        `;
    }).join('');
}

// Expand Q&A answer
function expandQA(id) {
    const fullAnswer = document.getElementById(`qa-full-${id}`);
    if (fullAnswer) {
        fullAnswer.style.display = fullAnswer.style.display === 'none' ? 'block' : 'none';
    }
}

// Calculate supply example
function calculateSupplyExample() {
    const annualFTE = parseFloat(document.getElementById('calc-annual-fte').value) || 0;
    const categories = parseInt(document.getElementById('calc-categories').value) || 0;
    
    const fortnightlyPerCategory = annualFTE / FORTNIGHTS_PER_YEAR;
    const totalFortnightly = fortnightlyPerCategory * categories;
    
    const resultDiv = document.getElementById('supply-result');
    resultDiv.innerHTML = `
        <strong>Results:</strong><br>
        Annual FTE per category: ${annualFTE}<br>
        Fortnightly FTE per category: ${fortnightlyPerCategory.toFixed(1)}<br>
        Number of categories: ${categories}<br>
        <strong>Total fortnightly capacity: ${totalFortnightly.toFixed(1)} FTE</strong>
    `;
    resultDiv.style.display = 'block';
}

// Help search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Help modal close button
    const helpCloseBtn = document.querySelector('.help-close');
    if (helpCloseBtn) {
        helpCloseBtn.addEventListener('click', function() {
            document.getElementById('help-modal').style.display = 'none';
        });
    }
    
    // Help navigation
    document.querySelectorAll('.help-nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            loadHelpSection(this.dataset.section);
        });
    });
    
    // Help search
    const helpSearchInput = document.getElementById('help-search');
    if (helpSearchInput) {
        let searchTimeout;
        helpSearchInput.addEventListener('keyup', function(e) {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    searchHelp(query);
                }, 300);
            } else if (query.length === 0) {
                // Load current section again
                loadHelpSection(helpState.currentSection);
            }
        });
    }
    
    // F1 key to open help
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F1') {
            e.preventDefault();
            showHelpModal();
        }
    });
    
    // Start tour button
    const tourBtn = document.getElementById('help-tour-btn');
    if (tourBtn) {
        tourBtn.addEventListener('click', startInteractiveTour);
    }
});

// Interactive tour functionality
function startInteractiveTour() {
    showNotification('Interactive tour coming soon!', 'info');
    // TODO: Implement interactive tour using intro.js style functionality
}

// Search help content

// Search help content
function searchHelp(query) {
    const results = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    // Search through all help content
    Object.entries(helpContent).forEach(([key, section]) => {
        const text = (section.title + ' ' + section.content).toLowerCase();
        let score = 0;
        
        searchTerms.forEach(term => {
            const matches = (text.match(new RegExp(term, 'g')) || []).length;
            score += matches;
        });
        
        if (score > 0) {
            results.push({
                section: key,
                title: section.title,
                score: score,
                preview: extractPreview(section.content, searchTerms[0])
            });
        }
    });
    
    // Display search results
    displaySearchResults(results.sort((a, b) => b.score - a.score));
}

// Extract preview text around search term
function extractPreview(content, searchTerm) {
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const index = plainText.toLowerCase().indexOf(searchTerm);
    
    if (index === -1) return plainText.substring(0, 150) + '...';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(plainText.length, index + 100);
    
    return '...' + plainText.substring(start, end) + '...';
}

// Display search results
function displaySearchResults(results) {
    const contentDiv = document.getElementById('help-content');
    
    if (results.length === 0) {
        contentDiv.innerHTML = `
            <h2>No Results Found</h2>
            <p>No help topics found for your search. Try different keywords or browse the sections on the left.</p>
        `;
        return;
    }
    
    contentDiv.innerHTML = `
        <h2>Search Results</h2>
        <p>Found ${results.length} results:</p>
        ${results.map(result => `
            <div class="help-search-result" onclick="loadHelpSection('${result.section}')">
                <h3>${result.title}</h3>
                <p>${result.preview}</p>
            </div>
        `).join('')}
    `;
}

// Add help icon tooltip
window.addEventListener('load', function() {
    const helpIcon = document.getElementById('help-icon');
    if (helpIcon) {
        helpIcon.setAttribute('title', 'Help (F1)');
    }
});

// ============= SMART OPTIMIZER FUNCTIONS =============

function handleSmartOptimization() {
    // Get input values
    const targets = {
        CP: parseInt(document.getElementById('smart-target-cp').value) || 0,
        FO: parseInt(document.getElementById('smart-target-fo').value) || 0,
        CAD: parseInt(document.getElementById('smart-target-cad').value) || 0
    };
    
    const targetDateStr = document.getElementById('smart-target-date').value;
    if (!targetDateStr) {
        showNotification('Please select a target date', 'error');
        return;
    }
    
    const targetDate = new Date(targetDateStr);
    
    // Validate inputs
    if (targets.CP === 0 && targets.FO === 0 && targets.CAD === 0) {
        showNotification('Please enter at least one target', 'error');
        return;
    }
    
    // Show loading state
    const smartInputPhase = document.getElementById('smart-input-phase');
    const smartResultsPhase = document.getElementById('smart-results-phase');
    const smartOptionsPhase = document.getElementById('smart-options-phase');
    
    smartInputPhase.style.display = 'none';
    smartResultsPhase.style.display = 'block';
    smartResultsPhase.innerHTML = '<div class="loading">⏳ Analyzing capacity constraints...</div>';
    
    // Perform analysis
    setTimeout(() => {
        const analysis = calculatePartialAchievement(targets, targetDate);
        displaySmartResults(analysis);
    }, 500);
}

function calculatePartialAchievement(targets, targetDate) {
    const results = {
        achievableByTarget: {},
        remainingAfterTarget: {},
        completionDates: {},
        bottlenecks: [],
        options: []
    };
    
    // For each pilot type, calculate what's achievable
    Object.entries(targets).forEach(([type, target]) => {
        if (target === 0) return;
        
        const pathway = pathways.find(p => p.type === type);
        if (!pathway) return;
        
        // Calculate training duration
        const totalDuration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
        
        // Calculate latest start date to meet target
        const latestStart = new Date(targetDate);
        latestStart.setMonth(latestStart.getMonth() - Math.ceil(totalDuration * 14 / 30));
        
        // Use existing optimizer to calculate capacity
        const tempTargets = { CP: 0, FO: 0, CAD: 0 };
        tempTargets[type] = target;
        
        const schedule = calculateOptimalSchedule(tempTargets, targetDate, true, false);
        
        // Analyze results
        const achievable = schedule.partialSchedule ? 
            schedule.partialSchedule.filter(c => c.type === type).reduce((sum, c) => sum + c.numTrainees, 0) : 
            target;
        
        results.achievableByTarget[type] = {
            target: target,
            achievable: achievable,
            percentage: Math.round((achievable / target) * 100)
        };
        
        if (achievable < target) {
            const remaining = target - achievable;
            results.remainingAfterTarget[type] = {
                count: remaining,
                monthsNeeded: Math.ceil(remaining / 4) // Assume 4 trainees per month capacity
            };
            
            // Identify bottlenecks
            if (type === 'CAD') {
                results.bottlenecks.push('Limited CATB/CATA/STP trainer capacity');
            } else if (type === 'FO') {
                results.bottlenecks.push('LT-FO trainer capacity after higher priorities');
            }
        }
    });
    
    // Generate options
    results.options = generateSmartOptions(results, targets, targetDate);
    
    return results;
}

function generateSmartOptions(analysis, targets, targetDate) {
    const options = [];
    const currentLocation = document.querySelector('.location-tab.active')?.dataset.location || 'AU';
    
    // Option 1: Accept partial achievement
    options.push({
        id: 'partial',
        name: 'Work with Available Capacity',
        description: generatePartialDescription(analysis),
        pros: ['No additional costs', 'Minimal disruption', 'Uses existing resources'],
        cons: ['Extended timeline', 'Partial target achievement'],
        achievable: analysis.achievableByTarget
    });
    
    // Option 2: Cross-location (NZ only)
    if (currentLocation === 'NZ') {
        const crossLocationCapacity = calculateCrossLocationCapacity(analysis, targets);
        if (crossLocationCapacity.viable) {
            options.push({
                id: 'cross-location',
                name: 'Enable Cross-Location Training',
                description: `Send ${crossLocationCapacity.traineeCount} trainees to AU for training`,
                pros: ['100% target achievement possible', 'Leverages AU capacity'],
                cons: [`Additional cost: ~$${crossLocationCapacity.estimatedCost.toLocaleString()}`, 'Operational complexity'],
                achievable: crossLocationCapacity.achievable
            });
        }
    }
    
    // Option 3: Adjust priorities
    options.push({
        id: 'adjust',
        name: 'Adjust Training Priorities',
        description: 'Reduce other targets to prioritize specific pilot types',
        pros: ['Flexible approach', 'No additional costs'],
        cons: ['Compromises other goals', 'Requires re-planning'],
        achievable: analysis.achievableByTarget
    });
    
    return options;
}

function generatePartialDescription(analysis) {
    let desc = [];
    Object.entries(analysis.achievableByTarget).forEach(([type, data]) => {
        if (data.percentage < 100) {
            desc.push(`${data.percentage}% of ${type} target by deadline`);
            if (analysis.remainingAfterTarget[type]) {
                desc.push(`Remaining ${analysis.remainingAfterTarget[type].count} ${type} complete in +${analysis.remainingAfterTarget[type].monthsNeeded} months`);
            }
        }
    });
    return desc.join(', ');
}

function calculateCrossLocationCapacity(analysis, targets) {
    // Simplified calculation - in real implementation would check AU capacity
    const deficit = Object.entries(analysis.achievableByTarget)
        .reduce((sum, [type, data]) => sum + (data.target - data.achievable), 0);
    
    return {
        viable: deficit > 0,
        traineeCount: deficit,
        estimatedCost: deficit * 20000, // $20k per trainee estimate
        achievable: targets // Assume full achievement with cross-location
    };
}

function displaySmartResults(analysis) {
    const smartResultsPhase = document.getElementById('smart-results-phase');
    const smartOptionsPhase = document.getElementById('smart-options-phase');
    
    // Determine overall feasibility
    const totalAchievable = Object.values(analysis.achievableByTarget)
        .reduce((sum, data) => sum + data.percentage, 0) / Object.keys(analysis.achievableByTarget).length;
    
    const feasibilityClass = totalAchievable === 100 ? 'full' : totalAchievable > 0 ? 'partial' : 'not-feasible';
    const feasibilityText = totalAchievable === 100 ? '✅ Fully Achievable' : totalAchievable > 0 ? '🟡 Partial Achievement Possible' : '❌ Not Feasible';
    
    // Build results HTML
    let html = `
        <div class="smart-results-summary">
            <div class="feasibility-badge ${feasibilityClass}">
                ${feasibilityText}
            </div>
            
            <h4>By your target date:</h4>
            <ul class="achievement-list">
    `;
    
    Object.entries(analysis.achievableByTarget).forEach(([type, data]) => {
        const statusClass = data.percentage === 100 ? 'complete' : 'partial';
        const statusIcon = data.percentage === 100 ? '✓' : '⚠️';
        html += `
            <li class="achievement-item">
                <span class="achievement-label">${type === 'CP' ? 'Captains' : type === 'FO' ? 'First Officers' : 'Cadets'}:</span>
                <span class="achievement-status ${statusClass}">
                    ${data.achievable}/${data.target} (${data.percentage}%) ${statusIcon}
                </span>
            </li>
        `;
    });
    
    html += '</ul>';
    
    // Add completion timeline for remainder
    if (Object.keys(analysis.remainingAfterTarget).length > 0) {
        html += '<h4>Complete picture:</h4><ul class="completion-timeline">';
        Object.entries(analysis.remainingAfterTarget).forEach(([type, data]) => {
            html += `<li>• ${data.count} ${type} will complete in +${data.monthsNeeded} months</li>`;
        });
        html += '</ul>';
    }
    
    // Add bottlenecks if any
    if (analysis.bottlenecks.length > 0) {
        html += '<h4>Key constraints:</h4><ul class="bottleneck-list">';
        analysis.bottlenecks.forEach(bottleneck => {
            html += `<li>• ${bottleneck}</li>`;
        });
        html += '</ul>';
    }
    
    html += `
            <div class="action-buttons" style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="btn btn-secondary" onclick="showSmartDetails()">See Why</button>
                <button class="btn btn-primary" onclick="showSmartOptions()">View Options</button>
                <button class="btn btn-secondary" onclick="acceptPartialSchedule()">Accept & Schedule</button>
            </div>
        </div>
    `;
    
    smartResultsPhase.innerHTML = html;
    
    // Store analysis for later use
    window.currentSmartAnalysis = analysis;
}

function showSmartOptions() {
    const smartOptionsPhase = document.getElementById('smart-options-phase');
    const analysis = window.currentSmartAnalysis;
    
    if (!analysis || !analysis.options) return;
    
    let html = '<h3>Your Options</h3><div class="smart-options-container">';
    
    analysis.options.forEach((option, index) => {
        html += `
            <div class="smart-option-card" data-option-id="${option.id}">
                <h4>Option ${index + 1}: ${option.name}</h4>
                <p>${option.description}</p>
                
                <div class="option-pros-cons">
                    <div class="pros">
                        <h5 style="color: #28a745;">✓ Pros:</h5>
                        <ul class="pros-list">
                            ${option.pros.map(pro => `<li>${pro}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="cons">
                        <h5 style="color: #dc3545;">✗ Cons:</h5>
                        <ul class="cons-list">
                            ${option.cons.map(con => `<li>${con}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <button class="btn btn-primary" style="margin-top: 15px;" onclick="selectSmartOption('${option.id}')">
                    Select This Option
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    
    smartOptionsPhase.innerHTML = html;
    smartOptionsPhase.style.display = 'block';
    
    // Scroll to options
    smartOptionsPhase.scrollIntoView({ behavior: 'smooth' });
}

function selectSmartOption(optionId) {
    const analysis = window.currentSmartAnalysis;
    const option = analysis.options.find(o => o.id === optionId);
    
    if (!option) return;
    
    // Handle different option types
    switch (optionId) {
        case 'partial':
            acceptPartialSchedule();
            break;
        case 'cross-location':
            enableCrossLocationSchedule();
            break;
        case 'adjust':
            showTargetAdjustment();
            break;
    }
}

function acceptPartialSchedule() {
    // Use the existing optimizer with the achievable targets
    const analysis = window.currentSmartAnalysis;
    const achievableTargets = {
        CP: analysis.achievableByTarget.CP?.achievable || 0,
        FO: analysis.achievableByTarget.FO?.achievable || 0,
        CAD: analysis.achievableByTarget.CAD?.achievable || 0
    };
    
    // Switch to regular optimizer tab and populate with achievable values
    switchPlannerTab('target');
    document.getElementById('target-cp').value = achievableTargets.CP;
    document.getElementById('target-fo').value = achievableTargets.FO;
    document.getElementById('target-cad').value = achievableTargets.CAD;
    
    // Trigger optimization
    document.getElementById('target-form').dispatchEvent(new Event('submit'));
    
    showNotification('Partial schedule loaded in optimizer', 'success');
}

function showSmartDetails() {
    // Show detailed breakdown of why targets can't be met
    showNotification('Detailed analysis coming soon', 'info');
}

function enableCrossLocationSchedule() {
    showNotification('Cross-location scheduling coming soon', 'info');
}

function showTargetAdjustment() {
    showNotification('Target adjustment coming soon', 'info');
}



// ============= DEFICIT RESOLUTION ASSISTANT FUNCTIONS =============

function initializeDeficitDetection() {
    // Initial check with delay to ensure DOM is ready
    setTimeout(() => {
        // console.log('[initializeDeficitDetection] Running initial deficit check');
        checkForDeficits();
    }, 500);
    
    // Check for deficits periodically
    setInterval(checkForDeficits, 30000); // Check every 30 seconds
}

function checkForDeficits() {
    // Ensure we're using the correct location data
    const currentLocation = document.querySelector('.location-tab.active')?.dataset.location || 'AU';
    
    // Debug logging
    // console.log(`[checkForDeficits] Current location: ${currentLocation}`);
    
    // Sync global variables with location data before calculating
    if (locationData && locationData[currentLocation]) {
        pathways = locationData[currentLocation].pathways || pathways;
        trainerFTE = locationData[currentLocation].trainerFTE || trainerFTE;
        priorityConfig = locationData[currentLocation].priorityConfig || priorityConfig;
        activeCohorts = locationData[currentLocation].activeCohorts || activeCohorts;
        
        // console.log(`[checkForDeficits] Active cohorts for ${currentLocation}:`, activeCohorts.length);
        // console.log(`[checkForDeficits] Trainer FTE for ${currentLocation}:`, trainerFTE);
    }
    
    const { demand } = calculateDemand();
    const deficits = analyzeDeficitsWithCascading(demand);
    
    // console.log(`[checkForDeficits] Found ${deficits.length} deficit periods for ${currentLocation}`);
    if (deficits.length > 0) {
        // console.log(`[checkForDeficits] First deficit:`, deficits[0]);
    }
    
    const resolveDeficitsBtn = document.getElementById('resolve-deficits-btn');
    if (!resolveDeficitsBtn) {
        // console.log('[checkForDeficits] No resolve deficits button found');
        return;
    }
    
    if (deficits.length > 0) {
        // Count deficits by type
        const deficitCounts = { CAD: 0, CP: 0, FO: 0 };
        let totalDeficitPeriods = 0;
        
        deficits.forEach(deficit => {
            totalDeficitPeriods++;
            Object.entries(deficit.deficitsByType).forEach(([type, data]) => {
                if (type === 'LT-CAD') deficitCounts.CAD++;
                else if (type === 'LT-CP') deficitCounts.CP++;
                else if (type === 'LT-FO') deficitCounts.FO++;
            });
        });
        
        // Update button text and show it
        const buttonText = resolveDeficitsBtn.querySelector('.toggle-view-text');
        if (buttonText) {
            buttonText.textContent = `Resolve ${totalDeficitPeriods} Deficits`;
        }
        
        // Add deficit count badge and show button
        resolveDeficitsBtn.setAttribute('data-deficit-count', totalDeficitPeriods);
        resolveDeficitsBtn.style.display = 'inline-flex';
        
        // Store deficits for later use
        window.currentDeficits = deficits;
    } else {
        resolveDeficitsBtn.style.display = 'none';
        window.currentDeficits = [];
    }
}

function analyzeDeficitsWithCascading(demand) {
    const deficits = [];
    
    Object.keys(demand).forEach(year => {
        Object.keys(demand[year]).forEach(fortnight => {
            const period = demand[year][fortnight];
            if (!period || !period.unallocated) return;
            
            const hasDeficit = Object.values(period.unallocated).some(val => val > 0);
            if (!hasDeficit) return;
            
            const analysis = {
                year: parseInt(year),
                fortnight: parseInt(fortnight),
                deficitsByType: {},
                bottlenecks: [],
                cascadeImpact: {}
            };
            
            // Analyze each deficit type
            Object.entries(period.unallocated).forEach(([type, amount]) => {
                if (amount > 0) {
                    analysis.deficitsByType[type] = {
                        deficit: amount,
                        reason: getDeficitReason(type, period),
                        canResolveWith: getResolverTrainers(type)
                    };
                }
            });
            
            // Identify bottlenecks
            if (period.unallocated['LT-CAD'] > 0) {
                analysis.bottlenecks.push('CAD-qualified trainers (CATB/CATA/STP)');
            }
            if (period.unallocated['LT-CP'] > 0 && period.allocated.RHS >= (trainerFTE[year]?.RHS || 0) / FORTNIGHTS_PER_YEAR) {
                analysis.bottlenecks.push('RHS trainers at capacity');
            }
            if (period.unallocated['LT-FO'] > 0) {
                analysis.bottlenecks.push('Cascading shortage from higher priorities');
            }
            
            deficits.push(analysis);
        });
    });
    
    return deficits.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.fortnight - b.fortnight;
    });
}

function getDeficitReason(type, period) {
    switch (type) {
        case 'LT-CAD':
            return 'Insufficient CATB/CATA/STP trainers';
        case 'LT-CP':
            const rhsCapacity = (trainerFTE[period.year]?.RHS || 0) / FORTNIGHTS_PER_YEAR;
            const rhsUsed = period.allocated?.RHS || 0;
            return rhsUsed >= rhsCapacity ? 'RHS at capacity and no CAD surplus' : 'Total CP capacity exceeded';
        case 'LT-FO':
            return 'Insufficient capacity after higher priorities';
        default:
            return 'Unknown deficit type';
    }
}

function getResolverTrainers(type) {
    switch (type) {
        case 'LT-CAD':
            return ['CATB', 'CATA', 'STP'];
        case 'LT-CP':
            return ['RHS', 'CATB', 'CATA', 'STP'];
        case 'LT-FO':
            return 'Any trainer type';
        default:
            return [];
    }
}

function showDeficitResolution() {
    const modal = document.getElementById('deficit-resolution-modal');
    if (!modal || !window.currentDeficits) return;
    
    modal.style.display = 'block';
    
    // Display deficit analysis with detailed information
    displayDetailedDeficitAnalysis();
    
    // Show initial message to click on deficit cells
    const deficitSolutions = document.getElementById('deficit-solutions');
    deficitSolutions.innerHTML = `
        <div class="initial-message">
            <h3>Click on any red deficit cell above to see cohorts affecting that period</h3>
            <p>This will show you exactly which cohorts have line training during that deficit period and suggest the best moves to resolve it.</p>
        </div>
    `;
    
    // Initialize preview functionality
    initializeDeficitPreview();
}

// Show cohorts affecting a specific period when deficit cell is clicked
window.showCohortsForPeriod = function(year, fortnight) {
    const currentLocation = document.querySelector('.location-tab.active')?.dataset.location || 'AU';
    const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
    const pathways = (locationData && currentLocation && locationData[currentLocation]?.pathways) || window.pathways;
    
    // console.log(`Checking cohorts for ${year} FN${fortnight}, found ${cohorts.length} total cohorts`);
    
    // Find all cohorts that have line training in this specific period
    const affectingCohorts = [];
    const nonMoveableCohorts = [];
    
    cohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) {
            // console.log(`No pathway found for cohort ${cohort.id} with pathwayId ${cohort.pathwayId}`);
            return;
        }
        
        // Calculate line training periods for this cohort
        const ltPeriods = calculateLineTrainingPeriodsForCohort(cohort, pathway);
        
        if (ltPeriods.length > 0) {
            // console.log(`Cohort ${cohort.id} (${pathway.name}) has ${ltPeriods.length} LT periods`);
        }
        
        // Check if any line training period matches our target period
        const hasLTInPeriod = ltPeriods.some(lt => 
            lt.year === year && lt.fortnight === fortnight
        );
        
        if (hasLTInPeriod) {
            // console.log(`Cohort ${cohort.id} has LT in ${year} FN${fortnight}`);
            
            // Check if cohort is moveable
            const isMoveable = isCohortMoveable(cohort);
            // console.log(`Cohort ${cohort.id} moveable: ${isMoveable} (starts ${cohort.startYear} FN${cohort.startFortnight})`);
            
            if (isMoveable) {
                affectingCohorts.push({
                    cohort: cohort,
                    pathway: pathway,
                    currentStart: formatCohortDate(cohort.startYear, cohort.startFortnight),
                    deficitImpact: cohort.numTrainees,
                    flexible: pathway.type !== 'CP'
                });
            } else {
                nonMoveableCohorts.push(cohort);
                // console.log(`Cohort ${cohort.id} affects this period but is not moveable (starts ${cohort.startYear} FN${cohort.startFortnight})`);
            }
        }
    });
    
    // Update the solutions display
    const deficitSolutions = document.getElementById('deficit-solutions');
    const monthName = MONTHS[Math.floor((fortnight - 1) / 2)];
    
    // console.log(`Found ${affectingCohorts.length} moveable cohorts and ${nonMoveableCohorts.length} non-moveable cohorts`);
    
    if (affectingCohorts.length === 0) {
        let message = `<h3>No moveable cohorts affect ${monthName} ${year} (FN${fortnight})</h3>`;
        
        if (nonMoveableCohorts.length > 0) {
            message += `<p>${nonMoveableCohorts.length} cohort(s) have line training in this period but have already started and cannot be moved.</p>`;
        }
        
        deficitSolutions.innerHTML = `
            <div class="no-cohorts-message">
                ${message}
                <p>The deficit in this period cannot be resolved by moving cohorts. Consider:</p>
                <ul>
                    <li>Adding more trainers for this period</li>
                    <li>Reducing the number of trainees starting around this time</li>
                    <li>Cross-location training from another location</li>
                </ul>
            </div>
        `;
    } else {
        const cohortSolutionsObj = {};
        affectingCohorts.forEach(sol => {
            cohortSolutionsObj[sol.cohort.id] = sol;
        });
        
        // Display cohorts with focus on this specific period
        displayCohortReschedulingUI(cohortSolutionsObj, { year, fortnight, monthName });
    }
    
    // Clear any previous preview
    const previewContent = document.getElementById('preview-content');
    if (previewContent) {
        previewContent.innerHTML = '<div class="preview-placeholder">Select cohorts to see impact</div>';
    }
}

function displayDetailedDeficitAnalysis() {
    const deficitSummaryContent = document.getElementById('deficit-summary-content');
    
    // Calculate total deficit
    let totalDeficit = 0;
    window.currentDeficits.forEach(deficit => {
        Object.values(deficit.deficitsByType).forEach(data => {
            totalDeficit += data.deficit;
        });
    });
    
    // Create a calendar-style view showing current surplus/deficit for affected periods
    let summaryHTML = `
        <div class="deficit-quick-summary">
            <strong>Total deficit: ${totalDeficit} trainers</strong> across ${window.currentDeficits.length} periods. 
            Move cohorts whose line training overlaps with red periods below.
        </div>
        <table class="deficit-calendar-table">
            <thead>
                <tr>
    `;
    
    // Get the range of deficit periods to show
    const deficitFortnights = window.currentDeficits.map(d => ({ year: d.year, fortnight: d.fortnight }));
    deficitFortnights.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.fortnight - b.fortnight;
    });
    
    const firstDeficit = deficitFortnights[0];
    const lastDeficit = deficitFortnights[deficitFortnights.length - 1];
    
    // Calculate range to show (include some buffer before and after)
    let startFortnight = Math.max(1, firstDeficit.fortnight - 2);
    let startYear = firstDeficit.year;
    if (startFortnight < 1) {
        startFortnight += FORTNIGHTS_PER_YEAR;
        startYear--;
    }
    
    // Show enough fortnights to cover all deficits plus some buffer
    const totalFortnightsNeeded = ((lastDeficit.year - startYear) * FORTNIGHTS_PER_YEAR + lastDeficit.fortnight - startFortnight) + 3;
    const fortnightsToShow = Math.max(12, Math.min(24, totalFortnightsNeeded));
    
    for (let i = 0; i < fortnightsToShow; i++) {
        let fortnight = startFortnight + i;
        let year = startYear;
        
        while (fortnight > FORTNIGHTS_PER_YEAR) {
            fortnight -= FORTNIGHTS_PER_YEAR;
            year++;
        }
        
        const monthName = MONTHS[Math.floor((fortnight - 1) / 2)];
        summaryHTML += `<th>FN${fortnight}<br><small>${monthName.substr(0, 3)} ${year}</small></th>`;
    }
    
    summaryHTML += `
                </tr>
            </thead>
            <tbody>
                <tr id="current-deficit-row">
                    <td colspan="${fortnightsToShow}" class="deficit-header-row">Current Deficit/Surplus</td>
                </tr>
                <tr id="current-values-row">
    `;
    
    // Add current values - need to check actual supply/demand for each period
    for (let i = 0; i < fortnightsToShow; i++) {
        let fortnight = startFortnight + i;
        let year = startYear;
        
        while (fortnight > FORTNIGHTS_PER_YEAR) {
            fortnight -= FORTNIGHTS_PER_YEAR;
            year++;
        }
        
        // Calculate the actual supply/deficit for this period
        const result = calculateSupplyDeficit(year, fortnight);
        const value = result.surplus > 0 ? result.surplus : -result.deficit;
        
        const cellClass = value < 0 ? 'deficit-cell clickable' : value > 0 ? 'surplus-cell' : '';
        const clickHandler = value < 0 ? `onclick="showCohortsForPeriod(${year}, ${fortnight})"` : '';
        summaryHTML += `<td class="${cellClass}" data-fortnight="${fortnight}" data-year="${year}" ${clickHandler} title="${value < 0 ? 'Click to see cohorts affecting this period' : ''}">${Math.round(value)}</td>`;
    }
    
    summaryHTML += `
                </tr>
            </tbody>
        </table>
    `;
    
    deficitSummaryContent.innerHTML = summaryHTML;
}

function getReadableCohortName(cohort) {
    const pathway = pathways.find(p => p.id === cohort.pathwayId);
    const pathwayName = pathway ? pathway.name : cohort.pathwayId;
    const cohortName = cohort.name || `${pathwayName} Cohort ${cohort.id}`;
    return cohortName;
}

function generateEnhancedDeficitSolutions(deficits) {
    const currentLocation = document.querySelector('.location-tab.active')?.dataset.location || 'AU';
    
    // Group deficits by month for strategic solutions
    const deficitsByMonth = {};
    const surplusByMonth = {};
    
    // First, analyze all periods to find deficits AND surpluses
    const startYear = Math.min(...deficits.map(d => d.year));
    const endYear = Math.max(...deficits.map(d => d.year));
    
    for (let year = startYear; year <= endYear; year++) {
        for (let fortnight = 1; fortnight <= FORTNIGHTS_PER_YEAR; fortnight++) {
            const result = calculateSupplyDeficit(year, fortnight);
            const monthKey = `${year}-${Math.floor((fortnight - 1) / 2)}`;
            const displayKey = `${MONTHS[Math.floor((fortnight - 1) / 2)]} ${year}`;
            
            if (!deficitsByMonth[monthKey]) {
                deficitsByMonth[monthKey] = {
                    displayName: displayKey,
                    year,
                    month: Math.floor((fortnight - 1) / 2),
                    totalDeficit: 0,
                    cohorts: [],
                    fortnights: []
                };
            }
            
            if (!surplusByMonth[monthKey]) {
                surplusByMonth[monthKey] = {
                    displayName: displayKey,
                    year,
                    month: Math.floor((fortnight - 1) / 2),
                    totalSurplus: 0
                };
            }
            
            // Sum up deficits/surpluses
            const totalDeficit = result.totalDeficitDetail.reduce((sum, d) => sum + Math.max(0, d.deficit), 0);
            const totalSurplus = result.totalDeficitDetail.reduce((sum, d) => sum + Math.max(0, -d.deficit), 0);
            
            if (totalDeficit > 0) {
                deficitsByMonth[monthKey].totalDeficit += totalDeficit;
                deficitsByMonth[monthKey].fortnights.push(fortnight);
                const cohorts = findCohortsInPeriod(year, fortnight);
                cohorts.forEach(c => {
                    if (!deficitsByMonth[monthKey].cohorts.find(existing => existing.id === c.id)) {
                        deficitsByMonth[monthKey].cohorts.push(c);
                    }
                });
            }
            
            if (totalSurplus > 0) {
                surplusByMonth[monthKey].totalSurplus += totalSurplus;
            }
        }
    }
    
    // Generate month-based strategic solutions
    const solutions = [];
    
    Object.entries(deficitsByMonth).forEach(([monthKey, deficitData]) => {
        if (deficitData.totalDeficit === 0) return;
        
        // Find months with surplus capacity
        const availableMonths = Object.entries(surplusByMonth)
            .filter(([key, data]) => data.totalSurplus > 0)
            .sort((a, b) => {
                // Prefer nearby months
                const aDistance = Math.abs(parseInt(a[0].split('-')[0]) * 12 + parseInt(a[0].split('-')[1]) - 
                                         (deficitData.year * 12 + deficitData.month));
                const bDistance = Math.abs(parseInt(b[0].split('-')[0]) * 12 + parseInt(b[0].split('-')[1]) - 
                                         (deficitData.year * 12 + deficitData.month));
                return aDistance - bDistance;
            })
            .slice(0, 3); // Top 3 nearby months with capacity
        
        // Group cohorts by size for solution bundling
        const smallCohorts = deficitData.cohorts.filter(c => c.numTrainees <= 6);
        const mediumCohorts = deficitData.cohorts.filter(c => c.numTrainees > 6 && c.numTrainees <= 12);
        const largeCohorts = deficitData.cohorts.filter(c => c.numTrainees > 12);
        
        // Solution 1: Move multiple small cohorts together
        if (smallCohorts.length > 0 && availableMonths.length > 0) {
            const targetMonth = availableMonths[0];
            const cohortsToMove = smallCohorts.slice(0, Math.min(3, smallCohorts.length));
            const totalTrainees = cohortsToMove.reduce((sum, c) => sum + c.numTrainees, 0);
            
            solutions.push({
                type: 'move-multiple',
                title: `Reschedule ${cohortsToMove.length} small cohorts from ${deficitData.displayName}`,
                description: `Move ${cohortsToMove.map(c => getReadableCohortName(c)).join(', ')} to ${targetMonth[1].displayName}`,
                impact: `Resolves ${Math.round((totalTrainees / deficitData.totalDeficit) * 100)}% of ${deficitData.displayName} deficit`,
                monthlyImpact: {
                    [deficitData.displayName]: -totalTrainees,
                    [targetMonth[1].displayName]: +totalTrainees
                },
                cohortIds: cohortsToMove.map(c => c.id),
                fromMonth: deficitData.displayName,
                toMonth: targetMonth[1].displayName,
                totalTrainees,
                deficitReduction: totalTrainees
            });
        }
        
        // Solution 2: Split large cohorts across months
        if (largeCohorts.length > 0) {
            largeCohorts.forEach(cohort => {
                const halfSize = Math.floor(cohort.numTrainees / 2);
                solutions.push({
                    type: 'split-cohort',
                    title: `Split ${getReadableCohortName(cohort)} across two months`,
                    description: `Keep ${halfSize} trainees in ${deficitData.displayName}, move ${cohort.numTrainees - halfSize} to next month`,
                    impact: `Reduces ${deficitData.displayName} deficit by ${cohort.numTrainees - halfSize} trainees`,
                    monthlyImpact: {
                        [deficitData.displayName]: -(cohort.numTrainees - halfSize),
                        'Next Month': +(cohort.numTrainees - halfSize)
                    },
                    cohortId: cohort.id,
                    splitSize: halfSize,
                    deficitReduction: cohort.numTrainees - halfSize
                });
            });
        }
    });
    
    // Solution 3: Cross-location training (NZ→AU only)
    if (currentLocation === 'NZ') {
        Object.entries(deficitsByMonth).forEach(([monthKey, deficitData]) => {
            if (deficitData.totalDeficit > 0) {
                solutions.push({
                    type: 'cross-location',
                    title: `Use AU trainers for ${deficitData.displayName}`,
                    description: `Send ${Math.round(deficitData.totalDeficit)} NZ trainees to AU for training`,
                    impact: `Completely resolves ${deficitData.displayName} deficit`,
                    monthlyImpact: {
                        [`${deficitData.displayName} (NZ)`]: -deficitData.totalDeficit,
                        [`${deficitData.displayName} (AU)`]: +deficitData.totalDeficit
                    },
                    deficitReduction: deficitData.totalDeficit
                });
            }
        });
    }
    
    // Sort solutions by impact and return top ones
    return solutions.sort((a, b) => b.deficitReduction - a.deficitReduction).slice(0, 6);
}

function findCohortsInPeriod(year, fortnight) {
    const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
    
    return cohorts.filter(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return false;
        
        let currentYear = cohort.startYear;
        let currentFortnight = cohort.startFortnight;
        
        // Check if cohort has line training in this period
        for (const phase of pathway.phases) {
            for (let i = 0; i < phase.duration; i++) {
                if (currentYear === year && currentFortnight === fortnight && phase.trainerDemandType) {
                    return true;
                }
                
                currentFortnight++;
                if (currentFortnight > FORTNIGHTS_PER_YEAR) {
                    currentFortnight = 1;
                    currentYear++;
                }
            }
        }
        
        return false;
    });
}

function displayDeficitSolutions(solutions) {
    const deficitSolutions = document.getElementById('deficit-solutions');
    
    let html = '<h3>Quick Fixes Available:</h3><div class="solutions-container">';
    
    solutions.forEach((solution, index) => {
        html += `
            <div class="solution-card">
                <input type="checkbox" class="solution-checkbox" id="solution-${index}" data-solution-index="${index}">
                <label for="solution-${index}">
                    <strong>${solution.description}</strong>
                    <span class="solution-impact">${solution.impact}</span>
                </label>
            </div>
        `;
    });
    
    html += '</div>';
    
    deficitSolutions.innerHTML = html;
    
    // Store solutions for later use
    window.currentDeficitSolutions = solutions;
    
    // Enable apply button when solutions are selected
    const checkboxes = deficitSolutions.querySelectorAll('.solution-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const anyChecked = Array.from(checkboxes).some(c => c.checked);
            document.getElementById('apply-deficit-solutions').disabled = !anyChecked;
        });
    });
}

function previewDeficitChanges() {
    const selectedIndices = Array.from(document.querySelectorAll('.solution-checkbox:checked'))
        .map(cb => parseInt(cb.dataset.solutionIndex));
    
    if (selectedIndices.length === 0) {
        showNotification('Please select at least one solution', 'warning');
        return;
    }
    
    // Preview the impact of selected solutions
    showNotification('Preview functionality coming soon', 'info');
}

function applyDeficitSolutions() {
    const selectedMoves = [];
    
    // Collect all selected cohort moves
    document.querySelectorAll('.cohort-move-checkbox:checked').forEach(checkbox => {
        const cohortId = checkbox.id.replace('cohort-', '');
        const dateSelect = document.querySelector(`.new-date-select[data-cohort-id="${cohortId}"]`);
        
        if (dateSelect.value) {
            const [year, fortnight] = dateSelect.value.split('-').map(Number);
            selectedMoves.push({
                cohortId: cohortId,
                newYear: year,
                newFortnight: fortnight
            });
        }
    });
    
    if (selectedMoves.length === 0) {
        showNotification('Please select cohorts and new dates', 'warning');
        return;
    }
    
    // Apply all moves
    selectedMoves.forEach(move => {
        moveCohortToDate(move.cohortId, move.newYear, move.newFortnight);
    });
    
    // Close modal and refresh
    document.getElementById('deficit-resolution-modal').style.display = 'none';
    renderAll();
    checkForDeficits();
    
    showNotification(`Successfully rescheduled ${selectedMoves.length} cohort${selectedMoves.length > 1 ? 's' : ''}`, 'success');
}

function moveCohortToDate(cohortId, newYear, newFortnight) {
    const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
    const cohort = cohorts.find(c => c.id == cohortId);
    
    if (cohort) {
        cohort.startYear = newYear;
        cohort.startFortnight = newFortnight;
    }
}

function moveCohort(cohortId, newStartFortnight) {
    const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
    const cohort = cohorts.find(c => c.id === cohortId);
    
    if (cohort) {
        cohort.startFortnight = newStartFortnight;
        if (cohort.startFortnight > FORTNIGHTS_PER_YEAR) {
            cohort.startFortnight = 1;
            cohort.startYear++;
        }
    }
}

function displayEnhancedDeficitSolutions(solutions) {
    const deficitSolutions = document.getElementById('deficit-solutions');
    
    if (solutions.length === 0) {
        deficitSolutions.innerHTML = `
            <div class="no-solutions">
                <p>No automatic solutions available for the current deficits.</p>
                <p>Consider manual adjustments or increasing trainer capacity.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="solutions-header">
            <strong>Recommended Actions:</strong>
            <small style="color: #6c757d; display: block; margin-top: 4px;">
                Select solutions to apply. Preview shows combined impact.
            </small>
        </div>
    `;
    
    solutions.forEach((solution, index) => {
        const badgeColor = solution.type === 'cross-location' ? 'badge-info' : 
                          solution.type === 'move-multiple' ? 'badge-success' : 'badge-warning';
        
        html += `
            <div class="solution-item" data-solution-index="${index}">
                <div class="solution-header">
                    <input type="checkbox" class="solution-checkbox" id="solution-${index}" data-solution-index="${index}">
                    <div class="solution-content">
                        <div class="solution-title-row">
                            <span class="solution-title">${solution.title}</span>
                            <span class="solution-badge ${badgeColor}">${solution.impact}</span>
                        </div>
                        <div class="solution-description">${solution.description}</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    deficitSolutions.innerHTML = html;
    
    // Store solutions for later use
    window.currentSolutions = solutions;
    
    // Add event listeners for solution selection
    const checkboxes = document.querySelectorAll('.solution-checkbox');
    const solutionItems = document.querySelectorAll('.solution-item');
    
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            const applyBtn = document.getElementById('apply-deficit-solutions');
            const selectedSolutions = Array.from(checkboxes).filter(cb => cb.checked);
            applyBtn.disabled = selectedSolutions.length === 0;
            
            // Update solution item styling
            solutionItems[index].classList.toggle('selected', checkbox.checked);
            
            // Update preview
            updateDeficitPreview();
        });
    });
    
    // Add click handlers to solution items (clicking anywhere selects)
    solutionItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                const checkbox = checkboxes[index];
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });
}

function calculateReschedulingImpact(selectedMoves) {
    const impactByPeriod = {};
    
    // Get all deficit periods from the current deficits
    if (window.currentDeficits) {
        window.currentDeficits.forEach(deficit => {
            const key = `${deficit.year}-${deficit.fortnight}`;
            impactByPeriod[key] = {
                year: deficit.year,
                fortnight: deficit.fortnight,
                before: deficit.deficit,
                after: deficit.deficit,
                change: 0
            };
        });
    }
    
    // Calculate the impact of moving cohorts
    selectedMoves.forEach(move => {
        // Find the cohort
        const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
        const cohort = cohorts.find(c => c.id == move.cohortId);
        if (!cohort) return;
        
        const pathways = (locationData && currentLocation && locationData[currentLocation]?.pathways) || window.pathways;
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        // Calculate demand for original and new positions
        pathway.phases.forEach((phase, phaseIndex) => {
            if (phase.trainerDemandType) {
                const demand = Math.ceil(cohort.numTrainees / phase.ratio);
                
                // Remove demand from original fortnights
                let startFortnight = move.originalFortnight;
                for (let i = 0; i < phaseIndex; i++) {
                    startFortnight += pathway.phases[i].duration;
                }
                
                for (let i = 0; i < phase.duration; i++) {
                    const fortnight = startFortnight + i;
                    const year = move.originalYear + Math.floor((fortnight - 1) / FORTNIGHTS_PER_YEAR);
                    const adjustedFortnight = ((fortnight - 1) % FORTNIGHTS_PER_YEAR) + 1;
                    const key = `${year}-${adjustedFortnight}`;
                    
                    if (!impactByPeriod[key]) {
                        impactByPeriod[key] = {
                            year,
                            fortnight: adjustedFortnight,
                            before: 0,
                            after: 0,
                            change: 0
                        };
                    }
                    impactByPeriod[key].after += demand; // Reducing deficit
                    impactByPeriod[key].change += demand;
                }
                
                // Add demand to new fortnights
                startFortnight = move.newFortnight;
                for (let i = 0; i < phaseIndex; i++) {
                    startFortnight += pathway.phases[i].duration;
                }
                
                for (let i = 0; i < phase.duration; i++) {
                    const fortnight = startFortnight + i;
                    const year = move.newYear + Math.floor((fortnight - 1) / FORTNIGHTS_PER_YEAR);
                    const adjustedFortnight = ((fortnight - 1) % FORTNIGHTS_PER_YEAR) + 1;
                    const key = `${year}-${adjustedFortnight}`;
                    
                    if (!impactByPeriod[key]) {
                        impactByPeriod[key] = {
                            year,
                            fortnight: adjustedFortnight,
                            before: 0,
                            after: 0,
                            change: 0
                        };
                    }
                    impactByPeriod[key].after -= demand; // Increasing deficit
                    impactByPeriod[key].change -= demand;
                }
            }
        });
    });
    
    return impactByPeriod;
}

function updateDeficitPreview() {
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) return;
    
    // Get selected cohorts and their new dates
    const selectedMoves = [];
    document.querySelectorAll('.cohort-move-checkbox:checked').forEach(checkbox => {
        const cohortId = checkbox.dataset.cohortId;
        const dateSelect = document.querySelector(`.new-date-select[data-cohort-id="${cohortId}"]`);
        
        if (dateSelect && dateSelect.value) {
            const [year, fortnight] = dateSelect.value.split('-').map(Number);
            const cohortElement = checkbox.closest('.cohort-reschedule-item');
            const cohortName = cohortElement.querySelector('.cohort-info strong').textContent;
            
            selectedMoves.push({
                cohortId,
                cohortName,
                newYear: year,
                newFortnight: fortnight,
                originalYear: parseInt(checkbox.dataset.originalYear),
                originalFortnight: parseInt(checkbox.dataset.originalFortnight)
            });
        }
    });
    
    if (selectedMoves.length === 0) {
        previewContent.innerHTML = '<div class="preview-placeholder">Select cohorts to see impact</div>';
        updateDeficitSummaryTable(null);
        return;
    }
    
    // Show moves summary
    let html = '<div class="moves-summary">';
    selectedMoves.forEach(move => {
        html += `<div class="move-item">Moving ${move.cohortName}: FN${move.originalFortnight} → FN${move.newFortnight}</div>`;
    });
    html += '</div>';
    
    previewContent.innerHTML = html;
    
    // Update the summary table with adjusted values
    updateDeficitSummaryTable(selectedMoves);
    
    // Enable/disable apply button based on selection
    const applyButton = document.getElementById('apply-deficit-solutions');
    if (applyButton) {
        applyButton.disabled = selectedMoves.length === 0;
    }
}

function updateDeficitSummaryTable(selectedMoves) {
    const summaryTable = document.querySelector('.deficit-calendar-table tbody');
    if (!summaryTable) return;
    
    // Remove existing adjustment rows
    const existingAdjustmentRows = summaryTable.querySelectorAll('[id*="adjustment"], [id*="adjusted"]');
    existingAdjustmentRows.forEach(row => row.remove());
    
    if (!selectedMoves || selectedMoves.length === 0) {
        return;
    }
    
    // Calculate impact of moves
    const impactByPeriod = calculateSimpleReschedulingImpact(selectedMoves);
    
    // Get the number of columns from the header
    const headerCells = document.querySelectorAll('.deficit-calendar-table thead th');
    const numColumns = headerCells.length;
    
    // Get the starting fortnight/year from the first header cell
    const firstHeaderText = headerCells[0].textContent;
    const match = firstHeaderText.match(/FN(\d+).*?(\d{4})/);
    let startFortnight = parseInt(match[1]);
    let startYear = parseInt(match[2]);
    
    // Add adjustment row
    let adjustmentHTML = `<tr id="adjustment-row"><td colspan="${numColumns}" class="deficit-header-row impact-header">Impact of Moves</td></tr><tr id="adjustment-values-row">`;
    
    for (let i = 0; i < numColumns; i++) {
        let fortnight = startFortnight + i;
        let year = startYear;
        
        while (fortnight > FORTNIGHTS_PER_YEAR) {
            fortnight -= FORTNIGHTS_PER_YEAR;
            year++;
        }
        
        const key = `${year}-${fortnight}`;
        const impact = impactByPeriod[key] ? impactByPeriod[key].change : 0;
        const cellClass = impact > 0 ? 'improvement-cell' : impact < 0 ? 'worsening-cell' : '';
        const displayValue = impact > 0 ? `+${impact}` : `${impact}`;
        adjustmentHTML += `<td class="${cellClass}">${impact === 0 ? '-' : displayValue}</td>`;
    }
    adjustmentHTML += '</tr>';
    
    // Add adjusted values row
    adjustmentHTML += `<tr id="adjusted-row"><td colspan="${numColumns}" class="deficit-header-row adjusted-header">After Rescheduling</td></tr><tr id="adjusted-values-row">`;
    
    for (let i = 0; i < numColumns; i++) {
        let fortnight = startFortnight + i;
        let year = startYear;
        
        while (fortnight > FORTNIGHTS_PER_YEAR) {
            fortnight -= FORTNIGHTS_PER_YEAR;
            year++;
        }
        
        // Get current value
        const currentCell = summaryTable.querySelector(`[data-fortnight="${fortnight}"][data-year="${year}"]`);
        const currentValue = currentCell ? parseInt(currentCell.textContent) || 0 : 0;
        
        // Calculate adjusted value
        const key = `${year}-${fortnight}`;
        const impact = impactByPeriod[key] ? impactByPeriod[key].change : 0;
        const adjustedValue = currentValue + impact;
        
        const cellClass = adjustedValue < 0 ? 'deficit-cell' : adjustedValue > 0 ? 'surplus-cell' : '';
        adjustmentHTML += `<td class="${cellClass}">${adjustedValue}</td>`;
    }
    adjustmentHTML += '</tr>';
    
    summaryTable.insertAdjacentHTML('beforeend', adjustmentHTML);
}

function calculateSimpleReschedulingImpact(selectedMoves) {
    const impactByPeriod = {};
    const currentLocation = document.querySelector('.location-tab.active')?.dataset.location || 'AU';
    
    selectedMoves.forEach(move => {
        // Find the cohort
        const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
        const cohort = cohorts.find(c => c.id == move.cohortId);
        if (!cohort) return;
        
        const pathways = (locationData && currentLocation && locationData[currentLocation]?.pathways) || window.pathways;
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;
        
        // Calculate which line training phases are affected
        pathway.phases.forEach((phase, phaseIndex) => {
            if (phase.trainersRequired > 0) {
                // Calculate original phase timing
                let phaseStartFortnight = move.originalFortnight;
                for (let i = 0; i < phaseIndex; i++) {
                    phaseStartFortnight += pathway.phases[i].duration;
                }
                
                // Impact for each fortnight in the original training period
                for (let i = 0; i < phase.duration; i++) {
                    let fortnight = phaseStartFortnight + i;
                    let year = move.originalYear;
                    
                    while (fortnight > FORTNIGHTS_PER_YEAR) {
                        fortnight -= FORTNIGHTS_PER_YEAR;
                        year++;
                    }
                    
                    const key = `${year}-${fortnight}`;
                    if (!impactByPeriod[key]) {
                        impactByPeriod[key] = { change: 0 };
                    }
                    // Removing demand from original period (positive impact)
                    impactByPeriod[key].change += cohort.numTrainees * phase.trainersRequired;
                }
                
                // Calculate new phase timing
                phaseStartFortnight = move.newFortnight;
                for (let i = 0; i < phaseIndex; i++) {
                    phaseStartFortnight += pathway.phases[i].duration;
                }
                
                // Impact for each fortnight in the new training period
                for (let i = 0; i < phase.duration; i++) {
                    let fortnight = phaseStartFortnight + i;
                    let year = move.newYear;
                    
                    while (fortnight > FORTNIGHTS_PER_YEAR) {
                        fortnight -= FORTNIGHTS_PER_YEAR;
                        year++;
                    }
                    
                    const key = `${year}-${fortnight}`;
                    if (!impactByPeriod[key]) {
                        impactByPeriod[key] = { change: 0 };
                    }
                    // Adding demand to new period (negative impact)
                    impactByPeriod[key].change -= cohort.numTrainees * phase.trainersRequired;
                }
            }
        });
    });
    
    return impactByPeriod;
}

function initializeDeficitPreview() {
    // Add event listeners for cohort selection changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('cohort-move-checkbox') || 
            e.target.classList.contains('new-date-select')) {
            updateDeficitPreview();
        }
    });
    
    // Initialize preview with current state
    updateDeficitPreview();
}

function updateCohortMovePreview(selectedMoves) {
    const previewContent = document.getElementById('preview-content');
    
    if (!previewContent) return;
    
    if (!selectedMoves || selectedMoves.length === 0) {
        previewContent.innerHTML = '<div class="preview-placeholder">Select cohorts to reschedule to see the impact preview</div>';
        return;
    }
    
    // Calculate fortnight-by-fortnight impact
    const fortnightImpact = {};
    
    // Initialize with current deficits at fortnight level
    window.currentDeficits.forEach(deficit => {
        const fortnightKey = `${deficit.year}-${deficit.fortnight}`;
        const totalDeficit = Object.values(deficit.deficitsByType).reduce((sum, data) => sum + data.deficit, 0);
        fortnightImpact[fortnightKey] = {
            year: deficit.year,
            fortnight: deficit.fortnight,
            currentDeficit: totalDeficit,
            changes: 0
        };
    });
    
    // Apply cohort move impacts
    selectedMoves.forEach(move => {
        // For each move, calculate which fortnights are affected
        const pathway = move.cohort.pathway || pathways.find(p => p.id === move.cohort.pathwayId);
        if (!pathway) return;
        
        // Calculate line training periods for original schedule
        let phases = calculateLineTrainingPeriods(move.cohort, pathway, move.from.year, move.from.fortnight);
        phases.forEach(period => {
            const key = `${period.year}-${period.fortnight}`;
            if (!fortnightImpact[key]) {
                fortnightImpact[key] = { year: period.year, fortnight: period.fortnight, currentDeficit: 0, changes: 0 };
            }
            fortnightImpact[key].changes -= move.impact; // Remove demand from original periods
        });
        
        // Calculate line training periods for new schedule
        phases = calculateLineTrainingPeriods(move.cohort, pathway, move.to.year, move.to.fortnight);
        phases.forEach(period => {
            const key = `${period.year}-${period.fortnight}`;
            if (!fortnightImpact[key]) {
                fortnightImpact[key] = { year: period.year, fortnight: period.fortnight, currentDeficit: 0, changes: 0 };
            }
            fortnightImpact[key].changes += move.impact; // Add demand to new periods
        });
    });
    
    let html = `
        <div class="preview-summary">
            <strong>Impact of moving ${selectedMoves.length} cohort${selectedMoves.length > 1 ? 's' : ''}:</strong>
        </div>
        
        <table class="impact-summary-table">
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Current</th>
                    <th>After Moves</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Sort by year and fortnight
    const sortedPeriods = Object.entries(fortnightImpact)
        .sort((a, b) => {
            const aYear = a[1].year;
            const bYear = b[1].year;
            if (aYear !== bYear) return aYear - bYear;
            return a[1].fortnight - b[1].fortnight;
        })
        .filter(([_, data]) => data.currentDeficit !== 0 || data.changes !== 0);
    
    sortedPeriods.forEach(([key, data]) => {
        const periodLabel = formatCohortDate(data.year, data.fortnight);
        const current = Math.round(data.currentDeficit);
        const afterChanges = Math.round(data.currentDeficit + data.changes);
        let status, statusColor;
        
        if (current > 0) { // Was deficit
            if (afterChanges <= 0) {
                status = 'RESOLVED ✓';
                statusColor = '#28a745';
            } else if (afterChanges < current) {
                status = `IMPROVED (${Math.round((current - afterChanges) / current * 100)}%)`;
                statusColor = '#ffc107';
            } else {
                status = 'WORSENED';
                statusColor = '#dc3545';
            }
        } else { // Was surplus
            if (afterChanges >= 0) {
                status = 'Still OK';
                statusColor = '#28a745';
            } else {
                status = 'NEW DEFICIT';
                statusColor = '#dc3545';
            }
        }
        
        html += `
            <tr>
                <td><strong>${periodLabel}</strong></td>
                <td class="${current > 0 ? 'deficit' : 'surplus'}">${current > 0 ? '-' : '+'}${Math.abs(current)}</td>
                <td class="${afterChanges > 0 ? 'deficit' : 'surplus'}">${afterChanges > 0 ? '-' : '+'}${Math.abs(afterChanges)}</td>
                <td style="color: ${statusColor}; font-weight: 500;">${status}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        
        <div class="preview-notes">
            <strong>Cohorts being moved:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
                ${selectedMoves.map(move => {
                    const cohortName = getReadableCohortName(move.cohort);
                    const fromDate = formatCohortDate(move.from.year, move.from.fortnight);
                    const toDate = formatCohortDate(move.to.year, move.to.fortnight);
                    return `<li>${cohortName} (${move.impact} trainees): ${fromDate} → ${toDate}</li>`;
                }).join('')}
            </ul>
        </div>
    `;
    
    previewContent.innerHTML = html;
}

function calculateLineTrainingPeriods(cohort, pathway, startYear, startFortnight) {
    const periods = [];
    let currentYear = startYear;
    let currentFortnight = startFortnight;
    
    // Go through each phase and find line training periods
    for (const phase of pathway.phases) {
        if (phase.trainerDemandType) {
            // This phase requires trainers
            for (let i = 0; i < phase.duration; i++) {
                periods.push({
                    year: currentYear,
                    fortnight: currentFortnight,
                    type: phase.trainerDemandType
                });
                
                currentFortnight++;
                if (currentFortnight > FORTNIGHTS_PER_YEAR) {
                    currentFortnight = 1;
                    currentYear++;
                }
            }
        } else {
            // Skip non-trainer phases
            for (let i = 0; i < phase.duration; i++) {
                currentFortnight++;
                if (currentFortnight > FORTNIGHTS_PER_YEAR) {
                    currentFortnight = 1;
                    currentYear++;
                }
            }
        }
    }
    
    return periods;
}

function calculateCombinedImpact(selectedSolutions) {
    const impactByPeriod = {};
    
    // Get current deficits
    window.currentDeficits.forEach(deficit => {
        const periodKey = `${MONTHS[Math.floor((deficit.fortnight - 1) / 2)]} ${deficit.year} F${deficit.fortnight}`;
        const totalDeficit = Object.values(deficit.deficitsByType).reduce((sum, data) => sum + data.deficit, 0);
        impactByPeriod[periodKey] = {
            period: periodKey,
            currentDeficit: Math.round(totalDeficit),
            changes: 0
        };
    });
    
    // Apply solution impacts
    selectedSolutions.forEach(solution => {
        if (solution.detailedImpact) {
            if (solution.type === 'move') {
                // Moving reduces demand in 'from' period and increases in 'to' period
                const fromKey = `${MONTHS[Math.floor((solution.detailedImpact.from.fortnight - 1) / 2)]} ${solution.detailedImpact.from.year} F${solution.detailedImpact.from.fortnight}`;
                const toKey = `${MONTHS[Math.floor((solution.detailedImpact.to.fortnight - 1) / 2)]} ${solution.detailedImpact.to.year} F${solution.detailedImpact.to.fortnight}`;
                
                if (impactByPeriod[fromKey]) {
                    impactByPeriod[fromKey].changes -= solution.detailedImpact.from.reduction;
                }
                
                // Initialize 'to' period if it doesn't exist
                if (!impactByPeriod[toKey]) {
                    impactByPeriod[toKey] = {
                        period: toKey,
                        currentDeficit: 0,
                        changes: 0
                    };
                }
                impactByPeriod[toKey].changes += solution.detailedImpact.to.increase;
            } else if (solution.type === 'cross-location') {
                const periodKey = `${MONTHS[Math.floor((solution.period.fortnight - 1) / 2)]} ${solution.period.year} F${solution.period.fortnight}`;
                if (impactByPeriod[periodKey]) {
                    impactByPeriod[periodKey].changes -= solution.detailedImpact.nzReduction;
                }
            } else if (solution.type === 'split') {
                const period1Key = `${MONTHS[Math.floor((solution.detailedImpact.period1.fortnight - 1) / 2)]} ${deficit.year} F${solution.detailedImpact.period1.fortnight}`;
                if (impactByPeriod[period1Key]) {
                    impactByPeriod[period1Key].changes -= solution.detailedImpact.totalReduction;
                }
            }
        }
    });
    
    // Calculate final results
    return Object.values(impactByPeriod).map(period => ({
        period: period.period,
        currentDeficit: period.currentDeficit,
        afterChanges: period.currentDeficit + period.changes,
        improvement: -period.changes // Negative change = improvement (deficit reduction)
    }));
}

// Initialize deficit detection when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Deficit resolution button click handler
    const resolveDeficitsBtn = document.getElementById('resolve-deficits-btn');
    if (resolveDeficitsBtn) {
        resolveDeficitsBtn.addEventListener('click', showDeficitResolution);
    }
    
    // Deficit resolution modal handlers
    const previewBtn = document.getElementById('preview-deficit-changes');
    if (previewBtn) {
        previewBtn.addEventListener('click', previewDeficitChanges);
    }
    
    const applyBtn = document.getElementById('apply-deficit-solutions');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyDeficitSolutions);
    }
    
    // Deficit modal close handlers
    const deficitModal = document.getElementById('deficit-resolution-modal');
    if (deficitModal) {
        const closeBtn = deficitModal.querySelector('.modal-close');
        const cancelBtn = deficitModal.querySelector('.modal-cancel');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                deficitModal.style.display = 'none';
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                deficitModal.style.display = 'none';
            });
        }
        
        // Close on backdrop click
        deficitModal.addEventListener('click', (e) => {
            if (e.target === deficitModal) {
                deficitModal.style.display = 'none';
            }
        });
    }
    
    // Initialize deficit detection after a delay
    setTimeout(initializeDeficitDetection, 2000);
});

// New cohort-specific rescheduling functions
function generateCohortReschedulingSolutions(deficits) {
    const solutions = {};
    const currentLocation = document.querySelector('.location-tab.active')?.dataset.location || 'AU';
    
    // Get all cohorts that contribute to deficits
    const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
    
    // console.log('Analyzing deficits:', deficits.length, 'periods');
    // console.log('Total cohorts to check:', cohorts.length);
    
    // For each cohort, check if it contributes to any deficit period
    cohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId) || 
                       pathways.find(p => p.name === cohort.pathwayId); // Sometimes pathwayId is the name
        if (!pathway) {
            // console.log('No pathway found for cohort:', cohort.name || cohort.id, 'pathwayId:', cohort.pathwayId);
            return;
        }
        
        // Check if cohort is moveable (hasn't started overall training yet)
        if (!isCohortMoveable(cohort)) {
            // console.log('Cohort not moveable:', cohort.name || cohort.id, 'starts:', cohort.startYear, cohort.startFortnight);
            return;
        }
        
        // Check if this cohort has line training during any deficit period
        let contributeToDeficit = false;
        let deficitPeriods = [];
        
        deficits.forEach(deficit => {
            if (cohortHasLineTrainingInPeriod(cohort, pathway, deficit.year, deficit.fortnight)) {
                contributeToDeficit = true;
                deficitPeriods.push(deficit);
            }
        });
        
        if (contributeToDeficit) {
            // console.log('Cohort', cohort.name || cohort.id, 'contributes to deficit');
            
            // Calculate possible move dates
            const possibleMoves = calculatePossibleMoveDates(cohort, pathway, deficitPeriods[0]);
            // console.log('Possible moves for cohort:', possibleMoves.length);
            
            if (possibleMoves.length > 0) {
                solutions[cohort.id] = {
                    cohort: cohort,
                    pathway: pathway,
                    currentStart: formatCohortDate(cohort.startYear, cohort.startFortnight),
                    possibleMoves: possibleMoves,
                    deficitImpact: cohort.numTrainees,
                    flexible: pathway.type !== 'CP', // CP has month-start restrictions
                    deficitPeriods: deficitPeriods
                };
            }
        }
    });
    
    return solutions;
}

function cohortHasLineTrainingInPeriod(cohort, pathway, targetYear, targetFortnight) {
    let currentYear = cohort.startYear;
    let currentFortnight = cohort.startFortnight;
    
    for (const phase of pathway.phases) {
        for (let i = 0; i < phase.duration; i++) {
            // Check if this is a line training phase in the target period
            if (currentYear === targetYear && 
                currentFortnight === targetFortnight && 
                phase.trainerDemandType) {
                return true;
            }
            
            currentFortnight++;
            if (currentFortnight > FORTNIGHTS_PER_YEAR) {
                currentFortnight = 1;
                currentYear++;
            }
        }
    }
    
    return false;
}

function isCohortMoveable(cohort) {
    // For planning purposes, any cohort that hasn't completed training is potentially moveable
    // This is especially important for small deficits (-1, -2) where we need maximum flexibility
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentFortnight = (currentMonth * 2) + (new Date().getDate() >= 15 ? 2 : 1);
    
    // Get the pathway to determine total duration
    const pathway = pathways.find(p => p.name === cohort.pathway);
    if (!pathway) return false;
    
    // Calculate when the cohort will complete training
    const totalDuration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
    let endYear = cohort.startYear;
    let endFortnight = cohort.startFortnight + totalDuration - 1;
    
    // Adjust for year rollover
    while (endFortnight > 24) {
        endFortnight -= 24;
        endYear++;
    }
    
    // If cohort has already completed training, it's not moveable
    if (endYear < currentYear || (endYear === currentYear && endFortnight < currentFortnight)) {
        return false;
    }
    
    // If cohort hasn't started yet, it's definitely moveable
    if (cohort.startYear > currentYear || 
        (cohort.startYear === currentYear && cohort.startFortnight > currentFortnight)) {
        return true;
    }
    
    // For cohorts that have started but not completed:
    // Allow moving if they're still in early phases (GS+SIM) which don't require trainers
    // This gives us more flexibility for resolving small deficits
    const gsSimDuration = pathway.phases
        .filter(phase => phase.requiresTrainer === false)
        .reduce((sum, phase) => sum + phase.duration, 0);
    
    const currentProgress = ((currentYear - cohort.startYear) * 24) + currentFortnight - cohort.startFortnight;
    
    // If still in non-trainer phases, definitely moveable
    if (currentProgress < gsSimDuration) {
        return true;
    }
    
    // For cohorts in line training, allow movement if they're not too far along
    // This helps with small deficits where slight schedule adjustments could help
    const progressPercentage = currentProgress / totalDuration;
    return progressPercentage < 0.5; // Allow moving if less than 50% complete
}

function getDateFromYearFortnight(year, fortnight) {
    const month = Math.floor((fortnight - 1) / 2);
    const day = fortnight % 2 === 1 ? 1 : 15;
    return new Date(year, month, day);
}

function formatCohortDate(year, fortnight) {
    const month = MONTHS[Math.floor((fortnight - 1) / 2)];
    const day = fortnight % 2 === 1 ? '1st' : '15th';
    return `${month} ${day}, ${year}`;
}

function calculatePossibleMoveDates(cohort, pathway, currentDeficit) {
    const moves = [];
    const isCPPathway = pathway.type === 'CP';
    
    // For fortnight-level moves, check nearby fortnights (+/- 4 fortnights)
    // This allows moving by just 1 fortnight to potentially resolve deficits
    for (let fnOffset = -4; fnOffset <= 4; fnOffset++) {
        if (fnOffset === 0) continue; // Skip current position
        
        let targetFortnight = cohort.startFortnight + fnOffset;
        let targetYear = cohort.startYear;
        
        // Handle year boundaries
        while (targetFortnight > FORTNIGHTS_PER_YEAR) {
            targetFortnight -= FORTNIGHTS_PER_YEAR;
            targetYear++;
        }
        while (targetFortnight < 1) {
            targetFortnight += FORTNIGHTS_PER_YEAR;
            targetYear--;
        }
        
        // Skip if too far in the past
        if (targetYear < new Date().getFullYear()) continue;
        
        if (isCPPathway) {
            // CP can only start on 1st of month (odd fortnights: 1, 3, 5...)
            // Only check if this is a valid month start
            if (targetFortnight % 2 === 1) {
                const capacity = checkPeriodCapacity(targetYear, targetFortnight, cohort.numTrainees);
                if (capacity.canAccommodate) {
                    moves.push({
                        year: targetYear,
                        fortnight: targetFortnight,
                        display: formatCohortDate(targetYear, targetFortnight),
                        capacityAfter: capacity.remainingCapacity,
                        impact: fnOffset < 0 ? 'Earlier' : 'Later'
                    });
                }
            }
        } else {
            // FO/CAD can start any fortnight but check commencement limit
            const capacity = checkPeriodCapacity(targetYear, targetFortnight, cohort.numTrainees);
            
            // Check FO commencement limit (12 FO cohorts per fortnight)
            if (pathway.type === 'FO') {
                const foCommencementsInPeriod = countFOCommencementsInPeriod(targetYear, targetFortnight);
                if (foCommencementsInPeriod >= 12) {
                    continue; // Skip this period due to FO limit
                }
            }
            
            if (capacity.canAccommodate) {
                moves.push({
                    year: targetYear,
                    fortnight: targetFortnight,
                    display: formatCohortDate(targetYear, targetFortnight),
                    capacityAfter: capacity.remainingCapacity,
                    impact: fnOffset < 0 ? 'Earlier' : 'Later'
                });
            }
        }
    }
    
    // Sort by best capacity fit
    return moves.sort((a, b) => b.capacityAfter - a.capacityAfter).slice(0, 5);
}

function countFOCommencementsInPeriod(year, fortnight) {
    const currentLocation = document.querySelector('.location-tab.active')?.dataset.location || 'AU';
    const cohorts = (locationData && currentLocation && locationData[currentLocation]?.activeCohorts) || activeCohorts;
    const pathways = (locationData && currentLocation && locationData[currentLocation]?.pathways) || window.pathways;
    
    let foCount = 0;
    cohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (pathway && pathway.type === 'FO' && 
            cohort.startYear === year && 
            cohort.startFortnight === fortnight) {
            foCount++;
        }
    });
    
    return foCount;
}

function checkPeriodCapacity(year, fortnight, additionalTrainees) {
    // Calculate demand for the specific period
    const { demand } = calculateDemand();
    
    // Check if this period exists in demand
    if (!demand[year] || !demand[year][fortnight]) {
        // No demand data means full capacity available
        const totalSupply = calculateTotalSupplyForPeriod(year, fortnight);
        return {
            canAccommodate: totalSupply >= additionalTrainees,
            remainingCapacity: totalSupply - additionalTrainees,
            currentSurplus: totalSupply
        };
    }
    
    const periodDemand = demand[year][fortnight];
    const totalUnallocated = periodDemand.unallocated ? 
        Object.values(periodDemand.unallocated).reduce((sum, val) => sum + val, 0) : 0;
    
    // If there's unallocated demand, this period has a deficit
    if (totalUnallocated > 0) {
        return {
            canAccommodate: false,
            remainingCapacity: -totalUnallocated,
            currentSurplus: -totalUnallocated
        };
    }
    
    // Calculate remaining capacity
    const totalSupply = calculateTotalSupplyForPeriod(year, fortnight);
    const totalAllocated = periodDemand.allocated ? 
        Object.values(periodDemand.allocated).reduce((sum, val) => sum + val, 0) : 0;
    const remainingCapacity = totalSupply - totalAllocated;
    
    return {
        canAccommodate: remainingCapacity >= additionalTrainees,
        remainingCapacity: remainingCapacity - additionalTrainees,
        currentSurplus: remainingCapacity
    };
}

function calculateTotalSupplyForPeriod(year, fortnight) {
    // Get total FTE for the year
    const yearFTE = trainerFTE[year] || trainerFTE[Object.keys(trainerFTE).sort().pop()]; // Use latest year if not found
    if (!yearFTE) return 0;
    
    // Sum all trainer types and divide by fortnights per year
    const totalFTE = Object.values(yearFTE).reduce((sum, val) => sum + val, 0);
    return totalFTE / FORTNIGHTS_PER_YEAR;
}

function calculateSupplyDeficit(year, fortnight) {
    // Calculate demand for the specific period
    const { demand } = calculateDemand();
    
    const totalSupply = calculateTotalSupplyForPeriod(year, fortnight);
    
    // Check if this period exists in demand
    if (!demand[year] || !demand[year][fortnight]) {
        // No demand data means full surplus
        return {
            surplus: totalSupply,
            deficit: 0,
            totalSupply,
            totalDemand: 0
        };
    }
    
    const periodDemand = demand[year][fortnight];
    
    // Calculate total allocated demand
    const totalAllocated = periodDemand.allocated ? 
        Object.values(periodDemand.allocated).reduce((sum, val) => sum + val, 0) : 0;
    
    // Calculate total unallocated demand (this represents deficit)
    const totalUnallocated = periodDemand.unallocated ? 
        Object.values(periodDemand.unallocated).reduce((sum, val) => sum + val, 0) : 0;
    
    const totalDemand = totalAllocated + totalUnallocated;
    const netBalance = totalSupply - totalDemand;
    
    return {
        surplus: Math.max(0, netBalance),
        deficit: Math.max(0, -netBalance),
        totalSupply,
        totalDemand,
        unallocated: totalUnallocated
    };
}

function displayCohortReschedulingUI(cohortSolutions, focusPeriod = null) {
    const deficitSolutions = document.getElementById('deficit-solutions');
    
    const cohortArray = Object.values(cohortSolutions);
    if (cohortArray.length === 0) {
        // If no specific cohorts found, show general recommendations
        displayGeneralDeficitRecommendations();
        return;
    }
    
    // Group by flexibility
    const flexible = cohortArray.filter(s => s.flexible);
    const restricted = cohortArray.filter(s => !s.flexible);
    
    let html = '';
    
    // Add header if focusing on specific period
    if (focusPeriod) {
        html += `
            <div class="period-focus-header">
                <h3>Cohorts with line training in ${focusPeriod.monthName} ${focusPeriod.year} (FN${focusPeriod.fortnight})</h3>
                <p>${cohortArray.length} cohort${cohortArray.length > 1 ? 's' : ''} can be moved to resolve this deficit</p>
            </div>
        `;
    }
    
    // Flexible cohorts section
    if (flexible.length > 0) {
        html += `
            <div class="cohort-section">
                <h4>FO/CAD Cohorts</h4>
                ${flexible.map(sol => createCohortRescheduleItem(sol)).join('')}
            </div>
        `;
    }
    
    // Restricted cohorts section  
    if (restricted.length > 0) {
        html += `
            <div class="cohort-section">
                <h4>CP Cohorts (odd fortnights only)</h4>
                ${restricted.map(sol => createCohortRescheduleItem(sol)).join('')}
            </div>
        `;
    }
    
    // Add summary
    html += `
        <div class="reschedule-summary">
            <div class="tip">💡 <strong>Tips:</strong></div>
            <ul>
                <li>Green numbers show remaining capacity after move</li>
                <li>CP cohorts can only start on the 1st of each month</li>
                <li>Consider moving smaller cohorts first for flexibility</li>
            </ul>
        </div>
    `;
    
    deficitSolutions.innerHTML = html;
    
    // Store for later use
    window.cohortRescheduleSolutions = cohortSolutions;
    
    // Add event handlers
    setupCohortRescheduleHandlers();
}

function createCohortRescheduleItem(solution) {
    const cohortName = getReadableCohortName(solution.cohort);
    
    // Calculate when line training occurs for this cohort
    const lineTrainingPeriods = calculateLineTrainingPeriodsForCohort(solution.cohort, solution.pathway);
    
    // Find which deficit periods this cohort affects
    const affectedDeficitPeriods = [];
    window.currentDeficits.forEach(deficit => {
        lineTrainingPeriods.forEach(ltPeriod => {
            if (ltPeriod.year === deficit.year && ltPeriod.fortnight === deficit.fortnight) {
                affectedDeficitPeriods.push({
                    fortnight: deficit.fortnight,
                    year: deficit.year,
                    monthName: MONTHS[Math.floor((deficit.fortnight - 1) / 2)]
                });
            }
        });
    });
    
    // Create smart recommendations based on actual impact
    const recommendations = calculateSmartMoveRecommendations(solution.cohort, solution.pathway, affectedDeficitPeriods);
    
    return `
        <div class="cohort-reschedule-item" data-cohort-id="${solution.cohort.id}">
            <div class="cohort-checkbox-wrapper">
                <input type="checkbox" class="cohort-move-checkbox" id="cohort-${solution.cohort.id}" 
                    data-cohort-id="${solution.cohort.id}"
                    data-original-year="${solution.cohort.startYear}"
                    data-original-fortnight="${solution.cohort.startFortnight}">
            </div>
            <div class="cohort-info">
                <label for="cohort-${solution.cohort.id}">
                    <strong>${cohortName}</strong>
                    <span class="cohort-meta">${solution.pathway.type} • ${solution.cohort.numTrainees} trainees</span>
                </label>
                <div class="impact-details">
                    <span class="start-date">Starts: ${solution.currentStart}</span>
                    <span class="lt-period">Line Training: ${formatLineTrainingPeriod(lineTrainingPeriods)}</span>
                    ${affectedDeficitPeriods.length > 0 ? 
                        `<span class="deficit-impact">⚠️ Impacts deficit in: ${affectedDeficitPeriods.map(p => `${p.monthName} ${p.year}`).join(', ')}</span>` : 
                        '<span class="no-impact">ℹ️ Does not impact deficit periods</span>'}
                </div>
            </div>
            <div class="move-selector">
                <select class="new-date-select" data-cohort-id="${solution.cohort.id}">
                    <option value="">Select move...</option>
                    ${recommendations.map(rec => 
                        `<option value="${rec.year}-${rec.fortnight}" title="${rec.reason}">
                            ${rec.label} → ${rec.impact}
                        </option>`
                    ).join('')}
                </select>
            </div>
        </div>
    `;
}

function calculateLineTrainingPeriodsForCohort(cohort, pathway) {
    const periods = [];
    let currentFortnight = cohort.startFortnight;
    let currentYear = cohort.startYear;
    
    // Go through each phase to find line training phases
    pathway.phases.forEach(phase => {
        if (phase.trainerDemandType) {
            // This is a line training phase
            for (let i = 0; i < phase.duration; i++) {
                let fortnight = currentFortnight + i;
                let year = currentYear;
                
                while (fortnight > FORTNIGHTS_PER_YEAR) {
                    fortnight -= FORTNIGHTS_PER_YEAR;
                    year++;
                }
                
                periods.push({ 
                    year, 
                    fortnight, 
                    phaseType: phase.name,
                    demandType: phase.trainerDemandType,
                    trainersNeeded: cohort.numTrainees * (phase.ratio || 1)
                });
            }
        }
        
        // Move to next phase
        currentFortnight += phase.duration;
        while (currentFortnight > FORTNIGHTS_PER_YEAR) {
            currentFortnight -= FORTNIGHTS_PER_YEAR;
            currentYear++;
        }
    });
    
    return periods;
}

function formatLineTrainingPeriod(periods) {
    if (periods.length === 0) return 'None';
    
    const firstPeriod = periods[0];
    const lastPeriod = periods[periods.length - 1];
    
    const startMonth = MONTHS[Math.floor((firstPeriod.fortnight - 1) / 2)];
    const endMonth = MONTHS[Math.floor((lastPeriod.fortnight - 1) / 2)];
    
    if (firstPeriod.year === lastPeriod.year) {
        return `${startMonth}-${endMonth} ${firstPeriod.year}`;
    } else {
        return `${startMonth} ${firstPeriod.year} - ${endMonth} ${lastPeriod.year}`;
    }
}

function calculateSmartMoveRecommendations(cohort, pathway, affectedDeficitPeriods) {
    const recommendations = [];
    
    if (affectedDeficitPeriods.length === 0) {
        // This cohort doesn't affect any deficit periods
        return [{
            year: cohort.startYear,
            fortnight: cohort.startFortnight,
            label: 'No move needed',
            impact: 'Does not affect deficits',
            reason: 'This cohort does not have line training during deficit periods'
        }];
    }
    
    // Calculate moves that would move line training out of deficit periods
    const testOffsets = pathway.type === 'CP' ? 
        [-4, -2, 2, 4] : // CP: move by months
        [-6, -4, -2, -1, 1, 2, 4, 6]; // FO/CAD: move by fortnights
    
    testOffsets.forEach(offset => {
        let newStartFortnight = cohort.startFortnight + offset;
        let newStartYear = cohort.startYear;
        
        while (newStartFortnight > FORTNIGHTS_PER_YEAR) {
            newStartFortnight -= FORTNIGHTS_PER_YEAR;
            newStartYear++;
        }
        while (newStartFortnight < 1) {
            newStartFortnight += FORTNIGHTS_PER_YEAR;
            newStartYear--;
        }
        
        // For CP, ensure it's an odd fortnight
        if (pathway.type === 'CP' && newStartFortnight % 2 === 0) {
            return;
        }
        
        // Calculate new line training periods
        const newLTPeriods = calculateLineTrainingPeriodsForCohort(
            { ...cohort, startYear: newStartYear, startFortnight: newStartFortnight },
            pathway
        );
        
        // Check if this move helps
        let stillAffectsDeficit = false;
        let freedTrainers = 0;
        
        affectedDeficitPeriods.forEach(deficitPeriod => {
            const stillInDeficit = newLTPeriods.some(lt => 
                lt.year === deficitPeriod.year && lt.fortnight === deficitPeriod.fortnight
            );
            if (!stillInDeficit) {
                freedTrainers += cohort.numTrainees;
            } else {
                stillAffectsDeficit = true;
            }
        });
        
        if (freedTrainers > 0) {
            const moveLabel = pathway.type === 'CP' ?
                (offset > 0 ? `+${offset/2} months` : `${offset/2} months`) :
                (offset > 0 ? `+${offset} FN` : `${offset} FN`);
                
            recommendations.push({
                year: newStartYear,
                fortnight: newStartFortnight,
                label: moveLabel,
                impact: stillAffectsDeficit ? 
                    `Frees ${freedTrainers} trainers (partial)` : 
                    `Frees ${freedTrainers} trainers`,
                reason: `Moves line training ${stillAffectsDeficit ? 'partially' : 'completely'} out of deficit periods`,
                freedTrainers,
                isComplete: !stillAffectsDeficit
            });
        }
    });
    
    // Sort by most effective moves (complete solutions first, then by trainers freed)
    recommendations.sort((a, b) => {
        if (a.isComplete !== b.isComplete) return b.isComplete - a.isComplete;
        return b.freedTrainers - a.freedTrainers;
    });
    
    // If no good moves found, show why
    if (recommendations.length === 0) {
        recommendations.push({
            year: cohort.startYear,
            fortnight: cohort.startFortnight,
            label: 'No beneficial moves',
            impact: 'All moves still overlap deficit',
            reason: 'Line training period is too long to avoid deficit periods'
        });
    }
    
    return recommendations.slice(0, 5); // Top 5 recommendations
}

function setupCohortRescheduleHandlers() {
    // Handle checkbox changes
    document.querySelectorAll('.cohort-move-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateDeficitPreview);
    });
    
    // Handle date selection changes
    document.querySelectorAll('.new-date-select').forEach(select => {
        select.addEventListener('change', function() {
            const cohortId = this.dataset.cohortId;
            const checkbox = document.getElementById(`cohort-${cohortId}`);
            if (this.value && !checkbox.checked) {
                checkbox.checked = true;
            }
            updateDeficitPreview();
        });
    });
    
    // Update apply button state
    updateDeficitPreview();
}

function updateReschedulePreview() {
    // This function is no longer needed as we're using updateDeficitPreview directly
    updateDeficitPreview();
}

function displayGeneralDeficitRecommendations() {
    const deficitSolutions = document.getElementById('deficit-solutions');
    const currentLocation = document.querySelector('.location-tab.active')?.dataset.location || 'AU';
    
    // Analyze deficit patterns
    const deficitSummary = {};
    let totalDeficitTrainees = 0;
    
    window.currentDeficits.forEach(deficit => {
        const monthKey = `${MONTHS[Math.floor((deficit.fortnight - 1) / 2)]} ${deficit.year}`;
        if (!deficitSummary[monthKey]) {
            deficitSummary[monthKey] = {
                totalDeficit: 0,
                fortnights: [],
                types: {}
            };
        }
        
        const total = Object.values(deficit.deficitsByType).reduce((sum, d) => sum + d.deficit, 0);
        deficitSummary[monthKey].totalDeficit += total;
        deficitSummary[monthKey].fortnights.push(deficit.fortnight);
        totalDeficitTrainees += total;
        
        Object.entries(deficit.deficitsByType).forEach(([type, data]) => {
            const typeName = type.replace('LT-', '');
            deficitSummary[monthKey].types[typeName] = (deficitSummary[monthKey].types[typeName] || 0) + data.deficit;
        });
    });
    
    let html = `
        <div class="general-recommendations">
            <h3>Recommended Actions to Resolve ${Math.round(totalDeficitTrainees)} Trainer Deficit:</h3>
            
            <div class="recommendation-section">
                <h4>1. Add New Cohorts in Available Periods</h4>
                <p>Schedule new cohorts in periods with surplus capacity:</p>
                <ul>
    `;
    
    // Find periods with capacity in the same year as deficits
    const deficitYear = window.currentDeficits[0]?.year || new Date().getFullYear();
    let foundSurplus = false;
    
    // Get demand data
    const { demand } = calculateDemand();
    
    for (let fn = 1; fn <= 24; fn++) {
        const capacity = checkPeriodCapacity(deficitYear, fn, 0);
        if (capacity.currentSurplus > 5) {
            foundSurplus = true;
            html += `<li>${MONTHS[Math.floor((fn - 1) / 2)]} ${deficitYear} FN${fn}: <span style="color: green;">+${Math.round(capacity.currentSurplus)} trainer capacity</span></li>`;
        }
    }
    
    if (!foundSurplus) {
        html += `<li>Limited surplus capacity in ${deficitYear} - consider cross-location training</li>`;
    }
    
    html += `
                </ul>
            </div>
            
            <div class="recommendation-section">
                <h4>2. Reschedule Existing Cohorts</h4>
                <p>If you have cohorts scheduled, move them from deficit periods:</p>
                <ul>
    `;
    
    Object.entries(deficitSummary).slice(0, 3).forEach(([month, data]) => {
        const fnList = data.fortnights.map(fn => `FN${fn}`).join(', ');
        html += `<li>${month} (${fnList}): Move ${Math.round(data.totalDeficit)} trainees to other periods</li>`;
    });
    
    html += `
                </ul>
            </div>
            
            <div class="recommendation-section">
                <h4>3. Training Type Considerations</h4>
                <ul>
    `;
    
    // Type-specific recommendations
    Object.entries(deficitSummary).forEach(([month, data]) => {
        if (data.types.CAD > 0) {
            html += `<li><strong>CAD deficit in ${month}:</strong> Requires CATB/CATA/STP trainers only</li>`;
        }
        if (data.types.CP > 0) {
            html += `<li><strong>CP deficit in ${month}:</strong> CP must start FN1, FN3, FN5, etc.</li>`;
        }
        if (data.types.FO > 0) {
            html += `<li><strong>FO deficit in ${month}:</strong> Most flexible - any fortnight start</li>`;
        }
    });
    
    html += `
                </ul>
            </div>
            
            <div class="recommendation-section">
                <h4>4. Immediate Actions</h4>
                <ul>
                    <li>Go to Planner tab and add cohorts in surplus periods</li>
                    <li>Use Training Planner modal to optimize schedule</li>
                    ${currentLocation === 'NZ' ? '<li>Consider AU cross-location for peak periods</li>' : ''}
                    <li>Split large cohorts into smaller groups</li>
                </ul>
            </div>
            
            <div class="tip-box" style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #007bff;">
                <strong>💡 No cohorts found for rescheduling</strong><br>
                Add cohorts in the Planner tab that overlap with deficit periods to see specific rescheduling options.
            </div>
        </div>
    `;
    
    deficitSolutions.innerHTML = html;
}

// Export Training Functions
function initializeExportModal() {
    // Update location label
    document.getElementById('export-location-label').textContent = `(${currentLocation})`;
    
    // Populate year dropdowns
    const fromYearSelect = document.getElementById('export-from-year');
    const toYearSelect = document.getElementById('export-to-year');
    
    fromYearSelect.innerHTML = '';
    toYearSelect.innerHTML = '';
    
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        fromYearSelect.innerHTML += `<option value="${year}">${year}</option>`;
        toYearSelect.innerHTML += `<option value="${year}">${year}</option>`;
    }
    
    // Populate fortnight dropdowns
    const fromFortnightSelect = document.getElementById('export-from-fortnight');
    const toFortnightSelect = document.getElementById('export-to-fortnight');
    
    fromFortnightSelect.innerHTML = '';
    toFortnightSelect.innerHTML = '';
    
    for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
        const month = MONTHS[FORTNIGHT_TO_MONTH[fn]];
        const period = fn % 2 === 1 ? '1-14' : '15-end';
        const label = `FN${fn} - ${month} ${period}`;
        fromFortnightSelect.innerHTML += `<option value="${fn}">${label}</option>`;
        toFortnightSelect.innerHTML += `<option value="${fn}">${label}</option>`;
    }
    
    // Set default range (current year)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    fromYearSelect.value = currentYear;
    toYearSelect.value = currentYear;
    fromFortnightSelect.value = 1;
    toFortnightSelect.value = FORTNIGHTS_PER_YEAR;
    
    // Add event listeners
    fromYearSelect.addEventListener('change', updateExportPreview);
    toYearSelect.addEventListener('change', updateExportPreview);
    fromFortnightSelect.addEventListener('change', updateExportPreview);
    toFortnightSelect.addEventListener('change', updateExportPreview);
    
    // Radio button listeners
    document.querySelectorAll('input[name="export-view"]').forEach(radio => {
        radio.addEventListener('change', updateExportPreview);
    });
    
    // Update preview
    updateExportPreview();
}

function getDateFromFortnight(year, fortnight) {
    const month = MONTHS[FORTNIGHT_TO_MONTH[fortnight]];
    const day = fortnight % 2 === 1 ? 1 : 15;
    return `${day} ${month} ${year}`;
}

function updateExportPreview() {
    const fromYear = parseInt(document.getElementById('export-from-year').value);
    const toYear = parseInt(document.getElementById('export-to-year').value);
    const fromFortnight = parseInt(document.getElementById('export-from-fortnight').value);
    const toFortnight = parseInt(document.getElementById('export-to-fortnight').value);
    const viewType = document.querySelector('input[name="export-view"]:checked').value;
    
    // Get cohorts in range
    const cohortsInRange = activeCohorts.filter(cohort => {
        // Check if cohort starts within the selected range
        if (cohort.startYear < fromYear || cohort.startYear > toYear) return false;
        if (cohort.startYear === fromYear && cohort.startFortnight < fromFortnight) return false;
        if (cohort.startYear === toYear && cohort.startFortnight > toFortnight) return false;
        return true;
    });
    
    const tbody = document.getElementById('export-preview-tbody');
    const noDataDiv = document.getElementById('export-no-data');
    const exportBtn = document.getElementById('export-training-excel');
    
    if (cohortsInRange.length === 0) {
        tbody.innerHTML = '';
        noDataDiv.style.display = 'block';
        document.getElementById('export-preview-table').style.display = 'none';
        exportBtn.disabled = true;
        return;
    }
    
    noDataDiv.style.display = 'none';
    document.getElementById('export-preview-table').style.display = 'table';
    exportBtn.disabled = false;
    
    let html = '';
    
    if (viewType === 'detailed') {
        // Show one row per cohort
        cohortsInRange.forEach(cohort => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            if (pathway) {
                const startDate = getDateFromFortnight(cohort.startYear, cohort.startFortnight);
                const trainingType = pathway.startRank && pathway.endRank ? 
                    `${pathway.startRank}_${pathway.endRank}` : '-';
                
                // Calculate usable date
                const startDateObj = new Date(cohort.startYear, 
                    FORTNIGHT_TO_MONTH[cohort.startFortnight] || 0, 
                    cohort.startFortnight % 2 === 1 ? 1 : 15);
                const usableDateObj = new Date(startDateObj);
                usableDateObj.setMonth(usableDateObj.getMonth() + (pathway.usableMonths || 0));
                const usableDate = usableDateObj.toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
                
                html += `
                    <tr>
                        <td>${trainingType}</td>
                        <td>${pathway.id}</td>
                        <td>${pathway.name}</td>
                        <td>${pathway.type}</td>
                        <td>${startDate}</td>
                        <td>${cohort.numTrainees}</td>
                        <td>${usableDate}</td>
                    </tr>
                `;
            }
        });
    } else {
        // Summary view - group by pathway
        const pathwaySummary = {};
        
        cohortsInRange.forEach(cohort => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            if (pathway) {
                if (!pathwaySummary[pathway.id]) {
                    pathwaySummary[pathway.id] = {
                        pathway: pathway,
                        totalTrainees: 0,
                        earliestStart: { year: cohort.startYear, fortnight: cohort.startFortnight }
                    };
                }
                
                pathwaySummary[pathway.id].totalTrainees += cohort.numTrainees;
                
                // Update earliest start
                const current = pathwaySummary[pathway.id].earliestStart;
                if (cohort.startYear < current.year || 
                    (cohort.startYear === current.year && cohort.startFortnight < current.fortnight)) {
                    pathwaySummary[pathway.id].earliestStart = { 
                        year: cohort.startYear, 
                        fortnight: cohort.startFortnight 
                    };
                }
            }
        });
        
        // Generate summary rows
        Object.values(pathwaySummary).forEach(summary => {
            const startDate = getDateFromFortnight(
                summary.earliestStart.year, 
                summary.earliestStart.fortnight
            );
            const trainingType = summary.pathway.startRank && summary.pathway.endRank ? 
                `${summary.pathway.startRank}_${summary.pathway.endRank}` : '-';
            
            // Calculate usable date for earliest start
            const startDateObj = new Date(summary.earliestStart.year, 
                FORTNIGHT_TO_MONTH[summary.earliestStart.fortnight] || 0, 
                summary.earliestStart.fortnight % 2 === 1 ? 1 : 15);
            const usableDateObj = new Date(startDateObj);
            usableDateObj.setMonth(usableDateObj.getMonth() + (summary.pathway.usableMonths || 0));
            const usableDate = usableDateObj.toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            
            html += `
                <tr>
                    <td>${trainingType}</td>
                    <td>${summary.pathway.id}</td>
                    <td>${summary.pathway.name}</td>
                    <td>${summary.pathway.type}</td>
                    <td>${startDate}</td>
                    <td>${summary.totalTrainees}</td>
                    <td>${usableDate}</td>
                </tr>
            `;
        });
    }
    
    tbody.innerHTML = html;
}

// Export to Excel with validation
document.getElementById('export-training-excel')?.addEventListener('click', () => {
    const fromYear = parseInt(document.getElementById('export-from-year').value);
    const toYear = parseInt(document.getElementById('export-to-year').value);
    const fromFortnight = parseInt(document.getElementById('export-from-fortnight').value);
    const toFortnight = parseInt(document.getElementById('export-to-fortnight').value);
    const viewType = document.querySelector('input[name="export-view"]:checked').value;
    
    // Get cohorts in range
    const cohortsInRange = activeCohorts.filter(cohort => {
        if (cohort.startYear < fromYear || cohort.startYear > toYear) return false;
        if (cohort.startYear === fromYear && cohort.startFortnight < fromFortnight) return false;
        if (cohort.startYear === toYear && cohort.startFortnight > toFortnight) return false;
        return true;
    });
    
    // Build data array for Excel
    const headers = ['Training Type', 'Pathway ID', 'Pathway Name', 'Type', 'Start Date', 'No. Trainees', 'Usable Date'];
    const data = [headers];
    
    if (viewType === 'detailed') {
        cohortsInRange.forEach(cohort => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            if (pathway) {
                const startDate = getDateFromFortnight(cohort.startYear, cohort.startFortnight);
                const trainingType = pathway.startRank && pathway.endRank ? 
                    `${pathway.startRank}_${pathway.endRank}` : '-';
                
                // Calculate usable date
                const startDateObj = new Date(cohort.startYear, 
                    FORTNIGHT_TO_MONTH[cohort.startFortnight] || 0, 
                    cohort.startFortnight % 2 === 1 ? 1 : 15);
                const usableDateObj = new Date(startDateObj);
                usableDateObj.setMonth(usableDateObj.getMonth() + (pathway.usableMonths || 0));
                const usableDate = usableDateObj.toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
                
                data.push([
                    trainingType,
                    pathway.id,
                    pathway.name,
                    pathway.type,
                    startDate,
                    cohort.numTrainees,
                    usableDate
                ]);
            }
        });
    } else {
        // Summary view
        const pathwaySummary = {};
        
        cohortsInRange.forEach(cohort => {
            const pathway = pathways.find(p => p.id === cohort.pathwayId);
            if (pathway) {
                if (!pathwaySummary[pathway.id]) {
                    pathwaySummary[pathway.id] = {
                        pathway: pathway,
                        totalTrainees: 0,
                        earliestStart: { year: cohort.startYear, fortnight: cohort.startFortnight }
                    };
                }
                
                pathwaySummary[pathway.id].totalTrainees += cohort.numTrainees;
                
                const current = pathwaySummary[pathway.id].earliestStart;
                if (cohort.startYear < current.year || 
                    (cohort.startYear === current.year && cohort.startFortnight < current.fortnight)) {
                    pathwaySummary[pathway.id].earliestStart = { 
                        year: cohort.startYear, 
                        fortnight: cohort.startFortnight 
                    };
                }
            }
        });
        
        Object.values(pathwaySummary).forEach(summary => {
            const startDate = getDateFromFortnight(
                summary.earliestStart.year, 
                summary.earliestStart.fortnight
            );
            const trainingType = summary.pathway.startRank && summary.pathway.endRank ? 
                `${summary.pathway.startRank}_${summary.pathway.endRank}` : '-';
            
            // Calculate usable date for earliest start
            const startDateObj = new Date(summary.earliestStart.year, 
                FORTNIGHT_TO_MONTH[summary.earliestStart.fortnight] || 0, 
                summary.earliestStart.fortnight % 2 === 1 ? 1 : 15);
            const usableDateObj = new Date(startDateObj);
            usableDateObj.setMonth(usableDateObj.getMonth() + (summary.pathway.usableMonths || 0));
            const usableDate = usableDateObj.toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            
            data.push([
                trainingType,
                summary.pathway.id,
                summary.pathway.name,
                summary.pathway.type,
                startDate,
                summary.totalTrainees,
                usableDate
            ]);
        });
    }
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Set column widths
    const colWidths = [
        { wch: 15 }, // Training Type
        { wch: 12 }, // Pathway ID
        { wch: 20 }, // Pathway Name
        { wch: 10 }, // Type
        { wch: 15 }, // Start Date
        { wch: 15 }, // No. Trainees
        { wch: 15 }  // Usable Date
    ];
    ws['!cols'] = colWidths;
    
    // Get list of valid pathway IDs
    const pathwayIds = pathways.map(p => p.id).join(',');
    const pathwayTypes = ['CP', 'FO', 'CAD'].join(',');
    
    // Add data validation
    const lastRow = data.length + 10; // Extra rows for user to add data
    
    // Create data validation object
    const dataValidations = [];
    
    // Pathway ID dropdown (column B, starting from row 2)
    dataValidations.push({
        type: 'list',
        allowBlank: false,
        showDropDown: true,
        formula1: `"${pathwayIds}"`,
        sqref: `B2:B${lastRow}`
    });
    
    // Type dropdown (column D, starting from row 2)
    dataValidations.push({
        type: 'list',
        allowBlank: false,
        showDropDown: true,
        formula1: `"${pathwayTypes}"`,
        sqref: `D2:D${lastRow}`
    });
    
    // Number validation for trainees (column F, starting from row 2)
    dataValidations.push({
        type: 'whole',
        allowBlank: false,
        showInputMessage: true,
        prompt: 'Enter number of trainees',
        promptTitle: 'Trainees',
        operator: 'greaterThan',
        formula1: '0',
        sqref: `F2:F${lastRow}`
    });
    
    // Apply data validations
    ws['!dataValidation'] = dataValidations;
    
    // Add instructions sheet
    const instructionsData = [
        ['Training Data Import Instructions'],
        [''],
        ['Column Requirements:'],
        ['Column', 'Description', 'Valid Values', 'Example'],
        ['Training Type', 'Rank progression', 'StartRank_EndRank format', 'NBFO_NBCP'],
        ['Pathway ID', 'Training pathway identifier', pathwayIds.split(',').join(', '), 'A202'],
        ['Pathway Name', 'Full pathway description', 'Auto-filled based on ID', 'A202 - CP'],
        ['Type', 'Training type', 'CP, FO, CAD', 'CP'],
        ['Start Date', 'Training start date', 'Format: D MMM YYYY', '1 Jan 2025'],
        ['No. Trainees', 'Number of trainees', 'Positive numbers only', '12'],
        ['Usable Date', 'When trainee becomes usable', 'Calculated from start + usable months', '1 Jul 2025'],
        [''],
        ['Date Format Examples:'],
        ['Valid Formats', 'Example'],
        ['D MMM YYYY', '1 Jan 2025'],
        ['DD MMM YYYY', '01 Jan 2025'],
        ['DD-MMM-YYYY', '01-Jan-2025'],
        ['DD/MM/YYYY', '01/01/2025'],
        [''],
        ['Notes:'],
        ['- Pathway ID must exist in the system'],
        ['- Dates will be converted to fortnights automatically'],
        ['- Save as CSV or XLSX for import'],
        ['- The system will validate all data on import']
    ];
    
    const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
    wsInstructions['!cols'] = [{ wch: 20 }, { wch: 40 }, { wch: 30 }, { wch: 15 }];
    
    // Add conditional formatting for headers
    wsInstructions['A1'].s = {
        font: { bold: true, sz: 16 },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center" }
    };
    
    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Training Data');
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');
    
    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    
    // Convert to blob
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    
    // Download file
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `training_export_${currentLocation}_${fromYear}_FN${fromFortnight}_to_${toYear}_FN${toFortnight}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    
    // Close modal
    document.getElementById('export-training-modal').classList.remove('active');
    showNotification('Training data exported with validation dropdowns', 'success');
});

// Import Training Functions
let importedData = [];
let validatedData = [];

function initializeImportModal() {
    // Reset state
    importedData = [];
    validatedData = [];
    
    // Update location label
    document.getElementById('import-location-label').textContent = `Importing to: ${currentLocation}`;
    
    // Reset UI
    document.getElementById('import-training-file-input').value = '';
    document.getElementById('import-options-section').style.display = 'none';
    document.getElementById('import-validation-section').style.display = 'none';
    document.getElementById('import-training-confirm').disabled = true;
    
    // Set up file input listener
    const fileInput = document.getElementById('import-training-file-input');
    fileInput.onchange = handleFileSelect;
    
    // Set up button listeners
    document.getElementById('skip-invalid-btn')?.addEventListener('click', skipInvalidRows);
    document.getElementById('fix-dates-btn')?.addEventListener('click', autoFixDates);
    document.getElementById('import-training-confirm')?.addEventListener('click', confirmImport);
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // Handle Excel file
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Get the first worksheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // Convert to CSV
                const csv = XLSX.utils.sheet_to_csv(worksheet);
                parseCSV(csv);
            } catch (error) {
                showNotification('Error reading Excel file: ' + error.message, 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    } else if (fileName.endsWith('.csv')) {
        // Handle CSV file
        const reader = new FileReader();
        reader.onload = function(e) {
            const csv = e.target.result;
            parseCSV(csv);
        };
        reader.readAsText(file);
    } else {
        showNotification('Please select a CSV or Excel file', 'error');
    }
}

function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) {
        showNotification('CSV file is empty or invalid', 'error');
        return;
    }
    
    // Skip header row
    const dataLines = lines.slice(1);
    importedData = [];
    
    dataLines.forEach((line, index) => {
        if (!line.trim()) return;
        
        // Parse CSV line (handle quoted values)
        const values = parseCSVLine(line);
        
        if (values.length >= 7) {
            importedData.push({
                rowNum: index + 2, // +2 because of header and 0-index
                trainingType: values[0].trim().replace(/"/g, ''),
                pathwayId: values[1].trim().replace(/"/g, ''),
                pathwayName: values[2].trim().replace(/"/g, ''),
                type: values[3].trim().replace(/"/g, ''),
                startDate: values[4].trim().replace(/"/g, ''),
                numTrainees: values[5].trim().replace(/"/g, ''),
                usableDate: values[6].trim().replace(/"/g, '')
            });
        }
    });
    
    if (importedData.length === 0) {
        showNotification('No valid data found in CSV', 'error');
        return;
    }
    
    // Show options and validate
    document.getElementById('import-options-section').style.display = 'block';
    validateImportData();
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    
    return values;
}

function validateImportData() {
    validatedData = [];
    let validCount = 0;
    let warningCount = 0;
    let errorCount = 0;
    
    importedData.forEach(row => {
        const validation = validateRow(row);
        validatedData.push({
            ...row,
            validation: validation,
            status: validation.errors.length > 0 ? 'error' : 
                    validation.warnings.length > 0 ? 'warning' : 'valid'
        });
        
        if (validation.errors.length > 0) errorCount++;
        else if (validation.warnings.length > 0) warningCount++;
        else validCount++;
    });
    
    // Update UI
    displayValidationResults(validCount, warningCount, errorCount);
}

function validateRow(row) {
    const errors = [];
    const warnings = [];
    
    // Validate training type (optional but if provided should match)
    if (row.trainingType && row.trainingType !== '-') {
        const parts = row.trainingType.split('_');
        if (parts.length !== 2) {
            warnings.push(`Training type should be in format StartRank_EndRank: ${row.trainingType}`);
        }
    }
    
    // Validate pathway
    const pathway = pathways.find(p => p.id === row.pathwayId);
    if (!pathway) {
        errors.push(`Unknown pathway ID: ${row.pathwayId}`);
    } else {
        // Check if type matches
        if (pathway.type !== row.type) {
            warnings.push(`Type mismatch: Expected ${pathway.type}, got ${row.type}`);
        }
        // Check if name matches
        if (pathway.name !== row.pathwayName && row.pathwayName) {
            warnings.push(`Name mismatch: Expected "${pathway.name}"`);
        }
    }
    
    // Validate date
    const dateResult = parseDateToFortnight(row.startDate);
    if (!dateResult) {
        errors.push(`Invalid date format: ${row.startDate}`);
    } else {
        row.parsedYear = dateResult.year;
        row.parsedFortnight = dateResult.fortnight;
        
        // Check if date is in valid range
        if (dateResult.year < START_YEAR || dateResult.year > END_YEAR) {
            errors.push(`Year ${dateResult.year} outside valid range (${START_YEAR}-${END_YEAR})`);
        }
    }
    
    // Validate trainees
    const numTrainees = parseInt(row.numTrainees);
    if (isNaN(numTrainees) || numTrainees <= 0) {
        errors.push(`Invalid number of trainees: ${row.numTrainees}`);
    } else {
        row.parsedTrainees = numTrainees;
    }
    
    // Validate usable date (optional, just check format if provided)
    if (row.usableDate && row.usableDate !== '-') {
        const usableDateResult = parseDateToFortnight(row.usableDate);
        if (!usableDateResult) {
            warnings.push(`Invalid usable date format: ${row.usableDate}`);
        }
    }
    
    return { errors, warnings };
}

function parseDateToFortnight(dateStr) {
    // Try multiple date formats
    const formats = [
        // "1 Jan 2025" format
        /^(\d{1,2})\s+(\w{3,})\s+(\d{4})$/,
        // "01-Jan-2025" format
        /^(\d{1,2})-(\w{3,})-(\d{4})$/,
        // "01/01/2025" format
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    ];
    
    for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
            let day, month, year;
            
            if (format === formats[2]) {
                // Numeric format
                day = parseInt(match[1]);
                month = parseInt(match[2]) - 1; // 0-indexed
                year = parseInt(match[3]);
            } else {
                // Text month format
                day = parseInt(match[1]);
                const monthStr = match[2].substring(0, 3);
                month = MONTHS.findIndex(m => m.toLowerCase() === monthStr.toLowerCase());
                year = parseInt(match[3]);
                
                if (month === -1) continue;
            }
            
            // Calculate fortnight
            const fortnight = day <= 14 ? (month * 2) + 1 : (month * 2) + 2;
            
            return { year, fortnight, month, day };
        }
    }
    
    return null;
}

function displayValidationResults(valid, warning, error) {
    // Show validation section
    document.getElementById('import-validation-section').style.display = 'block';
    
    // Update summary
    const summary = document.getElementById('validation-summary');
    const total = valid + warning + error;
    
    let summaryClass = 'success';
    let summaryText = `All ${total} rows are valid and ready to import.`;
    
    if (error > 0) {
        summaryClass = 'error';
        summaryText = `Found ${error} error${error > 1 ? 's' : ''} in ${total} rows. `;
        summaryText += `${valid} valid, ${warning} warning${warning > 1 ? 's' : ''}.`;
    } else if (warning > 0) {
        summaryClass = 'warning';
        summaryText = `${valid} valid rows with ${warning} warning${warning > 1 ? 's' : ''} in ${total} total rows.`;
    }
    
    summary.className = `validation-summary ${summaryClass}`;
    summary.textContent = summaryText;
    
    // Show preview table
    displayPreviewTable();
    
    // Enable import button if there are valid rows
    document.getElementById('import-training-confirm').disabled = valid === 0;
    
    // Show fix options if there are issues
    document.getElementById('fix-options').style.display = (warning > 0 || error > 0) ? 'block' : 'none';
}

function displayPreviewTable() {
    const tbody = document.getElementById('import-preview-tbody');
    let html = '';
    
    validatedData.forEach(row => {
        const statusIcon = row.status === 'valid' ? '✓' : 
                          row.status === 'warning' ? '⚠' : '✗';
        const rowClass = `import-row-${row.status}`;
        const issues = [...row.validation.errors, ...row.validation.warnings].join('; ');
        
        html += `
            <tr class="${rowClass}">
                <td class="status-icon ${row.status}">${statusIcon}</td>
                <td>${row.pathwayId}</td>
                <td>${row.pathwayName}</td>
                <td>${row.type}</td>
                <td>${row.startDate}</td>
                <td>${row.numTrainees}</td>
                <td style="font-size: 0.9em;">${issues}</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function skipInvalidRows() {
    validatedData = validatedData.filter(row => row.status !== 'error');
    
    // Recount
    const valid = validatedData.filter(row => row.status === 'valid').length;
    const warning = validatedData.filter(row => row.status === 'warning').length;
    
    displayValidationResults(valid, warning, 0);
    showNotification('Invalid rows removed', 'info');
}

function autoFixDates() {
    let fixed = 0;
    
    validatedData.forEach(row => {
        if (row.validation.errors.some(e => e.includes('Invalid date format'))) {
            // Try to fix common date issues
            let fixedDate = row.startDate;
            
            // Remove extra spaces
            fixedDate = fixedDate.replace(/\s+/g, ' ').trim();
            
            // Try to parse again
            const dateResult = parseDateToFortnight(fixedDate);
            if (dateResult) {
                row.startDate = `${dateResult.day} ${MONTHS[dateResult.month]} ${dateResult.year}`;
                row.parsedYear = dateResult.year;
                row.parsedFortnight = dateResult.fortnight;
                
                // Re-validate
                row.validation = validateRow(row);
                row.status = row.validation.errors.length > 0 ? 'error' : 
                            row.validation.warnings.length > 0 ? 'warning' : 'valid';
                fixed++;
            }
        }
    });
    
    if (fixed > 0) {
        // Recount and display
        const valid = validatedData.filter(row => row.status === 'valid').length;
        const warning = validatedData.filter(row => row.status === 'warning').length;
        const error = validatedData.filter(row => row.status === 'error').length;
        
        displayValidationResults(valid, warning, error);
        showNotification(`Fixed ${fixed} date format issue${fixed > 1 ? 's' : ''}`, 'success');
    } else {
        showNotification('No date format issues to fix', 'info');
    }
}

function confirmImport() {
    const mode = document.querySelector('input[name="import-mode"]:checked').value;
    const validRows = validatedData.filter(row => row.status !== 'error');
    
    if (validRows.length === 0) {
        showNotification('No valid rows to import', 'error');
        return;
    }
    
    // Clear existing cohorts if replace mode
    if (mode === 'replace') {
        activeCohorts = [];
    }
    
    // Import cohorts
    let imported = 0;
    validRows.forEach(row => {
        const pathway = pathways.find(p => p.id === row.pathwayId);
        if (pathway && row.parsedYear && row.parsedFortnight && row.parsedTrainees) {
            activeCohorts.push({
                id: nextCohortId++,
                numTrainees: row.parsedTrainees,
                pathwayId: row.pathwayId,
                startYear: row.parsedYear,
                startFortnight: row.parsedFortnight,
                location: currentLocation,
                crossLocationTraining: {}
            });
            imported++;
        }
    });
    
    // Update UI
    updateAllTables();
    renderGanttChart();
    markDirty();
    
    // Close modal
    document.getElementById('import-training-modal').classList.remove('active');
    
    // Show success
    const message = mode === 'replace' ? 
        `Replaced all cohorts with ${imported} imported cohort${imported > 1 ? 's' : ''}` :
        `Added ${imported} cohort${imported > 1 ? 's' : ''}`;
    showNotification(message, 'success');
}

// ============================================================================
// NAMESPACE ASSIGNMENTS - Organize functions into logical groups
// ============================================================================

// After all functions are defined, assign them to the namespace structure
// This allows gradual migration while maintaining backward compatibility

// Utility functions
TrainerApp.Utils.showNotification = showNotification;
TrainerApp.Utils.showCenterNotification = showCenterNotification;
TrainerApp.Utils.removeToast = removeToast;
TrainerApp.Utils.showAlertDialog = showAlertDialog;
TrainerApp.Utils.showConfirmDialog = showConfirmDialog;
TrainerApp.Utils.updateCurrentScenarioDisplay = updateCurrentScenarioDisplay;
TrainerApp.Utils.markDirty = markDirty;

// Calculation functions
TrainerApp.Calculations.calculateDemand = calculateDemand;
TrainerApp.Calculations.calculateSupplyDeficit = calculateSupplyDeficit;
// TrainerApp.Calculations.calculateDemandByCategory = calculateDemandByCategory; // Function doesn't exist
TrainerApp.Calculations.calculateLineTrainingPeriods = calculateLineTrainingPeriods;
// TrainerApp.Calculations.calculateCrossLocationDemand = calculateCrossLocationDemand; // Function doesn't exist
TrainerApp.Calculations.getCategoryDemand = getCategoryDemand;
TrainerApp.Calculations.calculateAverageDemand = calculateAverageDemand;
TrainerApp.Calculations.calculateMetricTrends = calculateMetricTrends;
TrainerApp.Calculations.calculateMetricsForPeriod = calculateMetricsForPeriod;

// Dashboard UI functions
TrainerApp.UI.Dashboard.updateDashboardV2 = updateDashboardV2;
TrainerApp.UI.Dashboard.updateDashboardForNavigation = updateDashboardForNavigation;
TrainerApp.UI.Dashboard.navigateDashboard = navigateDashboard;
// TrainerApp.UI.Dashboard.updateMetricsCards = updateMetricsCards; // Function doesn't exist
// TrainerApp.UI.Dashboard.updateDemandOverTimeChart = updateDemandOverTimeChart; // Function doesn't exist
// TrainerApp.UI.Dashboard.updateTrainingDistributionChart = updateTrainingDistributionChart; // Function doesn't exist
// TrainerApp.UI.Dashboard.updateUtilizationTrendChart = updateUtilizationTrendChart; // Function doesn't exist
// TrainerApp.UI.Dashboard.updateSmartAlerts = updateSmartAlerts; // Function doesn't exist
// TrainerApp.UI.Dashboard.renderPipelineView = renderPipelineView; // Function doesn't exist

// Planner UI functions  
TrainerApp.UI.Planner.renderGanttChart = renderGanttChart;
TrainerApp.UI.Planner.renderDemandTable = renderDemandTable;
TrainerApp.UI.Planner.renderSurplusDeficitTable = renderSurplusDeficitTable;
TrainerApp.UI.Planner.updateAllTables = updateAllTables;
TrainerApp.UI.Planner.handleDragStart = handleDragStart;
TrainerApp.UI.Planner.handleDragEnd = handleDragEnd;
TrainerApp.UI.Planner.handleDragOver = handleDragOver;
TrainerApp.UI.Planner.handleDrop = handleDrop;
TrainerApp.UI.Planner.setupGanttDragAndDrop = setupGanttDragAndDrop;

// Settings UI functions
TrainerApp.UI.Settings.renderPathwaysTable = renderPathwaysTable;
TrainerApp.UI.Settings.renderFTESummaryTable = renderFTESummaryTable;
TrainerApp.UI.Settings.renderPrioritySettingsTable = renderPrioritySettingsTable;
TrainerApp.UI.Settings.editPathway = editPathway;
TrainerApp.UI.Settings.openAddPathwayModal = openAddPathwayModal;
TrainerApp.UI.Settings.handlePathwaySave = handlePathwaySave;
TrainerApp.UI.Settings.openFTEModal = openFTEModal;

// Import/Export functions
// TrainerApp.ImportExport.showExportModal = showExportModal; // Function doesn't exist
TrainerApp.ImportExport.updateExportPreview = updateExportPreview;
// TrainerApp.ImportExport.exportToExcel = exportToExcel; // Function doesn't exist
TrainerApp.ImportExport.handleFileSelect = handleFileSelect;
TrainerApp.ImportExport.parseCSV = parseCSV;
TrainerApp.ImportExport.confirmImport = confirmImport;

// Scenario Management functions
TrainerApp.UI.Scenarios.openScenariosPanel = openScenariosPanel;
TrainerApp.UI.Scenarios.closeScenariosPanel = closeScenariosPanel;
TrainerApp.UI.Scenarios.renderScenarioList = renderScenarioList;
TrainerApp.UI.Scenarios.loadScenario = loadScenario;
TrainerApp.UI.Scenarios.saveCurrentScenario = saveCurrentScenario;
TrainerApp.UI.Scenarios.createNewScenario = createNewScenario;
TrainerApp.UI.Scenarios.deleteScenario = deleteScenario;
TrainerApp.UI.Scenarios.duplicateScenario = duplicateScenario;

// Help System functions
TrainerApp.Help.showHelpModal = showHelpModal;
TrainerApp.Help.loadHelpSection = loadHelpSection;
TrainerApp.Help.searchHelp = searchHelp;
TrainerApp.Help.startInteractiveTour = startInteractiveTour;

// Data Management functions
TrainerApp.Data.saveDefaultFTE = saveDefaultFTE;
TrainerApp.Data.loadDefaultFTE = loadDefaultFTE;
TrainerApp.Data.saveDefaultPathways = saveDefaultPathways;
TrainerApp.Data.loadDefaultPathways = loadDefaultPathways;
TrainerApp.Data.getCurrentState = getCurrentState;
TrainerApp.Data.migrateDataToLocations = migrateDataToLocations;

