const File = require('../models/File');
const User = require('../models/User');
const crypto = require('crypto');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary');
const { processDocument } = require('../services/aiProcessor');
const { generateEmbeddings } = require('../services/vector');
const Version = require('../models/Version');

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const { folderId } = req.body;
    const user = await User.findById(req.user.id);

    // Calculate file hash for duplicate detection
    const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    
    // Check for duplicates in user's files
    const existingFileByHash = await File.findOne({ user: req.user.id, hash });
    
    const existingFileByName = await File.findOne({ 
      user: req.user.id, 
      originalName: req.file.originalname, 
      folder: folderId || null 
    });

    let cloudinaryResult;
    let isDuplicate = false;
    let duplicateOf = null;
    let file;

    if (existingFileByHash) {
      isDuplicate = true;
      duplicateOf = existingFileByHash._id;
      cloudinaryResult = {
        secure_url: existingFileByHash.cloudinaryUrl,
        public_id: existingFileByHash.cloudinaryId
      };
    } else {
      if (user.storageUsed + req.file.size > user.storageLimit) {
        return res.status(400).json({ success: false, error: 'Storage limit exceeded' });
      }
      cloudinaryResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      user.storageUsed += req.file.size;
      await user.save();
    }

    if (existingFileByName) {
      // Create a version of the existing file
      const versionsCount = await Version.countDocuments({ file: existingFileByName._id });
      
      // Save old state as version
      await Version.create({
        file: existingFileByName._id,
        versionNumber: versionsCount + 1,
        cloudinaryUrl: existingFileByName.cloudinaryUrl,
        cloudinaryId: existingFileByName.cloudinaryId,
        size: existingFileByName.size,
        hash: existingFileByName.hash,
        createdBy: req.user.id
      });

      // Update existing file
      existingFileByName.size = req.file.size;
      existingFileByName.mimetype = req.file.mimetype;
      existingFileByName.cloudinaryUrl = cloudinaryResult.secure_url;
      existingFileByName.cloudinaryId = cloudinaryResult.public_id;
      existingFileByName.hash = hash;
      existingFileByName.isDuplicate = isDuplicate;
      existingFileByName.duplicateOf = duplicateOf;
      existingFileByName.isProcessed = false;
      await existingFileByName.save();
      file = existingFileByName;
    } else {
      file = await File.create({
        name: req.file.originalname,
        originalName: req.file.originalname,
        user: req.user.id,
        folder: folderId || null,
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudinaryUrl: cloudinaryResult.secure_url,
        cloudinaryId: cloudinaryResult.public_id,
        hash,
        isDuplicate,
        duplicateOf
      });
    }

    // Fire event for AI processing asynchronously
    (async () => {
      try {
        const aiData = await processDocument(req.file.buffer, req.file.mimetype, req.file.originalname);
        
        file.extractedText = aiData.extractedText;
        file.summary = aiData.summary;
        file.category = aiData.category;
        file.metadata = aiData.metadata;
        file.isProcessed = true;
        
        if (aiData.isSuspicious) {
           file.metadata = file.metadata || {};
           file.metadata.flaggedAsSuspicious = true;
        }

        await file.save();

        if (aiData.extractedText) {
          // Simple chunking (1000 characters)
          const chunks = aiData.extractedText.match(/[\s\S]{1,1000}/g) || [];
          await generateEmbeddings(chunks, file._id, req.user.id);
        }
      } catch (err) {
        console.error('Async AI processing failed:', err);
      }
    })();

    res.status(201).json({ success: true, data: file });
  } catch (error) {
    next(error);
  }
};

exports.getFiles = async (req, res, next) => {
  try {
    const { folderId } = req.query;
    const query = { user: req.user.id };
    
    if (folderId) {
      query.folder = folderId;
    } else {
      query.folder = null; // Root level
    }

    const files = await File.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: files });
  } catch (error) {
    next(error);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    if (file.user.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this file' });
    }

    // Only delete from cloudinary if it's not a duplicate and no other duplicates exist
    if (!file.isDuplicate) {
      const otherDuplicates = await File.find({ duplicateOf: file._id });
      if (otherDuplicates.length === 0) {
        const resourceType = file.mimetype.startsWith('image') ? 'image' : file.mimetype.startsWith('video') ? 'video' : 'raw';
        await deleteFromCloudinary(file.cloudinaryId, resourceType);
        
        const user = await User.findById(file.user);
        user.storageUsed = Math.max(0, user.storageUsed - file.size);
        await user.save();
      }
    }

    await file.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
