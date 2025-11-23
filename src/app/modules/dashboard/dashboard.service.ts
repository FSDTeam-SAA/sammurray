import Listing from '../listting/listing.model';
import Property from '../property/property.model';
import User from '../user/user.model';
import Payment from '../payment/payment.model';

const dashboardOverView = async () => {
  const totalUser = await User.countDocuments();
  const totalActiveProperty = await Property.countDocuments();
  const totalListing = await Listing.countDocuments();
  const subscriptionData = await User.countDocuments({
    isSubscription: true,
  });
  const revenueData = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);
  const totalRevenue = revenueData.length ? revenueData[0].total : 0;

  return {
    totalUser,
    totalActiveProperty,
    subscriptionData,
    totalListing,
    totalRevenue,
  };
};

const getMonthlyEarnings = async (year: number) => {
  const earnings = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthlyData = months.map((month, index) => {
    const found = earnings.find((e) => e._id === index + 1);
    return {
      month,
      totalEarnings: found ? found.total : 0,
    };
  });

  return monthlyData;
};


export const dashboardService = {
  dashboardOverView,
  getMonthlyEarnings
};
