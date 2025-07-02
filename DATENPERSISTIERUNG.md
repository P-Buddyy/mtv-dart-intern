# Datenpersistierung für MTV Darts App

## Problem
Render.com hat ein ephemerales Dateisystem. Das bedeutet, dass alle Daten verloren gehen, wenn der Server neu gestartet wird oder in den Sleep-Modus geht.

## Lösung
Die App verwendet jetzt eine mehrstufige Persistierung:

### 1. Lokales Dateisystem (primär)
- Daten werden lokal in `backend/data/db.json` gespeichert
- Funktioniert nur, solange der Server läuft

### 2. JSONBin.io (empfohlen)
- Kostenloser JSON-Hosting-Service
- Bis zu 10.000 Requests pro Monat kostenlos
- Daten bleiben auch nach Server-Neustart erhalten

#### Setup JSONBin.io:
1. Gehe zu https://jsonbin.io
2. Registriere dich kostenlos
3. Erstelle einen API Key
4. Erstelle einen neuen Bin (wird automatisch eine ID generiert)
5. Kopiere API Key und Bin ID

### 3. GitHub Gist (Fallback)
- Als zusätzlicher Fallback
- Erfordert GitHub Token und Gist ID

## Konfiguration

### Für Render.com:
1. Gehe zu deinem Render.com Dashboard
2. Wähle deine App aus
3. Gehe zu "Environment"
4. Füge diese Umgebungsvariablen hinzu:

```
JSONBIN_API_KEY=dein-jsonbin-api-key
JSONBIN_BIN_ID=deine-bin-id
```

### Für lokale Entwicklung:
1. Kopiere `backend/env.example` zu `backend/.env`
2. Fülle die Werte aus

## Funktionsweise

### Beim Speichern:
1. Versucht lokales Dateisystem
2. Falls konfiguriert, speichert auch in JSONBin.io
3. Falls lokal fehlschlägt, speichert in GitHub Gist

### Beim Laden:
1. Versucht lokales Dateisystem
2. Falls nicht verfügbar, lädt von JSONBin.io
3. Falls nicht verfügbar, lädt von GitHub Gist
4. Falls nichts verfügbar, verwendet Standarddaten

## Vorteile
- ✅ Daten bleiben auch nach Server-Neustart erhalten
- ✅ Mehrere Fallback-Optionen
- ✅ Automatische Synchronisation
- ✅ Kostenlos (mit JSONBin.io)

## Nachteile
- ⚠️ Erfordert externe API-Keys
- ⚠️ Abhängig von externen Services

## Alternative Lösungen
Falls du keine externen Services nutzen möchtest:

1. **Upgrade auf Render.com Paid Plan** - Daten bleiben dann erhalten
2. **Andere Hosting-Anbieter** wie Railway, Heroku, DigitalOcean
3. **Echte Datenbank** wie MongoDB Atlas (kostenlos verfügbar) 