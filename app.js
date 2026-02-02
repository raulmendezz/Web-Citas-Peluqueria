/* webcitas — simplified SPA
   Flow:
   - auth screen (login/register)
   - on login, show weekly schedule (09:00-23:00, 30m slots)
   - floating "Crear cita" opens modal with: nombre y apellidos, día, hora
   - creates appointment if slot free, otherwise shows error
*/
const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const START_HOUR = 9;
const END_HOUR = 23;

const USERS_KEY = 'webcitas_users';
const APPTS_KEY = 'webcitas_appts';

// DOM
const authCard = document.getElementById('authCard');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const authForm = document.getElementById('authForm');
const authName = document.getElementById('authName');
const authRole = document.getElementById('authRole');
const authMsg = document.getElementById('authMsg');

const scheduleView = document.getElementById('scheduleView');
const scheduleWrap = document.getElementById('scheduleWrap');
const logoutBtn = document.getElementById('logoutBtn');
const createBtn = document.getElementById('createBtn');

const createModal = document.getElementById('createModal');
const cName = document.getElementById('cName');
const cDay = document.getElementById('cDay');
const cTime = document.getElementById('cTime');
const cSave = document.getElementById('cSave');
const cCancel = document.getElementById('cCancel');
const cMsg = document.getElementById('cMsg');

let currentUser = null;
let appointments = [];

function loadUsers(){ return JSON.parse(localStorage.getItem(USERS_KEY)||'[]'); }
function saveUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function loadAppts(){ appointments = JSON.parse(localStorage.getItem(APPTS_KEY)||'[]'); }
function saveAppts(){ localStorage.setItem(APPTS_KEY, JSON.stringify(appointments)); }

function timesArray(){
  const t = [];
  for(let h=START_HOUR; h<END_HOUR; h++){
    t.push(`${String(h).padStart(2,'0')}:00`);
    t.push(`${String(h).padStart(2,'0')}:30`);
  }
  return t;
}

function setActiveTab(mode){
  tabLogin.classList.toggle('active', mode==='login');
  tabRegister.classList.toggle('active', mode==='register');
}

tabLogin.addEventListener('click', ()=> setActiveTab('login'));
tabRegister.addEventListener('click', ()=> setActiveTab('register'));

authForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = authName.value.trim();
  const role = authRole.value;
  if(!name){ authMsg.textContent = 'Introduce nombre y apellidos.'; return; }
  const users = loadUsers();
  if(tabRegister.classList.contains('active')){
    if(users.find(u=>u.name.toLowerCase()===name.toLowerCase())){
      authMsg.textContent = 'Usuario ya registrado.';
      return;
    }
    users.push({ name, role });
    saveUsers(users);
    authMsg.textContent = 'Registro correcto. Cambia a "Iniciar sesión".';
    setActiveTab('login');
    return;
  } else {
    const found = users.find(u=>u.name.toLowerCase()===name.toLowerCase() && u.role===role);
    if(!found){ authMsg.textContent = 'Usuario no encontrado o rol incorrecto.'; return; }
    currentUser = found;
    enterSchedule();
  }
});

function enterSchedule(){
  loadAppts();
  authCard.classList.add('hidden');
  scheduleView.classList.remove('hidden');
  populateCreateSelects();
  renderGrid();
}

logoutBtn.addEventListener('click', ()=>{
  currentUser = null;
  scheduleView.classList.add('hidden');
  authCard.classList.remove('hidden');
  authName.value = '';
  authMsg.textContent = '';
});

function renderGrid(){
  loadAppts();
  const times = timesArray();
  const table = document.createElement('table');
  table.className = 'grid';
  const thead = document.createElement('thead');
  const hr = document.createElement('tr');
  hr.appendChild(document.createElement('th'));
  DAYS.forEach(d=>{ const th=document.createElement('th'); th.textContent=d; hr.appendChild(th); });
  thead.appendChild(hr);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  times.forEach(time=>{
    const tr = document.createElement('tr');
    const th = document.createElement('th'); th.textContent = time; tr.appendChild(th);
    for(let d=0; d<7; d++){
      const td = document.createElement('td');
      const appt = appointments.find(a=>a.day===d && a.time===time);
      if(appt){ td.textContent = appt.name; td.className='slot-occupied'; }
      else { td.textContent = 'Libre'; td.className='slot-free'; }
      td.dataset.day = d; td.dataset.time = time;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  scheduleWrap.innerHTML = '';
  scheduleWrap.appendChild(table);
}

createBtn.addEventListener('click', ()=>{
  cMsg.textContent = '';
  cName.value = currentUser ? currentUser.name : '';
  populateCreateSelects();
  createModal.classList.remove('hidden');
});

function populateCreateSelects(){
  cDay.innerHTML = '';
  DAYS.forEach((d,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=d; cDay.appendChild(o); });
  cTime.innerHTML = '';
  timesArray().forEach(t=>{ const o=document.createElement('option'); o.value=t; o.textContent=t; cTime.appendChild(o); });
}

cCancel.addEventListener('click', ()=> createModal.classList.add('hidden'));

cSave.addEventListener('click', ()=>{
  const name = cName.value.trim();
  const day = parseInt(cDay.value,10);
  const time = cTime.value;
  if(!name){ cMsg.textContent = 'Introduce nombre y apellidos.'; return; }
  loadAppts();
  if(appointments.find(a=>a.day===day && a.time===time)){ cMsg.textContent='Error: el hueco no está libre.'; return; }
  appointments.push({ id: Date.now().toString(36), name, day, time });
  saveAppts();
  createModal.classList.add('hidden');
  renderGrid();
});

// init
setActiveTab('login');
authMsg.textContent = '';

