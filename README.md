# Pilot Trainer Supply/Demand Planner

A web-based application for managing pilot training cohorts and forecasting trainer supply and demand across multiple years.

## Features

### Core Functionality
- **Multi-Location Support**: Manage training operations across AU and NZ locations
- **Cross-Location Training**: Assign specific fortnights to use trainers from other locations
- **Cohort Management**: Add and track multiple training cohorts with different pathways
- **Trainer FTE Tracking**: Manage trainer availability by category (CATB, CATA, STP, RHS, LHS)
- **Demand Calculation**: Automatic calculation of trainer demand based on cohort schedules
- **Supply/Deficit Analysis**: Visual representation of trainer surplus and deficit over time
- **Priority-based Allocation**: Cascading trainer allocation based on training priorities

### Key Components
1. **Executive Dashboard**: Real-time metrics, charts, and alerts for training operations
2. **Training Pathways**: Pre-configured training programs (CP, FO, CAD) with defined phases
3. **Gantt Chart**: Visual timeline with drag-and-drop support and cross-location indicators
4. **FTE Management**: Year-by-year trainer availability configuration
5. **Priority Settings**: Configurable training priorities with cascading allocation rules
6. **Scenario Management**: Save, load, and compare different planning scenarios
7. **Training Planner**: Grid entry, bulk input, and optimization tools

## Technology Stack
- Pure JavaScript (ES6+)
- HTML5
- CSS3
- No external dependencies or frameworks

## Project Structure
```
trainer-view/
├── index.html                      # Main application HTML
├── app.js                         # Core application logic (~7000+ lines)
├── styles.css                     # Application styling with dark mode
├── trainer-view-standalone.html   # Single-file version with embedded CSS/JS
├── README.md                      # Project documentation
├── CLAUDE.md                      # Development instructions and context
├── screenshots/                   # Application screenshots
├── previous-viewers/              # Previous implementations
└── archive/                       # Completed implementation plans
```

## Key Concepts

### Trainer Categories
- **CATB, CATA, STP**: Can perform all line training types (LT-CAD, LT-CP, LT-FO)
- **RHS**: Can perform LT-CP and LT-FO only
- **LHS**: Can perform LT-FO only

### Priority System
1. **P1 (LT-CAD)**: Highest priority, served by CATB, CATA, STP
2. **P2 (LT-CP)**: Served by RHS, with overflow from P1 trainers
3. **P3 (LT-FO)**: Served by LHS, with overflow from all other trainers

### Demand Calculation
- Line training phases use 1:1 trainer-to-trainee ratio
- Ground school and simulator phases don't contribute to trainer demand
- Fortnightly periods (24 per year) for scheduling

## Usage

### Adding a Cohort
1. Enter number of trainees
2. Select training pathway
3. Choose start year and fortnight
4. Click "Add Cohort"

### Managing FTE
1. Click "Edit Detailed FTE" button
2. Enter fortnightly FTE values for each trainer category
3. Use quick-fill buttons for rapid configuration

### Pathway Management
1. Navigate to Settings tab
2. Add/edit pathways with custom phases
3. Include optional comments for special considerations

## Local Development
Simply open `index.html` in a modern web browser. No build process or server required.

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Version History
- **v1.5** (May 2025): Enhanced cross-location visibility
  - Split view toggle for demand tables
  - Cross-location cohorts display in Gantt
  - Cleaner numeric display (removed decimals)
  - Dynamic UI adjustments
- **v1.4** (May 2025): Cross-location training support
  - Multi-location operations (AU/NZ)
  - Fortnight-level trainer assignments
  - Visual indicators and movement summaries
- **v1.3** (May 2025): Major UI enhancements
  - Executive dashboard with real-time metrics
  - Dark mode support
  - Scenario management system
- **v1.2** (January 2025): Multi-location foundation
- **v1.1** (January 2025): UI polish and bug fixes
- **v1.0**: Initial release with core functionality

## License
This project is proprietary software. All rights reserved.

## Contributing
For bug reports or feature requests, please contact the development team.