import React, { useState } from 'react';
import { BjjLogEntry } from '../types';
import { X, Download, Upload, Check, AlertCircle, FileText, RefreshCw } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: BjjLogEntry[];
  onImportLogs: (newLogs: BjjLogEntry[]) => void;
  onResetToDefault: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  logs,
  onImportLogs,
  onResetToDefault
}) => {
  const [importText, setImportText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bjj-drill-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage({ type: 'success', text: 'Downloaded JSON backup file successfully!' });
  };

  const handleDownloadCSV = () => {
    // Generate CSV
    const headers = ['Class Number', 'Date', 'Gear', 'Coach', 'Drill 1', 'Drill 2', 'Drill 3', 'Drill 4', 'Drill 5', 'Submissions Got', 'Submissions Defended', 'Sparring Notes', 'Personal Notes'];
    const rows = logs.map((l) => [
      `"${l.classNumber}"`,
      `"${l.date}"`,
      `"${l.gear}"`,
      `"${l.coach.replace(/"/g, '""')}"`,
      `"${(l.drills[0] || '').replace(/"/g, '""')}"`,
      `"${(l.drills[1] || '').replace(/"/g, '""')}"`,
      `"${(l.drills[2] || '').replace(/"/g, '""')}"`,
      `"${(l.drills[3] || '').replace(/"/g, '""')}"`,
      `"${(l.drills[4] || '').replace(/"/g, '""')}"`,
      `"${(l.submissionsGot || '').replace(/"/g, '""')}"`,
      `"${(l.submissionsDefended || '').replace(/"/g, '""')}"`,
      `"${(l.sparringNotes || '').replace(/"/g, '""')}"`,
      `"${(l.personalNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `bjj-drill-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage({ type: 'success', text: 'Downloaded CSV file successfully!' });
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(importText.trim());
      if (!Array.isArray(parsed)) {
        throw new Error('Import data must be a JSON array of log entries.');
      }
      onImportLogs(parsed);
      setStatusMessage({ type: 'success', text: `Imported ${parsed.length} class logs successfully!` });
      setImportText('');
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Invalid JSON format. Please check your data.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
          throw new Error('Uploaded JSON is not a valid list of logs.');
        }
        onImportLogs(parsed);
        setStatusMessage({ type: 'success', text: `Uploaded and restored ${parsed.length} logs successfully!` });
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: 'Failed to parse uploaded file: ' + err.message });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-neutral-900" />
            <h3 className="font-display text-base font-bold uppercase text-neutral-900">
              Backup, Export & Restore Logs
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-neutral-700">
          {statusMessage && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 font-medium ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Export Section */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 uppercase text-[11px]">
              Export Your Journal Data ({logs.length} entries)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadJSON}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 font-semibold text-neutral-800 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 font-semibold text-neutral-800 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export CSV Spreadsheet</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <h4 className="font-bold text-neutral-900 uppercase text-[11px]">
              Restore / Import Logs
            </h4>
            <label className="block p-3 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50/50 cursor-pointer text-center">
              <Upload className="w-4 h-4 mx-auto text-neutral-500 mb-1" />
              <span className="font-semibold text-neutral-800">Click to upload backup .json file</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <textarea
              rows={3}
              placeholder="Or paste JSON array of logs here..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full p-2 rounded-lg border border-neutral-200 font-mono text-[11px]"
            />
            {importText && (
              <button
                onClick={handleImportJSON}
                className="w-full py-2 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Apply Imported JSON
              </button>
            )}
          </div>

          {/* Reset Demo Data */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-neutral-900">Load Sample Logs</p>
              <p className="text-[10px] text-neutral-500">Restore default demo BJJ training logs</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset logs to sample BJJ entries?')) {
                  onResetToDefault();
                  setStatusMessage({ type: 'success', text: 'Restored sample BJJ logs.' });
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Samples</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
