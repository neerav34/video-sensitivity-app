# FROM node:18

# # Install python, venv, ffmpeg
# RUN apt-get update && apt-get install -y \
#     python3 python3-pip python3-venv ffmpeg && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# # Copy backend package.json
# COPY package*.json ./
# RUN npm install

# # Copy backend code (NOT entire repo)
# COPY . .

# # Create python venv
# RUN python3 -m venv /app/venv
# ENV PATH="/app/venv/bin:$PATH"

# # Install ML Python deps
# RUN pip3 install --upgrade pip --break-system-packages
# RUN pip3 install --no-cache-dir -r ml/requirements.txt --break-system-packages

# EXPOSE 10000

# CMD ["node", "server.js"]

# ---------------------------
# Base Image (Node + Debian)
# ---------------------------
FROM node:18

# ----------------------------------------
# Install Python 3.11, pip, venv, ffmpeg
# ----------------------------------------
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# ---------------------------
# App Directory
# ---------------------------
WORKDIR /app

# ---------------------------
# Copy backend package.json
# ---------------------------
COPY package*.json ./
RUN npm install

# ---------------------------
# Copy Backend Code
# ---------------------------
COPY . .

# ---------------------------
# Create Python virtual environment
# ---------------------------
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

# ---------------------------------------------------------
# FORCE CPU MODE (prevents ultralytics from installing CUDA)
# ---------------------------------------------------------
ENV FORCE_CUDA="0"
ENV CUDA_VISIBLE_DEVICES=""
ENV YOLO_CPU="1"
ENV YOLOR_CUDA="0"

# ---------------------------------------------------------
# FORCE Torch installation from CPU-only wheel repository
# ---------------------------------------------------------
ENV PIP_EXTRA_INDEX_URL="https://download.pytorch.org/whl/cpu"

# ---------------------------
# Upgrade pip then install ML requirements
# ---------------------------
RUN pip3 install --upgrade pip --break-system-packages
RUN pip3 install --no-cache-dir -r ml/requirements.txt --break-system-packages

# ---------------------------
# Expose backend port
# ---------------------------
EXPOSE 10000

# ---------------------------
# Start the server
# ---------------------------
CMD ["node", "server.js"]
