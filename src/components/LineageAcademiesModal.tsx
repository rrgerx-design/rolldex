import React, { useState } from 'react';
import {
  Building2,
  GitBranch,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Sparkles,
  MapPin,
  User,
  Calendar,
  Award,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Star,
  Info
} from 'lucide-react';
import {
  AcademyRecord,
  LineageChain,
  LineageAndAcademiesData
} from '../types';
import { LINEAGE_PRESETS } from '../data/defaultLineage';

interface LineageAcademiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LineageAndAcademiesData;
  onSaveData: (updated: LineageAndAcademiesData) => void;
}

export const LineageAcademiesModal: React.FC<LineageAcademiesModalProps> = ({
  isOpen,
  onClose,
  data,
  onSaveData
}) => {
  const [activeTab, setActiveTab] = useState<'academies' | 'lineages'>('academies');

  // Academy state
  const [academies, setAcademies] = useState<AcademyRecord[]>(data.academies || []);
  const [isAddingAcademy, setIsAddingAcademy] = useState(false);
  const [editingAcademyId, setEditingAcademyId] = useState<string | null>(null);

  // Form fields for Academy
  const [acadName, setAcadName] = useState('');
  const [acadIsCurrent, setAcadIsCurrent] = useState(true);
  const [acadInstructor, setAcadInstructor] = useState('');
  const [acadLocation, setAcadLocation] = useState('');
  const [acadStartYear, setAcadStartYear] = useState('');
  const [acadEndYear, setAcadEndYear] = useState('');
  const [acadRank, setAcadRank] = useState('');
  const [acadNotes, setAcadNotes] = useState('');

  // Lineage state
  const [lineages, setLineages] = useState<LineageChain[]>(data.lineages || []);
  const [selectedLineageId, setSelectedLineageId] = useState<string>(
    data.lineages?.[0]?.id || 'lin-1'
  );
  const [newProfessorName, setNewProfessorName] = useState('');
  const [newLineageTitle, setNewLineageTitle] = useState('');
  const [isCreatingLineage, setIsCreatingLineage] = useState(false);

  if (!isOpen) return null;

  // Academy CRUD
  const resetAcademyForm = () => {
    setAcadName('');
    setAcadIsCurrent(false);
    setAcadInstructor('');
    setAcadLocation('');
    setAcadStartYear('');
    setAcadEndYear('');
    setAcadRank('');
    setAcadNotes('');
    setEditingAcademyId(null);
    setIsAddingAcademy(false);
  };

  const handleEditAcademy = (acad: AcademyRecord) => {
    setEditingAcademyId(acad.id);
    setAcadName(acad.name);
    setAcadIsCurrent(acad.isCurrent);
    setAcadInstructor(acad.headInstructor || '');
    setAcadLocation(acad.location || '');
    setAcadStartYear(acad.startYear || '');
    setAcadEndYear(acad.endYear || '');
    setAcadRank(acad.rankAchieved || '');
    setAcadNotes(acad.notes || '');
    setIsAddingAcademy(true);
  };

  const handleSaveAcademy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acadName.trim()) return;

    let updatedAcademies: AcademyRecord[];

    if (editingAcademyId) {
      updatedAcademies = academies.map((a) => {
        if (a.id === editingAcademyId) {
          return {
            ...a,
            name: acadName.trim(),
            isCurrent: acadIsCurrent,
            headInstructor: acadInstructor.trim(),
            location: acadLocation.trim(),
            startYear: acadStartYear.trim(),
            endYear: acadIsCurrent ? undefined : acadEndYear.trim(),
            rankAchieved: acadRank.trim(),
            notes: acadNotes.trim()
          };
        }
        // If marked as current, ensure other single current flags behave cleanly
        if (acadIsCurrent && a.isCurrent) {
          return { ...a, isCurrent: false };
        }
        return a;
      });
    } else {
      const newAcademy: AcademyRecord = {
        id: `acad-${Date.now()}`,
        name: acadName.trim(),
        isCurrent: acadIsCurrent,
        headInstructor: acadInstructor.trim(),
        location: acadLocation.trim(),
        startYear: acadStartYear.trim(),
        endYear: acadIsCurrent ? undefined : acadEndYear.trim(),
        rankAchieved: acadRank.trim(),
        notes: acadNotes.trim()
      };

      if (acadIsCurrent) {
        updatedAcademies = academies.map((a) => ({ ...a, isCurrent: false }));
        updatedAcademies.unshift(newAcademy);
      } else {
        updatedAcademies = [...academies, newAcademy];
      }
    }

    setAcademies(updatedAcademies);
    resetAcademyForm();
  };

  const handleDeleteAcademy = (id: string) => {
    if (window.confirm('Remove this academy from your history?')) {
      setAcademies(academies.filter((a) => a.id !== id));
      if (editingAcademyId === id) resetAcademyForm();
    }
  };

  const handleSetPrimaryAcademy = (id: string) => {
    const updated = academies.map((a) => ({
      ...a,
      isCurrent: a.id === id
    }));
    setAcademies(updated);
  };

  // Lineage management
  const currentLineage =
    lineages.find((l) => l.id === selectedLineageId) || lineages[0];

  const handleAddProfessorToCurrentLineage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfessorName.trim() || !currentLineage) return;

    const updatedProfessors = [...currentLineage.professors, newProfessorName.trim()];
    const updatedLineages = lineages.map((l) =>
      l.id === currentLineage.id ? { ...l, professors: updatedProfessors } : l
    );

    setLineages(updatedLineages);
    setNewProfessorName('');
  };

  const handleRemoveProfessor = (index: number) => {
    if (!currentLineage) return;
    const updatedProfessors = currentLineage.professors.filter((_, i) => i !== index);
    const updatedLineages = lineages.map((l) =>
      l.id === currentLineage.id ? { ...l, professors: updatedProfessors } : l
    );
    setLineages(updatedLineages);
  };

  const handleApplyLineagePreset = (presetChain: LineageChain) => {
    const newId = `lin-preset-${Date.now()}`;
    const newChain: LineageChain = {
      ...presetChain,
      id: newId,
      isPrimary: lineages.length === 0
    };
    setLineages([...lineages, newChain]);
    setSelectedLineageId(newId);
  };

  const handleCreateNewLineage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLineageTitle.trim()) return;

    const newChain: LineageChain = {
      id: `lin-${Date.now()}`,
      title: newLineageTitle.trim(),
      isPrimary: lineages.length === 0,
      professors: ['Mitsuyo Maeda', 'Carlos Gracie Sr.', 'Your Professor', 'You'],
      notes: ''
    };

    setLineages([...lineages, newChain]);
    setSelectedLineageId(newChain.id);
    setNewLineageTitle('');
    setIsCreatingLineage(false);
  };

  const handleDeleteLineage = (id: string) => {
    if (lineages.length <= 1) {
      alert('You must keep at least one lineage record.');
      return;
    }
    if (window.confirm('Delete this lineage tree?')) {
      const remaining = lineages.filter((l) => l.id !== id);
      setLineages(remaining);
      setSelectedLineageId(remaining[0].id);
    }
  };

  const handleSaveAndClose = () => {
    const updated: LineageAndAcademiesData = {
      academies,
      lineages,
      updatedAt: Date.now()
    };
    onSaveData(updated);
    onClose();
  };

  const currentHomeGym = academies.find((a) => a.isCurrent);
  const pastGyms = academies.filter((a) => !a.isCurrent);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="modal-lineage-academies"
        className="bg-white border-2 border-neutral-900 rounded-2xl shadow-2xl max-w-3xl w-full p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-amber-300 flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-neutral-900 uppercase tracking-tight">
                  Lineage & Academies
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                  BJJ Roots
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Manage your current gym, past academy training journey, and master lineage tree.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-neutral-200 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('academies')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'academies'
                ? 'border-neutral-900 text-neutral-900 bg-neutral-50/80 rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>Academies & Gyms ({academies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lineages')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'lineages'
                ? 'border-neutral-900 text-neutral-900 bg-neutral-50/80 rounded-t-lg'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <GitBranch className="w-4 h-4 text-amber-500" />
            <span>Lineage Tree & Masters ({lineages.length})</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="space-y-4 overflow-y-auto pr-1 py-4 flex-1">
          {/* TAB 1: ACADEMIES & TRAINING HISTORY */}
          {activeTab === 'academies' && (
            <div className="space-y-4">
              {/* Add Academy Trigger / Form */}
              {isAddingAcademy ? (
                <form
                  onSubmit={handleSaveAcademy}
                  className="bg-neutral-50 border-2 border-neutral-900 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <h4 className="font-display font-bold text-sm text-neutral-900 uppercase">
                      {editingAcademyId ? 'Edit Academy Record' : 'Add New Academy or Gym'}
                    </h4>
                    <button
                      type="button"
                      onClick={resetAcademyForm}
                      className="text-xs text-neutral-500 hover:text-neutral-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Academy / Gym Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Academy name..."
                        value={acadName}
                        onChange={(e) => setAcadName(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Head Professor / Coach
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Professor / Head Instructor..."
                        value={acadInstructor}
                        onChange={(e) => setAcadInstructor(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Location (City, State / Country)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. City, State / Country"
                        value={acadLocation}
                        onChange={(e) => setAcadLocation(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Rank Achieved / Belt Status
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. White Belt 2 Stripes, Blue Belt..."
                        value={acadRank}
                        onChange={(e) => setAcadRank(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        Start Year / Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2022, Jan 2023"
                        value={acadStartYear}
                        onChange={(e) => setAcadStartYear(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                        End Year (if past academy)
                      </label>
                      <input
                        type="text"
                        disabled={acadIsCurrent}
                        placeholder={acadIsCurrent ? 'Current Academy' : 'e.g. 2024'}
                        value={acadIsCurrent ? '' : acadEndYear}
                        onChange={(e) => setAcadEndYear(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                      Training Notes / Memories
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Focused on half guard and takedowns, great training partners and open mats."
                      value={acadNotes}
                      onChange={(e) => setAcadNotes(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-y"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acadIsCurrent}
                        onChange={(e) => setAcadIsCurrent(e.target.checked)}
                        className="w-4 h-4 accent-neutral-900 rounded"
                      />
                      <span className="text-xs font-bold text-neutral-900">
                        This is my Current Primary Academy 🥋
                      </span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={resetAcademyForm}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-200 hover:bg-neutral-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition-all shadow-xs"
                      >
                        {editingAcademyId ? 'Update Academy' : 'Save Academy'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Your Academy History & Training Home
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetAcademyForm();
                      setIsAddingAcademy(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Academy / Gym</span>
                  </button>
                </div>
              )}

              {/* CURRENT ACADEMY SPOTLIGHT */}
              {currentHomeGym && (
                <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-5 border-2 border-neutral-900 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-950 bg-amber-400 px-2 py-0.5 rounded shadow-xs">
                          <Star className="w-3 h-3 fill-amber-950" />
                          <span>Current Home Academy</span>
                        </span>
                        {currentHomeGym.startYear && (
                          <span className="text-[11px] text-neutral-400 font-mono">
                            Since {currentHomeGym.startYear}
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-bold text-lg sm:text-xl text-white">
                        {currentHomeGym.name}
                      </h4>
                      {currentHomeGym.headInstructor && (
                        <p className="text-xs text-neutral-300 mt-0.5 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-400" />
                          <span>Professor: <strong>{currentHomeGym.headInstructor}</strong></span>
                        </p>
                      )}
                      {currentHomeGym.location && (
                        <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{currentHomeGym.location}</span>
                        </p>
                      )}
                      {currentHomeGym.rankAchieved && (
                        <p className="text-xs text-amber-300 mt-1 flex items-center gap-1.5 font-semibold">
                          <Award className="w-3.5 h-3.5" />
                          <span>{currentHomeGym.rankAchieved}</span>
                        </p>
                      )}
                      {currentHomeGym.notes && (
                        <p className="text-xs text-neutral-300 mt-2 bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700">
                          {currentHomeGym.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditAcademy(currentHomeGym)}
                        className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                        title="Edit academy details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PAST ACADEMIES ATTENDED */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5">
                  <span>Past Academies & Gym Journey ({pastGyms.length})</span>
                </h5>

                {pastGyms.length === 0 ? (
                  <div className="text-center py-5 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 text-xs text-neutral-500">
                    No past academies recorded yet. Click "Add Academy" to log gyms you trained at in the past!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pastGyms.map((acad) => (
                      <div
                        key={acad.id}
                        className="bg-white border border-neutral-200 hover:border-neutral-400 rounded-xl p-3.5 shadow-2xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h6 className="font-display font-bold text-sm text-neutral-900 truncate">
                              {acad.name}
                            </h6>
                            <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                              {acad.startYear || ''}{acad.endYear ? ` - ${acad.endYear}` : ''}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600 mt-1">
                            {acad.headInstructor && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-neutral-400" />
                                <span>{acad.headInstructor}</span>
                              </span>
                            )}
                            {acad.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-neutral-400" />
                                <span>{acad.location}</span>
                              </span>
                            )}
                            {acad.rankAchieved && (
                              <span className="flex items-center gap-1 text-amber-700 font-medium">
                                <Award className="w-3 h-3" />
                                <span>{acad.rankAchieved}</span>
                              </span>
                            )}
                          </div>

                          {acad.notes && (
                            <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">
                              {acad.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryAcademy(acad.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-900 border border-neutral-200 transition-colors"
                            title="Make this your current active gym"
                          >
                            Set Current
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditAcademy(acad)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAcademy(acad.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LINEAGE TREE & MASTERS */}
          {activeTab === 'lineages' && (
            <div className="space-y-4">
              {/* Presets Bar */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quick Lineage Presets:</span>
                  </span>
                  <span className="text-[11px] text-neutral-400">Click to load classic lineage</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LINEAGE_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => handleApplyLineagePreset(p.chain)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white hover:bg-neutral-900 hover:text-white text-neutral-800 border border-neutral-200 shadow-2xs transition-all cursor-pointer"
                    >
                      + {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lineage Tabs if multiple */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {lineages.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedLineageId(l.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                        selectedLineageId === l.id
                          ? 'bg-neutral-900 text-amber-300 shadow-xs'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {l.title}
                    </button>
                  ))}
                </div>

                {isCreatingLineage ? (
                  <form onSubmit={handleCreateNewLineage} className="flex items-center gap-1 shrink-0">
                    <input
                      type="text"
                      required
                      placeholder="Lineage Title..."
                      value={newLineageTitle}
                      onChange={(e) => setNewLineageTitle(e.target.value)}
                      className="bg-white border border-neutral-300 rounded px-2 py-1 text-xs font-medium"
                    />
                    <button
                      type="submit"
                      className="px-2 py-1 bg-neutral-900 text-white text-xs font-bold rounded"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingLineage(false)}
                      className="px-2 py-1 text-neutral-500 text-xs"
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCreatingLineage(true)}
                    className="text-xs font-bold text-neutral-800 hover:text-amber-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-100 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Lineage</span>
                  </button>
                )}
              </div>

              {/* ACTIVE LINEAGE CHAIN VISUALIZER */}
              {currentLineage && (
                <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-800">
                    <div>
                      <h4 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
                        <span>{currentLineage.title}</span>
                        {currentLineage.isPrimary && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-neutral-950">
                            Primary
                          </span>
                        )}
                      </h4>
                      {currentLineage.notes && (
                        <p className="text-xs text-neutral-400 mt-0.5">{currentLineage.notes}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteLineage(currentLineage.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-400 rounded transition-colors"
                      title="Delete this lineage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Flow Diagram of Professors */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Generational Lineage Flow ({currentLineage.professors.length} Masters):
                    </span>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {currentLineage.professors.map((prof, idx) => {
                        const isLast = idx === currentLineage.professors.length - 1;
                        const isFirst = idx === 0;
                        return (
                          <React.Fragment key={`${prof}-${idx}`}>
                            <div
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                                isLast
                                  ? 'bg-amber-400 text-neutral-950 border-amber-300 font-extrabold ring-2 ring-amber-400/30'
                                  : isFirst
                                  ? 'bg-neutral-800 text-white border-neutral-600'
                                  : 'bg-neutral-800 text-neutral-200 border-neutral-700'
                              }`}
                            >
                              <span>{isLast ? '🥋' : isFirst ? '⛩️' : '🥋'}</span>
                              <span>{prof}</span>
                              {currentLineage.professors.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProfessor(idx)}
                                  className="text-neutral-400 hover:text-rose-400 ml-1"
                                  title="Remove professor"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                            {!isLast && (
                              <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Professor to this Chain */}
                  <form
                    onSubmit={handleAddProfessorToCurrentLineage}
                    className="flex items-center gap-2 pt-2 border-t border-neutral-800"
                  >
                    <input
                      type="text"
                      placeholder="Add next master / professor in lineage..."
                      value={newProfessorName}
                      onChange={(e) => setNewProfessorName(e.target.value)}
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Master</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-neutral-400">
            RollDex BJJ • Free & Open Training System
          </span>
          <button
            type="button"
            id="btn-save-lineage-modal"
            onClick={handleSaveAndClose}
            className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Save & Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
