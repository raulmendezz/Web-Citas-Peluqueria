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

