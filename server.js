const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const initSqlJs = require('sql.js');
 
const DB_PATH = path.join(__dirname, 'workout.sqlite');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
 
let db; // sql.js Database instance
 
/* ── Persist DB to disk after every write ── */
function save() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}
 
/* ── Helper: run a SELECT and return rows as objects ── */
function query(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}
 
/* ── Helper: run INSERT / UPDATE / DELETE ── */
function run(sql, params = []) {
  db.run(sql, params);
  save();
}
 
/* ── Boot: load or create DB ── */
initSqlJs().then(SQL => {
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }
 
  db.run(`
    CREATE TABLE IF NOT EXISTS exercises (
      id   TEXT PRIMARY KEY,
      day  TEXT NOT NULL,
      name TEXT NOT NULL,
      reps TEXT NOT NULL
    )
  `);
  save();
 
  app.listen(3000, () => {
    console.log('Workout Planner running on http://localhost:3000');
  });
});
 
/* ── GET all exercises (all days) ── */
app.get('/exercises', (req, res) => {
  try {
    const rows = query(`SELECT * FROM exercises ORDER BY day, rowid`);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
 
/* ── GET all exercises for a day ── */
app.get('/exercises/:day', (req, res) => {
  try {
    const rows = query(`SELECT * FROM exercises WHERE day = ? ORDER BY rowid`, [req.params.day]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
 
/* ── POST create exercise ── */
app.post('/exercises', (req, res) => {
  const { id, day, name, reps } = req.body;
  if (!id || !day || !name || !reps)
    return res.status(400).json({ error: 'Missing fields: id, day, name, reps are required' });
  try {
    run(`INSERT INTO exercises (id, day, name, reps) VALUES (?, ?, ?, ?)`, [id, day, name, reps]);
    res.status(201).json({ message: 'Exercise added', id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
 
/* ── PUT update exercise ── */
app.put('/exercises/:id', (req, res) => {
  const { name, reps } = req.body;
  if (!name || !reps)
    return res.status(400).json({ error: 'Missing fields: name and reps are required' });
  try {
    const before = query(`SELECT id FROM exercises WHERE id = ?`, [req.params.id]);
    if (before.length === 0) return res.status(404).json({ error: 'Exercise not found' });
    run(`UPDATE exercises SET name = ?, reps = ? WHERE id = ?`, [name, reps, req.params.id]);
    res.json({ message: 'Exercise updated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
 
/* ── DELETE exercise ── */
app.delete('/exercises/:id', (req, res) => {
  try {
    const before = query(`SELECT id FROM exercises WHERE id = ?`, [req.params.id]);
    if (before.length === 0) return res.status(404).json({ error: 'Exercise not found' });
    run(`DELETE FROM exercises WHERE id = ?`, [req.params.id]);
    res.json({ message: 'Exercise deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
