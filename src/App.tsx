import React, { useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './supabase';

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
  'Other — not listed',
] as const;
const loanCategories = [
  ['Business / MSME loan', 'For expansion, equipment, inventory or longer-term business investment.'],
  ['Working capital loan', 'For day-to-day cash flow, supplier payments and short-term operating needs.'],
  ['Loan against property', 'For larger business needs when you can pledge eligible property as collateral.'],
  ['Personal or vehicle loan', 'For eligible personal expenses or a vehicle purchase; lender terms vary by purpose.'],
] as const;

type Step = 'landing' | 'income' | 'business' | 'requirement' | 'calculating' | 'snapshot' | 'handoff' | 'application' | 'submitted' | 'verification' | 'assessment' | 'decision';

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
    onClick={onClick}
    className={`group inline-flex items-center justify-center gap-3 rounded-[16px] bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-[0_12px_30px_rgba(7,20,47,0.12)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#0b2148] hover:shadow-[0_18px_40px_rgba(7,20,47,0.16)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    <span>{children}</span>
    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
  </button>
);

const SecondaryButton = ({ children, onClick, className = '', icon = null }: SecondaryButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`group inline-flex items-center justify-center gap-2 rounded-[16px] bg-surface px-6 py-3.5 font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-highlight active:scale-[0.98] ${className}`}
  >
    {children}
    {icon}
  </button>
);

const Atmosphere = ({ strong = false }) => (
  <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${strong ? 'opacity-100' : 'opacity-80'}`} aria-hidden="true">
    <div className="absolute -right-48 -top-48 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(11,143,131,0.12),transparent_67%)] blur-[18px]" />
    <div className="absolute -bottom-56 -left-48 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(216,199,165,0.17),transparent_68%)] blur-[24px]" />
    <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.2)_44%,transparent_70%)]" />
    <div className="absolute inset-0 opacity-[0.11] [background-image:radial-gradient(rgba(7,20,47,0.12)_0.65px,transparent_0.65px)] [background-size:20px_20px]" />
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
  const displayName = user.user_metadata.full_name || user.user_metadata.name || user.email?.split('@')[0] || 'Account';

  useEffect(() => {
    setFullName(user.user_metadata.full_name || user.user_metadata.name || '');
    setPhone(user.user_metadata.phone || user.phone || '');
    setAddress(user.user_metadata.address || '');
  }, [user]);

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setNotice('');
    try {
      const { data, error } = await supabase.auth.updateUser({ data: { full_name: formatFullName(fullName), phone: phone.trim(), address: address.trim() } });
      if (error) throw error;
      if (data.user) onProfileUpdated(data.user);
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
  return <div className="relative"><button type="button" onClick={() => { setOpen((value) => !value); setEditing(false); }} aria-expanded={open} className="flex items-center gap-2 rounded-full border border-white/70 bg-white/75 py-1.5 pl-1.5 pr-3 text-left shadow-[0_10px_26px_rgba(7,20,47,0.06)] transition hover:bg-white"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">{displayName.charAt(0).toUpperCase()}</span><span className="hidden max-w-28 truncate text-sm font-semibold text-primary sm:block">{displayName}</span><span className="text-xs text-muted-foreground">⌄</span></button>{open ? <div className="absolute right-0 top-[calc(100%+10px)] w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-[26px] border border-white/80 bg-[#F7F5EF] shadow-[0_24px_60px_rgba(7,20,47,0.18)]"><div className="bg-primary px-5 pb-5 pt-6 text-white"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-base font-bold">{displayName.charAt(0).toUpperCase()}</span><div className="min-w-0"><div className="truncate text-lg font-bold">{displayName}</div><div className="truncate text-xs text-white/65">Your secure account</div></div></div></div><div className="p-5">{editing ? <form onSubmit={saveProfile} className="space-y-3"><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Profile name<input value={fullName} onChange={(event) => setFullName(formatFullName(event.target.value))} placeholder="Your full name" className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-primary outline-none focus:border-accent focus:ring-4 focus:ring-highlight" /></label><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Contact number<input value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^0-9+\s-]/g, ''))} inputMode="tel" placeholder="Your mobile number" className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-primary outline-none focus:border-accent focus:ring-4 focus:ring-highlight" /></label><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Address<textarea value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Your address" rows={3} className="mt-1.5 w-full resize-none rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-medium text-primary outline-none focus:border-accent focus:ring-4 focus:ring-highlight" /></label><div className="flex justify-end gap-2 pt-1"><button type="button" onClick={() => setEditing(false)} className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-white">Cancel</button><button type="submit" disabled={saving} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button></div></form> : <><div className="text-xs font-bold uppercase tracking-[0.15em] text-accent">Account details</div><div className="mt-3 divide-y divide-border-light">{details.map(([label, value]) => <div key={label} className="py-3 first:pt-0"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-1 break-words text-sm font-semibold text-primary">{value}</div></div>)}</div><button type="button" onClick={() => setEditing(true)} className="mt-5 w-full rounded-full bg-highlight px-4 py-2.5 text-sm font-bold text-accent transition hover:bg-accent hover:text-white">Edit profile</button></>}{notice ? <p role="status" className="mt-3 rounded-xl bg-highlight px-3 py-2 text-xs font-medium text-primary">{notice}</p> : null}<button type="button" onClick={onSignOut} className="mt-3 w-full rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-white hover:text-primary">Sign out</button></div></div> : null}</div>;
};

const Topbar = ({ step, onReset, onNavigate, user, onSignOut, onProfileUpdated }: { step: Step; onReset: () => void; onNavigate: (step: Step) => void; user: User; onSignOut: () => void; onProfileUpdated: (user: User) => void }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewItems: Array<[Step, string]> = [
    ['landing', 'Home'],
    ['income', 'Cash flow'],
    ['business', 'Business'],
    ['requirement', 'Loan requirement'],
    ['calculating', 'Calculation'],
    ['snapshot', 'Loan outlook'],
    ['handoff', 'Next step'],
    ['application', 'Application'],
    ['submitted', 'Submitted'],
    ['verification', 'Verification'],
    ['assessment', 'Assessment'],
    ['decision', 'Decision'],
  ];

  return (
    <header className="relative z-30 flex w-full items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[11px] font-bold tracking-[-0.04em] text-white shadow-[0_8px_18px_rgba(7,20,47,0.12)]">LR</div>
        <div>
          <div className="text-[15px] font-semibold tracking-[-0.02em] text-primary">MONEYQUICK</div>
          <div className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">Know before you apply</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ProfileMenu user={user} onSignOut={onSignOut} onProfileUpdated={onProfileUpdated} />
        {step !== 'landing' && step !== 'calculating' ? (
          <button type="button" onClick={onReset} className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/70 hover:text-primary sm:inline-flex">Start over</button>
        ) : null}
        <div className="relative">
          <button
            type="button"
            onClick={() => setPreviewOpen((v) => !v)}
            aria-expanded={previewOpen}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2.5 text-sm font-semibold text-primary shadow-[0_10px_26px_rgba(7,20,47,0.06)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            Preview screens
            <span className={`text-xs transition-transform ${previewOpen ? 'rotate-180' : ''}`}>⌄</span>
          </button>
          {previewOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] w-[min(290px,calc(100vw-2rem))] overflow-hidden rounded-[22px] border border-white/80 bg-[rgba(247,245,239,0.97)] p-2 shadow-[0_24px_60px_rgba(7,20,47,0.16)] backdrop-blur-xl">
              <div className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Jump to any screen</div>
              <div className="grid grid-cols-2 gap-1">
                {previewItems.map(([target, label], i) => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => { onNavigate(target); setPreviewOpen(false); }}
                    className={`rounded-xl px-3 py-2 text-left text-xs font-semibold transition hover:bg-highlight hover:text-accent ${step === target ? 'bg-highlight text-accent' : 'text-primary'}`}
                  >
                    <span className="mr-1 text-[10px] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>{label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="group mb-8 inline-flex items-center gap-2 rounded-full py-2 pr-3 text-sm font-semibold text-muted-foreground transition hover:text-primary">
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/60 transition group-hover:border-primary group-hover:bg-white"><ChevronLeft size={16} /></span>
    Back
  </button>
);

const Progress = ({ current, total = 2, label }: { current: number; total?: number; label?: string }) => (
  <div className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
    <span>{label ?? `Step ${current} of ${total}`}</span>
    <span className="h-px w-10 bg-border" />
    <span className="text-accent">Your loan picture is taking shape</span>
  </div>
);

const kiraAnswers = [
  {
    matches: ['emi', 'calculated'],
    answer: 'Your illustrative EMI is calculated from the requested loan amount, tenure, and illustrative annual interest rate shown on this website. It is only an estimate, not a lender quote or approval.',
  },
  {
    matches: ['documents'],
    answer: 'Documents help you prepare for the lender’s formal verification. This website accepts PAN, Aadhaar, business bank statements, income and business proof, and optional business registration. Final verification is completed by the lender.',
  },
  {
    matches: ['after', 'apply'],
    answer: 'After you continue, the information you entered carries into the application flow. The lender then verifies your information, completes assessment, and makes the final decision.',
  },
] as const;

const answerKiraQuestion = (question: string) => {
  const normalized = question.toLowerCase().replace(/[^\da-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (/^(hi|hello|hey|hii|good morning|good afternoon|good evening)\b/.test(normalized)) return 'Hello! I’m KIRA, the website guide. I can help you understand this website’s loan outlook, EMI, documents, and application steps.';
  if (normalized.includes('who are you') || normalized.includes('your name') || normalized.includes('what are you')) return 'I’m KIRA, the in-product guide for this website. I explain the loan outlook, illustrative EMI, required documents, and next steps using only this website’s information.';
  if (normalized.includes('what do you do') || normalized.includes('what is your work') || normalized.includes('how can you help') || normalized.includes('what can you do')) return 'I help you understand the information and steps on this website. I do not make lending decisions, provide outside advice, or handle personal or banking details.';
  if (normalized.includes('thank')) return 'You’re welcome! I’m here to explain the website’s loan-readiness steps.';
  if (normalized.includes('emi') && (normalized.includes('calculat') || normalized.includes('work'))) return kiraAnswers[0].answer;
  if (normalized.includes('document') && (normalized.includes('need') || normalized.includes('why'))) return kiraAnswers[1].answer;
  if (normalized.includes('after') && normalized.includes('apply')) return kiraAnswers[2].answer;
  return 'I can answer basic questions about KIRA and these website topics: the illustrative EMI, why documents are needed, and what happens after you apply.';
};

const KiraAssistant = () => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Hi, I’m KIRA. I can explain this website’s loan outlook, EMI, documents, and next steps. Please do not share PAN, Aadhaar, OTPs, passwords, or bank account numbers here.' },
  ]);
  const [isSending, setIsSending] = useState(false);
  const questions = [
    'Hi, who are you?',
    'What do you do?',
    'How is my illustrative EMI calculated?',
    'Why do I need these documents?',
    'What happens after I apply?',
  ] as const;

  const askGuide = async (nextQuestion: string) => {
    const cleanedQuestion = nextQuestion.trim();
    if (!cleanedQuestion || isSending) return;
    setMessages((current) => [...current, { role: 'user', text: cleanedQuestion }]);
    setQuestion('');
    setIsSending(true);
    try {
      const response = await fetch('/api/loan-guide/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: cleanedQuestion }) });
      const payload = await response.json().catch(() => ({}));
      const reply = response.ok && typeof payload.answer === 'string' ? payload.answer : 'KIRA is temporarily unavailable. Please try again later.';
      setMessages((current) => [...current, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: 'KIRA is temporarily unavailable. Please try again later.' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end sm:bottom-7 sm:right-7">
      {open && (
        <div className="mb-3 w-[min(390px,calc(100vw-2rem))] overflow-hidden rounded-[22px] border border-white/70 bg-[rgba(247,245,239,0.94)] p-4 shadow-[0_24px_70px_rgba(7,20,47,0.16)] backdrop-blur-xl animate-soft-in">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-primary"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-highlight text-accent"><Sparkles size={15} /></span> KIRA</div>
            <button type="button" aria-label="Close KIRA" onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-surface hover:text-primary">×</button>
          </div>
          <div className="max-h-[310px] space-y-3 overflow-y-auto pr-1" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`rounded-2xl px-3.5 py-3 text-sm leading-6 ${message.role === 'user' ? 'ml-8 bg-primary text-white' : 'mr-3 bg-highlight text-primary'}`}>{message.text}</div>)}{isSending ? <div className="mr-3 rounded-2xl bg-highlight px-3.5 py-3 text-sm text-muted-foreground">KIRA is typing…</div> : null}</div>
          <div className="mt-3 flex flex-wrap gap-2">{questions.map((item) => <button key={item} type="button" disabled={isSending} onClick={() => askGuide(item)} className="rounded-full border border-border bg-white/70 px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent hover:text-accent disabled:opacity-50">{item}</button>)}</div>
          <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); askGuide(question); }}><input value={question} maxLength={1000} disabled={isSending} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question…" className="min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-highlight disabled:opacity-60" /><button type="submit" disabled={isSending || !question.trim()} className="inline-flex items-center justify-center rounded-xl bg-primary px-3 text-sm font-bold text-white transition hover:bg-[#0b2148] disabled:opacity-50" aria-label="Send question"><ArrowRight size={18} /></button></form>
          <p className="mt-3 text-[11px] leading-4 text-muted-foreground">KIRA answers basic greetings and questions about this website only.</p>
        </div>
      )}
      <button
        type="button"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center gap-2 rounded-full border border-white/80 bg-primary px-4 py-3 text-white shadow-[0_14px_36px_rgba(7,20,47,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b2148]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-highlight text-accent"><Sparkles size={14} /></span>
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
  return <div className="relative"><button id={id} type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)} className="flex w-full items-center justify-between rounded-2xl border border-border bg-background px-4 py-3.5 text-left font-semibold text-primary outline-none transition hover:border-accent/45 focus:border-accent focus:ring-4 focus:ring-highlight"><span className={value ? '' : 'text-muted-foreground'}>{value || 'Select your business industry'}</span><span className={`text-accent transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span></button>{open ? <div role="listbox" aria-labelledby={id} className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border/70 bg-[#F7F5EF] p-2 shadow-[0_20px_50px_rgba(7,20,47,0.16)]">{businessIndustries.map((industry) => <button key={industry} type="button" role="option" aria-selected={value === industry} onClick={() => selectIndustry(industry)} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${value === industry ? 'bg-highlight text-accent' : 'text-primary hover:bg-white'}`}><span>{industry}</span>{value === industry ? <Check size={14} /> : null}</button>)}</div> : null}</div>;
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
      setReviews((current) => ({ ...current, [id]: { status: 'needs_review', fileName: file.name, note: 'Document review is temporarily unavailable. Please try again later.' } }));
    }
  };

  const resetReview = (id: string) => setReviews((current) => ({ ...current, [id]: { status: 'not_started', note: 'No file selected yet.' } }));
  const readyCount = Object.values(reviews).filter((review) => review.status === 'ready').length;
  useEffect(() => { onReadyCountChange?.(readyCount); }, [onReadyCountChange, readyCount]);

  return (
    <div className="rounded-[28px] border border-white/80 bg-surface/90 p-6 shadow-[0_18px_42px_rgba(7,20,47,0.05)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-accent"><FileText size={18} /></span><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Document readiness</div><div className="text-lg font-bold text-primary">Upload what you have</div></div></div>
        <span className="rounded-full bg-white/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-accent">{readyCount} / {documentChecklist.length} ready</span>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Upload one PDF, JPG, PNG or WebP file for each required document. Aadhaar and PAN are checked independently.</p>
      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl bg-white/70 p-4 text-xs leading-5 text-muted-foreground"><input type="checkbox" checked={hasConsented} onChange={(event) => setHasConsented(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0B8F83]" /><span>I consent to upload these documents for this application.</span></label>
      <div className="mt-5 space-y-3">
        {documentChecklist.map((item) => {
          const review = reviews[item.id];
          const isAnalyzing = review.status === 'analyzing';
          const isReady = review.status === 'ready';
          const needsReview = review.status === 'needs_review';
          return <div key={item.id} className={`rounded-[20px] border p-4 transition-all duration-300 ${isReady ? 'border-accent/25 bg-highlight/55' : needsReview ? 'border-warning/25 bg-warning/5' : 'border-white/80 bg-white/65'}`}>
            <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isReady ? 'bg-accent text-white' : needsReview ? 'bg-warning/15 text-warning' : 'bg-background text-muted-foreground'}`}>{isReady ? <Check size={14} /> : isAnalyzing ? <span className="h-3 w-3 rounded-full border-2 border-accent border-t-transparent animate-spin" /> : <FileText size={14} />}</span><div className="min-w-0"><div className="text-sm font-semibold text-primary">{item.title}</div><div className="mt-1 text-xs leading-5 text-muted-foreground">{review.fileName ? review.fileName : item.description}</div></div></div><span className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.1em] ${isReady ? 'text-accent' : needsReview ? 'text-warning' : isAnalyzing ? 'text-accent' : 'text-muted-foreground'}`}>{isReady ? 'Ready' : needsReview ? 'Review needed' : isAnalyzing ? 'Checking' : 'Not uploaded'}</span></div>
            {review.status !== 'not_started' ? <p className={`mt-3 text-xs leading-5 ${needsReview ? 'text-warning' : 'text-muted-foreground'}`}>{review.note}</p> : null}
            <div className="mt-4 flex flex-wrap items-center gap-2"><label className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${isAnalyzing || !hasConsented ? 'cursor-not-allowed bg-surface text-muted-foreground' : 'cursor-pointer bg-primary text-white hover:bg-[#0b2148]'}`}><input type="file" accept={item.accept} disabled={isAnalyzing || !hasConsented} onChange={(event) => reviewFile(item.id, event.target.files?.[0])} className="sr-only" />{isAnalyzing ? 'Checking document…' : !hasConsented ? 'Give consent to upload' : review.fileName ? 'Choose another file' : 'Upload & check'}</label>{review.fileName ? <button type="button" onClick={() => resetReview(item.id)} disabled={isAnalyzing} className="rounded-full px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:bg-white hover:text-primary disabled:opacity-50">Remove</button> : null}</div>
          </div>;
        })}
      </div>
      {readyCount === documentChecklist.length ? (
        <div className="mt-6 rounded-[22px] border border-accent/20 bg-highlight/65 p-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Three-step verification</div>
          <p className="mt-2 text-sm leading-6 text-primary">All five uploads are complete. Your documents move through these stages:</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ['01', 'AI review', 'Initial document and readability check.'],
              ['02', 'Human expert', 'A trained expert reviews the submitted documents.'],
              ['03', 'Moderator', 'Final quality and process review.'],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-2xl bg-white/75 p-4">
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

const AuthScreen = ({ onSignedIn }: { onSignedIn: (user: User) => void }) => {
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
    if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) return 'Cannot reach the sign-in service. Check that the Supabase Project URL and publishable key in .env belong to an active Supabase project, then restart the app.';
    if (/invalid login credentials/i.test(message)) return 'That email and password are not registered yet. Select “Create an account” first.';
    if (/unsupported provider|provider is not enabled/i.test(message)) return 'Google sign-in is temporarily unavailable. Please use email sign-in or try again later.';
    console.error('Secure sign-in failed:', error);
    return 'Secure sign-in is temporarily unavailable. Please try again later.';
  };

  const submitEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setNotice('');
    try {
      const result = mode === 'signIn'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
      if (result.error) { setNotice(authErrorMessage(result.error)); return; }
      if (result.data.user && mode === 'signIn') onSignedIn(result.data.user);
      else setNotice('Check your email to confirm your account, then sign in.');
    } catch (error) {
      setNotice(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setBusy(true);
    setNotice('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
      if (error) setNotice(authErrorMessage(error));
    } catch (error) {
      setNotice(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    if (!supabase || !email) { setNotice('Enter your email address first, then select Forgot password.'); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
      setNotice(error ? authErrorMessage(error) : 'Password-reset instructions were sent if an account exists for this email.');
    } catch (error) {
      setNotice(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  if (!isSupabaseConfigured) return <div className="relative min-h-screen overflow-hidden bg-background"><Atmosphere strong /><main className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center px-5 py-10"><section className="w-full rounded-[32px] border border-white/80 bg-white/75 p-7 shadow-[0_24px_70px_rgba(7,20,47,0.10)] backdrop-blur sm:p-10"><div className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Sign-in unavailable</div><h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-primary">We’re having a problem.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Secure sign-in is temporarily unavailable. Please try again later or contact support.</p></section></main></div>;

  return <div className="relative min-h-screen overflow-hidden bg-background"><Atmosphere strong /><main className="relative z-10 mx-auto flex min-h-screen max-w-md items-center px-5 py-10"><section className="w-full rounded-[32px] border border-white/80 bg-white/75 p-7 shadow-[0_24px_70px_rgba(7,20,47,0.10)] backdrop-blur sm:p-10"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">MQ</div><div><div className="font-bold text-primary">MONEYQUICK</div><div className="text-xs text-muted-foreground">A secure place to prepare</div></div></div><h1 className="mt-8 text-3xl font-bold tracking-[-0.04em] text-primary">{mode === 'signIn' ? 'Welcome back' : 'Create your account'}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to save and continue your loan readiness journey.</p><button type="button" disabled={busy} onClick={signInWithGoogle} className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white px-4 py-3.5 text-sm font-semibold text-primary transition hover:border-accent hover:bg-highlight disabled:opacity-50"><span className="text-lg font-bold text-[#4285F4]">G</span>Continue with Google</button><div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"><span className="h-px flex-1 bg-border" />or use email<span className="h-px flex-1 bg-border" /></div><form onSubmit={submitEmailAuth} className="space-y-4"><label className="block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-base font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight" /></label><label className="block text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Password<div className="relative mt-2"><input required minLength={8} type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 pr-12 text-base font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-highlight hover:text-accent"><Eye open={showPassword} /></button></div></label>{mode === 'signUp' ? <div className="rounded-2xl bg-highlight/75 p-4"><div className="text-xs font-bold uppercase tracking-[0.13em] text-accent">Create a stronger password</div><div className="mt-3 grid grid-cols-2 gap-2">{passwordRules.map(([label, complete]) => <div key={String(label)} className={`flex items-center gap-2 text-xs font-semibold ${complete ? 'text-accent' : 'text-muted-foreground'}`}><span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${complete ? 'bg-accent text-white' : 'bg-white text-muted-foreground'}`}>{complete ? '✓' : '•'}</span>{label}</div>)}</div></div> : null}<PrimaryButton type="submit" disabled={busy} onClick={() => undefined} className="w-full">{busy ? 'Please wait' : mode === 'signIn' ? 'Sign in' : 'Create account'}</PrimaryButton></form>{mode === 'signIn' ? <button type="button" onClick={resetPassword} className="mt-4 text-sm font-semibold text-accent hover:underline">Forgot password?</button> : null}<p className="mt-6 text-sm text-muted-foreground">{mode === 'signIn' ? 'New here?' : 'Already have an account?'} <button type="button" onClick={() => { setMode(mode === 'signIn' ? 'signUp' : 'signIn'); setNotice(''); setPassword(''); }} className="font-semibold text-accent hover:underline">{mode === 'signIn' ? 'Create an account' : 'Sign in'}</button></p>{notice ? <p role="alert" className="mt-5 rounded-2xl bg-highlight px-4 py-3 text-sm leading-6 text-primary">{notice}</p> : null}</section></main></div>;
};

