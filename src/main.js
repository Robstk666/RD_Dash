import { theoryData, trainingSchedule, filmingData, coverLettersData, offerData } from './data.js';

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
    renderTraining();
  } else if (currentState === 'workouts_menu') {
    renderWorkoutsMenu();
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
  splash.innerHTML = `<img src="/logo.png" alt="R.O.B Logo">`;
  app.appendChild(splash);

  // Transition to menu after 2.5 seconds
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
      currentState = 'menu';
      render();
    }, 800); // Wait for fade out transition
  }, 2500);
}

function renderHeader(title, onBack) {
  const header = document.createElement('header');
  
  if (onBack) {
    const nav = document.createElement('div');
    nav.className = 'nav-controls';
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = '← НАЗАД В МЕНЮ';
    backBtn.onclick = onBack;
    nav.appendChild(backBtn);
    app.appendChild(nav);
  }
  
  const h1 = document.createElement('h1');
  h1.textContent = title;
  header.appendChild(h1);
  app.appendChild(header);
}

function renderMenu() {
  renderHeader('ТВОЙ ПУТЬ К ДАНКУ', null);
  
  const menuContainer = document.createElement('div');
  menuContainer.className = 'menu-container';
  
  const workoutsBtn = document.createElement('button');
  workoutsBtn.className = 'menu-btn';
  workoutsBtn.innerHTML = `<i>⚡</i> ТРЕНИРОВКИ`;
  workoutsBtn.onclick = () => { currentState = 'workouts_menu'; render(); };
  
  const filmingBtn = document.createElement('button');
  filmingBtn.className = 'menu-btn';
  filmingBtn.innerHTML = `<i>🎥</i> СЪЕМКИ`;
  filmingBtn.onclick = () => { currentState = 'filming'; render(); };
  
  const offerBtn = document.createElement('button');
  offerBtn.className = 'menu-btn';
  offerBtn.innerHTML = `<i>💼</i> ПРОЕКТ ОФФЕР`;
  offerBtn.onclick = () => { currentState = 'offer'; render(); };
  
  const trashBtn = document.createElement('button');
  trashBtn.className = 'menu-btn';
  trashBtn.innerHTML = `<i>🗑️</i> КОРЗИНА`;
  trashBtn.onclick = () => { currentState = 'trash'; render(); };
  
  menuContainer.appendChild(workoutsBtn);
  menuContainer.appendChild(filmingBtn);
  menuContainer.appendChild(offerBtn);
  menuContainer.appendChild(trashBtn);
  app.appendChild(menuContainer);
}

function renderWorkoutsMenu() {
  renderHeader('ТРЕНИРОВКИ', () => { currentState = 'menu'; render(); });
  
  const menuContainer = document.createElement('div');
  menuContainer.className = 'menu-container';
  
  const theoryBtn = document.createElement('button');
  theoryBtn.className = 'menu-btn';
  theoryBtn.innerHTML = `<i>📚</i> ТЕОРИЯ И БАЗА`;
  theoryBtn.onclick = () => { currentState = 'theory'; render(); };
  
  const trainingBtn = document.createElement('button');
  trainingBtn.className = 'menu-btn';
  trainingBtn.innerHTML = `<i>🔥</i> ПРОГРАММА ТРЕНИРОВОК`;
  trainingBtn.onclick = () => { currentState = 'training'; render(); };
  
  menuContainer.appendChild(theoryBtn);
  menuContainer.appendChild(trainingBtn);
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
  renderHeader('ПРОЕКТ ОФФЕР', () => { currentState = 'menu'; render(); });
  
  const container = document.createElement('div');
  container.className = 'offer-container';
  
  // Cover Letters Section
  const lettersSection = document.createElement('div');
  lettersSection.className = 'letters-section';
  lettersSection.innerHTML = '<h2 style="margin-bottom:15px; color:var(--gold);">СОПРОВОДИТЕЛЬНЫЕ ПИСЬМА</h2>';
  
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
  tasksSection.innerHTML = '<h2 style="margin-bottom:15px; color:var(--gold);">ЗАДАНИЯ:</h2>';
  
  const deletedItems = getDeletedItems();
  const activeOfferTasks = offerData.filter(item => !deletedItems.includes(item.id));
  
  activeOfferTasks.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'theory-card';
    
    const header = document.createElement('div');
    header.className = 'theory-card-header';
    header.innerHTML = `
      <h3>${item.title}</h3>
      <div>
        <button class="delete-btn" onclick="event.stopPropagation()">🗑️</button>
        <div class="theory-card-icon" style="display:inline-block; margin-left:10px;">▼</div>
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
  renderHeader('МАТЕРИАЛЫ И ОТЧЕТЫ', () => { currentState = 'menu'; render(); });
  
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
      <div>
        <button class="delete-btn" onclick="event.stopPropagation()">🗑️</button>
        <div class="theory-card-icon" style="display:inline-block; margin-left:10px;">▼</div>
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
  renderHeader('БИОМЕХАНИКА И ЦНС', () => { currentState = 'workouts_menu'; render(); });
  
  const list = document.createElement('div');
  list.className = 'theory-list';
  
  theoryData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'theory-card';
    
    const header = document.createElement('div');
    header.className = 'theory-card-header';
    header.innerHTML = `
      <h3>${item.title}</h3>
      <div class="theory-card-icon">▼</div>
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

function renderTraining() {
  renderHeader('РАСПИСАНИЕ СОПРОТИВЛЕНИЯ', () => { currentState = 'workouts_menu'; render(); });

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

  trainingSchedule.forEach((dayData, index) => {
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
