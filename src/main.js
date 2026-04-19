import { theoryData, trainingSchedule } from './data.js';

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
  
  const theoryBtn = document.createElement('button');
  theoryBtn.className = 'menu-btn';
  theoryBtn.innerHTML = `<i>📚</i> ТЕОРИЯ И БАЗА`;
  theoryBtn.onclick = () => { currentState = 'theory'; render(); };
  
  const trainingBtn = document.createElement('button');
  trainingBtn.className = 'menu-btn';
  trainingBtn.innerHTML = `<i>⚡</i> ПРОГРАММА ТРЕНИРОВОК`;
  trainingBtn.onclick = () => { currentState = 'training'; render(); };
  
  menuContainer.appendChild(theoryBtn);
  menuContainer.appendChild(trainingBtn);
  app.appendChild(menuContainer);
}

function renderTheory() {
  renderHeader('БИОМЕХАНИКА И ЦНС', () => { currentState = 'menu'; render(); });
  
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
  renderHeader('РАСПИСАНИЕ СОПРОТИВЛЕНИЯ', () => { currentState = 'menu'; render(); });

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