export default function App() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [monthlyRevenue, setMonthlyRevenue] = useState(250000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(90000);
  const [yearsInBusiness, setYearsInBusiness] = useState(3);
  const [calculationStage, setCalculationStage] = useState(0);
  const [selectedBusinessType, setSelectedBusinessType] = useState('Business owner');
  const [requestedAmount, setRequestedAmount] = useState(1500000);
  const [loanPurpose, setLoanPurpose] = useState('Working capital');
  const [loanCategory, setLoanCategory] = useState<(typeof loanCategories)[number][0]>('Business / MSME loan');
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [annualInterestRate, setAnnualInterestRate] = useState(14);
  const [applicantAge, setApplicantAge] = useState(30);
  const [creditScore, setCreditScore] = useState(720);
  const [applicantName, setApplicantName] = useState('');
  const [applicationError, setApplicationError] = useState('');
  const [nameInputHint, setNameInputHint] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('');
  const [customBusinessIndustry, setCustomBusinessIndustry] = useState('');
  const [eligibilityNotice, setEligibilityNotice] = useState('');
  const [verifiedDocumentCount, setVerifiedDocumentCount] = useState(0);
  const [documentGateNotice, setDocumentGateNotice] = useState('');
  const [confirmationNotice, setConfirmationNotice] = useState('');

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    let mounted = true;
    const timeoutId = window.setTimeout(() => {
      if (mounted) setAuthLoading(false);
    }, 8000);
    supabase.auth.getUser()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) console.error('Unable to restore the secure session:', error);
        setAuthUser(data.user);
        setAuthLoading(false);
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        console.error('Unable to restore the secure session:', error);
        setAuthUser(null);
        setAuthLoading(false);
      })
      .finally(() => window.clearTimeout(timeoutId));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setAuthUser(session?.user ?? null);
        setAuthLoading(false);
        window.clearTimeout(timeoutId);
      }
    });
    return () => { mounted = false; window.clearTimeout(timeoutId); subscription.unsubscribe(); };
  }, []);

  const signOut = async () => { if (supabase) await supabase.auth.signOut(); setAuthUser(null); };

  const netMonthly = Math.max(0, monthlyRevenue - monthlyExpenses);
  const maxCapacity = Math.min(8000000, Math.max(1000000, Math.round((netMonthly * 36) / 100000) * 100000));
  const minCapacity = Math.max(1000000, Math.round((maxCapacity * 0.7) / 100000) * 100000);
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
  const canProceedWithBasicEligibility = meetsAgeRequirement && meetsCreditRequirement;
  const requiredDocumentCount = 5;
  const hasRequiredDocuments = verifiedDocumentCount >= requiredDocumentCount;
  const ageEligibilityMessage = applicantAge < 21 ? 'You must be at least 21 years old to continue.' : applicantAge > 60 ? 'This preview supports applicants up to 60 years old. Some lenders may allow a higher age at loan maturity.' : '';
  const creditEligibilityMessage = creditScore < 700 ? 'A CIBIL score of 700 or higher is required to continue with this readiness check.' : creditScore > 900 ? 'Enter a CIBIL score between 300 and 900.' : '';
  const requestedDisplay = requestedAmount;
  const nameParts = applicantName.trim().split(/\s+/).filter(Boolean);
  const hasValidFullName = nameParts.length >= 2 && nameParts.every((part) => /^[A-Z][a-z]{1,29}$/.test(part));
  const nameStructureHint = applicantName.length >= 5 && !hasValidFullName ? 'Enter both your first and last name.' : '';
  const selectedIndustryLabel = businessIndustry === 'Other — not listed' ? customBusinessIndustry.trim() : businessIndustry;

  useEffect(() => {
    if (currentStep !== 'calculating') return;
    setCalculationStage(0);
    const intervals = [650, 1250, 1850];
    const timers = intervals.map((delay, index) => window.setTimeout(() => setCalculationStage(index + 1), delay));
    const done = window.setTimeout(() => setCurrentStep('snapshot'), 2850);
    return () => { timers.forEach(window.clearTimeout); window.clearTimeout(done); };
  }, [currentStep]);

  const go = (step: Step) => {
    const gatedSteps: Step[] = ['requirement', 'calculating', 'snapshot', 'handoff', 'application', 'submitted', 'verification', 'assessment', 'decision'];
    if (gatedSteps.includes(step) && !canProceedWithBasicEligibility) {
      setCurrentStep('business');
      setEligibilityNotice(ageEligibilityMessage || creditEligibilityMessage || 'Complete the basic eligibility check before continuing.');
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
    if (!selectedIndustryLabel) {
      setApplicationError('Select your business industry before submitting your application.');
      return;
    }
    setApplicationError('');
    setConfirmationNotice('Sending your confirmation email…');
    try {
      const response = await fetch('/api/applications/confirmation', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: authUser?.email,
          name: applicantName,
          requestedAmount,
          loanPurpose,
          loanCategory,
          monthlyRevenue,
          monthlyExpenses,
          yearsInBusiness,
          selectedBusinessType,
          selectedIndustryLabel,
          applicantAge,
          creditScore,
          loanTenureYears,
          annualInterestRate,
          estimatedEmi,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok && payload.sent) {
        setConfirmationNotice('A confirmation email with your submitted details has been sent to your registered email address.');
      } else {
        console.error('Unable to send application confirmation:', payload.error || response.status);
        setConfirmationNotice('Your application was submitted, but we could not send the confirmation email right now. Please try again later.');
      }
    } catch (error) {
      console.error('Unable to send application confirmation:', error);
      setConfirmationNotice('Your application was submitted, but the confirmation email could not be sent right now.');
    }
    go('submitted');
  };

  const calculationCopy = useMemo(() => [
    'Reading your business profile',
    'Understanding your cash flow',
    'Mapping your borrowing range',
    'Preparing your loan outlook',
  ], []);

  if (authLoading) return <div className="relative min-h-screen bg-background"><Atmosphere strong /><div className="relative z-10 flex min-h-screen items-center justify-center text-sm font-semibold text-primary">Checking your secure session…</div></div>;
  if (!authUser) return <AuthScreen onSignedIn={setAuthUser} />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-highlight selection:text-primary">
      <Atmosphere strong={currentStep === 'landing' || currentStep === 'snapshot'} />
      <Topbar step={currentStep} onReset={() => go('landing')} onNavigate={go} user={authUser} onSignOut={signOut} onProfileUpdated={setAuthUser} />

      <main className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 px-5 pb-16 sm:px-8 lg:px-12">
        {currentStep === 'landing' && (
          <section className="grid w-full items-center gap-10 py-8 lg:min-h-[calc(100vh-92px)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:py-8 animate-soft-in">
            <div className="max-w-2xl self-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/10 bg-highlight/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_5px_rgba(11,143,131,0.08)]" /> For self-employed professionals
              </div>
              <h1 className="max-w-[680px] text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-primary sm:text-6xl lg:text-[68px]">Know before you apply.</h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-[20px]">Get an indicative borrowing range, understand what you may need, and see what happens next — before committing to a full application.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <PrimaryButton onClick={() => go('income')} className="px-7 py-4">Check my MONEYQUICK outlook</PrimaryButton>
                <span className="text-sm font-medium text-muted-foreground">About 2 minutes · No commitment</span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-positive" />Indicative, not a credit decision</span>
                <span>Private & secure</span>
                <span>No documents to upload yet</span>
              </div>

              <div className="mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ['01', 'Clear estimates', 'See a borrowing range and illustrative EMI before applying.'],
                  ['02', 'Know what matters', 'Understand the signals lenders typically verify.'],
                  ['03', 'Guided next steps', 'Know your documents and what happens after you apply.'],
                ].map(([n, title, body]) => (
                  <div key={n} className="group rounded-[20px] border border-white/80 bg-white/50 p-5 shadow-[0_12px_34px_rgba(7,20,47,0.03)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_18px_40px_rgba(7,20,47,0.07)]">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-xs font-bold text-primary transition group-hover:border-accent/30 group-hover:bg-highlight group-hover:text-accent">{n}</div>
                    <h3 className="font-semibold text-primary">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-[490px] items-center justify-center lg:min-h-[560px] lg:justify-end">
              <div className="absolute inset-0 flex items-center justify-center opacity-75">
                <svg viewBox="0 0 640 640" className="h-full w-full max-w-[620px]" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="arcA" x1="100" y1="560" x2="560" y2="100" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D8C7A5" stopOpacity="0.12" />
                      <stop offset="0.55" stopColor="#0B8F83" stopOpacity="0.34" />
                      <stop offset="1" stopColor="#0B8F83" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <circle cx="320" cy="320" r="240" stroke="#D8C7A5" strokeOpacity="0.22" />
                  <circle cx="320" cy="320" r="180" stroke="#0B8F83" strokeOpacity="0.09" />
                  <path d="M90 535 C165 520 210 465 255 405 C300 345 345 285 395 250 C450 210 490 155 560 105" stroke="url(#arcA)" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M95 560 C185 540 235 500 285 430 C330 370 385 330 440 310 C490 290 530 225 565 165" stroke="#0B8F83" strokeOpacity="0.12" strokeWidth="1.2" strokeDasharray="3 9" />
                  {[{x:255,y:405,r:4},{x:395,y:250,r:5},{x:560,y:105,r:6}].map((p) => <g key={`${p.x}-${p.y}`}><circle cx={p.x} cy={p.y} r={p.r} fill="#0B8F83" fillOpacity="0.85" /><circle cx={p.x} cy={p.y} r={p.r + 10} stroke="#0B8F83" strokeOpacity="0.12" /></g>)}
                </svg>
              </div>

              <div className="relative z-10 w-full max-w-[455px] rounded-[32px] border border-white/90 bg-[rgba(255,255,255,0.88)] p-7 shadow-[0_28px_75px_rgba(7,20,47,0.13)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 sm:p-8">
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                <div className="mb-7 flex items-center justify-between"><div className="text-[10px] font-bold uppercase tracking-[0.19em] text-muted-foreground">Preview · MONEYQUICK</div><span className="rounded-full bg-highlight px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent">Indicative</span></div>
                <div className="text-[13px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Borrowing range</div>
                <div className="mt-2 text-4xl font-bold tracking-[-0.04em] text-primary sm:text-[50px]">{formatLakh(minCapacity)} <span className="font-normal text-muted-foreground">–</span> {formatLakh(maxCapacity)}</div>
                <div className="mt-6 h-2 rounded-full bg-surface"><div className="relative h-2 w-[73%] rounded-full bg-accent"><span className="absolute -right-2 -top-1.5 h-5 w-5 rounded-full border-[4px] border-background bg-accent shadow-[0_0_0_7px_rgba(11,143,131,0.09)]" /></div></div>
                <div className="mt-2 flex justify-between text-[11px] font-semibold text-muted-foreground"><span>{formatLakh(minCapacity)}</span><span>Indicative position</span><span>{formatLakh(maxCapacity)}</span></div>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-[18px] bg-background p-4"><div className="text-xs text-muted-foreground">Illustrative EMI</div><div className="mt-1 text-xl font-bold text-primary">{formatCurrency(estimatedEmi)}<span className="ml-1 text-xs font-medium text-muted-foreground">/mo</span></div></div>
                  <div className="rounded-[18px] bg-background p-4"><div className="text-xs text-muted-foreground">Business age</div><div className="mt-1 text-xl font-bold text-primary">{yearsInBusiness}{yearsInBusiness >= 4 ? '+' : ''} years</div></div>
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-full bg-highlight px-4 py-2.5 text-sm font-semibold text-accent"><CheckCircle size={16} /> Indicative view — subject to verification</div>
                <div className="mt-5 border-t border-border-light pt-4 text-center text-[10px] leading-5 text-muted-foreground">Based on the information you provide. Final eligibility is subject to verification and lender assessment.</div>
              </div>
            </div>
          </section>
        )}

        {currentStep === 'income' && (
          <section className="mx-auto w-full max-w-4xl py-10 sm:py-14 animate-soft-in">
            <BackButton onClick={() => go('landing')} />
            <Progress current={1} />
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-primary sm:text-5xl lg:text-6xl">Let's look at your cash flow.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">We use this to understand what your business may be able to comfortably carry.</p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[['Revenue', monthlyRevenue, setMonthlyRevenue, 'Monthly average'], ['Business expenses', monthlyExpenses, setMonthlyExpenses, 'Monthly average']].map(([label, value, setter, note]) => (
                <label key={label as string} className="group rounded-[26px] border border-white/80 bg-white/65 p-6 shadow-[0_18px_44px_rgba(7,20,47,0.05)] backdrop-blur-sm transition focus-within:-translate-y-0.5 focus-within:border-accent/40 focus-within:bg-white/90 focus-within:shadow-[0_22px_46px_rgba(11,143,131,0.07)]">
                  <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{label as string}</span><span className="text-xs text-muted-foreground">{note as string}</span></div>
                  <div className="mt-4 flex items-center gap-2"><span className="text-2xl font-semibold text-muted-foreground">₹</span><input type="number" value={value as number} onChange={(e) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(e.target.value))} className="w-full bg-transparent text-4xl font-bold tracking-[-0.04em] text-primary outline-none placeholder:text-muted-foreground/30" /></div>
                  <div className="mt-4 h-1 rounded-full bg-surface"><div className={`h-1 rounded-full bg-accent transition-all duration-500 ${label === 'Revenue' ? 'w-[76%]' : 'w-[39%]'}`} /></div>
                </label>
              ))}
            </div>

            <div className="relative mt-5 overflow-hidden rounded-[26px] border border-white/80 bg-surface/90 p-6 sm:p-8">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-highlight blur-3xl opacity-70" />
              <div className="relative grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Revenue</div><div className="mt-1 text-2xl font-bold text-primary">{formatCurrency(monthlyRevenue)}</div></div>
                <div className="hidden h-px w-14 bg-border md:block" />
                <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Less expenses</div><div className="mt-1 text-2xl font-bold text-primary">{formatCurrency(monthlyExpenses)}</div></div>
              </div>
              <div className="my-6 h-px bg-border" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Estimated monthly surplus</div><p className="mt-1 text-sm text-muted-foreground">A simple view of what remains after typical business expenses.</p></div><div className="text-3xl font-bold tracking-[-0.04em] text-primary sm:text-4xl">{formatCurrency(netMonthly)}</div></div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4"><span className="hidden text-sm font-medium text-muted-foreground sm:block">An estimate is fine — you can review everything before applying.</span><PrimaryButton onClick={() => go('business')}>Continue</PrimaryButton></div>
          </section>
        )}

        {currentStep === 'business' && (
          <section className="mx-auto w-full max-w-4xl py-10 sm:py-14 animate-soft-in">
            <BackButton onClick={() => go('income')} />
            <Progress current={2} />
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-primary sm:text-5xl lg:text-6xl">Tell us about your business.</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">A little context helps us make your loan outlook more relevant.</p>

            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">How you work</div><div className="text-xs font-semibold text-accent">01 / 03</div></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {['Business owner', 'Freelancer', 'Self-employed professional', 'Other'].map((type) => {
                  const selected = selectedBusinessType === type;
                  return <button key={type} type="button" onClick={() => setSelectedBusinessType(type)} className={`group flex min-h-[92px] items-center justify-between rounded-[22px] border px-5 text-left transition-all duration-300 ${selected ? 'border-accent/50 bg-highlight shadow-[0_12px_28px_rgba(11,143,131,0.09)]' : 'border-white/80 bg-white/55 hover:-translate-y-0.5 hover:bg-white/85'}`}><div className="flex items-center gap-4"><span className={`flex h-11 w-11 items-center justify-center rounded-full ${selected ? 'bg-accent text-white' : 'bg-surface text-muted-foreground'}`}><Briefcase size={18} /></span><div><div className="font-semibold text-primary">{type}</div><div className="mt-1 text-xs text-muted-foreground">{selected ? 'Selected' : 'Choose one'}</div></div></div>{selected && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-accent shadow-sm"><Check size={16} /></span>}</button>;
                })}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/80 bg-white/65 p-6 shadow-[0_18px_42px_rgba(7,20,47,0.04)] sm:p-7">
              <div className="mb-4 flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Business industry</div><p className="mt-1 text-sm text-muted-foreground">Choose the category that best describes your business.</p></div><div className="text-xs font-semibold text-accent">02 / 03</div></div>
              <IndustryPicker id="business-industry" value={businessIndustry} onChange={(industry) => { setBusinessIndustry(industry); setCustomBusinessIndustry(''); }} />
              {businessIndustry === 'Other — not listed' ? <div className="mt-4"><label htmlFor="custom-business-industry" className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Your business type or name</label><input id="custom-business-industry" value={customBusinessIndustry} onChange={(event) => setCustomBusinessIndustry(event.target.value)} placeholder="Describe your business" className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight" /></div> : null}
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Years in business</div><div className="text-xs font-semibold text-accent">03 / 03</div></div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[1, 2, 3, 4].map((years) => {
                  const selected = yearsInBusiness === years;
                  const label = years === 4 ? '4+ years' : `${years} year${years === 1 ? '' : 's'}`;
                  return <button key={years} type="button" onClick={() => setYearsInBusiness(years)} className={`min-h-[86px] rounded-[20px] border p-4 text-left transition-all duration-300 ${selected ? 'border-accent/50 bg-highlight shadow-[0_12px_28px_rgba(11,143,131,0.09)]' : 'border-white/80 bg-white/55 hover:-translate-y-0.5 hover:bg-white/85'}`}><div className="flex items-center justify-between"><span className="text-lg font-bold text-primary">{label}</span>{selected ? <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white"><Check size={13} /></span> : null}</div><div className="mt-2 text-xs text-muted-foreground">Business history</div></button>;
                })}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/80 bg-white/65 p-6 shadow-[0_18px_42px_rgba(7,20,47,0.04)] sm:p-7">
              <div className="mb-5"><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Basic eligibility check</div><p className="mt-1 text-sm leading-6 text-muted-foreground">These details give an early indication only. Each lender applies its own criteria.</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label><span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Your age</span><span className="mt-1 block text-xs text-muted-foreground">Applicants must be between 21 and 60 for this readiness check.</span><input type="number" min="18" max="80" value={applicantAge} aria-invalid={Boolean(ageEligibilityMessage)} onChange={(event) => { setApplicantAge(Number(event.target.value)); setEligibilityNotice(''); }} className={`mt-3 w-full rounded-2xl border bg-background px-4 py-3.5 text-xl font-bold text-primary outline-none transition focus:ring-4 focus:ring-highlight ${ageEligibilityMessage ? 'border-destructive focus:border-destructive' : 'border-border focus:border-accent'}`} />{ageEligibilityMessage ? <span role="alert" className="mt-2 block text-xs font-semibold leading-5 text-destructive">{ageEligibilityMessage}</span> : null}</label>
                <label><span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">CIBIL score</span><span className="mt-1 block text-xs text-muted-foreground">A score of 700 or higher is required for this readiness check.</span><input type="number" min="300" max="900" value={creditScore} aria-invalid={Boolean(creditEligibilityMessage)} onChange={(event) => { setCreditScore(Number(event.target.value)); setEligibilityNotice(''); }} className={`mt-3 w-full rounded-2xl border bg-background px-4 py-3.5 text-xl font-bold text-primary outline-none transition focus:ring-4 focus:ring-highlight ${creditEligibilityMessage ? 'border-destructive focus:border-destructive' : 'border-border focus:border-accent'}`} />{creditEligibilityMessage ? <span role="alert" className="mt-2 block text-xs font-semibold leading-5 text-destructive">{creditEligibilityMessage}</span> : null}</label>
              </div>
              {eligibilityNotice ? <p role="alert" className="mt-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">{eligibilityNotice}</p> : null}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/80 bg-surface/90 p-6 sm:p-7">
              <div className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-accent"><Info size={17} /></div><div><div className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Why this matters</div><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Business history and stability help us understand which parts of your loan picture may need closer verification later.</p></div></div>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4"><span className="hidden text-sm font-medium text-muted-foreground sm:block">We’ll compare your request with the indicative range — not make a final credit decision.</span><PrimaryButton onClick={() => go('requirement')} disabled={!canProceedWithBasicEligibility}>Continue</PrimaryButton></div>
          </section>
        )}

        {currentStep === 'requirement' && (
          <section className="mx-auto w-full max-w-4xl py-10 sm:py-14 animate-soft-in">
            <BackButton onClick={() => go('business')} />
            <Progress current={3} total={3} label="Loan requirement · Step 3 of 3" />
            <div className="max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-accent">What are you planning for?</div>
              <h2 className="mt-3 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-primary sm:text-5xl lg:text-6xl">Tell us what you need the loan for.</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">Your amount and purpose help put the estimate in context. You can change this later.</p>
            </div>

            <div className="mt-10 rounded-[28px] border border-white/80 bg-white/70 p-6 shadow-[0_20px_50px_rgba(7,20,47,0.05)] sm:p-8">
              <label className="block">
                <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Loan amount</span><span className="text-xs text-muted-foreground">Indicative range will be shown next</span></div>
                <div className="mt-4 flex items-center gap-2"><span className="text-2xl font-semibold text-muted-foreground">₹</span><input type="number" min="100000" step="50000" value={requestedAmount} onChange={(e) => setRequestedAmount(Math.max(0, Number(e.target.value)))} className="w-full bg-transparent text-5xl font-bold tracking-[-0.05em] text-primary outline-none focus:text-accent sm:text-6xl" /></div>
                <input aria-label="Loan amount" type="range" min="100000" max="8000000" step="50000" value={requestedAmount} onChange={(e) => setRequestedAmount(Number(e.target.value))} className="mt-6 w-full accent-[#0B8F83]" />
                <div className="mt-2 flex justify-between text-xs font-semibold text-muted-foreground"><span>₹1L</span><span>₹80L</span></div>
              </label>

              <div className="mt-9">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Purpose</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {['Working capital', 'Business expansion', 'Equipment or machinery', 'Other'].map((purpose) => {
                    const selected = loanPurpose === purpose;
                    return <button key={purpose} type="button" onClick={() => setLoanPurpose(purpose)} className={`flex min-h-[72px] items-center justify-between rounded-[20px] border px-5 text-left transition-all duration-250 ${selected ? 'border-accent/50 bg-highlight shadow-[0_12px_28px_rgba(11,143,131,0.08)]' : 'border-border-light bg-background hover:border-accent/25 hover:bg-white'}`}><span className="font-semibold text-primary">{purpose}</span>{selected && <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white"><Check size={14} /></span>}</button>;
                  })}
                </div>
              </div>

              <div className="mt-9 border-t border-border-light pt-8">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Loan category</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Pick the loan category that best fits the purpose. It does not guarantee availability or approval.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {loanCategories.map(([category, description]) => {
                    const selected = loanCategory === category;
                    return <button key={category} type="button" onClick={() => setLoanCategory(category)} className={`min-h-[118px] rounded-[20px] border p-5 text-left transition-all duration-300 ${selected ? 'border-accent/50 bg-highlight shadow-[0_12px_28px_rgba(11,143,131,0.08)]' : 'border-border-light bg-background hover:-translate-y-0.5 hover:border-accent/25 hover:bg-white'}`}><div className="flex items-start justify-between gap-3"><span className="text-base font-bold text-primary">{category}</span>{selected ? <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white"><Check size={14} /></span> : null}</div><p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p></button>;
                  })}
                </div>
              </div>

              <div className="mt-9 border-t border-border-light pt-8">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Repayment plan</div><p className="mt-2 text-sm leading-6 text-muted-foreground">Choose a tenure and an illustrative annual interest assumption to see a monthly EMI. This is not a lender offer or an APR.</p></div><div className="rounded-2xl bg-highlight px-4 py-3 text-right"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">Illustrative EMI</div><div className="mt-1 text-xl font-bold text-primary">{formatCurrency(estimatedEmi)}<span className="ml-1 text-xs font-medium text-muted-foreground">/ month</span></div></div></div>
                <div className="mt-6"><div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">How long do you want the loan for?</div><div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">{[1, 2, 3, 4, 5].map((years) => <button key={years} type="button" onClick={() => setLoanTenureYears(years)} className={`rounded-2xl border px-3 py-3 text-sm font-bold transition ${loanTenureYears === years ? 'border-accent bg-highlight text-accent' : 'border-border-light bg-background text-primary hover:border-accent/35'}`}>{years} {years === 1 ? 'year' : 'years'}</button>)}</div></div>
                <label className="mt-7 block"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Illustrative annual interest rate</span><span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">{annualInterestRate.toFixed(2)}%</span></div><input aria-label="Illustrative annual interest rate" type="range" min="8" max="24" step="0.25" value={annualInterestRate} onChange={(event) => setAnnualInterestRate(Number(event.target.value))} className="mt-4 w-full accent-[#0B8F83]" /><div className="mt-2 flex justify-between text-xs font-medium text-muted-foreground"><span>8%</span><span>24%</span></div></label>
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
                <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/80 p-7 shadow-[0_30px_80px_rgba(7,20,47,0.10)] backdrop-blur-xl sm:p-10">
                  <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-highlight blur-3xl opacity-70" />
                  <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(7,20,47,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(7,20,47,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-4"><div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Indicative borrowing range</div><span className="rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Subject to verification</span></div>
                    <div className="mt-3 text-5xl font-bold tracking-[-0.055em] text-primary sm:text-6xl">{formatCurrency(minCapacity)} <span className="font-normal text-muted-foreground">–</span> {formatCurrency(maxCapacity)}</div>
                    <div className="mt-3 text-sm font-semibold text-muted-foreground">You asked for <span className="text-primary">{formatCurrency(requestedAmount)}</span> for {loanPurpose.toLowerCase()}.</div>
                    <div className="mt-9">
                      {(() => {
                        const safeRangeMin = Math.min(minCapacity, 8000000);
                        const safeRangeMax = Math.min(Math.max(maxCapacity, safeRangeMin + 100000), 8000000);
                        const clampedRequest = Math.min(Math.max(requestedAmount, safeRangeMin), safeRangeMax);
                        const position = safeRangeMax === safeRangeMin ? 50 : ((clampedRequest - safeRangeMin) / (safeRangeMax - safeRangeMin)) * 100;
                        return (
                          <>
                            <div className="relative pt-9">
                              <div className="absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/10 bg-primary px-3 py-1.5 text-[10px] font-bold tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(7,20,47,0.12)]" style={{ left: `${position}%` }}>
                                {formatLakh(requestedAmount)} requested
                              </div>
                              <div className="relative h-1.5 rounded-full bg-[#E8E6DF]">
                                <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${position}%` }} />
                                <div className="absolute -top-[9px] -translate-x-1/2" style={{ left: `${position}%` }}>
                                  <div className="h-6 w-6 rounded-full border-[5px] border-white bg-accent shadow-[0_0_0_6px_rgba(11,143,131,0.08),0_8px_18px_rgba(7,20,47,0.14)]" />
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-between text-xs font-semibold text-muted-foreground"><span>{formatLakh(safeRangeMin)}</span><span className="text-accent">Indicative range</span><span>{formatLakh(safeRangeMax)}</span></div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="mt-10 grid gap-3 sm:grid-cols-3">
                      {[['Illustrative EMI', formatCurrency(estimatedEmi) + ' / mo'], ['Repayment plan', `${loanTenureYears} years · ${annualInterestRate.toFixed(2)}%`], ['Monthly surplus', formatCurrency(netMonthly)]].map(([label, value], index) => <div key={label} className={`rounded-[20px] p-5 ${index === 0 ? 'bg-primary text-white' : 'bg-surface text-primary'}`}><div className={`text-xs ${index === 0 ? 'text-white/65' : 'text-muted-foreground'}`}>{label}</div><div className="mt-1 text-xl font-bold tracking-[-0.02em]">{value}</div></div>)}
                    </div>
                    <div className="mt-7 rounded-[22px] bg-highlight/75 p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div><div className="text-xs font-bold uppercase tracking-[0.15em] text-accent">How we got here</div><p className="mt-1 max-w-2xl text-sm leading-6 text-primary">Three signals shape this prototype's indicative picture. A real lender would combine these with credit history, verified documents and its own underwriting policy.</p></div>
                        <span className="hidden rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:inline-flex">Indicative only</span>
                      </div>
                      <div className="mt-5 grid gap-2 sm:grid-cols-3">
                        {[['Business history', `${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years`], ['Cash flow', formatCurrency(netMonthly)], ['Loan request', formatCurrency(requestedAmount)], ['Repayment plan', `${loanTenureYears} years at ${annualInterestRate.toFixed(2)}%`]].map(([label, value]) => <div key={label} className="rounded-[18px] bg-white/70 p-4"><div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-1 text-sm font-bold text-primary">{value}</div></div>)}
                      </div>
                      <div className="mt-4 text-xs leading-5 text-muted-foreground">Verification of income, business documents and credit profile happens during formal assessment.</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/80 bg-white/45 p-6 sm:p-8">
                  <div className="flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Your next move</div><h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-primary">Prepare, then apply with context.</h3></div><span className="hidden h-12 w-12 items-center justify-center rounded-full bg-highlight text-accent sm:flex"><ArrowUpRight size={20} /></span></div>
                  <div className="mt-7 grid gap-3 sm:grid-cols-5">
                    {['Gather documents', 'Start application', 'Verify information', 'Assessment', 'Decision'].map((item, i) => <div key={item} className={`rounded-2xl p-4 ${i === 0 ? 'bg-highlight text-primary' : 'bg-surface text-muted-foreground'}`}><div className={`text-xs font-bold ${i === 0 ? 'text-accent' : 'text-muted-foreground'}`}>0{i + 1}</div><div className="mt-2 text-sm font-semibold leading-5">{item}</div></div>)}
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-[28px] border border-white/80 bg-highlight/65 p-6 shadow-[0_18px_42px_rgba(7,20,47,0.04)] sm:p-7">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Basic eligibility requirements</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">A helpful pre-check, not a lender decision. Eligibility and maturity-age limits vary by lender and product.</p>
                  <div className="mt-5 space-y-3">
                    {[
                      ['Age 21–60', `${applicantAge} years`, meetsAgeRequirement],
                      ['CIBIL score 700+', `${creditScore}`, meetsCreditRequirement],
                      ['Stable income', `${formatCurrency(netMonthly)} monthly surplus`, meetsIncomeRequirement],
                      ['Business history', `${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years`, meetsBusinessHistoryRequirement],
                    ].map(([label, value, met]) => <div key={label as string} className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3"><div className="flex items-center gap-3"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${met ? 'bg-accent text-white' : 'bg-warning/15 text-warning'}`}>{met ? <Check size={13} /> : <Info size={13} />}</span><span className="text-sm font-semibold text-primary">{label as string}</span></div><span className="text-right text-xs font-medium text-muted-foreground">{value as string}</span></div>)}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/80 bg-white/55 p-6 shadow-[0_18px_42px_rgba(7,20,47,0.04)] sm:p-7">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">What lenders typically verify</div>
                  <div className="mt-4 space-y-3">
                    {[['Business continuity', `${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years shared`], ['Cash flow', `${formatCurrency(netMonthly)} estimated surplus`], ['Credit profile', 'Checked during assessment']].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 border-b border-border-light pb-3 last:border-0 last:pb-0"><span className="text-sm font-semibold text-primary">{label}</span><span className="text-right text-xs font-medium text-muted-foreground">{value}</span></div>)}
                  </div>
                </div>

                <DocumentReadinessAssistant onReadyCountChange={setVerifiedDocumentCount} />

                <div className="rounded-[28px] border border-primary/10 bg-primary p-6 text-white shadow-[0_24px_60px_rgba(7,20,47,0.16)] sm:p-7">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">Ready for the next step?</div>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em]">Your details can carry forward.</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">Continue to the formal application without starting again.</p>
                  {!hasRequiredDocuments ? <p role="alert" className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-xs font-medium leading-5 text-white/85">Upload all 5 required documents first: PAN card, Aadhaar card, business bank statements, income and business proof, and business registration. {verifiedDocumentCount} of {requiredDocumentCount} complete.</p> : <p className="mt-4 rounded-2xl bg-accent/20 px-4 py-3 text-xs font-semibold leading-5 text-white">All 5 required documents have been uploaded and checked. You can continue.</p>}
                  {documentGateNotice ? <p role="alert" className="mt-3 text-xs leading-5 text-[#F4CC83]">{documentGateNotice}</p> : null}
                  <PrimaryButton disabled={!hasRequiredDocuments} onClick={() => go('handoff')} className="mt-6 w-full !bg-white !text-primary hover:!bg-highlight hover:!text-primary disabled:!bg-white/25 disabled:!text-white/55">{hasRequiredDocuments ? 'Continue to application' : 'Complete document checks to continue'}</PrimaryButton>
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
            <div className="mt-8 rounded-[28px] border border-white/80 bg-white/65 p-7 sm:p-8"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">What happens next</div><div className="mt-6 grid gap-3 sm:grid-cols-4">{['Complete application', 'Verify details', 'Assessment', 'Decision'].map((item, i) => <div key={item} className="rounded-[18px] bg-background p-4"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-highlight text-xs font-bold text-accent">0{i + 1}</div><div className="mt-3 text-sm font-semibold text-primary">{item}</div></div>)}</div></div>
            <div className="mt-8 flex flex-wrap items-center gap-3"><PrimaryButton onClick={() => go('application')}>Continue to formal application</PrimaryButton><SecondaryButton onClick={() => go('snapshot')}>Review loan outlook</SecondaryButton></div>
          </section>
        )}

        {currentStep === 'application' && (
          <section className="mx-auto w-full max-w-4xl py-10 sm:py-14 animate-soft-in">
            <BackButton onClick={() => go('handoff')} />
            <Progress current={1} total={4} label="Application · Step 1 of 4" />
            <div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Final review</div><h2 className="mt-3 text-4xl font-bold tracking-[-0.045em] text-primary sm:text-5xl">Complete your application.</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">Your earlier answers are carried forward so you can focus on confirming the details that matter.</p></div>

            <div className="mt-8 rounded-[26px] border border-white/80 bg-highlight/75 p-5 sm:p-6">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Your loan outlook</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {[['Requested', formatCurrency(requestedDisplay)], ['Purpose', loanPurpose], ['Business age', `${yearsInBusiness}${yearsInBusiness >= 4 ? '+' : ''} years`], ['Illustrative EMI', formatCurrency(estimatedEmi) + ' / mo']].map(([label, value]) => <div key={label} className="rounded-[18px] bg-white/70 p-4"><div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</div><div className="mt-1 text-sm font-bold text-primary">{value}</div></div>)}
              </div>
              <div className="mt-4 text-xs leading-5 text-muted-foreground">Your indicative range: <span className="font-semibold text-primary">{formatLakh(minCapacity)} – {formatLakh(maxCapacity)}</span>. Final pricing and approval depend on lender verification and assessment.</div>
            </div>

            <div className="mt-7 rounded-[28px] border border-white/80 bg-white/65 p-6 shadow-[0_20px_50px_rgba(7,20,47,0.05)] sm:p-8">
              <div className="mb-5"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Confirm your details</div><h3 className="mt-2 text-xl font-bold text-primary">Review before you submit</h3></div>
              <div className="grid gap-7 md:grid-cols-2">
                <div><label htmlFor="full-name" className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Full name</label><input id="full-name" placeholder="Enter your full name" value={applicantName} inputMode="text" autoComplete="name" aria-invalid={Boolean(nameInputHint || nameStructureHint)} onChange={(event) => { const rawName = event.target.value; const cleanName = formatFullName(rawName); setApplicantName(cleanName); setApplicationError(''); setNameInputHint(rawName === rawName.replace(/[^a-zA-Z\s]/g, '') ? '' : 'Only letters and spaces are allowed in your name.'); }} className={`mt-2 w-full rounded-2xl border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:ring-4 focus:ring-highlight ${nameInputHint || nameStructureHint ? 'border-destructive focus:border-destructive' : 'border-border focus:border-accent'}`} /></div>
                <div><label htmlFor="work-type" className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Work type</label><select id="work-type" value={selectedBusinessType} onChange={(event) => setSelectedBusinessType(event.target.value)} className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight"><option>Business owner</option><option>Freelancer</option><option>Self-employed professional</option><option>Other</option></select></div>
                <div><label htmlFor="review-business-industry" className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Business industry</label><div className="mt-2"><IndustryPicker id="review-business-industry" value={businessIndustry} onChange={(industry) => { setBusinessIndustry(industry); setCustomBusinessIndustry(''); setApplicationError(''); }} /></div>{businessIndustry === 'Other — not listed' ? <input value={customBusinessIndustry} onChange={(event) => { setCustomBusinessIndustry(event.target.value); setApplicationError(''); }} placeholder="Enter your business type or name" className="mt-3 w-full rounded-2xl border border-border bg-background px-4 py-3.5 font-medium text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-highlight" /> : null}</div>
                <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Monthly revenue</div><div className="mt-2 rounded-2xl border border-border bg-surface px-4 py-3.5 font-semibold text-primary">{formatCurrency(monthlyRevenue)}</div></div>
                <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Loan requirement</div><div className="mt-2 rounded-2xl border border-border bg-surface px-4 py-3.5 font-semibold text-primary">{formatCurrency(requestedDisplay)}</div></div>
              </div>
              {nameInputHint || nameStructureHint ? <p role="alert" className="mt-3 text-sm font-medium text-destructive">{nameInputHint || nameStructureHint}</p> : null}
              {applicationError ? <p role="alert" className="mt-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{applicationError}</p> : null}
              <div className="mt-8 rounded-2xl bg-highlight/70 p-4 text-sm leading-6 text-primary">Some information is already filled in from your readiness journey. You can review it before submitting.</div>
            </div>
            <div className="mt-8 flex flex-col items-end gap-3"><div className="max-w-xl text-right text-xs leading-5 text-muted-foreground">By continuing, you confirm the details are accurate. Final eligibility, pricing and approval are subject to verification and lender assessment.</div><PrimaryButton onClick={submitApplication}>Submit application</PrimaryButton></div>
          </section>
        )}

        {currentStep === 'submitted' && (
          <section className="mx-auto flex min-h-[calc(100vh-125px)] w-full max-w-4xl flex-col items-center justify-center py-8 text-center animate-soft-in">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-highlight text-accent shadow-[0_0_0_14px_rgba(11,143,131,0.05)] sm:h-24 sm:w-24"><CheckCircle size={38} /><div className="absolute inset-0 rounded-full border border-accent/30 animate-pulse-soft" /></div>
            <div className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-accent">Application received</div>
            <h2 className="mt-2 text-4xl font-bold tracking-[-0.05em] text-primary sm:text-5xl">You're on your way.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">Your application has been received. Explore the next stages below to preview how the journey continues.</p>
            {confirmationNotice ? <p role="status" className="mt-4 max-w-2xl rounded-2xl bg-highlight px-4 py-3 text-sm leading-6 text-primary">{confirmationNotice}</p> : null}

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
                  className={`group rounded-[20px] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(7,20,47,0.08)] ${target === 'submitted' ? 'bg-highlight text-primary' : 'bg-surface text-muted-foreground hover:bg-white'}`}
                >
                  <div className={`text-xs font-bold uppercase tracking-[0.14em] ${target === 'submitted' ? 'text-accent' : 'text-muted-foreground'}`}>0{i + 1}</div>
                  <div className={`mt-2 text-sm font-semibold ${target === 'submitted' ? 'text-primary' : 'text-primary'}`}>{item}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">{note}</div>
                </button>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
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
                <div key={label} className="rounded-[24px] bg-surface p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</div><div className="mt-2 text-xl font-bold text-primary">{value}</div></div>
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
            <div className="mt-8 rounded-[28px] border border-white/80 bg-white/65 p-7 shadow-[0_20px_50px_rgba(7,20,47,0.05)] sm:p-8">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Assessment checklist</div>
              <div className="mt-5 divide-y divide-border-light">
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
              <div className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Decision stage</div>
              <h2 className="mt-5 text-4xl font-bold leading-[1.03] tracking-[-0.045em] text-primary sm:text-5xl">Your application is at the decision stage.</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">In this prototype, this is the end of the post-submission journey. A real decision would depend on the lender's verified assessment.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] bg-surface p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Requested</div><div className="mt-2 text-2xl font-bold text-primary">{formatCurrency(requestedDisplay)}</div></div>
              <div className="rounded-[24px] bg-surface p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Purpose</div><div className="mt-2 text-xl font-bold text-primary">{loanPurpose}</div></div>
              <div className="rounded-[24px] bg-surface p-6"><div className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Current state</div><div className="mt-2 text-xl font-bold text-primary">Pending decision</div></div>
            </div>
            <div className="mt-8 rounded-[24px] bg-highlight/75 p-5 text-sm leading-6 text-primary"><strong>Prototype note:</strong> no real approval or rejection is being made here. This stage exists so you can demonstrate the complete post-submission experience.</div>
            <div className="mt-8 flex flex-wrap items-center gap-3"><PrimaryButton onClick={() => go('snapshot')}>Back to snapshot</PrimaryButton><SecondaryButton onClick={() => go('submitted')}>View journey</SecondaryButton></div>
          </section>
        )}
      </main>

      <footer className="relative z-10 border-t border-border-light bg-white/35 px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1440px] gap-4 text-base text-muted-foreground sm:grid-cols-3">
          <div className="min-w-0 rounded-2xl bg-white/55 p-5">
            <div className="text-lg font-bold leading-6 text-primary">Have a query?<br />Reach out to us.</div>
            <div className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Email</div>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=regan.hendriques%40bombaydc.com&su=Hi%20I%20need%20your%20help" target="_blank" rel="noreferrer" className="mt-1 block break-all text-base font-bold text-accent underline-offset-4 transition hover:text-primary hover:underline">regan.hendriques@bombaydc.com</a>
          </div>
          <div className="rounded-2xl bg-white/55 p-5">
            <div className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Phone</div>
            <a href="tel:+918976030646" className="mt-2 inline-block text-base font-bold text-accent underline-offset-4 transition hover:text-primary hover:underline">+91 8976030646</a>
          </div>
          <div className="rounded-2xl bg-white/55 p-5">
            <div className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Address</div>
            <div className="mt-2 text-base font-bold leading-6 text-primary">Lotus Signature Building, 1602 Floor,<br />Jogeshwari West</div>
          </div>
        </div>
      </footer>

      <KiraAssistant />
    </div>
  );
}
