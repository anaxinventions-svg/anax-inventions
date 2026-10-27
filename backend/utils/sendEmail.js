const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  // Try multiple methods
  let emailSent = false;
  let lastError = null;

  // METHOD 1: Try Gmail with App Password (spaces handled)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      // Remove spaces from app password if any
      const emailPass = process.env.EMAIL_PASS.replace(/\s/g, '');
      
      console.log(`📧 Attempting to send email via Gmail to: ${to}`);
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: emailPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
      });

      // Verify connection first
      await transporter.verify();
      console.log('✅ Gmail connection verified');

      const info = await transporter.sendMail({
        from: `"ANAX INVENTIONS" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
      
      console.log(`✅ Email sent successfully to ${to}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      emailSent = true;
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error(`❌ Gmail error: ${error.message}`);
      lastError = error;
      
      if (error.code === 'EAUTH') {
        console.log('\n🔐 Gmail Authentication Failed!');
        console.log('Solution: Generate a new App Password');
        console.log('1. Go to: https://myaccount.google.com/apppasswords');
        console.log('2. Select "Mail" and "Other"');
        console.log('3. Generate 16-digit code');
        console.log('4. Update EMAIL_PASS in .env file\n');
      }
    }
  }

  // METHOD 2: Try Outlook (if Gmail fails)
  if (!emailSent && process.env.OUTLOOK_USER && process.env.OUTLOOK_PASS) {
    try {
      console.log(`📧 Attempting via Outlook to: ${to}`);
      
      const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: process.env.OUTLOOK_USER,
          pass: process.env.OUTLOOK_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      
      await transporter.verify();
      
      const info = await transporter.sendMail({
        from: `"ANAX INVENTIONS" <${process.env.OUTLOOK_USER}>`,
        to,
        subject,
        html,
      });
      
      console.log(`✅ Email sent via Outlook to ${to}`);
      emailSent = true;
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error(`❌ Outlook error: ${error.message}`);
      lastError = error;
    }
  }

  // METHOD 3: DEVELOPMENT MODE - Log to console (for testing)
  if (!emailSent && process.env.NODE_ENV === 'development') {
    console.log('\n📧 ===== EMAIL CONTENT (Development Mode) =====');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    
    // Extract OTP from HTML if present
    const otpMatch = html.match(/\d{6}/);
    if (otpMatch) {
      console.log(`🔑 OTP CODE: ${otpMatch[0]}`);
      console.log(`⚠️ USE THIS OTP TO VERIFY (Check your email in production)`);
    }
    
    console.log(`HTML Preview: ${html.substring(0, 300)}...`);
    console.log('=============================================\n');
    
    // Still return success so OTP verification works
    return { success: true, devMode: true, otp: otpMatch ? otpMatch[0] : null };
  }

  // If all methods fail
  console.error(`❌ All email methods failed. Last error: ${lastError?.message}`);
  return { success: false, error: lastError?.message };
};

module.exports = sendEmail;