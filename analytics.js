/**
 * CAEA — Our Analytics Dashboard Engine
 * Static Data Visualizations & Replicated Energy Charts
 * All Zoom, Pan, and Interactivity Disabled for Static Display
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initSearchFilter();
  renderAllVisualizations();
});

// Tab Navigation Logic
function initTabNavigation() {
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.analytics-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetSection = tab.getAttribute('data-tab');

      sections.forEach(section => {
        if (targetSection === 'all' || section.id === targetSection) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });

      // Relayout Plotly charts on tab change
      window.dispatchEvent(new Event('resize'));
    });
  });
}

// Search Filter Logic
function initSearchFilter() {
  const searchInput = document.getElementById('analytics-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.chart-card');

    cards.forEach(card => {
      const title = card.querySelector('.chart-card-title')?.textContent.toLowerCase() || '';
      const subtitle = card.querySelector('.chart-card-subtitle')?.textContent.toLowerCase() || '';

      if (title.includes(query) || subtitle.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// Default Plotly Options for Static Non-Interactive Rendering
const staticPlotOptions = {
  staticPlot: true,
  responsive: true,
  displayModeBar: false,
  scrollZoom: false,
  doubleClick: false
};

// Master Render Dispatcher
function renderAllVisualizations() {
  // A. Production Visualizations
  renderGasProductionByField();
  renderProvinceProductionChart();
  renderDistrictProductionHDI();
  renderMajorGasWellsMap();
  renderMajorGasfieldsReservesMap();
  renderLngTerminalsChart();
  renderPieChart1_FossilGasProduction();

  // B. Consumption Visualizations
  renderEnergySupplyBySource();
  renderLngImportsByYear();
  renderLngConsumptionBySector();
  renderEnergyConsumptionBySource();
  renderGasConsumptionBySector();
  renderProductionConsumptionLossesTimeline();
  renderPieChart2_GasLossesConsumption();
  renderConsumersByProvince();

  // C. Transmission Visualizations
  renderSankeyDiagram('2023-24');
}

/* ==========================================================================
   A. PRODUCTION SECTION CHARTS (STATIC / NO ZOOM / NO INTERACTIVITY)
   ========================================================================== */

