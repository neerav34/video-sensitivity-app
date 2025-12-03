import os
import cv2
import sys
import json
import warnings

warnings.filterwarnings("ignore")

os.environ["YOLO_VERBOSE"] = "False"
os.environ["ULTRALYTICS_SUPPRESS"] = "True"
os.environ["ULTRALYTICS_CFG"] = "False"
os.environ["ULTRALYTICS_LOGGING"] = "False"  
os.environ["KMP_WARNINGS"] = "0"
os.environ["NUMEXPR_MAX_THREADS"] = "8"

from ultralytics import YOLO

video_path = sys.argv[1]

model = YOLO("yolov8n.pt")

cap = cv2.VideoCapture(video_path)
frame_count = 0
weapons = 0
blood = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    if frame_count % 10 != 0:
        continue
    results = model(frame, stream=True)

    for r in results:
        if r.boxes is None:
            continue
        classes = r.boxes.cls.tolist()
        for cls_id in classes:
            if int(cls_id) in [43, 44]: 
                weapons += 1

    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lower = (0, 150, 150)
    upper = (5, 255, 255)
    mask = cv2.inRange(hsv, lower, upper)
    red_ratio = mask.sum() / frame.size

    if red_ratio > 0.05:
        blood += 1

cap.release()

result = {
    "weapons": weapons,
    "blood": blood,
    "safe": weapons == 0 and blood == 0
}

sys.stdout.write(json.dumps(result))
sys.stdout.flush()
