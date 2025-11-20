
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashed], function(err){
    if(err) return res.status(400).json({ error: 'Username taken' });
    res.json({ id: this.lastID, username });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
    if(!row) return res.status(400).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, row.password);
    if(!match) return res.status(400).json({ error: 'Wrong password' });
    res.json({ id: row.id, username: row.username });
  });
});

module.exports = router;