// 1. Natural Gas Production by Gas Field (Stacked Area / Line)
function renderGasProductionByField() {
  const container = document.getElementById('chart-gas-field-production');
  if (!container) return;

  const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
  const fields = {
    'Sui': [650, 710, 780, 740, 610, 480, 360, 290],
    'Qadirpur': [210, 380, 590, 790, 720, 590, 420, 340],
    'Mari': [320, 410, 520, 680, 740, 780, 790, 750],
    'Kandhkot': [110, 140, 180, 210, 190, 170, 140, 120],
    'Badin': [140, 190, 240, 290, 260, 210, 160, 130],
    'Adhi': [80, 95, 110, 130, 150, 170, 180, 170],
    'Uch': [0, 90, 210, 340, 420, 490, 470, 450]
  };

  const colors = ['#4C6646', '#6FA297', '#8EB678', '#B4CD9B', '#DCE8D2', '#D38A4A', '#8F5428'];

  const traces = Object.keys(fields).map((field, idx) => ({
    x: years,
    y: fields[field],
    name: field,
    type: 'scatter',
    mode: 'lines',
    stackgroup: 'one',
    line: { color: colors[idx % colors.length], width: 2 }
  }));

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: { title: 'Year', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Production (MMCFD)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    legend: { orientation: 'h', y: -0.2, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, traces, layout, staticPlotOptions);
}

// 2. Natural Gas Production by Province (Bar Chart)
function renderProvinceProductionChart() {
  const container = document.getElementById('chart-province-production');
  if (!container) return;

  const provinces = ['Sindh', 'Balochistan', 'KPK', 'Punjab'];
  const values = [1910, 490, 210, 180];
  const colors = ['rgb(76, 102, 70)', 'rgb(111, 162, 151)', 'rgb(142, 182, 120)', 'rgb(180, 205, 155)'];

  const trace = {
    x: provinces,
    y: values,
    type: 'bar',
    marker: {
      color: colors,
      line: { color: '#ffffff', width: 1 }
    },
    text: values.map(v => `${v} MMCFD`),
    textposition: 'auto'
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: { title: 'Province', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Production (MMCFD)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    dragmode: false
  };

  Plotly.newPlot(container, [trace], layout, staticPlotOptions);
}

// 3. Dual Axis Bar/Line: Natural Gas Production and HDI by District
function renderDistrictProductionHDI() {
  const container = document.getElementById('chart-district-hdi');
  if (!container) return;

  const districts = ['Ghotki', 'Dera Bugti', 'Kashmore', 'Sanghar', 'Rawalpindi', 'Karak', 'Jaffarabad', 'Sukkur'];
  const production = [920, 340, 210, 180, 140, 125, 110, 95];
  const hdi = [0.485, 0.320, 0.410, 0.512, 0.720, 0.580, 0.390, 0.590];

  const traceBar = {
    x: districts,
    y: production,
    name: 'Gas Production (MMCFD)',
    type: 'bar',
    marker: { color: 'rgba(111, 162, 151, 0.85)' }
  };

  const traceLine = {
    x: districts,
    y: hdi,
    name: 'Human Development Index (HDI)',
    type: 'scatter',
    mode: 'lines+markers+text',
    text: hdi.map(v => v.toFixed(2)),
    textposition: 'top center',
    yaxis: 'y2',
    line: { color: '#E8EFC2', width: 3 },
    marker: { size: 8, color: '#A3D88D' }
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 50, t: 30, b: 50 },
    xaxis: { title: 'District', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Gas Production (MMCFD)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis2: {
      title: 'HDI Index (0 - 1)',
      overlaying: 'y',
      side: 'right',
      range: [0, 1.0],
      gridcolor: 'transparent',
      fixedrange: true
    },
    legend: { orientation: 'h', y: -0.25, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, [traceBar, traceLine], layout, staticPlotOptions);
}

// 4. Major Gas Wells Map (Static Non-Zoomable Map)
function renderMajorGasWellsMap() {
  const container = document.getElementById('map-major-gas-wells');
  if (!container) return;

  const wells = [
    { name: "Sui-1", field: "Sui", prov: "Balochistan", lat: 28.636, lng: 66.388, mmcfd: 145, operator: "PPL" },
    { name: "Qadirpur-4", field: "Qadirpur", prov: "Sindh", lat: 28.041, lng: 69.341, mmcfd: 180, operator: "OGDCL" },
    { name: "Mari-12", field: "Mari", prov: "Sindh", lat: 27.962, lng: 69.753, mmcfd: 240, operator: "MPCL" },
    { name: "Kandhkot-2", field: "Kandhkot", prov: "Sindh", lat: 28.245, lng: 69.215, mmcfd: 65, operator: "PPL" },
    { name: "Badin-E1", field: "Badin", prov: "Sindh", lat: 24.630, lng: 68.830, mmcfd: 45, operator: "UEP" },
    { name: "Adhi-6", field: "Adhi", prov: "Punjab", lat: 33.150, lng: 73.160, mmcfd: 55, operator: "PPL" },
    { name: "Uch-3", field: "Uch", prov: "Balochistan", lat: 28.520, lng: 68.180, mmcfd: 120, operator: "OGDCL" }
  ];

  if (window.L) {
    container.innerHTML = '';
    const map = L.map(container, {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false
    }).setView([28.5, 69.0], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18
    }).addTo(map);

    wells.forEach(well => {
      const circle = L.circleMarker([well.lat, well.lng], {
        radius: Math.max(8, well.mmcfd / 15),
        fillColor: '#A3D88D',
        color: '#4C6646',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(map);

      circle.bindTooltip(`<b>${well.name} (${well.field})</b>: ${well.mmcfd} MMCFD`, {
        permanent: true,
        direction: 'top',
        className: 'static-map-tooltip'
      });
    });
  } else {
    // Fallback Bar Representation
    const trace = {
      x: wells.map(w => w.name),
      y: wells.map(w => w.mmcfd),
      type: 'bar',
      marker: { color: '#A3D88D' },
      text: wells.map(w => `${w.mmcfd} MMCFD`),
      textposition: 'auto'
    };

    const layout = {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      autosize: true,
      font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
      margin: { l: 50, r: 20, t: 20, b: 40 },
      xaxis: { fixedrange: true },
      yaxis: { title: 'MMCFD', fixedrange: true }
    };

    Plotly.newPlot(container, [trace], layout, staticPlotOptions);
  }
}

// 5. Pakistan's Ten Major Gasfields by Reserves (Map 2)
function renderMajorGasfieldsReservesMap() {
  const container = document.getElementById('map-gasfield-reserves');
  if (!container) return;

  const fields = [
    { field: "Sui", prov: "Balochistan", reserves: 12.0 },
    { field: "Mari", prov: "Sindh", reserves: 10.5 },
    { field: "Qadirpur", prov: "Sindh", reserves: 4.8 },
    { field: "Uch", prov: "Balochistan", reserves: 3.9 },
    { field: "Badin", prov: "Sindh", reserves: 2.2 },
    { field: "Kandhkot", prov: "Sindh", reserves: 1.8 },
    { field: "Sawan", prov: "Sindh", reserves: 1.5 },
    { field: "Adhi", prov: "Punjab", reserves: 1.1 },
    { field: "Nashpa", prov: "KPK", reserves: 0.9 },
    { field: "Miano", prov: "Sindh", reserves: 0.8 }
  ];

  const trace = {
    x: fields.map(f => f.field),
    y: fields.map(f => f.reserves),
    type: 'bar',
    marker: {
      color: fields.map(f => f.reserves > 3.0 ? 'rgb(76, 102, 70)' : 'rgb(111, 162, 151)')
    },
    text: fields.map(f => `${f.reserves} TCF`),
    textposition: 'outside'
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 20, t: 20, b: 50 },
    xaxis: { title: 'Gas Field', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Original Reserves (TCF)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    dragmode: false
  };

  Plotly.newPlot(container, [trace], layout, staticPlotOptions);
}

// 6. LNG Terminals Bar Chart
function renderLngTerminalsChart() {
  const container = document.getElementById('chart-lng-terminals');
  if (!container) return;

  const terminals = ['Engro Elengy (EETL)', 'Pakistan GasPort (PGPCL)'];
  const capacity = [690, 750];
  const currentUtil = [620, 580];

  const trace1 = {
    x: terminals,
    y: capacity,
    name: 'Capacity (MMCFD)',
    type: 'bar',
    marker: { color: 'rgb(76, 102, 70)' },
    text: capacity.map(v => `${v} MMCFD`),
    textposition: 'auto'
  };

  const trace2 = {
    x: terminals,
    y: currentUtil,
    name: 'Import Throughput (MMCFD)',
    type: 'bar',
    marker: { color: 'rgb(111, 162, 151)' },
    text: currentUtil.map(v => `${v} MMCFD`),
    textposition: 'auto'
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    barmode: 'group',
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    yaxis: { title: 'Volume (MMCFD)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    xaxis: { fixedrange: true },
    legend: { orientation: 'h', y: -0.2, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, [trace1, trace2], layout, staticPlotOptions);
}

// 7. Pie Chart #1: Fossil Gas Production in Pakistan (EXACT PROMPT SPECIFICATION - STATIC)
function renderPieChart1_FossilGasProduction() {
  const container = document.getElementById('pie-fossil-gas-production');
  if (!container) return;

  const pieData = [{
    type: 'pie',
    labels: ['Associated', 'Non-Associated'],
    values: [1025769, 37691757],
    marker: { colors: ['rgb(111, 162, 151)', 'rgb(76, 102, 70)'] },
    textinfo: 'label+percent',
    textposition: 'inside',
    hole: 0
  }];

  const layout = {
    paper_bgcolor: 'rgb(222, 232, 210)',
    plot_bgcolor: 'rgb(222, 232, 210)',
    autosize: true,
    font: { color: '#1e1e1e', family: 'Plus Jakarta Sans' },
    showlegend: true,
    margin: { l: 20, r: 20, t: 20, b: 40 },
    legend: { x: 0.5, xanchor: 'center', y: -0.1, yanchor: 'top', orientation: 'h' },
    dragmode: false
  };

  Plotly.newPlot(container, pieData, layout, staticPlotOptions);
}

/* ==========================================================================
   B. CONSUMPTION SECTION CHARTS (STATIC / NO ZOOM / NO INTERACTIVITY)
   ========================================================================== */

// 1. Energy Supply by Source (Stacked Area)
function renderEnergySupplyBySource() {
  const container = document.getElementById('chart-energy-supply-source');
  if (!container) return;

  const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
  const sources = {
    'Natural Gas': [10200, 12800, 16500, 24100, 27800, 29600, 28400, 27100],
    'Oil': [12500, 15200, 18100, 19400, 21200, 24500, 23100, 21800],
    'Coal': [2100, 2800, 3100, 3900, 4500, 5800, 12400, 14800],
    'Hydro': [5400, 6100, 7200, 8500, 9100, 9800, 10500, 11200],
    'Nuclear': [320, 410, 530, 810, 1200, 1650, 3100, 4200],
    'Renewables': [0, 0, 0, 120, 350, 890, 1450, 2300]
  };

  const colors = ['#4C6646', '#8F5428', '#3C3C41', '#6FA297', '#8EB678', '#A3D88D'];

  const traces = Object.keys(sources).map((src, idx) => ({
    x: years,
    y: sources[src],
    name: src,
    type: 'scatter',
    mode: 'lines',
    stackgroup: 'one',
    line: { color: colors[idx % colors.length], width: 2 }
  }));

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: { title: 'Year', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Supply (KTOE)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    legend: { orientation: 'h', y: -0.2, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, traces, layout, staticPlotOptions);
}

// 2. LNG Imports by Year (Bar & Line Chart)
function renderLngImportsByYear() {
  const container = document.getElementById('chart-lng-imports');
  if (!container) return;

  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const cargoes = [24, 48, 72, 96, 108, 112, 124, 102, 115, 120];
  const volumeMT = [1.5, 3.1, 4.8, 6.4, 7.2, 7.5, 8.3, 6.8, 7.7, 8.0];

  const traceBar = {
    x: years,
    y: volumeMT,
    name: 'Import Volume (Million Tons)',
    type: 'bar',
    marker: { color: 'rgb(111, 162, 151)' },
    text: volumeMT.map(v => `${v} MT`),
    textposition: 'auto'
  };

  const traceLine = {
    x: years,
    y: cargoes,
    name: 'Cargo Ships Received',
    type: 'scatter',
    mode: 'lines+markers',
    yaxis: 'y2',
    line: { color: '#A3D88D', width: 3 },
    marker: { size: 6, color: '#ffffff' }
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 50, t: 20, b: 40 },
    xaxis: { title: 'Year', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Volume (Million Tons)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis2: {
      title: 'Cargo Count',
      overlaying: 'y',
      side: 'right',
      gridcolor: 'transparent',
      fixedrange: true
    },
    legend: { orientation: 'h', y: -0.2, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, [traceBar, traceLine], layout, staticPlotOptions);
}

// 3. LNG Consumption by Sector (Stacked Bar)
function renderLngConsumptionBySector() {
  const container = document.getElementById('chart-lng-consumption-sector');
  if (!container) return;

  const years = [2015, 2017, 2019, 2021, 2023, 2024];
  const sectors = {
    'Power Sector': [120, 280, 450, 520, 580, 610],
    'Fertilizer Sector': [40, 95, 150, 180, 210, 225],
    'Industrial Sector': [25, 60, 110, 140, 160, 175],
    'CNG Sector': [15, 45, 80, 95, 105, 110],
    'Commercial': [5, 10, 20, 25, 30, 35]
  };

  const colors = ['#4C6646', '#6FA297', '#8EB678', '#B4CD9B', '#E8EFC2'];

  const traces = Object.keys(sectors).map((sec, idx) => ({
    x: years,
    y: sectors[sec],
    name: sec,
    type: 'bar',
    marker: { color: colors[idx % colors.length] }
  }));

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    barmode: 'stack',
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: { title: 'Year', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Consumption (MMCFD)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    legend: { orientation: 'h', y: -0.2, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, traces, layout, staticPlotOptions);
}

// 4. Energy Consumption by Source (Stacked Bar)
function renderEnergyConsumptionBySource() {
  const container = document.getElementById('chart-energy-consumption-source');
  if (!container) return;

  const years = [1990, 2000, 2010, 2020, 2024];
  const sources = {
    'Gas': [43.2, 48.5, 48.2, 41.5, 38.6],
    'Oil': [42.1, 40.2, 35.4, 28.1, 25.4],
    'Electricity/Hydro': [11.5, 8.5, 11.2, 16.5, 18.2],
    'Coal': [3.2, 2.8, 5.2, 13.9, 17.8]
  };

  const colors = ['#4C6646', '#8F5428', '#6FA297', '#3C3C41'];

  const traces = Object.keys(sources).map((src, idx) => ({
    x: years,
    y: sources[src],
    name: src,
    type: 'bar',
    marker: { color: colors[idx % colors.length] }
  }));

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    barmode: 'stack',
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: { title: 'Year', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Share (%)', gridcolor: 'rgba(255,255,255,0.08)', range: [0, 100], fixedrange: true },
    legend: { orientation: 'h', y: -0.2, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, traces, layout, staticPlotOptions);
}

// 5. Gas Consumption by Sector (Stacked Bar)
function renderGasConsumptionBySector() {
  const container = document.getElementById('chart-gas-consumption-sector');
  if (!container) return;

  const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
  const sectors = {
    'Power': [32.4, 35.1, 38.2, 43.5, 34.8, 31.2, 33.5, 34.2],
    'Domestic': [14.2, 16.8, 18.5, 17.2, 20.1, 23.5, 22.8, 21.9],
    'Fertilizer': [28.6, 25.4, 22.1, 18.9, 16.8, 17.4, 18.1, 19.0],
    'Industrial': [18.5, 17.2, 16.1, 14.5, 21.2, 22.1, 20.4, 19.5],
    'Commercial': [3.1, 3.3, 3.4, 3.2, 3.5, 3.8, 3.9, 4.1],
    'CNG': [0.0, 0.2, 1.7, 2.7, 3.6, 2.0, 1.3, 1.3]
  };

  const colors = ['#4C6646', '#6FA297', '#8EB678', '#B4CD9B', '#DCE8D2', '#D38A4A'];

  const traces = Object.keys(sectors).map((sec, idx) => ({
    x: years,
    y: sectors[sec],
    name: sec,
    type: 'bar',
    marker: { color: colors[idx % colors.length] }
  }));

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    barmode: 'stack',
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: { title: 'Year', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Share (%)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    legend: { orientation: 'h', y: -0.2, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, traces, layout, staticPlotOptions);
}

// 6. Natural Gas Production, Consumption and Losses (Multi-Line Chart)
function renderProductionConsumptionLossesTimeline() {
  const container = document.getElementById('chart-prod-cons-losses');
  if (!container) return;

  const years = [2018, 2019, 2020, 2021, 2022, 2023];
  const prod = [1447000, 1418000, 1380000, 1365000, 1320000, 1285000];
  const cons = [1367000, 1342000, 1307000, 1294000, 1252000, 1220000];
  const losses = [80000, 76000, 73000, 71000, 68000, 65000];

  const t1 = {
    x: years,
    y: prod,
    name: 'Total Production',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: 'rgba(111, 153, 141, 1)', width: 3 },
    marker: { size: 6 }
  };

  const t2 = {
    x: years,
    y: cons,
    name: 'Net Consumption',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: 'rgba(63, 104, 91, 1)', width: 3 },
    marker: { size: 6 }
  };

  const t3 = {
    x: years,
    y: losses,
    name: 'System Losses (UFG)',
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: 'rgba(211, 138, 74, 1)', width: 3 },
    marker: { size: 6 }
  };

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 60, r: 20, t: 20, b: 40 },
    xaxis: { title: 'Year', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Volume (Million ft³)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    legend: { orientation: 'h', y: -0.2, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, [t1, t2, t3], layout, staticPlotOptions);
}

// 7. Pie Chart #2: Total Gas Losses and Consumption (1990-2024) (EXACT PROMPT SPECIFICATION - STATIC)
function renderPieChart2_GasLossesConsumption() {
  const container = document.getElementById('pie-total-gas-losses');
  if (!container) return;

  const pieData = [{
    type: 'pie',
    labels: ['Consumption', 'Losses', 'Production'],
    values: [35056904, 2010569, 38717527],
    marker: { colors: ['rgba(63, 104, 91, 1)', 'rgba(77, 110, 101, 1)', 'rgba(111, 153, 141, 1)'] },
    textinfo: 'label+percent',
    textposition: 'inside',
    hole: 0
  }];

  const layout = {
    paper_bgcolor: 'rgb(232, 239, 194)',
    plot_bgcolor: 'rgb(232, 239, 194)',
    autosize: true,
    font: { color: '#1e1e1e', family: 'Plus Jakarta Sans' },
    showlegend: true,
    margin: { l: 20, r: 20, t: 20, b: 40 },
    legend: { x: 0.5, xanchor: 'center', y: -0.1, yanchor: 'top', orientation: 'h' },
    dragmode: false
  };

  Plotly.newPlot(container, pieData, layout, staticPlotOptions);
}

// 8. Consumers by Province (Line Chart)
function renderConsumersByProvince() {
  const container = document.getElementById('chart-consumers-province');
  if (!container) return;

  const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
  const provs = {
    'Punjab': [1.45, 2.10, 2.95, 3.85, 4.75, 5.60, 6.45, 7.10],
    'Sindh': [1.20, 1.65, 2.15, 2.80, 3.35, 3.85, 4.30, 4.65],
    'KPK': [0.32, 0.48, 0.69, 0.95, 1.25, 1.58, 1.92, 2.15],
    'Balochistan': [0.18, 0.24, 0.31, 0.41, 0.52, 0.61, 0.70, 0.78]
  };

  const colors = ['#4C6646', '#6FA297', '#8EB678', '#D38A4A'];

  const traces = Object.keys(provs).map((pr, idx) => ({
    x: years,
    y: provs[pr],
    name: pr,
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: colors[idx % colors.length], width: 3 },
    marker: { size: 6 }
  }));

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 50, r: 20, t: 20, b: 40 },
    xaxis: { title: 'Year', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    yaxis: { title: 'Consumers (Millions)', gridcolor: 'rgba(255,255,255,0.08)', fixedrange: true },
    legend: { orientation: 'h', y: -0.2, x: 0 },
    dragmode: false
  };

  Plotly.newPlot(container, traces, layout, staticPlotOptions);
}

/* ==========================================================================
   C. TRANSMISSION SECTION CHARTS (STATIC SANKEY)
   ========================================================================== */

// 1. Natural Gas Distribution Flow (Static Sankey Diagram)
function renderSankeyDiagram(year) {
  const container = document.getElementById('chart-sankey-distribution');
  if (!container) return;

  const sankeyDataByYear = {
    '2018-19': {
      nodes: ['Sindh Prod', 'Balochistan Prod', 'KPK Prod', 'Punjab Prod', 'LNG Imports', 'National Grid', 'Power', 'Domestic', 'Fertilizer', 'Industrial', 'Commercial', 'CNG', 'UFG Losses'],
      source: [0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5],
      target: [5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12],
      value:  [2250, 610, 260, 220, 900, 1420, 980, 760, 680, 140, 80, 180]
    },
    '2023-24': {
      nodes: ['Sindh Prod', 'Balochistan Prod', 'KPK Prod', 'Punjab Prod', 'LNG Imports', 'National Grid', 'Power', 'Domestic', 'Fertilizer', 'Industrial', 'Commercial', 'CNG', 'UFG Losses'],
      source: [0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5],
      target: [5, 5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12],
      value:  [1910, 490, 210, 180, 1150, 1310, 1120, 850, 560, 145, 30, 95]
    }
  };

  const selectedData = sankeyDataByYear[year] || sankeyDataByYear['2023-24'];

  const data = [{
    type: "sankey",
    orientation: "h",
    node: {
      pad: 15,
      thickness: 20,
      line: { color: "#ffffff", width: 0.5 },
      label: selectedData.nodes,
      color: [
        "#4C6646", "#6FA297", "#8EB678", "#B4CD9B", "#A3D88D",
        "#2E4832",
        "#6FA297", "#8EB678", "#B4CD9B", "#DCE8D2", "#E8EFC2", "#D38A4A", "#8F5428"
      ]
    },
    link: {
      source: selectedData.source,
      target: selectedData.target,
      value: selectedData.value,
      color: "rgba(163, 216, 141, 0.25)"
    }
  }];

  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    autosize: true,
    font: { color: '#e5e5e7', family: 'Plus Jakarta Sans' },
    margin: { l: 20, r: 20, t: 20, b: 20 },
    dragmode: false
  };

  Plotly.newPlot(container, data, layout, staticPlotOptions);
}

// Sankey Year Selector Handler
window.updateSankeyYear = function(selectEl) {
  renderSankeyDiagram(selectEl.value);
};
