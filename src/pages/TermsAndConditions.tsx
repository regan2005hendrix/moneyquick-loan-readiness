import React from 'react';

export default function TermsAndConditions({ onNavigate }: { onNavigate: (step: any) => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 sm:p-12 lg:p-24">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => onNavigate('landing')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary">
          ← Back to home
        </button>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">Terms & Conditions</h1>
        <div className="space-y-6 text-base leading-7 text-muted-foreground">
          <p>Last updated: September 30, 2026</p>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">1. Indicative Nature of Services</h2>
            <p>The loan outlook and borrowing ranges provided by MONEYQUICK are illustrative estimates only. They are based on the information you provide and do not constitute a credit decision, a guarantee of loan approval, or a specific offer of credit from any lender.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">2. User Responsibility</h2>
            <p>You agree to provide accurate and truthful information. MONEYQUICK is not responsible for outcomes resulting from inaccurate data provided by the user or for any reliance placed on the indicative estimates.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">3. Limitation of Liability</h2>
            <p>MONEYQUICK provides this tool "as is" without warranties of any kind. We are not liable for any financial decisions made based on the indicative estimates provided by this tool.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">4. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts in Mumbai.</p>
          </section>
        </div>
      </div>
    </div>
  );
}