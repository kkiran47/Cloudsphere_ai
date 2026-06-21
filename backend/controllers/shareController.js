const Share = require('../models/Share');
const File = require('../models/File');
const crypto = require('crypto');

exports.createShareLink = async (req, res, next) => {
  try {
    const { fileId, isPublic, password, expiresInDays } = req.body;

    const file = await File.findById(fileId);
    if (!file || file.user.toString() !== req.user.id) {
      return res.status(404).json({ success: false, error: 'File not found or unauthorized' });
    }

    const linkId = crypto.randomBytes(16).toString('hex');
    let expiresAt = null;
    
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
    }

    const share = await Share.create({
      file: fileId,
      user: req.user.id,
      linkId,
      isPublic: isPublic || false,
      password: password || null,
      expiresAt
    });

    res.status(201).json({ success: true, data: share });
  } catch (error) {
    next(error);
  }
};

exports.getSharedFile = async (req, res, next) => {
  try {
    const { linkId } = req.params;
    const { password } = req.body;

    const share = await Share.findOne({ linkId }).populate('file');
    
    if (!share) {
      return res.status(404).json({ success: false, error: 'Link not found or expired' });
    }

    if (share.expiresAt && new Date() > share.expiresAt) {
      await share.deleteOne();
      return res.status(404).json({ success: false, error: 'Link expired' });
    }

    if (!share.isPublic && share.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    share.views += 1;
    await share.save();

    res.status(200).json({ success: true, data: share.file });
  } catch (error) {
    next(error);
  }
};
