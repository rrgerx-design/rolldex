import React from 'react';
import { Shield, ArrowLeft, Download, FileText, CheckCircle2, Lock } from 'lucide-react';
import { RollDexLogo } from './RollDexLogo';

export const PrivacyPolicyView: React.FC = () => {
  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Official Public Policy • Google Play Compliance
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="bg-black/90 p-2 rounded-xl border border-neutral-700">
                <RollDexLogo size="md" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">Privacy Policy & Data Safety</h1>
                <p className="text-xs text-neutral-400">Effective Date: August 2026 • Version 1.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold border border-neutral-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to App</span>
            </a>
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Highlight Guarantee Box */}
        <div className="p-4 sm:p-5 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-2 text-amber-200">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>100% Offline Local Storage & Zero Remote Telemetry Guarantee</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-200/90">
            RollDex does not collect, track, transmit, monetize, or store any personal user data, workout logs, or images on external servers. All information remains exclusively on your local device.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-neutral-300 text-sm leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-xs font-black">1</span>
              Information We Do Not Collect
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              RollDex was purposefully architected as a standalone, client-side application. We do NOT operate remote tracking databases, authentication servers, or external synchronization backends.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-300">
              <li><strong className="text-white">No Personal Identifying Information (PII):</strong> We do not ask for or collect names, email addresses, phone numbers, or account passwords.</li>
              <li><strong className="text-white">No Cloud Log Storage:</strong> Your martial arts journals, drill logs, competition notes, sparring rounds, and coach names are never uploaded or transmitted.</li>
              <li><strong className="text-white">No Analytics or Tracking SDKs:</strong> We do not embed Google Analytics, Firebase Analytics, Meta Pixel, advertising frameworks, or behavior tracking scripts.</li>
              <li><strong className="text-white">No Crash Telemetry or Diagnostics:</strong> No background error logs, device identifiers, or IP addresses are collected.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-xs font-black">2</span>
              Local Device Storage & User Ownership
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              All data created within RollDex is saved strictly into your device's browser local storage (<code>localStorage</code> / <code>IndexedDB</code>).
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-300">
              <li><strong className="text-white">Sole Ownership:</strong> You retain complete, absolute ownership of your training records.</li>
              <li><strong className="text-white">Manual JSON Backups:</strong> The app provides an Export/Import tool allowing you to download an offline JSON backup at any time.</li>
              <li><strong className="text-white">Complete Data Erasure:</strong> You can completely erase all stored data at any time via the "Reset / Clear All Data" action in the app settings, or by clearing your browser's local cache.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-xs font-black">3</span>
              Device Hardware, Camera & Storage Permissions
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              If you choose to use the camera, photo attachment, or backup features (such as photographing academy whiteboards, mat snapshots, competition medals, or saving JSON exports):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-neutral-300">
              <li><strong className="text-white">Local Processing Only:</strong> Any device permissions requested (such as camera access or local storage read/write) are strictly utilized locally on-device to enable feature functionality and never transmit data externally.</li>
              <li><strong className="text-white">Zero Remote Uploads:</strong> Images are compressed and stored directly within your device's local storage. No photo or video file is ever uploaded, shared, or sent to external servers or third parties.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-xs font-black">4</span>
              Minor Practitioner & Child Privacy (COPPA & GDPR-K)
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              RollDex does not solicit or knowingly collect any personal information from children under 13 (or under 16/18 depending on jurisdiction). Because the software operates entirely offline without data collection or account creation, no child data is ever processed or stored on remote servers. Minor practitioners must utilize the application with parental/guardian authorization under active adult supervision.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-xs font-black">5</span>
              Proprietary Code & Intellectual Property
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              All rights reserved. RollDex, its visual interface, icon design, and software architecture are proprietary intellectual property. Unauthorized decompilation, reverse engineering, redistribution, scraping, or commercial resale of the software without express authorization is prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-neutral-800 text-amber-400 flex items-center justify-center text-xs font-black">6</span>
              Passive Journal Utility & Physical Activity Disclaimer
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              RollDex is strictly a self-directed recording and journaling tool. It does not provide martial arts instruction, technique guidance, safety coaching, or medical diagnosis. Brazilian Jiu-Jitsu and martial arts involve inherent physical risks of injury; users assume all risk and participate solely under qualified in-person coaching.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © 2026 RollDex. All rights reserved. • 100% Free Offline BJJ Training Journal
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl border border-neutral-700 transition-colors"
          >
            Open RollDex Application
          </a>
        </div>

      </div>
    </div>
  );
};
