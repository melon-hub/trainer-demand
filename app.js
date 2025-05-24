// Configuration Constants
const START_YEAR = 2024;
const END_YEAR = 2034;
const FORTNIGHTS_PER_YEAR = 24;

// Month mapping for fortnights
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FORTNIGHT_TO_MONTH = {
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

// Trainer categories
const TRAINER_CATEGORIES = ['CATB', 'CATA', 'STP', 'RHS', 'LHS'];

// Trainer qualifications mapping - what each trainer type CAN do
const TRAINER_QUALIFICATIONS = {
    'CATB': ['LT-CAD', 'LT-CP', 'LT-FO'],  // Can do all LT types
    'CATA': ['LT-CAD', 'LT-CP', 'LT-FO'],  // Can do all LT types
    'STP': ['LT-CAD', 'LT-CP', 'LT-FO'],   // Can do all LT types
    'RHS': ['LT-CP', 'LT-FO'],              // Can do LT-CP and LT-FO (NOT LT-CAD)
    'LHS': ['LT-FO']                        // Can only do LT-FO
};

// Priority configuration - editable
let priorityConfig = [
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

// Data Structures - Training pathways
let pathways = [
    {
        id: "A202",
        name: "A202 - CP",
        type: "CP",
        comments: "",
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
        startFortnight: 3
    }
];
let nextCohortId = 2;

// View state for filters and grouping
let viewState = {
    groupBy: 'none',
    collapsedGroups: [],
    currentScenarioId: null,
    isDirty: false // Track if current state has unsaved changes
};

// Scenarios storage
let scenarios = JSON.parse(localStorage.getItem('pilotTrainerScenarios')) || [];

// DOM Elements
const dashboardView = document.getElementById('dashboard-view');
const plannerView = document.getElementById('planner-view');
const settingsView = document.getElementById('settings-view');
const navTabs = document.querySelectorAll('.nav-tab');
const addCohortForm = document.getElementById('add-cohort-form');
const pathwaySelect = document.getElementById('pathway');
const editFTEBtn = document.getElementById('edit-fte-btn');
const addPathwayBtn = document.getElementById('add-pathway-btn');
const toggleFTEBtn = document.getElementById('toggle-fte-btn');
const editPriorityBtn = document.getElementById('edit-priority-btn');

// Modal Elements
const fteModal = document.getElementById('fte-modal');
const pathwayModal = document.getElementById('pathway-modal');
const cohortModal = document.getElementById('cohort-modal');
const priorityModal = document.getElementById('priority-modal');
const modalCloseButtons = document.querySelectorAll('.modal-close');
const modalCancelButtons = document.querySelectorAll('.modal-cancel');

// Initialize the application
function init() {
    setupEventListeners();
    populatePathwaySelect();
    populateYearSelect();
    populateFortnightSelect();
    updateAllTables();
    renderGanttChart();
    setupSynchronizedScrolling();
    
    // Initialize dark mode
    initDarkMode();
    
    // Start with dashboard view
    switchView('dashboard');
}

// Generate table headers with months and fortnights
function generateTableHeaders(includeYearColumn = true, includeLabels = true) {
    let monthHeaders = '';
    let fortnightHeaders = '';
    
    // First column header for month row (spans 2 rows)
    if (includeYearColumn && includeLabels) {
        monthHeaders += '<th rowspan="2" class="sticky-first-column">Metric</th>';
    }
    
    // Generate month headers with proper year iteration
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        // Process all 24 fortnights for this year
        let monthCounts = new Array(12).fill(0);
        
        // Count fortnights per month
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            const monthIndex = FORTNIGHT_TO_MONTH[fn];
            monthCounts[monthIndex]++;
        }
        
        // Create month headers
        for (let month = 0; month < 12; month++) {
            if (monthCounts[month] > 0) {
                monthHeaders += `<th colspan="${monthCounts[month]}" class="month-header">${MONTHS[month]}-${year}</th>`;
            }
        }
    }
    
    // Generate fortnight headers (no need to add first column as it's already spanned from above)
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            fortnightHeaders += `<th class="fortnight-header">FN${String(fn).padStart(2, '0')}</th>`;
        }
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
    addCohortForm.addEventListener('submit', handleAddCohort);

    // Edit FTE button
    editFTEBtn.addEventListener('click', openFTEModal);

    // Add Pathway button
    addPathwayBtn.addEventListener('click', openAddPathwayModal);

    // Toggle FTE Summary button
    toggleFTEBtn.addEventListener('click', toggleFTESummary);
    
    // Edit Priority button
    if (editPriorityBtn) {
        editPriorityBtn.addEventListener('click', openPriorityModal);
    }

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
    document.getElementById('fte-edit-form').addEventListener('submit', handleFTEUpdate);

    // Pathway Edit form
    document.getElementById('pathway-edit-form').addEventListener('submit', handlePathwaySave);

    // Add Phase button
    document.getElementById('add-phase-btn').addEventListener('click', addPhaseInput);
    
    // Cohort Edit form
    document.getElementById('cohort-edit-form').addEventListener('submit', handleCohortUpdate);
    
    // Group by filter
    const groupByFilter = document.getElementById('group-by-filter');
    if (groupByFilter) {
        groupByFilter.addEventListener('change', handleGroupByChange);
    }
    
    // Scenarios panel
    const scenariosBtn = document.getElementById('scenarios-btn');
    const closeScenarios = document.getElementById('close-scenarios');
    const scenariosOverlay = document.getElementById('scenarios-overlay');
    const saveCurrentBtn = document.getElementById('save-current-scenario');
    
    if (scenariosBtn) {
        scenariosBtn.addEventListener('click', openScenariosPanel);
    }
    
    if (closeScenarios) {
        closeScenarios.addEventListener('click', closeScenariosPanel);
    }
    
    if (scenariosOverlay) {
        scenariosOverlay.addEventListener('click', closeScenariosPanel);
    }
    
    if (saveCurrentBtn) {
        saveCurrentBtn.addEventListener('click', saveCurrentScenario);
    }
    
    // Training Planner
    const trainingPlannerBtn = document.getElementById('training-planner-btn');
    const trainingPlannerModal = document.getElementById('training-planner-modal');
    const plannerTabs = document.querySelectorAll('.planner-tab');
    const validateBulkBtn = document.getElementById('validate-bulk');
    const applyBulkBtn = document.getElementById('apply-bulk');
    const targetForm = document.getElementById('target-form');
    const applyOptimizedBtn = document.getElementById('apply-optimized');
    
    if (trainingPlannerBtn) {
        trainingPlannerBtn.addEventListener('click', () => {
            trainingPlannerModal.classList.add('active');
        });
    }
    
    // Close modal handlers
    const plannerModalClose = trainingPlannerModal?.querySelector('.modal-close');
    if (plannerModalClose) {
        plannerModalClose.addEventListener('click', () => {
            trainingPlannerModal.classList.remove('active');
        });
    }
    
    // Close on outside click
    trainingPlannerModal?.addEventListener('click', (e) => {
        if (e.target === trainingPlannerModal) {
            trainingPlannerModal.classList.remove('active');
        }
    });
    
    plannerTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchPlannerTab(e.target.dataset.tab);
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
    }
    
    if (applyOptimizedBtn) {
        applyOptimizedBtn.addEventListener('click', applyOptimizedSchedule);
    }
}

