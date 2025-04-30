import nodemailer from 'npm:nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@sheltercrest.org',
    pass: '@3sheltercrest.orG'
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType?: string;
  }>;
}

export const emailService = {
  async sendMail({ to, subject, html, attachments }: EmailOptions) {
    try {
      const mailOptions = {
        from: '"ShelterCrest" <info@sheltercrest.org>',
        to,
        subject,
        html,
        attachments
      };

      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  async sendAgreementEmail(userEmail: string, agreementPdfPath: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Your ShelterCrest Agreement</h2>
        <p>Thank you for using ShelterCrest. Please find your signed agreement attached to this email.</p>
        <p>Keep this document for your records. If you have any questions, please don't hesitate to contact our support team.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f7fafc; border-radius: 5px;">
          <p style="margin: 0; color: #4a5568;">Best regards,<br>The ShelterCrest Team</p>
        </div>
      </div>
    `;

    return this.sendMail({
      to: userEmail,
      subject: 'Your ShelterCrest Agreement',
      html,
      attachments: [
        {
          filename: 'agreement.pdf',
          path: agreementPdfPath,
          contentType: 'application/pdf'
        }
      ]
    });
  },

  async sendAdminNotification(agreementPdfPath: string, userData: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">New Agreement Signed</h2>
        <p>A new agreement has been signed by a user.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 5px;">
          <h3 style="margin-top: 0;">User Details:</h3>
          <p style="margin: 5px 0;">Name: ${userData.firstName} ${userData.lastName}</p>
          <p style="margin: 5px 0;">Email: ${userData.email}</p>
          <p style="margin: 5px 0;">Application ID: ${userData.applicationId}</p>
        </div>
        <p>The signed agreement is attached to this email.</p>
      </div>
    `;

    return this.sendMail({
      to: 'info@sheltercrest.org',
      subject: 'New Agreement Signed',
      html,
      attachments: [
        {
          filename: 'agreement.pdf',
          path: agreementPdfPath,
          contentType: 'application/pdf'
        }
      ]
    });
  }
};