# ---------------------------
# 1) Base Image
# ---------------------------
FROM node:18

# ---------------------------
# 2) Install Python + ffmpeg
# ---------------------------
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ---------------------------
# 3) Create working directory
# ---------------------------
WORKDIR /app

# ---------------------------
# 4) Copy Node dependencies first (better caching)
# ---------------------------
COPY package*.json ./

RUN npm install

# ---------------------------
# 5) Copy Python ML files early
# ---------------------------
COPY ml ./ml

# ---------------------------
# 6) Copy all other backend files
# ---------------------------
COPY . .

# ---------------------------
# 7) Create Python venv + install dependencies
# ---------------------------
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

RUN pip3 install --break-system-packages --no-cache-dir -r ml/requirements.txt

# ---------------------------
# 8) Expose backend port
# ---------------------------
EXPOSE 10000

# ---------------------------
# 9) Start server
# ---------------------------
CMD ["npm", "start"]
