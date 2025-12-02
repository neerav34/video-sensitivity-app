# Install Python + ffmpeg
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Node and ML files early
COPY package*.json ./
COPY ml ./ml

RUN npm install

COPY . .

# Create virtual env
ENV VIRTUAL_ENV=/app/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install Python ML dependencies — allows breaking system packages
RUN pip3 install --break-system-packages --no-cache-dir -r ml/requirements.txt

EXPOSE 10000
CMD ["npm","start"]
