// =============================================================================
// ASHRAE Ventilation Calculator - External Module
// Version: 2.0 External
// Compatible with: Google Sites, WordPress, any website
// =============================================================================

(function(global) {
    'use strict';

    // =============================================================================
    // 📋 CONFIGURACIÓN GLOBAL - MODIFICAR AQUÍ
    // =============================================================================
    const CONFIG = {
        version: '2.0-External',
        
        // Configuración de la aplicación
        app: {
            title: 'ASHRAE Ventilation Calculator',
            containerId: 'ashrae-calculator',
            loadingText: 'Loading ASHRAE Calculator...',
            errorText: 'Error loading calculator. Please refresh the page.'
        },
        
        // Tema y colores
        theme: {
            primary: '#2563eb',      // blue-600
            secondary: '#059669',    // green-600
            accent: '#7c3aed',       // purple-600
            warning: '#d97706',      // amber-600
            danger: '#dc2626',       // red-600
            light: '#f8fafc',        // slate-50
            dark: '#1e293b'          // slate-800
        },
        
        // Textos de la interfaz
        texts: {
            title: 'ASHRAE Ventilation Calculator',
            numberOfSystems: 'Number of Systems',
            areaName: 'Area Name',
            occupancyType: 'Occupancy Type',
            squareFeet: 'Area (Square Feet)',
            assignedSystem: 'Assigned System',
            addArea: 'Add Area',
            exportExcel: 'Export to Excel',
            preview: 'Preview',
            people: 'people',
            cfmAreaBased: 'CFM (area based)',
            cfmPeopleBased: 'CFM (people based)',
            cfmTotal: 'CFM (area + people)',
            systemsNote: 'Define how many ventilation systems you will have',
            completeFields: 'Complete all fields to see the preview',
            searchPlaceholder: 'Search for space type...',
            areaPlaceholder: 'EX: MAIN OFFICE, CLASSROOM 101',
            squareFeetPlaceholder: 'Enter square feet...',
            selectSystem: 'Select system...',
            noSpacesFound: 'No spaces found',
            spaceParameters: 'Space Parameters:',
            density: 'Density:',
            ratePerPerson: 'Rate per person:',
            ratePerArea: 'Rate per area:',
            numberOf: 'Number of',
            areaOutdoorAirflow: 'Area Outdoor Airflow',
            peopleOutdoorAirflow: 'People Outdoor Airflow',
            totalOutdoorAirflow: 'Total Outdoor Airflow',
            oaProvided: 'O/A Provided',
            areasAddedBySystem: 'Areas Added by System',
            subtotal: 'SUBTOTAL',
            grandTotal: 'GRAND TOTAL',
            actions: 'Actions',
            clickToEdit: 'Click to edit',
            clickToEditSystem: 'Click to edit system name',
            clickToEditOA: 'Click to edit O/A Provided',
            deleteArea: 'Delete area',
            defineSystemsFirst: 'First define the number of ventilation systems to be able to add areas.',
            defineSystemsAlert: 'Please define the number of ventilation systems.',
            completeAllFields: 'Please complete all fields before adding the area.',
            noAreasToExport: 'No areas to export. Please add some areas first.',
            exportError: 'Error exporting to Excel. Please try again.',
            basedOnASHRAE: 'Based on ASHRAE Standard 62.1 - Table 403.3.1.1 - Minimum Ventilation Rates'
        },
        
        // Configuraciones por defecto
        defaults: {
            systems: 3,
            roundingMultiple: 5
        }
    };

    // =============================================================================
    // 📊 DATOS ASHRAE - AGREGAR/MODIFICAR ESPACIOS AQUÍ
    // =============================================================================
    const ASHRAE_DATA = {
        // Oficinas
        'Office spaces': { density: 5, peopleRate: 5, areaRate: 0.06, category: 'Offices' },
        'Conference rooms': { density: 50, peopleRate: 5, areaRate: 0.06, category: 'Offices' },
        'Reception areas': { density: 30, peopleRate: 5, areaRate: 0.06, category: 'Offices' },
        'Main entry lobbies': { density: 10, peopleRate: 5, areaRate: 0.06, category: 'Offices' },
        'Telephone/data entry': { density: 60, peopleRate: 5, areaRate: 0.06, category: 'Offices' },
        
        // Educación
        'Classrooms (ages 5-8)': { density: 25, peopleRate: 10, areaRate: 0.12, category: 'Education' },
        'Classrooms (age 9 plus)': { density: 35, peopleRate: 10, areaRate: 0.12, category: 'Education' },
        'Computer lab': { density: 25, peopleRate: 10, areaRate: 0.12, category: 'Education' },
        'Libraries': { density: 10, peopleRate: 5, areaRate: 0.12, category: 'Education' },
        'Auditoriums': { density: 150, peopleRate: 5, areaRate: 0.06, category: 'Education' },
        'Art classroom': { density: 20, peopleRate: 10, areaRate: 0.18, category: 'Education' },
        'Day care (through age 4)': { density: 25, peopleRate: 10, areaRate: 0.18, category: 'Education' },
        'Lecture classroom': { density: 65, peopleRate: 7.5, areaRate: 0.06, category: 'Education' },
        'Lecture hall (fixed seats)': { density: 150, peopleRate: 7.5, areaRate: 0.06, category: 'Education' },
        'Media center': { density: 25, peopleRate: 10, areaRate: 0.12, category: 'Education' },
        'Science laboratories': { density: 25, peopleRate: 10, areaRate: 0.18, category: 'Education' },
        
        // Restaurantes y comida
        'Cafeteria, fast food': { density: 100, peopleRate: 7.5, areaRate: 0.18, category: 'Food Service' },
        'Dining rooms': { density: 70, peopleRate: 7.5, areaRate: 0.18, category: 'Food Service' },
        'Kitchens (cooking)': { density: 20, peopleRate: 7.5, areaRate: 0.12, category: 'Food Service' },
        'Bars, cocktail lounges': { density: 100, peopleRate: 7.5, areaRate: 0.18, category: 'Food Service' },
        
        // Retail y comercio
        'Sales': { density: 15, peopleRate: 7.5, areaRate: 0.12, category: 'Retail' },
        'Mall common areas': { density: 40, peopleRate: 7.5, areaRate: 0.06, category: 'Retail' },
        'Shipping and receiving': { density: 2, peopleRate: 10, areaRate: 0.12, category: 'Retail' },
        'Storage rooms': { density: 0, peopleRate: 0, areaRate: 0.12, category: 'Storage' },
        'Warehouses': { density: 0, peopleRate: 10, areaRate: 0.06, category: 'Storage' },
        'Supermarkets': { density: 8, peopleRate: 7.5, areaRate: 0.06, category: 'Retail' },
        
        // Espacios públicos
        'Corridors': { density: 0, peopleRate: 0, areaRate: 0.06, category: 'Public Spaces' },
        'Lobbies/prefunction': { density: 30, peopleRate: 7.5, areaRate: 0.06, category: 'Public Spaces' },
        'Courtrooms': { density: 70, peopleRate: 5, areaRate: 0.06, category: 'Public Spaces' },
        'Museums/galleries': { density: 40, peopleRate: 7.5, areaRate: 0.06, category: 'Public Spaces' },
        'Places of religious worship': { density: 120, peopleRate: 5, areaRate: 0.06, category: 'Public Spaces' },
        
        // Hoteles y alojamiento
        'Bedroom/living room': { density: 10, peopleRate: 5, areaRate: 0.06, category: 'Hotels' },
        'Conference/meeting': { density: 50, peopleRate: 5, areaRate: 0.06, category: 'Hotels' },
        'Dormitory sleeping areas': { density: 20, peopleRate: 5, areaRate: 0.06, category: 'Hotels' },
        'Gambling casinos': { density: 120, peopleRate: 7.5, areaRate: 0.18, category: 'Hotels' },
        
        // Servicios especializados
        'Barber': { density: 25, peopleRate: 7.5, areaRate: 0.06, category: 'Specialty' },
        'Beauty salons': { density: 25, peopleRate: 20, areaRate: 0.12, category: 'Specialty' },
        'Nail salons': { density: 25, peopleRate: 20, areaRate: 0.12, category: 'Specialty' },
        'Pet shops (animal areas)': { density: 10, peopleRate: 7.5, areaRate: 0.18, category: 'Specialty' },
        
        // Deportes y entretenimiento
        'Gym, stadium, arena (play area)': { density: 7, peopleRate: 20, areaRate: 0.18, category: 'Sports' },
        'Health club/aerobics room': { density: 40, peopleRate: 20, areaRate: 0.06, category: 'Sports' },
        'Health club/weight room': { density: 10, peopleRate: 20, areaRate: 0.06, category: 'Sports' },
        'Bowling alleys (seating areas)': { density: 40, peopleRate: 10, areaRate: 0.12, category: 'Sports' },
        'Swimming pools (pool and deck area)': { density: 0, peopleRate: 0, areaRate: 0.48, category: 'Sports' },
        'Spectator areas': { density: 150, peopleRate: 7.5, areaRate: 0.06, category: 'Sports' },
        'Disco/dance floors': { density: 100, peopleRate: 20, areaRate: 0.06, category: 'Sports' },
        'Game arcades': { density: 20, peopleRate: 7.5, areaRate: 0.18, category: 'Sports' },
        
        // Teatros y entretenimiento
        'Theater lobbies': { density: 150, peopleRate: 5, areaRate: 0.06, category: 'Theaters' },
        'Stages, studios': { density: 70, peopleRate: 10, areaRate: 0.06, category: 'Theaters' },
        'Ticket booths': { density: 60, peopleRate: 5, areaRate: 0.06, category: 'Theaters' },
        
        // Transporte
        'Platforms': { density: 100, peopleRate: 7.5, areaRate: 0.06, category: 'Transportation' },
        'Transportation waiting': { density: 100, peopleRate: 7.5, areaRate: 0.06, category: 'Transportation' },
        
        // Salas de trabajo
        'Bank vaults/safe deposit': { density: 5, peopleRate: 5, areaRate: 0.06, category: 'Workrooms' },
        'Computer (without printing)': { density: 4, peopleRate: 5, areaRate: 0.06, category: 'Workrooms' },
        'Copy, printing rooms': { density: 4, peopleRate: 5, areaRate: 0.06, category: 'Workrooms' },
        'Pharmacy (prep. area)': { density: 10, peopleRate: 5, areaRate: 0.18, category: 'Workrooms' },
        'Photo studios': { density: 10, peopleRate: 5, areaRate: 0.12, category: 'Workrooms' }
    };

    // =============================================================================
    // 🔧 FUNCIONES DE CÁLCULO
    // =============================================================================
    const Calculator = {
        calculateValues: (spaceType, squareFeet) => {
            if (!spaceType || !squareFeet || squareFeet <= 0) return null;
            
            const data = ASHRAE_DATA[spaceType];
            if (!data) return null;
            
            const sf = parseFloat(squareFeet);
            
            // Calcular personas (redondeado hacia arriba)
            const people = data.density > 0 ? Math.ceil((sf / 1000) * data.density) : 0;
            
            // Calcular flujos de aire
            const areaOutdoorAirflow = sf * data.areaRate;
            const peopleOutdoorAirflow = people * data.peopleRate;
            
            return {
                people: people,
                areaOutdoorAirflow: Math.round(areaOutdoorAirflow * 10) / 10,
                peopleOutdoorAirflow: Math.round(peopleOutdoorAirflow * 10) / 10,
                totalOutdoorAirflow: Math.round((areaOutdoorAirflow + peopleOutdoorAirflow) * 10) / 10
            };
        },

        roundUpToMultiple: (value, multiple = 5) => {
            return Math.ceil(value / multiple) * multiple;
        },

        calculateSystemTotals: (areas) => {
            return areas.reduce((totals, area) => ({
                totalOutdoorAirflow: totals.totalOutdoorAirflow + area.totalOutdoorAirflow
            }), { totalOutdoorAirflow: 0 });
        },

        calculateGrandTotals: (areas) => {
            return areas.reduce((totals, area) => ({
                grandTotalOutdoorAirflow: totals.grandTotalOutdoorAirflow + area.totalOutdoorAirflow
            }), { grandTotalOutdoorAirflow: 0 });
        }
    };

    // =============================================================================
    // 📁 FUNCIONES DE EXPORTACIÓN
    // =============================================================================
    const Exporter = {
        generateExcelData: (areas, systemData) => {
            const excelData = [];
            
            // Headers
            excelData.push([
                'Area Name', 'Occupancy Type', 'Area (ft²)', 'Rate per Person (CFM/person)',
                'Number of People', 'People Outdoor Airflow (CFM)', 'Rate per Area (CFM/ft²)',
                'Area Outdoor Airflow (CFM)', 'Total Outdoor Airflow (CFM)', 'O/A Provided (CFM)'
            ]);

            excelData.push([]);

            // Datos por sistema
            Object.entries(systemData.groupedAreas)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .forEach(([systemNumber, systemAreas]) => {
                    const systemTotals = Calculator.calculateSystemTotals(systemAreas);
                    const systemOaProvided = systemData.getOaProvided(parseInt(systemNumber), systemTotals.totalOutdoorAirflow);
                    
                    excelData.push([`${systemData.getSystemName(parseInt(systemNumber))}`, '', '', '', '', '', '', '', '', '']);

                    systemAreas.forEach(area => {
                        excelData.push([
                            area.name, area.occupancyType, area.squareFeet, area.peopleRate,
                            area.people, area.peopleOutdoorAirflow, area.areaRate,
                            area.areaOutdoorAirflow, area.totalOutdoorAirflow, ''
                        ]);
                    });

                    excelData.push([
                        `${CONFIG.texts.subtotal} ${systemData.getSystemName(parseInt(systemNumber))}`, '', '', '', '', '', '', '',
                        Math.round(systemTotals.totalOutdoorAirflow * 10) / 10, systemOaProvided
                    ]);

                    excelData.push([]);
                });

            const totals = Calculator.calculateGrandTotals(areas);
            excelData.push([
                CONFIG.texts.grandTotal, '', '', '', '', '', '', '',
                Math.round(totals.grandTotalOutdoorAirflow * 10) / 10, ''
            ]);

            return excelData;
        },

        exportToExcel: (excelData) => {
            try {
                if (typeof XLSX === 'undefined') {
                    console.error('XLSX library not loaded');
                    return false;
                }

                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(excelData);

                const colWidths = [
                    { wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
                    { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 15 }
                ];
                ws['!cols'] = colWidths;

                XLSX.utils.book_append_sheet(wb, ws, 'Ventilation Calculation');

                const now = new Date();
                const dateStr = now.toISOString().split('T')[0];
                const filename = `ASHRAE_Ventilation_${CONFIG.version}_${dateStr}.xlsx`;

                XLSX.writeFile(wb, filename);
                return true;
            } catch (error) {
                console.error('Export error:', error);
                return false;
            }
        }
    };

    // =============================================================================
    // 🎨 GENERADOR DE UI
    // =============================================================================
    const UIGenerator = {
        createStyles: () => {
            if (document.getElementById('ashrae-styles')) return;
            
            const style = document.createElement('style');
            style.id = 'ashrae-styles';
            style.textContent = `
                .ashrae-container {
                    max-width: 1152px;
                    margin: 0 auto;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                    min-height: 600px;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .ashrae-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    padding: 2rem;
                }
                .ashrae-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }
                .ashrae-title {
                    font-size: 1.875rem;
                    font-weight: bold;
                    color: #1f2937;
                    margin: 0;
                }
                .ashrae-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                @media (max-width: 768px) {
                    .ashrae-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .ashrae-input-group {
                    margin-bottom: 1.5rem;
                }
                .ashrae-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }
                .ashrae-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }
                .ashrae-input:focus {
                    outline: none;
                    border-color: ${CONFIG.theme.primary};
                    box-shadow: 0 0 0 3px ${CONFIG.theme.primary}20;
                }
                .ashrae-button {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                }
                .ashrae-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .ashrae-button-primary {
                    background: ${CONFIG.theme.primary};
                    color: white;
                }
                .ashrae-button-primary:hover:not(:disabled) {
                    background: #1d4ed8;
                }
                .ashrae-button-success {
                    background: ${CONFIG.theme.secondary};
                    color: white;
                }
                .ashrae-button-success:hover:not(:disabled) {
                    background: #047857;
                }
                .ashrae-result-card {
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }
                .ashrae-result-blue {
                    background: #eff6ff;
                    border: 1px solid #bfdbfe;
                }
                .ashrae-result-green {
                    background: #f0fdf4;
                    border: 1px solid #bbf7d0;
                }
                .ashrae-result-purple {
                    background: #faf5ff;
                    border: 1px solid #d8b4fe;
                }
                .ashrae-result-orange {
                    background: #fff7ed;
                    border: 1px solid #fed7aa;
                }
                .ashrae-loading {
                    text-align: center;
                    padding: 2rem;
                    color: #6b7280;
                }
                .ashrae-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 2rem;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .ashrae-table th,
                .ashrae-table td {
                    padding: 0.75rem;
                    text-align: left;
                    border-bottom: 1px solid #e5e7eb;
                }
                .ashrae-table th {
                    background: #f9fafb;
                    font-weight: 600;
                    color: #374151;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .ashrae-dropdown {
                    position: relative;
                }
                .ashrae-dropdown-list {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    max-height: 240px;
                    overflow-y: auto;
                    z-index: 50;
                    margin-top: 4px;
                }
                .ashrae-dropdown-item {
                    padding: 0.75rem;
                    cursor: pointer;
                    border-bottom: 1px solid #f3f4f6;
                    transition: background 0.2s;
                }
                .ashrae-dropdown-item:hover {
                    background: #f8fafc;
                }
                .ashrae-dropdown-item:last-child {
                    border-bottom: none;
                }
                .ashrae-note {
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                    padding: 1rem;
                    margin: 1rem 0;
                }
                .ashrae-footer {
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    font-size: 0.75rem;
                    color: #6b7280;
                }
            `;
            document.head.appendChild(style);
        },

        createHTML: () => {
            return `
                <div class="ashrae-container">
                    <div class="ashrae-card">
                        <div class="ashrae-header">
                            <span style="font-size: 2rem;">🧮</span>
                            <h1 class="ashrae-title">${CONFIG.texts.title} ${CONFIG.version}</h1>
                        </div>
                        
                        <div class="ashrae-grid">
                            <!-- Input Section -->
                            <div>
                                <div class="ashrae-input-group">
                                    <label class="ashrae-label">${CONFIG.texts.numberOfSystems}</label>
                                    <input type="number" id="numberOfSystems" class="ashrae-input" placeholder="${CONFIG.defaults.systems}" min="1" style="width: 80px; display: inline-block;">
                                    <small style="display: block; margin-top: 0.25rem; color: #6b7280;">${CONFIG.texts.systemsNote}</small>
                                </div>

                                <div class="ashrae-input-group">
                                    <label class="ashrae-label">${CONFIG.texts.areaName}</label>
                                    <input type="text" id="areaName" class="ashrae-input" placeholder="${CONFIG.texts.areaPlaceholder}" style="text-transform: uppercase;">
                                </div>

                                <div class="ashrae-input-group">
                                    <label class="ashrae-label">🏢 ${CONFIG.texts.occupancyType}</label>
                                    <div class="ashrae-dropdown">
                                        <input type="text" id="occupancySearch" class="ashrae-input" placeholder="${CONFIG.texts.searchPlaceholder}">
                                        <div id="occupancyDropdown" class="ashrae-dropdown-list" style="display: none;"></div>
                                    </div>
                                </div>

                                <div class="ashrae-input-group">
                                    <label class="ashrae-label">${CONFIG.texts.squareFeet}</label>
                                    <input type="number" id="squareFeet" class="ashrae-input" placeholder="${CONFIG.texts.squareFeetPlaceholder}" min="0" step="0.1">
                                </div>

                                <div class="ashrae-input-group" id="systemSelection" style="display: none;">
                                    <label class="ashrae-label">${CONFIG.texts.assignedSystem}</label>
                                    <select id="selectedSystem" class="ashrae-input">
                                        <option value="">${CONFIG.texts.selectSystem}</option>
                                    </select>
                                </div>

                                <div id="systemNote" class="ashrae-note">
                                    <strong>Note:</strong> ${CONFIG.texts.defineSystemsFirst}
                                </div>

                                <div id="spaceParameters" class="ashrae-input-group" style="display: none;">
                                    <div style="background: #f9fafb; padding: 1rem; border-radius: 8px;">
                                        <h3 style="margin: 0 0 0.5rem 0; font-weight: 600; color: #374151;">${CONFIG.texts.spaceParameters}</h3>
                                        <div id="parametersContent"></div>
                                    </div>
                                </div>

                                <button id="addAreaBtn" class="ashrae-button ashrae-button-primary" style="width: 100%;" disabled>
                                    🏢 ${CONFIG.texts.addArea}
                                </button>
                            </div>

                            <!-- Results Section -->
                            <div>
                                <div id="previewSection">
                                    <div class="ashrae-loading">
                                        🧮<br><br>${CONFIG.texts.completeFields}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Areas Table -->
                        <div id="areasTable" style="display: none;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 2rem 0 1rem 0;">
                                <h2 style="margin: 0; font-size: 1.5rem; font-weight: bold; color: #1f2937;">${CONFIG.texts.areasAddedBySystem}</h2>
                                <button id="exportBtn" class="ashrae-button ashrae-button-success">
                                    📥 ${CONFIG.texts.exportExcel}
                                </button>
                            </div>
                            <div id="tableContainer"></div>
                        </div>

                        <div class="ashrae-footer">
                            ${CONFIG.texts.basedOnASHRAE}
                        </div>
                    </div>
                </div>
            `;
        }
    };

    // =============================================================================
    // 🚀 CLASE PRINCIPAL DE LA APLICACIÓN
    // =============================================================================
    class ASHRAECalculator {
        constructor(containerId) {
            this.containerId = containerId;
            this.state = {
                areas: [],
                systemNames: {},
                oaProvided: {},
                selectedSpace: '',
                editingField: null
            };
            this.init();
        }

        init() {
            this.loadDependencies().then(() => {
                this.render();
                this.bindEvents();
            }).catch(error => {
                console.error('Failed to load dependencies:', error);
                this.showError();
            });
        }

        loadDependencies() {
            return new Promise((resolve, reject) => {
                const scripts = [
                    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
                ];
                
                let loaded = 0;
                const total = scripts.length;
                
                if (total === 0) {
                    resolve();
                    return;
                }

                scripts.forEach(src => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = () => {
                        loaded++;
                        if (loaded === total) resolve();
                    };
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            });
        }

        render() {
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error(`Container with id "${this.containerId}" not found`);
                return;
            }

            UIGenerator.createStyles();
            container.innerHTML = UIGenerator.createHTML();
        }

        bindEvents() {
            // Event listeners para todos los elementos
            document.getElementById('numberOfSystems').addEventListener('input', (e) => {
                this.updateSystemSelection(parseInt(e.target.value) || 0);
            });

            document.getElementById('areaName').addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
                this.updatePreview();
            });

            document.getElementById('occupancySearch').addEventListener('input', (e) => {
                this.handleOccupancySearch(e.target.value);
                this.updatePreview();
            });

            document.getElementById('squareFeet').addEventListener('input', () => {
                this.updatePreview();
            });

            document.getElementById('addAreaBtn').addEventListener('click', () => {
                this.addArea();
            });

            document.getElementById('exportBtn').addEventListener('click', () => {
                this.exportToExcel();
            });

            // Inicializar vista
            this.updateSystemSelection(0);
        }

        updateSystemSelection(numSystems) {
            const systemSelection = document.getElementById('systemSelection');
            const systemNote = document.getElementById('systemNote');
            const addBtn = document.getElementById('addAreaBtn');
            const selectedSystem = document.getElementById('selectedSystem');

            if (numSystems > 0) {
                systemSelection.style.display = 'block';
                systemNote.style.display = 'none';
                
                // Generar opciones de sistemas
                selectedSystem.innerHTML = `<option value="">${CONFIG.texts.selectSystem}</option>`;
                for (let i = 1; i <= numSystems; i++) {
                    const systemName = this.state.systemNames[i] || `System ${i}`;
                    selectedSystem.innerHTML += `<option value="${i}">${systemName}</option>`;
                }
            } else {
                systemSelection.style.display = 'none';
                systemNote.style.display = 'block';
            }

            this.updateAddButton();
        }

        handleOccupancySearch(searchTerm) {
            const dropdown = document.getElementById('occupancyDropdown');
            
            if (!searchTerm.trim()) {
                dropdown.style.display = 'none';
                this.state.selectedSpace = '';
                return;
            }

            const filtered = Object.keys(ASHRAE_DATA).filter(space =>
                space.toLowerCase().includes(searchTerm.toLowerCase())
            ).sort();

            if (filtered.length > 0) {
                dropdown.innerHTML = '';
                filtered.slice(0, 10).forEach(space => {
                    const item = document.createElement('div');
                    item.className = 'ashrae-dropdown-item';
                    item.innerHTML = `
                        <div style="font-weight: 500;">${space}</div>
                        <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">
                            ${CONFIG.texts.density} ${ASHRAE_DATA[space].density}/1000 ft² | 
                            Area: ${ASHRAE_DATA[space].areaRate} CFM/ft²
                        </div>
                    `;
                    item.addEventListener('click', () => {
                        document.getElementById('occupancySearch').value = space;
                        this.state.selectedSpace = space;
                        dropdown.style.display = 'none';
                        this.showSpaceParameters(space);
                        this.updatePreview();
                    });
                    dropdown.appendChild(item);
                });
                dropdown.style.display = 'block';
            } else {
                dropdown.innerHTML = `<div class="ashrae-dropdown-item">${CONFIG.texts.noSpacesFound}</div>`;
                dropdown.style.display = 'block';
            }

            // Verificar coincidencia exacta
            const exactMatch = Object.keys(ASHRAE_DATA).find(
                space => space.toLowerCase() === searchTerm.toLowerCase()
            );
            if (exactMatch) {
                this.state.selectedSpace = exactMatch;
                this.showSpaceParameters(exactMatch);
            }
        }

        showSpaceParameters(space) {
            const container = document.getElementById('spaceParameters');
            const content = document.getElementById('parametersContent');
            const data = ASHRAE_DATA[space];

            content.innerHTML = `
                <p style="margin: 0.25rem 0; font-size: 0.875rem; color: #4b5563;">
                    <strong>${CONFIG.texts.density}</strong> ${data.density} people/1000 ft²
                </p>
                <p style="margin: 0.25rem 0; font-size: 0.875rem; color: #4b5563;">
                    <strong>${CONFIG.texts.ratePerPerson}</strong> ${data.peopleRate} CFM/person
                </p>
                <p style="margin: 0.25rem 0; font-size: 0.875rem; color: #4b5563;">
                    <strong>${CONFIG.texts.ratePerArea}</strong> ${data.areaRate} CFM/ft²
                </p>
            `;
            container.style.display = 'block';
        }

        updatePreview() {
            const areaName = document.getElementById('areaName').value;
            const squareFeet = document.getElementById('squareFeet').value;
            const previewSection = document.getElementById('previewSection');

            if (this.state.selectedSpace && squareFeet && parseFloat(squareFeet) > 0) {
                const results = Calculator.calculateValues(this.state.selectedSpace, squareFeet);
                
                if (results) {
                    previewSection.innerHTML = `
                        <h2 style="margin: 0 0 1rem 0; font-size: 1.25rem; font-weight: bold; color: #1f2937;">${CONFIG.texts.preview}</h2>
                        
                        <div class="ashrae-result-card ashrae-result-blue">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span>👥</span>
                                <span style="font-weight: 600; color: #1e40af;">${CONFIG.texts.numberOf} People</span>
                            </div>
                            <p style="margin: 0; font-size: 1.5rem; font-weight: bold; color: #1e3a8a;">${results.people}</p>
                            <p style="margin: 0; font-size: 0.875rem; color: #3730a3;">${CONFIG.texts.people}</p>
                        </div>
                        
                        <div class="ashrae-result-card ashrae-result-green">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span>💨</span>
                                <span style="font-weight: 600; color: #065f46;">${CONFIG.texts.areaOutdoorAirflow}</span>
                            </div>
                            <p style="margin: 0; font-size: 1.5rem; font-weight: bold; color: #064e3b;">${results.areaOutdoorAirflow}</p>
                            <p style="margin: 0; font-size: 0.875rem; color: #047857;">${CONFIG.texts.cfmAreaBased}</p>
                        </div>
                        
                        <div class="ashrae-result-card ashrae-result-purple">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span>💨</span>
                                <span style="font-weight: 600; color: #7c2d12;">${CONFIG.texts.peopleOutdoorAirflow}</span>
                            </div>
                            <p style="margin: 0; font-size: 1.5rem; font-weight: bold; color: #581c87;">${results.peopleOutdoorAirflow}</p>
                            <p style="margin: 0; font-size: 0.875rem; color: #6b21a8;">${CONFIG.texts.cfmPeopleBased}</p>
                        </div>
                        
                        <div class="ashrae-result-card ashrae-result-orange">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <span>💨</span>
                                <span style="font-weight: 600; color: #c2410c;">${CONFIG.texts.totalOutdoorAirflow}</span>
                            </div>
                            <p style="margin: 0; font-size: 1.5rem; font-weight: bold; color: #ea580c;">${results.totalOutdoorAirflow}</p>
                            <p style="margin: 0; font-size: 0.875rem; color: #ea580c;">${CONFIG.texts.cfmTotal}</p>
                        </div>
                    `;
                }
            } else {
                previewSection.innerHTML = `
                    <div class="ashrae-loading">
                        🧮<br><br>${CONFIG.texts.completeFields}
                    </div>
                `;
            }

            this.updateAddButton();
        }

        updateAddButton() {
            const btn = document.getElementById('addAreaBtn');
            const areaName = document.getElementById('areaName').value.trim();
            const squareFeet = document.getElementById('squareFeet').value;
            const numberOfSystems = document.getElementById('numberOfSystems').value;
            const selectedSystem = document.getElementById('selectedSystem').value;

            const isValid = numberOfSystems && parseInt(numberOfSystems) > 0 && 
                          areaName && this.state.selectedSpace && 
                          squareFeet && parseFloat(squareFeet) > 0 && 
                          selectedSystem;

            btn.disabled = !isValid;
        }

        addArea() {
            const areaName = document.getElementById('areaName').value.trim();
            const squareFeet = document.getElementById('squareFeet').value;
            const numberOfSystems = document.getElementById('numberOfSystems').value;
            const selectedSystem = document.getElementById('selectedSystem').value;

            if (!numberOfSystems || parseInt(numberOfSystems) <= 0) {
                alert(CONFIG.texts.defineSystemsAlert);
                return;
            }

            if (!areaName || !this.state.selectedSpace || !squareFeet || parseFloat(squareFeet) <= 0 || !selectedSystem) {
                alert(CONFIG.texts.completeAllFields);
                return;
            }

            const results = Calculator.calculateValues(this.state.selectedSpace, squareFeet);
            if (!results) return;

            const data = ASHRAE_DATA[this.state.selectedSpace];
            const newArea = {
                id: Date.now(),
                name: areaName.toUpperCase(),
                occupancyType: this.state.selectedSpace,
                squareFeet: parseFloat(squareFeet),
                system: parseInt(selectedSystem),
                peopleRate: data.peopleRate,
                people: results.people,
                peopleOutdoorAirflow: results.peopleOutdoorAirflow,
                areaRate: data.areaRate,
                areaOutdoorAirflow: results.areaOutdoorAirflow,
                totalOutdoorAirflow: results.totalOutdoorAirflow
            };

            this.state.areas.push(newArea);

            // Limpiar formulario
            document.getElementById('areaName').value = '';
            document.getElementById('occupancySearch').value = '';
            document.getElementById('squareFeet').value = '';
            document.getElementById('selectedSystem').value = '';
            this.state.selectedSpace = '';
            document.getElementById('spaceParameters').style.display = 'none';
            document.getElementById('occupancyDropdown').style.display = 'none';

            this.updatePreview();
            this.renderAreasTable();
        }

        renderAreasTable() {
            const table = document.getElementById('areasTable');
            const container = document.getElementById('tableContainer');

            if (this.state.areas.length === 0) {
                table.style.display = 'none';
                return;
            }

            table.style.display = 'block';

            // Agrupar por sistema
            const grouped = {};
            this.state.areas.forEach(area => {
                if (!grouped[area.system]) {
                    grouped[area.system] = [];
                }
                grouped[area.system].push(area);
            });

            let tableHTML = `
                <table class="ashrae-table">
                    <thead>
                        <tr>
                            <th>${CONFIG.texts.areaName}</th>
                            <th>${CONFIG.texts.occupancyType}</th>
                            <th style="text-align: center;">Area (ft²)</th>
                            <th style="text-align: center;">People</th>
                            <th style="text-align: center;">${CONFIG.texts.totalOutdoorAirflow} (CFM)</th>
                            <th style="text-align: center;">${CONFIG.texts.oaProvided} (CFM)</th>
                            <th style="text-align: center;">${CONFIG.texts.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            Object.entries(grouped)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .forEach(([systemNumber, areas]) => {
                    const systemTotals = Calculator.calculateSystemTotals(areas);
                    const systemName = this.state.systemNames[systemNumber] || `System ${systemNumber}`;
                    const systemOaProvided = this.getOaProvided(parseInt(systemNumber), systemTotals.totalOutdoorAirflow);

                    // Header del sistema
                    tableHTML += `
                        <tr style="background: #dbeafe; border-top: 2px solid #3b82f6;">
                            <td colspan="7" style="font-weight: bold; color: #1e40af; padding: 0.75rem;">
                                ${systemName} <span style="font-size: 0.75rem; cursor: pointer;" onclick="window.ashraeApp.editSystemName(${systemNumber})">✏️</span>
                            </td>
                        </tr>
                    `;

                    // Áreas del sistema
                    areas.forEach((area, index) => {
                        const bgColor = index % 2 === 0 ? 'white' : '#f9fafb';
                        tableHTML += `
                            <tr style="background: ${bgColor};">
                                <td>${area.name}</td>
                                <td>${area.occupancyType}</td>
                                <td style="text-align: center;">${area.squareFeet.toLocaleString()}</td>
                                <td style="text-align: center;">${area.people}</td>
                                <td style="text-align: center; font-weight: 600; color: #2563eb;">${area.totalOutdoorAirflow}</td>
                                <td style="text-align: center;">—</td>
                                <td style="text-align: center;">
                                    <button onclick="window.ashraeApp.removeArea(${area.id})" style="background: #fee2e2; color: #dc2626; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">🗑️</button>
                                </td>
                            </tr>
                        `;
                    });

                    // Subtotal del sistema
                    tableHTML += `
                        <tr style="background: #eff6ff; border-bottom: 2px solid #3b82f6;">
                            <td colspan="4" style="font-weight: bold; color: #1e40af;">${CONFIG.texts.subtotal} ${systemName}</td>
                            <td style="text-align: center; font-weight: bold; color: #1e40af; font-size: 1.125rem;">${Math.round(systemTotals.totalOutdoorAirflow * 10) / 10}</td>
                            <td style="text-align: center; font-weight: bold; color: #059669; font-size: 1.125rem; cursor: pointer;" onclick="window.ashraeApp.editOaProvided(${systemNumber}, ${systemTotals.totalOutdoorAirflow})">${systemOaProvided} ✏️</td>
                            <td style="text-align: center;">—</td>
                        </tr>
                    `;
                });

            // Gran total
            const grandTotals = Calculator.calculateGrandTotals(this.state.areas);
            tableHTML += `
                <tr style="background: #f0fdf4; border-top: 4px solid #22c55e;">
                    <td colspan="4" style="font-weight: bold; color: #166534; font-size: 1.125rem;">${CONFIG.texts.grandTotal}</td>
                    <td style="text-align: center; font-weight: bold; color: #166534; font-size: 1.25rem;">${Math.round(grandTotals.grandTotalOutdoorAirflow * 10) / 10}</td>
                    <td style="text-align: center;">—</td>
                    <td style="text-align: center;">—</td>
                </tr>
            `;

            tableHTML += `
                    </tbody>
                </table>
            `;

            container.innerHTML = tableHTML;
        }

        getOaProvided(systemNumber, totalOutdoorAirflow) {
            if (this.state.oaProvided[systemNumber] !== undefined) {
                return this.state.oaProvided[systemNumber];
            }
            return Calculator.roundUpToMultiple(totalOutdoorAirflow, CONFIG.defaults.roundingMultiple);
        }

        editSystemName(systemNumber) {
            const currentName = this.state.systemNames[systemNumber] || `System ${systemNumber}`;
            const newName = prompt('Enter new system name:', currentName);
            if (newName && newName.trim()) {
                this.state.systemNames[systemNumber] = newName.trim().toUpperCase();
                this.updateSystemSelection(parseInt(document.getElementById('numberOfSystems').value) || 0);
                this.renderAreasTable();
            }
        }

        editOaProvided(systemNumber, currentTotal) {
            const currentProvided = this.getOaProvided(systemNumber, currentTotal);
            const newValue = prompt('Enter O/A Provided (CFM):', currentProvided);
            if (newValue && !isNaN(parseFloat(newValue))) {
                this.state.oaProvided[systemNumber] = parseFloat(newValue);
                this.renderAreasTable();
            }
        }

        removeArea(areaId) {
            this.state.areas = this.state.areas.filter(area => area.id !== areaId);
            this.renderAreasTable();
        }

        exportToExcel() {
            if (this.state.areas.length === 0) {
                alert(CONFIG.texts.noAreasToExport);
                return;
            }

            const systemData = {
                groupedAreas: {},
                getSystemName: (num) => this.state.systemNames[num] || `System ${num}`,
                getOaProvided: (num, total) => this.getOaProvided(num, total)
            };

            // Agrupar áreas
            this.state.areas.forEach(area => {
                if (!systemData.groupedAreas[area.system]) {
                    systemData.groupedAreas[area.system] = [];
                }
                systemData.groupedAreas[area.system].push(area);
            });

            const excelData = Exporter.generateExcelData(this.state.areas, systemData);
            const success = Exporter.exportToExcel(excelData);
            
            if (!success) {
                alert(CONFIG.texts.exportError);
            }
        }

        showError() {
            const container = document.getElementById(this.containerId);
            if (container) {
                container.innerHTML = `
                    <div style="padding: 2rem; text-align: center; color: #dc2626;">
                        <h2>Error Loading Calculator</h2>
                        <p>Please check your internet connection and refresh the page.</p>
                    </div>
                `;
            }
        }
    }

    // =============================================================================
    // 🌐 EXPORTAR AL OBJETO GLOBAL
    // =============================================================================
    global.ASHRAECalculator = {
        // Clase principal
        Calculator: ASHRAECalculator,
        
        // Configuración
        config: CONFIG,
        data: ASHRAE_DATA,
        
        // Función de inicialización simple
        init: function(containerId = 'ashrae-calculator') {
            if (!document.getElementById(containerId)) {
                console.error(`Container with id "${containerId}" not found`);
                return null;
            }
            
            const app = new ASHRAECalculator(containerId);
            window.ashraeApp = app; // Para acceso global a métodos
            return app;
        },
        
        // Función para personalizar configuración
        customize: function(customConfig) {
            Object.assign(CONFIG, customConfig);
        },
        
        // Función para agregar datos ASHRAE
        addSpaceTypes: function(newSpaces) {
            Object.assign(ASHRAE_DATA, newSpaces);
        }
    };

})(window);
