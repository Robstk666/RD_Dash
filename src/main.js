import { theoryData, trainingSchedule, outdoorTrainingSchedule, filmingData, coverLettersData, offerData, pktData } from './data.js';

// LocalStorage Utils for Trash functionality
function getDeletedItems() {
  const data = localStorage.getItem('deletedItems');
  return data ? JSON.parse(data) : [];
}
function deleteItem(id) {
  const items = getDeletedItems();
  if (!items.includes(id)) {
    items.push(id);
    localStorage.setItem('deletedItems', JSON.stringify(items));
  }
}
function restoreItem(id) {
  let items = getDeletedItems();
  items = items.filter(item => item !== id);
  localStorage.setItem('deletedItems', JSON.stringify(items));
}

const app = document.getElementById('app');
const cursorGlow = document.getElementById('cursor-glow');

// Cursor glow tracking
document.addEventListener('mousemove', (e) => {
  if (cursorGlow) {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  }
});

// State
let currentState = 'splash'; // splash, menu, theory, training

function render() {
  app.innerHTML = '';
  
  if (currentState === 'splash') {
    renderSplash();
  } else if (currentState === 'menu') {
    renderMenu();
  } else if (currentState === 'theory') {
    renderTheory();
  } else if (currentState === 'training') {
    renderTraining(trainingSchedule, 'РАСПИСАНИЕ (В ЗАЛЕ)');
  } else if (currentState === 'outdoor_training') {
    renderTraining(outdoorTrainingSchedule, 'ТРЕНИРОВКИ БЕЗ ЗАЛА');
  } else if (currentState === 'workouts_menu') {
    renderWorkoutsMenu();
  } else if (currentState === 'pkt') {
    renderTextCards('ПКТ (ПОСЛЕКУРСОВАЯ ТЕРАПИЯ)', pktData, 'workouts_menu');
  } else if (currentState === 'filming') {
    renderFilming();
  } else if (currentState === 'offer') {
    renderOffer();
  } else if (currentState === 'trash') {
    renderTrash();
  }
}

function renderSplash() {
  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.innerHTML = `
    <img src="/logo.png" alt="R.O.B Logo">
    <div class="splash-tagline">Personal OS</div>
  `;
  app.appendChild(splash);

  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
      currentState = 'menu';
      render();
    }, 800);
  }, 2500);
}

function renderHeader(title, onBack) {
  if (onBack) {
    const nav = document.createElement('div');
    nav.className = 'nav-controls';
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = 'Назад';
    backBtn.onclick = onBack;
    nav.appendChild(backBtn);
    app.appendChild(nav);
  }

  const header = document.createElement('header');
  const h1 = document.createElement('h1');
  h1.textContent = title;
  header.appendChild(h1);
  app.appendChild(header);
}

function renderMenu() {
  renderHeader('R.O.B OS', null);
  
  const menuContainer = document.createElement('div');
  menuContainer.className = 'menu-container';

  const buttons = [
    { emoji: '⚡', label: 'Тренировки', state: 'workouts_menu' },
    { emoji: '🎥', label: 'Съёмки', state: 'filming' },
    { emoji: '💼', label: 'Проект Оффер', state: 'offer' },
    { emoji: '🗑️', label: 'Корзина', state: 'trash' },
  ];

  buttons.forEach(({ emoji, label, state }) => {
    const btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.innerHTML = `<i>${emoji}</i>${label}<span class="menu-btn-arrow">›</span>`;
    btn.onclick = () => { currentState = state; render(); };
    menuContainer.appendChild(btn);
  });

  app.appendChild(menuContainer);
}

function renderWorkoutsMenu() {
  renderHeader('Тренировки', () => { currentState = 'menu'; render(); });
  
  const menuContainer = document.createElement('div');
  menuContainer.className = 'menu-container';

  const buttons = [
    { emoji: '📚', label: 'Теория и База', state: 'theory' },
    { emoji: '🔥', label: 'Программа (в зале)', state: 'training' },
    { emoji: '🌲', label: 'Тренировки без зала', state: 'outdoor_training' },
    { emoji: '💊', label: 'ПКТ', state: 'pkt' },
  ];

  buttons.forEach(({ emoji, label, state }) => {
    const btn = document.createElement('button');
    btn.className = 'menu-btn';
    btn.innerHTML = `<i>${emoji}</i>${label}<span class="menu-btn-arrow">›</span>`;
    btn.onclick = () => { currentState = state; render(); };
    menuContainer.appendChild(btn);
  });

  app.appendChild(menuContainer);
}

