/**
 * CHRONO // ID-01 & HABITSNAP — Multi-Mode Core Logic & AI Habit Intelligence
 * Tactile Industrial Hardware Mode ⇄ Modern Aesthetic Mode + AI Neural Advisor
 */

// ================= CONSTANTS & HARDWARE SPEC =================
const STORAGE_KEYS = {
  HABITS: 'chrono_habits_v3',
  PROOFS: 'chrono_proofs_v3',
  USER: 'chrono_user_v3',
  CUSTOM_COLORS: 'chrono_custom_colors_v3'
};

const CATEGORIES = {
  fitness: { name: 'Fitness', code: 'FIT', color: '#ff5500' },
  mind: { name: 'Mind', code: 'MND', color: '#709775' },
  productivity: { name: 'Focus', code: 'FOC', color: '#0ea5e9' },
  health: { name: 'Health', code: 'HLT', color: '#10b981' },
  creativity: { name: 'Design', code: 'DSN', color: '#f59e0b' }
};

const THEMES = [
  { id: 'braun', name: 'Braun 1968', class: 'theme-braun', swatches: ['#121214', '#1e1f26', '#ff5500'] },
  { id: 'cyberdeck', name: 'Cyberdeck TE-01', class: 'theme-cyberdeck', swatches: ['#0a0c0e', '#141b20', '#10b981'] },
  { id: 'aerospace', name: 'Aerospace Telemetry', class: 'theme-aerospace', swatches: ['#0e131b', '#1a2330', '#0ea5e9'] },
  { id: 'dieter-white', name: 'Dieter Chalk White', class: 'theme-dieter-white', swatches: ['#e4e4e7', '#f4f4f5', '#ea580c'] },
  { id: 'hazard', name: 'Industrial Hazard', class: 'theme-hazard', swatches: ['#141416', '#222228', '#f59e0b'] },
  { id: 'crimson', name: 'Machinery Crimson', class: 'theme-crimson', swatches: ['#121012', '#221a20', '#e11d48'] }
];

const BADGES_CONFIG = [
  { id: 'first_snap', name: 'Optical Calibrated', icon: '⌖', desc: 'Log your first empirical photo proof', check: (u, p) => p.length >= 1 },
  { id: 'streak_3', name: '3D Continuity', icon: '⚡', desc: 'Sustain a 3-day active streak', check: (u) => u.streak >= 3 },
  { id: 'streak_7', name: 'Zero Tolerance', icon: '🏆', desc: 'Achieve 7 consecutive days of execution', check: (u) => u.streak >= 7 },
  { id: 'pts_100', name: '100 XP Output', icon: '◈', desc: 'Accumulate 100 industrial output points', check: (u) => u.points >= 100 },
  { id: 'pts_500', name: 'Chief Architect', icon: '👑', desc: 'Reach 500 total system XP', check: (u) => u.points >= 500 },
  { id: 'snaps_5', name: 'CMF Archivist', icon: '📷', desc: 'Store 5 verified optical logs', check: (u, p) => p.length >= 5 },
  { id: 'master_habits', name: 'System Array', icon: '⎔', desc: 'Maintain 5 active discipline units', check: (u, p, h) => h.length >= 5 },
  { id: 'zen_master', name: 'Ergonomic Zen', icon: '◎', desc: 'Execute 10 Mind/Health protocols', check: (u, p) => p.filter(x => x.category === 'mind' || x.category === 'health').length >= 10 }
];

const TIERS = [
  { level: 1, minXp: 0, title: 'NOVICE DESIGNER' },
  { level: 2, minXp: 100, title: 'CMF SPECIALIST' },
  { level: 3, minXp: 250, title: 'CAD APPRENTICE' },
  { level: 4, minXp: 500, title: 'CHIEF ENGINEER' },
  { level: 5, minXp: 1000, title: 'MASTER ARCHITECT' }
];

// ================= INITIAL STATE =================
let state = {
  user: {
    name: 'CHIEF DESIGNER',
    points: 0,
    streak: 14,
    bestStreak: 14,
    theme: 'braun',
    designMode: 'industrial', // 'industrial' | 'modern'
    customColors: null,
    unlockedBadges: [],
    sleepLoggedToday: false
  },
  habits: [],
  proofs: [],
  selectedCategory: 'all',
  selectedDate: getTodayString(),
  activeProofHabit: null,
  activeAuditHabit: null,
  capturedImageData: null,
  cameraStream: null
};

// ================= AI RECOMMENDED DESIGNER HABITS CATALOG =================
const AI_DESIGNER_HABITS = [
  {
    id: 'ai-dh-1',
    title: 'Rapid 10-Minute CMF Thumbnail Sketching',
    category: 'creativity',
    points: 30,
    color: '#ff5500',
    time: '07:30',
    tag: '#CMF-SKETCH',
    streak: 0,
    description: 'Sketch 5 form factors exploring ergonomic palm grips and knurled radii.'
  },
  {
    id: 'ai-dh-2',
    title: 'G2 Curvature Continuous CAD Surfacing',
    category: 'productivity',
    points: 60,
    color: '#0ea5e9',
    time: '09:00',
    tag: '#CAD-SURF',
    streak: 0,
    description: 'Inspect zebra stripe reflections on primary transition chamfers.'
  },
  {
    id: 'ai-dh-3',
    title: 'Hardware Teardown & Mechanism Reverse-Engineering',
    category: 'creativity',
    points: 50,
    color: '#f59e0b',
    time: '14:00',
    tag: '#TEARDOWN',
    streak: 0,
    description: 'Disassemble 1 consumer electronics unit to analyze snap-fits & PCB ribbing.'
  },
  {
    id: 'ai-dh-4',
    title: 'Anodized Polymer & Texture Material Log',
    category: 'mind',
    points: 30,
    color: '#709775',
    time: '16:30',
    tag: '#MAT-SPEC',
    streak: 0,
    description: 'Archive 1 CMF material swatch: durometer hardness & optical sheen.'
  },
  {
    id: 'ai-dh-5',
    title: 'Ergonomic Posture & Grip Calibration',
    category: 'health',
    points: 20,
    color: '#10b981',
    time: '11:00',
    tag: '#ERGONOMICS',
    streak: 0,
    description: 'Recalibrate desk focal height and forearm articulation angle.'
  }
];

// ================= DESIGN MODES SPECIFICATION =================
const DESIGN_MODES = [
  {
    id: 'industrial',
    name: 'Industrial Hardware',
    shortCode: 'IND',
    icon: '🎛️',
    class: 'mode-industrial',
    desc: 'Matte charcoal, knurled knobs, ISO telemetry'
  },
  {
    id: 'modern',
    name: 'Modern Aesthetic',
    shortCode: 'MOD',
    icon: '✨',
    class: 'mode-modern',
    desc: 'Glassmorphism, neon auras, rounded bubbles'
  },
  {
    id: 'cyberdeck',
    name: 'Cyberdeck TE-01',
    shortCode: 'CYBER',
    icon: '📟',
    class: 'mode-cyberdeck',
    desc: 'Phosphor green matrix, scanlines, angular HUD'
  },
  {
    id: 'dieter',
    name: 'Dieter Rams Minimal',
    shortCode: 'MIN',
    icon: '⚪',
    class: 'mode-dieter',
    desc: 'Bauhaus chalk white, ultra-flat grids, orange'
  },
  {
    id: 'aerospace',
    name: 'Aerospace Mission HUD',
    shortCode: 'AERO',
    icon: '🚀',
    class: 'mode-aerospace',
    desc: 'Cobalt telemetry, flight reticles, HUD vector'
  }
];

