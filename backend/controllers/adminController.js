const User = require('../models/User');
const File = require('../models/File');
const Share = require('../models/Share');

exports.getSystemStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFiles = await File.countDocuments();
    const totalShares = await Share.countDocuments();

    // Aggregating total storage used
    const storageStats = await User.aggregate([
      { $group: { _id: null, totalStorageUsed: { $sum: '$storageUsed' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalFiles,
        totalShares,
        totalStorageUsed: storageStats[0] ? storageStats[0].totalStorageUsed : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
