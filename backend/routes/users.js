
const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/search', (req, res) => {
  const { q } = req.query;
  db.all(`SELECT id, username FROM users WHERE username LIKE ?`, [`%${q}%`], (err, rows) => {
    res.json(rows);
  });
});

module.exports = router;