// ================= LIFECYCLE =================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  applyDesignMode(state.user.designMode || 'industrial');
  applyTheme(state.user.theme || 'braun');
  applyCustomColorsIfPresent();
  setupConfetti();
  initDateStrip();
  initNavigation();
  initFilters();
  initModals();
  initDesignModeToggle();
  initModeCustomizer();
  initAiIntelligence();
  initDesignerHabitsHub();
  initSleepTracker();
  initExplodedViewControls();
  initColorTuners();
  initCameraControls();
  initForm();
  initSettings();
  renderApp();
});

// ================= DATE UTILS =================
function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateDisplay(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatTimeDisplay(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ================= MULTI-MODE ARCHITECTURE SWITCHER & CUSTOMIZATION =================
function applyDesignMode(modeId) {
  const modeObj = DESIGN_MODES.find(m => m.id === modeId) || DESIGN_MODES[0];
  state.user.designMode = modeObj.id;

  const body = document.body;
  const brandLabel = document.getElementById('brand-mode-label');
  const modeDisplay = document.getElementById('mode-text-display');
  const modeIcon = document.getElementById('mode-icon-indicator');

  // Remove existing mode classes
  DESIGN_MODES.forEach(m => body.classList.remove(m.class));
  body.classList.add(modeObj.class);

  // Custom mode name if user edited it
  const customName = (state.user.customModeNames && state.user.customModeNames[modeObj.id]) || modeObj.name;

  if (modeDisplay) modeDisplay.textContent = customName.toUpperCase();
  if (modeIcon) modeIcon.textContent = modeObj.icon;

  // Mode specific branding & hero text updates
  if (brandLabel) {
    if (modeObj.id === 'modern') brandLabel.textContent = customName;
    else if (modeObj.id === 'cyberdeck') brandLabel.textContent = `// ${customName.toUpperCase()}`;
    else if (modeObj.id === 'dieter') brandLabel.textContent = customName;
    else if (modeObj.id === 'aerospace') brandLabel.textContent = `AERO // ${customName.toUpperCase()}`;
    else brandLabel.textContent = `ID-01 // ${customName.toUpperCase()}`;
  }

  // Update hero custom titles
  const modTitle = document.getElementById('modern-mode-custom-title');
  const cyberTitle = document.getElementById('cyber-mode-custom-title');
  const dieterTitle = document.getElementById('dieter-mode-custom-title');
  const aeroTitle = document.getElementById('aero-mode-custom-title');

  if (modTitle) modTitle.textContent = `${customName} ✨`;
  if (cyberTitle) cyberTitle.textContent = `${customName.toUpperCase()} // ROOT TERMINAL`;
  if (dieterTitle && state.user.customModeNames && state.user.customModeNames['dieter']) {
    dieterTitle.textContent = state.user.customModeNames['dieter'];
  }
  if (aeroTitle) aeroTitle.textContent = `${customName.toUpperCase()} // FLIGHT VECTOR`;

  saveData();
  renderModeGridSelector();
  syncModeInputLabel();
}

function initDesignModeToggle() {
  const btnToggle = document.getElementById('btn-toggle-design-mode');
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      // Cycle through available design modes
      const currentIndex = DESIGN_MODES.findIndex(m => m.id === (state.user.designMode || 'industrial'));
      const nextIndex = (currentIndex + 1) % DESIGN_MODES.length;
      const nextMode = DESIGN_MODES[nextIndex];
      applyDesignMode(nextMode.id);

      const customName = (state.user.customModeNames && state.user.customModeNames[nextMode.id]) || nextMode.name;
      showToast(`${nextMode.icon} ${customName.toUpperCase()}`, nextMode.desc);
    });
  }
}

function initModeCustomizer() {
  const inputModeName = document.getElementById('input-custom-mode-name');
  const btnSaveModeName = document.getElementById('btn-save-mode-name');

  if (btnSaveModeName && inputModeName) {
    btnSaveModeName.addEventListener('click', () => {
      const val = inputModeName.value.trim();
      if (!val) return;

      if (!state.user.customModeNames) state.user.customModeNames = {};
      state.user.customModeNames[state.user.designMode] = val;
      saveData();
      applyDesignMode(state.user.designMode);
      showToast('🏷️ MODE LABEL SAVED', `Custom mode name: "${val}"`);
    });
  }
}

function syncModeInputLabel() {
  const inputModeName = document.getElementById('input-custom-mode-name');
  if (inputModeName) {
    const currentMode = state.user.designMode || 'industrial';
    const currentModeObj = DESIGN_MODES.find(m => m.id === currentMode) || DESIGN_MODES[0];
    const customName = (state.user.customModeNames && state.user.customModeNames[currentMode]) || currentModeObj.name;
    inputModeName.value = customName;
  }
}

function renderModeGridSelector() {
  const grid = document.getElementById('modes-grid-selector');
  if (!grid) return;
  grid.innerHTML = '';

  DESIGN_MODES.forEach(mode => {
    const isActive = (state.user.designMode || 'industrial') === mode.id;
    const customName = (state.user.customModeNames && state.user.customModeNames[mode.id]) || mode.name;

    const card = document.createElement('div');
    card.className = `mode-select-card ${isActive ? 'active' : ''}`;
    card.innerHTML = `
      <div class="mode-card-header">
        <span class="mode-card-icon">${mode.icon}</span>
        <span class="mono-meta-tag">${isActive ? 'ACTIVE' : 'SELECT'}</span>
      </div>
      <span class="mode-card-name">${customName}</span>
      <span class="mode-card-desc">${mode.desc}</span>
    `;

    card.addEventListener('click', () => {
      applyDesignMode(mode.id);
      showToast(`${mode.icon} ${customName.toUpperCase()}`, mode.desc);
    });

    grid.appendChild(card);
  });
}

// ================= COLOR CALIBRATION SUITE =================
function applyTheme(themeId) {
  const selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  state.user.theme = selectedTheme.id;

  THEMES.forEach(t => {
    if (t.class) document.body.classList.remove(t.class);
  });

  if (selectedTheme.class) {
    document.body.classList.add(selectedTheme.class);
  }

  clearCustomColorOverrides();
  saveData();
  renderThemeGrid();
  syncColorTunerValues();
}

function clearCustomColorOverrides() {
  const root = document.documentElement;
  root.style.removeProperty('--bg-primary');
  root.style.removeProperty('--bg-card');
  root.style.removeProperty('--accent-orange');
  root.style.removeProperty('--accent-green');
  state.user.customColors = null;
  saveData();
}

