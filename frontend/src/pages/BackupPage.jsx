import React from 'react';
import BackupManager from '../components/BackupManager';

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
        
        <BackupManager />
        
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