// View Management
function switchView(viewName) {
    navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === viewName);
    });

    // Hide all views
    dashboardView.classList.remove('active');
    plannerView.classList.remove('active');
    settingsView.classList.remove('active');

    // Show selected view
    switch(viewName) {
        case 'dashboard':
            dashboardView.classList.add('active');
            updateDashboard();
            break;
        case 'planner':
            plannerView.classList.add('active');
            break;
        case 'settings':
            settingsView.classList.add('active');
            renderPrioritySettingsTable();
            renderPathwaysTable();
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
        startFortnight: parseInt(formData.get('startFortnight'))
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
    renderFTESummaryTable();
    renderDemandTable();
    renderSurplusDeficitTable();
    
    // Update dashboard if it's active
    if (dashboardView && dashboardView.classList.contains('active')) {
        updateDashboard();
    }
}

// Setup synchronized horizontal scrolling for all tables
function setupSynchronizedScrolling() {
    const containers = [
        document.getElementById('fte-summary-table-container'),
        document.getElementById('gantt-chart-container'),
        document.getElementById('demand-table-container'),
        document.getElementById('surplus-deficit-container')
    ];
    
    let isScrolling = false;
    
    containers.forEach(container => {
        if (container) {
            container.addEventListener('scroll', function(e) {
                if (!isScrolling) {
                    isScrolling = true;
                    containers.forEach(otherContainer => {
                        if (otherContainer && otherContainer !== e.target) {
                            otherContainer.scrollLeft = e.target.scrollLeft;
                        }
                    });
                    requestAnimationFrame(() => {
                        isScrolling = false;
                    });
                }
            });
        }
    });
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

// Render FTE Summary Table
function renderFTESummaryTable() {
    const container = document.getElementById('fte-summary-table-container');
    const headers = generateTableHeaders(true, true);
    const isExpanded = toggleFTEBtn.getAttribute('aria-expanded') === 'true';
    
    let html = '<div class="table-wrapper"><table class="data-table">';
    html += '<thead>';
    html += headers.monthRow;
    html += headers.fortnightRow;
    html += '</thead>';
    html += '<tbody>';
    
    // Total Supply row (always visible)
    html += '<tr class="total-supply-row">';
    html += '<td class="sticky-first-column total-supply-cell">Total Supply</td>';
    
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        const totalFTE = TRAINER_CATEGORIES.reduce((sum, cat) => sum + trainerFTE[year][cat], 0);
        const fortnightlyTotal = (totalFTE / FORTNIGHTS_PER_YEAR).toFixed(2);
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            html += `<td class="data-cell total-supply-cell">${fortnightlyTotal}</td>`;
        }
    }
    html += '</tr>';
    
    // Category details (only shown when expanded)
    if (isExpanded) {
        TRAINER_CATEGORIES.forEach(category => {
            html += '<tr class="category-detail">';
            html += `<td class="sticky-first-column category-detail-cell">${category} Supply</td>`;
            
            for (let year = START_YEAR; year <= END_YEAR; year++) {
                const fortnightlyFTE = (trainerFTE[year][category] / FORTNIGHTS_PER_YEAR).toFixed(2);
                for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
                    html += `<td class="data-cell category-detail-cell">${fortnightlyFTE}</td>`;
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
    const { demand } = calculateDemand();
    const headers = generateTableHeaders(true, true);
    
    let html = '<div class="table-wrapper"><table class="data-table">';
    html += '<thead>';
    html += headers.monthRow;
    html += headers.fortnightRow;
    html += '</thead>';
    html += '<tbody>';
    
    // Demand rows by training type (using priority config order)
    priorityConfig.forEach(config => {
        html += '<tr>';
        html += `<td class="sticky-first-column">${config.trainingType} Demand</td>`;
        
        for (let year = START_YEAR; year <= END_YEAR; year++) {
            for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
                const demandData = demand[year]?.[fn] || { byTrainingType: {} };
                const value = demandData.byTrainingType[config.trainingType] || 0;
                html += `<td class="data-cell">${value.toFixed(2)}</td>`;
            }
        }
        
        html += '</tr>';
    });
    
    // Total Demand row
    html += '<tr>';
    html += '<td class="sticky-first-column total-row">Total Demand</td>';
    
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            const demandData = demand[year]?.[fn] || { total: 0 };
            html += `<td class="data-cell total-row">${demandData.total.toFixed(2)}</td>`;
        }
    }
    
    html += '</tr>';
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Render Surplus/Deficit Table
function renderSurplusDeficitTable() {
    const container = document.getElementById('surplus-deficit-container');
    const { demand, ltCpDeficit } = calculateDemand();
    const headers = generateTableHeaders(true, true);
    
    let html = '<div class="table-wrapper"><table class="data-table">';
    html += '<thead>';
    html += headers.monthRow;
    html += headers.fortnightRow;
    html += '</thead>';
    html += '<tbody>';
    
    // Category-specific surplus/deficit rows
    TRAINER_CATEGORIES.forEach(category => {
        html += '<tr>';
        html += `<td class="sticky-first-column">${category} S/D</td>`;
        
        for (let year = START_YEAR; year <= END_YEAR; year++) {
            const categorySupply = trainerFTE[year][category] / FORTNIGHTS_PER_YEAR;
            for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
                const allocated = demand[year]?.[fn]?.allocated?.[category] || 0;
                const difference = categorySupply - allocated;
                const isDeficit = difference < 0;
                html += `<td class="data-cell ${isDeficit ? 'deficit' : 'surplus'}">${difference.toFixed(2)}</td>`;
            }
        }
        
        html += '</tr>';
    });
    
    // LT-CP Training Deficit row
    html += '<tr>';
    html += '<td class="sticky-first-column">LT-CP Training Deficit</td>';
    
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            const deficit = ltCpDeficit[year]?.[fn] || 0;
            const hasDeficit = deficit > 0;
            html += `<td class="data-cell ${hasDeficit ? 'deficit' : ''}">${deficit.toFixed(2)}</td>`;
        }
    }
    
    html += '</tr>';
    
    // Total Net S/D row (Total Initial FTE - Total Line Training Demand)
    html += '<tr>';
    html += '<td class="sticky-first-column total-row">Total Net S/D</td>';
    
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        // Calculate total initial FTE for the year (sum of all categories)
        const totalYearlyFTE = TRAINER_CATEGORIES.reduce((sum, cat) => sum + trainerFTE[year][cat], 0);
        const totalFortnightlyFTE = totalYearlyFTE / FORTNIGHTS_PER_YEAR;
        
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            // Get total line training demand (sum of all training types)
            const demandData = demand[year]?.[fn] || { byTrainingType: {} };
            const totalLineTrainingDemand = 
                (demandData.byTrainingType['LT-CAD'] || 0) +
                (demandData.byTrainingType['LT-CP'] || 0) +
                (demandData.byTrainingType['LT-FO'] || 0);
            
            // Total Net S/D = Total Initial FTE - Total Line Training Demand
            const totalNetSD = totalFortnightlyFTE - totalLineTrainingDemand;
            const isDeficit = totalNetSD < 0;
            html += `<td class="data-cell total-row ${isDeficit ? 'deficit' : 'surplus'}">${totalNetSD.toFixed(2)}</td>`;
        }
    }
    
    html += '</tr>';
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// Calculate Demand with priority-based allocation
function calculateDemand() {
    const demand = {};
    const ltCpDeficit = {};

    // Initialize demand structure
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        demand[year] = {};
        ltCpDeficit[year] = {};
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            demand[year][fn] = {
                total: 0,
                cohortCount: 0,
                byTrainingType: {},  // Changed from byPriority
                byCategory: {},
                allocated: {},
                unallocated: {}
            };
            ltCpDeficit[year][fn] = 0;
            
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
    activeCohorts.forEach(cohort => {
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (!pathway) return;

        let currentYear = cohort.startYear;
        let currentFortnight = cohort.startFortnight;

        pathway.phases.forEach(phase => {
            for (let i = 0; i < phase.duration; i++) {
                if (currentYear > END_YEAR) break;
                
                // Only track demand for line training phases with trainerDemandType
                if (phase.trainerDemandType) {
                    // Demand equals number of trainees (not divided by any ratio)
                    const phaseDemand = cohort.numTrainees;
                    
                    demand[currentYear][currentFortnight].total += phaseDemand;
                    demand[currentYear][currentFortnight].cohortCount += 1;
                    demand[currentYear][currentFortnight].byTrainingType[phase.trainerDemandType] += phaseDemand;
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
        });
    });

    // Perform cascading allocation based on priority config
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            const fortnightDemand = demand[year][fn];
            const supply = {};
            
            // Get available supply for this fortnight
            TRAINER_CATEGORIES.forEach(cat => {
                supply[cat] = trainerFTE[year][cat] / FORTNIGHTS_PER_YEAR;
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

    return { demand, ltCpDeficit };
}

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
    
    // Calculate the total fortnights needed for the chart
    const totalYears = END_YEAR - START_YEAR + 1;
    const totalFortnights = totalYears * FORTNIGHTS_PER_YEAR;
    
    // Start building the Gantt chart HTML
    let html = '<div class="table-wrapper"><table class="gantt-table data-table">';
    
    // Create header with months and fortnights using the shared function
    const headers = generateTableHeaders(false, false);
    
    html += '<thead>';
    
    // Month row with custom first column
    html += '<tr>';
    html += '<th rowspan="2" class="sticky-first-column gantt-first-column">Cohort</th>';
    
    // Add month headers
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        let monthCounts = new Array(12).fill(0);
        
        // Count fortnights per month
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            const monthIndex = FORTNIGHT_TO_MONTH[fn];
            monthCounts[monthIndex]++;
        }
        
        // Create month headers
        for (let month = 0; month < 12; month++) {
            if (monthCounts[month] > 0) {
                html += `<th colspan="${monthCounts[month]}" class="month-header">${MONTHS[month]}-${year}</th>`;
            }
        }
    }
    html += '</tr>';
    
    // Fortnight row
    html += '<tr>';
    
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
            html += `<th class="fortnight-header gantt-fortnight-header">FN${String(fn).padStart(2, '0')}</th>`;
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
            
            // Fill remaining cells
            for (let year = START_YEAR; year <= END_YEAR; year++) {
                for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
                    html += `<td class="group-header-cell"></td>`;
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
        
        html += '<tr>';
        
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
        
        pathway.phases.forEach((phase, pIndex) => {
            for (let i = 0; i < phase.duration; i++) {
                const key = `${tempYear}-${tempFortnight}`;
                cellData[key] = {
                    phase: phase,
                    phaseIndex: pIndex,
                    isStart: i === 0,
                    isEnd: i === phase.duration - 1,
                    progress: i + 1,
                    totalDuration: phase.duration
                };
                
                tempFortnight++;
                if (tempFortnight > FORTNIGHTS_PER_YEAR) {
                    tempFortnight = 1;
                    tempYear++;
                }
            }
        });
        
        // Render cells
        for (let year = START_YEAR; year <= END_YEAR; year++) {
            for (let fn = 1; fn <= FORTNIGHTS_PER_YEAR; fn++) {
                const cellKey = `${year}-${fn}`;
                const cell = cellData[cellKey];
                
                if (cell) {
                    const phaseColors = {
                        'GS+SIM': '#95a5a6',
                        'Ground School': '#95a5a6',
                        'LT-CAD': '#3498db',
                        'LT-CP': '#27ae60',
                        'LT-FO': '#f39c12',
                        'Flight Training': '#e74c3c',
                        'Line Training': '#27ae60'
                    };
                    
                    let backgroundColor = phaseColors[cell.phase.name] || '#9b59b6';
                    let cellContent = '';
                    
                    // Add phase name if it's the start of the phase
                    // For short phases (1-2 fortnights), use smaller font or abbreviation
                    if (cell.isStart) {
                        if (cell.phase.duration >= 3) {
                            cellContent = `<span style="font-size: 10px; color: white; font-weight: 500;">${cell.phase.name}</span>`;
                        } else if (cell.phase.duration === 2) {
                            // For 2-fortnight phases, use abbreviated text
                            const abbreviation = cell.phase.name === 'GS+SIM' ? 'GS' : cell.phase.name.replace('LT-', '');
                            cellContent = `<span style="font-size: 9px; color: white; font-weight: 500;">${abbreviation}</span>`;
                        }
                        // For 1-fortnight phases, no text (too small)
                    }
                    
                    const tooltip = `${cohort.numTrainees} x ${pathway.name}\n${cell.phase.name}\nFortnight ${cell.progress}/${cell.totalDuration}\nYear ${year}, Fortnight ${fn}`;
                    
                    html += `<td class="gantt-phase-cell data-cell" style="background-color: ${backgroundColor};" title="${tooltip}">${cellContent}</td>`;
                } else {
                    // Empty cell
                    html += '<td class="gantt-empty-cell data-cell"></td>';
                }
            }
        }
        
        html += '</tr>';
        });
    });
    
    html += '</tbody>';
    html += '</table></div>';
    
    container.innerHTML = html;
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
        html += '<tr><td colspan="7" style="background-color: #f0f0f0; font-weight: bold; padding: 10px;">Captain (CP) Pathways</td></tr>';
        cpPathways.forEach(pathway => {
            const totalDuration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
            const phaseSummary = pathway.phases.map(p => `${p.name} (${p.duration}fn)`).join(', ');
            
            html += `
                <tr>
                    <td>${pathway.id}</td>
                    <td>${pathway.name}</td>
                    <td>${pathway.type}</td>
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
        html += '<tr><td colspan="7" style="background-color: #f0f0f0; font-weight: bold; padding: 10px;">First Officer (FO) / Cadet (CAD) Pathways</td></tr>';
        otherPathways.forEach(pathway => {
            const totalDuration = pathway.phases.reduce((sum, phase) => sum + phase.duration, 0);
            const phaseSummary = pathway.phases.map(p => `${p.name} (${p.duration}fn)`).join(', ');
            
            html += `
                <tr>
                    <td>${pathway.id}</td>
                    <td>${pathway.name}</td>
                    <td>${pathway.type}</td>
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
function openFTEModal() {
    const container = document.getElementById('fte-edit-container');
    
    let html = '<div style="max-height: 500px; overflow-y: auto;">';
    
    // Quick fill buttons at the top
    html += '<div class="fte-quick-fill" style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; position: sticky; top: 0; z-index: 10; background-color: white; border-bottom: 2px solid #e0e0e0;">';
    html += '<h4 style="margin-bottom: 10px;">Quick Fill All:</h4>';
    html += '<div style="display: flex; gap: 10px; flex-wrap: wrap;">';
    html += '<button type="button" class="btn btn-secondary" onclick="quickFillFTE(10)">10 per fortnight</button>';
    html += '<button type="button" class="btn btn-secondary" onclick="quickFillFTE(15)">15 per fortnight</button>';
    html += '<button type="button" class="btn btn-secondary" onclick="quickFillFTE(20)">20 per fortnight</button>';
    html += '<button type="button" class="btn btn-secondary" onclick="quickFillFTE(25)">25 per fortnight</button>';
    html += '<button type="button" class="btn btn-secondary" onclick="quickFillFTE(0)">Clear All</button>';
    html += '</div>';
    html += '</div>';

    html += generateFTEInputFields();
    html += '</div>';

    container.innerHTML = html;
    fteModal.classList.add('active');
}

function generateFTEInputFields() {
    let html = '';
    
    // Create a simple table for years with FTE per fortnight
    html += '<table class="fte-edit-table" style="width: 100%; border-collapse: collapse;">';
    html += '<thead>';
    html += '<tr>';
    html += '<th style="text-align: left; padding: 10px; background-color: #f8f9fa; border: 1px solid #e0e0e0;">Year</th>';
    
    // Add column headers for each trainer category
    TRAINER_CATEGORIES.forEach(category => {
        html += `<th style="text-align: center; padding: 10px; background-color: #f8f9fa; border: 1px solid #e0e0e0;">${category}</th>`;
    });
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    
    // Add rows for each year
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        html += '<tr>';
        html += `<td style="padding: 10px; font-weight: 500; border: 1px solid #e0e0e0;">${year}</td>`;
        
        TRAINER_CATEGORIES.forEach(category => {
            const fortnightlyFTE = trainerFTE[year][category] / FORTNIGHTS_PER_YEAR;
            html += `<td style="padding: 8px; text-align: center; border: 1px solid #e0e0e0;">`;
            html += `<input type="number" id="fte-${year}-${category}" name="fte-${year}-${category}" `;
            html += `value="${fortnightlyFTE.toFixed(1)}" min="0" step="0.5" style="width: 80px; text-align: center;" `;
            html += `data-year="${year}" data-category="${category}">`;
            html += `</td>`;
        });
        html += '</tr>';
    }
    
    html += '</tbody>';
    html += '</table>';
    
    return html;
}

function quickFillFTE(fortnightlyValue) {
    // Fill all inputs with the same fortnightly value
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        TRAINER_CATEGORIES.forEach(category => {
            const input = document.getElementById(`fte-${year}-${category}`);
            if (input) {
                input.value = fortnightlyValue.toFixed(1);
            }
        });
    }
}

