import { theoryData, trainingSchedule, outdoorTrainingSchedule, filmingData, coverLettersData, offerData, pktData } from './data.js';

// ─── localStorage Utils ──────────────────────────
function getDeletedItems() {
  return JSON.parse(localStorage.getItem('deletedItems') || '[]');
}
function deleteItem(id) {
  const items = getDeletedItems();
  if (!items.includes(id)) { items.push(id); localStorage.setItem('deletedItems', JSON.stringify(items)); }
}
function restoreItem(id) {
  const items = getDeletedItems().filter(i => i !== id);
  localStorage.setItem('deletedItems', JSON.stringify(items));
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
  trash: 'red',
};

// Bottom nav states that show the nav bar
const NAV_STATES = ['menu', 'workouts_menu', 'theory', 'training', 'outdoor_training', 'pkt', 'filming', 'offer', 'trash'];

function render() {
  const color = SECTION_COLORS[currentState] || 'lime';
  document.body.className = `section-${color === 'lime' ? 'training' : color === 'cyan' ? 'filming' : color === 'magenta' ? 'offer' : 'trash'}`;

  app.innerHTML = '';
  renderBottomNav(); // always after innerHTML clear, before content

  if (currentState === 'splash')                renderSplash();
  else if (currentState === 'workouts_menu')    renderWorkoutsMenu();
  else if (currentState === 'theory')           renderTextCards('Биомеханика и ЦНС', theoryData, 'workouts_menu', 'lime');
  else if (currentState === 'training')         renderTraining(trainingSchedule, 'Программа (в зале)');
  else if (currentState === 'outdoor_training') renderTraining(outdoorTrainingSchedule, 'Тренировки без зала');
  else if (currentState === 'pkt')              renderTextCards('ПКТ', pktData, 'workouts_menu', 'lime');
  else if (currentState === 'filming')          renderFilming();
  else if (currentState === 'offer')            renderOffer();
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
    { key: 'training', icon: '⚡', label: 'Тренировки', color: '',         state: 'workouts_menu' },
    { key: 'filming',  icon: '🎥', label: 'Съёмки',     color: 'cyan',     state: 'filming' },
    { key: 'offer',    icon: '💼', label: 'Оффер',       color: 'magenta',  state: 'offer' },
    { key: 'trash',    icon: '🗑️', label: 'Архив',      color: 'red',      state: 'trash' },
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
  }, 2500);
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
  // No back button — this IS the Training home screen
  renderTopBar('', null, '', true); // showLogo=true

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
    { icon: '📚', label: 'База знаний', title: 'Теория и ЦНС', state: 'theory' },
    { icon: '🔥', label: 'Зал', title: 'Программа тренировок', state: 'training' },
    { icon: '🌲', label: 'Улица', title: 'Тренировки без зала', state: 'outdoor_training' },
    { icon: '💊', label: 'Восстановление', title: 'ПКТ', state: 'pkt' },
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
  app.appendChild(content);
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
  renderTopBar('', null, 'cyan', true); // logo, no back

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
  filmingData
    .filter(item => !deleted.includes(item.id))
    .forEach(item => {
      const card = document.createElement('div');
      card.className = 'collapse-card cyan';

      const header = document.createElement('div');
      header.className = 'collapse-header';
      header.innerHTML = `
        <span class="collapse-title">${item.title}</span>
        <div class="collapse-actions">
          <button class="delete-btn" onclick="event.stopPropagation()">✕</button>
          <span class="collapse-chevron">▾</span>
        </div>
      `;
      header.querySelector('.delete-btn').onclick = (e) => {
        e.stopPropagation(); deleteItem(item.id); render();
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
      list.appendChild(card);
    });

  content.appendChild(list);
  app.appendChild(content);
}

// ─── OFFER SECTION ──────────────────────────────
function renderOffer() {
  renderTopBar('', null, 'magenta', true); // logo, no back

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
      <div class="copy-btn-icon">📄</div>
      <span>${letter.title}</span>
    `;
    btn.onclick = () => {
      navigator.clipboard.writeText(letter.content).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = `<div class="copy-btn-icon">✅</div><span>Скопировано!</span>`;
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

  offerData
    .filter(item => !deleted.includes(item.id))
    .forEach(item => {
      const card = document.createElement('div');
      card.className = 'collapse-card magenta';

      const header = document.createElement('div');
      header.className = 'collapse-header';
      header.innerHTML = `
        <span class="collapse-title">${item.title}</span>
        <div class="collapse-actions">
          <button class="delete-btn" onclick="event.stopPropagation()">✕</button>
          <span class="collapse-chevron">▾</span>
        </div>
      `;
      header.querySelector('.delete-btn').onclick = (e) => {
        e.stopPropagation(); deleteItem(item.id); render();
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
      list.appendChild(card);
    });

  content.appendChild(list);
  app.appendChild(content);
}

// ─── TRASH SECTION ──────────────────────────────
function renderTrash() {
  renderTopBar('', null, '', true); // logo, no back

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
  const allData = [...filmingData, ...offerData];
  const items = allData.filter(d => deleted.includes(d.id));

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
      restoreBtn.onclick = () => { restoreItem(item.id); render(); };
      
      actions.appendChild(restoreBtn);
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
render();
