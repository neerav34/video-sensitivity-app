// const Video = require('../models/Video');

// function emitProgress(io, videoId, progress, status, sensitivityStatus) {
//   io.to(videoId.toString()).emit('processingUpdate', {
//     videoId,
//     progress,
//     status,
//     sensitivityStatus
//   });
// }

// exports.processVideoPipeline = async (videoId, io) => {
//   try {
//     const video = await Video.findById(videoId);
//     if (!video) return;

//     // set initial processing
//     video.status = 'processing';
//     video.processingProgress = 10;
//     await video.save();
//     emitProgress(io, videoId, 10, 'processing', 'unknown');

//     // fake some processing steps
//     video.processingProgress = 40;
//     await video.save();
//     emitProgress(io, videoId, 40, 'processing', 'unknown');

//     // simple pseudo sensitivity analysis
//     const isFlagged = Math.random() < 0.3;
//     video.sensitivityStatus = isFlagged ? 'flagged' : 'safe';
//     video.processingProgress = 80;
//     await video.save();
//     emitProgress(io, videoId, 80, 'processing', video.sensitivityStatus);

//     // final
//     video.status = 'processed';
//     video.processingProgress = 100;
//     await video.save();
//     emitProgress(io, videoId, 100, 'processed', video.sensitivityStatus);
//   } catch (err) {
//     console.error('Video processing error:', err);
//     await Video.findByIdAndUpdate(videoId, {
//       status: 'failed',
//       processingProgress: 0,
//       sensitivityStatus: 'unknown'
//     });
//     emitProgress(io, videoId, 0, 'failed', 'unknown');
//   }
// };


const { spawn } = require("child_process");
const Video = require("../models/Video");

exports.processVideoPipeline = async (videoId, io) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) return;

    video.status = "processing";
    video.processingProgress = 10;
    await video.save();
    io.to(videoId.toString()).emit("processingUpdate", {
      videoId, progress: 10, status: "processing", sensitivityStatus: "unknown"
    });

    const python = spawn("python3", ["ml/scene_detect.py", video.filePath]);

    python.stdout.on("data", async (data) => {
      const analysis = JSON.parse(data.toString());
      const flagged = !analysis.safe;

      video.status = "processed";
      video.processingProgress = 100;
      video.sensitivityStatus = flagged ? "flagged" : "safe";
      video.analysisDetails = analysis;
      await video.save();

      io.to(videoId.toString()).emit("processingUpdate", {
        videoId,
        progress: 100,
        status: "completed",
        sensitivityStatus: video.sensitivityStatus,
        details: analysis
      });
    });

    python.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

  } catch (err) {
    console.error("Video processing error:", err);
  }
};