// Removed switchFTEInputMode function as it's no longer needed

function openAddPathwayModal() {
    document.getElementById('pathway-modal-title').textContent = 'Add New Pathway';
    document.getElementById('pathway-name').value = '';
    
    // Add pathway type selector if not exists
    const pathwayForm = document.getElementById('pathway-edit-form');
    const typeGroup = pathwayForm.querySelector('.pathway-type-group');
    if (!typeGroup) {
        const pathwayNameGroup = pathwayForm.querySelector('.form-group');
        const typeHtml = `
            <div class="form-group pathway-type-group">
                <label for="pathway-type">Pathway Type:</label>
                <select id="pathway-type" name="pathwayType" required>
                    <option value="CP">Captain (CP)</option>
                    <option value="FO">First Officer (FO)</option>
                    <option value="CAD">Cadet (CAD)</option>
                </select>
            </div>
        `;
        pathwayNameGroup.insertAdjacentHTML('afterend', typeHtml);
    }
    
    // Add comments field if not exists
    const commentsGroup = pathwayForm.querySelector('.comments-group');
    if (!commentsGroup) {
        const typeGroupElement = pathwayForm.querySelector('.pathway-type-group');
        const commentsHtml = `
            <div class="form-group comments-group">
                <label for="pathway-comments">Comments (optional):</label>
                <textarea id="pathway-comments" name="pathwayComments" rows="3" 
                    placeholder="Add any notes or special considerations for this pathway..."
                    style="width: 100%; resize: vertical;"></textarea>
            </div>
        `;
        typeGroupElement.insertAdjacentHTML('afterend', commentsHtml);
    }
    
    // Clear comments field
    const commentsField = document.getElementById('pathway-comments');
    if (commentsField) {
        commentsField.value = '';
    }
    
    // Clear any editing ID from previous edits
    delete pathwayForm.dataset.editingPathwayId;
    
    document.getElementById('pathway-phases-container').innerHTML = '';
    addPhaseInput(); // Add one initial phase
    pathwayModal.classList.add('active');
}