function applyCustomColorsIfPresent() {
  if (state.user.customColors) {
    const root = document.documentElement;
    const c = state.user.customColors;
    if (c.bg) root.style.setProperty('--bg-primary', c.bg);
    if (c.card) root.style.setProperty('--bg-card', c.card);
    if (c.accent) root.style.setProperty('--accent-orange', c.accent);
    if (c.green) root.style.setProperty('--accent-green', c.green);
  }
}

function initColorTuners() {
  const btnPalette = document.getElementById('btn-open-palette');
  const modalCalibration = document.getElementById('modal-color-calibration');
  const closeCalibration = document.getElementById('close-calibration-modal');
  const btnResetColors = document.getElementById('btn-reset-custom-colors');

  if (btnPalette) {
    btnPalette.addEventListener('click', () => {
      renderThemeGrid();
      syncColorTunerValues();
      openModal(modalCalibration);
    });
  }

  if (closeCalibration) {
    closeCalibration.addEventListener('click', () => closeModal(modalCalibration));
  }

  if (modalCalibration) {
    modalCalibration.addEventListener('click', (e) => {
      if (e.target === modalCalibration) closeModal(modalCalibration);
    });
  }

  if (btnResetColors) {
    btnResetColors.addEventListener('click', () => {
      clearCustomColorOverrides();
      applyTheme(state.user.theme || 'braun');
      showToast('CALIBRATION RESET', 'Restored default hardware specs');
    });
  }

  const tunerBg = document.getElementById('tuner-color-bg');
  const tunerCard = document.getElementById('tuner-color-card');
  const tunerAccent = document.getElementById('tuner-color-accent');
  const tunerGreen = document.getElementById('tuner-color-green');

  const root = document.documentElement;

  if (tunerBg) {
    tunerBg.addEventListener('input', (e) => {
      const val = e.target.value;
      root.style.setProperty('--bg-primary', val);
      document.getElementById('hex-bg-primary').textContent = val;
      updateCustomColor('bg', val);
    });
  }

  if (tunerCard) {
    tunerCard.addEventListener('input', (e) => {
      const val = e.target.value;
      root.style.setProperty('--bg-card', val);
      document.getElementById('hex-bg-card').textContent = val;
      updateCustomColor('card', val);
    });
  }

  if (tunerAccent) {
    tunerAccent.addEventListener('input', (e) => {
      const val = e.target.value;
      root.style.setProperty('--accent-orange', val);
      document.getElementById('hex-accent-orange').textContent = val;
      updateCustomColor('accent', val);
    });
  }

  if (tunerGreen) {
    tunerGreen.addEventListener('input', (e) => {
      const val = e.target.value;
      root.style.setProperty('--accent-green', val);
      document.getElementById('hex-accent-green').textContent = val;
      updateCustomColor('green', val);
    });
  }
}

function updateCustomColor(key, val) {
  if (!state.user.customColors) state.user.customColors = {};
  state.user.customColors[key] = val;
  saveData();
}

function syncColorTunerValues() {
  const computed = getComputedStyle(document.documentElement);
  const bg = computed.getPropertyValue('--bg-primary').trim() || '#121214';
  const card = computed.getPropertyValue('--bg-card').trim() || '#1e1f26';
  const accent = computed.getPropertyValue('--accent-orange').trim() || '#ff5500';
  const green = computed.getPropertyValue('--accent-green').trim() || '#709775';

  const setVal = (id, hexId, val) => {
    const el = document.getElementById(id);
    const hexEl = document.getElementById(hexId);
    if (el && val.startsWith('#')) el.value = val;
    if (hexEl) hexEl.textContent = val;
  };

  setVal('tuner-color-bg', 'hex-bg-primary', bg);
  setVal('tuner-color-card', 'hex-bg-card', card);
  setVal('tuner-color-accent', 'hex-accent-orange', accent);
  setVal('tuner-color-green', 'hex-accent-green', green);
}

function renderThemeGrid() {
  const grid = document.getElementById('theme-selector-grid');
  if (!grid) return;
  grid.innerHTML = '';

  THEMES.forEach(theme => {
    const isActive = (state.user.theme || 'braun') === theme.id;
    const card = document.createElement('div');
    card.className = `theme-card ${isActive ? 'active' : ''}`;
    card.innerHTML = `
      <div class="theme-card-header">
        <span class="theme-title">${theme.name}</span>
        <span class="theme-active-check">✓ ACTIVE</span>
      </div>
      <div class="theme-preview-swatches">
        <span class="theme-swatch" style="background: ${theme.swatches[0]};"></span>
        <span class="theme-swatch" style="background: ${theme.swatches[1]};"></span>
        <span class="theme-swatch" style="background: ${theme.swatches[2]};"></span>
      </div>
    `;

    card.addEventListener('click', () => {
      applyTheme(theme.id);
      showToast(`FINISH: ${theme.name}`, 'Calibrated Hardware Profile');
    });

    grid.appendChild(card);
  });
}

// ================= AI HABIT INTELLIGENCE & EVALUATION =================
const AI_SUGGESTIONS_POOL = [
  "CAD & Sketching protocols show 98% consistency. Recommendation: Lock 08:00 AM window to minimize afternoon cognitive friction.",
  "Streak Resilience is in the upper 95th percentile. Recommendation: Introduce a 15-minute cool-down review to consolidate daily design iterations.",
  "Hydration & Ergonomics protocol shows high impact on stamina. Stacking hydration immediately before modeling sessions prevents focus drops.",
  "Weekend variance detected in previous sessions. Pre-scheduling optical proofs on Saturday mornings maintains a 100% streak security index.",
  "High task density detected in PM hours. Shifting rapid prototyping to earlier blocks will enhance output quality by ~25%."
];

function initAiIntelligence() {
  const btnRefresh = document.getElementById('btn-refresh-ai-advice');
  const btnReanalyze = document.getElementById('btn-reanalyze-habit-ai');
  const closeAiModal = document.getElementById('close-ai-audit-modal');
  const modalAi = document.getElementById('modal-ai-habit-audit');

  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      generateDynamicAiAdvice();
      showToast('🧠 AI NEURAL RE-EVALUATION', 'Updated habit momentum analysis');
    });
  }

  if (btnReanalyze) {
    btnReanalyze.addEventListener('click', () => {
      if (state.activeAuditHabit) {
        openAiHabitAudit(state.activeAuditHabit);
        showToast('🧠 AI AUDIT RE-CALIBRATED', 'Updated individual habit performance metrics');
      }
    });
  }

  if (closeAiModal) {
    closeAiModal.addEventListener('click', () => closeModal(modalAi));
  }

  if (modalAi) {
    modalAi.addEventListener('click', (e) => {
      if (e.target === modalAi) closeModal(modalAi);
    });
  }
}

function generateDynamicAiAdvice() {
  const suggestionElem = document.getElementById('ai-dynamic-suggestion');
  const overallScoreElem = document.getElementById('ai-overall-score');
  const streakHealthElem = document.getElementById('ai-streak-health');

  // Randomize from pool or calculate based on stats
  const randomIndex = Math.floor(Math.random() * AI_SUGGESTIONS_POOL.length);
  const score = Math.min(99, Math.max(85, 88 + Math.floor(Math.random() * 11)));

  if (suggestionElem) suggestionElem.textContent = `"${AI_SUGGESTIONS_POOL[randomIndex]}"`;
  if (overallScoreElem) overallScoreElem.textContent = score;
  if (streakHealthElem) streakHealthElem.textContent = `⚡ STREAK RESILIENCE: ${score + 2}%`;
}

