// /api/lionsclub-join.js
import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const {
      name = "",
      email = "",
      phone = "",
      city = "",
      involvement = [],
      message = "",
      honeypot = "",
    } = req.body || {};

    if (honeypot) {
  console.warn("HONEYPOT TRIGGERED:", honeypot);
  return res.status(400).json({ ok: false, error: "Bot check triggered." });
}
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ ok: false, error: "Name and email are required." });
    }

    // ---- CONFIGURE THESE ADDRESSES ----
    // Must be from your VERIFIED domain in Resend:
    const FROM = "Southcentral Alaska Offroad & Outdoor Lions Club <noreply@alaskaoffroadlions.org>";

    // Where admin notifications go (can be Gmail or an @alaskaoffroadlions.org inbox):
    const ADMIN_TO = "Cooper <alaskaoffroadlions@gmail.com>";

    // Where replies should go (your main club inbox / your email)
    const CLUB_REPLY_TO = "alaskaoffroadlions@gmail.com";

    const subjectAdmin = `New Lions Club membership interest — ${name}`;
    const subjectUser  = "Thanks for your interest — Southcentral Alaska Offroad & Outdoor Lions Club";

    const safe = (x) => (Array.isArray(x) ? x.join(", ") : String(x || "").trim());

    const adminHtml = `
      <div style="background:#f3f4f6;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 18px 45px rgba(15,23,42,0.18);">
          <div style="background:#111827;color:#f9fafb;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.08);">
            <h1 style="margin:0;font-size:20px;font-weight:700;">New Lions Club Interest Form</h1>
            <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">
              Southcentral Alaska Offroad &amp; Outdoor Lions Club
            </p>
          </div>
          <div style="padding:20px 24px 8px;">
            <h2 style="margin:0 0 12px;font-size:16px;font-weight:600;">Contact Details</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:12px;">
              <tbody>
                <tr>
                  <td style="padding:4px 0;width:120px;color:#6b7280;font-weight:500;">Name</td>
                  <td style="padding:4px 0;color:#111827;">${safe(name)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-weight:500;">Email</td>
                  <td style="padding:4px 0;">
                    <a href="mailto:${safe(email)}" style="color:#2563eb;text-decoration:none;">${safe(email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-weight:500;">Phone</td>
                  <td style="padding:4px 0;color:#111827;">${safe(phone) || "-"}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-weight:500;">City / Region</td>
                  <td style="padding:4px 0;color:#111827;">${safe(city) || "-"}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;color:#6b7280;font-weight:500;">Involvement</td>
                  <td style="padding:4px 0;color:#111827;">${safe(involvement) || "-"}</td>
                </tr>
              </tbody>
            </table>

            ${
              message
                ? `
            <div style="margin-top:10px;padding-top:10px;border-top:1px solid #e5e7eb;">
              <h3 style="margin:0 0 6px;font-size:14px;font-weight:600;color:#111827;">Message</h3>
              <p style="margin:0;font-size:14px;color:#374151;white-space:pre-line;">${safe(message)}</p>
            </div>
            `
                : ""
            }
          </div>
          <div style="padding:12px 24px 16px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;display:flex;justify-content:space-between;align-items:center;">
            <span>Submitted: ${new Date().toLocaleString()}</span>
            <span>Southcentral Alaska Offroad &amp; Outdoor Lions Club</span>
          </div>
        </div>
      </div>
    `;

    const userHtml = `
      <div style="background:#f3f4f6;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 18px 45px rgba(15,23,42,0.18);">
          <div style="background:#111827;color:#f9fafb;padding:18px 24px;border-bottom:1px solid rgba(255,255,255,0.08);">
            <h1 style="margin:0;font-size:20px;font-weight:700;">Thanks for reaching out, ${safe(name)}!</h1>
            <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">
              Southcentral Alaska Offroad &amp; Outdoor Lions Club
            </p>
          </div>

          <div style="padding:20px 24px 8px;font-size:14px;color:#111827;">
            <p style="margin:0 0 12px;">
              We’ve received your interest form for the
              <strong>Southcentral Alaska Offroad &amp; Outdoor Lions Club</strong>.
            </p>

            <p style="margin:0 0 12px;">
              Here’s what to expect next:
            </p>

            <ul style="margin:0 0 12px 18px;padding:0;color:#374151;">
              <li>We’ll review your submission and follow up if we have any questions.</li>
              <li>We’ll send details on upcoming meetings, membership options, and ways to get involved.</li>
              <li>You’ll also receive updates about trail cleanups, training days, and community events.</li>
            </ul>

            <p style="margin:0 0 12px;">
              If you’d like to add anything or ask a question, just reply to this email.
            </p>

            <p style="margin:16px 0 0;">
              See you on the trail,<br/>
              <strong>Southcentral Alaska Offroad &amp; Outdoor Lions Club</strong>
            </p>
          </div>

          <div style="padding:12px 24px 16px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
            This email confirms we received your Lions Club interest form submission.
          </div>
        </div>
      </div>
    `;

    await Promise.all([
      // Admin notification
      resend.emails.send({
        from: FROM,
        to: [ADMIN_TO],
        replyTo: email, // ✅ replies to admin email go to the submitter
        subject: subjectAdmin,
        html: adminHtml,
        text: `Name: ${name}
Email: ${email}
Phone: ${phone}
City: ${city}
Involvement: ${safe(involvement)}

Message:
${message || "-"}`,
      }),

      // User confirmation
      resend.emails.send({
        from: FROM,
        to: [email],
        replyTo: CLUB_REPLY_TO, // ✅ if the user hits reply, it goes to your club inbox
        subject: subjectUser,
        html: userHtml,
        text:
          `Thanks, ${name}!\n\n` +
          `We received your interest form for the Southcentral Alaska Offroad & Outdoor Lions Club.\n\n` +
          `What to expect next:\n` +
          `- We’ll review your submission and follow up if needed.\n` +
          `- We’ll send details on meetings, membership options, and ways to get involved.\n` +
          `- You’ll receive updates about trail cleanups, training days, and community events.\n\n` +
          `If you have questions, reply to this email.\n\n` +
          `— Southcentral Alaska Offroad & Outdoor Lions Club`,
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("LIONSCLUB-JOIN ERROR:", err);
    return res.status(500).json({ ok: false, error: err?.message || "Unknown error" });
  }
}
