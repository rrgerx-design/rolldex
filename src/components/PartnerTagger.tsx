import React, { useState } from 'react';
import { TaggedTeammate, getSavedPartnersRoster, savePartnersRoster, getBeltBadgeColor } from '../utils/partners';
import { Users, UserPlus, X, Check, Shield, Search, Sparkles, Swords, Handshake } from 'lucide-react';

interface PartnerTaggerProps {
  taggedTeammates: TaggedTeammate[];
  onChange: (teammates: TaggedTeammate[]) => void;
}

export const PartnerTagger: React.FC<PartnerTaggerProps> = ({
  taggedTeammates,
  onChange
}) => {
  const [roster, setRoster] = useState<TaggedTeammate[]>(() => getSavedPartnersRoster());
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerRank, setNewPartnerRank] = useState('Blue Belt');

  const ranksList = [
    'White Belt',
    'Blue Belt',
    'Purple Belt',
    'Brown Belt',
    'Black Belt'
  ];

  const handleTogglePartner = (partner: TaggedTeammate) => {
    const existingIndex = taggedTeammates.findIndex(
      (t) => t.name.toLowerCase().trim() === partner.name.toLowerCase().trim()
    );

    if (existingIndex >= 0) {
      // Remove
      const updated = taggedTeammates.filter((_, i) => i !== existingIndex);
      onChange(updated);
    } else {
      // Add with default flags
      const newTagged: TaggedTeammate = {
        name: partner.name,
        beltRank: partner.beltRank || 'Blue Belt',
        sparred: true,
        drilledWith: true
      };
      onChange([...taggedTeammates, newTagged]);
    }
  };

  const handleToggleSparred = (partnerName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = taggedTeammates.map((t) => {
      if (t.name === partnerName) {
        return { ...t, sparred: !t.sparred };
      }
      return t;
    });
    onChange(updated);
  };

  const handleToggleDrilled = (partnerName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = taggedTeammates.map((t) => {
      if (t.name === partnerName) {
        return { ...t, drilledWith: !t.drilledWith };
      }
      return t;
    });
    onChange(updated);
  };

  const handleRemoveTagged = (partnerName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(taggedTeammates.filter((t) => t.name !== partnerName));
  };

  const handleAddNewPartnerToRoster = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPartnerName.trim();
    if (!trimmed) return;

    const newPartner: TaggedTeammate = {
      name: trimmed,
      beltRank: newPartnerRank,
      sparred: true,
      drilledWith: true
    };

    // Check if already in roster
    const exists = roster.some((r) => r.name.toLowerCase() === trimmed.toLowerCase());
    let updatedRoster = roster;
    if (!exists) {
      updatedRoster = [newPartner, ...roster];
      setRoster(updatedRoster);
      savePartnersRoster(updatedRoster);
    }

    // Also auto-tag in current class
    if (!taggedTeammates.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...taggedTeammates, newPartner]);
    }

    setNewPartnerName('');
    setIsAddingNew(false);
  };

  // Filter roster by query
  const filteredRoster = roster.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.beltRank && p.beltRank.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-neutral-50/90 rounded-xl p-3.5 border border-neutral-200 space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-neutral-900 text-amber-400 flex items-center justify-center text-xs">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
              Tag Training & Sparring Partners
            </label>
            <span className="text-[11px] text-neutral-500 font-medium">
              Tag classmates and sparring rounds to remember your rolls and drills better
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            {taggedTeammates.length} {taggedTeammates.length === 1 ? 'Partner' : 'Partners'} Tagged
          </span>
          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="text-xs font-bold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-600" />
            <span>+ Add Partner</span>
          </button>
        </div>
      </div>

      {/* Add New Partner Form (Inline) */}
      {isAddingNew && (
        <form
          onSubmit={handleAddNewPartnerToRoster}
          className="bg-white p-3 rounded-lg border border-amber-300 shadow-xs space-y-2 animate-in fade-in-50"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-neutral-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Add Teammate to Gym Roster</span>
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              required
              placeholder="Partner full name (e.g. Jordan Lee)"
              value={newPartnerName}
              onChange={(e) => setNewPartnerName(e.target.value)}
              className="sm:col-span-2 bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <select
              value={newPartnerRank}
              onChange={(e) => setNewPartnerRank(e.target.value)}
              className="bg-neutral-50 border border-neutral-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-none"
            >
              {ranksList.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-neutral-900 text-amber-300 text-xs font-bold rounded-md hover:bg-neutral-800 cursor-pointer shadow-2xs"
            >
              Save & Tag Partner
            </button>
          </div>
        </form>
      )}

      {/* Currently Tagged Partners Pills */}
      {taggedTeammates.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Tagged in this class:
          </span>
          <div className="flex flex-wrap gap-2">
            {taggedTeammates.map((partner) => {
              const badgeColors = getBeltBadgeColor(partner.beltRank);
              return (
                <div
                  key={partner.name}
                  className="bg-white border-2 border-neutral-800 rounded-xl p-1.5 pl-2.5 flex items-center gap-2 shadow-2xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${badgeColors.bg} ${badgeColors.text} ${badgeColors.border} border`}
                    >
                      {partner.beltRank || 'Belt'}
                    </span>
                    <span className="text-xs font-bold text-neutral-900">
                      {partner.name}
                    </span>
                  </div>

                  {/* Toggle Sparred Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleSparred(partner.name, e)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 cursor-pointer transition-colors ${
                      partner.sparred
                        ? 'bg-rose-100 text-rose-900 border border-rose-200'
                        : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                    }`}
                    title={partner.sparred ? 'Sparred in live rounds (Click to toggle)' : 'Did not spar (Click to tag as sparred)'}
                  >
                    <Swords className="w-3 h-3" />
                    <span>Sparred</span>
                  </button>

                  {/* Toggle Drilled Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleDrilled(partner.name, e)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 cursor-pointer transition-colors ${
                      partner.drilledWith
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                    }`}
                    title={partner.drilledWith ? 'Drilled techniques together (Click to toggle)' : 'Did not drill (Click to tag as drilled)'}
                  >
                    <Handshake className="w-3 h-3" />
                    <span>Drilled</span>
                  </button>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveTagged(partner.name, e)}
                    className="p-1 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer ml-0.5"
                    title="Untag partner"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Select from Gym Roster */}
      <div className="pt-2 border-t border-neutral-200">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Quick Tag Teammate (Tap to tag/untag):
          </span>
          <div className="relative w-40 sm:w-52">
            <Search className="w-3 h-3 text-neutral-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search roster..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-2 py-0.5 text-[11px] bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {filteredRoster.length === 0 ? (
            <div className="w-full text-center py-2 px-3 bg-white rounded-lg border border-dashed border-neutral-200">
              <p className="text-[11px] text-neutral-500 font-medium">
                {searchQuery ? `No partner found matching "${searchQuery}"` : 'No saved partners yet.'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (searchQuery) setNewPartnerName(searchQuery);
                    setIsAddingNew(true);
                  }}
                  className="text-amber-700 font-bold hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5"
                >
                  <UserPlus className="w-3 h-3 inline" />
                  <span>+ Add your first teammate</span>
                </button>
              </p>
            </div>
          ) : (
            filteredRoster.map((partner) => {
              const isTagged = taggedTeammates.some(
                (t) => t.name.toLowerCase().trim() === partner.name.toLowerCase().trim()
              );
              const badgeColors = getBeltBadgeColor(partner.beltRank);

              return (
                <button
                  key={partner.name}
                  type="button"
                  onClick={() => handleTogglePartner(partner)}
                  className={`text-xs font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    isTagged
                      ? 'bg-neutral-900 text-amber-300 border-neutral-900 ring-2 ring-amber-400/40 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400'
                  }`}
                >
                  {isTagged ? (
                    <Check className="w-3 h-3 text-amber-400 shrink-0" />
                  ) : (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        (partner.beltRank || '').toLowerCase().includes('black')
                          ? 'bg-neutral-900 ring-1 ring-white'
                          : (partner.beltRank || '').toLowerCase().includes('brown')
                          ? 'bg-amber-900'
                          : (partner.beltRank || '').toLowerCase().includes('purple')
                          ? 'bg-purple-600'
                          : (partner.beltRank || '').toLowerCase().includes('blue')
                          ? 'bg-blue-600'
                          : 'bg-neutral-300'
                      }`}
                    />
                  )}
                  <span>{partner.name}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                      isTagged ? 'bg-neutral-800 text-amber-200' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {partner.beltRank?.replace(' Belt', '') || ''}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
