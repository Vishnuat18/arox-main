const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (!this.transporter) {
      // If SMTP credentials are not set, use a preview/log-only mode
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        logger.warn('SMTP not configured. Emails will be logged only.');
        return null;
      }

      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
    return this.transporter;
  }

  async sendMail({ to, subject, html, text, attachments }) {
    const transporter = this.getTransporter();
    
    if (!transporter) {
      logger.info(`📧 [EMAIL LOG] To: ${to} | Subject: ${subject}`);
      logger.debug(`📧 [EMAIL BODY] ${text || html}`);
      return { messageId: 'log-only', logged: true };
    }

    try {
      const result = await transporter.sendMail({
        from: `"${process.env.ORG_NAME}" <${process.env.SMTP_FROM}>`,
        to,
        subject,
        html,
        text,
        attachments
      });

      logger.info(`📧 Email sent to ${to}: ${result.messageId}`);
      return result;
    } catch (error) {
      logger.error(`📧 Failed to send email to ${to}:`, error.message);
      throw error;
    }
  }

  async sendWelcomeEmail(student, credentials) {
    const html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 30px; border-radius: 16px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to AROX Tech! 🎉</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Your journey begins now</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 16px; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <p>Hi <strong>${student.first_name}</strong>,</p>
          <p>Congratulations on your registration! Here are your login credentials:</p>
          <div style="background: #F1F5F9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Student ID:</strong> ${student.student_id}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${credentials.email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${credentials.password}</p>
          </div>
          <p style="color: #EF4444; font-size: 14px;">⚠️ Please change your password after your first login.</p>
          <a href="${process.env.ORG_WEBSITE}/login" style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 12px 30px; border-radius: 12px; text-decoration: none; margin-top: 15px;">Login to Portal</a>
        </div>
        <p style="text-align: center; color: #94A3B8; font-size: 12px; margin-top: 20px;">
          © ${new Date().getFullYear()} ${process.env.ORG_NAME}. All rights reserved.
        </p>
      </div>
    `;

    return this.sendMail({
      to: student.email,
      subject: 'Welcome to AROX Tech - Your Login Credentials',
      html
    });
  }

  async sendRegistrationConfirmation(student, registration) {
    const html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #22C55E, #06B6D4); padding: 30px; border-radius: 16px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Registration Confirmed! ✅</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 16px; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <p>Hi <strong>${student.first_name}</strong>,</p>
          <p>Your registration has been confirmed. Here are the details:</p>
          <div style="background: #F1F5F9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Registration ID:</strong> ${registration.registration_id}</p>
            <p style="margin: 5px 0;"><strong>Course:</strong> ${registration.course_title || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong>Batch:</strong> ${registration.batch_name || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong>Start Date:</strong> ${registration.start_date || 'TBD'}</p>
          </div>
        </div>
      </div>
    `;

    return this.sendMail({
      to: student.email,
      subject: `Registration Confirmed - ${registration.registration_id}`,
      html
    });
  }
}

module.exports = new EmailService();
