FROM node:18

# Install system dependencies (FFmpeg + Python)
RUN apt-get update && apt-get install -y \
  python3 python3-pip ffmpeg && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Node deps first (cache optimization)
COPY package*.json ./
RUN npm install

# Copy full backend
COPY . .

# Install Python ML dependencies
RUN pip3 install --no-cache-dir -r ml/requirements.txt

EXPOSE 10000
CMD ["npm", "start"]
