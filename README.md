# MTV Schwabstedt Darts - Mitglieder-Website

Eine moderne, private Mitglieder-Website für den Dartverein "MTV Schwabstedt Darts" mit iOS 25-ähnlichem Design und den Vereinsfarben (dunkles Blau und sattes Gelb).

## 🎯 Features

### 🔐 Sicherheit
- Passwortschutz für den gesamten Mitgliederbereich
- JWT-basierte Authentifizierung
- Sichere Session-Verwaltung

### 📄 Downloads
- Spielbericht als PDF
- Aktuelle Getränkeliste als PDF und Word-Datei
- Direkte Download-Links zu wichtigen Dokumenten

### 🎯 Spielplan
- Spiele eintragen mit Datum, Uhrzeit, Gegner und Ort
- Teilnehmer aus aktiven Mitgliedern auswählen
- Spiele bearbeiten und löschen
- Automatische Sortierung nach Datum
- Externe Links zu Liga-Tabelle und Spielplan

### 👥 Mitgliederverwaltung
- Mitglieder hinzufügen, aktivieren/deaktivieren und löschen
- Statistiken (Gesamt, Aktiv, Inaktiv)
- Alphabetische Sortierung aktiver Mitglieder
- Inaktive Mitglieder am Ende der Liste

### 🍻 Getränke & Kasse
- Aktueller Kassenstand mit Einnahmen/Ausgaben
- Bearbeitbare Getränkepreise (Bier, Mischung, Kurze, Softdrinks, Redbull)
- Getränkeschulden pro Mitglied
- Einfache Getränkeerfassung mit +1 Buttons
- Schuldentilgung mit automatischer Kassenbuchung
- Kassenhistorie (letzte 50 Einträge) mit Löschfunktion

## 🛠️ Technologie-Stack

### Frontend
- **React 18** mit Vite
- **Tailwind CSS** für iOS-ähnliches Design
- **React Router** für Navigation
- **Axios** für API-Kommunikation
- **date-fns** für Datumsformatierung

### Backend
- **Node.js** mit Express.js
- **lowdb** für JSON-basierte Datenpersistenz
- **JWT** für Authentifizierung
- **Helmet** für Sicherheit
- **CORS** für Cross-Origin Requests

### Deployment
- **Render.com** optimiert
- **Monorepo**-Struktur
- **Umgebungsvariablen** für sensible Daten

## 🚀 Installation & Entwicklung

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn

### Lokale Entwicklung

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd mtv-schwabstedt-darts
   ```

2. **Dependencies installieren**
   ```bash
   npm run install:all
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

4. **Produktions-Build**
   ```bash
   npm run build
   ```

### Umgebungsvariablen

Erstelle eine `.env`-Datei im Root-Verzeichnis:

```env
NODE_ENV=development
PORT=3001
SITE_PASSWORD=FürDieFarbenBlauGelb
JWT_SECRET=your-secret-key-change-in-production
```

## 📱 Responsive Design

Die Website ist vollständig responsive und optimiert für:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

### Responsive Features
- **Sidebar:** Versteckt sich auf mobilen Geräten
- **Tabellen:** Scrollbar auf kleinen Bildschirmen
- **Formulare:** Stapeln sich vertikal auf Mobile
- **Buttons:** Angepasste Größen für Touch-Interfaces
- **Cards:** Flexible Layouts für verschiedene Bildschirmgrößen

## 🚀 Deployment auf Render.com

### Automatisches Deployment

1. **Repository auf GitHub pushen**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Render.com Service erstellen**
   - Verbinde dein GitHub Repository
   - Wähle "Web Service"
   - Build Command: `npm run install:all && npm run build`
   - Start Command: `npm start`

3. **Umgebungsvariablen setzen**
   - `NODE_ENV=production`
   - `PORT=10000`
   - `SITE_PASSWORD=FürDieFarbenBlauGelb`
   - `JWT_SECRET=<generiere-einen-sicheren-schlüssel>`

### Manuelles Deployment

Die `render.yaml`-Datei ist bereits konfiguriert für automatisches Deployment.

## 📁 Projektstruktur

```
mtv-schwabstedt-darts/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # Wiederverwendbare Komponenten
│   │   ├── pages/          # Seiten-Komponenten
│   │   ├── hooks/          # Custom React Hooks
│   │   └── utils/          # Hilfsfunktionen
│   ├── public/
│   │   ├── Logo/           # Vereinslogo
│   │   └── Listen/         # Download-Dateien
│   └── dist/               # Build-Ausgabe
├── backend/                 # Node.js Backend
│   ├── data/               # JSON-Datenbank
│   └── server.js           # Express-Server
├── package.json            # Monorepo-Konfiguration
├── render.yaml             # Render.com Deployment
└── README.md              # Diese Datei
```

## 🔧 Konfiguration

### Passwort ändern
Ändere die Umgebungsvariable `SITE_PASSWORD` oder bearbeite `backend/server.js`:

```javascript
const SITE_PASSWORD = process.env.SITE_PASSWORD || 'DeinNeuesPasswort';
```

### Getränkepreise anpassen
Die Standardpreise können in `backend/server.js` geändert werden:

```javascript
prices: {
  bier: 1.50,
  mischung: 2.50,
  kurze: 0.50,
  softdrinks: 1.00,
  redbull: 2.00
}
```

### Logo und Downloads
- Logo: `/Logo/Logo.png`
- Spielbericht: `/Listen/Spielbericht.pdf`
- Getränkeliste PDF: `/Listen/Liste_PDF.pdf`
- Getränkeliste Word: `/Listen/Liste_Word.docx`

## 🎨 Design-System

### Farben
- **Primär (Blau):** `#1e1b4b` - Navigation, Hintergründe
- **Sekundär (Gelb):** `#f59e0b` - Akzente, Buttons
- **Neutral:** Grautöne für Text und Hintergründe

### Typografie
- **Font:** -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- **Größen:** Responsive mit Tailwind CSS

### Komponenten
- **Buttons:** Abgerundete Ecken, Schatten, Hover-Effekte
- **Cards:** Weiße Hintergründe, subtile Schatten
- **Inputs:** Fokus-Ringe, sanfte Übergänge
- **Modals:** Overlay mit Backdrop-Blur

## 🔒 Sicherheit

- **HTTPS:** Wird von Render.com automatisch bereitgestellt
- **JWT:** Sichere Token-basierte Authentifizierung
- **Rate Limiting:** 100 Requests pro 15 Minuten
- **Helmet:** Sicherheits-Header
- **CORS:** Konfiguriert für Production

## 📊 Datenpersistenz

- **lowdb:** JSON-basierte Datenbank
- **Automatische Backups:** Durch Git-Versionierung
- **Datenstruktur:** Mitglieder, Spiele, Getränke, Kasse

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📄 Lizenz

Dieses Projekt ist für den MTV Schwabstedt Darts erstellt.

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues erstellen
- Dokumentation überprüfen
- Logs in Render.com Dashboard prüfen

---

**MTV Schwabstedt Darts** - Für die Farben Blau & Gelb! 🎯 