import React, { useState } from 'react';
import axios from 'axios';

const BackupManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);

  const handleDownloadBackup = async () => {
    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/backup/download', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Erstelle Download-Link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extrahiere Dateinamen aus Response-Header oder verwende Standard
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'mtv-darts-backup.json';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setMessage('Backup erfolgreich heruntergeladen!');
    } catch (error) {
      console.error('Download-Fehler:', error);
      setError('Fehler beim Herunterladen des Backups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setMessage('');
    setError('');
    setValidationResult(null);
  };

  const handleValidateBackup = async () => {
    if (!selectedFile) {
      setError('Bitte wähle eine Backup-Datei aus');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      const fileContent = await readFileAsText(selectedFile);
      const backupData = JSON.parse(fileContent);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/backup/validate', 
        { backupData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setValidationResult(response.data);
      
      if (response.data.isValid) {
        setMessage('Backup-Datei ist gültig und kann wiederhergestellt werden');
      } else {
        setError('Backup-Datei ist ungültig: ' + response.data.errors.join(', '));
      }
    } catch (error) {
      console.error('Validierungs-Fehler:', error);
      setError('Fehler bei der Validierung der Backup-Datei');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedFile) {
      setError('Bitte wähle eine Backup-Datei aus');
      return;
    }

    if (!validationResult?.isValid) {
      setError('Bitte validiere die Backup-Datei zuerst');
      return;
    }

    if (!window.confirm('Möchtest du wirklich alle aktuellen Daten mit dem Backup überschreiben? Diese Aktion kann nicht rückgängig gemacht werden!')) {
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');
    
    try {
      const fileContent = await readFileAsText(selectedFile);
      const backupData = JSON.parse(fileContent);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/backup/upload', 
        { backupData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage('Backup erfolgreich wiederhergestellt! Die Seite wird neu geladen...');
      
      // Lade Seite neu nach 2 Sekunden
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Wiederherstellungs-Fehler:', error);
      setError('Fehler beim Wiederherstellen des Backups');
    } finally {
      setIsLoading(false);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Backup-Verwaltung</h2>
      
      {/* Download-Bereich */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Backup erstellen</h3>
        <p className="text-blue-700 mb-4">
          Erstelle eine Sicherungskopie aller Daten als JSON-Datei.
        </p>
        <button
          onClick={handleDownloadBackup}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {isLoading ? 'Erstelle Backup...' : 'Backup herunterladen'}
        </button>
      </div>

      {/* Upload-Bereich */}
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-3">Backup wiederherstellen</h3>
        <p className="text-green-700 mb-4">
          Stelle Daten aus einer Backup-Datei wieder her.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup-Datei auswählen
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-600">
              Ausgewählte Datei: {selectedFile.name}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleValidateBackup}
              disabled={!selectedFile || isLoading}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isLoading ? 'Validiere...' : 'Validieren'}
            </button>

            <button
              onClick={handleRestoreBackup}
              disabled={!selectedFile || !validationResult?.isValid || isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isLoading ? 'Stelle wieder her...' : 'Wiederherstellen'}
            </button>
          </div>
        </div>

        {/* Validierungsergebnis */}
        {validationResult && (
          <div className={`mt-4 p-3 rounded-lg ${
            validationResult.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <h4 className="font-semibold mb-2">Validierungsergebnis:</h4>
            <ul className="text-sm space-y-1">
              <li>Version: {validationResult.info.version}</li>
              <li>Erstellt: {validationResult.info.createdAt}</li>
              <li>Mitglieder: {validationResult.info.membersCount}</li>
              <li>Spiele: {validationResult.info.gamesCount}</li>
              <li>Getränkepreise: {validationResult.info.hasDrinksPrices ? '✓' : '✗'}</li>
              <li>Kassenstand: {validationResult.info.hasCashBalance ? '✓' : '✗'}</li>
            </ul>
            {validationResult.errors.length > 0 && (
              <div className="mt-2">
                <strong>Fehler:</strong>
                <ul className="list-disc list-inside">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nachrichten */}
      {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default BackupManager; 