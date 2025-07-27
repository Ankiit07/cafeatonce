import nodemailer from 'nodemailer';
import { AppError } from '../utils/AppError';

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: any;
}

const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email service (Gmail, SendGrid, etc.)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Development - use Ethereal Email for testing
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass',
      },
    });
  }
};

const getEmailTemplate = (template: string, data: any): string => {
  switch (template) {
    case 'welcome':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Welcome to Cafe at Once!</h1>
          <p>Hi ${data.name},</p>
          <p>Thank you for joining Cafe at Once! We're excited to have you as part of our coffee-loving community.</p>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${data.verificationURL}" style="background-color: #8B7355; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
    
    case 'passwordReset':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Password Reset Request</h1>
          <p>Hi ${data.name},</p>
          <p>You requested a password reset for your Cafe at Once account.</p>
          <p>Click the button below to reset your password (valid for 10 minutes):</p>
          <a href="${data.resetURL}" style="background-color: #8B7355; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
    
    case 'orderConfirmation':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Order Confirmation</h1>
          <p>Hi ${data.customerName},</p>
          <p>Thank you for your order! Your order #${data.orderNumber} has been confirmed.</p>
          
          <h3>Order Details:</h3>
          <ul>
            ${data.items.map((item: any) => `
              <li>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>
            `).join('')}
          </ul>
          
          <p><strong>Total: ₹${data.total.toFixed(2)}</strong></p>
          <p><strong>Payment Method:</strong> ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          <p><strong>Estimated Delivery:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString()}</p>
          
          <p>We'll send you tracking information once your order ships.</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
    
    case 'contactForm':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">New Contact Form Submission</h1>
          <p><strong>From:</strong> ${data.customerName} (${data.customerEmail})</p>
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          <p>Please respond to this inquiry promptly.</p>
        </div>
      `;
    
    case 'contactConfirmation':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Thank You for Contacting Us!</h1>
          <p>Hi ${data.customerName},</p>
          <p>Thank you for reaching out to Cafe at Once. We have received your message regarding "${data.subject}".</p>
          <p>Our team will review your inquiry and respond within 24 hours during business hours.</p>
          <p>If you have any urgent questions, please feel free to call us at +91-7979837079 or WhatsApp us.</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
    
    default:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7355;">Cafe at Once</h1>
          <p>Thank you for choosing Cafe at Once!</p>
          <p>Best regards,<br>The Cafe at Once Team</p>
        </div>
      `;
  }
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `Cafe at Once <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: getEmailTemplate(options.template, options.data),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new AppError('Email could not be sent', 500);
  }
};