function openPriorityModal() {
    const container = document.getElementById('priority-edit-container');
    
    let html = '<div class="priority-edit-form">';
    html += '<p style="margin-bottom: 15px;">Edit the priority order and trainer assignments for each training type:</p>';
    
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
    fteModal.classList.remove('active');
    pathwayModal.classList.remove('active');
    cohortModal.classList.remove('active');
    priorityModal.classList.remove('active');
}

// Handle FTE Update
function handleFTEUpdate(e) {
    e.preventDefault();
    
    // Update the FTE values - values are entered as fortnightly
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        TRAINER_CATEGORIES.forEach(category => {
            const fortnightlyValue = parseFloat(document.getElementById(`fte-${year}-${category}`).value) || 0;
            // Store as yearly total (fortnightly * 24)
            trainerFTE[year][category] = fortnightlyValue * FORTNIGHTS_PER_YEAR;
        });
    }

    // Close modal and refresh all tables
    closeModals();
    updateAllTables();
    
    // Ensure FTE summary is re-rendered with current state
    renderFTESummaryTable();
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
    const editingPathwayId = e.target.dataset.editingPathwayId;

    const phases = [];
    const phaseGroups = document.querySelectorAll('.phase-input-group');
    
    phaseGroups.forEach((group, index) => {
        const phaseNameSelect = group.querySelector(`select[name="phase-name-${index}"]`);
        const phaseName = phaseNameSelect ? phaseNameSelect.value : '';
        const duration = parseInt(group.querySelector(`input[name="phase-duration-${index}"]`).value);
        const ratio = parseInt(group.querySelector(`input[name="phase-ratio-${index}"]`).value);

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
                phases: phases
            };
            pathways.push(newPathway);
        }

        populatePathwaySelect();
        closeModals();
        renderPathwaysTable();
    }
}

