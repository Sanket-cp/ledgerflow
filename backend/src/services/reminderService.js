import Reminder from '../models/Reminder.js';
import Customer from '../models/Customer.js';
import ActivityLog from '../models/ActivityLog.js';

// Generate automatic daily reminders for customers with pending payments
export const generateDailyReminders = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get all active customers with balance > 0
    const customers = await Customer.find({
      userId,
      isActive: true,
      balance: { $gt: 0 },
    });

    const remindersCreated = [];

    for (const customer of customers) {
      // Check if reminder already exists for today (pending or sent)
      const existingReminder = await Reminder.findOne({
        userId,
        customerId: customer._id,
        type: 'payment_due',
        createdAt: { $gte: today, $lt: tomorrow },
      });

      if (existingReminder) {
        console.log(`Reminder already exists for ${customer.name}, skipping...`);
        continue; // Skip if reminder already exists
      }

      // Determine urgency based on balance
      let title = '';
      let message = '';
      let priority = 'normal';

      if (customer.balance > 50000) {
        priority = 'high';
        title = `🔴 Urgent: High Balance - ${customer.name}`;
        message = `High pending amount of ₹${customer.balance.toLocaleString('en-IN')} from ${customer.name}. Please collect payment today.`;
      } else if (customer.balance > 20000) {
        priority = 'medium';
        title = `⚠️ Payment Due - ${customer.name}`;
        message = `Pending amount of ₹${customer.balance.toLocaleString('en-IN')} from ${customer.name}. Follow up for payment.`;
      } else {
        priority = 'normal';
        title = `💰 Payment Reminder - ${customer.name}`;
        message = `${customer.name} has a pending balance of ₹${customer.balance.toLocaleString('en-IN')}.`;
      }

      // Create reminder for 9 AM today
      const reminderTime = new Date(today);
      reminderTime.setHours(9, 0, 0, 0);

      const reminder = await Reminder.create({
        userId,
        customerId: customer._id,
        customerName: customer.name,
        type: 'payment_due',
        title,
        message,
        amount: customer.balance,
        dueDate: reminderTime,
        schedule: 'daily',
        channel: 'browser',
        status: 'pending',
        isActive: true,
        nextDue: reminderTime,
      });

      remindersCreated.push(reminder);

      // Log activity
      await ActivityLog.create({
        userId,
        action: 'Auto Reminder Created',
        details: `Daily reminder created for ${customer.name} - ₹${customer.balance.toLocaleString('en-IN')}`,
        user: 'System',
      });
    }

    console.log(`Generated ${remindersCreated.length} new reminders`);
    return remindersCreated;
  } catch (error) {
    console.error('Error generating daily reminders:', error);
    throw error;
  }
};

// Generate interest reminders for customers with interest enabled
export const generateInterestReminders = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const customers = await Customer.find({
      userId,
      isActive: true,
      interestEnabled: true,
      balance: { $gt: 0 },
    });

    const remindersCreated = [];

    for (const customer of customers) {
      // Check if interest reminder already exists for today
      const existingReminder = await Reminder.findOne({
        userId,
        customerId: customer._id,
        type: 'interest_due',
        createdAt: { $gte: today, $lt: tomorrow },
      });

      if (existingReminder) {
        console.log(`Interest reminder already exists for ${customer.name}, skipping...`);
        continue;
      }

      // Calculate interest
      let interestAmount = 0;
      
      switch (customer.interestType) {
        case 'daily':
          interestAmount = (customer.balance * customer.interestRate) / 100;
          break;
        case 'monthly':
          // Check if it's month end (last 3 days)
          const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
          if (today.getDate() >= daysInMonth - 2) {
            interestAmount = (customer.balance * customer.interestRate) / 100;
          }
          break;
        case 'yearly':
          // Check if it's year end (last 7 days)
          const endOfYear = new Date(today.getFullYear(), 11, 31);
          const daysToYearEnd = Math.ceil((endOfYear - today) / (1000 * 60 * 60 * 24));
          if (daysToYearEnd <= 7) {
            interestAmount = (customer.balance * customer.interestRate) / 100;
          }
          break;
      }

      if (interestAmount > 0) {
        const reminder = await Reminder.create({
          userId,
          customerId: customer._id,
          customerName: customer.name,
          type: 'interest_due',
          title: `💵 Interest Due - ${customer.name}`,
          message: `Interest of ₹${interestAmount.toLocaleString('en-IN')} is due from ${customer.name} (${customer.interestRate}% ${customer.interestType}).`,
          amount: interestAmount,
          dueDate: today,
          schedule: customer.interestType === 'daily' ? 'daily' : 'once',
          channel: 'browser',
          status: 'pending',
          isActive: true,
          nextDue: today,
        });

        remindersCreated.push(reminder);

        await ActivityLog.create({
          userId,
          action: 'Interest Reminder Created',
          details: `Interest reminder for ${customer.name} - ₹${interestAmount.toLocaleString('en-IN')}`,
          user: 'System',
        });
      }
    }

    console.log(`Generated ${remindersCreated.length} interest reminders`);
    return remindersCreated;
  } catch (error) {
    console.error('Error generating interest reminders:', error);
    throw error;
  }
};

// Clean up old sent reminders (older than 30 days)
export const cleanupOldReminders = async (userId) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Reminder.deleteMany({
      userId,
      status: 'sent',
      updatedAt: { $lt: thirtyDaysAgo },
    });

    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up old reminders:', error);
    throw error;
  }
};
