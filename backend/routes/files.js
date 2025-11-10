const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../models/File');
const auth = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/encryption');
const log = require('../utils/logger');
const User = require('../models/User');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const encryptedFile = encrypt(req.file.buffer);
    const encryptedFileName = `${Date.now()}-${req.file.originalname}`;
    const uploadPath = path.join(__dirname, '../uploads', encryptedFileName);


    fs.writeFileSync(uploadPath, JSON.stringify(encryptedFile));

    const file = new File({
      filename: req.file.originalname,
      originalName: req.file.originalname,
      encryptedName: encryptedFileName,
      mimetype: req.file.mimetype,
      size: req.file.size,
      owner: req.user._id
    });

    await file.save();
    log(`File uploaded: ${req.file.originalname} by ${req.user.username}`, 'INFO');

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        filename: file.filename,
        size: file.size,
        uploadedAt: file.uploadedAt
      }
    });
  } catch (error) {
    log(`File upload error: ${error.message}`, 'ERROR');
    res.status(500).json({ error: 'Error uploading file' });
  }
});

router.get('/my-files', auth, async (req, res) => {
  try {
    const files = await File.find({
      $or: [
        { owner: req.user._id },
        { 'sharedWith.user': req.user._id }
      ]
    }).populate('owner', 'username email');

    log(`Files retrieved for user ${req.user.username}`, 'INFO');

    res.json({ files });
  } catch (error) {
    log(`Error retrieving files: ${error.message}`, 'ERROR');
    res.status(500).json({ error: 'Error retrieving files' });
  }
});

router.get('/download/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const isOwner = file.owner.toString() === req.user._id.toString();
    const isShared = file.sharedWith.some(
      share => share.user.toString() === req.user._id.toString()
    );
    const isPublic = file.isPublic;

    if (!isOwner && !isShared && !isPublic) {
      log(`Unauthorized file access attempt by ${req.user.username}`, 'WARN');
      return res.status(403).json({ error: 'Access denied' });
    }

    const filePath = path.join(__dirname, '../uploads', file.encryptedName);
    const encryptedData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const decryptedBuffer = decrypt(encryptedData);

    log(`File downloaded: ${file.filename} by ${req.user.username}`, 'INFO');

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.send(decryptedBuffer);
  } catch (error) {
    log(`File download error: ${error.message}`, 'ERROR');
    res.status(500).json({ error: 'Error downloading file' });
  }
});

router.post('/share/:id', auth, async (req, res) => {
  try {
    const { userEmail, permission } = req.body;
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only owner can share files' });
    }

    const shareWithUser = await User.findOne({ email: userEmail });
    if (!shareWithUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const alreadyShared = file.sharedWith.some(
      share => share.user.toString() === shareWithUser._id.toString()
    );

    if (!alreadyShared) {
      file.sharedWith.push({
        user: shareWithUser._id,
        permission: permission || 'read'
      });
      await file.save();
    }

    log(`File shared: ${file.filename} with ${userEmail} by ${req.user.username}`, 'INFO');

    res.json({ message: 'File shared successfully' });
  } catch (error) {
    log(`File sharing error: ${error.message}`, 'ERROR');
    res.status(500).json({ error: 'Error sharing file' });
  }
});

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const isOwner = file.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filePath = path.join(__dirname, '../uploads', file.encryptedName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.findByIdAndDelete(req.params.id);

    log(`File deleted: ${file.filename} by ${req.user.username}`, 'INFO');

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    log(`File deletion error: ${error.message}`, 'ERROR');
    res.status(500).json({ error: 'Error deleting file' });
  }
});

module.exports = router;
