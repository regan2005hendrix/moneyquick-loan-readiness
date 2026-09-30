import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 sm:p-12 lg:p-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">Terms & Conditions</h1>
        <div className="space-y-6 text-base leading-7 text-muted-foreground">
          <p>Last updated: September 30, 2026</p>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">1. Indicative Nature of Services</h2>
            <p>The loan outlook and borrowing ranges provided by this website are illustrative estimates only. They do not constitute a credit decision, a guarantee of loan approval, or a specific offer of credit.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">2. User Responsibility</h2>
            <p>You agree to provide accurate and truthful information. We are not responsible for outcomes resulting from inaccurate data provided by the user.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">3. Limitation of Liability</h2>
            <p>MoneyQuick provides this tool "as is" without warranties of any kind. We are not liable for any decisions made based on the indicative estimates provided.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">4. Governing Law</h2>
            <p>These terms are governed by the laws of India.</p>
          </section>
        </div>
      </div>
    </div>
  );
}