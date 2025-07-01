const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Umgebungsvariablen laden
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const SITE_PASSWORD = process.env.SITE_PASSWORD || 'FürDieFarbenBlauGelb';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Einfache In-Memory-Datenbank
let db = {
  members: [
    { id: 1, name: 'Max Mustermann', status: 'active' },
    { id: 2, name: 'Anna Schmidt', status: 'active' }
  ],
  games: [],
  drinks: {
    prices: {
      bier: 1.50,
      mischung: 2.50,
      kurze: 0.50,
      softdrinks: 1.00,
      redbull: 2.00
    },
    debts: {}
  },
  cash: {
    balance: 0,
    history: []
  }
};

// Datenbank-Funktionen
const saveDB = () => {
  const dbPath = path.join(__dirname, 'data', 'db.json');
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
};

const loadDB = () => {
  const dbPath = path.join(__dirname, 'data', 'db.json');
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (error) {
      console.log('Fehler beim Laden der Datenbank, verwende Standarddaten');
    }
  }
};

// Lade Datenbank beim Start
loadDB();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://unpkg.com", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : true,
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100 // max 100 Requests pro IP
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// Serve frontend files directly from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/src')));

// Set MIME types for JSX files
app.use((req, res, next) => {
  if (req.url.endsWith('.jsx')) {
    res.setHeader('Content-Type', 'text/babel');
  }
  next();
});

// JWT Middleware für geschützte Routen
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Zugriff verweigert' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token ungültig' });
    }
    req.user = user;
    next();
  });
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Login Route
app.post('/api/login', (req, res) => {
  try {
    const { password } = req.body;
    console.log('Login attempt with password:', password);
    console.log('Expected password:', SITE_PASSWORD);

    if (password === SITE_PASSWORD) {
      const token = jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, message: 'Login erfolgreich' });
    } else {
      res.status(401).json({ error: 'Falsches Passwort' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server-Fehler beim Login' });
  }
});

// Geschützte API-Routen
app.use('/api/', authenticateToken);

// Mitglieder-Routen
app.get('/api/members', (req, res) => {
  const members = db.members;
  const activeMembers = members.filter(m => m.status === 'active');
  const inactiveMembers = members.filter(m => m.status === 'inactive');
  
  res.json({
    members,
    stats: {
      total: members.length,
      active: activeMembers.length,
      inactive: inactiveMembers.length
    }
  });
});

app.post('/api/members', (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name ist erforderlich' });
  }

  const newId = Math.max(...db.members.map(m => m.id), 0) + 1;
  const newMember = { id: newId, name: name.trim(), status: 'active' };
  
  db.members.push(newMember);
  saveDB();
  res.json(newMember);
});

app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const member = db.members.find(m => m.id === parseInt(id));
  if (!member) {
    return res.status(404).json({ error: 'Mitglied nicht gefunden' });
  }

  member.status = status;
  saveDB();
  res.json({ message: 'Status aktualisiert' });
});

app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  
  db.members = db.members.filter(m => m.id !== parseInt(id));
  delete db.drinks.debts[id];
  saveDB();
  
  res.json({ message: 'Mitglied gelöscht' });
});

// Spiele-Routen
app.get('/api/games', (req, res) => {
  const games = db.games.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json(games);
});

app.post('/api/games', (req, res) => {
  const { date, time, opponent, location, participants } = req.body;
  
  if (!date || !time || !opponent || !location) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
  }

  const newId = Math.max(...db.games.map(g => g.id), 0) + 1;
  const newGame = {
    id: newId,
    date,
    time,
    opponent,
    location,
    participants: participants || [],
    createdAt: new Date().toISOString()
  };
  
  db.games.push(newGame);
  saveDB();
  res.json(newGame);
});

app.put('/api/games/:id', (req, res) => {
  const { id } = req.params;
  const { date, time, opponent, location, participants } = req.body;
  
  const game = db.games.find(g => g.id === parseInt(id));
  if (!game) {
    return res.status(404).json({ error: 'Spiel nicht gefunden' });
  }

  Object.assign(game, {
    date,
    time,
    opponent,
    location,
    participants: participants || []
  });
  saveDB();
  
  res.json({ message: 'Spiel aktualisiert' });
});

app.delete('/api/games/:id', (req, res) => {
  const { id } = req.params;
  
  db.games = db.games.filter(g => g.id !== parseInt(id));
  saveDB();
  res.json({ message: 'Spiel gelöscht' });
});

// Getränke-Routen
app.get('/api/drinks', (req, res) => {
  const drinks = db.drinks;
  const members = db.members.filter(m => m.status === 'active');
  
  const membersWithDebts = members.map(member => ({
    ...member,
    debts: drinks.debts[member.id] || 0
  }));
  
  res.json({
    prices: drinks.prices,
    members: membersWithDebts
  });
});

app.put('/api/drinks/prices', (req, res) => {
  const { prices } = req.body;
  
  db.drinks.prices = prices;
  saveDB();
  res.json({ message: 'Preise aktualisiert' });
});

app.post('/api/drinks/add', (req, res) => {
  const { memberId, drinks } = req.body;
  
  const prices = db.drinks.prices;
  
  let totalCost = 0;
  Object.keys(drinks).forEach(drinkType => {
    if (prices[drinkType] && drinks[drinkType] > 0) {
      totalCost += prices[drinkType] * drinks[drinkType];
    }
  });
  
  const newDebts = (db.drinks.debts[memberId] || 0) + totalCost;
  db.drinks.debts[memberId] = newDebts;
  saveDB();
  
  res.json({ message: 'Getränke hinzugefügt', newDebts });
});

app.post('/api/drinks/pay', (req, res) => {
  const { memberId, amount } = req.body;
  
  const member = db.members.find(m => m.id === parseInt(memberId));
  if (!member) {
    return res.status(404).json({ error: 'Mitglied nicht gefunden' });
  }
  
  const newDebts = (db.drinks.debts[memberId] || 0) - parseFloat(amount);
  db.drinks.debts[memberId] = newDebts;
  
  const newBalance = db.cash.balance + parseFloat(amount);
  const newHistory = [
    {
      id: Math.max(...db.cash.history.map(h => h.id), 0) + 1,
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      description: `${member.name} hat ${amount}€ seiner Schulden bezahlt`,
      type: 'income'
    },
    ...db.cash.history.slice(0, 49)
  ];
  
  db.cash = { balance: newBalance, history: newHistory };
  saveDB();
  
  res.json({ message: 'Zahlung verarbeitet', newDebts, newBalance });
});

// Kasse-Routen
app.get('/api/cash', (req, res) => {
  res.json(db.cash);
});

app.post('/api/cash/transaction', (req, res) => {
  const { amount, description, type } = req.body;
  
  const newBalance = type === 'income' ? db.cash.balance + parseFloat(amount) : db.cash.balance - parseFloat(amount);
  const newHistory = [
    {
      id: Math.max(...db.cash.history.map(h => h.id), 0) + 1,
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      description,
      type
    },
    ...db.cash.history.slice(0, 49)
  ];
  
  db.cash = { balance: newBalance, history: newHistory };
  saveDB();
  
  res.json({ message: 'Transaktion hinzugefügt', newBalance });
});

app.delete('/api/cash/history', (req, res) => {
  db.cash.history = [];
  saveDB();
  res.json({ message: 'Kassenhistorie gelöscht' });
});

// Fallback für alle Frontend-Routen - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Etwas ist schiefgelaufen!' });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`Umgebung: ${process.env.NODE_ENV || 'development'}`);
}); 