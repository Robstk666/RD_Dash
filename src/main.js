import { theoryData, trainingSchedule, outdoorTrainingSchedule, filmingData, coverLettersData, offerData, pktData } from './data.js';

// ─── Supabase DB ─────────────────────────────────
const SUPABASE_URL = 'https://zibxszcsvltsvuqxlcrq.supabase.co/rest/v1/custom_tasks';
const SUPABASE_KEY = 'sb_publishable_ozjFEGGNNcslDyZws66g3A_TBf4A9ml';

let customTasks = [];

async function fetchCustomTasks() {
  try {
    const res = await fetch(`${SUPABASE_URL}?select=*&order=created_at.desc`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    if (res.ok) customTasks = await res.json();
  } catch (e) {
    console.error('Failed to fetch from DB', e);
  }
}

async function addCustomTaskDB(task) {
  try {
    await fetch(SUPABASE_URL, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    await fetchCustomTasks();
  } catch (e) { console.error('Add failed', e); }
}

async function markDeletedCustomTaskDB(id) {
  try {
    await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_deleted: true })
    });
    await fetchCustomTasks();
  } catch (e) { console.error('Delete failed', e); }
}

async function restoreCustomTaskDB(id) {
  try {
    await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_deleted: false })
    });
    await fetchCustomTasks();
  } catch (e) { console.error('Restore failed', e); }
}

