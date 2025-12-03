const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');
const { processVideoPipeline } = require('../services/videoProcessing');

exports.uploadVideo = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    const user = req.user;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const video = await Video.create({
      title: title || file.originalname,
      originalName: file.originalname,
      filePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
      owner: user.id,
      tenantId: user.tenantId,
      status: 'uploaded',
      sensitivityStatus: 'unknown',
      processingProgress: 0
    });

    const io = req.app.get('io');
    if (io) {
    setTimeout(() => {
    require('../services/videoProcessing').processVideoPipeline(video._id, io);
    }, 1000); // give frontend 1s to join room
    }


    res.status(201).json({ message: 'Video uploaded', videoId: video._id });
  } catch (err) {
    console.error('Upload video error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listVideos = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { status, sensitivity } = req.query;

    const query = { tenantId };

    if (status) query.status = status;
    if (sensitivity) query.sensitivityStatus = sensitivity;

    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error('List videos error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send('Video not found');

    if (video.tenantId !== req.user.tenantId) {
      return res.status(403).send('Forbidden');
    }

    const videoPath = path.resolve(video.filePath);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': video.mimeType
      });
      fs.createReadStream(videoPath).pipe(res);
      return;
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': video.mimeType
    };

    res.writeHead(206, headers);
    file.pipe(res);
  } catch (err) {
    console.error('Stream video error:', err);
    res.status(500).send('Server error');
  }
};
