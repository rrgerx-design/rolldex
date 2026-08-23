import React from 'react';
import { BjjLogEntry } from '../types';
import { X, Printer, Shield, Calendar, Hash, User, Flame, ShieldAlert, Award } from 'lucide-react';
import { ByteChokeLogo } from './ByteChokeLogo';

interface PrintModalProps {
  log: BjjLogEntry | null;
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ log, onClose }) => {
  if (!log) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden my-6">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="no-print bg-neutral-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ByteChokeLogo size="sm" />
            <span className="text-xs font-bold uppercase tracking-wider font-display">
              ByteChoke Drill Sheet • Class #{log.classNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Drill Sheet Container */}
        <div className="p-6 sm:p-8 bg-white text-neutral-900 border-b border-neutral-200">
          {/* Header Dojo Crest */}
          <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <ByteChokeLogo size="lg" />
              <div>
                <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900">
                  ByteChoke • Mat Drill Log
                </h1>
                <p className="text-xs text-neutral-500 font-medium tracking-widest uppercase">
                  Official BJJ Training & Mat Session Record
                </p>
              </div>
            </div>
            <div className="border-2 border-neutral-900 px-3 py-1 text-center rounded">
              <span className="text-[10px] font-bold block uppercase text-neutral-500">
                Class Number
              </span>
              <span className="font-display text-xl font-bold text-neutral-900">
                #{log.classNumber}
              </span>
            </div>
          </div>

          {/* Lines 1 & 2 Grid */}
          <div className="grid grid-cols-2 gap-4 pb-4 mb-4 border-b border-neutral-200 text-xs">
            <div className="border-l-2 border-neutral-900 pl-3">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                Session Date
              </span>
              <span className="font-bold text-neutral-900 text-sm">{formatDate(log.date)}</span>
            </div>

            <div className="border-l-2 border-neutral-900 pl-3">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                Class Format & Attire
              </span>
              <span className="font-bold text-neutral-900 text-sm">
                {log.gear === 'Gi' ? '🥋 Gi Class' : log.gear === 'No-Gi' ? '🩳 No-Gi Class' : '⏳ Open Mat'}
              </span>
            </div>

            <div className="border-l-2 border-neutral-900 pl-3 col-span-2">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                Coach of the Day / Professor
              </span>
              <span className="font-bold text-neutral-900 text-sm">{log.coach || 'General Instruction'}</span>
            </div>
          </div>

          {/* 5 DRILLS OF THE DAY TABLE */}
          <div className="mb-5">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 pb-1 border-b border-neutral-300">
              5 Drills & Techniques of the Day
            </h2>

            <div className="space-y-2">
              {log.drills.map((drill, idx) => {
                const cue = log.drillDetails?.[idx]?.keyDetails;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50"
                  >
                    <span className="w-5 h-5 rounded bg-neutral-900 text-amber-300 text-xs font-display font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-neutral-900">
                        {drill && drill.trim().length > 0 ? drill : `(No drill logged for line ${idx + 1})`}
                      </p>
                      {cue && (
                        <p className="text-[11px] text-neutral-600 mt-0.5 font-medium">
                          Key Cue: {cue}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SUBMISSIONS & EXTRAS */}
          <div className="space-y-3 pt-3 border-t border-neutral-200 text-xs">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
              Personal Notes, Sparring & Submissions
            </h2>

            {/* Subs Landed */}
            <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
              <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-0.5">
                Submissions Landed (Got):
              </span>
              <p className="font-medium text-neutral-900">
                {log.submissionsGot || 'None recorded'}
              </p>
            </div>

            {/* Subs Defended */}
            {log.submissionsDefended && (
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-0.5">
                  Submissions Caught In / Defensive Focus:
                </span>
                <p className="font-medium text-neutral-900">{log.submissionsDefended}</p>
              </div>
            )}

            {/* Sparring Notes */}
            {log.sparringNotes && (
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-0.5">
                  Sparring Rounds:
                </span>
                <p className="font-medium text-neutral-900">{log.sparringNotes}</p>
              </div>
            )}

            {/* Tagged Training & Sparring Partners */}
            {(log.taggedTeammates && log.taggedTeammates.length > 0 || log.taggedPartners && log.taggedPartners.length > 0) && (
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">
                  Training & Sparring Partners ({log.taggedTeammates?.length || log.taggedPartners?.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(log.taggedTeammates || log.taggedPartners?.map(p => ({ name: p })) || []).map((t, idx) => (
                    <span key={idx} className="bg-white border border-neutral-300 rounded px-2 py-0.5 text-xs font-semibold text-neutral-800">
                      👥 {t.name} {t.beltRank ? `(${t.beltRank})` : ''} {t.sparred ? '• Sparred' : ''} {t.drilledWith ? '• Drilled' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube Drill & Sparring Video Links */}
            {log.youtubeVideos && log.youtubeVideos.length > 0 && (
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">
                  YouTube Video Visuals & Technique References ({log.youtubeVideos.length}):
                </span>
                <ul className="space-y-1">
                  {log.youtubeVideos.map((vid, vIdx) => (
                    <li key={vIdx} className="text-xs text-neutral-800 flex items-center justify-between gap-2">
                      <span className="font-semibold">
                        📹 {vid.title || 'Video Visual'} {vid.drillNumber ? `(Drill #${vid.drillNumber})` : ''}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono underline truncate max-w-xs">
                        {vid.url}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Personal Takeaways */}
            {log.personalNotes && (
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-0.5">
                  Personal Takeaways & Notes:
                </span>
                <p className="font-medium text-neutral-900 whitespace-pre-wrap">{log.personalNotes}</p>
              </div>
            )}

            {/* Attached Photos */}
            {log.photos && log.photos.length > 0 && (
              <div className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50">
                <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-1.5">
                  Attached Mat Photos / Whiteboard ({log.photos.length}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {log.photos.map((photo, i) => (
                    <div key={i} className="aspect-4/3 rounded-md overflow-hidden border border-neutral-300">
                      <img src={photo} alt={`Mat attachment ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Mat Philosophy */}
          <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-neutral-400 font-medium">
            <span>RollDex • 100% Free BJJ Training Log & Journal</span>
            <span>"A black belt is a white belt who never quit." • OSS 🥋</span>
          </div>
        </div>
      </div>
    </div>
  );
};
