import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { ByteChokeLogo } from './ByteChokeLogo';
import { X, CheckCircle2, User, Calendar, Mail, Trash2, Sparkles, ShieldCheck } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile | null) => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile
}) => {
  const [firstName, setFirstName] = useState(currentProfile?.firstName || '');
  const [lastName, setLastName] = useState(currentProfile?.lastName || '');
  const [dob, setDob] = useState(currentProfile?.dob || '');
  const [email, setEmail] = useState(currentProfile?.email || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentProfile) {
      setFirstName(currentProfile.firstName || '');
      setLastName(currentProfile.lastName || '');
      setDob(currentProfile.dob || '');
      setEmail(currentProfile.email || '');
    } else {
      setFirstName('');
      setLastName('');
      setDob('');
      setEmail('');
    }
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If all fields are blank and user submits, clear profile
    if (!firstName.trim() && !lastName.trim() && !dob.trim() && !email.trim()) {
      onSaveProfile(null);
      onClose();
      return;
    }

    if (email.trim() && !email.includes('@')) {
      setErrorMsg('Please enter a valid email address (or leave blank).');
      return;
    }

    setErrorMsg(null);
    const profile: UserProfile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dob: dob.trim(),
      email: email.trim(),
      createdAt: currentProfile?.createdAt || Date.now()
    };

    onSaveProfile(profile);
    onClose();
  };

  const handleClear = () => {
    setFirstName('');
    setLastName('');
    setDob('');
    setEmail('');
    onSaveProfile(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="modal-practitioner-profile"
        className="bg-white border-2 border-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <ByteChokeLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-neutral-900 uppercase tracking-tight">
                  Practitioner Profile
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full border border-neutral-200">
                  Optional
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Optional details to personalize your BJJ training journal.
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

        {/* Form Body asking optional First Name, Last Name, DOB, Email */}
        <form onSubmit={handleSubmit} className="space-y-4 py-4 overflow-y-auto">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Instant & Private Local Storage</p>
              <p className="text-amber-800/90 text-[10px] mt-0.5">
                ByteChoke auto-saves your drills and logs on your device as you type. Filling out this profile is 100% optional.
              </p>
            </div>
          </div>

          {/* First & Last Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                First Name <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Marcus"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
                <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                Last Name <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Almeida"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
                />
                <User className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Date of Birth (DOB) */}
          <div>
            <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
              Date of Birth (DOB) <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
              />
              <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              Used if you want to calculate IBJJF division brackets (Adult / Master / Youth).
            </p>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-1">
              Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="e.g. practitioner@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pl-8 pr-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white"
              />
              <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2">
            {currentProfile ? (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              id="btn-save-profile"
              className="flex-1 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
