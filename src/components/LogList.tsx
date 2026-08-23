import React, { useState } from 'react';
import { BjjLogEntry } from '../types';
import { LogCard } from './LogCard';
import {
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  PlusCircle,
  XCircle,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  List,
  Users,
  Youtube
} from 'lucide-react';

interface LogListProps {
  logs: BjjLogEntry[];
  onEdit: (log: BjjLogEntry) => void;
  onDelete: (id: string) => void;
  onDuplicate: (log: BjjLogEntry) => void;
  onPrintPreview: (log: BjjLogEntry) => void;
  onNewLogClick: () => void;
}

export const LogList: React.FC<LogListProps> = ({
  logs,
  onEdit,
  onDelete,
  onDuplicate,
  onPrintPreview,
  onNewLogClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gearFilter, setGearFilter] = useState<'All' | 'Gi' | 'No-Gi' | 'Open Mat'>('All');
  const [selectedCoach, setSelectedCoach] = useState<string>('All');
  const [selectedPartner, setSelectedPartner] = useState<string>('All');
  const [hasVideoFilter, setHasVideoFilter] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'classNumDesc'>('newest');
  const [globalExpanded, setGlobalExpanded] = useState<boolean | null>(false);

  // Unique coaches list
  const uniqueCoaches = Array.from(
    new Set(logs.map((l) => l.coach).filter((c) => c && c.trim().length > 0))
  );

  // Unique tagged partners across all logs
  const uniquePartners = Array.from(
    new Set(
      logs.flatMap((l) => {
        if (l.taggedTeammates) return l.taggedTeammates.map((t) => t.name);
        if (l.taggedPartners) return l.taggedPartners;
        return [];
      }).filter(Boolean)
    )
  );

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    // Gear filter
    if (gearFilter !== 'All' && log.gear !== gearFilter) return false;

    // Coach filter
    if (selectedCoach !== 'All' && log.coach !== selectedCoach) return false;

    // Partner filter
    if (selectedPartner !== 'All') {
      const logPartners = [
        ...(log.taggedTeammates?.map((t) => t.name) || []),
        ...(log.taggedPartners || [])
      ];
      if (!logPartners.some((p) => p.toLowerCase() === selectedPartner.toLowerCase())) {
        return false;
      }
    }

    // Has Video filter
    if (hasVideoFilter && (!log.youtubeVideos || log.youtubeVideos.length === 0)) {
      return false;
    }

    // Search query matching
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const inDate = log.date.toLowerCase().includes(q);
      const inClassNum = String(log.classNumber).toLowerCase().includes(q);
      const inCoach = log.coach.toLowerCase().includes(q);
      const inDrills = log.drills.some((d) => d && d.toLowerCase().includes(q));
      const inSubs =
        (log.submissionsGot && log.submissionsGot.toLowerCase().includes(q)) ||
        (log.submissionsDefended && log.submissionsDefended.toLowerCase().includes(q));
      const inNotes =
        (log.personalNotes && log.personalNotes.toLowerCase().includes(q)) ||
        (log.sparringNotes && log.sparringNotes.toLowerCase().includes(q));
      const inPartners = [
        ...(log.taggedTeammates?.map((t) => t.name) || []),
        ...(log.taggedPartners || [])
      ].some((p) => p.toLowerCase().includes(q));
      const inVideos = (log.youtubeVideos || []).some((v) =>
        (v.title && v.title.toLowerCase().includes(q)) ||
        (v.category && v.category.toLowerCase().includes(q))
      );

      return inDate || inClassNum || inCoach || inDrills || inSubs || inNotes || inPartners || inVideos;
    }

    return true;
  });

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortOrder === 'oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortOrder === 'classNumDesc') {
      const numA = typeof a.classNumber === 'number' ? a.classNumber : parseInt(String(a.classNumber), 10) || 0;
      const numB = typeof b.classNumber === 'number' ? b.classNumber : parseInt(String(b.classNumber), 10) || 0;
      return numB - numA;
    }
    return 0;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setGearFilter('All');
    setSelectedCoach('All');
    setSelectedPartner('All');
    setHasVideoFilter(false);
  };

  const isFiltered =
    searchTerm !== '' ||
    gearFilter !== 'All' ||
    selectedCoach !== 'All' ||
    selectedPartner !== 'All' ||
    hasVideoFilter;

  const handleToggleExpandAll = () => {
    setGlobalExpanded((prev) => (prev === true ? false : true));
  };

  return (
    <div className="space-y-3">
      {/* Controls Bar: Search & Filters */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-3.5 sm:p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-logs"
              type="text"
              placeholder="Search drills, partners (@Marcus), moves, submissions, coach..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-neutral-50/90 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Expand/Collapse Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Gear Selector */}
            <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-50">
              {(['All', 'Gi', 'No-Gi', 'Open Mat'] as const).map((gear) => (
                <button
                  key={gear}
                  onClick={() => setGearFilter(gear)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    gearFilter === gear
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
                  }`}
                >
                  {gear}
                </button>
              ))}
            </div>

            {/* Partner Filter */}
            {uniquePartners.length > 0 && (
              <select
                id="select-partner-filter"
                value={selectedPartner}
                onChange={(e) => setSelectedPartner(e.target.value)}
                className="text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="All">All Partners</option>
                {uniquePartners.map((p) => (
                  <option key={p} value={p}>
                    👥 {p}
                  </option>
                ))}
              </select>
            )}

            {/* Video Filter Toggle */}
            <button
              type="button"
              onClick={() => setHasVideoFilter(!hasVideoFilter)}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                hasVideoFilter
                  ? 'bg-red-600 text-white border-red-700 shadow-2xs'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
              title="Filter sessions with YouTube video visuals"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>With Videos</span>
            </button>

            {/* Coach Filter */}
            {uniqueCoaches.length > 0 && (
              <select
                id="select-coach-filter"
                value={selectedCoach}
                onChange={(e) => setSelectedCoach(e.target.value)}
                className="text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <option value="All">All Coaches</option>
                {uniqueCoaches.map((c) => (
                  <option key={c} value={c}>
                    Coach: {c}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Order */}
            <select
              id="select-sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="newest">Date: Newest</option>
              <option value="oldest">Date: Oldest</option>
              <option value="classNumDesc">Class #: Highest</option>
            </select>

            {/* Expand All / Collapse All Toggle Button */}
            {sortedLogs.length > 0 && (
              <button
                type="button"
                id="btn-expand-collapse-all-logs"
                onClick={handleToggleExpandAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 text-xs font-semibold transition-colors cursor-pointer"
                title={globalExpanded ? 'Collapse all log cards' : 'Expand all log cards'}
              >
                {globalExpanded ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Collapse All</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Expand All</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Quick Coach / Partner Memory filter chips */}
        <div className="flex items-center gap-1.5 pt-2.5 mt-2 border-t border-neutral-100 overflow-x-auto pb-0.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase shrink-0">
            Filter:
          </span>
          <button
            onClick={clearFilters}
            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer shrink-0 ${
              !isFiltered
                ? 'bg-neutral-900 text-amber-300 border-neutral-900 shadow-2xs'
                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            All Sessions
          </button>
          {uniquePartners.slice(0, 5).map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPartner(selectedPartner === p ? 'All' : p)}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                selectedPartner === p
                  ? 'bg-amber-900 text-amber-200 border-amber-900 shadow-2xs'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <span>👥</span>
              <span>{p}</span>
            </button>
          ))}
          {uniqueCoaches.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCoach(selectedCoach === c ? 'All' : c)}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                selectedCoach === c
                  ? 'bg-neutral-900 text-amber-300 border-neutral-900 shadow-2xs'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
              }`}
            >
              <span>🥋</span>
              <span>{c}</span>
            </button>
          ))}
        </div>

        {/* Filter summary when active */}
        {isFiltered && (
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            <span>
              Showing <strong className="text-neutral-900">{sortedLogs.length}</strong> of{' '}
              {logs.length} logged sessions
            </span>
            <button
              onClick={clearFilters}
              className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Logs List View */}
      {sortedLogs.length > 0 ? (
        <div className="space-y-3">
          {sortedLogs.map((log) => (
            <LogCard
              key={log.id}
              log={log}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onPrintPreview={onPrintPreview}
              forceExpanded={globalExpanded}
            />
          ))}
        </div>
      ) : isFiltered ? (
        /* Filtered Empty State */
        <div className="bg-white rounded-xl border border-neutral-200/90 p-6 text-center">
          <p className="text-xs text-neutral-500 mb-3">
            No matching class logs found for your current search or filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : null}
    </div>
  );
};

