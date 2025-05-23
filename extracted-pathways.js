// Extracted pathways from previous-viewer.html formatted for app.js

const extractedPathways = [
    {
        id: "A202",
        name: "A202 (2xCP)",
        groupSize: 2,
        type: "CP",
        phases: [
            { 
                name: "GS+SIM", 
                duration: 2, 
                trainerDemandType: null,
                ratio: 8 // Estimated based on typical GS+SIM ratios
            },
            { 
                name: "LT-CP", 
                duration: 6, 
                trainerDemandType: "LTCP",
                ratio: 2 // 1:1 trainer to trainee pair for line training
            }
        ]
    },
    {
        id: "A210",
        name: "A210 (2xFO)",
        groupSize: 2,
        type: "FO",
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
                trainerDemandType: "LTFO",
                ratio: 2
            },
            { 
                name: "LT-FO", 
                duration: 3, 
                trainerDemandType: "LTFO",
                ratio: 2
            }
        ]
    },
    {
        id: "A209",
        name: "A209 (2xCAD)",
        groupSize: 2,
        type: "CAD",
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
                trainerDemandType: "LTCAD",
                ratio: 2
            },
            { 
                name: "LT-FO", 
                duration: 3, 
                trainerDemandType: "LTFO",
                ratio: 2
            }
        ]
    },
    {
        id: "A212",
        name: "A212 (2xCAD)",
        groupSize: 2,
        type: "CAD",
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
                trainerDemandType: "LTCAD",
                ratio: 2
            },
            { 
                name: "LT-FO", 
                duration: 5, 
                trainerDemandType: "LTFO",
                ratio: 2
            }
        ]
    },
    {
        id: "A211",
        name: "A211 (2xCAD)",
        groupSize: 2,
        type: "CAD",
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
                trainerDemandType: "LTCAD",
                ratio: 2
            },
            { 
                name: "LT-FO", 
                duration: 2, 
                trainerDemandType: "LTFO",
                ratio: 2
            }
        ]
    },
    {
        id: "A203",
        name: "A203 (4xCP)",
        groupSize: 4,
        type: "CP",
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
                trainerDemandType: "LTCP",
                ratio: 2
            }
        ]
    }
];

// Trainer categories and qualifications from previous implementation
const trainerCategories = ["CATB", "CATA", "STP", "RHS", "LHS"];

const trainerQualifications = {
    "LTCAD": ["CATB", "CATA", "STP"],
    "LTCP": ["CATB", "CATA", "STP", "RHS"],
    "LTFO": ["CATB", "CATA", "STP", "RHS", "LHS"]
};

// Demand priority order
const demandPriorityOrder = ["Demand_P1_LTCAD", "Demand_P2_LTCP", "Demand_P3_LTFO"];

const demandKeyToNameMapping = {
    "Demand_P1_LTCAD": "LT-CAD (P1)",
    "Demand_P2_LTCP": "LT-CP (P2)",
    "Demand_P3_LTFO": "LT-FO (P3)"
};

// Export for use in app.js
export { 
    extractedPathways, 
    trainerCategories, 
    trainerQualifications, 
    demandPriorityOrder, 
    demandKeyToNameMapping 
};