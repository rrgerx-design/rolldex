import React, { useState, useRef } from 'react';
import { CompetitionEntry, MedalPlacement } from '../types';
import {
  Trophy,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Image,
  Upload,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  Camera
} from 'lucide-react';

interface CompetitionTrackerProps {
  competitions: CompetitionEntry[];
  onSaveCompetitions: (entries: CompetitionEntry[]) => void;
  showToast?: (message: string) => void;
}

export const CompetitionTracker: React.FC<CompetitionTrackerProps> = ({
  competitions,
  onSaveCompetitions,
  showToast
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states (all optional per user requirement)
  const [promotionName, setPromotionName] = useState<string>('');
  const [tournamentName, setTournamentName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [division, setDivision] = useState<string>('');
  const [medal, setMedal] = useState<MedalPlacement>('none');
  const [customPlacement, setCustomPlacement] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setPromotionName('');
    setTournamentName('');
    setCity('');
    setYear(new Date().getFullYear().toString());
    setDivision('');
    setMedal('none');
    setCustomPlacement('');
    setPhotoUrl('');
    setNotes('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleOpenNew = () => {
    resetForm();
    setIsFormOpen(true);
    setIsExpanded(true);
  };

  const handleEdit = (entry: CompetitionEntry) => {
    setEditingId(entry.id);
    setPromotionName(entry.promotionName || '');
    setTournamentName(entry.tournamentName || '');
    setCity(entry.city || '');
    setYear(entry.year ? entry.year.toString() : new Date().getFullYear().toString());
    setDivision(entry.division || '');
    setMedal(entry.medal || 'none');
    setCustomPlacement(entry.customPlacement || '');
    setPhotoUrl(entry.photoUrl || '');
    setNotes(entry.notes || '');
    setIsFormOpen(true);
    setIsExpanded(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this competition record?')) {
      const updated = competitions.filter((c) => c.id !== id);
      onSaveCompetitions(updated);
      showToast?.('Competition record deleted');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (under ~4MB)
    if (file.size > 4 * 1024 * 1024) {
      alert('Photo is larger than 4MB. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: CompetitionEntry = {
      id: editingId || `comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      promotionName: promotionName.trim() || undefined,
      tournamentName: tournamentName.trim() || undefined,
      city: city.trim() || undefined,
      year: year.trim() || undefined,
      division: division.trim() || undefined,
      medal,
      customPlacement: customPlacement.trim() || undefined,
      photoUrl: photoUrl || undefined,
      notes: notes.trim() || undefined,
      createdAt: editingId
        ? competitions.find((c) => c.id === editingId)?.createdAt || Date.now()
        : Date.now()
    };

    let updated: CompetitionEntry[];
    if (editingId) {
      updated = competitions.map((c) => (c.id === editingId ? newEntry : c));
      showToast?.('Competition record updated! 🥋🏆');
    } else {
      updated = [newEntry, ...competitions];
      showToast?.('New competition added to your record! 🥋🏆');
    }

    onSaveCompetitions(updated);
    resetForm();
  };

  const getMedalBadge = (medalType?: MedalPlacement, custom?: string) => {
    if (medalType === 'gold') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 shadow-sm border border-amber-300">
          🥇 Gold Medal (1st)
        </span>
      );
    }
    if (medalType === 'silver') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-slate-200 to-neutral-300 text-neutral-900 shadow-sm border border-slate-300">
          🥈 Silver Medal (2nd)
        </span>
      );
    }
    if (medalType === 'bronze') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-700 to-amber-600 text-amber-50 shadow-sm border border-amber-800">
          🥉 Bronze Medal (3rd)
        </span>
      );
    }
    if (custom) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800 border border-neutral-300">
          🎖️ {custom}
        </span>
      );
    }
    return null;
  };

  const goldCount = competitions.filter((c) => c.medal === 'gold').length;
  const silverCount = competitions.filter((c) => c.medal === 'silver').length;
  const bronzeCount = competitions.filter((c) => c.medal === 'bronze').length;

  return (
    <section className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden transition-all">
      {/* Header bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-bold tracking-tight text-white uppercase">
                Competition Record & Medals
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-800 text-amber-300 border border-neutral-700">
                Optional
              </span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              Track promotions, cities, podium finishes, tournament photos, and match notes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Medal Summary Pill */}
          {competitions.length > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-neutral-800/90 px-3 py-1.5 rounded-xl border border-neutral-700 text-xs font-bold">
              {goldCount > 0 && <span className="text-yellow-400">🥇 {goldCount}</span>}
              {silverCount > 0 && <span className="text-slate-300">🥈 {silverCount}</span>}
              {bronzeCount > 0 && <span className="text-amber-500">🥉 {bronzeCount}</span>}
              <span className="text-neutral-400 font-normal">({competitions.length} events)</span>
            </div>
          )}

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tournament</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-6 bg-neutral-50/40">
          {/* Add / Edit Form Modal/Drawer Inline */}
          {isFormOpen && (
            <form
              onSubmit={handleSubmit}
              className="bg-white border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 mb-6 shadow-md animate-in fade-in-50 duration-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-neutral-900 uppercase">
                    {editingId ? 'Edit Tournament Entry' : 'Add Competition Record'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-neutral-400 hover:text-neutral-600 p-1 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-4">
                {/* Promotion Name */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Promotion Name
                  </label>
                  <input
                    type="text"
                    value={promotionName}
                    onChange={(e) => setPromotionName(e.target.value)}
                    placeholder="e.g. IBJJF, Grappling Industries, NAGA, AJP, Fuji"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                </div>

                {/* Tournament Name */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Tournament Title
                  </label>
                  <input
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    placeholder="e.g. Austin Open, Pan Championship, State Finals"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                </div>

                {/* City / Location */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    City / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Austin, TX or Las Vegas, NV"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    />
                  </div>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Year
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g. 2026"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    />
                  </div>
                </div>

                {/* Division / Weight Class */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Division & Category
                  </label>
                  <input
                    type="text"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    placeholder="e.g. Adult Blue Belt / Middleweight / Gi"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                </div>

                {/* Medal Selection (1st, 2nd, 3rd, or None) */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Podium / Medal
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMedal('gold')}
                      className={`py-1.5 px-1 rounded-lg text-xs font-black border transition-all cursor-pointer text-center ${
                        medal === 'gold'
                          ? 'bg-amber-400 text-neutral-950 border-amber-500 shadow-sm'
                          : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      🥇 Gold (1st)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMedal('silver')}
                      className={`py-1.5 px-1 rounded-lg text-xs font-black border transition-all cursor-pointer text-center ${
                        medal === 'silver'
                          ? 'bg-slate-300 text-neutral-950 border-slate-400 shadow-sm'
                          : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      🥈 Silver (2nd)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMedal('bronze')}
                      className={`py-1.5 px-1 rounded-lg text-xs font-black border transition-all cursor-pointer text-center ${
                        medal === 'bronze'
                          ? 'bg-amber-700 text-white border-amber-800 shadow-sm'
                          : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      🥉 Bronze (3rd)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMedal('none')}
                      className={`py-1.5 px-1 rounded-lg text-xs font-medium border transition-all cursor-pointer text-center ${
                        medal === 'none'
                          ? 'bg-neutral-200 text-neutral-900 font-bold border-neutral-300'
                          : 'bg-white hover:bg-neutral-50 text-neutral-500 border-neutral-200'
                      }`}
                    >
                      None / Other
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Placement or Notes about standing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Custom Placement / Finish
                  </label>
                  <input
                    type="text"
                    value={customPlacement}
                    onChange={(e) => setCustomPlacement(e.target.value)}
                    placeholder="e.g. 4th Place, Quarterfinals, Absolute Runner-Up"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                </div>

                {/* Tournament Photo / Podium Picture */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Podium / Action Photo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-neutral-600" />
                      <span>{photoUrl ? 'Change Photo' : 'Upload Picture'}</span>
                    </button>

                    {photoUrl && (
                      <div className="flex items-center gap-2">
                        <img
                          src={photoUrl}
                          alt="Tournament thumbnail"
                          className="w-8 h-8 rounded-lg object-cover border border-neutral-300"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="text-[11px] text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tournament Notes & Lessons */}
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Match Notes & Lessons Learned
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your match results, points scored, submissions hit, what worked well, and adjustments for the next camp..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Update Record' : 'Save Tournament Entry'}</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Competitions */}
          {competitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitions.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 shadow-sm p-4 flex flex-col justify-between transition-all"
                >
                  <div>
                    {/* Top Row: Promotion & Year & Actions */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        {entry.promotionName && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-amber-300">
                            {entry.promotionName}
                          </span>
                        )}
                        <h4 className="font-display font-bold text-sm text-neutral-900 mt-1">
                          {entry.tournamentName || 'Tournament Event'}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Medal / Placement Badge */}
                    <div className="mb-2.5">
                      {getMedalBadge(entry.medal, entry.customPlacement) || (
                        <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                          Participant
                        </span>
                      )}
                    </div>

                    {/* Metadata chips: City, Year, Division */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-600 mb-3">
                      {entry.city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          {entry.city}
                        </span>
                      )}
                      {entry.year && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {entry.year}
                        </span>
                      )}
                      {entry.division && (
                        <span className="text-neutral-500 font-medium truncate max-w-[200px]" title={entry.division}>
                          • {entry.division}
                        </span>
                      )}
                    </div>

                    {/* Optional Photo */}
                    {entry.photoUrl && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-neutral-200">
                        <img
                          src={entry.photoUrl}
                          alt={entry.tournamentName || 'Competition Podium'}
                          className="w-full h-36 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Notes */}
                    {entry.notes && (
                      <div className="bg-neutral-50 rounded-lg p-2.5 text-xs text-neutral-700 border border-neutral-100 italic">
                        "{entry.notes}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-white rounded-xl border border-dashed border-neutral-300">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-neutral-800 uppercase mb-1">
                No Competitions Logged Yet
              </h4>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mb-4">
                Record your BJJ tournament appearances, promotions (IBJJF, NAGA, Grappling Industries), medals, photos, and match notes. All fields are completely optional.
              </p>
              <button
                onClick={handleOpenNew}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Competition</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
