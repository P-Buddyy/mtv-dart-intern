import React from 'react';

const BackupPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Backup-Verwaltung</h1>
          <p className="text-gray-600 mt-2">
            Erstelle Sicherungskopien deiner Daten und stelle sie bei Bedarf wieder her.
          </p>
        </div>
        
        {/* Einfacher Test-Bereich */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Backup-Funktionalität</h2>
          
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
            <strong>✅ Backup-Seite ist erreichbar!</strong> 
          </div>
          
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Backup erstellen</h3>
            <p className="text-blue-700 mb-4">
              Erstelle eine Sicherungskopie aller Daten als JSON-Datei.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Backup herunterladen
            </button>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Backup wiederherstellen</h3>
            <p className="text-green-700 mb-4">
              Stelle Daten aus einer Backup-Datei wieder her.
            </p>
            <input
              type="file"
              accept=".json"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Wichtige Hinweise</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Erstelle regelmäßig Backups deiner Daten</li>
            <li>• Bewahre Backup-Dateien an einem sicheren Ort auf</li>
            <li>• Das Wiederherstellen überschreibt alle aktuellen Daten</li>
            <li>• Backup-Dateien enthalten alle Mitglieder, Spiele, Getränke und Kassendaten</li>
            <li>• Die Dateien sind im JSON-Format und können mit jedem Texteditor geöffnet werden</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BackupPage; 