const express = require('express');
const cors = require('cors');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;
const JWT_SECRET = 'super_secret_jwt_key_123'; // In production, use environment variables

// Middleware to parse JSON and URL-encoded bodies, with increased limit for base64 images
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Create a new report
app.post('/api/reports', (req, res) => {
  const { type, location, description, photoUrl, isUrgent } = req.body;

  if (!type || !location || !description) {
    return res.status(400).json({ error: 'Type, location, and description are required.' });
  }

  const sql = `INSERT INTO reports (type, location, description, photoUrl, isUrgent) VALUES (?, ?, ?, ?, ?)`;
  const params = [type, location, description, photoUrl || null, isUrgent ? 1 : 0];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Report created successfully.' });
  });
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- AUTH ENDPOINTS ---

app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    
    db.run(sql, [email, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      
      const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '24h' });
      res.status(201).json({ token, message: 'User created successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Login successful' });
  });
});

// --- REPORT ENDPOINTS ---

// Get all reports (Protected)
app.get('/api/reports', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM reports ORDER BY timestamp DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Update report status (Protected)
app.patch('/api/reports/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['New', 'Under Investigation', 'Resolved'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  const sql = `UPDATE reports SET status = ? WHERE id = ?`;
  db.run(sql, [status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Report not found.' });
    }
    res.json({ message: 'Status updated successfully.' });
  });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
