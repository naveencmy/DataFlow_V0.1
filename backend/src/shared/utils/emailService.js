import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

let transporter;

try {
  if (env.SMTP_USER && env.SMTP_PASS) {
    const isSecure = env.SMTP_PORT === 465 || String(env.SMTP_USE_SSL).toLowerCase() === 'true';

    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      secure: isSecure,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    logger.info(
      { host: env.SMTP_HOST, port: env.SMTP_PORT, user: env.SMTP_USER },
      '📧 Brevo SMTP mail transporter configured'
    );
  } else {
    // Ethereal / mock transport for local dev
    transporter = {
      sendMail: async (options) => {
        logger.info({ to: options.to, subject: options.subject }, '✉️ [MOCK EMAIL SENT]');
        return { messageId: 'mock-mail-id' };
      },
    };
  }
} catch (err) {
  logger.warn('Failed to initialize nodemailer transport, using fallback logger');
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    const fromAddress = env.EMAIL_FROM || '"HR" <naveenatdevine@gmail.com>';
    const result = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: text || '',
      html: html || `<p>${text || ''}</p>`,
    });
    logger.info({ to, subject, messageId: result.messageId }, '✅ Email sent successfully via Brevo SMTP');
    return result;
  } catch (error) {
    logger.error({ error: error.message, to, subject }, '❌ Failed to send email via Brevo');
    throw error;
  }
}

export async function sendVerificationOtpEmail(to, otp) {
  return sendEmail({
    to,
    subject: 'Dayflow HRMS — Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4338ca;">Welcome to Dayflow HRMS</h2>
        <p>Use the following 6-digit verification code to complete your registration:</p>
        <div style="background-color: #f3f4f6; font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; padding: 15px; margin: 20px 0; color: #1f2937; border-radius: 6px;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 13px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(to, name, loginId, initialPassword) {
  return sendEmail({
    to,
    subject: 'Welcome to Dayflow HRMS — Your Account Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4338ca;">Hello ${name},</h2>
        <p>Your Dayflow HRMS account has been created successfully. Here are your login credentials:</p>
        <ul>
          <li><strong>Login ID:</strong> ${loginId}</li>
          <li><strong>Email:</strong> ${to}</li>
          <li><strong>Temporary Password:</strong> ${initialPassword || 'Configured upon registration'}</li>
        </ul>
        <p>Please log in and update your security credentials.</p>
      </div>
    `,
  });
}

export async function sendLeaveStatusEmail(to, name, leaveType, status, remarks) {
  const isApproved = status === 'Approved';
  return sendEmail({
    to,
    subject: `Dayflow HRMS — Leave Request ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: ${isApproved ? '#059669' : '#dc2626'};">Leave Request ${status}</h2>
        <p>Dear ${name},</p>
        <p>Your application for <strong>${leaveType}</strong> has been <strong>${status}</strong> by administration.</p>
        ${remarks ? `<p><strong>Review Remarks:</strong> ${remarks}</p>` : ''}
        <p style="color: #6b7280; font-size: 13px;">Check your Dayflow HRMS portal for updated leave balance and attendance logs.</p>
      </div>
    `,
  });
}

export default {
  sendEmail,
  sendVerificationOtpEmail,
  sendWelcomeEmail,
  sendLeaveStatusEmail,
};
