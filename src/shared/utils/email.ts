/**
 * src/shared/utils/email.ts
 *
 * Nodemailer email helpers.
 *
 * Exports:
 *   sendEmail()                — generic transactional email (subject + HTML body)
 *   sendEnquiryNotification()  — fires when a public enquiry form is submitted
 */

import nodemailer from "nodemailer";
import { env } from "@/core/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST ?? "",
  port: env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: env.SMTP_USER ?? "",
    pass: env.SMTP_PASS ?? "",
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<void> {
  if (!env.SMTP_HOST) return; // Email not configured — skip silently

  const fromName = env.SMTP_FROM_NAME;
  const fromEmail = env.SMTP_FROM_EMAIL ?? "noreply@axvn.vn";
  const defaultFrom = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail;

  await transporter.sendMail({
    from: options.from ?? defaultFrom,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

export async function sendEnquiryNotification(data: {
  type: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  consentGiven?: boolean;
  consentTimestamp?: string;
}): Promise<void> {
  const adminEmail = env.ADMIN_EMAIL;

  const consentRow = data.consentGiven
    ? `<tr>
         <td style="padding:8px;border:1px solid #ddd;font-weight:bold">Personal data consent</td>
         <td style="padding:8px;border:1px solid #ddd;color:green">✓ Consented at ${data.consentTimestamp ?? "N/A"}</td>
       </tr>`
    : "";

  await sendEmail({
    to: adminEmail,
    subject: `[AXVN] New ${data.type} enquiry from ${data.name}`,
    html: `
      <h2 style="color:#1a1a2e">New ${data.type} Enquiry — AXVN Tech Holding</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td>   <td style="padding:8px;border:1px solid #ddd">${data.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td>  <td style="padding:8px;border:1px solid #ddd">${data.email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td>  <td style="padding:8px;border:1px solid #ddd">${data.phone ?? "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Company</td><td style="padding:8px;border:1px solid #ddd">${data.company ?? "—"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Subject</td><td style="padding:8px;border:1px solid #ddd">${data.subject ?? "—"}</td></tr>
        ${consentRow}
      </table>
      <h3 style="color:#1a1a2e">Message</h3>
      <p style="white-space:pre-wrap;font-family:sans-serif;font-size:14px">${data.message}</p>
      <hr style="border:none;border-top:1px solid #eee;margin-top:24px"/>
      <p style="color:#999;font-size:11px">AXVN Tech Holding · axvn.vn · Automated notification — do not reply</p>
    `,
  });
}