async function hardDeleteCustomTaskDB(id) {
  try {
    await fetch(`${SUPABASE_URL}?id=eq.${id}`, {
      method: 'DELETE',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    await fetchCustomTasks();
  } catch (e) { console.error('Hard delete failed', e); }
}

// ─── localStorage Utils ──────────────────────────
function getDeletedItems() {
  return JSON.parse(localStorage.getItem('deletedItems') || '[]');
}

async function deleteItem(id) {
  if (id.includes('-')) {
    const t = customTasks.find(x => x.id === id);
    if (t) { t.is_deleted = true; render(); }
    await markDeletedCustomTaskDB(id);
  } else {
    const items = getDeletedItems();
    if (!items.includes(id)) { items.push(id); localStorage.setItem('deletedItems', JSON.stringify(items)); }
  }
  render();
}

async function restoreItem(id) {
  if (id.includes('-')) {
    const t = customTasks.find(x => x.id === id);
    if (t) { t.is_deleted = false; render(); }
    await restoreCustomTaskDB(id);
  } else {
    const items = getDeletedItems().filter(i => i !== id);
    localStorage.setItem('deletedItems', JSON.stringify(items));
  }
  render();
}

async function forceDeleteItem(id) {
  if (id.includes('-')) {
    customTasks = customTasks.filter(x => x.id !== id);
    render();
    await hardDeleteCustomTaskDB(id);
    render();
  }
}


// ─── App State ─────────────────────────────────
const app = document.getElementById('app');
let currentState = 'splash';

// Section → accent color mapping
const SECTION_COLORS = {
  menu: 'lime', workouts_menu: 'lime', theory: 'lime',
  training: 'lime', outdoor_training: 'lime', pkt: 'lime',
  filming: 'cyan',
  offer: 'magenta',
  settings: 'white', // Settings aesthetic color
  trash: 'red',
};

const ICONS = {
  training: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  filming: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  offer: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  settings: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  trash: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  theory: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  gym: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 5v14"/><path d="M18 5v14"/><path d="M2 9v6"/><path d="M22 9v6"/><path d="M2 15h4"/><path d="M18 15h4"/><path d="M2 9h4"/><path d="M18 9h4"/><path d="M6 12h12"/></svg>`,
  outdoor: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L3 13h4l-3 8h6v3h4v-3h6l-3-8h4z"/></svg>`,
  pkt: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M2 12h20"/></svg>`,
  copy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

// Bottom nav states that show the nav bar
const NAV_STATES = ['menu', 'workouts_menu', 'theory', 'training', 'outdoor_training', 'pkt', 'filming', 'offer', 'settings', 'trash'];

function render() {
  const color = SECTION_COLORS[currentState] || 'lime';
  document.body.className = `section-${color === 'lime' ? 'training' : color === 'cyan' ? 'filming' : color === 'magenta' ? 'offer' : color === 'white' ? 'settings' : 'trash'}`;

  app.innerHTML = '';

  // Clean up fixed elements appended to body
  document.querySelectorAll('.home-bg-logo').forEach(el => el.remove());

  renderBottomNav(); // always after innerHTML clear, before content

  // ✅ Global Background watermark logo — visible on all tabs
  if (currentState !== 'splash') {
    const bgLogo = document.createElement('img');
    bgLogo.src = '/logo.png';
    bgLogo.alt = '';
    bgLogo.className = 'home-bg-logo';
    document.body.appendChild(bgLogo);
  }

  if (currentState === 'splash')                renderSplash();
  else if (currentState === 'workouts_menu')    renderWorkoutsMenu();
  else if (currentState === 'theory')           renderTextCards('Биомеханика и ЦНС', theoryData, 'workouts_menu', 'lime');
  else if (currentState === 'training')         renderTraining(trainingSchedule, 'Программа (в зале)');
  else if (currentState === 'outdoor_training') renderTraining(outdoorTrainingSchedule, 'Тренировки без зала');
  else if (currentState === 'pkt')              renderTextCards('ПКТ', pktData, 'workouts_menu', 'lime');
  else if (currentState === 'filming')          renderFilming();
  else if (currentState === 'offer')            renderOffer();
  else if (currentState === 'settings')         renderSettings();
  else if (currentState === 'trash')            renderTrash();
}

// ─── BOTTOM NAV ─────────────────────────────────
function renderBottomNav() {
  // ✅ Always remove old nav first to prevent stacking
  const existing = document.getElementById('bottom-nav');
  if (existing) existing.remove();

  if (currentState === 'splash') return;

  const getActiveSection = (s) => {
    if (['workouts_menu','theory','training','outdoor_training','pkt'].includes(s)) return 'training';
    return s;
  };
  const active = getActiveSection(currentState);

  const nav = document.createElement('nav');
  nav.id = 'bottom-nav';

  const navItems = [
    { key: 'training', icon: ICONS.training, label: 'Тренировки', color: '',         state: 'workouts_menu' },
    { key: 'filming',  icon: ICONS.filming,  label: 'Съёмки',     color: 'cyan',     state: 'filming' },
    { key: 'offer',    icon: ICONS.offer,    label: 'Оффер',       color: 'magenta',  state: 'offer' },
    { key: 'settings', icon: ICONS.settings, label: 'Настройки', color: 'white',   state: 'settings' },
  ];

  navItems.forEach(({ key, icon, label, color, state }) => {
    const isActive = active === key;
    const btn = document.createElement('button');
    btn.className = `nav-item ${isActive ? 'active ' + (color || '') : ''}`;
    btn.innerHTML = `
      <span class="nav-item-icon">${icon}</span>
      <span class="nav-item-label">${label}</span>
    `;
    btn.onclick = () => { currentState = state; render(); };
    nav.appendChild(btn);
  });

  document.body.appendChild(nav);
}

// ─── TOP BAR ────────────────────────────────────
// showLogo=true → show R.O.B logo instead of text title (for main section screens)
function renderTopBar(title, onBack, colorClass = '', showLogo = false) {
  const bar = document.createElement('div');
  bar.className = `top-bar ${colorClass}`;

  if (onBack) {
    const backBtn = document.createElement('button');
    backBtn.className = 'top-bar-back';
    backBtn.innerHTML = '←';
    backBtn.onclick = onBack;
    bar.appendChild(backBtn);
  } else {
    const spacer = document.createElement('div');
    spacer.style.width = '36px';
    bar.appendChild(spacer);
  }

  if (showLogo) {
    const logo = document.createElement('img');
    logo.src = '/logo.png';
    logo.alt = 'R.O.B';
    logo.className = 'top-bar-logo';
    bar.appendChild(logo);
  } else {
    const titleEl = document.createElement('span');
    titleEl.className = 'top-bar-title';
    titleEl.textContent = title;
    bar.appendChild(titleEl);
  }

  const spacer2 = document.createElement('div');
  spacer2.style.width = '36px';
  bar.appendChild(spacer2);

  app.appendChild(bar);
}

// ─── SPLASH SCREEN ──────────────────────────────
function renderSplash() {
  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.innerHTML = `
    <img src="/logo.png" alt="R.O.B Logo" class="splash-logo">
    <span class="splash-label">Command Center</span>
  `;
  app.appendChild(splash);

  setTimeout(() => {
    splash.style.opacity = '0';
    // ✅ Go directly to workouts_menu — skip intermediate menu screen
    setTimeout(() => { currentState = 'workouts_menu'; render(); }, 800);
  }, 4000);
}

// ─── MAIN MENU ──────────────────────────────────
function renderMenu() {
  renderTopBar('R.O.B OS', null, '');

  const content = document.createElement('div');
  content.className = 'screen-content';

  const hud = document.createElement('div');
  hud.className = 'section-hud';
  hud.innerHTML = `
    <div class="hud-chip"><span class="hud-dot"></span> COMMAND CENTER</div>
    <h1 class="hud-title">Выбери<br>направление</h1>
  `;
  content.appendChild(hud);

  const nav = document.createElement('div');
  nav.className = 'menu-nav';
  nav.style.padding = '0';

  const menuItems = [
    {
      color: 'lime', icon: '⚡', label: 'Тренировки',
      title: 'Прыжок', desc: 'Теория · Программы · ПКТ',
      state: 'workouts_menu'
    },
    {
      color: 'cyan', icon: '🎥', label: 'Съёмки',
      title: 'Медиа', desc: 'Задания · Сценарии',
      state: 'filming'
    },
    {
      color: 'magenta', icon: '💼', label: 'Карьера',
      title: 'Проект Оффер', desc: 'Письма · Задачи',
      state: 'offer'
    },
    {
      color: 'red', icon: '🗑️', label: 'Архив',
      title: 'Корзина', desc: 'Удалённые задания',
      state: 'trash'
    },
  ];

  menuItems.forEach(({ color, icon, label, title, desc, state }) => {
    const card = document.createElement('div');
    card.className = `menu-card ${color}`;
    card.innerHTML = `
      <div class="menu-card-icon">${icon}</div>
      <div class="menu-card-body">
        <div class="menu-card-label">${label}</div>
        <div class="menu-card-title">${title}</div>
      </div>
      <span class="menu-card-arrow">›</span>
    `;
    card.onclick = () => { currentState = state; render(); };
    nav.appendChild(card);
  });

  content.appendChild(nav);
  app.appendChild(content);
}

// ─── WORKOUTS HOME (Training section home) ────────────────────────
function renderWorkoutsMenu() {
  // Title instead of logo in top bar
  renderTopBar('ТРЕНИРОВКИ', null, '', false);

  // Background watermark is now global in render()
  const content = document.createElement('div');
  content.className = 'screen-content';

  const hud = document.createElement('div');
  hud.className = 'section-hud';
  hud.innerHTML = `
    <div class="hud-chip lime"><span class="hud-dot"></span> Модуль тренировок</div>
    <h1 class="hud-title">Активные<br>программы</h1>
  `;
  content.appendChild(hud);

  const nav = document.createElement('div');
  nav.className = 'menu-nav';
  nav.style.padding = '0';

  const items = [
    { icon: ICONS.theory,  label: 'База знаний', title: 'Теория и ЦНС', state: 'theory' },
    { icon: ICONS.gym,     label: 'Зал',         title: 'Программа тренировок', state: 'training' },
    { icon: ICONS.outdoor, label: 'Улица',       title: 'Тренировки без зала', state: 'outdoor_training' },
    { icon: ICONS.pkt,     label: 'Восстановление', title: 'ПКТ',          state: 'pkt' },
  ];

  items.forEach(({ icon, label, title, state }) => {
    const card = document.createElement('div');
    card.className = 'menu-card lime';
    card.innerHTML = `
      <div class="menu-card-icon">${icon}</div>
      <div class="menu-card-body">
        <div class="menu-card-label">${label}</div>
        <div class="menu-card-title">${title}</div>
      </div>
      <span class="menu-card-arrow">›</span>
    `;
    card.onclick = () => { currentState = state; render(); };
    nav.appendChild(card);
  });

  content.appendChild(nav);

  // ✅ Add Custom Tasks
  const activeTrainingTasks = customTasks.filter(t => t.section === 'training' && !t.is_deleted);
  if (activeTrainingTasks.length > 0) {
    const header = document.createElement('h2');
    header.className = 'hud-title';
    header.style.fontSize = '20px';
    header.style.marginTop = '40px';
    header.style.marginBottom = '16px';
    header.textContent = 'МОИ ЗАДАЧИ';
    content.appendChild(header);

    const taskList = document.createElement('div');
    taskList.className = 'cards-list';
    activeTrainingTasks.forEach(item => {
      taskList.appendChild(createCollapseCard(item, 'lime'));
    });
    content.appendChild(taskList);
  }

  app.appendChild(content);
}

// ─── UTILS ──────────────────────────────────────
function createCollapseCard(item, accentColor) {
  const card = document.createElement('div');
  card.className = `collapse-card ${accentColor}`;

  const header = document.createElement('div');
  header.className = 'collapse-header';
  header.innerHTML = `
    <span class="collapse-title">${item.title}</span>
    <div class="collapse-actions">
      <button class="delete-btn" title="Удалить">✕</button>
      <span class="collapse-chevron">▾</span>
    </div>
  `;
  header.querySelector('.delete-btn').onclick = (e) => {
    e.stopPropagation(); deleteItem(String(item.id));
  };

  const body = document.createElement('div');
  body.className = 'collapse-body';
  body.innerHTML = `<p>${item.content.replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>')}</p>`;

  header.onclick = () => {
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.collapse-card').forEach(c => c.classList.remove('active'));
    if (!isActive) card.classList.add('active');
  };

  card.appendChild(header);
  card.appendChild(body);
  return card;
}


// ─── TEXT CARDS (Theory / PKT / generic) ─────────
function renderTextCards(title, data, backState, accentColor = 'lime') {
  renderTopBar(title, () => { currentState = backState; render(); }, '');

  const content = document.createElement('div');
  content.className = 'screen-content';

  const hud = document.createElement('div');
  hud.className = 'section-hud';
  hud.innerHTML = `
    <div class="hud-chip ${accentColor}"><span class="hud-dot"></span> ${title.toUpperCase()}</div>
  `;
  content.appendChild(hud);

  const list = document.createElement('div');
  list.className = 'cards-list';

  data.forEach((item) => {
    const card = document.createElement('div');
    card.className = `collapse-card ${accentColor}`;

    const header = document.createElement('div');
    header.className = 'collapse-header';
    header.innerHTML = `
      <span class="collapse-title">${item.title}</span>
      <span class="collapse-chevron">▾</span>
    `;

    const body = document.createElement('div');
    body.className = 'collapse-body';

    let textHTML = item.content.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    let tableHTML = '';
    if (item.table) {
      tableHTML = '<div class="table-wrap"><table class="data-table"><thead><tr>';
      item.table.headers.forEach(th => { tableHTML += `<th>${th}</th>`; });
      tableHTML += '</tr></thead><tbody>';
      item.table.rows.forEach(tr => {
        tableHTML += '<tr>'; tr.forEach(td => { tableHTML += `<td>${td}</td>`; }); tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table></div>';
    }
    body.innerHTML = `<p>${textHTML}</p>${tableHTML}`;

    header.onclick = () => {
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.collapse-card').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    };

    card.appendChild(header);
    card.appendChild(body);
    list.appendChild(card);
  });

  content.appendChild(list);
  app.appendChild(content);
}

// ─── FILMING SECTION ────────────────────────────
function renderFilming() {
  renderTopBar('СЪЁМКИ', null, 'cyan', false);

  const content = document.createElement('div');
  content.className = 'screen-content';

  const hud = document.createElement('div');
  hud.className = 'section-hud';
  hud.innerHTML = `
    <div class="hud-chip cyan"><span class="hud-dot"></span> Live Feed Standby</div>
    <h1 class="hud-title">Съёмочный<br>процесс</h1>
  `;
  content.appendChild(hud);

  const list = document.createElement('div');
  list.className = 'cards-list';

  const deleted = getDeletedItems();
  const baseData = filmingData.filter(item => !deleted.includes(String(item.id)));
  const cData = customTasks.filter(item => item.section === 'filming' && !item.is_deleted);
  
  [...baseData, ...cData].forEach(item => {
    list.appendChild(createCollapseCard(item, 'cyan'));
  });

  content.appendChild(list);
  app.appendChild(content);
}

// ─── SETTINGS SECTION ───────────────────────────
function renderSettings() {
  renderTopBar('Настройки', null, 'white', false);

  const content = document.createElement('div');
  content.className = 'screen-content';

  const hud = document.createElement('div');
  hud.className = 'section-hud';
  hud.innerHTML = `
    <div class="hud-chip white"><span class="hud-dot" style="background:#fff"></span> Консоль управления</div>
    <h1 class="hud-title">Добавить<br>Задачу</h1>
  `;
  content.appendChild(hud);

  const formBox = document.createElement('div');
  formBox.className = 'settings-form';
  formBox.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:16px; margin-bottom: 24px;">
      <input type="text" id="task-title" placeholder="Заголовок задачи" autocomplete="off" class="glass-input">
      <textarea id="task-desc" placeholder="Описание / детали" rows="3" class="glass-input"></textarea>
      
      <div class="task-radios">
        <div class="checkbox-wrapper">
          <input type="radio" class="check" name="task-section" value="training" id="rt1" checked>
          <label for="rt1" class="label">
            <svg width="32" height="32" viewBox="0 0 95 95"><rect x="30" y="20" width="50" height="50" stroke="currentColor" fill="none" rx="4" ry="4"></rect><g transform="translate(0,-952.36222)"><path d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4" stroke="currentColor" stroke-width="3" fill="none" class="path1"></path></g></svg>
            <span>Тренировки</span>
          </label>
        </div>
        <div class="checkbox-wrapper">
          <input type="radio" class="check" name="task-section" value="filming" id="rt2">
          <label for="rt2" class="label">
            <svg width="32" height="32" viewBox="0 0 95 95"><rect x="30" y="20" width="50" height="50" stroke="currentColor" fill="none" rx="4" ry="4"></rect><g transform="translate(0,-952.36222)"><path d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4" stroke="currentColor" stroke-width="3" fill="none" class="path1"></path></g></svg>
            <span>Съёмки</span>
          </label>
        </div>
        <div class="checkbox-wrapper">
          <input type="radio" class="check" name="task-section" value="offer" id="rt3">
          <label for="rt3" class="label">
            <svg width="32" height="32" viewBox="0 0 95 95"><rect x="30" y="20" width="50" height="50" stroke="currentColor" fill="none" rx="4" ry="4"></rect><g transform="translate(0,-952.36222)"><path d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4" stroke="currentColor" stroke-width="3" fill="none" class="path1"></path></g></svg>
            <span>Оффер</span>
          </label>
        </div>
      </div>
      
      <button id="task-submit" class="primary-btn btn-lightning" style="display:flex; align-items:center; justify-content:center; gap:8px;">
        <svg width="22" height="22" viewBox="0 0 24 24" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" fill="none">
          <path d="m19,21H5c-1.1,0-2-.9-2-2V5c0-1.1.9-2,2-2h11l5,5v11c0,1.1-.9,2-2,2Z" stroke-linejoin="round" stroke-linecap="round"></path>
          <path d="M7 3L7 8L15 8" stroke-linejoin="round" stroke-linecap="round"></path>
          <path d="M17 20L17 13L7 13L7 20" stroke-linejoin="round" stroke-linecap="round"></path>
        </svg>
        <span>Добавить в базу</span>
      </button>
    </div>
  `;
  content.appendChild(formBox);

  const archiveBox = document.createElement('div');
  archiveBox.style.marginTop = '40px';
  archiveBox.innerHTML = `
    <button id="btn-goto-trash" class="primary-btn" style="background:rgba(255,80,80,0.1); color:var(--red); border:1px solid rgba(255,80,80,0.25); display:flex; align-items:center; justify-content:center; gap:12px;">
      ${ICONS.trash} <span>УДАЛЁННЫЕ ЭЛЕМЕНТЫ</span>
    </button>
  `;
  content.appendChild(archiveBox);

  app.appendChild(content);

  document.getElementById('task-submit').onclick = async () => {
    const title = document.getElementById('task-title').value.trim();
    const desc = document.getElementById('task-desc').value.trim();
    const section = document.querySelector('input[name="task-section"]:checked').value;
    
    if (!title) return;
    
    const btn = document.getElementById('task-submit');
    const span = btn.querySelector('span');
    const oldText = span.innerHTML;
    span.innerHTML = 'Сохранение...';
    btn.classList.add('striking');

    await addCustomTaskDB({ title, content: desc || ' ', section });
    
    span.innerHTML = '✔ Добавлено!';
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    
    setTimeout(() => { 
      span.innerHTML = oldText; 
      btn.classList.remove('striking');
    }, 2000);
  };
  
  document.getElementById('btn-goto-trash').onclick = () => { currentState = 'trash'; render(); };
}

// ─── OFFER SECTION ──────────────────────────────
function renderOffer() {
  renderTopBar('ОФФЕР', null, 'magenta', false);

  const content = document.createElement('div');
  content.className = 'screen-content';

  const hud = document.createElement('div');
  hud.className = 'section-hud';
  hud.innerHTML = `
    <div class="hud-chip magenta"><span class="hud-dot"></span> Карьерный модуль</div>
    <h1 class="hud-title">Активные<br>проекты</h1>
  `;
  content.appendChild(hud);

  // Cover Letters
  const lettersLabel = document.createElement('div');
  lettersLabel.className = 'section-label';
  lettersLabel.textContent = 'Сопроводительные письма';
  content.appendChild(lettersLabel);

  coverLettersData.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = `
      <div class="copy-btn-icon">${ICONS.copy}</div>
      <span>${letter.title}</span>
    `;
    btn.onclick = () => {
      navigator.clipboard.writeText(letter.content).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = `<div class="copy-btn-icon" style="color:var(--lime);">${ICONS.check}</div><span>Скопировано!</span>`;
        btn.style.borderColor = 'rgba(204,255,0,0.4)';
        setTimeout(() => { btn.innerHTML = orig; btn.style.borderColor = ''; }, 2000);
      });
    };
    content.appendChild(btn);
  });

  // Tasks
  const tasksLabel = document.createElement('div');
  tasksLabel.className = 'section-label';
  tasksLabel.textContent = 'Задания';
  content.appendChild(tasksLabel);

  const deleted = getDeletedItems();
  const list = document.createElement('div');
  list.className = 'cards-list';

  const baseData = offerData.filter(item => !deleted.includes(String(item.id)));
  const cData = customTasks.filter(item => item.section === 'offer' && !item.is_deleted);
  
  [...baseData, ...cData].forEach(item => {
    list.appendChild(createCollapseCard(item, 'magenta'));
  });

  content.appendChild(list);
  app.appendChild(content);
}

// ─── TRASH SECTION ──────────────────────────────
function renderTrash() {
  renderTopBar('Корзина', () => { currentState = 'settings'; render(); }, 'red', false); 

  const content = document.createElement('div');
  content.className = 'screen-content';

  const hud = document.createElement('div');
  hud.className = 'section-hud';
  hud.innerHTML = `
    <div class="hud-chip" style="color:#ff7070"><span class="hud-dot" style="background:#ff7070"></span> Архив</div>
    <h1 class="hud-title" style="color:#ff5050">Архив /<br>Корзина</h1>
    <p class="hud-subtitle">Удалённые элементы хранятся здесь</p>
  `;
  content.appendChild(hud);

  const deleted = getDeletedItems();
  const baseAll = [...filmingData, ...offerData].filter(d => deleted.includes(String(d.id)));
  const customAll = customTasks.filter(t => t.is_deleted);
  const items = [...baseAll, ...customAll];

  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `<span class="empty-icon">🗑️</span><p>Корзина пуста</p>`;
    content.appendChild(empty);
  } else {
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'trash-card';
      
      const title = document.createElement('div');
      title.className = 'trash-card-title';
      title.textContent = item.title;
      
      const actions = document.createElement('div');
      actions.className = 'trash-card-actions';
      
      const restoreBtn = document.createElement('button');
      restoreBtn.className = 'restore-btn';
      restoreBtn.textContent = '↩ Восстановить';
      restoreBtn.onclick = () => { restoreItem(String(item.id)); };
      actions.appendChild(restoreBtn);

      if (String(item.id).includes('-')) {
        // Allow hard delete for supabase items to save space
        const rmBtn = document.createElement('button');
        rmBtn.className = 'delete-btn';
        rmBtn.style.background = 'rgba(255,0,0,0.1)';
        rmBtn.style.color = 'var(--red)';
        rmBtn.style.marginLeft = '8px';
        rmBtn.textContent = '✕ Навсегда';
        rmBtn.onclick = () => {
          if(confirm('Удалить навсегда из базы?')) forceDeleteItem(String(item.id));
        };
        actions.appendChild(rmBtn);
      }
      
      card.appendChild(title);
      card.appendChild(actions);
      content.appendChild(card);
    });
  }

  app.appendChild(content);
}

// ─── TRAINING SCHEDULE ────────────────────────
function renderTraining(scheduleData, pageTitle) {
  renderTopBar(pageTitle, () => { currentState = 'workouts_menu'; render(); }, '');

  const content = document.createElement('div');
  content.className = 'screen-content';

  const tabsRow = document.createElement('div');
  tabsRow.className = 'days-tabs';

  const dayContents = document.createElement('div');

  const shortDays = {
    'Понедельник': 'ПН', 'Вторник': 'ВТ', 'Среда': 'СР',
    'Четверг': 'ЧТ', 'Пятница': 'ПТ', 'Суббота': 'СБ', 'Воскресенье': 'ВСКР'
  };

  scheduleData.forEach((dayData, index) => {
    // Tab
    const tab = document.createElement('div');
    tab.className = `day-tab${index === 0 ? ' active' : ''}`;
    tab.textContent = shortDays[dayData.day] || dayData.day;
    tab.onclick = () => {
      document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.day-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`day-${index}`).classList.add('active');
    };
    tabsRow.appendChild(tab);

    // Day panel
    const panel = document.createElement('div');
    panel.id = `day-${index}`;
    panel.className = `day-content${index === 0 ? ' active' : ''}`;

    const dayHead = document.createElement('div');
    dayHead.innerHTML = `
      <div class="day-title">${dayData.day}</div>
      <div class="day-subtitle">${dayData.subtitle}</div>
    `;
    panel.appendChild(dayHead);

    dayData.sessions.forEach(session => {
      const block = document.createElement('div');
      block.className = 'session-block';

      const isHigh = session.category.includes('High-CNS');
      const badgeClass = isHigh ? 'high' : 'low';
      const locBadge = session.location !== '-'
        ? `<span class="badge">${session.location}</span>` : '';

      block.innerHTML = `
        <div class="session-time-row">
          <div class="session-time">${session.time}</div>
          <div class="badges">
            ${locBadge}
            <span class="badge ${badgeClass}">${session.category.split(':')[0].trim()}</span>
          </div>
        </div>
      `;

      if (session.supplements) {
        block.innerHTML += `<div class="supplement-box">${session.supplements}</div>`;
      }

      if (session.exercises?.length) {
        session.exercises.forEach(ex => {
          const exEl = document.createElement('div');
          exEl.className = 'exercise';

          let videoHTML = '';
          if (ex.video) {
            videoHTML = `
              <a href="${ex.video}" target="_blank" rel="noopener" class="video-link">
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Видео
              </a>
            `;
          }

          exEl.innerHTML = `
            <div class="exercise-name">${ex.name}</div>
            <div class="exercise-desc">${ex.desc.replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>')}</div>
            <div class="exercise-footer">
              <span class="dosing-chip">${ex.dosing.replace(/\n/g,' · ')}</span>
              ${videoHTML}
            </div>
          `;
          block.appendChild(exEl);
        });
      }

      panel.appendChild(block);
    });

    dayContents.appendChild(panel);
  });

  content.appendChild(tabsRow);
  content.appendChild(dayContents);
  app.appendChild(content);
}

// ─── Start ─────────────────────────────────────
fetchCustomTasks();
render();
