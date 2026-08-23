import React, { useState } from 'react';
import { Shield, Award, CheckCircle2, Lock, X, ExternalLink, Heart, Sparkles, Scale, FileText, AlertTriangle, Eye, Camera, RefreshCw, Copy, Check } from 'lucide-react';
import { RollDexLogo } from './RollDexLogo';

interface AboutLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetTermsGate?: () => void;
  onOpenLegalPdf?: () => void;
}

type TabType = 'creator' | 'terms' | 'privacy' | 'minors' | 'appstore';

export const AboutLicenseModal: React.FC<AboutLicenseModalProps> = ({
  isOpen,
  onClose,
  onResetTermsGate,
  onOpenLegalPdf
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('creator');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const publicPrivacyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?page=privacy`
    : 'https://rolldex.app/?page=privacy';

  const handleCopyPrivacyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicPrivacyUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch (err) {
      console.warn('Could not copy to clipboard:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-neutral-900 text-white px-5 py-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-neutral-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 shadow-xs shrink-0 flex items-center">
              <RollDexLogo size="sm" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base uppercase tracking-wider">
                RollDex • Legal, Privacy & License
              </h3>
              <p className="text-[10px] text-neutral-400">
                100% Free • Offline & Local Brazilian Jiu-Jitsu Journal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-100/80 px-4 pt-2 gap-1 text-xs font-semibold text-neutral-600 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'creator'
                ? 'border-neutral-900 text-neutral-900 bg-white font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Creator & IP
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'terms'
                ? 'border-neutral-900 text-neutral-900 bg-white font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Terms & Disclaimer
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'border-neutral-900 text-neutral-900 bg-white font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('appstore')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'appstore'
                ? 'border-neutral-900 text-neutral-900 bg-white font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            App Store URL
          </button>
          <button
            onClick={() => setActiveTab('minors')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'minors'
                ? 'border-neutral-900 text-neutral-900 bg-white font-bold'
                : 'border-transparent hover:text-neutral-900'
            }`}
          >
            Minor Consent
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs text-neutral-700 overflow-y-auto flex-1">
          {activeTab === 'creator' && (
            <div className="space-y-4">
              {/* Creator Certificate Banner */}
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white p-4 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">
                    Official Creator Certificate
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    VERIFIED AUTHOR
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-white flex items-center gap-1.5 font-display uppercase">
                    <span>Created & Architected for:</span>
                    <span className="text-amber-400">RollDex BJJ Community</span>
                  </p>
                  <p className="text-xs text-neutral-300">
                    100% Free, Offline Local Training Index
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Application: RollDex BJJ Log & Journal</span>
                  <span>Distribution: 100% Free</span>
                </div>
              </div>

              {/* Proprietary License & Protection */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs">
                  <Scale className="w-4 h-4 text-neutral-700" />
                  <span>Proprietary Code & Intellectual Property Rights</span>
                </div>
                <p className="text-neutral-600 text-[11px] leading-relaxed">
                  All Rights Reserved. The software architecture, UI layout, iconography, and compiled client bundle of RollDex are proprietary. Unauthorized decompilation, reverse engineering, scraping, or commercial resale is strictly prohibited.
                </p>
              </div>

              {/* Trademark Clearance Notice */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs">
                  <Shield className="w-4 h-4 text-neutral-700" />
                  <span>Trademark & Academy Independence</span>
                </div>
                <p className="text-neutral-600 text-[11px] leading-relaxed">
                  RollDex is an independent digital logbook. It does not use, nor is it endorsed by, affiliated with, or sponsored by the Gracie family, Gracie Barra, Gracie University, IBJJF, ADCC, or any specific academy or federation. All belts, icons, and badges are original procedural assets.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-neutral-900 text-white rounded-xl space-y-1">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-amber-400">
                  Terms of Service & Physical Activity Disclaimer
                </p>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Please review the terms governing the use of RollDex as a self-directed training log.
                </p>
              </div>

              <div className="space-y-3 text-[11px] leading-relaxed text-neutral-700">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Passive Logbook Utility (No Advice or Instruction)</span>
                  </p>
                  <p className="text-neutral-600">
                    RollDex is strictly a personal recording and journaling tool. It does not provide martial arts instruction, technique guidance, safety coaching, or medical diagnosis. You are solely responsible for determining your physical readiness to train and for practicing exclusively under qualified, certified in-person martial arts supervision.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Inherent Risks of Martial Arts</span>
                  </p>
                  <p className="text-neutral-600">
                    Brazilian Jiu-Jitsu, wrestling, judo, and submission grappling involve inherent physical risks, including fractures, joint dislocations, torn ligaments, concussion, spinal trauma, or death. By using this software to log your training, you acknowledge and agree that you voluntarily participate in such activities at your own risk and hold RollDex and its creators harmless from any liability.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Standard "As-Is" Software Provision</span>
                  </p>
                  <p className="text-neutral-600">
                    This software is provided "as is", without warranty of any kind, express or implied, including fitness for a particular purpose. In no event shall the authors be liable for any claim or damages.
                  </p>
                </div>

                {/* Direct Onboarding Screenshot Launch Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onResetTermsGate) {
                        onResetTermsGate();
                      }
                    }}
                    className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-neutral-700 shadow-sm transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Launch Mandatory Onboarding Screen (Screenshot Mode)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-emerald-950 text-white rounded-xl space-y-1">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-emerald-400">
                  Privacy Policy • 100% Offline Local Architecture
                </p>
                <p className="text-[11px] text-emerald-200 leading-relaxed">
                  RollDex does not collect, transmit, or monetize your personal data.
                </p>
              </div>

              <div className="space-y-3 text-[11px] leading-relaxed text-neutral-700">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Zero Data Collection (Zero Analytics, Zero Telemetry)</span>
                  </p>
                  <p className="text-neutral-600">
                    RollDex operates entirely on your device (browser LocalStorage). No crash trackers, Google Analytics, telemetry beacons, or external databases exist.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Camera & Photo Library Access Notice</span>
                  </p>
                  <p className="text-neutral-600">
                    When you use the "Camera" or "Add Photo" features (for whiteboard snapshots, mat photos, or medal pictures), images are compressed locally and stored on your device. Any device permissions requested (such as camera access or local storage read/write) are strictly utilized locally on-device to enable feature functionality and never transmit data externally.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                  <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Data Ownership & Backups</span>
                  </p>
                  <p className="text-neutral-600">
                    You own 100% of your data. You can export a complete JSON backup file at any time from the "Export / Import" menu to safeguard your training history.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appstore' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-neutral-900 text-white rounded-xl space-y-1">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-amber-400">
                  Google Play & Apple App Store Privacy URL
                </p>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Use this live public URL when filling out the mandatory Privacy Policy field in Google Play Console or Apple App Store Connect.
                </p>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-300 space-y-2.5">
                <div className="text-[11px] font-bold text-neutral-900">
                  Live Public URL (Always accessible without login):
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-neutral-300 font-mono text-[11px] text-neutral-800 break-all select-all flex items-center justify-between gap-2">
                  <span>{publicPrivacyUrl}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyPrivacyUrl}
                    className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Public Privacy URL</span>
                      </>
                    )}
                  </button>
                  <a
                    href="/?page=privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs rounded-lg flex items-center justify-center gap-1 border border-neutral-300 transition-colors"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Court Document / PDF Generator Box */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>Official Legal & Court Archive Document</span>
                  </p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900 border border-amber-300">
                    PDF READY
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Open the formatted legal archive to instantly save, export, or print the full Terms, Physical Risk Assumption, and Zero-Telemetry Privacy Policy as a PDF.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenLegalPdf) {
                      onOpenLegalPdf();
                    } else {
                      window.print();
                    }
                  }}
                  className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Open & Save Legal PDF Document</span>
                </button>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 space-y-1">
                <p className="font-bold text-xs text-emerald-900">Google Play Store & Apple Compliance Ready</p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  This URL satisfies all developer requirements by declaring zero personal data collection, zero SDK telemetry, local storage only, and user-initiated data erasure.
                </p>
              </div>

              {/* Onboarding Screen Preview / Screenshot Trigger */}
              <div className="p-3.5 bg-neutral-900 text-white border border-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Onboarding Gate Verification & Screenshots</span>
                  </p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    TEST GATE
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Click below to immediately launch the mandatory 2-checkbox onboarding screen so you can capture screenshots of both the locked state and agreed state.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onResetTermsGate) {
                      onResetTermsGate();
                    }
                  }}
                  className="w-full py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 border border-neutral-700 hover:border-amber-400/50 shadow-sm transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Launch Mandatory Onboarding Screen</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'minors' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-neutral-900 text-white rounded-xl space-y-1">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-amber-400">
                  Minor Practitioner & Parental Consent Notice
                </p>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Guidelines for youth and kids division practitioners using RollDex.
                </p>
              </div>

              <div className="space-y-3 text-[11px] leading-relaxed text-neutral-700">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <p className="font-bold text-neutral-900">Parental / Guardian Consent</p>
                  <p className="text-neutral-600">
                    If RollDex is used by a practitioner under 18 years of age (including kids and teen belt divisions), a parent or legal guardian must review and agree to these terms. RollDex does not require or collect personal identifying information.
                  </p>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                  <p className="font-bold text-neutral-900">Youth Training Safety</p>
                  <p className="text-neutral-600">
                    Young practitioners must always drill and roll under the active supervision of certified youth martial arts instructors. RollDex is strictly a personal journal for logging moves taught in academy classes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-neutral-500 font-medium">
            OSS 🥋 • Respect All, Fear None
          </span>
          <div className="flex items-center gap-2">
            {onResetTermsGate && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onResetTermsGate();
                }}
                className="text-[10px] text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                title="Review first-launch onboarding gate"
              >
                Re-open Terms Gate
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
