const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendReminderEmail(userId, reminder) {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.email) {
      console.log(`No email found for user ${userId}`);
      return false;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: `Reminder: ${reminder.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Society Reminder</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333;">${reminder.title}</h2>
            <p style="color: #666; font-size: 16px;">${reminder.message}</p>
            <div style="background-color: #fff; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
              <p style="margin: 0;"><strong>Scheduled:</strong> ${new Date(reminder.scheduledDate).toLocaleString('en-IN')}</p>
            </div>
            <p style="color: #888; font-size: 12px;">
              This is an automated reminder from Society Sync App.<br>
              Please ignore this email if you have already completed the task.
            </p>
          </div>
          <div style="padding: 20px; text-align: center; color: #888; font-size: 12px;">
            <p>Sent via Society Sync App</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

async function sendBulkReminders(reminders) {
  const results = [];
  for (const reminder of reminders) {
    const result = await sendReminderEmail(reminder.userId, reminder);
    results.push({ reminderId: reminder._id, success: result });
  }
  return results;
}

module.exports = { sendReminderEmail, sendBulkReminders };