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

// DOM Elements
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
    
    // Initialize settings tables if we're on settings view
    if (settingsView.classList.contains('active')) {
        renderPrioritySettingsTable();
        renderPathwaysTable();
    }
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
}

// View Management
function switchView(viewName) {
    navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === viewName);
    });

    if (viewName === 'planner') {
        plannerView.classList.add('active');
        settingsView.classList.remove('active');
    } else {
        plannerView.classList.remove('active');
        settingsView.classList.add('active');
        renderPrioritySettingsTable();
        renderPathwaysTable();
    }
}

// Populate Pathway Select
function populatePathwaySelect() {
    pathwaySelect.innerHTML = '<option value="">Select a pathway</option>';
    pathways.forEach(pathway => {
        const option = document.createElement('option');
        option.value = pathway.id;
        option.textContent = pathway.name;
        pathwaySelect.appendChild(option);
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
        option.textContent = `FN${String(fn).padStart(2, '0')}`;
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
}

// Update All Tables
function updateAllTables() {
    renderFTESummaryTable();
    renderDemandTable();
    renderSurplusDeficitTable();
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
    
    // Sort cohorts by start year and fortnight
    const sortedCohorts = [...activeCohorts].sort((a, b) => {
        if (a.startYear !== b.startYear) {
            return a.startYear - b.startYear;
        }
        return a.startFortnight - b.startFortnight;
    });
    
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
    
    // Render each cohort
    sortedCohorts.forEach((cohort, index) => {
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
        <div class="priority-info" style="margin-top: 20px; padding: 15px; background-color: #f0f8ff; border-radius: 5px;">
            <h4>How Priority Allocation Works:</h4>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li><strong>P1 (${priorityConfig[0].trainingType}):</strong> Served first by ${priorityConfig[0].primaryTrainers.join(', ')}</li>
                <li><strong>P2 (${priorityConfig[1].trainingType}):</strong> Served by ${priorityConfig[1].primaryTrainers.join(', ')} + any surplus from P1 trainers</li>
                <li><strong>P3 (${priorityConfig[2].trainingType}):</strong> Served by ${priorityConfig[2].primaryTrainers.join(', ')} + any surplus from all other trainers</li>
            </ul>
            <h4 style="margin-top: 15px;">Trainer Capabilities:</h4>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li><strong>CATB, CATA, STP:</strong> Can perform all line training types (LT-CAD, LT-CP, LT-FO)</li>
                <li><strong>RHS:</strong> Can perform LT-CP and LT-FO only (cannot do LT-CAD)</li>
                <li><strong>LHS:</strong> Can perform LT-FO only</li>
            </ul>
        </div>
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
    pathways.forEach(pathway => {
        const option = document.createElement('option');
        option.value = pathway.id;
        option.textContent = pathway.name;
        option.selected = pathway.id === cohort.pathwayId;
        editPathwaySelect.appendChild(option);
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
        option.textContent = `FN${String(fn).padStart(2, '0')}`;
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
    }
}

// Remove Cohort
function removeCohort(cohortId) {
    if (confirm('Are you sure you want to remove this cohort?')) {
        activeCohorts = activeCohorts.filter(c => c.id !== cohortId);
        updateAllTables();
        renderGanttChart();
        setupSynchronizedScrolling();
    }
}

// Make functions available globally for inline onclick
window.removeCohort = removeCohort;
window.editCohort = editCohort;
window.editPathway = editPathway;
window.removePhase = removePhase;
window.quickFillFTE = quickFillFTE;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);