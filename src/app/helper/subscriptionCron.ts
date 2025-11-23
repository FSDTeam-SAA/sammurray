import cron from 'node-cron';
import User from '../modules/user/user.model';
import Subscription from '../modules/subscription/subscription.model';

cron.schedule('0 12 * * *', async () => {
  console.log('⏳ Running subscription expiry checker...');

  const now = new Date();

  const expiredUsers = await User.find({
    isSubscription: true,
    subscriptionExpiry: { $lte: now },
  });

  if (expiredUsers.length > 0) {
    for (const user of expiredUsers) {
      await Subscription.updateMany(
        { user: user._id },
        { $pull: { user: user._id } },
      );

      user.isSubscription = false;
      user.subscriptionExpiry = null;
      await user.save();
    }
  }

  console.log('✔ Auto subscription expiry update done');
});
