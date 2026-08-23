import React, { useState } from 'react';
import { Printer, Shield, ArrowLeft, Download, CheckCircle2, Copy, FileCode, Check } from 'lucide-react';

interface LegalPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchOnboarding?: () => void;
}

export const LegalPdfModal: React.FC<LegalPdfModalProps> = ({ isOpen, onClose, onLaunchOnboarding }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // Fallback if print is blocked by iframe sandbox
      handleDownloadHtml();
    }
  };

  const getDocumentText = () => {
    return `ROLLDEX™ — OFFICIAL LEGAL TERMS, PHYSICAL RISK ASSUMPTION & PRIVACY POLICY
================================================================================
Application: RollDex (Brazilian Jiu-Jitsu Training Journal & Technique Logbook)
Effective Date: August 2026
Software Version: 1.0 (Public Release)
Architecture: 100% On-Device Offline Storage (Zero Remote Telemetry)
================================================================================

1. NATURE OF SOFTWARE: PASSIVE RECORDING UTILITY ONLY (NO INSTRUCTIONAL ADVICE)
RollDex is strictly a private, self-directed recording journal and digital logbook designed solely for practitioners to record their own in-person training notes, mat hours, competition records, and personal belt progression.
- No Instructional Coaching: RollDex does not provide martial arts instruction, technique tutorials, fighting advice, self-defense coaching, training plans, or workout prescriptions.
- No Medical or Safety Guidance: Nothing contained in this application or entered by the user constitutes medical, orthopedic, physiological, or athletic advice.
- Supervised Training Only: All martial arts techniques should only be practiced under the direct, physical supervision of qualified, certified martial arts instructors in a properly equipped facility.

2. MARTIAL ARTS INHERENT RISK ASSUMPTION & RELEASE OF LIABILITY
Brazilian Jiu-Jitsu (BJJ), submission grappling, wrestling, Judo, and related combat sports are inherently dangerous physical activities. Physical participation carries severe, unavoidable risks of catastrophic bodily injury, including but not limited to:
- Broken bones, joint dislocations, and ligament tears (ACL, MCL, meniscus, rotator cuff);
- Neck, spinal cord, and cervical injuries;
- Head trauma, concussions, and neurological injuries;
- Cardiac arrest or respiratory distress;
- Soft tissue damage, cuts, abrasions, and mat-borne infections;
- Permanent paralysis or death.

BY USING THIS SOFTWARE AND ENGAGING IN MARTIAL ARTS TRAINING, THE USER VOLUNTARILY, KNOWINGLY, AND EXPLICITLY ASSUMES ALL INHERENT RISKS OF PHYSICAL INJURY, ILLNESS, PARALYSIS, OR DEATH.

To the fullest extent permitted by applicable law, you hereby release, waive, discharge, and hold harmless the creators, developers, owners, distributors, and affiliates of RollDex from any and all liability, claims, demands, actions, or causes of action arising out of or related to any physical injury, property damage, or wrongful death occurring during or following your martial arts training sessions, sparring rounds, drills, or competitions.

3. AGE RESTRICTION & MINOR / GUARDIAN AUTHORIZATION
- Minimum Age Requirement: RollDex is intended for use by individuals who are at least eighteen (18) years of age or the age of legal majority in their jurisdiction.
- Youth Practitioners & Minor Consent: If this software is utilized by or on behalf of a minor under the age of 18 (e.g., a youth BJJ student), the parent or legal guardian represents and warrants that they have reviewed and agreed to these Terms, the Physical Risk Assumption, and the Privacy Policy on behalf of the minor, and consent to the minor’s use of this digital logbook.

4. PRIVACY POLICY, ZERO TELEMETRY & DEVICE PERMISSIONS
RollDex operates under a strict, verifiable Zero-Data Collection and Offline Privacy model:
- Local-Only Data Storage: All training entries, technique notes, sparring counts, photos, tournament medals, and profile information are stored strictly and exclusively on your local device (browser LocalStorage / local device storage).
- Device Hardware & Storage Permissions: Any device permissions requested (such as camera access or local storage read/write) are strictly utilized locally on-device to enable feature functionality (such as capturing whiteboard notes or saving JSON backups) and never transmit data externally.
- Zero Remote Telemetry & Tracking: RollDex contains 0 remote tracking scripts, 0 advertising SDKs, 0 Google Analytics/tracking pixels, 0 background crash reporting services, and 0 remote servers collecting personal data.
- No Account Creation Required: No email address, phone number, password, or credit card is required to use the software.
- Data Ownership & Portability: Users own 100% of their data and can export JSON backups or purge local records at any time.

5. PROPRIETARY RIGHTS & COMMERCIAL RESTRICTIONS
RollDex, including its original user interface layouts, visual identity, branding, icon designs, code architecture, and styling, is the proprietary intellectual property of the software authors. All rights are reserved. You may not copy, modify, distribute, sell, lease, sublicense, reverse engineer, decompile, or extract the source code of RollDex, nor may you scrape, harvest, or commercialize the software or its user interface without prior written authorization from the copyright holder.

6. DISCLAIMER OF WARRANTIES & "AS-IS" PROVISION
RollDex is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, implied, statutory, or otherwise, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or error-free operation. Users are strongly encouraged to utilize the built-in JSON export feature to maintain independent backups of their training records.

7. THIRD-PARTY TRADEMARKS & NON-AFFILIATION DISCLAIMER
RollDex is an independent training utility. All third-party trademarks, organization names, competition logos, and academy designations referenced or recorded by users within their personal notes (including but not limited to IBJJF, ADCC, AJP, Gracie Barra, Gracie University, Checkmat, Alliance, Atos, 10th Planet, or other martial arts federations and academies) are the property of their respective trademark owners. References to martial arts belts, ranking structures, techniques, or tournament names are purely descriptive and do not imply any affiliation with, sponsorship by, or endorsement from any third-party governing body or academy.

8. GOVERNING LAW & SEVERABILITY
These Terms and agreements shall be governed by and construed in accordance with the laws of the jurisdiction in which the software author resides, without giving effect to any principles of conflicts of law. If any provision of these Terms is found to be unlawful, void, or for any reason unenforceable, then that provision shall be deemed severable from these Terms and shall not affect the validity and enforceability of any remaining provisions.

9. MANDATORY CLICKWRAP VERIFICATION PROTOCOL
Upon initial launch, RollDex deploys a blocking, modal gateway requiring affirmative selection of two distinct checkboxes (Age/Guardian Consent and Risk/Terms Acceptance). Progression to the core application is architecturally disabled until both conditions are satisfied and cryptographically recorded into local device storage with an ISO timestamp.

================================================================================
© 2026 RollDex. All Rights Reserved. • Official Legal Terms & Physical Risk Archive
================================================================================`;
  };

  const handleDownloadDoc = () => {
    const text = getDocumentText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RollDex_Legal_Terms_and_Liability_v1.0.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>RollDex Legal Terms & Physical Risk Disclaimer</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #111; }
    h1 { font-size: 22px; border-bottom: 2px solid #222; padding-bottom: 8px; }
    h2 { font-size: 15px; margin-top: 24px; text-transform: uppercase; color: #000; }
    p, li { font-size: 13.5px; color: #333; }
    .box { background: #f8f9fa; border-left: 4px solid #f59e0b; padding: 12px; margin: 16px 0; font-size: 12.5px; }
    @media print { body { margin: 0; max-width: 100%; } }
  </style>
</head>
<body>
  <h1>RollDex™ Legal Terms, Physical Risk Assumption & Zero-Telemetry Privacy Policy</h1>
  <div class="box"><strong>SUMMARY:</strong> Passive journal utility only. No instructional or medical advice. Explicit assumption of inherent martial arts physical risks. 100% on-device local storage.</div>
  ${getDocumentText().split('\n\n').map(p => {
    if (p.startsWith('1.') || p.startsWith('2.') || p.startsWith('3.') || p.startsWith('4.') || p.startsWith('5.') || p.startsWith('6.') || p.startsWith('7.') || p.startsWith('8.') || p.startsWith('9.')) {
      return `<h2>${p.split('\n')[0]}</h2><p>${p.split('\n').slice(1).join('<br>')}</p>`;
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RollDex_Legal_Terms_Archive_v1.0.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getDocumentText());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex justify-center p-2 sm:p-4">
      <div className="bg-white text-neutral-900 rounded-2xl w-full max-w-4xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Control Bar - Hidden during printing */}
        <div className="bg-neutral-950 text-white px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Official Legal Terms & Physical Risk Archive</h2>
              <p className="text-[11px] text-neutral-400">Download, copy, or print for court and Play Store compliance records</p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleDownloadDoc}
              type="button"
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
              title="Download text file directly to your device"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download .TXT</span>
            </button>

            <button
              onClick={handleDownloadHtml}
              type="button"
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
              title="Download clean HTML document ready for Chrome/Edge PDF export"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Download HTML</span>
            </button>

            <button
              onClick={handleCopyText}
              type="button"
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
              title="Copy entire legal document text to paste into Word or Google Docs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              type="button"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            {onLaunchOnboarding && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchOnboarding();
                }}
                type="button"
                className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/50 font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Launch the 2-checkbox onboarding screen to take screenshots"
              >
                <span>📸 Screenshot Gate</span>
              </button>
            )}

            <button
              onClick={onClose}
              type="button"
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-sm text-neutral-700 leading-relaxed font-sans print:p-0 print:text-black print:overflow-visible">
          {/* Header */}
          <div className="border-b border-neutral-200 pb-5">
            <div className="inline-block text-[11px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md mb-2">
              Official Legal Document • Version 1.0
            </div>
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              RollDex™ Terms of Use, Physical Training Liability Waiver & Zero-Telemetry Privacy Policy
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              <strong>Application:</strong> RollDex (Brazilian Jiu-Jitsu Training Journal) | <strong>Effective Date:</strong> August 2026 | <strong>Architecture:</strong> 100% On-Device Offline Storage
            </p>
          </div>

          {/* Critical Callout */}
          <div className="bg-neutral-50 border-l-4 border-amber-500 p-4 rounded-r-lg text-xs text-neutral-800 leading-relaxed">
            <strong>CRITICAL SUMMARY:</strong> RollDex is strictly a private, passive personal training logbook. It does not provide martial arts instruction, fighting advice, or medical guidance. Martial arts training involves inherent risks of severe physical trauma. By using RollDex, users voluntarily assume all inherent risks. RollDex operates with 100% on-device data storage with zero remote telemetry or user tracking.
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-neutral-900 uppercase tracking-wide">
              1. Nature of Software: Passive Recording Utility Only (No Instructional Advice)
            </h3>
            <p>
              RollDex is strictly a private, self-directed recording journal and digital logbook designed solely for practitioners to record their own in-person training notes, mat hours, competition records, and personal belt progression.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600 text-xs">
              <li><strong>No Instructional Coaching:</strong> RollDex does not provide martial arts instruction, technique tutorials, fighting advice, self-defense coaching, training plans, or workout prescriptions.</li>
              <li><strong>No Medical or Safety Guidance:</strong> Nothing contained in this application or entered by the user constitutes medical, orthopedic, physiological, or athletic advice.</li>
              <li><strong>Supervised Training Only:</strong> All martial arts techniques should only be practiced under the direct, physical supervision of qualified, certified martial arts instructors in a properly equipped facility.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-neutral-900 uppercase tracking-wide">
              2. Martial Arts Inherent Risk Assumption & Release of Liability
            </h3>
            <p>
              Brazilian Jiu-Jitsu (BJJ), submission grappling, wrestling, Judo, and related combat sports are inherently dangerous physical activities. Physical participation carries severe, unavoidable risks of catastrophic bodily injury, including but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600 text-xs">
              <li>Broken bones, joint dislocations, and ligament tears (ACL, MCL, meniscus, rotator cuff);</li>
              <li>Neck, spinal cord, and cervical injuries;</li>
              <li>Head trauma, concussions, and neurological injuries;</li>
              <li>Cardiac arrest or respiratory distress;</li>
              <li>Soft tissue damage, cuts, abrasions, and mat-borne infections;</li>
              <li>Permanent paralysis or death.</li>
            </ul>
            <p className="font-bold text-neutral-900">
              BY USING THIS SOFTWARE AND ENGAGING IN MARTIAL ARTS TRAINING, THE USER VOLUNTARILY, KNOWINGLY, AND EXPLICITLY ASSUMES ALL INHERENT RISKS OF PHYSICAL INJURY, ILLNESS, PARALYSIS, OR DEATH.
            </p>
            <p className="text-xs text-neutral-600">
              To the fullest extent permitted by applicable law, you hereby release, waive, discharge, and hold harmless the creators, developers, owners, distributors, and affiliates of RollDex from any and all liability, claims, demands, actions, or causes of action arising out of or related to any physical injury, property damage, or wrongful death occurring during or following your martial arts training sessions, sparring rounds, drills, or competitions.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-neutral-900 uppercase tracking-wide">
              3. Age Restriction & Minor / Guardian Authorization
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600 text-xs">
              <li><strong>Minimum Age Requirement:</strong> RollDex is intended for use by individuals who are at least eighteen (18) years of age or the age of legal majority in their jurisdiction.</li>
              <li><strong>Youth Practitioners & Minor Consent:</strong> If this software is utilized by or on behalf of a minor under the age of 18 (e.g., a youth BJJ student), the parent or legal guardian represents and warrants that they have reviewed and agreed to these Terms, the Physical Risk Assumption, and the Privacy Policy on behalf of the minor, and consent to the minor’s use of this digital logbook.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-neutral-900 uppercase tracking-wide">
              4. Privacy Policy, Zero Telemetry & Device Permissions
            </h3>
            <p>
              RollDex operates under a strict, verifiable Zero-Data Collection and Offline Privacy model:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600 text-xs">
              <li><strong>Local-Only Data Storage:</strong> All training entries, technique notes, sparring counts, photos, tournament medals, and profile information are stored strictly and exclusively on your local device (browser LocalStorage / local device storage).</li>
              <li><strong>Device Hardware & Storage Permissions:</strong> Any device permissions requested (such as camera access or local storage read/write) are strictly utilized locally on-device to enable feature functionality (such as capturing whiteboard notes or saving JSON backups) and never transmit data externally.</li>
              <li><strong>Zero Remote Telemetry & Tracking:</strong> RollDex contains 0 remote tracking scripts, 0 advertising SDKs, 0 Google Analytics/tracking pixels, 0 background crash reporting services, and 0 remote servers collecting personal data.</li>
              <li><strong>No Account Creation Required:</strong> No email address, phone number, password, or credit card is required to use the software.</li>
              <li><strong>Data Ownership & Portability:</strong> Users own 100% of their data and can export JSON backups or purge local records at any time.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-neutral-900 uppercase tracking-wide">
              5. Proprietary Rights & Commercial Restrictions
            </h3>
            <p className="text-xs text-neutral-600">
              RollDex, including its original user interface layouts, visual identity, branding, icon designs, code architecture, and styling, is the proprietary intellectual property of the software authors. All rights are reserved. You may not copy, modify, distribute, sell, lease, sublicense, reverse engineer, decompile, or extract the source code of RollDex, nor may you scrape, harvest, or commercialize the software or its user interface without prior written authorization from the copyright holder.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-neutral-900 uppercase tracking-wide">
              6. Disclaimer of Warranties & "AS-IS" Provision
            </h3>
            <p className="text-xs text-neutral-600">
              RollDex is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, implied, statutory, or otherwise, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, or error-free operation. Users are strongly encouraged to utilize the built-in JSON export feature to maintain independent backups of their training records.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-neutral-900 uppercase tracking-wide">
              7. Third-Party Trademarks & Non-Affiliation Disclaimer
            </h3>
            <p className="text-xs text-neutral-600">
              RollDex is an independent training utility. All third-party trademarks, organization names, competition logos, and academy designations referenced or recorded by users within their personal notes (including but not limited to IBJJF, ADCC, AJP, Gracie Barra, Gracie University, Checkmat, Alliance, Atos, 10th Planet, or other martial arts federations and academies) are the property of their respective trademark owners. References to martial arts belts, ranking structures, techniques, or tournament names are purely descriptive and do not imply any affiliation with, sponsorship by, or endorsement from any third-party governing body or academy.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-2">
            <h3 className="font-bold text-base text-neutral-900 uppercase tracking-wide">
              8. Mandatory Clickwrap Verification Protocol
            </h3>
            <p className="text-xs text-neutral-600">
              Upon initial launch, RollDex deploys a blocking, modal gateway requiring affirmative selection of two distinct checkboxes (Age/Guardian Consent and Risk/Terms Acceptance). Progression to the core application is architecturally disabled until both conditions are satisfied and cryptographically recorded into local device storage with an ISO timestamp.
            </p>
          </div>

          {/* Document Footer */}
          <div className="border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500">
            <p>© 2026 RollDex. All Rights Reserved. • Official Legal Terms & Physical Risk Assumption Archive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

