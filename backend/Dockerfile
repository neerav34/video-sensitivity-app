FROM node:18

# Install system dependencies (Python + FFmpeg)
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Node dependencies and install
COPY package*.json ./
RUN npm install

# Copy backend code
COPY . .

# ---- Python ML Dependencies Fix ----
# Create virtual environment for Python packages
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r ml/requirements.txt
# -----------------------------------

# Expose backend port
EXPOSE 10000

CMD ["npm", "start"]