function openAiHabitAudit(habit) {
  state.activeAuditHabit = habit;
  const modal = document.getElementById('modal-ai-habit-audit');
  document.getElementById('ai-audit-habit-title').textContent = habit.title;

  // Calculate dynamic habit rating based on streak & completions
  const streak = habit.streak || 1;
  const baseScore = Math.min(9.9, (8.4 + Math.min(1.4, streak * 0.1))).toFixed(1);
  document.getElementById('ai-audit-score').textContent = baseScore;

  let grade = 'GRADE A+ (OPTIMAL)';
  let summary = 'High Execution Quality & Zero Variance';
  if (baseScore < 8.8) {
    grade = 'GRADE A- (GOOD)';
    summary = 'Moderate Consistency, Low Variance';
  }
  document.getElementById('ai-audit-grade').textContent = grade;
  document.getElementById('ai-audit-summary').textContent = summary;
  document.getElementById('ai-audit-time-advice').textContent = `Optimal scheduled window: ${habit.time || '08:00 AM'}`;

  // Generate 7-Day Sparkline
  const sparkline = document.getElementById('ai-audit-sparkline');
  sparkline.innerHTML = '';
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  days.forEach((day, index) => {
    const isCompleted = index >= 7 - Math.min(7, streak);
    const height = isCompleted ? (70 + Math.floor(Math.random() * 30)) : (25 + Math.floor(Math.random() * 20));
    const col = document.createElement('div');
    col.className = 'sparkline-col';
    col.innerHTML = `
      <div class="sparkline-bar" style="height: ${height}%; background: ${isCompleted ? (habit.color || 'var(--accent-orange)') : 'var(--bg-knurled)'};"></div>
      <span class="sparkline-day">${day}</span>
    `;
    sparkline.appendChild(col);
  });

  // Actionable AI Tips
  const suggestionsList = document.getElementById('ai-audit-suggestions-list');
  suggestionsList.innerHTML = `
    <li><strong>Anchor Stacking:</strong> Trigger this protocol immediately following your previous routine to reduce cognitive activation barrier.</li>
    <li><strong>Time Window Lock:</strong> Execution at ${habit.time || '08:00 AM'} demonstrates 92% higher focus retention.</li>
    <li><strong>Optical Evidence:</strong> Taking high-contrast photo proofs reinforces empirical neurological commitment.</li>
  `;

  openModal(modal);
}

// ================= AI DESIGNER HABITS HUB =================
function initDesignerHabitsHub() {
  const btnOpen = document.getElementById('btn-open-designer-habits');
  const btnQuick = document.getElementById('btn-quick-designer-habits');
  const modal = document.getElementById('modal-designer-habits');
  const closeModalBtn = document.getElementById('close-designer-habits-modal');

  const openHandler = () => {
    renderDesignerHabitsGrid();
    openModal(modal);
  };

  if (btnOpen) btnOpen.addEventListener('click', openHandler);
  if (btnQuick) btnQuick.addEventListener('click', openHandler);
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => closeModal(modal));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  }
}

function renderDesignerHabitsGrid() {
  const grid = document.getElementById('designer-habits-grid');
  if (!grid) return;
  grid.innerHTML = '';

  AI_DESIGNER_HABITS.forEach(template => {
    const isAlreadyAdded = state.habits.some(h => h.title.toLowerCase() === template.title.toLowerCase());
    const card = document.createElement('div');
    card.className = 'designer-habit-card';
    card.style.setProperty('--card-accent', template.color);

    card.innerHTML = `
      <div class="designer-card-header">
        <span class="designer-cat-badge" style="background: ${template.color}22; color: ${template.color}; border: 1px solid ${template.color}55;">
          ${template.category.toUpperCase()} • +${template.points} XP
        </span>
        <span class="designer-time-badge mono-num">${template.time}</span>
      </div>
      <h4 class="designer-card-title">${template.title}</h4>
      <p class="designer-card-desc">${template.description}</p>
      <div class="designer-card-action">
        ${
          isAlreadyAdded
            ? `<button class="designer-add-btn added" disabled>✓ PROTOCOL ACTIVE</button>`
            : `<button class="designer-add-btn" data-id="${template.id}">+ INITIALIZE PROTOCOL</button>`
        }
      </div>
    `;

    const addBtn = card.querySelector('.designer-add-btn:not(.added)');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const newHabit = {
          id: 'h-' + Date.now(),
          title: template.title,
          category: template.category,
          points: template.points,
          color: template.color,
          time: template.time,
          tag: template.tag,
          streak: 0,
          completedDates: []
        };
        state.habits.unshift(newHabit);
        saveData();
        checkAndAwardBadges();
        renderApp();
        renderDesignerHabitsGrid();
        showToast('✨ AI HABIT INITIALIZED', template.title);
      });
    }

    grid.appendChild(card);
  });
}

// ================= SLEEP TRACKER & CIRCADIAN TELEMETRY =================
function initSleepTracker() {
  const inputBed = document.getElementById('sleep-input-bed');
  const inputWake = document.getElementById('sleep-input-wake');
  const btnLogSleep = document.getElementById('btn-log-sleep');

  const recalculateSleep = () => {
    if (!inputBed || !inputWake) return;
    const bedVal = inputBed.value;
    const wakeVal = inputWake.value;
    if (!bedVal || !wakeVal) return;

    const [bedH, bedM] = bedVal.split(':').map(Number);
    const [wakeH, wakeM] = wakeVal.split(':').map(Number);

    let diffMinutes = (wakeH * 60 + wakeM) - (bedH * 60 + bedM);
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Crosses midnight
    }

    const hrs = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    const durText = `${hrs}H ${String(mins).padStart(2, '0')}M`;

    const durationElem = document.getElementById('sleep-total-duration-text');
    if (durationElem) durationElem.textContent = durText;

    // Quality Score out of 100 based on 8hr ideal
    const targetMin = 8 * 60;
    const ratio = Math.min(1.15, diffMinutes / targetMin);
    let score = Math.round(ratio * 92);
    if (score > 99) score = 99;
    if (diffMinutes < 300) score = Math.max(45, Math.round((diffMinutes / 300) * 70));

    const scoreDisplay = document.getElementById('sleep-score-display');
    if (scoreDisplay) scoreDisplay.textContent = score;

    const progressBar = document.getElementById('sleep-progress-bar');
    if (progressBar) progressBar.style.width = `${Math.min(100, score)}%`;
  };

  if (inputBed) inputBed.addEventListener('change', recalculateSleep);
  if (inputWake) inputWake.addEventListener('change', recalculateSleep);

  if (btnLogSleep) {
    btnLogSleep.addEventListener('click', () => {
      state.user.points += 25;
      saveData();
      renderHeader();
      fireConfetti();
      showToast('+25 XP SLEEP LOGGED', 'Circadian telemetry recorded');
      btnLogSleep.innerHTML = '<span>✓ SLEEP PROTOCOL LOGGED (+25 XP)</span>';
      btnLogSleep.disabled = true;
      setTimeout(() => {
        if (btnLogSleep) {
          btnLogSleep.disabled = false;
          btnLogSleep.innerHTML = '<span>LOG SLEEP PROTOCOL (+25 XP)</span>';
        }
      }, 4000);
    });
  }

  recalculateSleep();
}

