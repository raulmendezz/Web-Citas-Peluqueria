const DAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const START_HOUR = 9;
const END_HOUR = 23;
const APPTS_KEY = 'webcitas_appts';

function loadAppts(){ return JSON.parse(localStorage.getItem(APPTS_KEY)||'[]'); }
function saveAppts(a){ localStorage.setItem(APPTS_KEY, JSON.stringify(a)); }

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

function timesArray(){
  const t = [];
  for(let h=START_HOUR; h<END_HOUR; h++){
    t.push(`${String(h).padStart(2,'0')}:00`);
    t.push(`${String(h).padStart(2,'0')}:30`);
  }
  return t;
}

function populateCreateSelects(){
  cDay.innerHTML = '';
  DAYS.forEach((d,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=d; cDay.appendChild(o); });
  cTime.innerHTML = '';
  timesArray().forEach(t=>{ const o=document.createElement('option'); o.value=t; o.textContent=t; cTime.appendChild(o); });
}

function requireAuth(){
  const cur = localStorage.getItem('webcitas_current');
  if(!cur){ location.href = 'index.html'; return null; }
  return JSON.parse(cur);
}

function renderGrid(){
  const appts = loadAppts();
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
      const appt = appts.find(a=>a.day===d && a.time===time);
      if(appt){ td.textContent = appt.name; td.className='slot-occupied'; }
      else { td.textContent = 'Libre'; td.className='slot-free'; }
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
  const cur = requireAuth();
  if(cur) cName.value = cur.name;
  populateCreateSelects();
  createModal.classList.remove('hidden');
});

cCancel.addEventListener('click', ()=> createModal.classList.add('hidden'));

cSave.addEventListener('click', ()=>{
  const name = cName.value.trim();
  const day = parseInt(cDay.value,10);
  const time = cTime.value;
  if(!name){ cMsg.textContent = 'Introduce nombre y apellidos.'; return; }
  const appts = loadAppts();
  if(appts.find(a=>a.day===day && a.time===time)){ cMsg.textContent='Error: el hueco no está libre.'; return; }
  appts.push({ id: Date.now().toString(36), name, day, time });
  saveAppts(appts);
  createModal.classList.add('hidden');
  renderGrid();
});

logoutBtn.addEventListener('click', ()=>{
  localStorage.removeItem('webcitas_current');
  location.href = 'index.html';
});

// init
// ensure modal hidden on load; only opened via button
createModal.classList.add('hidden');
populateCreateSelects();
renderGrid();

// close modal when clicking outside content
createModal.addEventListener('click', (e) => {
  if (e.target === createModal) createModal.classList.add('hidden');
});
// close modal on Escape
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') createModal.classList.add('hidden');
});