function renderTrash() {
  renderHeader('КОРЗИНА', () => { currentState = 'menu'; render(); });
  const list = document.createElement('div');
  list.className = 'theory-list';
  
  const deletedItems = getDeletedItems();
  const allData = [...filmingData, ...offerData];
  const itemsToShow = allData.filter(item => deletedItems.includes(item.id));
  
  if (itemsToShow.length === 0) {
    list.innerHTML = '<p style="text-align:center; color: var(--text-muted); margin-top:20px;">Корзина пуста</p>';
  }
  
  itemsToShow.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'theory-card';
    card.style.opacity = '0.7';
    
    const header = document.createElement('div');
    header.className = 'theory-card-header';
    header.innerHTML = `
      <h3>${item.title}</h3>
      <button class="restore-btn" onclick="event.stopPropagation()">♻️ Восстановить</button>
    `;
    
    header.querySelector('.restore-btn').onclick = (e) => {
      e.stopPropagation();
      restoreItem(item.id);
      render();
    };
    
    const content = document.createElement('div');
    content.className = 'theory-card-content';
    let textHTML = item.content.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    content.innerHTML = `<p>${textHTML}</p>`;
    
    header.onclick = () => {
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.theory-card').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    };
    
    card.appendChild(header);
    card.appendChild(content);
    list.appendChild(card);
  });
  
  app.appendChild(list);
}