// ================= 3D CAD EXPLODED VIEW CONTROLS (1-CLICK & INTERACTIVE) =================
function initExplodedViewControls() {
  const modalExploded = document.getElementById('modal-exploded-view');
  const closeExploded = document.getElementById('close-exploded-modal');
  const btnOpenExploded = document.getElementById('btn-open-exploded-view');

  // Direct 1-Click to launch 3D Exploded View
  if (btnOpenExploded) {
    btnOpenExploded.addEventListener('click', () => {
      openExplodedCadModal(btnOpenExploded);
    });
  }

  if (closeExploded) {
    closeExploded.addEventListener('click', () => closeModal(modalExploded));
  }
  if (modalExploded) {
    modalExploded.addEventListener('click', (e) => {
      if (e.target === modalExploded) closeModal(modalExploded);
    });
  }
}

function openExplodedCadModal(triggerEl) {
  const modal = document.getElementById('modal-exploded-view');
  const partTitle = document.getElementById('exploded-part-title');

  if (triggerEl && triggerEl.id === 'fab-add-habit') {
    if (partTitle) partTitle.textContent = 'CAD SCHEMATIC: SHUTTER FAB ACTUATOR';
  } else if (triggerEl && triggerEl.id === 'btn-toggle-design-mode') {
    if (partTitle) partTitle.textContent = 'CAD SCHEMATIC: DUAL-STATE ROCKER SWITCH';
  } else if (triggerEl && triggerEl.id === 'btn-open-palette') {
    if (partTitle) partTitle.textContent = 'CAD SCHEMATIC: ROTARY POTENTIOMETER ENCODER';
  } else {
    if (partTitle) partTitle.textContent = 'TACTILE SWITCH & KNOB ACTUATOR ASSEMBLY';
  }

  openModal(modal);
  showToast('🔍 3D CAD EXPLODED VIEW', 'Interactive mechanical layer breakdown active');
}

// ================= DATA STORAGE =================
function loadData() {
  try {
    const savedHabits = localStorage.getItem(STORAGE_KEYS.HABITS);
    const savedProofs = localStorage.getItem(STORAGE_KEYS.PROOFS);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (savedHabits) state.habits = JSON.parse(savedHabits);
    if (savedProofs) state.proofs = JSON.parse(savedProofs);
    if (savedUser) state.user = { ...state.user, ...JSON.parse(savedUser) };

    if (!savedHabits || state.habits.length === 0) {
      loadIndustrialDemoData();
    }
  } catch (err) {
    console.error('Error loading data:', err);
    loadIndustrialDemoData();
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(state.habits));
    localStorage.setItem(STORAGE_KEYS.PROOFS, JSON.stringify(state.proofs));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }
}

function generateIndustrialSamplePhoto(title, category, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#14161b';
  ctx.fillRect(0, 0, 600, 400);

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 600; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 400);
    ctx.stroke();
  }
  for (let y = 0; y < 400; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(600, y);
    ctx.stroke();
  }

  ctx.strokeStyle = color || '#ff5500';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, 520, 320);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`// EMPIRICAL VERIFICATION LOG`, 300, 160);

  ctx.font = 'bold 24px "Space Grotesk", sans-serif';
  ctx.fillText(title, 300, 205);

  ctx.font = '12px "IBM Plex Mono", monospace';
  ctx.fillStyle = color || '#ff5500';
  ctx.fillText(`STATUS: OPTICALLY CERTIFIED [TOLERANCE ±0.05mm]`, 300, 245);

  return canvas.toDataURL('image/jpeg', 0.85);
}

function loadIndustrialDemoData() {
  const today = getTodayString();
  const samplePhoto1 = generateIndustrialSamplePhoto('Morning Ergonomic Sketching', 'creativity', '#ff5500');
  const samplePhoto2 = generateIndustrialSamplePhoto('SolidWorks 3D CAD Modeling', 'productivity', '#0ea5e9');

  state.habits = [
    {
      id: 'h-1',
      title: 'Morning Ergonomic Sketching',
      category: 'creativity',
      points: 30,
      color: '#ff5500',
      time: '07:00',
      tag: '#CMF-01',
      streak: 14,
      completedDates: [today]
    },
    {
      id: 'h-2',
      title: 'CAD Solid Modeling & Surfacing',
      category: 'productivity',
      points: 60,
      color: '#0ea5e9',
      time: '09:00',
      tag: '#CAD-3D',
      streak: 14,
      completedDates: [today]
    },
    {
      id: 'h-3',
      title: 'Material & Polymer Research',
      category: 'mind',
      points: 30,
      color: '#709775',
      time: '14:00',
      tag: '#MAT-RES',
      streak: 8,
      completedDates: []
    },
    {
      id: 'h-4',
      title: 'Rapid 3D Print Prototyping',
      category: 'fitness',
      points: 30,
      color: '#e11d48',
      time: '17:00',
      tag: '#PROTO',
      streak: 11,
      completedDates: []
    },
    {
      id: 'h-5',
      title: 'Design Review & Portfolio Archive',
      category: 'health',
      points: 30,
      color: '#f59e0b',
      time: '19:30',
      tag: '#ARCHIVE',
      streak: 6,
      completedDates: []
    }
  ];

  state.proofs = [
    {
      id: 'p-1',
      habitId: 'h-1',
      habitTitle: 'Morning Ergonomic Sketching',
      category: 'creativity',
      points: 30,
      caption: 'Completed 6 thumb concepts exploring tactile knurled dials and bevels.',
      imageData: samplePhoto1,
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      date: today
    },
    {
      id: 'p-2',
      habitId: 'h-2',
      habitTitle: 'CAD Solid Modeling & Surfacing',
      category: 'productivity',
      points: 60,
      caption: 'G2 curvature continuous fillet verified on main chassis volume.',
      imageData: samplePhoto2,
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      date: today
    }
  ];

  state.user = {
    name: 'CHIEF DESIGNER',
    points: 280,
    streak: 14,
    bestStreak: 14,
    theme: 'braun',
    designMode: 'industrial',
    customColors: null,
    unlockedBadges: ['first_snap', 'streak_3', 'streak_7', 'pts_100']
  };

  saveData();
}

