import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Lock, FileText, ChevronDown, Check, Scale, ExternalLink } from 'lucide-react';
import { RollDexLogo } from './RollDexLogo';

interface OnboardingTermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export const OnboardingTermsModal: React.FC<OnboardingTermsModalProps> = ({
  isOpen,
  onAccept
}) => {
  const [hasAgreedAge, setHasAgreedAge] = useState(false);
  const [hasAgreedLiability, setHasAgreedLiability] = useState(false);

  // Prevent escape key dismissal or background interactions
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  if (!isOpen) return null;

  const isFormValid = hasAgreedAge && hasAgreedLiability;

  return (
    <div
      id="onboarding-terms-gate"
      className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Branding Banner */}
        <div className="bg-neutral-900 text-white px-5 py-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-neutral-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 shadow-xs shrink-0 flex items-center">
              <RollDexLogo size="sm" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider text-white">
                Terms & Legal Disclaimer
              </h2>
              <p className="text-[10px] sm:text-xs text-neutral-400">
                First-Launch Acknowledgment • RollDex BJJ Logbook
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
            MANDATORY GATE
          </span>
        </div>

        {/* Scrollable Terms Text Container */}
        <div
          className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs text-neutral-700 bg-neutral-50/50 flex-1 border-b border-neutral-200"
        >
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Mandatory First-Launch Agreement</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              To proceed and unlock the RollDex logbook, you must review and accept the terms below regarding physical training risk, zero data collection, minor consent, and intellectual property.
            </p>
          </div>

          {/* Section 1: Passive Logbook & Inherent Risk */}
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono shrink-0">
                1
              </span>
              <span>Passive Journal Utility & Inherent Risk Assumption</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed pl-7">
              <strong>RollDex is strictly a passive, self-directed recording journal.</strong> It does not provide martial arts instruction, technique guidance, safety coaching, conditioning advice, or medical recommendations.
            </p>
            <p className="text-[11px] text-neutral-600 leading-relaxed pl-7">
              Brazilian Jiu-Jitsu and martial arts involve inherent risks of severe physical injury, broken bones, joint damage, spinal trauma, or death. You are solely responsible for your physical readiness and must train exclusively under certified in-person supervision. You voluntarily assume 100% of all risks associated with any training you record.
            </p>
          </div>

          {/* Section 2: Local Storage & Privacy Guarantee */}
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono shrink-0">
                2
              </span>
              <span>100% Offline Local Architecture & Zero Telemetry</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed pl-7">
              <strong>RollDex collects zero user data and contains zero analytics, tracking scripts, or crash trackers.</strong> All logs, drill notes, sparring records, whiteboard photos, and medal snapshots remain 100% on your local device (browser LocalStorage). Any device permissions requested (such as camera access or local storage read/write) are strictly utilized locally on-device to enable feature functionality and never transmit data externally.
            </p>
            <p className="text-[11px] text-neutral-600 leading-relaxed pl-7">
              Because data is strictly local, you are solely responsible for generating regular JSON backups using the Export feature. RollDex bears no liability for data lost due to device damage, browser cache clearing, or device resets.
            </p>
          </div>

          {/* Section 3: Age & Parental Consent */}
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono shrink-0">
                3
              </span>
              <span>Age Authorization & Parental/Guardian Consent</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed pl-7">
              You certify that you are at least 18 years old, or that you are the parent or legal guardian of a minor practitioner and grant explicit consent for their use of this software under these terms.
            </p>
          </div>

          {/* Section 4: Proprietary Code & Anti-Scraping */}
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono shrink-0">
                4
              </span>
              <span>Proprietary Code & Authorship Protection</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed pl-7">
              All rights reserved. RollDex software architecture, user interface, and branding are proprietary intellectual property. Unauthorized decompilation, reverse engineering, scraping, redistribution, or commercial resale is strictly prohibited.
            </p>
          </div>

          {/* Section 5: Standard "As-Is" Warranty */}
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs uppercase tracking-wide">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono shrink-0">
                5
              </span>
              <span>Standard "As-Is" Software Provision</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed pl-7">
              This software is provided "as-is" and "as-available" without warranties of any kind, express or implied, including fitness for a particular purpose. In no event shall the authors or copyright holders be liable for any claim, damages, or injuries.
            </p>
          </div>

          {/* Public Privacy Policy Link */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-500 px-1">
            <span>Public Policy:</span>
            <a
              href="/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 font-semibold underline inline-flex items-center gap-1"
            >
              <span>View Live Public Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Checkbox Gate Section (Clickwrap best practices - Un-ticked by default) */}
        <div className="p-4 sm:p-5 bg-white space-y-3 shrink-0">
          <div className="space-y-2.5">
            {/* Checkbox 1: Age / Guardian */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                id="checkbox-age-consent"
                checked={hasAgreedAge}
                onChange={(e) => setHasAgreedAge(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900 shrink-0"
              />
              <span className="text-xs text-neutral-800 leading-snug group-hover:text-neutral-950 font-medium">
                I am at least 18 years old, or I am the parent/guardian of a minor user and consent to their use of this app under these Terms.
              </span>
            </label>

            {/* Checkbox 2: Inherent Risk & Passive Tool */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                id="checkbox-liability-consent"
                checked={hasAgreedLiability}
                onChange={(e) => setHasAgreedLiability(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900 shrink-0"
              />
              <span className="text-xs text-neutral-800 leading-snug group-hover:text-neutral-950 font-medium">
                I acknowledge martial arts involve inherent physical risk, that RollDex is strictly a passive journal, and I agree to the Terms, Disclaimer & Proprietary License.
              </span>
            </label>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              id="btn-agree-and-continue"
              onClick={onAccept}
              disabled={!isFormValid}
              className={`w-full py-3 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                isFormValid
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-98 cursor-pointer'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isFormValid ? 'text-amber-400' : 'text-neutral-400'}`} />
              <span>Agree & Continue to RollDex</span>
            </button>
            <p className="text-[10px] text-center text-neutral-400 mt-1.5">
              This agreement is required once per device. You can review these terms anytime in "License & About".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
