require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const path = require('path');

const connectDB = require('./src/config/db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

app.set('io', io);

// middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// static for uploaded files if needed
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// connect DB
connectDB();

// routes
const authRoutes = require('./src/routes/auth.routes');
const videoRoutes = require('./src/routes/video.routes');

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// socket.io
io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  socket.on('joinVideoRoom', (videoId) => {
    socket.join(videoId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