// Add Phase Input
function addPhaseInput() {
    const container = document.getElementById('pathway-phases-container');
    const phaseCount = container.querySelectorAll('.phase-input-group').length;
    
    const phaseHtml = `
        <div class="phase-input-group">
            <div class="phase-header">
                <h4>Phase ${phaseCount + 1}</h4>
                <button type="button" class="remove-phase-btn" onclick="removePhase(this)">Remove</button>
            </div>
            <div class="phase-fields">
                <div class="form-group">
                    <label>Phase Name:</label>
                    <select name="phase-name-${phaseCount}" required>
                        <option value="">Select phase</option>
                        <option value="GS+SIM">GS+SIM (visual only - no demand tracking)</option>
                        <option value="LT-CAD">LT-CAD</option>
                        <option value="LT-CP">LT-CP</option>
                        <option value="LT-FO">LT-FO</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Duration (fortnights):</label>
                    <input type="number" name="phase-duration-${phaseCount}" min="1" required>
                </div>
                <div class="form-group">
                    <label>Student:Trainer Ratio:</label>
                    <input type="number" name="phase-ratio-${phaseCount}" min="1" required>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', phaseHtml);
}

// Remove Phase
function removePhase(button) {
    button.closest('.phase-input-group').remove();
}

// Edit Pathway
function editPathway(pathwayId) {
    const pathway = pathways.find(p => p.id === pathwayId);
    if (!pathway) return;
    
    // Update modal title
    document.getElementById('pathway-modal-title').textContent = 'Edit Pathway';
    
    // Fill in pathway name
    document.getElementById('pathway-name').value = pathway.name;
    
    // Add pathway type selector if not exists
    const pathwayForm = document.getElementById('pathway-edit-form');
    let typeGroup = pathwayForm.querySelector('.pathway-type-group');
    if (!typeGroup) {
        const pathwayNameGroup = pathwayForm.querySelector('.form-group');
        const typeHtml = `
            <div class="form-group pathway-type-group">
                <label for="pathway-type">Pathway Type:</label>
                <select id="pathway-type" name="pathwayType" required>
                    <option value="CP">Captain (CP)</option>
                    <option value="FO">First Officer (FO)</option>
                    <option value="CAD">Cadet (CAD)</option>
                </select>
            </div>
        `;
        pathwayNameGroup.insertAdjacentHTML('afterend', typeHtml);
    }
    
    // Add comments field if not exists
    const commentsGroup = pathwayForm.querySelector('.comments-group');
    if (!commentsGroup) {
        const typeGroupElement = pathwayForm.querySelector('.pathway-type-group');
        const commentsHtml = `
            <div class="form-group comments-group">
                <label for="pathway-comments">Comments (optional):</label>
                <textarea id="pathway-comments" name="pathwayComments" rows="3" 
                    placeholder="Add any notes or special considerations for this pathway..."
                    style="width: 100%; resize: vertical;"></textarea>
            </div>
        `;
        typeGroupElement.insertAdjacentHTML('afterend', commentsHtml);
    }
    
    // Set pathway type and comments
    document.getElementById('pathway-type').value = pathway.type || 'FO';
    document.getElementById('pathway-comments').value = pathway.comments || '';
    
    // Clear existing phases
    const phasesContainer = document.getElementById('pathway-phases-container');
    phasesContainer.innerHTML = '';
    
    // Add existing phases
    pathway.phases.forEach((phase, index) => {
        const phaseHtml = `
            <div class="phase-input-group">
                <div class="phase-header">
                    <h4>Phase ${index + 1}</h4>
                    <button type="button" class="remove-phase-btn" onclick="removePhase(this)">Remove</button>
                </div>
                <div class="phase-fields">
                    <div class="form-group">
                        <label>Phase Name:</label>
                        <select name="phase-name-${index}" required>
                            <option value="">Select phase</option>
                            <option value="GS+SIM" ${phase.name === 'GS+SIM' ? 'selected' : ''}>GS+SIM (visual only - no demand tracking)</option>
                            <option value="LT-CAD" ${phase.name === 'LT-CAD' ? 'selected' : ''}>LT-CAD</option>
                            <option value="LT-CP" ${phase.name === 'LT-CP' ? 'selected' : ''}>LT-CP</option>
                            <option value="LT-FO" ${phase.name === 'LT-FO' ? 'selected' : ''}>LT-FO</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Duration (fortnights):</label>
                        <input type="number" name="phase-duration-${index}" min="1" value="${phase.duration}" required>
                    </div>
                    <div class="form-group">
                        <label>Student:Trainer Ratio:</label>
                        <input type="number" name="phase-ratio-${index}" min="1" value="${phase.ratio}" required>
                    </div>
                </div>
            </div>
        `;
        phasesContainer.insertAdjacentHTML('beforeend', phaseHtml);
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
    
    // Store the cohort ID for saving
    document.getElementById('cohort-edit-form').dataset.editingCohortId = cohortId;
    
    // Open modal
    cohortModal.classList.add('active');
}

// Handle Cohort Update
function handleCohortUpdate(e) {
    e.preventDefault();
    
    const cohortId = parseInt(e.target.dataset.editingCohortId);
    const cohortIndex = activeCohorts.findIndex(c => c.id === cohortId);
    
    if (cohortIndex !== -1) {
        const formData = new FormData(e.target);
        
        activeCohorts[cohortIndex] = {
            ...activeCohorts[cohortIndex],
            numTrainees: parseInt(formData.get('numTrainees')),
            pathwayId: formData.get('pathway'), // Keep as string since pathways now use string IDs
            startYear: parseInt(formData.get('startYear')),
            startFortnight: parseInt(formData.get('startFortnight'))
        };
        
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
    if (confirm('Are you sure you want to remove this cohort?')) {
        activeCohorts = activeCohorts.filter(c => c.id !== cohortId);
        updateAllTables();
        renderGanttChart();
        setupSynchronizedScrolling();
        markDirty();
    }
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

// Training Planner Functions
function switchPlannerTab(tabName) {
    document.querySelectorAll('.planner-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    document.querySelectorAll('.planner-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
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
        
        // Parse format: "Month Year: X FO, Y CP, Z CAD"
        const match = line.match(/^(\w+)\s+(\d{4}):\s*(.+)$/i);
        if (!match) {
            errors.push(`Line ${index + 1}: Invalid format`);
            return;
        }
        
        const monthStr = match[1].toLowerCase();
        const year = parseInt(match[2]);
        const traineesStr = match[3];
        
        if (!monthMap.hasOwnProperty(monthStr)) {
            errors.push(`Line ${index + 1}: Invalid month "${match[1]}"`);
            return;
        }
        
        const month = monthMap[monthStr];
        const startFortnight = (month * 2) + 1; // Start at first fortnight of month
        
        // Parse trainees
        const traineeParts = traineesStr.split(',');
        traineeParts.forEach(part => {
            const traineeMatch = part.trim().match(/^(\d+)\s+(FO|CP|CAD)$/i);
            if (!traineeMatch) {
                errors.push(`Line ${index + 1}: Invalid trainee format "${part.trim()}"`);
                return;
            }
            
            const count = parseInt(traineeMatch[1]);
            const type = traineeMatch[2].toUpperCase();
            
            // Find matching pathway
            const pathway = pathways.find(p => p.type === type);
            if (!pathway) {
                errors.push(`Line ${index + 1}: No pathway found for type ${type}`);
                return;
            }
            
            cohorts.push({
                year: year,
                fortnight: startFortnight,
                numTrainees: count,
                pathwayId: pathway.id,
                type: type
            });
        });
    });
    
    return { cohorts, errors };
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
            startFortnight: cohort.fortnight
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
    console.log('CP Input:', cpInput.value, 'Parsed:', parseInt(cpInput.value) || 0);
    
    const targetCP = parseInt(cpInput.value) || 0;
    const targetFO = parseInt(foInput.value) || 0;
    const targetCAD = parseInt(cadInput.value) || 0;
    const targetDate = new Date(dateInput.value);
    const considerExisting = document.getElementById('consider-existing')?.checked ?? true;
    
    if (targetCP + targetFO + targetCAD === 0) {
        alert('Please enter at least one target');
        return;
    }
    
    // Calculate optimal schedule
    const schedule = calculateOptimalSchedule({
        cp: targetCP,
        fo: targetFO,
        cad: targetCAD
    }, targetDate, considerExisting);
    
    // Debug logging
    console.log('Optimization result:', schedule);
    
    // Display results
    const resultsDiv = document.getElementById('optimization-results');
    let html = '<h4>Optimized Schedule</h4>';
    
    if (schedule.feasible) {
        html += '<div class="validation-success">✅ Target is achievable</div>';
        
        // Show capacity constraints if relevant
        if (schedule.capacityAnalysis && considerExisting) {
            const gsSimConflicts = schedule.capacityAnalysis.conflicts.filter(c => c.type === 'GS+SIM');
            const trainerWarnings = schedule.capacityAnalysis.conflicts.filter(c => c.type === 'Trainer');
            
            if (gsSimConflicts.length > 0) {
                html += '<div class="capacity-constraints">';
                html += '<h5>GS+SIM Capacity Constraints Avoided:</h5>';
                html += '<ul>';
                gsSimConflicts.forEach(conflict => {
                    html += `<li>${conflict.time}: ${conflict.reason}</li>`;
                });
                html += '</ul>';
                html += '</div>';
            }
            
            if (trainerWarnings.length > 0) {
                html += '<div class="capacity-warning">';
                html += '<h5>⚠️ Trainer Capacity Warnings:</h5>';
                html += '<p>The following periods would have trainer deficits (negative S/D):</p>';
                html += '<ul>';
                trainerWarnings.forEach(warning => {
                    html += `<li><strong>${warning.time}:</strong> ${warning.reason}`;
                    if (warning.details && warning.details.length > 0) {
                        html += '<ul style="margin-top: 5px;">';
                        warning.details.forEach(detail => {
                            html += `<li style="font-size: 0.9em;">${detail.time}: Supply ${detail.supply} < Demand ${detail.demand} (Deficit: -${detail.deficit})</li>`;
                        });
                        html += '</ul>';
                    }
                    html += '</li>';
                });
                html += '</ul>';
                html += '<p style="font-style: italic; color: #666;">Note: Training may proceed but could be slower due to trainer shortages.</p>';
                html += '</div>';
            }
            
        }
        
        if (schedule.cohorts.length === 0) {
            html += '<div class="validation-info">✅ Target already met by existing cohorts. No additional training needed.</div>';
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
    } else {
        html += '<div class="validation-error">❌ Target not achievable by this date</div>';
        html += '<div class="validation-info">' + schedule.reason + '</div>';
        
        if (schedule.unmetDemand && schedule.unmetDemand.length > 0) {
            html += '<div class="validation-details">';
            html += '<p><strong>Unmet demand:</strong></p>';
            html += '<ul>';
            schedule.unmetDemand.forEach(u => {
                html += `<li>${u.type}: Only ${u.scheduled} of ${u.needed} can complete by target date (${u.shortfall} short)</li>`;
            });
            html += '</ul>';
            html += '</div>';
        }
        
        if (schedule.partialSchedule && schedule.partialSchedule.length > 0) {
            html += '<div class="validation-details">';
            html += '<h4>Partial schedule (what can be achieved):</h4>';
            html += '<div class="optimization-schedule">';
            
            schedule.partialSchedule.forEach(cohort => {
                const pathway = pathways.find(p => p.id === cohort.pathwayId);
                const month = MONTHS[Math.floor((cohort.startFortnight - 1) / 2)];
                html += `
                    <div class="schedule-item">
                        <div class="schedule-item-header">
                            <span>${month} ${cohort.startYear}</span>
                            <span>${cohort.numTrainees} x ${pathway?.name || cohort.type}</span>
                        </div>
                        <div class="schedule-item-details">
                            Completes: ${cohort.completionDate}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            html += '</div>';
        }
        
        document.getElementById('apply-optimized').disabled = true;
    }
    
    resultsDiv.innerHTML = html;
}

