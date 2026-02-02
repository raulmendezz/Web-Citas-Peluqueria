const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_DIR = path.join(__dirname);
const USERS_FILE = path.join(DATA_DIR, 'server_users.json');
const APPTS_FILE = path.join(DATA_DIR, 'server_appointments.json');

function readJSON(file){
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch(e){
    return [];
  }
}
function writeJSON(file, data){
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Seed files if missing
if(!fs.existsSync(USERS_FILE)){
  writeJSON(USERS_FILE, [
    { name: 'admin', role: 'admin' },
    { name: 'alice', role: 'user' },
    { name: 'bob', role: 'user' }
  ]);
}
if(!fs.existsSync(APPTS_FILE)){
  writeJSON(APPTS_FILE, []);
}

function createId(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

app.post('/api/login', (req, res) => {
  const { name, role } = req.body || {};
  if(!name || !role) return res.status(400).json({ error: 'Faltan credenciales' });
  const users = readJSON(USERS_FILE);
  const found = users.find(u => u.name === name && u.role === role);
  if(found){
    return res.json({ ok: true, user: found });
  }
  return res.status(401).json({ error: 'Usuario no encontrado o rol incorrecto' });
});

app.get('/api/appointments', (req, res) => {
  const appts = readJSON(APPTS_FILE);
  res.json(appts);
});

app.post('/api/appointments', (req, res) => {
  const appts = readJSON(APPTS_FILE);
  const { user, role, title, day, time } = req.body || {};
  if(typeof day !== 'number' || !time) return res.status(400).json({ error: 'Datos inválidos' });
  // conflict
  if(appts.find(a => a.day === day && a.time === time)){
    return res.status(409).json({ error: 'Conflicto: hueco ocupado' });
  }
  const newAppt = { id: createId(), user, role, title, day, time, blocked: false };
  appts.push(newAppt);
  writeJSON(APPTS_FILE, appts);
  res.json(newAppt);
});

app.put('/api/appointments/:id', (req, res) => {
  const appts = readJSON(APPTS_FILE);
  const id = req.params.id;
  const idx = appts.findIndex(a => a.id === id);
  if(idx === -1) return res.status(404).json({ error: 'No encontrado' });
  const { title, day, time } = req.body || {};
  // check conflict with other appt
  if(typeof day === 'number' && time){
    const other = appts.find(a => a.day === day && a.time === time && a.id !== id);
    if(other) return res.status(409).json({ error: 'Conflicto de horario' });
    appts[idx].day = day;
    appts[idx].time = time;
  }
  if(title !== undefined) appts[idx].title = title;
  writeJSON(APPTS_FILE, appts);
  res.json(appts[idx]);
});

app.delete('/api/appointments/:id', (req, res) => {
  let appts = readJSON(APPTS_FILE);
  const id = req.params.id;
  const idx = appts.findIndex(a => a.id === id);
  if(idx === -1) return res.status(404).json({ error: 'No encontrado' });
  const removed = appts.splice(idx,1)[0];
  writeJSON(APPTS_FILE, appts);
  res.json(removed);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

