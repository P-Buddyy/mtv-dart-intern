import React from 'react';
import BackupManager from '../components/BackupManager';

export default function DownloadsPage() {
  return (
    <div className="max-w-2xl mx-auto py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-mtv-blue-800 mb-6 md:mb-8">Wichtige Dokumente</h1>
      <div className="list-mobile">
        <div className="card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl">📄</span>
              <div>
                <div className="font-semibold">Spielbericht</div>
                <div className="text-gray-500 text-sm">PDF-Download</div>
              </div>
            </div>
            <a
              href="/Listen/Spielbericht.pdf"
              download
              className="btn-primary w-full md:w-auto"
            >
              Herunterladen
            </a>
          </div>
        </div>
        <div className="card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🥤</span>
              <div>
                <div className="font-semibold">Aktuelle Getränkeliste</div>
                <div className="text-gray-500 text-sm">PDF & Word Download</div>
              </div>
            </div>
            <div className="mobile-nav w-full md:w-auto">
              <a
                href="/Listen/Liste_PDF.pdf"
                download
                className="btn-secondary"
              >
                PDF
              </a>
              <a
                href="/Listen/Liste_Word.docx"
                download
                className="btn-outline"
              >
                Word
              </a>
            </div>
          </div>
        </div>
        
        {/* Backup-Bereich */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💾 Backup-Verwaltung</h2>
          <p className="text-gray-600 mb-4">
            Erstelle Sicherungskopien aller Daten und stelle sie bei Bedarf wieder her.
          </p>
          <BackupManager />
        </div>
      </div>
    </div>
  );
} 