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
const adminPanel = document.getElementById('adminPanel');
const btnEdit = document.getElementById('btnEdit');
const btnDelete = document.getElementById('btnDelete');
const btnBlock = document.getElementById('btnBlock');

let selectedSlot = null; // {day, time, appt, td}
let editMode = false;
let editingId = null;

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
      td.dataset.day = d;
      td.dataset.time = time;
      if(appt){
        if(appt.blocked){
          td.textContent = 'No disponible';
          td.className='slot-blocked';
        } else {
          td.textContent = appt.name;
          td.className='slot-occupied';
        }
      } else {
        td.textContent = 'Libre';
        td.className='slot-free';
      }
      // click to select slot
      td.addEventListener('click', ()=> onCellClick(d, time, appt, td));
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
  editMode = false;
  editingId = null;
  createModal.classList.remove('hidden');
  updateAdminPanel();
});

cCancel.addEventListener('click', ()=> createModal.classList.add('hidden'));

cSave.addEventListener('click', ()=>{
  const name = cName.value.trim();
  const day = parseInt(cDay.value,10);
  const time = cTime.value;
  if(!name){ cMsg.textContent = 'Introduce nombre y apellidos.'; return; }
  const appts = loadAppts();
  if(editMode){
    // edit existing
    const idx = appts.findIndex(a=>a.id===editingId);
    if(idx===-1){ cMsg.textContent='Error: cita no encontrada.'; return; }
    // check conflict with other appt
    if(appts.find(a=>a.day===day && a.time===time && a.id!==editingId)){
      cMsg.textContent='Error: el hueco ya está ocupado.'; return;
    }
    appts[idx].name = name;
    appts[idx].day = day;
    appts[idx].time = time;
    appts[idx].blocked = false;
  } else {
    if(appts.find(a=>a.day===day && a.time===time)){ cMsg.textContent='Error: el hueco no está libre.'; return; }
    appts.push({ id: Date.now().toString(36), name, day, time, blocked: false });
  }
  saveAppts(appts);
  createModal.classList.add('hidden');
  renderGrid();
  selectedSlot = null;
  updateAdminPanel();
});

logoutBtn.addEventListener('click', ()=>{
  localStorage.removeItem('webcitas_current');
  location.href = 'index.html';
});

function onCellClick(day, time, appt, td){
  const cur = requireAuth();
  if(!cur) return;
  // only admins can select slots for admin actions
  if(cur.role !== 'admin') return;
  // set selection
  // clear previous highlight
  document.querySelectorAll('td').forEach(x=>x.classList.remove('selected'));
  td.classList.add('selected');
  selectedSlot = { day, time, appt, td };
  updateAdminPanel();
}

function updateAdminPanel(){
  const cur = requireAuth();
  if(!cur || cur.role !== 'admin'){
    if(adminPanel) adminPanel.classList.add('hidden');
    return;
  }
  // show panel
  adminPanel.classList.remove('hidden');
  // enable/disable based on selection
  if(!selectedSlot){
    btnEdit.disabled = true;
    btnDelete.disabled = true;
    btnBlock.disabled = true;
    return;
  }
  const { appt } = selectedSlot;
  if(appt){
    btnEdit.disabled = false;
    btnDelete.disabled = false;
    // if blocked, show "Desmarcar"
    if(appt.blocked){
      btnBlock.textContent = 'Desmarcar';
      btnBlock.disabled = false;
    } else {
      btnBlock.textContent = 'Marcar no disponible';
      btnBlock.disabled = true; // cannot block occupied slot
    }
  } else {
    btnEdit.disabled = true;
    btnDelete.disabled = true;
    btnBlock.textContent = 'Marcar no disponible';
    btnBlock.disabled = false;
  }
}

// admin actions
btnEdit.addEventListener('click', ()=>{
  if(!selectedSlot || !selectedSlot.appt) return;
  editMode = true;
  editingId = selectedSlot.appt.id;
  cName.value = selectedSlot.appt.name || '';
  cDay.value = String(selectedSlot.day);
  cTime.value = selectedSlot.time;
  createModal.classList.remove('hidden');
});

btnDelete.addEventListener('click', ()=>{
  if(!selectedSlot || !selectedSlot.appt) return;
  if(!confirm('Eliminar cita seleccionada?')) return;
  const appts = loadAppts();
  const idx = appts.findIndex(a=>a.id===selectedSlot.appt.id);
  if(idx!==-1){ appts.splice(idx,1); saveAppts(appts); }
  selectedSlot = null;
  renderGrid();
  updateAdminPanel();
});

btnBlock.addEventListener('click', ()=>{
  if(!selectedSlot) return;
  const appts = loadAppts();
  const { day, time, appt } = selectedSlot;
  if(appt){
    // if blocked -> remove block (delete)
    if(appt.blocked){
      const idx = appts.findIndex(a=>a.id===appt.id);
      if(idx!==-1){ appts.splice(idx,1); saveAppts(appts); }
    }
  } else {
    // create blocked slot
    appts.push({ id: Date.now().toString(36), name: '', day, time, blocked: true });
    saveAppts(appts);
  }
  selectedSlot = null;
  renderGrid();
  updateAdminPanel();
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