// ================= GAMIFICATION =================
function getUserTier(xp) {
  let currentTier = TIERS[0];
  let nextTier = TIERS[1];

  for (let i = 0; i < TIERS.length; i++) {
    if (xp >= TIERS[i].minXp) {
      currentTier = TIERS[i];
      nextTier = TIERS[i + 1] || null;
    }
  }

  const currentLevelMin = currentTier.minXp;
  const nextLevelMin = nextTier ? nextTier.minXp : currentTier.minXp + 500;
  const progressPercent = Math.min(100, Math.round(((xp - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100));

  return {
    tier: currentTier,
    nextTier,
    progressPercent,
    xpToNext: nextTier ? nextTier.minXp - xp : 0
  };
}

function checkAndAwardBadges() {
  let newlyUnlocked = [];
  BADGES_CONFIG.forEach(badge => {
    if (!state.user.unlockedBadges.includes(badge.id)) {
      if (badge.check(state.user, state.proofs, state.habits)) {
        state.user.unlockedBadges.push(badge.id);
        newlyUnlocked.push(badge);
      }
    }
  });

  if (newlyUnlocked.length > 0) {
    newlyUnlocked.forEach(b => {
      showToast(`🏆 MILESTONE: ${b.name}`, '+25 BONUS XP OUTPUT');
      state.user.points += 25;
    });
  }
}

// ================= TIMELINE STRIP =================
function initDateStrip() {
  const container = document.getElementById('date-strip');
  container.innerHTML = '';

  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);

    const dString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dayNum = d.getDate();
    const isSelected = dString === state.selectedDate;
    const hasCompleted = state.proofs.some(p => p.date === dString);

    const pill = document.createElement('button');
    pill.className = `date-pill ${isSelected ? 'active' : ''} ${hasCompleted ? 'has-completed' : ''}`;
    pill.innerHTML = `
      <span class="day-name">${dayName}</span>
      <span class="day-num">${dayNum}</span>
      <span class="day-dot"></span>
    `;

    pill.addEventListener('click', () => {
      state.selectedDate = dString;
      initDateStrip();
      renderHabits();
    });

    container.appendChild(pill);
  }
}

// ================= NAVIGATION =================
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-switch');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
      const activeView = document.getElementById(`view-${target}`);
      if (activeView) activeView.classList.add('active-view');

      if (target === 'habits') renderHabits();
      if (target === 'feed') renderFeed();
      if (target === 'stats') renderStats();
    });
  });
}

// ================= CATEGORY FILTERS =================
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-switch');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedCategory = btn.getAttribute('data-category');
      renderHabits();
    });
  });
}

// ================= MODALS & CONTROLS =================
function initModals() {
  const fabAdd = document.getElementById('fab-add-habit');
  const modalAdd = document.getElementById('modal-add-habit');
  const closeAdd = document.getElementById('close-add-modal');

  fabAdd.addEventListener('click', () => openModal(modalAdd));
  closeAdd.addEventListener('click', () => closeModal(modalAdd));

  const modalProof = document.getElementById('modal-photo-proof');
  const closeProof = document.getElementById('close-proof-modal');
  closeProof.addEventListener('click', () => {
    stopCameraStream();
    closeModal(modalProof);
  });

  const modalDetail = document.getElementById('modal-photo-detail');
  const closeDetail = document.getElementById('close-detail-modal');
  closeDetail.addEventListener('click', () => closeModal(modalDetail));

  [modalAdd, modalProof, modalDetail].forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) {
          stopCameraStream();
          closeModal(m);
        }
      });
    }
  });
}

function openModal(modal) {
  if (modal) modal.classList.add('active');
}

function closeModal(modal) {
  if (modal) modal.classList.remove('active');
}

// ================= FORM CONTROLS =================
function initForm() {
  const catCards = document.querySelectorAll('.cat-radio-card');
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      catCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  const ptsCards = document.querySelectorAll('.points-radio-card');
  ptsCards.forEach(card => {
    card.addEventListener('click', () => {
      ptsCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  const colorDots = document.querySelectorAll('.color-dot-radio:not(.custom-color-wrapper)');
  const customColorInput = document.getElementById('habit-custom-color-input');
  const customWrapper = document.querySelector('.custom-color-wrapper');
  let chosenHabitColor = '#ff5500';

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.color-dot-radio').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const radio = dot.querySelector('input[name="habit-color"]');
      if (radio) {
        radio.checked = true;
        chosenHabitColor = radio.value;
      }
    });
  });

  if (customColorInput && customWrapper) {
    customColorInput.addEventListener('input', (e) => {
      document.querySelectorAll('.color-dot-radio').forEach(d => d.classList.remove('active'));
      customWrapper.classList.add('active');
      chosenHabitColor = e.target.value;
      customWrapper.style.setProperty('--color-accent', chosenHabitColor);
    });
  }

  const form = document.getElementById('form-create-habit');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('habit-input-title').value.trim();
    const category = form.querySelector('input[name="habit-category"]:checked').value;
    const points = parseInt(form.querySelector('input[name="habit-points"]:checked').value, 10);
    const time = document.getElementById('habit-input-time').value || '08:00';
    const tag = document.getElementById('habit-input-tag').value.trim() || `#${category.toUpperCase()}`;

    if (!title) return;

    const newHabit = {
      id: 'h-' + Date.now(),
      title,
      category,
      points,
      color: chosenHabitColor || CATEGORIES[category]?.color || '#ff5500',
      time,
      tag: tag.startsWith('#') ? tag : '#' + tag,
      streak: 0,
      completedDates: []
    };

    state.habits.unshift(newHabit);
    saveData();
    checkAndAwardBadges();

    form.reset();
    closeModal(document.getElementById('modal-add-habit'));
    showToast('PROTOCOL INITIALIZED', `+${points} XP Output Assigned`);
    renderApp();
  });
}

// ================= OPTICAL CAMERA CONTROLS =================
function initCameraControls() {
  const btnStartCam = document.getElementById('btn-start-camera');
  const btnShutter = document.getElementById('btn-shutter');
  const btnRetake = document.getElementById('btn-retake');
  const fileUploadInput = document.getElementById('file-upload-input');
  const btnConfirmProof = document.getElementById('btn-confirm-proof');
  const videoElem = document.getElementById('camera-stream');
  const photoPreview = document.getElementById('photo-preview');
  const placeholder = document.getElementById('camera-placeholder');

  btnStartCam.addEventListener('click', async () => {
    try {
      placeholder.classList.add('hidden');
      photoPreview.classList.add('hidden');
      videoElem.classList.remove('hidden');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      state.cameraStream = stream;
      videoElem.srcObject = stream;

      btnStartCam.classList.add('hidden');
      btnShutter.classList.remove('hidden');
      btnRetake.classList.add('hidden');
    } catch (err) {
      console.warn('Camera stream error:', err);
      alert('Camera access restricted. Select image via file upload!');
      placeholder.classList.remove('hidden');
      videoElem.classList.add('hidden');
    }
  });

  btnShutter.addEventListener('click', () => {
    if (!state.cameraStream) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoElem.videoWidth || 640;
    canvas.height = videoElem.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedPhoto(dataUrl);
    stopCameraStream();
  });

  btnRetake.addEventListener('click', () => {
    resetCameraView();
  });

  fileUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let w = img.width;
        let h = img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const compressedData = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(compressedData);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  btnConfirmProof.addEventListener('click', () => {
    if (!state.capturedImageData || !state.activeProofHabit) return;

    const habit = state.activeProofHabit;
    const caption = document.getElementById('proof-caption').value.trim() || 'Empirical task completion verified.';
    const pointsAwarded = habit.points;

    const newProof = {
      id: 'p-' + Date.now(),
      habitId: habit.id,
      habitTitle: habit.title,
      category: habit.category,
      points: pointsAwarded,
      caption,
      imageData: state.capturedImageData,
      timestamp: new Date().toISOString(),
      date: state.selectedDate
    };

    state.proofs.unshift(newProof);

    if (!habit.completedDates.includes(state.selectedDate)) {
      habit.completedDates.push(state.selectedDate);
      habit.streak = (habit.streak || 0) + 1;
    }

    state.user.points += pointsAwarded;
    state.user.streak = Math.max(state.user.streak, habit.streak);
    if (state.user.streak > state.user.bestStreak) {
      state.user.bestStreak = state.user.streak;
    }

    fireConfetti();
    showToast(`+${pointsAwarded} XP RECORDED`, `Verified: ${habit.title}`);

    checkAndAwardBadges();
    saveData();

    stopCameraStream();
    closeModal(document.getElementById('modal-photo-proof'));
    resetCameraView();
    renderApp();
  });
}

