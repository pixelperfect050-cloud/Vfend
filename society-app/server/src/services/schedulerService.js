const Reminder = require('../models/Reminder');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

async function processReminders() {
  try {
    // Skip if MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Scheduler: MongoDB not ready, skipping...');
      return;
    }

    const now = new Date();
    const pendingReminders = await Reminder.find({
      status: 'pending',
      scheduledDate: { $lte: now }
    }).populate('userId');

    console.log(`Processing ${pendingReminders.length} reminders...`);

    for (const reminder of pendingReminders) {
      try {
        const notification = new Notification({
          userId: reminder.userId._id || reminder.userId,
          societyId: reminder.societyId,
          title: reminder.title,
          message: reminder.message,
          type: 'reminder',
          metadata: {
            reminderId: reminder._id,
            ...reminder.metadata?.toObject ? reminder.metadata.toObject() : reminder.metadata
          }
        });
        await notification.save();

        reminder.status = 'sent';
        reminder.sentDate = now;
        await reminder.save();

        console.log(`Sent reminder: ${reminder.title} to user ${reminder.userId._id}`);
      } catch (error) {
        console.error(`Error processing reminder ${reminder._id}:`, error);
        reminder.retryCount += 1;
        if (reminder.retryCount >= 3) {
          reminder.status = 'failed';
        }
        await reminder.save();
      }
    }
  } catch (error) {
    console.error('Scheduler error:', error.message);
  }
}

function startScheduler() {
  const interval = parseInt(process.env.REMINDER_INTERVAL || '3600000');
  
  console.log(`Reminder scheduler started - checking every ${interval/1000} seconds`);
  
  setInterval(processReminders, interval);
  
  // Initial delay to let DB connect
  setTimeout(processReminders, 10000);
}

module.exports = { processReminders, startScheduler };