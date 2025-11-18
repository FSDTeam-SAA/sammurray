import cron from 'node-cron';
import User from '../modules/user/user.model';

cron.schedule('0 12 * * *', async () => {
  console.log('⏳ Running subscription expiry checker...');

  const now = new Date();

  await User.updateMany(
    {
      isSubscription: true,
      subscriptionExpiry: { $lte: now },
    },
    {
      $set: { isSubscription: false, subscriptionExpiry: null },
    },
  );

  console.log('✔ Auto subscription expiry update done');
});
