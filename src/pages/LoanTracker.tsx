import React, { useState, useEffect, useMemo } from 'react';
import { getRecentSavedApplications, fetchSavedApplication } from '../firebase';

// Lightweight inline icons
const Search = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

const CheckCircle2 = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const Clock = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldCheck = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const FileText = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
  </svg>
);

const ArrowDownCircle = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><polyline points="8 12 12 16 16 12" /><line x1="12" x2="12" y1="8" y2="16" />
  </svg>
);

const Copy = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const Phone = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Mail = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const Printer = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" />
  </svg>
);

export interface LoanTrackerProps {
  initialAppId?: string;
  onBackToHome: () => void;
  onStartNewApplication: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export type StageKey = 1 | 2 | 3 | 4 | 5;

interface StageInfo {
  step: StageKey;
  key: string;
  title: string;
  eyebrow: string;
  statusBadge: string;
  statusType: 'completed' | 'active' | 'pending';
  estimatedTime: string;
  description: string;
  actionRequired?: string;
  checklist: string[];
}

export default function LoanTracker({
  initialAppId = '',
  onBackToHome,
  onStartNewApplication,
  theme,
  toggleTheme,
}: LoanTrackerProps) {
  const [searchInput, setSearchInput] = useState(initialAppId);
  const [currentAppId, setCurrentAppId] = useState(initialAppId || 'MQ-APP-782914');
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [currentStage, setCurrentStage] = useState<StageKey>(2); // Default to Stage 2: KYC & Verification

  // Recent applications from storage
  const [recentApps, setRecentApps] = useState<Record<string, any>[]>([]);
  const [activeAppData, setActiveAppData] = useState<Record<string, any> | null>(null);

  // Deduplicate recent applications chips by applicationId so IDs never repeat
  const uniqueRecentApps = useMemo(() => {
    const seen = new Set<string>();
    return recentApps.filter((app) => {
      const id = String(app.applicationId || '').trim();
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [recentApps]);

  // Load recent applications
  useEffect(() => {
    const list = getRecentSavedApplications();
    setRecentApps(list);

    // If an initialAppId is passed or there are saved apps, pick the most relevant one
    const targetId = initialAppId || (list.length > 0 ? list[0].applicationId : 'MQ-APP-782914');
    loadApplicationData(targetId);
  }, [initialAppId]);

  const loadApplicationData = async (query: string) => {
    setIsSearching(true);
    setSearchError('');
    try {
      const data = await fetchSavedApplication(query);
      if (data) {
        setActiveAppData(data);
        setCurrentAppId(data.applicationId || query);
        setSearchInput(data.applicationId || query);
        // Load the stored stage or map from status
        if (typeof data.currentStage === 'number' && data.currentStage >= 1 && data.currentStage <= 5) {
          setCurrentStage(data.currentStage as StageKey);
        } else if (data.status === 'disbursed') {
          setCurrentStage(5);
        } else if (data.status === 'sanctioned') {
          setCurrentStage(4);
        } else if (data.status === 'underwriting') {
          setCurrentStage(3);
        } else if (data.status === 'verification' || data.status === 'pending_agent_call') {
          setCurrentStage(2);
        } else if (data.status === 'submitted') {
          setCurrentStage(1);
        } else {
          setCurrentStage(2);
        }
      } else {
        // Fallback simulated record with this specific ID
        const normalizedId = query.toUpperCase().startsWith('MQ-') ? query.toUpperCase() : `MQ-APP-${query.slice(-6) || '782914'}`;
        setCurrentAppId(normalizedId);
        setActiveAppData({
          applicationId: normalizedId,
          applicantName: 'Business Owner',
          requestedAmount: '₹ 25,00,000',
          loanPurpose: 'Working Capital & Expansion',
          selectedBusinessType: 'Private Limited / MSME',
          phone: '+91 98765 43210',
          email: 'applicant@business.in',
          estimatedEmi: '₹ 65,400',
          submittedAt: new Date().toISOString(),
          status: 'verification',
          currentStage: 2,
        });
        setCurrentStage(2);
      }
    } catch (err) {
      console.warn('Load app data error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStageChange = (newStage: StageKey) => {
    setCurrentStage(newStage);
    // Persist stage update locally for this specific application
    try {
      const list = getRecentSavedApplications();
      const statusMap: Record<StageKey, string> = {
        1: 'submitted',
        2: 'verification',
        3: 'underwriting',
        4: 'sanctioned',
        5: 'disbursed',
      };
      const updated = list.map((app) => {
        if (app.applicationId === currentAppId) {
          return { ...app, currentStage: newStage, status: statusMap[newStage] };
        }
        return app;
      });
      localStorage.setItem('moneyquick_saved_applications', JSON.stringify(updated));
      setRecentApps(updated);
    } catch (e) {
      console.warn('Could not persist stage update:', e);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setSearchError('Please enter an Application ID or registered Mobile Number.');
      return;
    }
    loadApplicationData(searchInput.trim());
  };

  const copyAppId = () => {
    navigator.clipboard.writeText(currentAppId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Define 5 standard stages
  const stages: StageInfo[] = useMemo(() => [
    {
      step: 1,
      key: 'submission',
      title: 'Application Received',
      eyebrow: 'Stage 1 of 5',
      statusBadge: currentStage >= 1 ? 'Completed' : 'Pending',
      statusType: currentStage > 1 ? 'completed' : currentStage === 1 ? 'active' : 'pending',
      estimatedTime: 'Instant · Confirmed',
      description: 'Your loan application and initial cash-flow profile have been securely received and recorded in our digital lending system.',
      checklist: [
        'Application Reference ID generated',
        'SMS & Email confirmation receipt dispatched',
        'Preliminary business cash flow metrics validated',
      ],
    },
    {
      step: 2,
      key: 'kyc_verification',
      title: 'KYC & Document Verification',
      eyebrow: 'Stage 2 of 5',
      statusBadge: currentStage > 2 ? 'Completed' : currentStage === 2 ? 'In Progress' : 'Upcoming',
      statusType: currentStage > 2 ? 'completed' : currentStage === 2 ? 'active' : 'pending',
      estimatedTime: 'Typical: 2–6 Hours',
      description: 'Our verification desk is authenticating your business credentials, PAN, GST filings, and 6-month bank statement cash flows.',
      actionRequired: 'A MONEYQUICK verification specialist may contact you to confirm identity details.',
      checklist: [
        'Business PAN & Registration authentication',
        'Credit Bureau (CIBIL / Experian) check completed',
        '6-Month bank statement cash surplus parsed',
        'Dedicated verification specialist assigned',
      ],
    },
    {
      step: 3,
      key: 'underwriting',
      title: 'Credit Underwriting & Assessment',
      eyebrow: 'Stage 3 of 5',
      statusBadge: currentStage > 3 ? 'Completed' : currentStage === 3 ? 'Underwriting Desk' : 'Upcoming',
      statusType: currentStage > 3 ? 'completed' : currentStage === 3 ? 'active' : 'pending',
      estimatedTime: 'Typical: 12–24 Hours',
      description: 'Partner NBFC underwriting committee is evaluating your debt-service capability (DSCR) to formulate optimal loan limits and interest pricing.',
      checklist: [
        'Debt-Service Coverage Ratio (DSCR) modeling',
        'Co-lending pool partner matching',
        'Custom repayment tenure & EMI scheduling',
      ],
    },
    {
      step: 4,
      key: 'sanction',
      title: 'Sanction Letter & Terms',
      eyebrow: 'Stage 4 of 5',
      statusBadge: currentStage > 4 ? 'Approved & Signed' : currentStage === 4 ? 'Action Required' : 'Upcoming',
      statusType: currentStage > 4 ? 'completed' : currentStage === 4 ? 'active' : 'pending',
      estimatedTime: 'Instant upon review',
      description: 'Official Sanction Letter and Key Fact Statement (KFS) issued specifying approved principal, Annual Percentage Rate (APR), and repayment terms.',
      actionRequired: 'Review sanction terms and accept digital agreement via Aadhaar OTP.',
      checklist: [
        'Key Fact Statement (KFS) generated compliant with RBI guidelines',
        'Transparent interest rate and zero hidden fees confirmed',
        'Borrower digital consent & e-Sign pending',
      ],
    },
    {
      step: 5,
      key: 'disbursement',
      title: 'e-Mandate & Escrow Disbursement',
      eyebrow: 'Stage 5 of 5',
      statusBadge: currentStage === 5 ? 'Funds Disbursed' : 'Upcoming',
      statusType: currentStage === 5 ? 'completed' : 'pending',
      estimatedTime: 'Same Day Disbursement',
      description: 'Automated NPCI e-NACH mandate registered. Disbursal initiated from RBI-compliant nodal escrow directly to borrower bank account.',
      checklist: [
        'NPCI e-NACH / AutoPay mandate registration',
        'Multi-bank escrow routing confirmed',
        'Direct NEFT/RTGS credit to verified bank account',
      ],
    },
  ], [currentStage]);

  const activeStageInfo = stages[currentStage - 1];

  const progressPercentage = useMemo(() => {
    switch (currentStage) {
      case 1: return 20;
      case 2: return 40;
      case 3: return 65;
      case 4: return 85;
      case 5: return 100;
      default: return 40;
    }
  }, [currentStage]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-highlight selection:text-primary pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="flex items-center gap-2 sm:gap-3 text-left transition hover:opacity-85"
            >
              <img
                src="/3b6903f8-23e4-4c03-9082-3fe23e47cd11.png"
                alt="MONEYQUICK Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
              <div>
                <div className="text-[15px] sm:text-[17px] font-extrabold tracking-tight text-primary">MONEYQUICK</div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-accent hidden xs:block">Loan Tracking Desk</div>
              </div>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-primary shadow-sm transition hover:border-accent hover:text-accent"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToHome}
              className="rounded-lg border border-border px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-muted-foreground hover:bg-surface hover:text-primary transition"
            >
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </button>

            <button
              type="button"
              onClick={onStartNewApplication}
              className="rounded-lg bg-accent px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#5145CE] transition whitespace-nowrap"
            >
              <span className="hidden sm:inline">New Application &rarr;</span>
              <span className="sm:hidden">Apply &rarr;</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Live Underwriting Tracker
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Track Your Loan Application
            </h1>
            <p className="mt-2 text-base text-muted-foreground sm:text-lg max-w-2xl">
              Real-time transparent visibility into every milestone of your loan journey, from document verification to digital escrow disbursal.
            </p>
          </div>

          {/* Quick Print/Save Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-primary transition hover:border-accent hover:text-accent shadow-sm"
          >
            <Printer size={16} />
            <span>Print / Save Status</span>
          </button>
        </div>

        {/* Universal Search & Quick Chip Bar */}
        <div className="mt-8 rounded-2xl border border-border bg-surface/70 p-4 sm:p-6 shadow-sm backdrop-blur-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Application ID (e.g. MQ-APP-782914) or Mobile Number"
                className="w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm font-semibold text-primary placeholder:text-muted-foreground/60 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#5145CE] active:scale-[0.98] disabled:opacity-50"
            >
              {isSearching ? 'Searching…' : 'Track Status →'}
            </button>
          </form>

          {searchError && (
            <p className="mt-2.5 text-xs font-medium text-destructive">{searchError}</p>
          )}

          {/* Quick Select Saved Applications (Deduplicated) */}
          {uniqueRecentApps.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recent Applications:
              </span>
              {uniqueRecentApps.slice(0, 4).map((app, idx) => (
                <button
                  key={app.applicationId || idx}
                  type="button"
                  onClick={() => loadApplicationData(app.applicationId)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium transition ${
                    currentAppId === app.applicationId
                      ? 'border-accent bg-accent/15 text-accent font-bold'
                      : 'border-border bg-background text-muted-foreground hover:border-accent hover:text-primary'
                  }`}
                >
                  <span>{app.applicationId}</span>
                  {app.requestedAmount && <span className="opacity-75">({app.requestedAmount})</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hero Application Status Overview Banner */}
        <div className="mt-8 rounded-3xl border border-border bg-gradient-to-br from-surface to-background p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reference Number</span>
                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1 font-mono text-sm font-bold text-primary">
                  <span>{currentAppId}</span>
                  <button
                    type="button"
                    onClick={copyAppId}
                    title="Copy Application ID"
                    className="text-muted-foreground hover:text-accent transition"
                  >
                    <Copy size={14} />
                  </button>
                  {copied && <span className="text-[10px] text-emerald-500 font-sans font-semibold">Copied!</span>}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-extrabold text-primary sm:text-3xl">
                  {activeAppData?.applicantName || 'Applicant'} · {activeAppData?.selectedBusinessType || 'Business'}
                </h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold ${
                  currentStage === 5
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : currentStage === 4
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-accent/15 text-accent'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    currentStage === 5 ? 'bg-emerald-500' : currentStage === 4 ? 'bg-amber-500' : 'bg-accent animate-ping'
                  }`} />
                  {activeStageInfo.statusBadge}
                </span>
              </div>
            </div>

            {/* Overall Progress Gauge */}
            <div className="w-full lg:w-72">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-wider">Overall Progress</span>
                <span className="text-accent">{progressPercentage}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-[#0B8F83] transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="mt-2 text-right text-[11px] font-medium text-muted-foreground">
                {activeStageInfo.eyebrow} · {activeStageInfo.title}
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Requested Amount</div>
              <div className="mt-1 text-xl font-bold text-primary">{activeAppData?.requestedAmount || '₹ 25,00,000'}</div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Estimated EMI</div>
              <div className="mt-1 text-xl font-bold text-accent">{activeAppData?.estimatedEmi || '₹ 65,400'}</div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Purpose</div>
              <div className="mt-1 text-sm font-bold text-primary truncate" title={activeAppData?.loanPurpose || 'Working Capital'}>
                {activeAppData?.loanPurpose || 'Working Capital'}
              </div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-background/80 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Est. Turnaround</div>
              <div className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {activeStageInfo.estimatedTime}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Demo Stage Simulator Switcher */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">⚙</span>
            <div>
              <div className="text-xs font-bold text-primary">Stage Simulator (Interactive Demo Preview)</div>
              <div className="text-[11px] text-muted-foreground">Click any milestone below to preview how your application appears at that exact stage:</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4, 5].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => handleStageChange(st as StageKey)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  currentStage === st
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-surface text-muted-foreground hover:bg-background hover:text-primary'
                }`}
              >
                Stage {st}
              </button>
            ))}
          </div>
        </div>

        {/* 5-Step Visual Progress Timeline */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-primary mb-6">Milestone Progress &amp; Audit Trail</h3>

          {/* Desktop Timeline (horizontal cards) */}
          <div className="grid gap-3 sm:grid-cols-5">
            {stages.map((stage) => {
              const isPast = stage.step < currentStage;
              const isCurrent = stage.step === currentStage;
              const isFuture = stage.step > currentStage;

              return (
                <div
                  key={stage.step}
                  onClick={() => handleStageChange(stage.step)}
                  className={`cursor-pointer rounded-2xl border p-4.5 transition-all duration-300 relative text-left ${
                    isCurrent
                      ? 'border-accent bg-surface ring-2 ring-accent/20 shadow-lg -translate-y-1'
                      : isPast
                      ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60'
                      : 'border-border bg-background/50 opacity-70 hover:opacity-100 hover:border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${
                      isPast
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-accent text-white shadow-md'
                        : 'bg-surface text-muted-foreground'
                    }`}>
                      {isPast ? <CheckCircle2 size={16} /> : `0${stage.step}`}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${
                      isPast
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : isCurrent
                        ? 'bg-accent/15 text-accent'
                        : 'bg-surface text-muted-foreground'
                    }`}>
                      {isPast ? 'Done' : isCurrent ? 'Active' : 'Pending'}
                    </span>
                  </div>

                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stage.eyebrow}</div>
                  <div className="mt-1 text-sm font-bold text-primary leading-snug">{stage.title}</div>
                  <div className="mt-2 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {stage.estimatedTime}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Stage Deep Breakdown & Checklist */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Main Stage Detail Card (2 cols) */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                {currentStage === 1 && <Clock size={20} />}
                {currentStage === 2 && <ShieldCheck size={20} />}
                {currentStage === 3 && <FileText size={20} />}
                {currentStage === 4 && <FileText size={20} />}
                {currentStage === 5 && <ArrowDownCircle size={20} />}
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">{activeStageInfo.eyebrow} Details</span>
                <h3 className="text-xl font-bold text-primary sm:text-2xl">{activeStageInfo.title}</h3>
              </div>
            </div>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {activeStageInfo.description}
            </p>

            {/* Action Required Banner if any */}
            {activeStageInfo.actionRequired && (
              <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm font-medium text-amber-700 dark:text-amber-300">
                <span className="font-bold">Next Action Required: </span>
                {activeStageInfo.actionRequired}
              </div>
            )}

            {/* Completed Checks & Underwriting Tasks */}
            <div className="mt-6">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Stage Execution Checklist
              </div>
              <div className="space-y-2.5">
                {activeStageInfo.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={13} />
                    </span>
                    <span className="text-sm font-medium text-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Underwriting Specialist & Help Card (1 col) */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-md">
              <div className="text-xs font-bold uppercase tracking-wider text-accent">Assigned Loan Desk</div>
              <h4 className="mt-1 text-lg font-bold text-primary">Priority Support &amp; Review</h4>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-background p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground">Direct Desk Helpline</div>
                    <div className="text-sm font-bold text-primary">+91 1800 419 7890</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-background p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground">Underwriting Desk Email</div>
                    <div className="text-xs font-bold text-primary break-all">underwriting@moneyquick.in</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-background/80 p-3.5 text-xs text-muted-foreground leading-relaxed">
                Operating Hours: Mon–Sat, 9:30 AM to 7:00 PM IST. Quote your Reference ID <strong>#{currentAppId}</strong> for priority tracking.
              </div>
            </div>

            {/* Regulatory Compliance Badge */}
            <div className="rounded-3xl border border-border bg-gradient-to-br from-surface to-background p-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 font-bold text-primary text-sm mb-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                RBI Digital Lending Guidelines Compliant
              </div>
              All partner NBFCs, escrow payout pathways, and credit data verifications operate in strict adherence to RBI Master Directions on Digital Lending.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
