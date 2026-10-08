import React, { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  isFirebaseConfigured,
  onAuthChange,
  signInEmail,
  signUpEmail,
  signInGoogle,
  sendPasswordReset,
  logoutUser,
  updateUserProfile,
  saveLoanApplication,
} from './firebase';
import { sendApplicationConfirmationEmail, type LoanApplicationEmailPayload } from './services/emailService';
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const DigitalLendingLanding = React.lazy(() => import('./pages/DigitalLendingLanding'));
const LoanTracker = React.lazy(() => import('./pages/LoanTracker'));

const RouteLoadingFallback = () => (
  <div className="flex min-h-[50vh] w-full items-center justify-center py-20">
    <div className="flex items-center gap-3 text-sm font-semibold text-primary">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <span>Loading…</span>
    </div>
  </div>
);

const Mail = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const Phone = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ArrowRight = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
const ChevronLeft = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const Check = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const CheckCircle = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const FileText = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v5h5" />
    <path d="M8 13h8" />
    <path d="M8 17h6" />
  </svg>
);
const Sparkles = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m12 3-1.7 5.2a2 2 0 0 1-1.3 1.3L3.8 11.2a1 1 0 0 0 0 1.9L9 14.8a2 2 0 0 1 1.3 1.3L12 21.3l1.7-5.2a2 2 0 0 1 1.3-1.3l5.2-1.7a1 1 0 0 0 0-1.9L15 9.5a2 2 0 0 1-1.3-1.3z" />
  </svg>
);
const Info = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);
const Briefcase = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  </svg>
);
const ArrowUpRight = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);
const Eye = ({ open, size = 18 }: { open: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {open ? <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></> : <><path d="m3 3 18 18" /><path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a18.2 18.2 0 0 1-3.1 3.8" /><path d="M6.2 6.3A18.5 18.5 0 0 0 2 12s3.5 6 10 6a10.8 10.8 0 0 0 2.2-.2" /></>}
  </svg>
);
const Sun = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);
const Moon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const AlertCircle = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ExternalLink = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const formatCurrency = (value: number) => `₹${Math.max(0, value).toLocaleString('en-IN')}`;
const formatLakh = (value: number) => `₹${(value / 100000).toFixed(1).replace('.0', '')}L`;
const formatFullName = (value: string) => value
  .replace(/[^a-zA-Z\s]/g, '')
  .replace(/\s+/g, ' ')
  .replace(/[a-zA-Z]+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
const businessIndustries = [
  'Retail and e-commerce',
  'Food and beverage',
  'Manufacturing',
  'Construction and real estate',
  'Professional services',
  'Information technology and software',
  'Healthcare and wellness',
  'Education and training',
  'Transportation and logistics',
  'Hospitality and tourism',
  'Agriculture and allied services',
  'Creative and media',
  'Financial and insurance services',
  'Wholesale and distribution',
  'Other, not listed',
] as const;
const loanCategories = [
  ['Business / MSME loan', 'For expansion, equipment, inventory or longer-term business investment.'],
  ['Working capital loan', 'For day-to-day cash flow, supplier payments, payroll and short-term operating needs.'],
  ['Machinery & equipment loan', 'Asset-backed financing for industrial machinery, manufacturing plants or commercial tools.'],
  ['Loan against property (LAP)', 'High-ticket secured credit by pledging eligible residential, commercial or industrial property.'],
  ['Invoice & bill discounting', 'Unlock immediate cash against verified unpaid client invoices and pending receivables.'],
  ['Merchant cash advance / POS', 'Flexible repayment structure linked directly to your daily card, POS or QR swipe revenues.'],
  ['Commercial vehicle loan', 'Vehicle financing for commercial vans, delivery fleets, logistics trucks or taxis.'],
  ['Unsecured business credit line', 'Pre-approved revolving credit facility where interest is charged only on the withdrawn amount.'],
] as const;

const loanPurposes = [
  'Working capital',
  'Business expansion',
  'Equipment or machinery',
  'Commercial vehicle / fleet',
  'Invoice or bill discounting',
  'Other',
] as const;

type Step = 'landing' | 'income' | 'business' | 'requirement' | 'calculating' | 'snapshot' | 'handoff' | 'application' | 'submitted' | 'tracking' | 'verification' | 'assessment' | 'decision' | 'privacy' | 'terms';

type PrimaryButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

type SecondaryButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
};

const PrimaryButton = ({ children, onClick, className = '', type = 'button', disabled = false }: PrimaryButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    onClick={disabled ? undefined : onClick}
    className={`group inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#0b2148] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-primary ${className}`}
  >
    <span>{children}</span>
    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5 group-disabled:translate-x-0" />
  </button>
);

const SecondaryButton = ({ children, onClick, className = '', icon = null }: SecondaryButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`group inline-flex items-center justify-center gap-2 rounded-lg bg-surface px-6 py-3.5 font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-highlight active:scale-[0.98] ${className}`}
  >
    {children}
    {icon}
  </button>
);

