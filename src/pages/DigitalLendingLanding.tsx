import React, { useState, useMemo } from 'react';
import type { User } from 'firebase/auth';

interface DigitalLendingLandingProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onNavigate: (step: any) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  authUser: User | null;
  onSignOut?: () => void;
}

export default function DigitalLendingLanding({
  onGetStarted,
  onSignIn,
  onNavigate,
  theme,
  toggleTheme,
  authUser,
  onSignOut,
}: DigitalLendingLandingProps) {
  // Interactive tab for NBFCs vs LSPs / Borrowers
  const [activePersona, setActivePersona] = useState<'nbfc' | 'lsp'>('nbfc');

  // Interactive tab for Payments & RBI Collections Section
  const [activePaymentTab, setActivePaymentTab] = useState<
    'collections' | 'recurring' | 'split' | 'reports'
  >('collections');

  // Interactive orbital node highlight
  const [activeOrbitNode, setActiveOrbitNode] = useState<
    'disbursal' | 'repayment' | 'colending' | null
  >(null);

  // Interactive Live EMI Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(1500000);
  const [calcTenure, setCalcTenure] = useState<number>(3); // years
  const [calcRate, setCalcRate] = useState<number>(14); // annual percentage

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact / Demo Modal state
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', phone: '', company: '', role: 'NBFC / Lender' });

  // Calculation logic
  const calculatedEmi = useMemo(() => {
    const principal = calcAmount;
    const monthlyRate = calcRate / 100 / 12;
    const months = calcTenure * 12;
    if (monthlyRate === 0) return Math.round(principal / months);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  }, [calcAmount, calcTenure, calcRate]);

  const totalPayment = useMemo(() => calculatedEmi * calcTenure * 12, [calculatedEmi, calcTenure]);
  const totalInterest = useMemo(() => Math.max(0, totalPayment - calcAmount), [totalPayment, calcAmount]);

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const paymentTabDetails = {
    collections: {
      title: 'Collections and reconciliation',
      description: 'Receive loan repayment directly into your NBFC account. Instant reconciliation & same day settlement.',
      badge: 'Same Day Settlements',
      amount: '₹ 68,000',
      status: 'Loan Received',
    },
    recurring: {
      title: 'Recurring payments',
      description: 'Set up recurring mandates for repayment. Collect recurring payments via debit cards and Net Banking using NACH E-mandate & UPI Autopay using TPV flow.',
      badge: 'UPI AutoPay & eNACH',
      amount: '₹ 24,500',
      status: 'Mandate Executed',
    },
    split: {
      title: 'Split payments',
      description: 'Split repayment received and settle into co-lenders’ accounts directly. Recommended for co-lending use cases and risk participation agreements.',
      badge: 'Co-Lending Split (80:20)',
      amount: '₹ 54,400 / ₹ 13,600',
      status: 'Escrow Split Succeeded',
    },
    reports: {
      title: 'Real-time reports',
      description: 'Leverage repayment reports and statements data for accounting compliance, audit logs, and RBI regulatory filings with instant ledger access.',
      badge: 'Live MIS & Audit Trail',
      amount: '99.98% Success',
      status: 'Reconciliation Cleared',
    },
  };

  const faqs = [
    {
      question: "How does MoneyQuick comply with RBI's Digital Lending Guidelines?",
      answer: "MoneyQuick operates strictly within the Reserve Bank of India's (RBI) digital lending guidelines. Loan disbursals and repayments occur directly through authorized bank accounts or regulated escrow/nodal accounts, with zero pass-through to unregulated third-party pools. All borrower data is stored domestically, fully encrypted, and consent is captured and logged at every step."
    },
    {
      question: "What is the Managed Escrow Solution for NBFCs and Co-Lenders?",
      answer: "Our managed escrow infrastructure connects with multiple Tier-1 banking partners. For co-lending setups (e.g. 80:20 risk participation), MoneyQuick automatically splits collected borrower repayments and routes them directly to each partner institution's designated account, with real-time reconciliation and complete MIS reporting."
    },
    {
      question: "What documents and verification steps are supported?",
      answer: "Our 360° Verification Suite provides instant digital verification for PAN, Aadhaar (via DigiLocker/UIDAI), Bank Account Penny Drop with name-match scoring, GSTIN verification, and automated statement analysis. Borrowers and business owners can complete readiness evaluation in under two minutes."
    },
    {
      question: "How does automated repayment via UPI AutoPay & eNACH work?",
      answer: "Lenders can set up recurring repayment mandates at the time of loan onboarding. Borrowers authenticate once using UPI PIN, NetBanking, or Debit Card. On due dates, MoneyQuick triggers automated collections with high success rates, instant retry logic, and real-time ledger updates."
    },
    {
      question: "Can individual MSMEs & businesses use MoneyQuick directly?",
      answer: "Yes! Business owners and entrepreneurs can use MoneyQuick's Professional Loan Readiness portal to calculate illustrative EMIs, evaluate borrowing capacity, organize required compliance documents, and receive guidance from our in-product assistant (KIRA) before submitting to lending partners."
    }
  ];

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setShowDemoModal(false);
      setDemoSubmitted(false);
      setDemoForm({ name: '', email: '', phone: '', company: '', role: 'NBFC / Lender' });
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-highlight selection:text-primary">
      {/* Top Notification / Regulatory Announcement Bar */}
      <div className="bg-gradient-to-r from-primary via-[#1a2d60] to-accent px-4 py-2 text-center text-xs font-semibold text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>RBI Compliant Digital Lending Architecture — 100% Direct Account &amp; Escrow Settlement</span>
          <span className="hidden md:inline text-white/70">|</span>
          <button
            onClick={onGetStarted}
            className="hidden md:inline-flex items-center gap-1 underline underline-offset-2 hover:text-white/90"
          >
            Check Loan Readiness &rarr;
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 text-left transition hover:opacity-85"
            >
              <img
                src="/3b6903f8-23e4-4c03-9082-3fe23e47cd11.png"
                alt="MONEYQUICK Logo"
                className="h-9 w-auto object-contain"
              />
              <div>
                <div className="text-[17px] font-extrabold tracking-tight text-primary">MONEYQUICK</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Digital Lending Solutions</div>
              </div>
            </button>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#solutions" className="transition hover:text-primary">Solutions</a>
            <a href="#collections-rbi" className="transition hover:text-primary">Collections &amp; RBI</a>
            <a href="#features" className="transition hover:text-primary">Features</a>
            <a href="#calculator" className="transition hover:text-primary">EMI Calculator</a>
            <a href="#comparison" className="transition hover:text-primary">Why MoneyQuick</a>
            <a href="#faqs" className="transition hover:text-primary">FAQs</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-primary shadow-sm transition hover:border-accent hover:text-accent"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                </svg>
              )}
            </button>

            {authUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#5145CE] transition"
                >
                  My Loan Application &rarr;
                </button>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-surface transition"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onSignIn}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-primary hover:bg-surface transition"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-[#7b68ee] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 active:scale-95"
                >
                  <span>Check Loan Outlook</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Orbital Ecosystem Visual */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-[-100px] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            {/* Left Column: Headline and Pitch */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-highlight/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent shadow-sm backdrop-blur">
                <span className="flex h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(101,88,232,0.8)]" />
                NBFC &amp; Fintech Digital Lending Solutions
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl leading-[1.08]">
                A full-stack{' '}
                <span className="bg-gradient-to-r from-accent via-[#7A6BFF] to-[#0B8F83] bg-clip-text text-transparent">
                  digital lending solution
                </span>{' '}
                for NBFCs, Fintechs &amp; Businesses.
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Create escrow accounts, operate through APIs for loan disbursals, automated repayments, co-lending, and instant borrower readiness verification — in complete compliance with RBI’s digital lending framework.
              </p>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3 py-1.5 text-xs font-bold text-primary">
                  <span className="text-[#10B981]">✓</span> 100% RBI Guidelines Compliant
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3 py-1.5 text-xs font-bold text-primary">
                  <span className="text-[#10B981]">✓</span> Multi-Bank Escrow Set-Up
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/80 px-3 py-1.5 text-xs font-bold text-primary">
                  <span className="text-[#10B981]">✓</span> Instant Payouts &amp; AutoPay
                </div>
              </div>

              {/* Call to Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-accent to-[#5145CE] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                >
                  <span>Check Loan Readiness</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDemoModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-6 py-4 text-base font-semibold text-primary transition-all hover:border-accent hover:bg-surface active:scale-[0.98]"
                >
                  <span>Contact Sales / Institutional</span>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
                </svg>
                <span>Takes about 2 minutes · No commitment · No impact on CIBIL score</span>
              </div>
            </div>

            {/* Right Column: Unique Orbital Ecosystem Visual (Cashfree Style) */}
            <div className="relative flex flex-col items-center justify-center w-full max-w-[520px] mx-auto">
              {/* Orbital Graphic Arena - overflow-visible ensures orbiting badges/cards are never cropped */}
              <div className="orbit-arena relative h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] flex items-center justify-center overflow-visible select-none my-4">
                {/* Background ambient radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3)_0%,transparent_70%)] pointer-events-none blur-2xl" />

                {/* Circular dark disc - overflow-hidden ONLY for the cosmic radial glow and internal rings */}
                <div className="absolute inset-3 sm:inset-4 rounded-full bg-gradient-to-br from-[#240253] via-[#1b033d] to-[#0e0024] shadow-[0_0_60px_rgba(107,33,168,0.5)] border border-purple-500/40 overflow-hidden">
                  {/* Inner ambient radial glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25)_0%,transparent_70%)] pointer-events-none" />

                  {/* Outer concentric thin orbit ring */}
                  <div className="absolute inset-4 rounded-full border border-purple-400/20 pointer-events-none" />

                  {/* Mid concentric orbit line */}
                  <div className="absolute inset-16 rounded-full border border-purple-300/25 pointer-events-none" />

                  {/* Inner glowing spinning ring with moving particles */}
                  <div className="absolute inset-28 rounded-full border border-purple-500/40 pointer-events-none animate-[spin_24s_linear_infinite]">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-8 rounded-full bg-white blur-[2px] opacity-80" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3 w-8 rounded-full bg-purple-300 blur-[2px] opacity-70" />
                  </div>
                </div>

                {/* Center Hub: "NBFC / Fintechs" - Stationary in center */}
                <div
                  className="relative z-20 flex h-[140px] w-[140px] sm:h-[165px] sm:w-[165px] flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#3b086e] to-[#21024b] text-center shadow-[0_0_40px_rgba(147,51,234,0.65)] border border-purple-400/50 transition-all duration-300 select-none group"
                  title="MoneyQuick Central Escrow Hub"
                >
                  <div className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-md group-hover:text-purple-200">
                    NBFC / Fintechs
                  </div>
                  {/* Decorative underline bars */}
                  <div className="mt-2 h-1.5 w-14 rounded-full bg-purple-300/50" />
                  <div className="mt-1 h-1 w-9 rounded-full bg-purple-400/40" />
                  <span className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-purple-300/90">
                    Central Escrow Hub
                  </span>
                </div>

                {/* =========================================================================
                    CONTINUOUS ORBITING NODES (Counter-rotating to stay upright and legible)
                   ========================================================================= */}

                {/* Orbit Track 1: Loan Disbursals */}
                <div className="orbit-track animate-orbit-disbursal absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{ transform: 'translateY(calc(-1 * var(--orbit-r-1, 182px)))' }}
                    onClick={() => setActiveOrbitNode(activeOrbitNode === 'disbursal' ? null : 'disbursal')}
                  >
                    <div className="orbit-node animate-orbit-disbursal-counter flex flex-col items-center transition-transform duration-300 hover:scale-110">
                      {/* Purple badge with triangle */}
                      <div className={`relative rounded-md px-3 py-1 text-[11px] sm:text-xs font-bold text-white shadow-lg transition-all ${
                        activeOrbitNode === 'disbursal'
                          ? 'bg-[#6933d3] ring-2 ring-purple-300 shadow-[0_0_15px_rgba(105,51,211,0.8)]'
                          : 'bg-[#6933d3]/95 hover:bg-[#6933d3]'
                      }`}>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          {activeOrbitNode === 'disbursal' && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                            </span>
                          )}
                          Loan disbursals
                        </span>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0 w-0 border-x-4 border-x-transparent border-t-6 border-t-[#6933d3]" />
                      </div>
                      {/* White card with document icon + green coin */}
                      <div className={`mt-2 flex h-13 w-13 sm:h-15 sm:w-15 items-center justify-center rounded-2xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.3)] border transition-all ${
                        activeOrbitNode === 'disbursal'
                          ? 'border-[#6933d3] ring-4 ring-[#6933d3]/40 shadow-[0_0_25px_rgba(105,51,211,0.6)]'
                          : 'border-white/80'
                      }`}>
                        <div className="relative">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                            <path d="M8 13h8" /><path d="M8 17h6" />
                          </svg>
                          <span className="absolute -bottom-1.5 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#10b981] text-[9px] font-bold text-white shadow">
                            ₹
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbit Track 2: Repayments */}
                <div className="orbit-track animate-orbit-repayments absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{ transform: 'translateY(calc(-1 * var(--orbit-r-2, 175px)))' }}
                    onClick={() => setActiveOrbitNode(activeOrbitNode === 'repayment' ? null : 'repayment')}
                  >
                    <div className="orbit-node animate-orbit-repayments-counter flex flex-col items-center transition-transform duration-300 hover:scale-110">
                      {/* Pink/Coral badge with triangle */}
                      <div className={`relative rounded-md px-3.5 py-1 text-[11px] sm:text-xs font-bold text-white shadow-lg transition-all ${
                        activeOrbitNode === 'repayment'
                          ? 'bg-[#f43f5e] ring-2 ring-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                          : 'bg-[#f43f5e]/95 hover:bg-[#f43f5e]'
                      }`}>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          {activeOrbitNode === 'repayment' && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                            </span>
                          )}
                          Repayments
                        </span>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0 w-0 border-x-4 border-x-transparent border-t-6 border-t-[#f43f5e]" />
                      </div>
                      {/* White card with circular repayment arrows */}
                      <div className={`mt-2 flex h-13 w-13 sm:h-15 sm:w-15 items-center justify-center rounded-2xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.3)] border transition-all ${
                        activeOrbitNode === 'repayment'
                          ? 'border-[#f43f5e] ring-4 ring-[#f43f5e]/40 shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                          : 'border-white/80'
                      }`}>
                        <div className="relative flex items-center justify-center">
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                            <path d="M3 21v-5h5" />
                          </svg>
                          <span className="absolute text-[10px] font-extrabold text-[#f59e0b]">₹</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orbit Track 3: Co-lending */}
                <div className="orbit-track animate-orbit-colending absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div
                    className="absolute pointer-events-auto cursor-pointer"
                    style={{ transform: 'translateY(calc(-1 * var(--orbit-r-3, 178px)))' }}
                    onClick={() => setActiveOrbitNode(activeOrbitNode === 'colending' ? null : 'colending')}
                  >
                    <div className="orbit-node animate-orbit-colending-counter flex flex-col items-center transition-transform duration-300 hover:scale-110">
                      {/* Dark navy badge */}
                      <div className={`relative rounded-md px-3 py-1 text-[11px] sm:text-xs font-bold shadow-lg border transition-all ${
                        activeOrbitNode === 'colending'
                          ? 'bg-[#3b086e] border-purple-400 ring-2 ring-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.8)] text-white'
                          : 'bg-[#240b4f]/95 border-purple-400/40 text-purple-200 hover:bg-[#3b086e] hover:text-white'
                      }`}>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          {activeOrbitNode === 'colending' && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                            </span>
                          )}
                          Co-lending
                        </span>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0 w-0 border-x-4 border-x-transparent border-t-6 border-t-[#240b4f]" />
                      </div>
                      {/* White card with bank building icon */}
                      <div className={`mt-2 flex h-13 w-13 sm:h-15 sm:w-15 items-center justify-center rounded-2xl bg-white shadow-[0_10px_25px_rgba(0,0,0,0.3)] border transition-all ${
                        activeOrbitNode === 'colending'
                          ? 'border-[#6366f1] ring-4 ring-[#6366f1]/40 shadow-[0_0_25px_rgba(99,102,241,0.6)]'
                          : 'border-white/80'
                      }`}>
                        <div className="relative flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 10 9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                            <path d="M9 22V12h6v10" />
                          </svg>
                          <span className="absolute -bottom-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#f59e0b] text-[8px] font-bold text-white shadow">
                            🪙
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Trust Numbers Strip (Exactly like Cashfree) */}
          <div className="mt-16 rounded-2xl border border-border bg-surface/60 p-8 shadow-sm backdrop-blur">
            <div className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Powering India&apos;s Modern Digital Lending Ecosystem
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4 md:divide-x md:divide-border text-center">
              <div className="px-3">
                <div className="text-3xl font-black text-primary sm:text-4xl">₹10,000+ Cr</div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">Loans Evaluated &amp; Facilitated</div>
              </div>
              <div className="px-3">
                <div className="text-3xl font-black text-accent sm:text-4xl">600,000+</div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">Borrowers &amp; MSMEs Supported</div>
              </div>
              <div className="px-3">
                <div className="text-3xl font-black text-primary sm:text-4xl">99.98%</div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">Infrastructure Uptime</div>
              </div>
              <div className="px-3">
                <div className="text-3xl font-black text-[#10B981] sm:text-4xl">100%</div>
                <div className="mt-1 text-xs font-semibold text-muted-foreground">RBI Digital Lending Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lending Products Ribbon */}
      <section className="border-y border-border bg-surface/30 py-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Comprehensive Product Coverage</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Solutions for Every Lending Model
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { title: 'Term Loans', desc: 'MSMEs & Personal', icon: '💼' },
              { title: 'BNPL Infrastructure', desc: 'Instant POS Checkout', icon: '⚡' },
              { title: 'Co-Lending', desc: 'Multi-party Split Escrow', icon: '🤝' },
              { title: 'Invoice Discounting', desc: 'Supply Chain Capital', icon: '📄' },
              { title: 'Vendor Finance', desc: 'Distributor Liquidity', icon: '🚚' },
              { title: 'Credit Lines', desc: 'Revolving Limits', icon: '💳' },
            ].map((p, idx) => (
              <div
                key={idx}
                className="group rounded-xl border border-border bg-background p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-md"
              >
                <div className="text-2xl">{p.icon}</div>
                <div className="mt-2 text-sm font-bold text-primary group-hover:text-accent transition">{p.title}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION FROM SCREENSHOT: "Effortlessly collect payments while adhering to RBI's digital lending guidelines" */}
      <section id="collections-rbi" className="py-20 lg:py-28 border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Main Section Header */}
          <div className="max-w-4xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-[42px] leading-tight">
              Effortlessly collect payments while adhering to RBI&apos;s digital lending guidelines
            </h2>

            {/* Horizontal Sub-tabs */}
            <div className="mt-8 flex flex-wrap gap-6 sm:gap-10 border-b border-border pb-1">
              {[
                { id: 'collections', label: 'Collections and reconciliation' },
                { id: 'recurring', label: 'Recurring payments' },
                { id: 'split', label: 'Split payments' },
                { id: 'reports', label: 'Real-time reports' },
              ].map((tab) => {
                const isActive = activePaymentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActivePaymentTab(tab.id as any)}
                    className={`relative pb-3 text-sm font-bold transition-colors ${
                      isActive ? 'text-[#6933d3]' : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#6933d3] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Flow Content: Left diagram + Right copy */}
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left Diagram matching screenshot */}
            <div className="relative rounded-3xl border border-border/80 bg-gradient-to-br from-surface/50 via-background to-surface/40 p-6 sm:p-10 shadow-sm">
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                {/* 1. Payment sources left stack */}
                <div className="flex flex-col gap-3.5 w-full md:w-[170px] shrink-0">
                  {/* UPI card */}
                  <div className="rounded-xl border border-border bg-white dark:bg-surface p-3 shadow-sm flex items-center justify-center gap-2.5">
                    <span className="text-[11px] font-bold text-[#4285F4]">G Pay</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5f259f] text-[9px] font-black text-white">Pe</span>
                    <span className="text-[11px] font-extrabold text-[#00b9f5]">paytm</span>
                  </div>

                  {/* Net Banking card */}
                  <div className="rounded-xl border border-border bg-white dark:bg-surface p-3 shadow-sm flex items-center justify-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#280071] text-[9px] font-bold text-white">SBI</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#004c8f] text-[9px] font-bold text-white">HDFC</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#b02a30] text-[9px] font-bold text-white">i</span>
                  </div>

                  {/* Cards card */}
                  <div className="rounded-xl border border-border bg-white dark:bg-surface p-3 shadow-sm flex items-center justify-center gap-3">
                    <span className="text-xs font-black italic text-[#1a1f71] dark:text-blue-400">VISA</span>
                    <div className="flex -space-x-1.5">
                      <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
                      <span className="h-4 w-4 rounded-full bg-[#f79e1b] opacity-80" />
                    </div>
                    <span className="text-[10px] font-black text-[#00a4e4]">RuPay</span>
                  </div>
                </div>

                {/* Connector lines to center hub */}
                <div className="hidden md:flex flex-col items-center justify-center relative w-12">
                  <div className="h-0.5 w-12 bg-purple-300 dark:bg-purple-800" />
                </div>

                {/* 2. Central MoneyQuick Hub */}
                <div className="relative flex flex-col items-center shrink-0">
                  {/* Same Day Settlements badge on top */}
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-[#6933d3] px-3 py-1.5 text-[11px] font-bold text-white shadow-md">
                    <span>⏱️</span>
                    <span>{paymentTabDetails[activePaymentTab].badge}</span>
                  </div>

                  {/* Square Hub with MoneyQuick branding */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1f0247] shadow-xl border border-purple-400/40">
                    <img
                      src="/3b6903f8-23e4-4c03-9082-3fe23e47cd11.png"
                      alt="MoneyQuick"
                      className="h-9 w-9 object-contain"
                    />
                  </div>
                </div>

                {/* Connector line to output */}
                <div className="hidden md:flex flex-col items-center justify-center relative w-12">
                  <div className="h-0.5 w-12 bg-purple-300 dark:bg-purple-800" />
                </div>

                {/* 3. Output Card: "Loan Received" */}
                <div className="w-full md:w-[190px] rounded-2xl border border-border bg-white dark:bg-surface p-5 shadow-lg text-center shrink-0">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#10b981]/15 text-[#10b981]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="mt-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {paymentTabDetails[activePaymentTab].status}
                  </div>
                  <div className="mt-1 text-xl font-extrabold text-[#10b981]">
                    {paymentTabDetails[activePaymentTab].amount}
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="h-1.5 w-full rounded-full bg-border/60" />
                    <div className="h-1.5 w-3/4 mx-auto rounded-full bg-border/40" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Content */}
            <div className="lg:pl-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10b981] mb-2">
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                {paymentTabDetails[activePaymentTab].badge}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {paymentTabDetails[activePaymentTab].title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {paymentTabDetails[activePaymentTab].description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Perspective: NBFCs vs LSPs & Borrowers (Matching Cashfree's Section) */}
      <section id="solutions" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-highlight px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              Managed Escrow &amp; Orchestration
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              Tailored solutions for NBFCs and partner LSPs
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Whether you are an institutional lender running multi-bank escrows or a fintech platform onboarding borrowers, MoneyQuick powers your entire lifecycle.
            </p>

            {/* Toggle Buttons */}
            <div className="mt-8 inline-flex rounded-xl border border-border bg-surface p-1 shadow-inner">
              <button
                type="button"
                onClick={() => setActivePersona('nbfc')}
                className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${
                  activePersona === 'nbfc'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                For NBFCs &amp; Lenders
              </button>
              <button
                type="button"
                onClick={() => setActivePersona('lsp')}
                className={`rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${
                  activePersona === 'lsp'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                For Borrowers &amp; Fintech LSPs
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-12">
            {activePersona === 'nbfc' ? (
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="space-y-5">
                  <div className="rounded-2xl border border-border bg-surface/50 p-6 transition hover:border-accent">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white font-bold">
                        🏦
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-primary">Fully Managed Escrow Set-Up</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Open and operate compliant escrow accounts with multiple Tier-1 banking partners without individual bank integration overhead.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface/50 p-6 transition hover:border-accent">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B8F83] text-white font-bold">
                        ⚡
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-primary">Complete Disbursals &amp; Repayments Cycle</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Empower your teams to disburse loans instantly and track collections via our unified Merchant Dashboard or robust REST APIs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface/50 p-6 transition hover:border-accent">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-bold">
                        📊
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-primary">Detailed &amp; Customized MIS Reports</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Gain real-time visibility into portfolio health, disbursed statements, balance per LSP, and automated audit trails for regulatory compliance.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowDemoModal(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0b2148]"
                    >
                      <span>Explore NBFC Solutions</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>

                {/* Showcase Graphic */}
                <div className="rounded-3xl border border-border bg-gradient-to-br from-surface to-background p-8 shadow-xl">
                  <div className="text-xs font-bold uppercase tracking-wider text-accent">NBFC Dashboard Preview</div>
                  <div className="mt-2 text-xl font-bold text-primary">Multi-Bank Managed Escrow Architecture</div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>Connected Escrow Bank A</span>
                        <span className="text-[#10B981]">Active · 100% Uptime</span>
                      </div>
                      <div className="mt-1 text-lg font-bold text-primary">₹24,80,00,000 Available</div>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span>Connected Escrow Bank B (Failover)</span>
                        <span className="text-[#10B981]">Active · Standby</span>
                      </div>
                      <div className="mt-1 text-lg font-bold text-primary">₹18,50,00,000 Available</div>
                    </div>
                    <div className="rounded-xl bg-highlight/60 p-4 text-xs font-medium text-primary">
                      💡 Smart failover router switches between connected banking partners automatically during banking maintenance windows.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="space-y-5">
                  <div className="rounded-2xl border border-border bg-surface/50 p-6 transition hover:border-accent">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white font-bold">
                        ⚡
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-primary">Instant Borrower Disbursals</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Make instant loan disbursals directly to borrower bank accounts or UPI handles through high-speed payout rails.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface/50 p-6 transition hover:border-accent">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B8F83] text-white font-bold">
                        📱
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-primary">Frictionless Loan Lifecycle Visibility</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Complete transparency for your borrowers: upfront indicative EMI calculation, document status, and real-time loan progress tracking.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface/50 p-6 transition hover:border-accent">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-bold">
                        💳
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-primary">Automated Repayments &amp; Smart Mandates</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Provide hassle-free repayment options via UPI AutoPay, NetBanking, eNACH debit mandates, and WhatsApp smart payment links.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onGetStarted}
                      className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#5145CE]"
                    >
                      <span>Check Your Loan Readiness</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>

                {/* Showcase Graphic */}
                <div className="rounded-3xl border border-border bg-gradient-to-br from-surface to-background p-8 shadow-xl">
                  <div className="text-xs font-bold uppercase tracking-wider text-accent">Borrower Experience Preview</div>
                  <div className="mt-2 text-xl font-bold text-primary">Transparent Indicative Readiness Journey</div>
                  <div className="mt-6 space-y-3">
                    <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Indicative Capacity</div>
                        <div className="text-base font-bold text-primary">₹15,00,000 - ₹35,00,000</div>
                      </div>
                      <span className="rounded-full bg-[#10B981]/15 px-3 py-1 text-xs font-bold text-[#10B981]">ELIGIBLE</span>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground">Required Documents</div>
                        <div className="text-base font-bold text-primary">PAN, Aadhaar &amp; Bank Statement</div>
                      </div>
                      <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">3/3 READY</span>
                    </div>
                    <div className="rounded-xl bg-highlight/60 p-4 text-xs font-medium text-primary">
                      ✨ Assisted by KIRA, our in-product digital lending guide, explaining every step clearly.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Capability Pillars (Features Grid) */}
      <section id="features" className="border-t border-border bg-surface/20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Full-Stack Technology Suite</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              Engineered for Speed, Scale &amp; Strict Compliance
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Everything required to launch, scale, and automate your lending operations.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="group rounded-2xl border border-border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-2xl text-accent">
                ⚡
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">Instant Loan Disbursals</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Connect multiple current or escrow accounts. Disburse to borrower bank accounts, UPI IDs, or debit cards in seconds with automated multi-bank redundancy.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Up to 10,000 payouts in seconds</li>
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Real-time bank downtime detector</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl border border-border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B8F83]/15 text-2xl text-[#0B8F83]">
                🔄
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">Recurring Repayments &amp; AutoPay</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Set up automated recurring mandates via UPI AutoPay, e-NACH, and NetBanking. Collect loan repayments directly into your regulated account with same-day settlement.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Zero-touch automated debit</li>
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Automated reconciliation &amp; T+0 credit</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl border border-border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-2xl text-primary">
                🤝
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">Co-Lending &amp; Split Escrow</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Seamlessly split collected repayments and settle directly into co-lenders&apos; escrow accounts according to pre-configured underwriting ratios.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Pre-configured risk split (e.g. 80:20)</li>
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Multi-party trustee escrow support</li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="group rounded-2xl border border-border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/15 text-2xl text-[#F59E0B]">
                🔍
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">360° Borrower Verification Suite</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Instantly verify borrower bank accounts via Penny Drop, Aadhaar via DigiLocker, PAN card integrity, and GSTIN to prevent synthetic identity fraud.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Name-match confidence score</li>
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Independent PAN &amp; Aadhaar audit</li>
              </ul>
            </div>

            {/* Card 5 */}
            <div className="group rounded-2xl border border-border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-2xl text-accent">
                🛡️
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">Risk Mitigation &amp; ML Guardrails</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Real-time risk management with rule-based transaction velocity limits, IP anomaly detection, and automated fraud prevention before funds move.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Strict consent logging</li>
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> End-to-end 256-bit encryption</li>
              </ul>
            </div>

            {/* Card 6 */}
            <div className="group rounded-2xl border border-border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-2xl text-primary">
                📊
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">Merchant &amp; Lender Dashboard</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A single unified portal to monitor active loans, track failed transfers with instant recovery insights, and download automated RBI audit reports.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Granular ledger accounting</li>
                <li className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> Role-based access controls</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live EMI & Loan Readiness Estimator (Embedded on Landing Page!) */}
      <section id="calculator" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Live Interactive Preview</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              Calculate Your Indicative EMI &amp; Readiness
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Adjust your borrowing requirements below to estimate monthly repayments and evaluate readiness before proceeding.
            </p>
          </div>

          <div className="mt-12 mx-auto max-w-4xl rounded-3xl border border-border bg-surface/50 p-6 shadow-xl sm:p-10 backdrop-blur">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              {/* Sliders Side */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Loan Amount</label>
                    <span className="text-lg font-black text-primary">{formatCurrency(calcAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={10000000}
                    step={100000}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-border accent-accent"
                  />
                  <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                    <span>₹1 Lakh</span>
                    <span>₹50 Lakh</span>
                    <span>₹1 Crore</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Loan Tenure</label>
                    <span className="text-lg font-black text-primary">{calcTenure} {calcTenure === 1 ? 'Year' : 'Years'} ({calcTenure * 12} Mos)</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    step={1}
                    value={calcTenure}
                    onChange={(e) => setCalcTenure(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-border accent-accent"
                  />
                  <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                    <span>1 Year</span>
                    <span>3 Years</span>
                    <span>7 Years</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Annual Interest Rate (Illustrative)</label>
                    <span className="text-lg font-black text-accent">{calcRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min={9}
                    max={24}
                    step={0.5}
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-border accent-accent"
                  />
                  <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                    <span>9% (Tier-1)</span>
                    <span>14% (Standard)</span>
                    <span>24% (Unsecured)</span>
                  </div>
                </div>
              </div>

              {/* Result Preview Box */}
              <div className="rounded-2xl border border-white/60 bg-gradient-to-b from-white/95 to-surface/90 p-7 shadow-lg dark:border-white/10 dark:from-surface dark:to-background">
                <div className="text-xs font-bold uppercase tracking-wider text-accent">Monthly Estimated Outflow</div>
                <div className="mt-2 text-4xl font-black text-primary tracking-tight">
                  {formatCurrency(calculatedEmi)}
                  <span className="text-sm font-semibold text-muted-foreground"> / month</span>
                </div>

                <div className="mt-6 divide-y divide-border text-sm">
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Principal Requested:</span>
                    <span className="font-bold text-primary">{formatCurrency(calcAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Total Interest Payable:</span>
                    <span className="font-bold text-primary">{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-muted-foreground">Total Amount Payable:</span>
                    <span className="font-bold text-primary">{formatCurrency(totalPayment)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#5145CE] active:scale-95"
                  >
                    <span>Proceed with this Loan Outlook</span>
                    <span>&rarr;</span>
                  </button>
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    *Estimates are illustrative. Final rates and sanction subject to lender verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix: With MoneyQuick vs Other Platforms (Exact Cashfree Feature) */}
      <section id="comparison" className="border-t border-border bg-surface/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">The Modern Advantage</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              Why Leaders Choose MoneyQuick
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Compare our unified digital lending ecosystem against legacy, fragmented approaches.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/80">
                    <th className="py-4 px-6 font-bold text-primary">Feature &amp; Metric</th>
                    <th className="py-4 px-6 font-bold text-accent bg-highlight/30">With MoneyQuick</th>
                    <th className="py-4 px-6 font-bold text-muted-foreground">With Other / Traditional Platforms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-4 px-6 font-semibold text-primary">Time to Go Live</td>
                    <td className="py-4 px-6 font-semibold text-[#10B981] bg-highlight/20">
                      ⚡ Easy integration &amp; live in 2 weeks
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">Difficult integrations, 3-6 months onboarding delay</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-primary">Product Suite Architecture</td>
                    <td className="py-4 px-6 font-semibold text-[#10B981] bg-highlight/20">
                      🎯 One-stop unified solution: Low-code APIs &amp; merchant dashboard
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">Fragmented and siloed systems requiring 4+ distinct vendor contracts</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-primary">Bank Redundancy &amp; Downtime</td>
                    <td className="py-4 px-6 font-semibold text-[#10B981] bg-highlight/20">
                      🏦 Multi-bank escrow &amp; automated failover routing
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">Single bank dependency; operations halt during bank downtime</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-primary">RBI Digital Lending Guidelines</td>
                    <td className="py-4 px-6 font-semibold text-[#10B981] bg-highlight/20">
                      🛡️ 100% compliant with direct regulated account settlements
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">Manual compliance checks with regulatory inspection exposure</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-primary">Borrower Verification Suite</td>
                    <td className="py-4 px-6 font-semibold text-[#10B981] bg-highlight/20">
                      🔍 360° Instant automated verification (Penny drop, Aadhaar, PAN, GST)
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">Manual verification with slow turnaround and higher fraud risk</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-primary">Support &amp; Account Management</td>
                    <td className="py-4 px-6 font-semibold text-[#10B981] bg-highlight/20">
                      🤝 Dedicated relationship manager &amp; technical escrow support
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">Multiple disconnected support desks and slow ticket queues</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ Accordion) */}
      <section id="faqs" className="py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Got Questions?</span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Everything you need to know about our digital lending infrastructure and readiness portal.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-background transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-bold text-primary">{faq.question}</span>
                    <span className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-bold text-primary transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : ''}`}>
                      ⌄
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground border-t border-border/50 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final High-Converting Bottom Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-[#0f2452] to-accent py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
            Join 600,000+ Borrowers &amp; Leading NBFCs
          </span>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to modernize your lending journey?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
            Whether you need to assess your business loan readiness in minutes or configure high-volume institutional lending escrows, MoneyQuick is your reliable partner.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition hover:bg-white/90 active:scale-95"
            >
              <span>Check Loan Readiness Now</span>
              <span>&rarr;</span>
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-95"
            >
              <span>Sign In / Access Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="border-t border-border bg-background py-16 text-muted-foreground">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src="/3b6903f8-23e4-4c03-9082-3fe23e47cd11.png"
                  alt="MONEYQUICK Logo"
                  className="h-8 w-auto object-contain"
                />
                <span className="text-lg font-bold text-primary">MONEYQUICK</span>
              </div>
              <p className="mt-4 max-w-sm text-xs leading-relaxed">
                MoneyQuick is India&apos;s leading digital lending readiness and escrow orchestration platform, empowering NBFCs, Fintech LSPs, and borrowers with compliant, automated infrastructure.
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs">
                <span className="rounded-md bg-highlight px-2.5 py-1 font-bold text-accent">RBI DL Compliant</span>
                <span className="rounded-md bg-[#10B981]/15 px-2.5 py-1 font-bold text-[#10B981]">256-Bit SSL Secured</span>
              </div>
            </div>

            {/* Col 1: Solutions */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">Solutions</div>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li><a href="#solutions" className="hover:text-primary transition">Term Loans</a></li>
                <li><a href="#collections-rbi" className="hover:text-primary transition">Managed Escrow</a></li>
                <li><a href="#solutions" className="hover:text-primary transition">Co-Lending Infrastructure</a></li>
                <li><a href="#solutions" className="hover:text-primary transition">Invoice Discounting</a></li>
                <li><a href="#solutions" className="hover:text-primary transition">Supply Chain Finance</a></li>
              </ul>
            </div>

            {/* Col 2: Verification */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">360° Verification</div>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li><a href="#features" className="hover:text-primary transition">Bank Account Penny Drop</a></li>
                <li><a href="#features" className="hover:text-primary transition">Aadhaar DigiLocker API</a></li>
                <li><a href="#features" className="hover:text-primary transition">PAN Card OCR</a></li>
                <li><a href="#features" className="hover:text-primary transition">GSTIN Verification</a></li>
                <li><a href="#features" className="hover:text-primary transition">UPI AutoPay Mandates</a></li>
              </ul>
            </div>

            {/* Col 3: Legal & Resources */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">Company &amp; Legal</div>
              <ul className="mt-4 space-y-2.5 text-xs">
                <li>
                  <button onClick={() => onNavigate('privacy')} className="hover:text-primary transition">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('terms')} className="hover:text-primary transition">
                    Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowDemoModal(true)} className="hover:text-primary transition">
                    Contact Sales
                  </button>
                </li>
                <li><a href="#faqs" className="hover:text-primary transition">Help &amp; FAQs</a></li>
              </ul>
            </div>
          </div>

          {/* Regulatory Disclaimer */}
          <div className="mt-12 border-t border-border pt-8 text-[11px] leading-relaxed text-muted-foreground/80">
            <p>
              <strong>Disclaimer:</strong> MoneyQuick provides financial technology, indicative readiness assessment, and loan orchestration software. MoneyQuick does not make lending decisions, provide direct balance-sheet credit, or collect deposits. All credit facilities, interest rates, and loan approvals are determined solely by regulated lending institutions (Banks and RBI-registered NBFCs) following independent borrower underwriting and document verification.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-4">
              <div>&copy; {new Date().getFullYear()} MONEYQUICK. All rights reserved.</div>
              <div className="flex gap-4">
                <button onClick={() => onNavigate('privacy')} className="hover:text-primary">Privacy Policy</button>
                <span>&bull;</span>
                <button onClick={() => onNavigate('terms')} className="hover:text-primary">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Institutional / Contact Sales Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-background p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowDemoModal(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-surface hover:text-primary"
              aria-label="Close modal"
            >
              ✕
            </button>

            {demoSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/15 text-2xl text-[#10B981]">
                  ✓
                </div>
                <h3 className="mt-4 text-2xl font-bold text-primary">Thank you for contacting us!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our institutional lending solutions team will connect with your organization within 24 business hours.
                </p>
              </div>
            ) : (
              <>
                <div className="text-xs font-bold uppercase tracking-wider text-accent">Institutional Consultation</div>
                <h3 className="mt-1 text-2xl font-bold text-primary">Connect with Lending Experts</h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Configure high-volume NBFC escrows, co-lending split APIs, or custom borrower verification.
                </p>

                <form onSubmit={handleDemoSubmit} className="mt-6 space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input
                      required
                      type="text"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Work Email</label>
                    <input
                      required
                      type="email"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      placeholder="e.g. rahul@company.com"
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Organization Role</label>
                      <select
                        value={demoForm.role}
                        onChange={(e) => setDemoForm({ ...demoForm, role: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
                      >
                        <option>NBFC / Regulated Lender</option>
                        <option>Fintech LSP Platform</option>
                        <option>Bank / Financial Institution</option>
                        <option>MSME / Corporate Borrower</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Company Name</label>
                    <input
                      required
                      type="text"
                      value={demoForm.company}
                      onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      placeholder="e.g. Apex Capital Finance"
                      className="mt-1 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-primary outline-none focus:border-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-accent py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#5145CE]"
                  >
                    Submit Enquiry &rarr;
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