function renderOffer() {
  renderHeader('Проект Оффер', () => { currentState = 'menu'; render(); });
  
  const container = document.createElement('div');
  container.className = 'offer-container';
  
  // Cover Letters Section
  const lettersSection = document.createElement('div');
  lettersSection.className = 'letters-section';
  lettersSection.innerHTML = '<p class="section-heading">Сопроводительные письма</p>';
  
  coverLettersData.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = `<i>📄</i> ${letter.title}`;
    btn.onclick = () => {
      navigator.clipboard.writeText(letter.content).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i>✅</i> Текст скопирован!`;
        btn.style.borderColor = 'var(--gold)';
        btn.style.color = 'var(--gold)';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.borderColor = 'var(--border-color)';
          btn.style.color = 'var(--text-color)';
        }, 2000);
      });
    };
    lettersSection.appendChild(btn);
  });
  
  container.appendChild(lettersSection);
  
  // Tasks Section
  const tasksSection = document.createElement('div');
  tasksSection.className = 'theory-list';
  tasksSection.style.marginTop = '40px';
  tasksSection.innerHTML = '<p class="section-heading">Задания</p>';
  
  const deletedItems = getDeletedItems();
  const activeOfferTasks = offerData.filter(item => !deletedItems.includes(item.id));
  
  activeOfferTasks.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'theory-card';
    
    const header = document.createElement('div');
    header.className = 'theory-card-header';
    header.innerHTML = `
      <h3>${item.title}</h3>
      <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
        <button class="delete-btn" onclick="event.stopPropagation()">🗑️</button>
        <div class="theory-card-icon">▾</div>
      </div>
    `;
    
    header.querySelector('.delete-btn').onclick = (e) => {
      e.stopPropagation();
      deleteItem(item.id);
      render();
    };
    
    const content = document.createElement('div');
    content.className = 'theory-card-content';
    let textHTML = item.content.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    content.innerHTML = `<p>${textHTML}</p>`;
    
    header.onclick = () => {
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.theory-card').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    };
    
    card.appendChild(header);
    card.appendChild(content);
    tasksSection.appendChild(card);
  });
  
  container.appendChild(tasksSection);
  app.appendChild(container);
}

function renderFilming() {
  renderHeader('Съёмки', () => { currentState = 'menu'; render(); });
  
  const list = document.createElement('div');
  list.className = 'theory-list';
  
  const deletedItems = getDeletedItems();
  const activeFilmingTasks = filmingData.filter(item => !deletedItems.includes(item.id));
  
  activeFilmingTasks.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'theory-card';
    
    const header = document.createElement('div');
    header.className = 'theory-card-header';
    header.innerHTML = `
      <h3>${item.title}</h3>
      <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
        <button class="delete-btn" onclick="event.stopPropagation()">🗑️</button>
        <div class="theory-card-icon">▾</div>
      </div>
    `;
    
    header.querySelector('.delete-btn').onclick = (e) => {
      e.stopPropagation();
      deleteItem(item.id);
      render();
    };
    
    const content = document.createElement('div');
    content.className = 'theory-card-content';
    let textHTML = item.content.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    content.innerHTML = `<p>${textHTML}</p>`;
    
    header.onclick = () => {
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.theory-card').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    };
    
    card.appendChild(header);
    card.appendChild(content);
    list.appendChild(card);
  });
  
  app.appendChild(list);
}

function renderTheory() {
  renderTextCards('Биомеханика и ЦНС', theoryData, 'workouts_menu');
}

function renderTextCards(headerTitle, textData, backRoute) {
  renderHeader(headerTitle, () => { currentState = backRoute; render(); });
  
  const list = document.createElement('div');
  list.className = 'theory-list';
  
  textData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'theory-card';
    
    const header = document.createElement('div');
    header.className = 'theory-card-header';
    header.innerHTML = `
      <h3>${item.title}</h3>
      <div class="theory-card-icon">▾</div>
    `;
    
    const content = document.createElement('div');
    content.className = 'theory-card-content';
    // Replace newlines with <br> and bold specific terms
    let textHTML = item.content.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    
    let tableHTML = '';
    if (item.table) {
      tableHTML = '<div class="table-container"><table class="theory-table">';
      tableHTML += '<thead><tr>';
      item.table.headers.forEach(th => {
        tableHTML += `<th>${th}</th>`;
      });
      tableHTML += '</tr></thead><tbody>';
      
      item.table.rows.forEach(tr => {
        tableHTML += '<tr>';
        tr.forEach(td => {
          tableHTML += `<td>${td}</td>`;
        });
        tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table></div>';
    }
    
    content.innerHTML = `<p>${textHTML}</p>${tableHTML}`;
    
    header.onclick = () => {
      // Toggle active class
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.theory-card').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    };
    
    card.appendChild(header);
    card.appendChild(content);
    list.appendChild(card);
  });
  
  app.appendChild(list);
}

function renderTraining(scheduleData, headingTitle) {
  renderHeader(headingTitle, () => { currentState = 'workouts_menu'; render(); });

  const nav = document.createElement('div');
  nav.className = 'days-nav';
  
  const contentContainer = document.createElement('div');
  contentContainer.className = 'days-content-container';

  const shortDays = {
    "Понедельник": "ПН",
    "Вторник": "ВТ",
    "Среда": "СР",
    "Четверг": "ЧТ",
    "Пятница": "ПТ",
    "Суббота": "СБ",
    "Воскресенье": "ВСКР"
  };

  scheduleData.forEach((dayData, index) => {
    // Nav Tab
    const tab = document.createElement('div');
    tab.className = `day-tab ${index === 0 ? 'active' : ''}`;
    tab.textContent = shortDays[dayData.day] || dayData.day;
    tab.onclick = () => {
      document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.day-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`day-${index}`).classList.add('active');
    };
    nav.appendChild(tab);

    // Day Content
    const dayContent = document.createElement('div');
    dayContent.id = `day-${index}`;
    dayContent.className = `day-content ${index === 0 ? 'active' : ''}`;
    
    dayContent.innerHTML = `
      <div class="day-header">
        <h2>${dayData.day}</h2>
        <p>${dayData.subtitle}</p>
      </div>
    `;

    dayData.sessions.forEach(session => {
      const sessionCard = document.createElement('div');
      sessionCard.className = 'session-card';
      
      let intensityClass = session.category.includes('High-CNS') ? 'intensity-high' : 'intensity-low';
      if (session.category.includes('Отдых') || session.category.includes('Регенерация')) {
        intensityClass = 'intensity-low';
      }

      sessionCard.innerHTML = `
        <div class="session-header">
          <div class="session-time">${session.time}</div>
          <div class="session-meta">
            ${session.location !== '-' ? `<span class="badge">${session.location}</span>` : ''}
            <span class="badge ${intensityClass}">${session.category.split(':')[0]}</span>
          </div>
        </div>
      `;

      if (session.supplements) {
        sessionCard.innerHTML += `<div class="supplement-alert">${session.supplements}</div>`;
      }

      if (session.exercises && session.exercises.length > 0) {
        const exercisesContainer = document.createElement('div');
        session.exercises.forEach(ex => {
          const exHTML = document.createElement('div');
          exHTML.className = 'exercise-item';
          
          let videoHTML = '';
          if (ex.video) {
            videoHTML = `
              <a href="${ex.video}" target="_blank" class="video-btn">
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                СМОТРЕТЬ ВИДЕО
              </a>
            `;
          }

          exHTML.innerHTML = `
            <div class="exercise-title">${ex.name}</div>
            <div class="exercise-desc">${ex.desc.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')}</div>
            <div class="exercise-dosing">${ex.dosing.replace(/\n\n/g, '<br>').replace(/\n/g, '<br>')}</div>
            <br/>
            ${videoHTML}
          `;
          exercisesContainer.appendChild(exHTML);
        });
        sessionCard.appendChild(exercisesContainer);
      }
      
      dayContent.appendChild(sessionCard);
    });

    contentContainer.appendChild(dayContent);
  });

  app.appendChild(nav);
  app.appendChild(contentContainer);
}

// Start app
render();
