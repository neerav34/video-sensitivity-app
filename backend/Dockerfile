FROM node:18

RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend ./
RUN pip3 install -r ml/requirements.txt

EXPOSE 10000
CMD ["npm", "start"]