// Calculate optimal schedule
function calculateOptimalSchedule(targets, targetDate, considerExisting = true) {
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
            
            // Track GS+SIM usage for FO/CAD
            if (pathway.type === 'FO' || pathway.type === 'CAD') {
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
            unmetDemand.push({
                type,
                needed: rawNeeded,
                scheduled: 0,
                shortfall: rawNeeded,
                reason: `Training takes ${info.duration} fortnights. Would need to start in the past.`
            });
            return;
        }
        
        // Schedule cohorts
        let remainingTrainees = needed;
        let scheduled = 0;
        let startFn = currentFortnight + 2; // Start next month
        let startYear = currentYear;
        
        while (remainingTrainees > 0 && 
               (startYear < latestYear || (startYear === latestYear && startFn <= latestStart))) {
            let cohortSize = Math.min(remainingTrainees, info.maxPerCohort);
            
            // Check GS+SIM constraint if considering existing
            if (considerExisting && (type === 'FO' || type === 'CAD')) {
                const gsSimKey = `${startYear}-${startFn}`;
                const existingGsSim = capacityAnalysis.gsSimUsage[gsSimKey] || 0;
                const gsSimAvailable = 16 - existingGsSim;
                
                if (gsSimAvailable <= 0) {
                    // Skip this slot - no GS+SIM capacity
                    capacityAnalysis.conflicts.push({
                        type: 'GS+SIM',
                        time: `${MONTHS[Math.floor((startFn - 1) / 2)]} ${startYear}`,
                        reason: `Already ${existingGsSim} FO/CAD trainees, no capacity`
                    });
                    
                    // Move to next month
                    startFn += 2;
                    if (startFn > FORTNIGHTS_PER_YEAR) {
                        startFn -= FORTNIGHTS_PER_YEAR;
                        startYear++;
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
                pathway.phases.forEach(phase => {
                    for (let i = 0; i < phase.duration; i++) {
                        if (phase.trainerDemandType) {
                            const timeKey = `${checkYear}-${checkFn}`;
                            const existingDemand = capacityAnalysis.trainerDemand[timeKey]?.total || 0;
                            const supply = capacityAnalysis.trainerSupply[timeKey] || 0;
                            const newDemand = cohortSize; // Direct 1:1 trainer demand
                            const totalDemand = existingDemand + newDemand;
                            
                            // Check if we would exceed capacity
                            if (totalDemand > supply) {
                                hasTrainerDeficit = true;
                                const deficit = totalDemand - supply;
                                deficitDetails.push({
                                    time: `${MONTHS[Math.floor((checkFn - 1) / 2)]} ${checkYear}`,
                                    deficit: deficit.toFixed(2),
                                    supply: supply.toFixed(2),
                                    demand: totalDemand.toFixed(2)
                                });
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
                
                // If trainer deficit detected, add warning but don't skip
                if (hasTrainerDeficit) {
                    capacityAnalysis.conflicts.push({
                        type: 'Trainer',
                        time: `${MONTHS[Math.floor((startFn - 1) / 2)]} ${startYear}`,
                        reason: `Would cause trainer deficit`,
                        details: deficitDetails,
                        severity: 'warning' // Mark as warning, not blocking
                    });
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
            if (endYear > targetYear || 
                (endYear === targetYear && endFn > targetEndFortnight)) {
                break; // Won't complete in time
            }
            
            cohorts.push({
                startYear: startYear,
                startFortnight: startFn,
                numTrainees: cohortSize,
                pathwayId: info.pathwayId,
                type: type,
                completionDate: `${MONTHS[Math.floor((endFn - 1) / 2)]} ${endYear}`
            });
            
            // Update capacity tracking for this new cohort
            if (considerExisting) {
                // Update GS+SIM usage
                if (type === 'FO' || type === 'CAD') {
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
            
            remainingTrainees -= cohortSize;
            scheduled += cohortSize;
            
            // Move to next month
            startFn += 2;
            if (startFn > FORTNIGHTS_PER_YEAR) {
                startFn -= FORTNIGHTS_PER_YEAR;
                startYear++;
            }
        }
        
        // Check if we scheduled everything
        if (scheduled < needed) {
            unmetDemand.push({
                type,
                needed,
                scheduled,
                shortfall: needed - scheduled
            });
        }
    });
    
    // Sort chronologically
    cohorts.sort((a, b) => {
        if (a.startYear !== b.startYear) return a.startYear - b.startYear;
        return a.startFortnight - b.startFortnight;
    });
    
    if (unmetDemand.length > 0) {
        return {
            feasible: false,
            reason: 'Cannot meet all training targets by the specified date',
            unmetDemand,
            partialSchedule: cohorts,
            capacityAnalysis
        };
    }
    
    return { 
        feasible: true, 
        cohorts,
        capacityAnalysis
    };
}

// Apply optimized schedule
function applyOptimizedSchedule() {
    if (!window.pendingOptimizedSchedule) return;
    
    window.pendingOptimizedSchedule.forEach(cohort => {
        activeCohorts.push({
            id: nextCohortId++,
            numTrainees: cohort.numTrainees,
            pathwayId: cohort.pathwayId,
            startYear: cohort.startYear,
            startFortnight: cohort.startFortnight
        });
    });
    
    updateAllTables();
    renderGanttChart();
    markDirty();
    
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
    return {
        cohorts: activeCohorts,
        trainerFTE: trainerFTE,
        pathways: pathways,
        priorityConfig: priorityConfig,
        viewState: {
            groupBy: viewState.groupBy,
            collapsedGroups: viewState.collapsedGroups
        }
    };
}

function saveCurrentScenario() {
    const name = prompt('Enter a name for this scenario:');
    if (!name) return;
    
    const scenario = {
        id: Date.now(),
        name: name,
        date: new Date().toISOString(),
        state: getCurrentState(),
        stats: {
            totalCohorts: activeCohorts.length,
            totalTrainees: activeCohorts.reduce((sum, c) => sum + c.numTrainees, 0)
        }
    };
    
    scenarios.push(scenario);
    localStorage.setItem('pilotTrainerScenarios', JSON.stringify(scenarios));
    
    viewState.currentScenarioId = scenario.id;
    viewState.isDirty = false;
    
    updateCurrentScenarioDisplay();
    renderScenarioList();
}

function loadScenario(scenarioId) {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    if (viewState.isDirty) {
        if (!confirm('You have unsaved changes. Load scenario anyway?')) {
            return;
        }
    }
    
    // Load the scenario state
    activeCohorts = [...scenario.state.cohorts];
    trainerFTE = JSON.parse(JSON.stringify(scenario.state.trainerFTE));
    pathways = [...scenario.state.pathways];
    priorityConfig = [...scenario.state.priorityConfig];
    viewState.groupBy = scenario.state.viewState.groupBy;
    viewState.collapsedGroups = [...scenario.state.viewState.collapsedGroups];
    
    // Update current scenario tracking
    viewState.currentScenarioId = scenarioId;
    viewState.isDirty = false;
    
    // Refresh all views
    updateAllTables();
    renderGanttChart();
    populatePathwaySelect();
    setupSynchronizedScrolling();
    
    updateCurrentScenarioDisplay();
    closeScenariosPanel();
}

function deleteScenario(scenarioId) {
    if (!confirm('Are you sure you want to delete this scenario?')) return;
    
    scenarios = scenarios.filter(s => s.id !== scenarioId);
    localStorage.setItem('pilotTrainerScenarios', JSON.stringify(scenarios));
    
    if (viewState.currentScenarioId === scenarioId) {
        viewState.currentScenarioId = null;
    }
    
    renderScenarioList();
}

function renderScenarioList() {
    const container = document.getElementById('scenario-list');
    
    if (scenarios.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No saved scenarios yet</p>';
        return;
    }
    
    container.innerHTML = scenarios.map(scenario => {
        const date = new Date(scenario.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        return `
            <div class="scenario-card">
                <div class="scenario-card-header">
                    <div>
                        <div class="scenario-name">${scenario.name}</div>
                        <div class="scenario-date">${dateStr}</div>
                    </div>
                </div>
                <div class="scenario-stats">
                    <div class="scenario-stat">
                        <span>Cohorts:</span>
                        <strong>${scenario.stats.totalCohorts}</strong>
                    </div>
                    <div class="scenario-stat">
                        <span>Trainees:</span>
                        <strong>${scenario.stats.totalTrainees}</strong>
                    </div>
                </div>
                <div class="scenario-actions">
                    <button class="load-btn" onclick="loadScenario(${scenario.id})">Load</button>
                    <button class="delete-btn" onclick="deleteScenario(${scenario.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateCurrentScenarioDisplay() {
    const nameSpan = document.getElementById('current-scenario-name');
    if (viewState.currentScenarioId) {
        const scenario = scenarios.find(s => s.id === viewState.currentScenarioId);
        if (scenario) {
            nameSpan.textContent = scenario.name + (viewState.isDirty ? ' (modified)' : '');
        }
    } else {
        nameSpan.textContent = viewState.isDirty ? 'Unsaved Changes' : 'New Scenario';
    }
}

// Mark state as dirty when changes are made
function markDirty() {
    viewState.isDirty = true;
    updateCurrentScenarioDisplay();
}

// Dark Mode Functions
function initDarkMode() {
    // Check for saved dark mode preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    // Set up dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
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
    const ctx = document.getElementById('distribution-chart').getContext('2d');
    
    // Count trainees by pathway type
    const distribution = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentFortnight = (currentMonth * 2) + (currentDate.getDate() <= 14 ? 1 : 2);
    
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
            const type = pathway.type || 'Other';
            distribution[type] = (distribution[type] || 0) + cohort.numTrainees;
        }
    });
    
    if (distributionChart) {
        distributionChart.destroy();
    }
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e0e0e0' : '#666';
    
    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(distribution),
            datasets: [{
                data: Object.values(distribution),
                backgroundColor: [
                    '#3498db',
                    '#e74c3c',
                    '#f39c12',
                    '#2ecc71',
                    '#9b59b6'
                ],
                borderColor: isDarkMode ? '#2a2a2a' : '#fff',
                borderWidth: 2
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

// Make functions available globally for inline onclick
window.removeCohort = removeCohort;
window.editCohort = editCohort;
window.editPathway = editPathway;
window.removePhase = removePhase;
window.quickFillFTE = quickFillFTE;
window.toggleGroup = toggleGroup;
window.loadScenario = loadScenario;
window.deleteScenario = deleteScenario;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);