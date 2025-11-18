import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

// Create reusable transporter (created once, reused for all requests)
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOSTNAME,
    port: Number(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    // Validate SMTP configuration
    const smtpHost = process.env.SMTP_HOSTNAME;
    const smtpUser = process.env.SMTP_USERNAME;
    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const smtpTo = process.env.SMTP_TO || 'xyz@gmail.com'; // Default recipient

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('SMTP configuration incomplete');
      return NextResponse.json(
        { 
          error: 'Email service not configured',
          details: 'Please configure SMTP settings in environment variables'
        },
        { status: 500 }
      );
    }

    // Parse form data
    const formData: ContactFormData = await request.json();
    const { firstName, lastName, email, phone, message } = formData;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        </div>
        <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
          <h3 style="color: #007bff; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            This message was sent from the Make Model Year contact form.
          </p>
        </div>
      </div>
    `;

    // Plain text version
    const textContent = `
New Contact Form Submission

Contact Information:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}

---
This message was sent from the Make Model Year contact form.
    `;

    // Send email
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      replyTo: email, // Allow replying directly to the user
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: textContent,
      html: htmlContent,
    });

    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      recipient: smtpTo,
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

