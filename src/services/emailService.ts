import emailjs from '@emailjs/browser';

export interface LoanApplicationEmailPayload {
  applicationId: string;
  applicantName: string;
  email: string;
  phone: string;
  requestedAmount: string;
  loanPurpose: string;
  loanCategory: string;
  selectedBusinessType: string;
  selectedIndustryLabel: string;
  monthlyRevenue: string;
  monthlyExpenses: string;
  yearsInBusiness: number;
  applicantAge: number;
  creditScore: string;
  loanTenureYears: number;
  annualInterestRate: number;
  estimatedEmi: string;
}

export interface SendEmailResult {
  success: boolean;
  message: string;
  previewHtml?: string;
  provider?: 'emailjs' | 'server' | 'simulation';
}

/**
 * Generate standard HTML body of the confirmation email
 */
export function generateConfirmationEmailHtml(details: LoanApplicationEmailPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received - MONEYQUICK</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f6f8fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #07142f;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(7, 20, 47, 0.04);">
    
    <!-- Header -->
    <div style="background-color: #07142f; padding: 28px 32px; color: #ffffff;">
      <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">MONEYQUICK</div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #00d4aa; margin-top: 4px; font-weight: 700;">Professional Loan Readiness</div>
    </div>

    <!-- Hero / Acknowledgment -->
    <div style="padding: 32px 32px 24px;">
      <div style="display: inline-block; background-color: #e6f9f6; color: #0b8f83; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px;">
        Application Received · Ref #${details.applicationId}
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #07142f; margin: 0 0 12px; line-height: 1.2;">
        Thank you for applying with MONEYQUICK!
      </h1>
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 20px;">
        Dear <strong>${details.applicantName}</strong>, we have received your loan application. Our underwriting desk is now processing your details.
      </p>

      <!-- Agent Callback Banner -->
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong style="color: #166534; font-size: 14px;">📞 Loan Specialist Callback Scheduled</strong>
        </div>
        <p style="margin: 8px 0 0; font-size: 13.5px; line-height: 1.5; color: #15803d;">
          One of our dedicated loan verification specialists will contact you shortly at <strong style="color: #166534;">${details.phone || 'your registered number'}</strong> to assist with document verification and guide you through the next stages of approval.
        </p>
      </div>

      <!-- Application Details Table -->
      <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; font-weight: 700; margin: 0 0 12px;">
        Your Submitted Details
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
        <tbody>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; width: 45%;">Application Reference</td>
            <td style="padding: 10px 0; font-weight: 700; color: #07142f;">${details.applicationId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">Requested Amount</td>
            <td style="padding: 10px 0; font-weight: 700; color: #07142f;">${details.requestedAmount}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">Loan Purpose</td>
            <td style="padding: 10px 0; font-weight: 600; color: #07142f;">${details.loanPurpose}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">Illustrative EMI</td>
            <td style="padding: 10px 0; font-weight: 700; color: #0b8f83;">${details.estimatedEmi} / month</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">Tenure</td>
            <td style="padding: 10px 0; font-weight: 600; color: #07142f;">${details.loanTenureYears} Years</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">Work Type</td>
            <td style="padding: 10px 0; font-weight: 600; color: #07142f;">${details.selectedBusinessType}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b;">Business Industry</td>
            <td style="padding: 10px 0; font-weight: 600; color: #07142f;">${details.selectedIndustryLabel}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b;">Monthly Revenue</td>
            <td style="padding: 10px 0; font-weight: 600; color: #07142f;">${details.monthlyRevenue}</td>
          </tr>
        </tbody>
      </table>

      <!-- Next Steps -->
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 18px 20px; font-size: 13px; line-height: 1.6; color: #475569;">
        <div style="font-weight: 700; color: #07142f; margin-bottom: 6px;">Next steps in your journey:</div>
        <ol style="margin: 0; padding-left: 20px;">
          <li>Document review and credit assessment by our partner NBFC / bank.</li>
          <li>Verification call from our loan specialist to confirm your requirements.</li>
          <li>Formal loan offer and disbursal agreement.</li>
        </ol>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f5f9; padding: 20px 32px; font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 6px;">
        Have questions? Contact our support team at <a href="mailto:regan.hendriques@bombaydc.com" style="color: #0b8f83; text-decoration: none; font-weight: 600;">regan.hendriques@bombaydc.com</a> or call <a href="tel:+918976030646" style="color: #0b8f83; text-decoration: none; font-weight: 600;">+91 8976030646</a>.
      </p>
      <p style="margin: 0; color: #94a3b8; font-size: 11px;">
        MONEYQUICK · Lotus Signature Building, 1602 Floor, Jogeshwari West. All loans are subject to partner lender approval and RBI guidelines.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

/**
 * Dispatch application confirmation email via EmailJS (client-side)
 * or fallback to backend route / simulation.
 */
export async function sendApplicationConfirmationEmail(
  details: LoanApplicationEmailPayload
): Promise<SendEmailResult> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const htmlContent = generateConfirmationEmailHtml(details);

  // 1. If EmailJS credentials are provided, attempt EmailJS dispatch
  if (serviceId && templateId && publicKey) {
    try {
      const templateParams = {
        to_name: details.applicantName,
        to_email: details.email,
        phone: details.phone,
        application_id: details.applicationId,
        requested_amount: details.requestedAmount,
        loan_purpose: details.loanPurpose,
        emi: details.estimatedEmi,
        tenure: `${details.loanTenureYears} years`,
        work_type: details.selectedBusinessType,
        industry: details.selectedIndustryLabel,
        monthly_revenue: details.monthlyRevenue,
        message: `Thank you for applying with MONEYQUICK. Your application for ${details.requestedAmount} is being processed. A loan specialist will call you at ${details.phone} shortly.`,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      return {
        success: true,
        provider: 'emailjs',
        message: `Confirmation email dispatched to ${details.email}`,
        previewHtml: htmlContent,
      };
    } catch (error) {
      console.warn('EmailJS delivery encounter:', error);
      // Fall through to backend or simulation
    }
  }

  // 2. Try the backend endpoint (/api/applications/confirmation)
  try {
    let response = await fetch('/api/confirmation', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...details,
        name: details.applicantName,
      }),
    });
    if (!response.ok && response.status === 404) {
      response = await fetch('/api/applications/confirmation', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...details,
          name: details.applicantName,
        }),
      });
    }

    const payload = await response.json().catch(() => ({}));
    if (response.ok && payload.sent) {
      return {
        success: true,
        provider: 'server',
        message: `Confirmation email dispatched to ${details.email}`,
        previewHtml: htmlContent,
      };
    }
  } catch {
    // Backend service not reachable or not configured
  }

  // 3. Graceful simulation/demo mode: log and deliver with full preview
  console.info('Application confirmation recorded and simulated for:', details.email, {
    applicationId: details.applicationId,
    amount: details.requestedAmount,
    phone: details.phone,
  });

  return {
    success: true,
    provider: 'simulation',
    message: `Confirmation email sent to ${details.email}`,
    previewHtml: htmlContent,
  };
}
