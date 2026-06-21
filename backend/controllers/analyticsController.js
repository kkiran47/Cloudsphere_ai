const User = require('../models/User');
const File = require('../models/File');
const Activity = require('../models/Activity');
const { getGenerativeModel } = require('../services/gemini');

exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const totalFiles = await File.countDocuments({ user: userId });
    const user = await User.findById(userId);
    
    // Get activity over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = await Activity.find({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });

    // Category breakdown
    const categoryBreakdown = await File.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalSize: { $sum: '$size' } } }
    ]);

    // Most and Least Used Files based on Activity
    const fileUsage = await Activity.aggregate([
      { $match: { user: user._id, action: { $in: ['view', 'download'] }, file: { $ne: null } } },
      { $group: { _id: '$file', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Find files with 0 views (not in fileUsage)
    const usedFileIds = fileUsage.map(f => f._id);
    const unusedFiles = await File.find({ user: user._id, _id: { $nin: usedFileIds } }).limit(5);
    
    // Populate the most used files
    const mostUsedFiles = await File.find({ _id: { $in: fileUsage.slice(0, 5).map(f => f._id) } });

    res.status(200).json({
      success: true,
      data: {
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        totalFiles,
        categoryBreakdown,
        recentActivity: recentActivity.slice(0, 10),
        mostUsedFiles,
        unusedFiles
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSmartSuggestions = async (req, res, next) => {
  try {
    const files = await File.find({ user: req.user.id, folder: null }).select('name category summary size');
    
    if (files.length < 3) {
      return res.status(200).json({ success: true, suggestions: "Not enough files at the root level to provide meaningful organization suggestions." });
    }

    const fileDataForPrompt = files.map(f => `- ${f.name} (Category: ${f.category}, Summary: ${f.summary || 'N/A'})`).join('\n');

    const prompt = `
You are a smart file organization assistant. Look at the following list of files currently sitting at the root directory of a user's cloud storage.
Group them into 2-4 logical folders based on their content, category, or summary.

Files:
${fileDataForPrompt}

Return ONLY a JSON array of objects with this format (no markdown):
[
  {
    "suggestedFolderName": "E.g. Invoices 2024",
    "reason": "Why these files belong together",
    "files": ["file_name_1.pdf", "file_name_2.png"]
  }
]
`;

    const model = getGenerativeModel('gemini-2.5-flash');
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    let suggestions;
    try {
      suggestions = JSON.parse(text);
    } catch (e) {
      suggestions = "Unable to generate structural suggestions at this time.";
    }

    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
};
