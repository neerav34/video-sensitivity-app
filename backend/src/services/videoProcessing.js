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

function emitProgress(io, videoId, progress, status, details) {
  io.to(videoId.toString()).emit("processingUpdate", {
    videoId,
    progress,
    status,
    sensitivityStatus: details?.safe === false ? "flagged" : "safe",
    details,
  });
}

exports.processVideoPipeline = async (videoId, io) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) return;

    // Initial update
    video.status = "processing";
    video.processingProgress = 10;
    await video.save();
    emitProgress(io, videoId, 10, "processing");

    // Run Python script: ml/scene_detect.py <video-file-path>
    const python = spawn("python3", ["ml/scene_detect.py", video.filePath]);


// Buffer to accumulate stdout until valid JSON appears
    let buffer = "";
    
    python.stdout.on("data", async (data) => {
      buffer += data.toString();
    
      // Try to extract a full JSON object from buffer
      const match = buffer.match(/\{[^}]+\}/);
    
      if (!match) {
        console.log("Non-JSON output ignored:", data.toString());
        return;
      }
    
      let analysis;
      try {
        analysis = JSON.parse(match[0]);   // parse only JSON
      } catch (err) {
        console.log("JSON parse error, waiting for more data...");
        return; // wait for more chunks
      }
    
      // Once parsed, clear buffer so duplicate JSON doesn't re-trigger
      buffer = "";
    
      const isFlagged = !analysis.safe;
    
      // Mid-progress update
      video.processingProgress = 80;
      await video.save();
      emitProgress(io, videoId, 80, "analyzing", analysis);
    
      // Final DB update
      video.status = "processed";
      video.processingProgress = 100;
      video.sensitivityStatus = isFlagged ? "flagged" : "safe";
      video.analysisDetails = analysis;
      await video.save();
    
      emitProgress(io, videoId, 100, "completed", analysis);
    });

    
    python.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

    python.on("close", async (code) => {
      console.log(`Python process closed (${videoId}) exit code:`, code);
    });

  } catch (err) {
    console.error("Video processing error:", err);

    await Video.findByIdAndUpdate(videoId, {
      status: "failed",
      processingProgress: 0,
      sensitivityStatus: "unknown",
    });

    emitProgress(io, videoId, 0, "failed");
  }
};














// const { spawn } = require("child_process");
// const Video = require("../models/Video");

// function emitProgress(io, videoId, progress, status, details) {
//   io.to(videoId.toString()).emit("processingUpdate", {
//     videoId,
//     progress,
//     status,
//     sensitivityStatus: details?.safe === false ? "flagged" : "safe",
//     details,
//   });
// }

// exports.processVideoPipeline = async (videoId, io) => {
//   try {
//     const video = await Video.findById(videoId);
//     if (!video) return;

//     // Set initial state
//     video.status = "processing";
//     video.processingProgress = 10;
//     await video.save();
//     emitProgress(io, videoId, 10, "processing");

//     // Run Python analysis script
//     const python = spawn("python3", ["ml/scene_detect.py", video.filePath]);


    
//     python.stdout.on("data", async (data) => {
//       const analysis = JSON.parse(data.toString());
//       const isFlagged = !analysis.safe;

//       video.processingProgress = 80;
//       await video.save();
//       emitProgress(io, videoId, 80, "analyzing", analysis);

//       // Store final result
//       video.status = "processed";
//       video.processingProgress = 100;
//       video.sensitivityStatus = isFlagged ? "flagged" : "safe";
//       video.analysisDetails = analysis;
//       await video.save();

//       emitProgress(io, videoId, 100, "completed", analysis);
//     });

//     python.stderr.on("data", (data) => {
//       console.error("Python error:", data.toString());
//     });

//     python.on("close", async () => {
//       console.log("Analysis complete for:", videoId);
//     });

//   } catch (err) {
//     console.error("Video processing error:", err);
//     await Video.findByIdAndUpdate(videoId, {
//       status: "failed",
//       processingProgress: 0,
//       sensitivityStatus: "unknown"
//     });
//     emitProgress(io, videoId, 0, "failed");
//   }
// };
