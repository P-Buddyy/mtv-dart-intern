const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

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

// Robuste Datenbank-Persistierung mit mehreren Fallbacks
const saveDB = () => {
  const dbData = JSON.stringify(db, null, 2);
  let saved = false;
  
  // 1. Lokales Dateisystem (primär)
  try {
    const dbPath = path.join(__dirname, 'data', 'db.json');
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Erstelle Backup vor dem Speichern
    if (fs.existsSync(dbPath)) {
      const backupPath = path.join(__dirname, 'data', `db.backup.${Date.now()}.json`);
      fs.copyFileSync(dbPath, backupPath);
      
      // Lösche alte Backups (behalte nur die letzten 5)
      const backupFiles = fs.readdirSync(dbDir)
        .filter(file => file.startsWith('db.backup.'))
        .sort()
        .reverse();
      
      if (backupFiles.length > 5) {
        backupFiles.slice(5).forEach(file => {
          fs.unlinkSync(path.join(dbDir, file));
        });
      }
    }
    
    fs.writeFileSync(dbPath, dbData);
    console.log(`Datenbank lokal gespeichert: ${dbPath}`);
    saved = true;
  } catch (error) {
    console.error('Fehler beim lokalen Speichern:', error.message);
  }
  
  // 2. Externe Persistierung über JSONBin.io (Fallback)
  if (process.env.JSONBIN_API_KEY) {
    try {
      const jsonbinUrl = 'https://api.jsonbin.io/v3/b';
      const binId = process.env.JSONBIN_BIN_ID || 'default';
      
      const postData = JSON.stringify({
        members: db.members,
        games: db.games,
        drinks: db.drinks,
        cash: db.cash,
        lastUpdated: new Date().toISOString()
      });
      
      const options = {
        hostname: 'api.jsonbin.io',
        port: 443,
        path: `/v3/b/${binId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': process.env.JSONBIN_API_KEY,
          'X-Bin-Name': 'MTV-Darts-Datenbank'
        }
      };
      
      const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
          console.log('Datenbank extern gespeichert (JSONBin.io)');
          saved = true;
        } else {
          console.error('JSONBin.io Fehler:', res.statusCode);
        }
      });
      
      req.on('error', (error) => {
        console.error('JSONBin.io Request Fehler:', error.message);
      });
      
      req.write(postData);
      req.end();
    } catch (error) {
      console.error('Fehler bei externer Persistierung:', error.message);
    }
  }
  
  // 3. GitHub Gist als letzter Fallback (falls konfiguriert)
  if (process.env.GITHUB_TOKEN && !saved) {
    try {
      const gistId = process.env.GITHUB_GIST_ID;
      if (gistId) {
        const gistData = {
          files: {
            'mtv-darts-db.json': {
              content: dbData
            }
          }
        };
        
        const options = {
          hostname: 'api.github.com',
          port: 443,
          path: `/gists/${gistId}`,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'User-Agent': 'MTV-Darts-App'
          }
        };
        
        const req = https.request(options, (res) => {
          if (res.statusCode === 200) {
            console.log('Datenbank in GitHub Gist gespeichert');
            saved = true;
          } else {
            console.error('GitHub Gist Fehler:', res.statusCode);
          }
        });
        
        req.on('error', (error) => {
          console.error('GitHub Gist Request Fehler:', error.message);
        });
        
        req.write(JSON.stringify(gistData));
        req.end();
      }
    } catch (error) {
      console.error('Fehler bei GitHub Gist Persistierung:', error.message);
    }
  }
  
  if (!saved) {
    console.error('WARNUNG: Datenbank konnte nirgendwo gespeichert werden!');
  }
};

const loadDB = () => {
  let loaded = false;
  
  // 1. Versuche lokales Dateisystem
  const dbPath = path.join(__dirname, 'data', 'db.json');
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      console.log(`Datenbank lokal geladen: ${dbPath}`);
      loaded = true;
    } catch (error) {
      console.log('Fehler beim Laden der lokalen Datenbank:', error.message);
    }
  }
  
  // 2. Falls lokal nicht verfügbar, versuche JSONBin.io
  if (!loaded && process.env.JSONBIN_API_KEY) {
    try {
      const binId = process.env.JSONBIN_BIN_ID || 'default';
      const options = {
        hostname: 'api.jsonbin.io',
        port: 443,
        path: `/v3/b/${binId}/latest`,
        method: 'GET',
        headers: {
          'X-Master-Key': process.env.JSONBIN_API_KEY
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.record) {
              db = response.record;
              console.log('Datenbank von JSONBin.io geladen');
              loaded = true;
            }
          } catch (error) {
            console.error('Fehler beim Parsen der JSONBin.io Antwort:', error.message);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('JSONBin.io Request Fehler:', error.message);
      });
      
      req.end();
    } catch (error) {
      console.error('Fehler beim Laden von JSONBin.io:', error.message);
    }
  }
  
  // 3. Falls immer noch nicht verfügbar, versuche GitHub Gist
  if (!loaded && process.env.GITHUB_TOKEN && process.env.GITHUB_GIST_ID) {
    try {
      const gistId = process.env.GITHUB_GIST_ID;
      const options = {
        hostname: 'api.github.com',
        port: 443,
        path: `/gists/${gistId}`,
        method: 'GET',
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'User-Agent': 'MTV-Darts-App'
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.files && response.files['mtv-darts-db.json']) {
              db = JSON.parse(response.files['mtv-darts-db.json'].content);
              console.log('Datenbank von GitHub Gist geladen');
              loaded = true;
            }
          } catch (error) {
            console.error('Fehler beim Parsen der GitHub Gist Antwort:', error.message);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('GitHub Gist Request Fehler:', error.message);
      });
      
      req.end();
    } catch (error) {
      console.error('Fehler beim Laden von GitHub Gist:', error.message);
    }
  }
  
  if (!loaded) {
    console.log('Keine Datenbank gefunden, verwende Standarddaten');
  }
};

// Lade Datenbank beim Start
loadDB();

// Automatische Datenbank-Persistierung
let saveInterval;
let isShuttingDown = false;

// Periodisches Speichern alle 5 Minuten
const startAutoSave = () => {
  saveInterval = setInterval(() => {
    if (!isShuttingDown) {
      console.log('Automatisches Speichern der Datenbank...');
      saveDB();
    }
  }, 5 * 60 * 1000); // 5 Minuten
};

// Speichern beim Beenden
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} empfangen. Beende Server...`);
  isShuttingDown = true;
  
  if (saveInterval) {
    clearInterval(saveInterval);
  }
  
  console.log('Speichere Datenbank vor dem Beenden...');
  saveDB();
  
  process.exit(0);
};

// Event-Listener für verschiedene Beendigungssignale
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Für nodemon

// Starte automatisches Speichern
startAutoSave();

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

// Backup Route (nur für Admin)
app.post('/api/backup', authenticateToken, (req, res) => {
  try {
    saveDB();
    res.json({ message: 'Backup erfolgreich erstellt' });
  } catch (error) {
    console.error('Backup-Fehler:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Backups' });
  }
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
  const { date, time, opponent, location, participants, result } = req.body;
  
  const game = db.games.find(g => g.id === parseInt(id));
  if (!game) {
    return res.status(404).json({ error: 'Spiel nicht gefunden' });
  }

  Object.assign(game, {
    date,
    time,
    opponent,
    location,
    participants: participants || [],
    result: result || game.result
  });
  saveDB();
  
  res.json({ message: 'Spiel aktualisiert' });
});

app.put('/api/games/:id/result', (req, res) => {
  const { id } = req.params;
  const { result } = req.body;
  
  const game = db.games.find(g => g.id === parseInt(id));
  if (!game) {
    return res.status(404).json({ error: 'Spiel nicht gefunden' });
  }

  game.result = result;
  saveDB();
  
  res.json({ message: 'Ergebnis aktualisiert' });
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