function openProofModalForHabit(habit) {
  state.activeProofHabit = habit;
  state.capturedImageData = null;

  const modal = document.getElementById('modal-photo-proof');
  document.getElementById('proof-habit-category').textContent = `DISCIPLINE // ${habit.category.toUpperCase()}`;
  document.getElementById('proof-habit-title').textContent = habit.title;
  document.getElementById('proof-points-badge').textContent = `+${habit.points} XP REWARD`;
  document.getElementById('btn-confirm-proof-label').textContent = `CONFIRM OPTICAL PROOF (+${habit.points} XP)`;
  document.getElementById('proof-caption').value = '';

  resetCameraView();
  openModal(modal);
}

function setCapturedPhoto(dataUrl) {
  state.capturedImageData = dataUrl;
  const photoPreview = document.getElementById('photo-preview');
  const placeholder = document.getElementById('camera-placeholder');
  const videoElem = document.getElementById('camera-stream');
  const btnStartCam = document.getElementById('btn-start-camera');
  const btnShutter = document.getElementById('btn-shutter');
  const btnRetake = document.getElementById('btn-retake');
  const btnConfirmProof = document.getElementById('btn-confirm-proof');

  photoPreview.src = dataUrl;
  photoPreview.classList.remove('hidden');
  placeholder.classList.add('hidden');
  videoElem.classList.add('hidden');

  btnStartCam.classList.add('hidden');
  btnShutter.classList.add('hidden');
  btnRetake.classList.remove('hidden');

  btnConfirmProof.disabled = false;
}

function resetCameraView() {
  state.capturedImageData = null;
  const photoPreview = document.getElementById('photo-preview');
  const placeholder = document.getElementById('camera-placeholder');
  const videoElem = document.getElementById('camera-stream');
  const btnStartCam = document.getElementById('btn-start-camera');
  const btnShutter = document.getElementById('btn-shutter');
  const btnRetake = document.getElementById('btn-retake');
  const btnConfirmProof = document.getElementById('btn-confirm-proof');

  photoPreview.classList.add('hidden');
  photoPreview.src = '';
  placeholder.classList.remove('hidden');
  videoElem.classList.add('hidden');

  btnStartCam.classList.remove('hidden');
  btnShutter.classList.add('hidden');
  btnRetake.classList.add('hidden');
  btnConfirmProof.disabled = true;
}

function stopCameraStream() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(track => track.stop());
    state.cameraStream = null;
  }
}

// ================= RENDER VIEWS =================
function renderApp() {
  renderHeader();
  renderHabits();
  renderFeed();
  renderStats();
  initDateStrip();
}

function renderHeader() {
  const pointsElem = document.getElementById('header-points-count');
  const streakElem = document.getElementById('header-streak-count');
  const modernBubble = document.getElementById('modern-bubble-xp');
  const cyberXp = document.getElementById('cyber-hero-xp');
  const dieterXp = document.getElementById('dieter-hero-xp');
  const aeroXp = document.getElementById('aero-hero-xp');

  if (pointsElem) pointsElem.textContent = state.user.points;
  if (streakElem) streakElem.textContent = state.user.streak;
  if (modernBubble) modernBubble.textContent = state.user.points;
  if (cyberXp) cyberXp.textContent = state.user.points;
  if (dieterXp) dieterXp.textContent = `${state.user.points} PTS`;
  if (aeroXp) aeroXp.textContent = `XP ${state.user.points}`;
}

function renderHabits() {
  const habitsList = document.getElementById('habits-list');
  const emptyState = document.getElementById('empty-habits-state');
  habitsList.innerHTML = '';

  const filtered = state.habits.filter(h => {
    if (state.selectedCategory === 'all') return true;
    return h.category === state.selectedCategory;
  });

  document.getElementById('habits-meta-count').textContent = `${filtered.length} UNITS LOADED`;

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }

  const totalToday = state.habits.length;
  const completedToday = state.habits.filter(h => h.completedDates.includes(state.selectedDate)).length;
  const pct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  document.getElementById('completion-ratio-text').textContent = `${completedToday} / ${totalToday} EXECUTED`;
  document.getElementById('daily-progress-pct').textContent = `${pct}%`;

  const maxDash = 251.32;
  const offset = maxDash - (pct / 100) * maxDash;
  document.getElementById('daily-progress-ring').style.strokeDashoffset = offset;

  filtered.forEach(habit => {
    const isCompleted = habit.completedDates.includes(state.selectedDate);
    const cat = CATEGORIES[habit.category] || { code: 'GEN', color: '#ff5500' };
    const habitColor = habit.color || cat.color || '#ff5500';

    const card = document.createElement('div');
    card.className = `habit-card ${isCompleted ? 'completed' : ''}`;
    card.style.setProperty('--habit-bar-color', habitColor);

    card.innerHTML = `
      <div class="habit-card-glow"></div>
      <div class="habit-left">
        <div class="habit-icon-badge" style="border-color: ${habitColor}55;">${cat.code}</div>
        <div class="habit-details">
          <div class="habit-title-row">
            <span class="habit-name">${escapeHtml(habit.title)}</span>
          </div>
          <div class="habit-tags-row">
            <span class="habit-tag-pill">${escapeHtml(habit.tag || '#' + cat.code)}</span>
            <span class="habit-pts-pill" style="color: ${habitColor}; background: ${habitColor}18;">+${habit.points} XP</span>
            ${habit.streak > 0 ? `<span class="habit-streak-pill mono-num">⚡ ${habit.streak}D</span>` : ''}
            <button class="habit-ai-audit-btn" data-id="${habit.id}" title="AI Progress Audit">🧠 AI AUDIT</button>
          </div>
        </div>
      </div>

      <div class="habit-right">
        ${
          isCompleted
            ? `<div class="habit-completed-badge" style="color: var(--accent-green); border-color: rgba(112, 151, 117, 0.4);">
                 <span>● VERIFIED</span>
               </div>`
            : `<button class="habit-snap-btn" data-id="${habit.id}" style="background: ${habitColor}; border-color: ${habitColor}; box-shadow: 0 2px 10px ${habitColor}40;">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 14px; height: 14px;">
                   <circle cx="12" cy="12" r="3"></circle>
                   <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                 </svg>
                 <span>LOG SNAP</span>
               </button>`
        }
      </div>
    `;

    const snapBtn = card.querySelector('.habit-snap-btn');
    if (snapBtn) {
      snapBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProofModalForHabit(habit);
      });
    }

    const aiAuditBtn = card.querySelector('.habit-ai-audit-btn');
    if (aiAuditBtn) {
      aiAuditBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openAiHabitAudit(habit);
      });
    }

    habitsList.appendChild(card);
  });
}

