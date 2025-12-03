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

    video.status = "processing";
    video.processingProgress = 10;
    await video.save();
    emitProgress(io, videoId, 10, "processing");

    const python = spawn("python3", ["ml/scene_detect.py", video.filePath]);


    let buffer = "";
    
    python.stdout.on("data", async (data) => {
      buffer += data.toString();
    
   
      const match = buffer.match(/\{[^}]+\}/);
    
      if (!match) {
        console.log("Non-JSON output ignored:", data.toString());
        return;
      }
    
      let analysis;
      try {
        analysis = JSON.parse(match[0]);  
      } catch (err) {
        console.log("JSON parse error, waiting for more data...");
        return; 
      }
    
      
      buffer = "";
    
      const isFlagged = !analysis.safe;
    
      
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
