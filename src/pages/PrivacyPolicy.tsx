import React from 'react';

export default function PrivacyPolicy({ onNavigate }: { onNavigate: (step: any) => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 sm:p-12 lg:p-24">
      <div className="mx-auto max-w-3xl">
        <button onClick={() => onNavigate('landing')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary">
          ← Back to home
        </button>
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-base leading-7 text-muted-foreground">
          <p>Last updated: September 30, 2026</p>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">1. Information We Collect</h2>
            <p>MoneyQuick is a loan readiness tool designed to help self-employed professionals understand their indicative borrowing capacity. We collect information you provide directly to us, including contact details, business financial information, and uploaded documents for verification purposes.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">2. How We Use Your Information</h2>
            <p>Your information is used solely to generate a professional borrowing range and facilitate the loan application process with verified lending partners. We do not sell your personal data to third-party marketers.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">3. Data Security</h2>
            <p>We implement industry-standard encryption and security measures to protect your data. All document uploads are handled through secure, encrypted channels to ensure confidentiality.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">4. Third-Party Sharing</h2>
            <p>We only share your data with lending partners after receiving your explicit consent during the application process. These partners are bound by strict data protection agreements.</p>
          </section>
        </div>
      </div>
    </div>
  );
}