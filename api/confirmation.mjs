const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export default async function handler(req, res) {
  // Enable CORS if accessed from client
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let details = req.body || {};
  if (typeof details === 'string') {
    try {
      details = JSON.parse(details);
    } catch {
      details = {};
    }
  }

  const email = (typeof details.email === 'string' ? details.email.trim() : '') ||
    (typeof details.applicantEmail === 'string' ? details.applicantEmail.trim() : '') ||
    (typeof details.registeredEmail === 'string' ? details.registeredEmail.trim() : '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid registered email address is required.' });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'Email delivery is not configured yet. Add RESEND_API_KEY to the server environment.',
    });
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || 'MONEYQUICK <onboarding@resend.dev>';

  const rows = [
    ['Application reference', details.applicationId || 'MQ-APP-PENDING'],
    ['Applicant', details.name || 'Applicant'],
    ['Email', email],
    ['Contact phone', details.phone || 'Not provided'],
    ['Requested amount', details.requestedAmount || 'N/A'],
    ['Loan purpose', details.loanPurpose || 'N/A'],
    ['Loan category', details.loanCategory || 'N/A'],
    ['Monthly revenue', details.monthlyRevenue || 'N/A'],
    ['Monthly expenses', details.monthlyExpenses || 'N/A'],
    ['Business age', details.yearsInBusiness ? `${details.yearsInBusiness} years` : 'N/A'],
    ['Work type', details.selectedBusinessType || 'N/A'],
    ['Industry', details.selectedIndustryLabel || 'N/A'],
    ['Applicant age', details.applicantAge || 'N/A'],
    ['CIBIL score shared', details.creditScore || 'N/A'],
    ['Tenure', details.loanTenureYears ? `${details.loanTenureYears} years` : 'N/A'],
    ['Illustrative annual rate', details.annualInterestRate ? `${details.annualInterestRate}%` : 'N/A'],
    ['Illustrative EMI', details.estimatedEmi || 'N/A'],
  ];

  const htmlRows = rows
    .map(([label, value]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`)
    .join('');

  const emailPayload = {
    from,
    to: [email],
    subject: `Application Received: Your MONEYQUICK Loan Request (${details.applicationId || 'Ref Pending'})`,
    html: `<div style="font-family:Arial,sans-serif;color:#07142f;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;background:#ffffff">
      <div style="background-color:#07142f;padding:20px 24px;border-radius:8px;color:#ffffff;margin-bottom:20px">
        <h2 style="margin:0;color:#ffffff;font-size:20px;font-weight:800">MONEYQUICK</h2>
        <div style="font-size:11px;color:#00d4aa;text-transform:uppercase;letter-spacing:0.12em;margin-top:4px">Professional Loan Readiness</div>
      </div>

      <h2 style="color:#07142f;margin-bottom:8px">Thank you for applying with MONEYQUICK</h2>
      <p style="color:#475569;font-size:15px;line-height:1.5">We have received your loan readiness details. Your application is currently under review by our underwriting desk.</p>
      
      <div style="margin:20px 0;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;">
        <strong style="color:#166534">📞 Loan Specialist Callback Scheduled:</strong>
        <p style="margin:6px 0 0;color:#15803d;font-size:14px">Our loan verification specialist will contact you shortly at <strong>${escapeHtml(details.phone || 'your registered number')}</strong> to guide you through verification and answer any questions.</p>
      </div>

      <h3 style="color:#07142f;margin-top:24px">Your submitted details</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${htmlRows}</table>
      
      <p style="margin-top:24px;font-size:12px;color:#64748b;line-height:1.5">Please keep this email for your records. Final verification and lending decisions are completed by partner lenders subject to RBI guidelines.</p>
    </div>`,
  };

  try {
    let mailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });

    let mailPayload = await mailResponse.json().catch(() => ({}));

    // Handle Resend sandbox restriction (onboarding@resend.dev requires account owner)
    if (!mailResponse.ok && (mailResponse.status === 403 || mailResponse.status === 422)) {
      const errorMsg = typeof mailPayload?.message === 'string' ? mailPayload.message : '';
      const isSandboxRestriction = mailPayload?.name === 'validation_error' ||
        errorMsg.includes('testing email') ||
        errorMsg.includes('own email address') ||
        errorMsg.includes('verify a domain');
      
      if (isSandboxRestriction) {
        const ownerEmail = errorMsg.match(/\(([^)]+@[^)]+)\)/)?.[1] || process.env.RESEND_OWNER_EMAIL || 'regan2005hendrix@gmail.com';
        console.warn(`Resend sandbox restriction for ${email}. Rerouting to account owner: ${ownerEmail}`);

        const sandboxPayload = {
          ...emailPayload,
          to: [ownerEmail],
          subject: `[Sandbox - For: ${email}] ${emailPayload.subject}`,
          html: `<div style="font-family:Arial,sans-serif;background:#fef3c7;border:1px solid #f59e0b;padding:12px 16px;margin-bottom:16px;border-radius:8px;font-size:13px;color:#92400e;">
            <strong>Resend Sandbox Notice:</strong> This confirmation email was intended for <strong>${escapeHtml(email)}</strong> (${escapeHtml(details.name)}). Delivered to verified account owner during testing.
          </div>` + emailPayload.html,
        };

        mailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify(sandboxPayload),
        });
        const sandboxMailPayload = await mailResponse.json().catch(() => ({}));

        if (mailResponse.ok) {
          return res.status(200).json({
            sent: true,
            id: sandboxMailPayload?.id,
            sandboxForwarded: true,
            recipient: email,
            deliveredTo: ownerEmail,
          });
        }
      }
    }

    if (!mailResponse.ok) {
      console.error(`Resend rejected confirmation email (${mailResponse.status}) from ${from}:`, mailPayload);
      const providerMessage = typeof mailPayload?.message === 'string' ? mailPayload.message : '';
      return res.status(502).json({
        error: providerMessage ? `The confirmation email could not be sent: ${providerMessage}` : 'The confirmation email could not be delivered by Resend.',
      });
    }

    return res.status(200).json({ sent: true, id: mailPayload?.id });
  } catch (error) {
    console.error('Resend confirmation email request failed:', error);
    return res.status(502).json({ error: 'The confirmation email service could not be reached.' });
  }
}
