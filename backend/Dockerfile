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


FROM node:18

RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

# Prevent CUDA installation
ENV YOLOR_CUDA=0
ENV YOLO_CPU=True
ENV FORCE_CUDA="0"

RUN pip3 install --upgrade pip --break-system-packages
RUN pip3 install --no-cache-dir -r ml/requirements.txt --break-system-packages

EXPOSE 10000
CMD ["node", "server.js"]