function renderFeed() {
  const feedGrid = document.getElementById('photo-feed-grid');
  const emptyFeed = document.getElementById('empty-feed-state');
  const totalSnapsCount = document.getElementById('feed-total-snaps');

  totalSnapsCount.textContent = state.proofs.length;
  feedGrid.innerHTML = '';

  if (state.proofs.length === 0) {
    emptyFeed.classList.remove('hidden');
    return;
  }
  emptyFeed.classList.add('hidden');

  state.proofs.forEach(proof => {
    const card = document.createElement('div');
    card.className = 'feed-card';
    card.innerHTML = `
      <div class="feed-img-container">
        <img class="feed-img" src="${proof.imageData}" alt="${escapeHtml(proof.habitTitle)}" loading="lazy" />
        <span class="feed-overlay-category">${proof.category.toUpperCase()}</span>
        <span class="feed-overlay-pts">+${proof.points} XP</span>
      </div>
      <div class="feed-content">
        <div class="feed-title-row">
          <h4 class="feed-habit-name">${escapeHtml(proof.habitTitle)}</h4>
          <span class="feed-timestamp">${formatDateDisplay(proof.date)} • ${formatTimeDisplay(proof.timestamp)}</span>
        </div>
        <p class="feed-caption">${escapeHtml(proof.caption || 'Empirical task completion verified.')}</p>
      </div>
    `;

    card.querySelector('.feed-img-container').addEventListener('click', () => {
      openLightbox(proof);
    });

    feedGrid.appendChild(card);
  });
}

function openLightbox(proof) {
  const modal = document.getElementById('modal-photo-detail');
  document.getElementById('lightbox-img').src = proof.imageData;
  document.getElementById('lightbox-category').textContent = `DISCIPLINE // ${proof.category.toUpperCase()}`;
  document.getElementById('lightbox-title').textContent = proof.habitTitle;
  document.getElementById('lightbox-pts').textContent = `+${proof.points} XP`;
  document.getElementById('lightbox-caption').textContent = proof.caption || '';
  document.getElementById('lightbox-time').textContent = `${formatDateDisplay(proof.date)} ${formatTimeDisplay(proof.timestamp)}`;

  openModal(modal);
}

function renderStats() {
  const userTier = getUserTier(state.user.points);

  document.getElementById('stats-current-level').textContent = `LEVEL 0${userTier.tier.level}`;
  document.getElementById('player-tier-title').textContent = userTier.tier.title;
  document.getElementById('xp-bar-fill').style.width = `${userTier.progressPercent}%`;
  document.getElementById('xp-current-sub').textContent = `${state.user.points} XP`;
  document.getElementById('xp-next-sub').textContent = userTier.nextTier ? `${userTier.xpToNext} XP TO LEVEL 0${userTier.nextTier.level}` : 'MAX CAPACITY';

  document.getElementById('metric-best-streak').textContent = `${state.user.bestStreak}D`;
  document.getElementById('metric-total-completed').textContent = state.proofs.length;
  document.getElementById('metric-points-earned').textContent = state.user.points;
  document.getElementById('metric-proofs-taken').textContent = state.proofs.length;

  const badgesGrid = document.getElementById('badges-grid');
  badgesGrid.innerHTML = '';

  const unlockedCount = state.user.unlockedBadges.length;
  document.getElementById('badges-unlocked-count').textContent = `${unlockedCount} / ${BADGES_CONFIG.length} UNLOCKED`;

  BADGES_CONFIG.forEach(badge => {
    const isUnlocked = state.user.unlockedBadges.includes(badge.id);

    const badgeCard = document.createElement('div');
    badgeCard.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    badgeCard.innerHTML = `
      <div class="badge-icon-box">${badge.icon}</div>
      <div class="badge-info">
        <h5>${badge.name}</h5>
        <p>${badge.desc}</p>
      </div>
    `;

    badgesGrid.appendChild(badgeCard);
  });
}

// ================= UTILITIES & RESET =================
function initSettings() {
  const btnDemo = document.getElementById('btn-load-demo');
  const btnReset = document.getElementById('btn-reset-data');

  btnDemo.addEventListener('click', () => {
    if (confirm('Load industrial designer benchmarks and sample optical proofs?')) {
      loadIndustrialDemoData();
      renderApp();
      showToast('BENCHMARKS LOADED', 'Tactile industrial protocols ready');
    }
  });

  btnReset.addEventListener('click', () => {
    if (confirm('Purge all telemetry logs, proofs, and points?')) {
      state.habits = [];
      state.proofs = [];
      state.user = {
        name: 'CHIEF DESIGNER',
        points: 0,
        streak: 0,
        bestStreak: 0,
        theme: 'braun',
        designMode: 'industrial',
        customColors: null,
        unlockedBadges: []
      };
      saveData();
      applyTheme('braun');
      applyDesignMode('industrial');
      renderApp();
      showToast('SYSTEM PURGED', 'Ready for new calibration');
    }
  });
}

// ================= TELEMETRY TOAST =================
let toastTimeout = null;
function showToast(title, subtitle) {
  const toast = document.getElementById('xp-toast');
  document.getElementById('xp-toast-pts').textContent = title;
  document.getElementById('xp-toast-sub').textContent = subtitle;

  toast.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ================= SPARKS & PARTICLE SYSTEM =================
let confettiCanvas, confettiCtx, confettiParticles = [], confettiAnimationId = null;

function setupConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCtx = confettiCanvas.getContext('2d');
  resizeConfetti();
  window.addEventListener('resize', resizeConfetti);
}

function resizeConfetti() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function fireConfetti() {
  if (!confettiCanvas) return;
  resizeConfetti();

  const colors = ['#ff5500', '#709775', '#f59e0b', '#0ea5e9', '#ffffff', '#e4e4e7', '#8b5cf6'];
  const particleCount = 70;

  for (let i = 0; i < particleCount; i++) {
    confettiParticles.push({
      x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 40,
      y: confettiCanvas.height * 0.45 + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 1.2) * 14,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      alpha: 1,
      decay: Math.random() * 0.02 + 0.01
    });
  }

  if (!confettiAnimationId) {
    updateConfetti();
  }
}

function updateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.4;
    p.rotation += p.rotationSpeed;
    p.alpha -= p.decay;

    if (p.alpha <= 0 || p.y > confettiCanvas.height) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.max(0, p.alpha);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
    confettiCtx.restore();
  }

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(updateConfetti);
  } else {
    confettiAnimationId = null;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
