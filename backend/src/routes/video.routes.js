const router = require('express').Router();
const upload = require('../config/multer');
const { auth, requireRole } = require('../middleware/auth');
const { uploadVideo, listVideos, streamVideo } = require('../controllers/video.controller');

router.post(
  '/upload',
  auth,
  requireRole('editor', 'admin'),
  upload.single('video'),
  uploadVideo
);

router.get(
  '/',
  auth,
  requireRole('viewer', 'editor', 'admin'),
  listVideos
);

router.get(
  '/:id/stream',
  auth,
  requireRole('viewer', 'editor', 'admin'),
  streamVideo
);

module.exports = router;