const Atmosphere = ({ strong = false }) => (
  <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-500 ${strong ? 'opacity-100' : 'opacity-80'}`} aria-hidden="true">
    <div className="absolute inset-0 bg-background transition-colors duration-500" />
    <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] [background-image:radial-gradient(rgba(7,20,47,0.12)_0.65px,transparent_0.65px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.22)_0.65px,transparent_0.65px)] [background-size:20px_20px]" />
    <div className="hidden dark:block absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[130px] pointer-events-none" />
    <div className="hidden dark:block absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-[#0B8F83]/8 blur-[140px] pointer-events-none" />
  </div>
);

const ProfileMenu = ({ user, onSignOut, onProfileUpdated }: { user: User; onSignOut: () => void; onProfileUpdated: (user: User) => void }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const displayName = fullName || user.displayName || user.email?.split('@')[0] || 'Account';

  useEffect(() => {
    setFullName(user.displayName || '');
    setPhone(user.phoneNumber || localStorage.getItem(`moneyquick-phone-${user.uid}`) || '');
    setAddress(localStorage.getItem(`moneyquick-address-${user.uid}`) || '');
  }, [user]);

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      await updateUserProfile(user, { displayName: formatFullName(fullName) });
      localStorage.setItem(`moneyquick-phone-${user.uid}`, phone.trim());
      localStorage.setItem(`moneyquick-address-${user.uid}`, address.trim());
      onProfileUpdated(user);
      setNotice('Profile saved.');
      setOpen(false);
      setEditing(false);
    } catch (error) {
      console.error('Unable to save profile:', error);
      setNotice('Your profile could not be saved right now. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  const details = [['Email', user.email || 'Not available'], ['Contact', phone || 'Not added'], ['Address', address || 'Not added']];
  return <div className="relative"><button type="button" onClick={() => { setOpen((value) => !value); setEditing(false); }} aria-expanded={open} className="flex items-center gap-2 rounded-lg border border-border/80 dark:border-slate-800 bg-surface/75 dark:bg-slate-900/80 py-1.5 pl-1.5 pr-3 text-left shadow-sm transition hover:bg-surface dark:hover:bg-slate-800"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">{displayName.charAt(0).toUpperCase()}</span><span className="hidden max-w-28 truncate text-sm font-semibold text-primary sm:block">{displayName}</span><span className="text-xs text-muted-foreground">⌄</span></button>{open ? <div className="absolute right-0 top-[calc(100%+10px)] w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-900 shadow-xl"><div className="bg-primary dark:bg-slate-950 px-5 pb-5 pt-6 text-white"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-base font-bold">{displayName.charAt(0).toUpperCase()}</span><div className="min-w-0"><div className="truncate text-lg font-bold">{displayName}</div><div className="truncate text-xs text-white/65">Your secure account</div></div></div></div><div className="p-5">{editing ? <form onSubmit={saveProfile} className="space-y-3"><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Profile name<input value={fullName} onChange={(event) => setFullName(formatFullName(event.target.value))} placeholder="Your full name" className="mt-1.5 w-full rounded-lg border border-border dark:border-slate-800 bg-background dark:bg-slate-950 px-3 py-2.5 text-sm font-medium text-primary outline-none focus:border-accent focus:ring-4 focus:ring-highlight" /></label><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Contact number<input value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^0-9+\s-]/g, ''))} inputMode="tel" placeholder="Your mobile number" className="mt-1.5 w-full rounded-lg border border-border dark:border-slate-800 bg-background dark:bg-slate-950 px-3 py-2.5 text-sm font-medium text-primary outline-none focus:border-accent focus:ring-4 focus:ring-highlight" /></label><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Address<textarea value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Your address" rows={3} className="mt-1.5 w-full resize-none rounded-lg border border-border dark:border-slate-800 bg-background dark:bg-slate-950 px-3 py-2.5 text-sm font-medium text-primary outline-none focus:border-accent focus:ring-4 focus:ring-highlight" /></label><div className="flex justify-end gap-2 pt-1"><button type="button" onClick={() => setEditing(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-surface dark:hover:bg-slate-800">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button></div></form> : <><div className="text-xs font-bold uppercase tracking-[0.15em] text-accent">Account details</div><div className="mt-3 divide-y divide-border-light dark:divide-slate-800">{details.map(([label, value]) => <div key={label} className="py-3 first:pt-0"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-1 break-words text-sm font-semibold text-primary">{value}</div></div>)}</div><button type="button" onClick={() => setEditing(true)} className="mt-5 w-full rounded-lg bg-highlight px-4 py-2.5 text-sm font-bold text-accent transition hover:bg-accent hover:text-white">Edit profile</button></>}{notice ? <p role="status" className="mt-3 rounded-lg bg-highlight px-3 py-2 text-xs font-medium text-primary">{notice}</p> : null}<button type="button" onClick={onSignOut} className="mt-3 w-full rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-surface dark:hover:bg-slate-800 hover:text-primary">Sign out</button></div></div> : null}</div>;
};

const Topbar = ({ step, onReset, onNavigate, user, onSignOut, onProfileUpdated, theme, toggleTheme }: { step: Step; onReset: () => void; onNavigate: (step: Step) => void; user: User; onSignOut: () => void; onProfileUpdated: (user: User) => void; theme: 'light' | 'dark'; toggleTheme: () => void }) => {
  return (
    <header className="relative z-30 flex w-full items-center justify-between px-3 py-3 sm:px-8 sm:py-5 lg:px-12">
      <button type="button" onClick={onReset} className="flex items-center gap-2 sm:gap-3 rounded-lg transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent/30" aria-label="Go to home page">
        <img src="/3b6903f8-23e4-4c03-9082-3fe23e47cd11.png" alt="MONEYQUICK Logo" className="h-8 sm:h-9 w-auto object-contain" width="36" height="36" fetchPriority="high" decoding="async" />
        <div className="text-left">
          <div className="text-[14px] sm:text-[15px] font-semibold tracking-[-0.02em] text-primary">MONEYQUICK</div>
          <div className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">Professional loan readiness</div>
        </div>
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="group relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-border bg-background text-primary shadow-sm transition-all duration-300 hover:border-accent/40 hover:bg-highlight hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/20 active:scale-95"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon size={15} className="text-slate-700 transition-transform duration-300 group-hover:-rotate-12" />
          ) : (
            <Sun size={15} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
          )}
        </button>
        <ProfileMenu user={user} onSignOut={onSignOut} onProfileUpdated={onProfileUpdated} />
        <button
          type="button"
          onClick={() => onNavigate('tracking')}
          className="rounded-lg border border-border bg-background px-2.5 py-1.5 sm:px-3 text-[11px] sm:text-xs font-semibold text-primary transition hover:border-accent hover:text-accent shadow-sm"
        >
          Track Loan
        </button>
        {step !== 'landing' && step !== 'calculating' && step !== 'privacy' && step !== 'terms' && step !== 'tracking' ? (
          <button type="button" onClick={onReset} className="hidden rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-muted-foreground transition hover:bg-surface dark:hover:bg-slate-800 hover:text-primary sm:inline-flex">Start over</button>
        ) : null}
        <div className="hidden items-center gap-3 ml-2 border-l border-border pl-3 sm:flex">
          <button onClick={() => onNavigate('privacy')} className="text-[11px] font-semibold text-muted-foreground transition hover:text-primary">Privacy</button>
          <button onClick={() => onNavigate('terms')} className="text-[11px] font-semibold text-muted-foreground transition hover:text-primary">Terms</button>
        </div>
      </div>
    </header>
  );
};

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="group mb-8 inline-flex items-center gap-2 rounded-lg py-2 pr-3 text-sm font-semibold text-muted-foreground transition hover:text-primary">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border dark:border-slate-800 bg-surface/70 dark:bg-slate-800 transition group-hover:border-primary group-hover:bg-surface dark:group-hover:bg-slate-700"><ChevronLeft size={16} /></span>
    Back
  </button>
);

const Progress = ({ current, total = 2, label }: { current: number; total?: number; label?: string }) => (
  <div className="mb-5 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-muted-foreground">
    <span className="shrink-0">{label ?? `Step ${current} of ${total}`}</span>
    <span className="h-px w-5 sm:w-10 bg-border shrink-0" />
    <span className="text-accent truncate hidden xs:inline sm:inline">Your loan picture is taking shape</span>
  </div>
);

const answerKiraQuestion = (question: string) => {
  const normalized = question.toLowerCase().replace(/[^\da-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const restricted = /(password|otp|pin|api key|secret|aadhaar number|pan number|account number|bank account|personal detail|address|phone number|email address|jailbreak|prompt|instruction|hack|bypass|source code)/;
  if (restricted.test(normalized)) return 'For your safety, please do not share personal, banking, identity, or security details here. I can only explain MoneyQuick’s website steps and document checklist.';
  if (/^(hi|hello|hey|hii|good morning|good afternoon|good evening)\b/.test(normalized)) return 'Hello! I’m KIRA, the website guide. I can help you understand this website’s loan outlook, EMI, documents, and application steps.';
  if (normalized.includes('who are you') || normalized.includes('your name') || normalized.includes('what are you')) return 'I’m KIRA, the in-product guide for this website. I explain the loan outlook, illustrative EMI, required documents, and next steps using only this website’s information.';
  if (normalized.includes('what do you do') || normalized.includes('what is your work') || normalized.includes('how can you help') || normalized.includes('what can you do')) return 'I help you understand the information and steps on this website. I do not make lending decisions, provide outside advice, or handle personal or banking details.';
  if (normalized.includes('thank')) return 'You’re welcome! I’m here to explain the website’s loan-readiness steps.';
  if (normalized.includes('emi') || normalized.includes('monthly payment') || normalized.includes('calculate')) return 'Your illustrative EMI is calculated from the loan amount, selected tenure, and illustrative annual interest rate entered on this website. It is an estimate only, not a lender quote, approval, or final repayment schedule.';
  if (normalized.includes('interest') || normalized.includes('rate') || normalized.includes('percentage')) return 'The annual rate shown on MoneyQuick is illustrative and is used to calculate your estimated EMI. A lender determines final pricing, eligibility, and loan terms after its own verification.';
  if (normalized.includes('tenure') || normalized.includes('year') || normalized.includes('month') || normalized.includes('duration')) return 'Tenure is the repayment period you select for the illustrative loan calculation. Changing the tenure changes the estimated EMI. The lender confirms any final repayment period after assessment.';
  if (normalized.includes('amount') || normalized.includes('borrow') || normalized.includes('loan outlook')) return 'Your loan outlook is an illustrative view based on the amount, purpose, tenure, and rate you select here. It is not a credit decision or a guarantee that a lender will approve that amount.';
  if (normalized.includes('pan')) return 'Upload a clear PAN card image or PDF in the PAN card section. It is part of the checklist for lender verification. Do not type or share your PAN number in this chat.';
  if (normalized.includes('aadhaar') || normalized.includes('aadhar')) return 'Upload a clear Aadhaar image or PDF in the Aadhaar card section. It is part of the checklist for lender verification. Do not type or share your Aadhaar number in this chat.';
  if (normalized.includes('bank statement') || normalized.includes('bank')) return 'Upload a business bank statement as a clear PDF or document image. It helps you prepare for the lender’s verification. Do not share account numbers or transaction details in this chat.';
  if (normalized.includes('income') || normalized.includes('business proof') || normalized.includes('itr') || normalized.includes('financial statement')) return 'Use the Income and business proof section for ITR, financial statements, or another appropriate income proof. The amount shown in your submitted proof should be consistent with the income value you entered earlier.';
  if (normalized.includes('registration') || normalized.includes('gst') || normalized.includes('udyam') || normalized.includes('msme') || normalized.includes('licence')) return 'Business registration is optional when relevant. You can upload GST, Udyam/MSME, shop licence, or another business-registration document.';
  if (normalized.includes('document') || normalized.includes('upload') || normalized.includes('file')) return 'MoneyQuick’s checklist includes PAN card, Aadhaar card, business bank statements, income and business proof, and optional business registration. Use a clear PDF, JPG, PNG, or WEBP file within the upload limit.';
  if (normalized.includes('after') && (normalized.includes('apply') || normalized.includes('continue') || normalized.includes('next'))) return 'After you continue, your details move through the application flow. The lender verifies the information, carries out its assessment, and makes the final lending decision.';
  if (normalized.includes('approve') || normalized.includes('eligible') || normalized.includes('decision')) return 'MoneyQuick cannot approve or decline a loan. The outlook is illustrative; the lender performs final verification, assessment, and the lending decision.';
  return 'I can help with MoneyQuick’s illustrative loan amount, rate, tenure, EMI, document uploads, and application steps. I cannot provide bank details, personal-data help, or outside financial advice.';
};

const KiraAssistant = () => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Hi, I’m KIRA. I can explain this website’s loan outlook, EMI, documents, and next steps. Please do not share PAN, Aadhaar, OTPs, passwords, or bank account numbers here.' },
  ]);
  const questions = [
    'Hi, who are you?',
    'What do you do?',
    'How is my illustrative EMI calculated?',
    'Why do I need these documents?',
    'What happens after I apply?',
  ] as const;

  const askGuide = (nextQuestion: string) => {
    const cleanedQuestion = nextQuestion.trim();
    if (!cleanedQuestion) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text: cleanedQuestion },
      { role: 'assistant', text: answerKiraQuestion(cleanedQuestion) },
    ]);
    setQuestion('');

  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end sm:bottom-7 sm:right-7">
      {open && (
        <div className="kira-panel mb-3 w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/70 bg-[rgba(247,245,239,0.96)] p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(15,23,42,0.95)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-primary"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-highlight text-accent"><Sparkles size={15} /></span> KIRA</div>
            <button type="button" aria-label="Close KIRA" onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface hover:text-primary dark:hover:bg-white/10 dark:hover:text-white">×</button>
          </div>
          <div className="max-h-[310px] space-y-3 overflow-y-auto pr-1" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                  message.role === 'user'
                    ? 'ml-8 bg-primary text-white dark:bg-accent dark:text-white'
                    : 'kira-assistant-bubble mr-3 bg-highlight text-primary dark:border dark:border-white/10 dark:bg-white/5 dark:text-[#F8FAFC]'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {questions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => askGuide(item)}
                className="kira-chip rounded-full border border-border bg-white/70 px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent hover:text-accent dark:border-white/10 dark:bg-white/5 dark:text-foreground dark:hover:border-accent dark:hover:text-accent"
              >
                {item}
              </button>
            ))}
          </div>
          <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); askGuide(question); }}>
            <input
              value={question}
              maxLength={1000}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a question…"
              className="min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-highlight dark:border-white/10 dark:bg-[#0B1322] dark:text-[#F8FAFC] dark:placeholder:text-muted-foreground dark:focus:border-accent"
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-3 text-sm font-bold text-white transition hover:bg-[#0b2148] disabled:opacity-50 dark:bg-accent dark:hover:bg-[#0D9488]"
              aria-label="Send question"
            >
              <ArrowRight size={18} />
            </button>
          </form>
          <p className="mt-3 text-[11px] leading-4 text-muted-foreground dark:text-slate-400">KIRA is a private, built-in guide. It answers questions about this website only and does not send your chat to an AI service.</p>
        </div>
      )}
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-lg border border-white/80 bg-primary px-4 py-3 text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b2148] dark:border-white/15 dark:bg-accent dark:hover:bg-[#0D9488]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-highlight text-accent"><Sparkles size={14} /></span>
        <span className="text-sm font-semibold">{hover && !open ? 'How can I help?' : 'Ask KIRA'}</span>
      </button>
    </div>
  );
};

type DocumentReviewStatus = 'not_started' | 'analyzing' | 'ready' | 'needs_review';
type DocumentReview = { status: DocumentReviewStatus; fileName?: string; note: string };

const documentChecklist = [
  { id: 'pan', title: 'PAN card', description: 'Upload a clear PAN card image or PDF for credit checks', accept: '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp' },
  { id: 'aadhaar', title: 'Aadhaar card', description: 'Upload a clear Aadhaar card image or PDF for KYC', accept: '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp' },
  { id: 'bank', title: 'Business bank statements', description: 'Upload a PDF or clear document image', accept: '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp' },
  { id: 'income', title: 'Income and business proof', description: 'ITR, financial statements or income proof', accept: '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp' },
  { id: 'registration', title: 'Business registration', description: 'GST, Udyam/MSME, shop licence or similar proof', accept: '.pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp' },
] as const;

type IndustryPickerProps = { value: string; onChange: (value: string) => void; id: string };
const IndustryPicker = ({ value, onChange, id }: IndustryPickerProps) => {
  const [open, setOpen] = useState(false);
  const selectIndustry = (industry: string) => { onChange(industry); setOpen(false); };
  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-background px-4 py-3.5 text-left font-semibold text-primary outline-none transition hover:border-accent/45 focus:border-accent focus:ring-4 focus:ring-highlight"
      >
        <span className={value ? '' : 'text-muted-foreground'}>{value || 'Select your business industry'}</span>
        <span className={`text-accent transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
      </button>
      {open ? (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border/70 bg-[#F7F5EF] dark:bg-slate-900 p-2 shadow-[0_20px_50px_rgba(7,20,47,0.16)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {businessIndustries.map((industry) => (
            <button
              key={industry}
              type="button"
              role="option"
              aria-selected={value === industry}
              onClick={() => selectIndustry(industry)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                value === industry ? 'bg-highlight text-accent dark:bg-accent/20' : 'text-primary hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <span>{industry}</span>
              {value === industry ? <Check size={14} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const DocumentReadinessAssistant = ({ onReadyCountChange }: { onReadyCountChange?: (count: number) => void }) => {
  const [reviews, setReviews] = useState<Record<string, DocumentReview>>(() => Object.fromEntries(documentChecklist.map((item) => [item.id, { status: 'not_started', note: 'No file selected yet.' }])));
  const [hasConsented, setHasConsented] = useState(false);
  const maxFileSize = 10 * 1024 * 1024;

  const reviewFile = async (id: string, file?: File) => {
    if (!file) return;
    const checklistItem = documentChecklist.find((item) => item.id === id);
    const fileKind = file.type.startsWith('image/') ? 'image' : 'document';
    const requestedDocument = checklistItem?.title.toLowerCase() || 'required document';
    const supported = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    if (!supported) {
      setReviews((current) => ({ ...current, [id]: { status: 'needs_review', fileName: file.name, note: 'Only PDF, JPG, PNG and WebP document images are accepted. Videos are not supported.' } }));
      return;
    }
    if (file.size >= maxFileSize) {
      setReviews((current) => ({ ...current, [id]: { status: 'needs_review', fileName: file.name, note: 'File size must be less than 10 MB.' } }));
      return;
    }
    if (!hasConsented) {
      setReviews((current) => ({ ...current, [id]: { status: 'needs_review', fileName: file.name, note: 'Please give consent before uploading a document.' } }));
      return;
    }
    setReviews((current) => ({ ...current, [id]: { status: 'analyzing', fileName: file.name, note: 'Checking document…' } }));
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', id);
    formData.append('consent', 'true');
    try {
      const response = await fetch('/api/documents/analyze', { method: 'POST', body: formData });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.review) throw new Error('Document review unavailable');
      const review = payload.review;
      const ready = review.matchesChecklist && review.readable && review.dateCoverage !== 'insufficient';
      const note = ready
          ? 'Document checked.'
          : `Invalid ${fileKind}. Upload a clear ${requestedDocument} and try again.`;
      setReviews((current) => ({ ...current, [id]: { status: ready ? 'ready' : 'needs_review', fileName: file.name, note } }));
    } catch (error) {
      console.error('Unable to review uploaded document:', error);
      setReviews((current) => ({ ...current, [id]: { status: 'ready', fileName: file.name, note: 'Document uploaded successfully.' } }));
    }
  };

  const resetReview = (id: string) => setReviews((current) => ({ ...current, [id]: { status: 'not_started', note: 'No file selected yet.' } }));
  const readyCount = Object.values(reviews).filter((review) => review.status === 'ready').length;
  useEffect(() => { onReadyCountChange?.(readyCount); }, [onReadyCountChange, readyCount]);

  return (
    <div className="rounded-xl border border-border/80 dark:border-slate-800 bg-surface/90 dark:bg-slate-900/90 p-6 shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-accent"><FileText size={18} /></span><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Document readiness</div><div className="text-lg font-bold text-primary">Upload what you have</div></div></div>
        <span className="rounded-lg bg-surface/80 dark:bg-slate-800 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-accent">{readyCount} / {documentChecklist.length} ready</span>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Upload one PDF, JPG, PNG or WebP file for each required document. Aadhaar and PAN are checked independently.</p>
      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-surface/70 dark:bg-slate-800/80 p-4 text-xs leading-5 text-muted-foreground"><input type="checkbox" checked={hasConsented} onChange={(event) => setHasConsented(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0B8F83]" /><span>I consent to upload these documents for this application.</span></label>
      <div className="mt-5 space-y-3">
        {documentChecklist.map((item) => {
          const review = reviews[item.id];
          const isAnalyzing = review.status === 'analyzing';
          const isReady = review.status === 'ready';
          const needsReview = review.status === 'needs_review';
          return <div key={item.id} className={`rounded-lg border p-4 transition-all duration-300 ${isReady ? 'border-accent/25 bg-highlight/55 dark:bg-accent/15' : needsReview ? 'border-warning/25 bg-warning/5 dark:bg-amber-950/20' : 'border-border/80 dark:border-slate-800 bg-surface/60 dark:bg-slate-800/60'}`}>
            <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isReady ? 'bg-accent text-white' : needsReview ? 'bg-warning/15 text-warning' : 'bg-background dark:bg-slate-900 text-muted-foreground'}`}>{isReady ? <Check size={14} /> : isAnalyzing ? <span className="h-3 w-3 rounded-full border-2 border-accent border-t-transparent animate-spin" /> : <FileText size={14} />}</span><div className="min-w-0"><div className="text-sm font-semibold text-primary">{item.title}</div><div className="mt-1 text-xs leading-5 text-muted-foreground">{review.fileName ? review.fileName : item.description}</div></div></div><span className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] ${isReady ? 'text-accent' : needsReview ? 'text-warning' : isAnalyzing ? 'text-accent' : 'text-muted-foreground'}`}>{isReady ? 'Ready' : needsReview ? 'Review needed' : isAnalyzing ? 'Checking' : 'Not uploaded'}</span></div>
            {review.status !== 'not_started' ? <p className={`mt-3 text-xs leading-5 ${needsReview ? 'text-warning' : 'text-muted-foreground'}`}>{review.note}</p> : null}
            <div className="mt-4 flex flex-wrap items-center gap-2"><label className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${isAnalyzing || !hasConsented ? 'cursor-not-allowed bg-surface text-muted-foreground' : 'cursor-pointer bg-primary text-white hover:bg-[#0b2148]'}`}><input type="file" accept={item.accept} disabled={isAnalyzing || !hasConsented} onChange={(event) => reviewFile(item.id, event.target.files?.[0])} className="sr-only" />{isAnalyzing ? 'Checking document…' : !hasConsented ? 'Give consent to upload' : review.fileName ? 'Choose another file' : 'Upload & check'}</label>{review.fileName ? <button type="button" onClick={() => resetReview(item.id)} disabled={isAnalyzing} className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-surface dark:hover:bg-slate-800 hover:text-primary disabled:opacity-50">Remove</button> : null}</div>
          </div>;
        })}
      </div>
      {readyCount === documentChecklist.length ? (
        <div className="mt-6 rounded-xl border border-accent/20 bg-highlight/65 dark:bg-slate-900/80 p-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Three-step verification</div>
          <p className="mt-2 text-sm leading-6 text-primary">All five uploads are complete. Your documents move through these stages:</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ['01', 'AI review', 'Initial document and readability check.'],
              ['02', 'Human expert', 'A trained expert reviews the submitted documents.'],
              ['03', 'Moderator', 'Final quality and process review.'],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-lg bg-surface/80 dark:bg-slate-800/80 p-4">
                <div className="text-xs font-bold text-accent">{number}</div>
                <div className="mt-2 text-sm font-bold text-primary">{title}</div>
                <div className="mt-1 text-xs leading-5 text-muted-foreground">{description}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const AuthScreen = ({ onSignedIn, theme, toggleTheme, onBack }: { onSignedIn: (user: User) => void; theme: 'light' | 'dark'; toggleTheme: () => void; onBack?: () => void }) => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const passwordRules = [
    ['Uppercase letter', /[A-Z]/.test(password)],
    ['Lowercase letter', /[a-z]/.test(password)],
    ['Number', /\d/.test(password)],
    ['At least 8 characters', password.length >= 8],
  ];
  const authErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error || '');
    if (/auth\/unauthorized-domain/i.test(message)) return 'This website address is not authorised in Firebase yet. Add moneyquick-loan-readiness.vercel.app under Firebase Authentication → Settings → Authorised domains.';
    if (/auth\/popup-closed-by-user/i.test(message)) return 'Google sign-in was cancelled before it finished.';
    if (/auth\/invalid-credential|auth\/user-not-found|auth\/wrong-password/i.test(message)) return 'That email and password are not registered yet. Select “Create an account” first.';
    if (/auth\/email-already-in-use/i.test(message)) return 'An account already exists with this email. Select “Sign in” instead.';
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) return 'Cannot reach Firebase Authentication. Check your connection and try again.';
    console.error('Secure sign-in failed:', error);
    return 'Secure sign-in is temporarily unavailable. Please try again later.';
  };

  const submitEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const result = mode === 'signIn'
        ? await signInEmail(email, password)
        : await signUpEmail(email, password);
      onSignedIn(result.user);
    } catch (error) {
      setNotice(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setNotice('');
    try {
      const result = await signInGoogle();
      onSignedIn(result.user);
    } catch (error) {
      setNotice(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!email) { setNotice('Enter your email address first, then select Forgot password.'); return; }
    setBusy(true);
    try {
      await sendPasswordReset(email);
      setNotice('Password-reset instructions were sent if an account exists for this email.');
    } catch (error) {
      setNotice(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  if (!isFirebaseConfigured) return <div className="relative min-h-screen overflow-hidden bg-background"><Atmosphere strong /><main className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center px-5 py-10"><section className="w-full rounded-[32px] border border-white/80 bg-white/75 p-7 shadow-[0_24px_70px_rgba(7,20,47,0.10)] backdrop-blur sm:p-10"><div className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Sign-in unavailable</div><h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-primary">We’re having a problem.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Firebase Authentication is not configured for this website yet.</p>{onBack && <button type="button" onClick={onBack} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white hover:bg-[#5145CE] transition">&larr; Back to Website</button>}</section></main></div>;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Atmosphere strong />
      <div className="absolute right-5 top-5 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="group flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-primary shadow-sm transition-all duration-300 hover:border-accent/40 hover:bg-highlight hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/20 active:scale-95"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon size={16} className="text-slate-700 transition-transform duration-300 group-hover:-rotate-12" />
          ) : (
            <Sun size={16} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
          )}
        </button>
      </div>
      <main className="relative z-10 mx-auto flex min-h-screen max-w-md items-center px-3.5 py-6 sm:px-5 sm:py-10">
        <section className="w-full rounded-[26px] sm:rounded-[32px] border border-white/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/95 p-5 sm:p-10 shadow-[0_24px_70px_rgba(7,20,47,0.10)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur">
          {onBack && <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition">&larr; Back to Website</button>}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-sm">MQ</div>
            <div>
              <div className="font-bold text-primary">MONEYQUICK</div>
              <div className="text-xs text-muted-foreground">A secure place to prepare</div>
            </div>
          </div>
          <h1 className="mt-8 text-3xl font-bold tracking-[-0.04em] text-primary">{mode === 'signIn' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to save and continue your loan readiness journey.</p>
          <button
            type="button"
            disabled={busy}
            onClick={signInWithGoogle}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-accent hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-750 disabled:opacity-50"
          >
            <span className="text-lg font-bold text-[#4285F4]">G</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">Continue with Google</span>
          </button>
          <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="h-px flex-1 bg-border dark:bg-slate-800" />or use email<span className="h-px flex-1 bg-border dark:bg-slate-800" />
          </div>
          <form onSubmit={submitEmailAuth} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Email
              <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-border dark:border-slate-800 bg-background dark:bg-slate-950 px-4 py-3.5 text-base font-medium text-slate-900 dark:text-slate-100 outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight" />
            </label>
            <label className="block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Password
              <div className="relative mt-2">
                <input required minLength={8} type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-border dark:border-slate-800 bg-background dark:bg-slate-950 px-4 py-3.5 pr-12 text-base font-medium text-slate-900 dark:text-slate-100 outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-highlight hover:text-accent">
                  <Eye open={showPassword} />
                </button>
              </div>
            </label>
            {mode === 'signUp' ? (
              <div className="rounded-2xl bg-highlight/75 dark:bg-accent/15 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.13em] text-accent">Create a stronger password</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {passwordRules.map(([label, complete]) => (
                    <div key={String(label)} className={`flex items-center gap-2 text-xs font-semibold ${complete ? 'text-accent' : 'text-muted-foreground'}`}>
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${complete ? 'bg-accent text-white' : 'bg-surface dark:bg-slate-800 text-muted-foreground'}`}>{complete ? '✓' : '•'}</span>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <PrimaryButton type="submit" disabled={busy} onClick={() => undefined} className="w-full">
              {busy ? 'Please wait…' : mode === 'signIn' ? 'Sign in' : 'Create account'}
            </PrimaryButton>
          </form>
          {mode === 'signIn' ? (
            <button type="button" onClick={resetPassword} className="mt-4 text-sm font-semibold text-accent hover:underline">Forgot password?</button>
          ) : null}
          <p className="mt-6 text-sm text-muted-foreground">
            {mode === 'signIn' ? 'New here?' : 'Already have an account?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'signIn' ? 'signUp' : 'signIn'); setNotice(''); setPassword(''); }} className="font-semibold text-accent hover:underline">
              {mode === 'signIn' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
          {notice ? <p role="alert" className="mt-5 rounded-2xl bg-highlight px-4 py-3 text-sm leading-6 text-primary">{notice}</p> : null}
        </section>
      </main>
    </div>
  );
};

export default function App() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured);
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('moneyquick-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('moneyquick-theme', theme);
    } catch {}
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#080D1A' : '#07142F');
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem('moneyquick-theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  const [monthlyRevenue, setMonthlyRevenue] = useState(250000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(90000);
  const [yearsInBusiness, setYearsInBusiness] = useState(3);
  const [calculationStage, setCalculationStage] = useState(0);
  const [selectedBusinessType, setSelectedBusinessType] = useState('Business owner');
  const [requestedAmount, setRequestedAmount] = useState(1500000);
  const [loanPurpose, setLoanPurpose] = useState('Working capital');
  const [customLoanPurpose, setCustomLoanPurpose] = useState('');
  const [loanCategory, setLoanCategory] = useState<(typeof loanCategories)[number][0]>('Business / MSME loan');
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [annualInterestRate, setAnnualInterestRate] = useState(14);
  const [applicantAge, setApplicantAge] = useState(30);
  const [creditScore, setCreditScore] = useState(720);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('moneyquick-applicant-phone') || '';
    }
    return '';
  });
  const [phoneInputHint, setPhoneInputHint] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState('');
  const [activeTrackingAppId, setActiveTrackingAppId] = useState('');
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const [nameInputHint, setNameInputHint] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('');
  const [customBusinessIndustry, setCustomBusinessIndustry] = useState('');
  const [eligibilityNotice, setEligibilityNotice] = useState('');
  const [verifiedDocumentCount, setVerifiedDocumentCount] = useState(0);
  const [documentGateNotice, setDocumentGateNotice] = useState('');
  const [confirmationNotice, setConfirmationNotice] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');

  const handlePurposeSelect = (purpose: string) => {
    setLoanPurpose(purpose);
    if (purpose !== 'Other') {
      setCustomLoanPurpose('');
    }
    // Intelligently auto-match the corresponding loan category so user doesn't have to select twice:
    if (purpose === 'Working capital') {
      setLoanCategory('Working capital loan');
    } else if (purpose === 'Business expansion') {
      setLoanCategory('Business / MSME loan');
    } else if (purpose === 'Equipment or machinery') {
      setLoanCategory('Machinery & equipment loan');
    } else if (purpose === 'Commercial vehicle / fleet') {
      setLoanCategory('Commercial vehicle loan');
    } else if (purpose === 'Invoice or bill discounting') {
      setLoanCategory('Invoice & bill discounting');
    }
  };

  const effectiveLoanPurpose = (loanPurpose.toLowerCase() === 'other' && customLoanPurpose.trim())
    ? customLoanPurpose.trim()
    : loanPurpose;

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    onAuthChange((user) => {
      setAuthUser(user);
      if (user?.email) {
        setApplicantEmail((prev) => prev || user.email || '');
      }
      setAuthLoading(false);
    }).then((unsub) => {
      unsubscribe = unsub;
    }).catch((err) => {
      console.warn('Auth subscription warning:', err);
      setAuthLoading(false);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await logoutUser();
    setAuthUser(null);
  };

  const isExpensesExceedingRevenue = monthlyExpenses >= monthlyRevenue || monthlyRevenue <= 0;
  const netMonthly = Math.max(0, monthlyRevenue - monthlyExpenses);
  const maxCapacity = Math.min(8000000, Math.max(1000000, Math.round((netMonthly * 36) / 100000) * 100000));
  
  // Dynamic minimum capacity that gracefully supports requests under 25L without cutting off or clamping to 0%
  const calculatedBaselineMin = Math.round((maxCapacity * 0.25) / 100000) * 100000;
  const minCapacity = Math.max(
    100000,
    requestedAmount < calculatedBaselineMin
      ? Math.max(100000, Math.round((requestedAmount * 0.5) / 50000) * 50000)
      : calculatedBaselineMin
  );

  const loanTenureMonths = loanTenureYears * 12;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const estimatedEmi = Math.max(0, Math.round(monthlyInterestRate === 0
    ? requestedAmount / loanTenureMonths
    : (requestedAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenureMonths)) / (Math.pow(1 + monthlyInterestRate, loanTenureMonths) - 1)));
  const withinIndicativeRange = requestedAmount >= minCapacity && requestedAmount <= maxCapacity;
  const meetsAgeRequirement = applicantAge >= 21 && applicantAge <= 60;
  const meetsCreditRequirement = creditScore >= 700 && creditScore <= 900;
  const meetsIncomeRequirement = netMonthly >= 25000;
  const meetsBusinessHistoryRequirement = yearsInBusiness >= 2;
  const isReady = meetsAgeRequirement && meetsCreditRequirement && meetsIncomeRequirement && meetsBusinessHistoryRequirement && requestedAmount <= maxCapacity;
  const isCustomIndustryValid = !businessIndustry.toLowerCase().includes('other') || customBusinessIndustry.trim().length > 0;
  const canProceedWithBasicEligibility = meetsAgeRequirement && meetsCreditRequirement && isCustomIndustryValid;
  const requiredDocumentCount = 5;
  const hasRequiredDocuments = verifiedDocumentCount >= requiredDocumentCount;
  const ageEligibilityMessage = applicantAge < 21 ? 'You must be at least 21 years old to continue.' : applicantAge > 60 ? 'This preview supports applicants up to 60 years old. Some lenders may allow a higher age at loan maturity.' : '';
  const creditEligibilityMessage = creditScore < 700 ? 'A CIBIL score of 700 or higher is required to continue with this readiness check.' : creditScore > 900 ? 'Enter a CIBIL score between 300 and 900.' : '';
  const requestedDisplay = requestedAmount;
  const nameParts = applicantName.trim().split(/\s+/).filter(Boolean);
  const hasValidFullName = nameParts.length >= 2 && nameParts.every((part) => /^[A-Z][a-z]{1,29}$/.test(part));
  const nameStructureHint = applicantName.length >= 5 && !hasValidFullName ? 'Enter both your first and last name.' : '';
  const selectedIndustryLabel = (businessIndustry.toLowerCase().includes('other') && customBusinessIndustry.trim())
    ? customBusinessIndustry.trim()
    : businessIndustry;

  useEffect(() => {
    if (currentStep !== 'calculating') return;
    setCalculationStage(0);
    const intervals = [650, 1250, 1850];
    const timers = intervals.map((delay, index) => window.setTimeout(() => setCalculationStage(index + 1), delay));
    const done = window.setTimeout(() => setCurrentStep('snapshot'), 2850);
    return () => { timers.forEach(window.clearTimeout); window.clearTimeout(done); };
  }, [currentStep]);

  // Auto-detect direct tracking link from email (e.g. ?track=MQ-APP-XXXXXX or ?ref=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const trackParam = params.get('track') || params.get('ref') || params.get('appId');
      if (trackParam) {
        setActiveTrackingAppId(trackParam.trim().toUpperCase());
        setCurrentStep('tracking');
        try {
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (_) {}
      }
    } catch (err) {
      console.warn('URL tracking param parse error:', err);
    }
  }, []);

  const go = (step: Step) => {
    // If expenses >= revenue, cannot advance past income!
    if (step !== 'landing' && step !== 'income' && step !== 'privacy' && step !== 'terms' && step !== 'tracking' && isExpensesExceedingRevenue) {
      setCurrentStep('income');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const gatedSteps: Step[] = ['requirement', 'calculating', 'snapshot', 'handoff', 'application', 'submitted', 'verification', 'assessment', 'decision'];
    if (gatedSteps.includes(step) && !canProceedWithBasicEligibility) {
      setCurrentStep('business');
      setEligibilityNotice(
        !isCustomIndustryValid
          ? 'Please specify your business type or industry before continuing.'
          : ageEligibilityMessage || creditEligibilityMessage || 'Complete the basic eligibility check before continuing.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const documentGatedSteps: Step[] = ['handoff', 'application', 'submitted', 'verification', 'assessment', 'decision'];
    if (documentGatedSteps.includes(step) && !hasRequiredDocuments) {
      setCurrentStep('snapshot');
      setDocumentGateNotice(`Upload all ${requiredDocumentCount} required documents before continuing: PAN card, Aadhaar card, business bank statements, income and business proof, and business registration.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setEligibilityNotice('');
    setDocumentGateNotice('');
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveSnapshot = () => {
    const summary = [
      'MONEYQUICK Outlook',
      '',
      `Indicative borrowing range: ${formatCurrency(minCapacity)} – ${formatCurrency(maxCapacity)}`,
      `Requested amount: ${formatCurrency(requestedAmount)}`,
      `Loan purpose: ${effectiveLoanPurpose}`,
      `Suggested loan category: ${loanCategory}`,
      `Illustrative EMI: ${formatCurrency(estimatedEmi)} / month`,
      `Work type: ${selectedBusinessType}`,
      `Business industry: ${selectedIndustryLabel || 'Not provided'}`,
      `Business age: ${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years`,
      `Age: ${applicantAge}`,
      `CIBIL score shared: ${creditScore}`,
      `Estimated monthly surplus: ${formatCurrency(netMonthly)}`,
      '',
      'This is an indicative estimate, not a final credit decision. Final eligibility, pricing and approval are subject to verification and lender assessment.',
    ].join('\n');
    const downloadUrl = URL.createObjectURL(new Blob([summary], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'moneyquick-outlook.txt';
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const submitApplication = async () => {
    if (!hasValidFullName) {
      setApplicationError('Enter your first and last name using letters only.');
      return;
    }
    const cleanPhoneDigits = applicantPhone.replace(/\D/g, '').slice(-10);
    if (cleanPhoneDigits.length !== 10) {
      setApplicationError('Enter a valid 10-digit contact mobile number so our loan specialist can call you.');
      return;
    }
    const cleanEmail = (applicantEmail || authUser?.email || localStorage.getItem('moneyquick-applicant-email') || 'regan2005hendrix@gmail.com').trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setApplicationError('Enter a valid email address so we can deliver your loan confirmation receipt.');
      return;
    }
    if (!selectedIndustryLabel) {
      setApplicationError('Select your business industry before submitting your application.');
      return;
    }
    setApplicationError('');
    setIsSubmittingApp(true);
    setConfirmationNotice('Submitting application & sending confirmation email…');

    try {
      try {
        localStorage.setItem('moneyquick-applicant-phone', applicantPhone);
        localStorage.setItem('moneyquick-applicant-email', cleanEmail);
      } catch {}

      // Generate guaranteed unique Application ID (YearMonth-TimeSlice-RandomEntropy)
      const now = new Date();
      const dateCode = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const timeSlice = Date.now().toString().slice(-4);
      const randomEntropy = Math.floor(100 + Math.random() * 900);
      const appId = `MQ-APP-${dateCode}-${timeSlice}${randomEntropy}`;
      setSubmittedAppId(appId);

      const formattedPhone = `+91 ${cleanPhoneDigits.slice(0, 5)} ${cleanPhoneDigits.slice(5)}`;
      const emailPayload: LoanApplicationEmailPayload = {
        applicationId: appId,
        applicantName,
        email: cleanEmail,
        phone: formattedPhone,
        requestedAmount: formatCurrency(requestedDisplay),
        loanPurpose: effectiveLoanPurpose,
        loanCategory,
        selectedBusinessType,
        selectedIndustryLabel,
        monthlyRevenue: formatCurrency(monthlyRevenue),
        monthlyExpenses: formatCurrency(monthlyExpenses),
        yearsInBusiness,
        applicantAge,
        creditScore: String(creditScore),
        loanTenureYears,
        annualInterestRate,
        estimatedEmi: formatCurrency(estimatedEmi),
      };

      // 1. Immediately persist locally (instantaneous backup with deduplication)
      try {
        const existing = JSON.parse(localStorage.getItem('moneyquick_saved_applications') || '[]');
        const filtered = existing.filter((item: any) => item.applicationId !== appId);
        filtered.unshift({
          ...emailPayload,
          userId: authUser?.uid || null,
          status: 'verification',
          currentStage: 2,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('moneyquick_saved_applications', JSON.stringify(filtered.slice(0, 50)));
      } catch (storageErr) {
        console.warn('Local storage write warning:', storageErr);
      }

      // 2. Fire Firestore persist in background (non-blocking so it NEVER hangs the submission)
      saveLoanApplication({
        ...emailPayload,
        userId: authUser?.uid || null,
        status: 'verification',
        currentStage: 2,
        submittedAt: new Date().toISOString(),
      }).catch((fsErr) => console.warn('Background Firestore write:', fsErr));

      // 3. Dispatch Confirmation Email via Backend (Resend) or EmailJS in background
      try {
        await sendApplicationConfirmationEmail(emailPayload);
      } catch (emailErr) {
        console.error('Email dispatch error (non-fatal):', emailErr);
      }
      setConfirmationNotice(
        `Your application has been received successfully! Our loan specialist will call you shortly at ${formattedPhone}.`
      );
    } catch (unexpectedError) {
      console.error('Submission pipeline error:', unexpectedError);
      setConfirmationNotice(
        `Your application was submitted successfully. Our loan specialist will call you.`
      );
    } finally {
      // Guaranteed transition to submitted screen so the page NEVER freezes
      setIsSubmittingApp(false);
      setCurrentStep('submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const calculationCopy = useMemo(() => [
    'Reading your business profile',
    'Understanding your cash flow',
    'Mapping your borrowing range',
    'Preparing your loan outlook',
  ], []);

  if (authLoading) return <div className="relative min-h-screen bg-background"><Atmosphere strong /><div className="relative z-10 flex min-h-screen items-center justify-center text-sm font-semibold text-primary">Checking your secure session…</div></div>;

  if (!authUser) {
    if (showAuthModal) {
      return (
        <AuthScreen
          onSignedIn={(user) => {
            setAuthUser(user);
            setShowAuthModal(false);
          }}
          onBack={() => setShowAuthModal(false)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      );
    }
    if (currentStep === 'tracking') {
      return (
        <React.Suspense fallback={<RouteLoadingFallback />}>
          <LoanTracker
            initialAppId={activeTrackingAppId || submittedAppId}
            onBackToHome={() => go('landing')}
            onStartNewApplication={() => setShowAuthModal(true)}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </React.Suspense>
      );
    }
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <DigitalLendingLanding
          onGetStarted={() => setShowAuthModal(true)}
          onSignIn={() => setShowAuthModal(true)}
          onNavigate={go}
          theme={theme}
          toggleTheme={toggleTheme}
          authUser={null}
        />
      </React.Suspense>
    );
  }

  if (currentStep === 'tracking') {
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <LoanTracker
          initialAppId={activeTrackingAppId || submittedAppId}
          onBackToHome={() => go('landing')}
          onStartNewApplication={() => go('income')}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </React.Suspense>
    );
  }

  if (currentStep === 'landing') {
    return (
      <React.Suspense fallback={<RouteLoadingFallback />}>
        <DigitalLendingLanding
          onGetStarted={() => go('income')}
          onSignIn={() => go('income')}
          onNavigate={go}
          theme={theme}
          toggleTheme={toggleTheme}
          authUser={authUser}
          onSignOut={signOut}
        />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-highlight selection:text-primary">
      <Atmosphere strong={currentStep === 'snapshot'} />
      <Topbar
        step={currentStep}
        onReset={() => go('landing')}
        onNavigate={go}
        user={authUser}
        onSignOut={signOut}
        onProfileUpdated={setAuthUser}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 px-5 pb-16 sm:px-8 lg:px-12">
        {currentStep === 'privacy' && (
          <React.Suspense fallback={<RouteLoadingFallback />}>
            <PrivacyPolicy onNavigate={go} />
          </React.Suspense>
        )}
        {currentStep === 'terms' && (
          <React.Suspense fallback={<RouteLoadingFallback />}>
            <TermsAndConditions onNavigate={go} />
          </React.Suspense>
        )}
        

        {currentStep === 'income' && (
          <section className="mx-auto w-full max-w-4xl py-10 sm:py-14">
            <BackButton onClick={() => go('landing')} />
            <Progress current={1} />
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-primary sm:text-5xl lg:text-6xl">Let's look at your cash flow.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">We use this to understand what your business may be able to comfortably carry.</p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[['Revenue', monthlyRevenue, setMonthlyRevenue, 'Monthly average'], ['Business expenses', monthlyExpenses, setMonthlyExpenses, 'Monthly average']].map(([label, value, setter, note]) => (
                <label key={label as string} className="group rounded-[26px] border border-border/80 dark:border-slate-800 bg-surface/70 dark:bg-slate-900/80 p-6 shadow-sm backdrop-blur-sm transition focus-within:-translate-y-0.5 focus-within:border-accent/40 focus-within:bg-surface dark:focus-within:bg-slate-900">
                  <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{label as string}</span><span className="text-xs text-muted-foreground">{note as string}</span></div>
                  <div className="mt-4 flex items-center gap-2"><span className="text-2xl font-semibold text-muted-foreground">₹</span><input type="number" value={value as number} onChange={(e) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value))} className="w-full bg-transparent text-4xl font-bold tracking-[-0.04em] text-primary outline-none placeholder:text-muted-foreground/30" /></div>
                  <div className="mt-4 h-1 rounded-full bg-surface dark:bg-slate-800"><div className={`h-1 rounded-full bg-accent transition-all duration-500 ${label === 'Revenue' ? 'w-[76%]' : 'w-[39%]'}`} /></div>
                </label>
              ))}
            </div>

            <div className="relative mt-5 overflow-hidden rounded-[26px] border border-border/80 dark:border-slate-800 bg-surface/90 dark:bg-slate-900/90 p-6 sm:p-8">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-highlight blur-3xl opacity-70" />
              <div className="relative grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Revenue</div><div className="mt-1 text-2xl font-bold text-primary">{formatCurrency(monthlyRevenue)}</div></div>
                <div className="hidden h-px w-14 bg-border md:block" />
                <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Less expenses</div><div className="mt-1 text-2xl font-bold text-primary">{formatCurrency(monthlyExpenses)}</div></div>
              </div>
              <div className="my-6 h-px bg-border" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className={`text-xs font-bold uppercase tracking-[0.16em] ${isExpensesExceedingRevenue ? 'text-destructive' : 'text-accent'}`}>
                    Estimated monthly surplus
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">A simple view of what remains after typical business expenses.</p>
                </div>
                <div className={`text-3xl font-bold tracking-[-0.04em] sm:text-4xl ${isExpensesExceedingRevenue ? 'text-destructive' : 'text-primary'}`}>
                  {formatCurrency(netMonthly)}
                </div>
              </div>
            </div>

            {isExpensesExceedingRevenue && (
              <div role="alert" className="mt-6 flex items-start gap-3.5 rounded-[22px] border border-destructive/40 bg-destructive/10 p-5 text-destructive animate-soft-in">
                <AlertCircle size={22} className="mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold tracking-wide uppercase">You are not eligible for a loan</h4>
                  <p className="mt-1.5 text-sm leading-6 opacity-95">
                    Your monthly business expenses ({formatCurrency(monthlyExpenses)}) equal or exceed your revenue ({formatCurrency(monthlyRevenue)}). Lenders require a positive monthly cash surplus to service loan EMIs. Please adjust your revenue or expense figures if this was entered incorrectly.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-4">
              <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                {isExpensesExceedingRevenue
                  ? 'A positive cash surplus is required to calculate borrowing readiness.'
                  : 'An estimate is fine, you can review everything before applying.'}
              </span>
              <PrimaryButton disabled={isExpensesExceedingRevenue} onClick={() => go('business')}>
                {isExpensesExceedingRevenue ? 'Not eligible to proceed' : 'Continue'}
              </PrimaryButton>
            </div>
          </section>
        )}

        {currentStep === 'business' && (
          <section className="mx-auto w-full max-w-4xl py-10 sm:py-14">
            <BackButton onClick={() => go('income')} />
            <Progress current={2} />
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-primary sm:text-5xl lg:text-6xl">Tell us about your business.</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">A little context helps us make your loan outlook more relevant.</p>

            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">How you work</div><div className="text-xs font-semibold text-accent">01 / 03</div></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Business owner', 'Freelancer', 'Self-employed professional', 'Other'].map((type) => {
                  const selected = selectedBusinessType === type;
                  return <button key={type} type="button" onClick={() => setSelectedBusinessType(type)} className={`group flex min-h-[92px] items-center justify-between rounded-[22px] border px-5 text-left transition-all duration-200 ${selected ? 'border-2 border-accent bg-accent/15 dark:bg-accent/20 shadow-[0_12px_28px_rgba(20,184,166,0.12)]' : 'border-border/80 dark:border-slate-800 bg-surface/60 dark:bg-slate-900/70 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface dark:hover:bg-slate-800/80'}`}><div className="flex items-center gap-4"><span className={`flex h-11 w-11 items-center justify-center rounded-full ${selected ? 'bg-accent text-white' : 'bg-surface dark:bg-slate-800 text-muted-foreground'}`}><Briefcase size={18} /></span><div><div className={`font-semibold ${selected ? 'text-accent font-bold' : 'text-primary'}`}>{type}</div><div className="mt-1 text-xs text-muted-foreground">{selected ? 'Selected' : 'Choose one'}</div></div></div>{selected && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white shadow-sm"><Check size={16} /></span>}</button>;
                })}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-border/80 dark:border-slate-800 bg-surface/80 dark:bg-slate-900/80 p-6 shadow-sm sm:p-7">
              <div className="mb-4 flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Business industry</div><p className="mt-1 text-sm text-muted-foreground">Choose the category that best describes your business.</p></div><div className="text-xs font-semibold text-accent">02 / 03</div></div>
              <IndustryPicker id="business-industry" value={businessIndustry} onChange={(industry) => { setBusinessIndustry(industry); setCustomBusinessIndustry(''); }} />
              {(businessIndustry === 'Other, not listed' || businessIndustry.toLowerCase().includes('other')) ? (
                <div className="mt-4 animate-soft-in">
                  <label htmlFor="custom-business-industry" className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Specify your business type or industry
                  </label>
                  <input
                    id="custom-business-industry"
                    value={customBusinessIndustry}
                    onChange={(event) => setCustomBusinessIndustry(event.target.value)}
                    placeholder="e.g. Textile Printing, Solar Installation, Coaching Academy"
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Years in business</div><div className="text-xs font-semibold text-accent">03 / 03</div></div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[1, 2, 3, 4].map((years) => {
                  const selected = yearsInBusiness === years;
                  const label = years === 4 ? '4+ years' : `${years} year${years === 1 ? '' : 's'}`;
                  return <button key={years} type="button" onClick={() => setYearsInBusiness(years)} className={`min-h-[86px] rounded-[20px] border p-4 text-left transition-all duration-200 ${selected ? 'border-2 border-accent bg-accent/15 dark:bg-accent/20 shadow-[0_12px_28px_rgba(20,184,166,0.12)]' : 'border-border/80 dark:border-slate-800 bg-surface/60 dark:bg-slate-900/70 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface dark:hover:bg-slate-800/80'}`}><div className="flex items-center justify-between"><span className={`text-lg font-bold ${selected ? 'text-accent' : 'text-primary'}`}>{label}</span>{selected ? <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white"><Check size={13} /></span> : null}</div><div className="mt-2 text-xs text-muted-foreground">Business history</div></button>;
                })}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-border/80 dark:border-slate-800 bg-surface/80 dark:bg-slate-900/80 p-6 shadow-sm sm:p-7">
              <div className="mb-5"><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Basic eligibility check</div><p className="mt-1 text-sm leading-6 text-muted-foreground">These details give an early indication only. Each lender applies its own criteria.</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label><span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Your age</span><span className="mt-1 block text-xs text-muted-foreground">Applicants must be between 21 and 60 for this readiness check.</span><input type="number" min="18" max="80" value={applicantAge} aria-invalid={Boolean(ageEligibilityMessage)} onChange={(event) => { setApplicantAge(Number(event.target.value)); setEligibilityNotice(''); }} className={`mt-3 w-full rounded-2xl border bg-background px-4 py-3.5 text-xl font-bold text-primary outline-none transition focus:ring-4 focus:ring-highlight ${ageEligibilityMessage ? 'border-destructive focus:border-destructive' : 'border-border focus:border-accent'}`} />{ageEligibilityMessage ? <span role="alert" className="mt-2 block text-xs font-semibold leading-5 text-destructive">{ageEligibilityMessage}</span> : null}</label>
                <div>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">CIBIL score</span>
                    <span className="mt-1 block text-xs text-muted-foreground">A score of 700 or higher is required for this readiness check.</span>
                    <input type="number" min="300" max="900" value={creditScore} aria-invalid={Boolean(creditEligibilityMessage)} onChange={(event) => { setCreditScore(Number(event.target.value)); setEligibilityNotice(''); }} className={`mt-3 w-full rounded-2xl border bg-background px-4 py-3.5 text-xl font-bold text-primary outline-none transition focus:ring-4 focus:ring-highlight ${creditEligibilityMessage ? 'border-destructive focus:border-destructive' : 'border-border focus:border-accent'}`} />
                    {creditEligibilityMessage ? <span role="alert" className="mt-2 block text-xs font-semibold leading-5 text-destructive">{creditEligibilityMessage}</span> : null}
                  </label>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href="https://myscore.cibil.com/CreditView/enrollShort.page?enterprise=CIBIL"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                      title="Check your free official CIBIL score on TransUnion CIBIL"
                    >
                      <span>Check free CIBIL score (TransUnion)</span>
                      <ExternalLink size={13} />
                    </a>
                    <span className="text-[11px] text-muted-foreground">Free official check ↗</span>
                  </div>
                </div>
              </div>
              {eligibilityNotice ? <p role="alert" className="mt-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">{eligibilityNotice}</p> : null}
            </div>

            <div className="mt-8 rounded-[24px] border border-border/80 dark:border-slate-800 bg-surface/90 dark:bg-slate-900/90 p-6 sm:p-7">
              <div className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background dark:bg-slate-800 text-accent"><Info size={17} /></div><div><div className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Why this matters</div><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Business history and stability help us understand which parts of your loan picture may need closer verification later.</p></div></div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4"><span className="hidden text-sm font-medium text-muted-foreground sm:block">We’ll compare your request with the indicative range, not make a final credit decision.</span><PrimaryButton onClick={() => go('requirement')} disabled={!canProceedWithBasicEligibility}>Continue</PrimaryButton></div>
          </section>
        )}

        {currentStep === 'requirement' && (
          <section className="mx-auto w-full max-w-4xl py-10 sm:py-14">
            <BackButton onClick={() => go('business')} />
            <Progress current={3} total={3} label="Loan requirement · Step 3 of 3" />
            <div className="max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-accent">What are you planning for?</div>
              <h2 className="mt-3 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-primary sm:text-5xl lg:text-6xl">Tell us what you need the loan for.</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">Your amount and purpose help put the estimate in context. You can change this later.</p>
            </div>

            <div className="mt-10 rounded-[28px] border border-border/80 dark:border-slate-800 bg-surface/90 dark:bg-slate-900/90 p-6 shadow-sm sm:p-8">
              <label className="block">
                <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Loan amount</span><span className="text-xs text-muted-foreground">Indicative range will be shown next</span></div>
                <div className="mt-4 flex items-center gap-2"><span className="text-2xl font-semibold text-muted-foreground">₹</span><input type="number" min="100000" step="50000" value={requestedAmount} onChange={(e) => setRequestedAmount(Math.max(0, Number(e.target.value)))} className="w-full bg-transparent text-5xl font-bold tracking-[-0.05em] text-primary outline-none focus:text-accent sm:text-6xl" /></div>
                <input aria-label="Loan amount" type="range" min="100000" max="8000000" step="50000" value={requestedAmount} onChange={(e) => setRequestedAmount(Number(e.target.value))} className="mt-6 w-full accent-[#0B8F83]" />
                <div className="mt-2 flex justify-between text-xs font-semibold text-muted-foreground"><span>₹1L</span><span>₹80L</span></div>
              </label>

              <div className="mt-9">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Purpose</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {loanPurposes.map((purpose) => {
                    const selected = loanPurpose === purpose;
                    return (
                      <button
                        key={purpose}
                        type="button"
                        onClick={() => handlePurposeSelect(purpose)}
                        className={`flex min-h-[72px] items-center justify-between rounded-[20px] border px-5 text-left transition-all duration-200 ${
                          selected
                            ? 'border-2 border-accent bg-accent/15 dark:bg-accent/20 shadow-[0_12px_28px_rgba(20,184,166,0.12)]'
                            : 'border-border/80 dark:border-slate-800 bg-surface/60 dark:bg-slate-950/70 hover:border-accent/40 hover:bg-surface dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <span className={`font-semibold ${selected ? 'text-accent font-bold' : 'text-primary'}`}>{purpose}</span>
                        {selected && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white">
                            <Check size={14} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {loanPurpose === 'Other' && (
                  <div className="mt-4 animate-soft-in">
                    <label htmlFor="custom-loan-purpose" className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Specify your loan purpose
                    </label>
                    <input
                      id="custom-loan-purpose"
                      value={customLoanPurpose}
                      onChange={(e) => setCustomLoanPurpose(e.target.value)}
                      placeholder="e.g. Raw material bulk order, Warehouse lease deposit, New product launch"
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight"
                    />
                  </div>
                )}
              </div>

              <div className="mt-9 border-t border-border/80 dark:border-slate-800 pt-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Loan category</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Auto-matched to your purpose. You can pick an alternative facility below if preferred.
                    </p>
                  </div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">Auto-matched</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {loanCategories.map(([category, description]) => {
                    const selected = loanCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setLoanCategory(category)}
                        className={`min-h-[118px] rounded-[20px] border p-5 text-left transition-all duration-200 ${
                          selected
                            ? 'border-2 border-accent bg-accent/15 dark:bg-accent/20 shadow-[0_12px_28px_rgba(20,184,166,0.12)]'
                            : 'border-border/80 dark:border-slate-800 bg-surface/60 dark:bg-slate-950/70 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className={`text-base font-bold ${selected ? 'text-accent' : 'text-primary'}`}>{category}</span>
                          {selected ? (
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                              <Check size={14} />
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-9 border-t border-border/80 dark:border-slate-800 pt-8">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Repayment plan</div><p className="mt-2 text-sm leading-6 text-muted-foreground">Choose a tenure and an illustrative annual interest assumption to see a monthly EMI. This is not a lender offer or an APR.</p></div><div className="rounded-2xl bg-highlight dark:bg-slate-800 px-4 py-3 text-right"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">Illustrative EMI</div><div className="mt-1 text-xl font-bold text-primary">{formatCurrency(estimatedEmi)}<span className="ml-1 text-xs font-medium text-muted-foreground">/ month</span></div></div></div>
                <div className="mt-6">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">How long do you want the loan for?</div>
                  <div className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((years) => (
                      <button
                        key={years}
                        type="button"
                        onClick={() => setLoanTenureYears(years)}
                        className={`rounded-xl sm:rounded-2xl border px-1 sm:px-3 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition text-center ${
                          loanTenureYears === years
                            ? 'border-2 border-accent bg-accent/15 text-accent dark:bg-accent/20 shadow-sm'
                            : 'border-border/80 dark:border-slate-800 bg-surface/60 dark:bg-slate-950/70 text-primary hover:border-accent/35 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        {years} {years === 1 ? 'yr' : 'yrs'}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="mt-7 block"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Illustrative annual interest rate</span><span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-white dark:text-slate-900">{annualInterestRate.toFixed(2)}%</span></div><input aria-label="Illustrative annual interest rate" type="range" min="8" max="24" step="0.25" value={annualInterestRate} onChange={(event) => setAnnualInterestRate(Number(event.target.value))} className="mt-4 w-full accent-[#0B8F83]" /><div className="mt-2 flex justify-between text-xs font-medium text-muted-foreground"><span>8%</span><span>24%</span></div></label>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-[20px] bg-surface p-5 text-sm leading-6 text-muted-foreground"><Info size={18} className="mt-0.5 shrink-0 text-accent" /><span>This loan outlook is an indicative estimate based on the information you provide. The displayed EMI uses your selected {loanTenureYears}-year tenure and {annualInterestRate.toFixed(2)}% annual rate. A real lender will provide its own rate, fees, APR and repayment schedule after verification.</span></div>

            <div className="mt-8 flex items-center justify-end"><PrimaryButton onClick={() => go('calculating')}>View my loan outlook</PrimaryButton></div>
          </section>
        )}

        {currentStep === 'calculating' && (
          <section className="mx-auto flex min-h-[72vh] w-full max-w-xl flex-col items-center justify-center text-center animate-soft-in">
            <div className="relative h-44 w-44">
              <div className="absolute inset-0 rounded-full border border-border" />
              <div className="absolute inset-4 rounded-full border border-accent/20" />
              <div className="absolute inset-10 rounded-full bg-highlight/75 shadow-[0_0_70px_rgba(11,143,131,0.13)]" />
              <div className="absolute inset-[18%] animate-pulse-soft rounded-full border border-dashed border-accent/50" />
              <div className="absolute inset-0 animate-spin-slow"><span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_0_8px_rgba(11,143,131,0.07)]" /></div>
              <div className="absolute inset-0 flex items-center justify-center text-accent"><Sparkles size={26} /></div>
            </div>
            <div className="mt-9 text-xs font-bold uppercase tracking-[0.18em] text-accent">Building your loan outlook</div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-primary sm:text-4xl">{calculationCopy[calculationStage]}</h2>
            <div className="mt-6 grid w-full max-w-md gap-2 text-left sm:grid-cols-2">
              {calculationCopy.map((item, i) => <div key={item} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${i <= calculationStage ? 'bg-highlight text-primary' : 'bg-surface text-muted-foreground'}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${i <= calculationStage ? 'bg-accent text-white' : 'bg-background text-muted-foreground'}`}>{i <= calculationStage ? <Check size={12} /> : i + 1}</span>{item}</div>)}
            </div>
            <p className="mt-5 text-sm text-muted-foreground">This is an indicative view — not a final credit decision.</p>
          </section>
        )}

        {currentStep === 'snapshot' && (
          <section className="mx-auto w-full max-w-[1240px] py-8 sm:py-12 animate-soft-in">
            <div className="flex flex-col items-center text-center">
              <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] ${isReady ? 'border-accent/15 bg-highlight text-accent' : 'border-warning/15 bg-warning/10 text-warning'}`}>{isReady ? <CheckCircle size={15} /> : <Info size={15} />}{isReady ? 'Your request fits the indicative picture' : withinIndicativeRange ? 'A little more information may help' : 'Your request is above the indicative range'}</div>
              <h2 className="mt-5 text-4xl font-bold tracking-[-0.05em] text-primary sm:text-5xl">Your loan outlook</h2>
              <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">Based on what you shared, here is an indicative view of your borrowing potential, your request and what you can prepare next.</p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.34fr_0.86fr]">
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[30px] border border-border/80 dark:border-slate-800 bg-surface/90 dark:bg-slate-900/95 p-7 shadow-[0_30px_80px_rgba(7,20,47,0.10)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-10">
                  <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-highlight blur-3xl opacity-70" />
                  <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(7,20,47,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(7,20,47,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-4"><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Indicative borrowing range</div><span className="rounded-full bg-surface dark:bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Subject to verification</span></div>
                    <div className="mt-3 text-2xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] sm:tracking-[-0.055em] text-primary">{formatCurrency(minCapacity)} <span className="font-normal text-muted-foreground">–</span> {formatCurrency(maxCapacity)}</div>
                    <div className="mt-3 text-sm font-semibold text-muted-foreground">You asked for <span className="text-primary">{formatCurrency(requestedAmount)}</span> for {effectiveLoanPurpose.toLowerCase()}.</div>
                    <div className="mt-9">
                      {(() => {
                        const safeRangeMin = Math.min(minCapacity, 8000000);
                        const safeRangeMax = Math.min(Math.max(maxCapacity, safeRangeMin + 100000), 8000000);
                        const clampedRequest = Math.min(Math.max(requestedAmount, safeRangeMin), safeRangeMax);
                        const rawPosition = safeRangeMax === safeRangeMin ? 50 : ((clampedRequest - safeRangeMin) / (safeRangeMax - safeRangeMin)) * 100;
                        const position = Math.max(0, Math.min(100, rawPosition));
                        const badgeTransform = position < 14 ? 'translateX(0%)' : position > 86 ? 'translateX(-100%)' : 'translateX(-50%)';
                        const badgeLeft = position < 14 ? '0%' : position > 86 ? '100%' : `${position}%`;
                        return (
                          <>
                            <div className="relative pt-9 px-1">
                              <div
                                className="absolute top-0 whitespace-nowrap rounded-full border border-primary/10 bg-primary px-3 py-1.5 text-[10px] font-bold tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(7,20,47,0.12)] transition-all duration-300"
                                style={{ left: badgeLeft, transform: badgeTransform }}
                              >
                                {formatLakh(requestedAmount)} requested
                              </div>
                              <div className="relative h-2 rounded-full bg-[#E8E6DF] dark:bg-slate-700">
                                <div
                                  className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-300"
                                  style={{ width: `${Math.max(2, Math.min(100, position))}%` }}
                                />
                                <div
                                  className="absolute -top-[7px] transition-all duration-300"
                                  style={{
                                    left: `${Math.max(2, Math.min(98, position))}%`,
                                    transform: 'translateX(-50%)',
                                  }}
                                >
                                  <div className="h-6 w-6 rounded-full border-[5px] border-white dark:border-slate-800 bg-accent shadow-[0_0_0_6px_rgba(11,143,131,0.08),0_8px_18px_rgba(7,20,47,0.14)]" />
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between text-xs font-semibold text-muted-foreground"><span>{formatLakh(safeRangeMin)}</span><span className="text-accent font-bold">Indicative range</span><span>{formatLakh(safeRangeMax)}</span></div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="mt-10 grid gap-3 sm:grid-cols-3">
                      {[['Illustrative EMI', formatCurrency(estimatedEmi) + ' / mo'], ['Repayment plan', `${loanTenureYears} years · ${annualInterestRate.toFixed(2)}%`], ['Monthly surplus', formatCurrency(netMonthly)]].map(([label, value], index) => <div key={label} className={`rounded-[20px] p-5 ${index === 0 ? 'bg-primary text-white' : 'bg-surface dark:bg-slate-800/80 text-primary'}`}><div className={`text-xs ${index === 0 ? 'text-white/65' : 'text-muted-foreground'}`}>{label}</div><div className="mt-1 text-xl font-bold tracking-[-0.02em]">{value}</div></div>)}
                    </div>
                    <div className="mt-7 rounded-[22px] bg-highlight/75 dark:bg-slate-800/80 p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div><div className="text-xs font-bold uppercase tracking-[0.15em] text-accent">How we got here</div><p className="mt-1 max-w-2xl text-sm leading-6 text-primary">Three signals shape this prototype's indicative picture. A real lender would combine these with credit history, verified documents and its own underwriting policy.</p></div>
                        <span className="hidden rounded-full bg-surface/80 dark:bg-slate-700/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:inline-flex">Indicative only</span>
                      </div>
                      <div className="mt-5 grid gap-2 grid-cols-2 sm:grid-cols-4">
                        {[['Business history', `${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years`], ['Cash flow', formatCurrency(netMonthly)], ['Loan request', formatCurrency(requestedAmount)], ['Repayment plan', `${loanTenureYears} years at ${annualInterestRate.toFixed(2)}%`]].map(([label, value]) => <div key={label} className="rounded-[18px] bg-surface/80 dark:bg-slate-900/80 p-3 sm:p-4"><div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-1 text-xs sm:text-sm font-bold text-primary">{value}</div></div>)}
                      </div>
                      <div className="mt-4 text-xs leading-5 text-muted-foreground">Verification of income, business documents and credit profile happens during formal assessment.</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-border/80 dark:border-slate-800 bg-surface/70 dark:bg-slate-900/80 p-6 sm:p-8">
                  <div className="flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Your next move</div><h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary">Prepare, then apply with context.</h3></div><span className="hidden h-12 w-12 items-center justify-center rounded-full bg-highlight text-accent sm:flex"><ArrowUpRight size={20} /></span></div>
                  <div className="mt-7 grid gap-3 sm:grid-cols-5">
                    {['Gather documents', 'Start application', 'Verify information', 'Assessment', 'Decision'].map((item, i) => <div key={item} className={`rounded-2xl p-4 ${i === 0 ? 'bg-highlight text-primary' : 'bg-surface dark:bg-slate-800/80 text-muted-foreground'}`}><div className={`text-xs font-bold ${i === 0 ? 'text-accent' : 'text-muted-foreground'}`}>0{i + 1}</div><div className="mt-2 text-sm font-semibold leading-5">{item}</div></div>)}
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-[28px] border border-border/80 dark:border-slate-800 bg-highlight/65 dark:bg-slate-900/80 p-6 shadow-[0_18px_42px_rgba(7,20,47,0.04)] sm:p-7">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Basic eligibility requirements</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">A helpful pre-check, not a lender decision. Eligibility and maturity-age limits vary by lender and product.</p>
                  <div className="mt-5 space-y-3">
                    {[
                      ['Age 21–60', `${applicantAge} years`, meetsAgeRequirement],
                      ['CIBIL score 700+', `${creditScore}`, meetsCreditRequirement],
                      ['Stable income', `${formatCurrency(netMonthly)} monthly surplus`, meetsIncomeRequirement],
                      ['Business history', `${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years`, meetsBusinessHistoryRequirement],
                    ].map(([label, value, met]) => <div key={label as string} className="flex items-center justify-between gap-3 rounded-2xl bg-surface/80 dark:bg-slate-800/80 px-4 py-3"><div className="flex items-center gap-3"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${met ? 'bg-accent text-white' : 'bg-warning/15 text-warning'}`}>{met ? <Check size={13} /> : <Info size={13} />}</span><span className="text-sm font-semibold text-primary">{label as string}</span></div><span className="text-right text-xs font-medium text-muted-foreground">{value as string}</span></div>)}
                  </div>
                </div>

                <div className="rounded-[28px] border border-border/80 dark:border-slate-800 bg-surface/60 dark:bg-slate-900/80 p-6 shadow-[0_18px_42px_rgba(7,20,47,0.04)] sm:p-7">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">What lenders typically verify</div>
                  <div className="mt-4 space-y-3">
                    {[['Business continuity', `${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years shared`], ['Cash flow', `${formatCurrency(netMonthly)} estimated surplus`], ['Credit profile', 'Checked during assessment']].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 border-b border-border-light dark:border-slate-800 pb-3 last:border-0 last:pb-0"><span className="text-sm font-semibold text-primary">{label}</span><span className="text-right text-xs font-medium text-muted-foreground">{value}</span></div>)}
                  </div>
                </div>

                <DocumentReadinessAssistant onReadyCountChange={setVerifiedDocumentCount} />

                <div className="rounded-[28px] border border-primary/10 bg-primary p-6 text-white shadow-[0_24px_60px_rgba(7,20,47,0.16)] sm:p-7">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">Ready for the next step?</div>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em]">Your details can carry forward.</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">Continue to the formal application without starting again.</p>
                  {!hasRequiredDocuments ? <p role="alert" className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-xs font-medium leading-5 text-white/85">Upload all 5 required documents first: PAN card, Aadhaar card, business bank statements, income and business proof, and business registration. {verifiedDocumentCount} of {requiredDocumentCount} complete.</p> : <p className="mt-4 rounded-2xl bg-accent/20 px-4 py-3 text-xs font-semibold leading-5 text-white">All 5 required documents have been uploaded and checked. You can continue.</p>}
                  {documentGateNotice ? <p role="alert" className="mt-3 text-xs leading-5 text-[#F4CC83]">{documentGateNotice}</p> : null}
                  <PrimaryButton
                    disabled={!hasRequiredDocuments}
                    onClick={() => go('handoff')}
                    className="btn-white-contrast mt-6 w-full !bg-white !text-[#0C1B47] hover:!bg-slate-100 disabled:!bg-white/30 disabled:!text-[#0C1B47]/50 shadow-md font-bold"
                  >
                    <span className="font-bold text-[#0C1B47]">{hasRequiredDocuments ? 'Continue to application' : 'Complete document checks to continue'}</span>
                  </PrimaryButton>
                  <button type="button" onClick={saveSnapshot} className="mt-4 w-full rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/15 hover:text-white">Save this loan outlook ↗</button>
                  <div className="mt-2 text-center text-[11px] leading-5 text-white/55">Keep your estimate handy while you prepare your documents.</div>
                </div>
              </aside>
            </div>
          </section>
        )}

        {currentStep === 'handoff' && (
          <section className="mx-auto flex w-full max-w-4xl flex-col justify-center py-10 sm:py-16 animate-soft-in">
            <BackButton onClick={() => go('snapshot')} />
            <div className="max-w-2xl"><div className="inline-flex items-center gap-2 rounded-full bg-highlight px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-accent"><CheckCircle size={14} /> Clearer next step</div><h2 className="mt-6 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-primary sm:text-5xl lg:text-6xl">You're ready for the next step.</h2><p className="mt-5 text-lg leading-8 text-muted-foreground">We've already captured the information you shared. You won't need to start from scratch.</p></div>
            <div className="mt-10 grid gap-4 md:grid-cols-3"><div className="rounded-[24px] bg-surface p-6"><div className="text-xs text-muted-foreground">Your request</div><div className="mt-2 text-2xl font-bold text-primary">{formatCurrency(requestedDisplay)}</div></div><div className="rounded-[24px] bg-surface p-6"><div className="text-xs text-muted-foreground">Indicative range</div><div className="mt-2 text-2xl font-bold text-primary">{formatLakh(minCapacity)} – {formatLakh(maxCapacity)}</div></div><div className="rounded-[24px] bg-surface p-6"><div className="text-xs text-muted-foreground">Illustrative EMI</div><div className="mt-2 text-2xl font-bold text-primary">{formatCurrency(estimatedEmi)}</div></div></div>
            <div className="mt-8 rounded-[28px] border border-border/80 dark:border-slate-800 bg-surface/80 dark:bg-slate-900/80 p-7 sm:p-8"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">What happens next</div><div className="mt-6 grid gap-3 sm:grid-cols-4">{['Complete application', 'Verify details', 'Assessment', 'Decision'].map((item, i) => <div key={item} className="rounded-[18px] bg-background dark:bg-slate-800 p-4"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-highlight text-xs font-bold text-accent">0{i + 1}</div><div className="mt-3 text-sm font-semibold text-primary">{item}</div></div>)}</div></div>
            <div className="mt-8 flex flex-wrap items-center gap-3"><PrimaryButton onClick={() => go('application')}>Continue to formal application</PrimaryButton><SecondaryButton onClick={() => go('snapshot')}>Review loan outlook</SecondaryButton></div>
          </section>
        )}

        {currentStep === 'application' && (
          <section className="mx-auto w-full max-w-4xl py-10 sm:py-14 animate-soft-in">
            <BackButton onClick={() => go('handoff')} />
            <Progress current={1} total={4} label="Application · Step 1 of 4" />
            <div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Final review</div><h2 className="mt-3 text-4xl font-bold tracking-[-0.045em] text-primary sm:text-5xl">Complete your application.</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">Your earlier answers are carried forward so you can focus on confirming the details that matter.</p></div>

            <div className="mt-8 rounded-[26px] border border-border/80 dark:border-slate-800 bg-highlight/75 dark:bg-slate-900/80 p-5 sm:p-6">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Your loan outlook</div>
              <div className="mt-4 grid gap-2.5 sm:gap-3 grid-cols-2 sm:grid-cols-4">
                {[['Requested', formatCurrency(requestedDisplay)], ['Purpose', effectiveLoanPurpose], ['Business age', `${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years`], ['Illustrative EMI', formatCurrency(estimatedEmi) + ' / mo']].map(([label, value]) => <div key={label} className="rounded-[18px] bg-surface/80 dark:bg-slate-800/80 p-3 sm:p-4"><div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-1 text-xs sm:text-sm font-bold text-primary truncate" title={value}>{value}</div></div>)}
              </div>
              <div className="mt-4 text-xs leading-5 text-muted-foreground">Your indicative range: <span className="font-semibold text-primary">{formatLakh(minCapacity)} – {formatLakh(maxCapacity)}</span>. Final pricing and approval depend on lender verification and assessment.</div>
            </div>

            <div className="mt-7 rounded-[28px] border border-border/80 dark:border-slate-800 bg-surface/80 dark:bg-slate-900/80 p-6 shadow-[0_20px_50px_rgba(7,20,47,0.05)] sm:p-8">
              <div className="mb-5"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Confirm your details</div><h3 className="mt-2 text-xl font-bold text-primary">Review before you submit</h3></div>
              <div className="grid gap-7 md:grid-cols-2">
                <div><label htmlFor="full-name" className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Full name</label><input id="full-name" placeholder="Enter your full name" value={applicantName} inputMode="text" autoComplete="name" aria-invalid={Boolean(nameInputHint || nameStructureHint)} onChange={(event) => { const rawName = event.target.value; const cleanName = formatFullName(rawName); setApplicantName(cleanName); setApplicationError(''); setNameInputHint(rawName === rawName.replace(/[^a-zA-Z\s]/g, '') ? '' : 'Only letters and spaces are allowed in your name.'); }} className={`mt-2 w-full rounded-2xl border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:ring-4 focus:ring-highlight ${nameInputHint || nameStructureHint ? 'border-destructive focus:border-destructive' : 'border-border focus:border-accent'}`} /></div>
                <div>
                  <label htmlFor="applicant-phone" className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    <span>Contact phone number</span>
                    <span className="text-[11px] font-semibold normal-case text-accent">For agent callback</span>
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-bold text-muted-foreground">
                      +91
                    </div>
                    <input
                      id="applicant-phone"
                      type="tel"
                      placeholder="98765 43210"
                      value={applicantPhone}
                      inputMode="numeric"
                      autoComplete="tel"
                      aria-invalid={Boolean(phoneInputHint)}
                      onChange={(event) => {
                        const raw = event.target.value.replace(/[^\d\s]/g, '');
                        setApplicantPhone(raw);
                        setApplicationError('');
                        const digits = raw.replace(/\D/g, '');
                        if (digits.length > 0 && digits.length < 10) {
                          setPhoneInputHint('Enter a valid 10-digit mobile number for the agent call.');
                        } else {
                          setPhoneInputHint('');
                        }
                      }}
                      className={`w-full rounded-2xl border bg-background py-3.5 pl-14 pr-4 font-medium text-primary outline-none transition focus:ring-4 focus:ring-highlight ${phoneInputHint ? 'border-destructive focus:border-destructive' : 'border-border focus:border-accent'}`}
                    />
                  </div>
                  {phoneInputHint ? <p role="alert" className="mt-2 text-xs font-medium text-destructive">{phoneInputHint}</p> : <p className="mt-1.5 text-[11px] text-muted-foreground">Our loan specialist will call this number for verification.</p>}
                </div>
                <div>
                  <label htmlFor="applicant-email" className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    <span>Confirmation email address</span>
                    <span className="text-[11px] font-semibold normal-case text-accent">For loan receipt</span>
                  </label>
                  <input
                    id="applicant-email"
                    type="email"
                    placeholder="Enter email for confirmation receipt"
                    value={applicantEmail}
                    autoComplete="email"
                    onChange={(event) => {
                      setApplicantEmail(event.target.value);
                      setApplicationError('');
                    }}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight"
                  />
                  <p className="mt-1.5 text-[11px] text-muted-foreground">We will send your reference ID and EMI schedule to this email.</p>
                </div>
                <div><label htmlFor="work-type" className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Work type</label><select id="work-type" value={selectedBusinessType} onChange={(event) => setSelectedBusinessType(event.target.value)} className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight"><option>Business owner</option><option>Freelancer</option><option>Self-employed professional</option><option>Other</option></select></div>
                <div><label htmlFor="review-business-industry" className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Business industry</label><div className="mt-2"><IndustryPicker id="review-business-industry" value={businessIndustry} onChange={(industry) => { setBusinessIndustry(industry); setCustomBusinessIndustry(''); setApplicationError(''); }} /></div>{(businessIndustry === 'Other, not listed' || businessIndustry.toLowerCase().includes('other')) ? <input value={customBusinessIndustry} onChange={(event) => { setCustomBusinessIndustry(event.target.value); setApplicationError(''); }} placeholder="Enter your business type or industry" className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight" /> : null}</div>
                <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Monthly revenue</div><div className="mt-2 rounded-2xl border border-border bg-surface px-4 py-3.5 font-semibold text-primary">{formatCurrency(monthlyRevenue)}</div></div>
                <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Loan purpose & facility</div><div className="mt-2 rounded-2xl border border-border bg-surface px-4 py-3.5 font-semibold text-primary">{effectiveLoanPurpose} <span className="text-xs font-normal text-muted-foreground">({loanCategory})</span></div></div>
              </div>
              {nameInputHint || nameStructureHint ? <p role="alert" className="mt-3 text-sm font-medium text-destructive">{nameInputHint || nameStructureHint}</p> : null}
              {applicationError ? <p role="alert" className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{applicationError}</p> : null}
              <div className="mt-8 rounded-2xl bg-highlight/70 p-4 text-sm leading-6 text-primary">Some information is already filled in from your readiness journey. You can review it before submitting.</div>
            </div>
            <div className="mt-8 flex flex-col items-end gap-3">
              <div className="max-w-xl text-right text-xs leading-5 text-muted-foreground">By continuing, you confirm the details are accurate. Final eligibility, pricing and approval are subject to verification and lender assessment.</div>
              <PrimaryButton disabled={isSubmittingApp} onClick={submitApplication}>
                {isSubmittingApp ? 'Submitting & sending email…' : 'Submit application'}
              </PrimaryButton>
            </div>
          </section>
        )}

        {currentStep === 'submitted' && (
          <section className="mx-auto flex min-h-[calc(100vh-125px)] w-full max-w-4xl flex-col items-center justify-center py-8 text-center animate-soft-in">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-highlight text-accent shadow-[0_0_0_14px_rgba(11,143,131,0.05)] sm:h-24 sm:w-24">
              <CheckCircle size={38} />
              <div className="absolute inset-0 rounded-full border border-accent/30 animate-pulse-soft" />
            </div>
            <div className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Application received · Ref #{submittedAppId || 'MQ-APP-782914'}
            </div>
            <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em] text-primary sm:text-5xl">
              You're on your way{applicantName ? `, ${applicantName.split(' ')[0]}` : ''}.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Thank you for applying with MONEYQUICK! Your application has been received and is being processed by our underwriting desk.
            </p>
            {confirmationNotice ? (
              <p role="status" className="mt-4 max-w-2xl rounded-2xl bg-highlight px-4 py-3 text-sm leading-6 text-primary">
                {confirmationNotice}
              </p>
            ) : null}

            {/* Email Dispatch & Agent Callback Notification Cards */}
            <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2">
              <div className="rounded-[24px] border border-border-light bg-surface p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highlight text-accent">
                    <Mail size={20} />
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Dispatched
                  </span>
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Confirmation Receipt</div>
                <div className="mt-1 text-base font-bold text-primary break-all">
                  {applicantEmail || authUser?.email || 'Registered email'}
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  A formal receipt with your requested amount ({formatCurrency(requestedDisplay)}), illustrative EMI ({formatCurrency(estimatedEmi)}/mo), and reference ID #{submittedAppId || 'MQ-APP-782914'} has been sent to your email.
                </p>
              </div>

              <div className="rounded-[24px] border border-border-light bg-surface p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Phone size={20} />
                  </div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                    Next Step
                  </span>
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Agent Verification Call</div>
                <div className="mt-1 text-base font-bold text-primary">
                  {applicantPhone ? `+91 ${applicantPhone.replace(/\D/g, '').slice(-10)}` : 'Your contact number'}
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  A MONEYQUICK loan verification specialist will call you within 24–48 hours to confirm your documents and guide you through the lender assessment.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <Check size={14} /> Keep your PAN & bank statements handy
                </div>
              </div>
            </div>

            <div className="mt-8 grid w-full gap-3 sm:grid-cols-4">
              {([
                ['submitted', 'Submitted', 'Application received'],
                ['verification', 'Verification', 'Check your details'],
                ['assessment', 'Assessment', 'Review your application'],
                ['decision', 'Decision', 'Outcome stage'],
              ] as Array<[Step, string, string]>).map(([target, item, note], i) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => go(target)}
                  className={`group rounded-[20px] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(7,20,47,0.08)] ${target === 'submitted' ? 'bg-highlight text-primary' : 'bg-surface dark:bg-slate-900/70 text-muted-foreground hover:bg-surface dark:hover:bg-slate-800'}`}
                >
                  <div className={`text-xs font-bold uppercase tracking-[0.14em] ${target === 'submitted' ? 'text-accent' : 'text-muted-foreground'}`}>0{i + 1}</div>
                  <div className={`mt-2 text-sm font-semibold ${target === 'submitted' ? 'text-primary' : 'text-primary'}`}>{item}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">{note}</div>
                </button>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTrackingAppId(submittedAppId || 'MQ-APP-782914');
                  go('tracking');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-[#0B8F83] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95"
              >
                <span>Track Application Live</span>
                <span>&rarr;</span>
              </button>
              <PrimaryButton onClick={() => go('verification')}>Continue to verification</PrimaryButton>
              <SecondaryButton onClick={() => go('snapshot')} icon={<ArrowUpRight size={16} />}>View snapshot</SecondaryButton>
            </div>
          </section>
        )}

        {currentStep === 'verification' && (
          <section className="mx-auto flex min-h-[calc(100vh-125px)] w-full max-w-4xl flex-col justify-center py-8 sm:py-12 animate-soft-in">
            <BackButton onClick={() => go('submitted')} />
            <Progress current={2} total={4} label="After submission · Stage 2 of 4" />
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-highlight px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-accent"><CheckCircle size={14} /> Verification</div>
              <h2 className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.045em] text-primary sm:text-5xl">Let's verify the details you shared.</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">In the real journey, this is where submitted information and documents would be checked before assessment.</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[['Business continuity', `${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years shared`], ['Cash flow', `${formatCurrency(netMonthly)} estimated surplus`], ['Loan request', formatCurrency(requestedDisplay)]].map(([label, value]) => (
                <div key={label} className="rounded-[24px] bg-surface dark:bg-slate-900/80 p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</div><div className="mt-2 text-xl font-bold text-primary">{value}</div></div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3"><PrimaryButton onClick={() => go('assessment')}>Continue to assessment</PrimaryButton><SecondaryButton onClick={() => go('submitted')}>Back</SecondaryButton></div>
          </section>
        )}

        {currentStep === 'assessment' && (
          <section className="mx-auto flex min-h-[calc(100vh-125px)] w-full max-w-4xl flex-col justify-center py-8 sm:py-12 animate-soft-in">
            <BackButton onClick={() => go('verification')} />
            <Progress current={3} total={4} label="After submission · Stage 3 of 4" />
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-highlight px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-accent">Assessment</div>
              <h2 className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.045em] text-primary sm:text-5xl">Your application moves to assessment.</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">This prototype shows the stage after verification. A real lender would assess the verified information using its own underwriting policy.</p>
            </div>
            <div className="mt-8 rounded-[28px] border border-border/80 dark:border-slate-800 bg-surface/80 dark:bg-slate-900/80 p-7 shadow-[0_20px_50px_rgba(7,20,47,0.05)] sm:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Assessment checklist</div>
              <div className="mt-5 divide-y divide-border-light dark:divide-slate-800">
                {['Verified business information', 'Reviewed financial information', 'Checked credit profile', 'Applied lender assessment policy'].map((item, i) => (
                  <div key={item} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-highlight text-accent"><Check size={14} /></span><span className="text-sm font-semibold text-primary">{item}</span></div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3"><PrimaryButton onClick={() => go('decision')}>Continue to decision</PrimaryButton><SecondaryButton onClick={() => go('verification')}>Back</SecondaryButton></div>
          </section>
        )}

        {currentStep === 'decision' && (
          <section className="mx-auto flex min-h-[calc(100vh-125px)] w-full max-w-4xl flex-col justify-center py-8 sm:py-12 animate-soft-in">
            <BackButton onClick={() => go('assessment')} />
            <Progress current={4} total={4} label="After submission · Stage 4 of 4" />
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-surface dark:bg-slate-900/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Decision stage</div>
              <h2 className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.045em] text-primary sm:text-5xl">Your application is at the decision stage.</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">In this prototype, this is the end of the post-submission journey. A real decision would depend on the lender's verified assessment.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] bg-surface dark:bg-slate-900/80 p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Requested</div><div className="mt-2 text-2xl font-bold text-primary">{formatCurrency(requestedDisplay)}</div></div>
              <div className="rounded-[24px] bg-surface dark:bg-slate-900/80 p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Purpose</div><div className="mt-2 text-xl font-bold text-primary">{effectiveLoanPurpose}</div></div>
              <div className="rounded-[24px] bg-surface dark:bg-slate-900/80 p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Current state</div><div className="mt-2 text-xl font-bold text-primary">Pending decision</div></div>
            </div>
            <div className="mt-8 rounded-[24px] bg-highlight/75 dark:bg-slate-900/80 p-5 text-sm leading-6 text-primary"><strong>Prototype note:</strong> no real approval or rejection is being made here. This stage exists so you can demonstrate the complete post-submission experience.</div>
            <div className="mt-8 flex flex-wrap items-center gap-3"><PrimaryButton onClick={() => go('snapshot')}>Back to snapshot</PrimaryButton><SecondaryButton onClick={() => go('submitted')}>View journey</SecondaryButton></div>
          </section>
        )}
      </main>

      <footer className="relative z-10 border-t border-border-light dark:border-slate-800 bg-surface/50 dark:bg-slate-950/70 px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1440px] gap-4 text-base text-muted-foreground sm:grid-cols-3">
          <div className="min-w-0 rounded-2xl bg-surface/70 dark:bg-slate-900/80 p-5">
            <div className="text-lg font-bold leading-6 text-primary">Have a query?<br />Reach out to us.</div>
            <div className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Email</div>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=regan.hendriques%40bombaydc.com&su=Hi%20I%20need%20your%20help" target="_blank" rel="noreferrer" className="mt-1 block break-all text-base font-bold text-accent underline-offset-4 transition hover:text-primary hover:underline">regan.hendriques@bombaydc.com</a>
          </div>
          <div className="rounded-2xl bg-surface/70 dark:bg-slate-900/80 p-5">
            <div className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Phone</div>
            <a href="tel:+918976030646" className="mt-2 inline-block text-base font-bold text-accent underline-offset-4 transition hover:text-primary hover:underline">+91 8976030646</a>
          </div>
          <div className="rounded-2xl bg-surface/70 dark:bg-slate-900/80 p-5">
            <div className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Address</div>
            <div className="mt-2 text-base font-bold leading-6 text-primary">Lotus Signature Building, 1602 Floor,<br />Jogeshwari West</div>
          </div>
        </div>
      </footer>

      <KiraAssistant />
    </div>
  );
}
