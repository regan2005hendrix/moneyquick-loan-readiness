import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 sm:p-12 lg:p-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-base leading-7 text-muted-foreground">
          <p>Last updated: September 30, 2026</p>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when using our loan readiness tools, including your contact details, business information, and uploaded documents for verification purposes.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">2. How We Use Your Information</h2>
            <p>Your information is used to provide an indicative borrowing range and to facilitate the loan application process with our partner lenders.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data. All document uploads are handled through secure channels.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">4. Third-Party Sharing</h2>
            <p>We share your data with verified lending partners only after receiving your explicit consent during the application process.</p>
          </section>
        </div>
      </div>
    </div>
  );
}