import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function BackupManager() {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const downloadBackup = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/backup/download', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Download');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mtv-darts-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setMessage('Backup erfolgreich heruntergeladen!');
      setMessageType('success');
    } catch (error) {
      console.error('Download-Fehler:', error);
      setMessage('Fehler beim Herunterladen des Backups');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadBackup = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const fileContent = await file.text();
      const backupData = JSON.parse(fileContent);
      
      if (!backupData.data) {
        throw new Error('Ungültiges Backup-Format');
      }
      
      const response = await fetch('/api/backup/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data: backupData.data })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Upload');
      }
      
      const result = await response.json();
      setMessage(`Backup erfolgreich wiederhergestellt! ${result.stats.members} Mitglieder, ${result.stats.games} Spiele`);
      setMessageType('success');
      
      // Seite neu laden um die Daten zu aktualisieren
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Upload-Fehler:', error);
      setMessage(`Fehler beim Wiederherstellen: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-2xl">💾</span>
        <div>
          <div className="font-semibold">Daten-Backup</div>
          <div className="text-gray-500 text-sm">Sichern und Wiederherstellen aller Daten</div>
        </div>
      </div>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={downloadBackup}
          disabled={isLoading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Erstelle Backup...
            </>
          ) : (
            <>
              <span>📥</span>
              Backup erstellen
            </>
          )}
        </button>
        
        <label className="btn-secondary flex-1 flex items-center justify-center gap-2 cursor-pointer">
          <span>📤</span>
          Backup wiederherstellen
          <input
            type="file"
            accept=".json"
            onChange={uploadBackup}
            className="hidden"
            disabled={isLoading}
          />
        </label>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>• Backup enthält alle Mitglieder, Spiele, Getränke und Kassen-Daten</p>
        <p>• Vor der Wiederherstellung wird automatisch ein Backup der aktuellen Daten erstellt</p>
        <p>• Nach der Wiederherstellung wird die Seite automatisch neu geladen</p>
      </div>
    </div>
  );
} 