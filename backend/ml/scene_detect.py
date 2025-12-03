import os
import warnings
warnings.filterwarnings("ignore")
os.environ["YOLO_VERBOSE"] = "False"
os.environ["ULTRALYTICS_SUPPRESS"] = "True"


# import cv2
# import sys
# import json
# from ultralytics import YOLO

# video_path = sys.argv[1]
# model = YOLO("yolov8n.pt")  # tiny, free, fast

# cap = cv2.VideoCapture(video_path)
# frame_count = 0
# flag_weapons = 0
# flag_blood = 0

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break
#     frame_count += 1

#     if frame_count % 10 != 0:
#         continue  # sample frames

#     results = model(frame)
#     for r in results:
#         for obj in r.boxes.cls:
#             cls_id = int(obj)
#             if cls_id in [43, 44]:  # knife/gun classes in COCO
#                 flag_weapons += 1

#     # blood detection
#     hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
#     lower_red = (0, 50, 50)
#     upper_red = (10, 255, 255)
#     mask = cv2.inRange(hsv, lower_red, upper_red)
#     red_ratio = mask.sum() / (frame.size)

#     if red_ratio > 0.05:
#         flag_blood += 1

# cap.release()

# result = {
#     "weapons": flag_weapons,
#     "blood": flag_blood,
#     "safe": flag_weapons == 0 and flag_blood == 0
# }

# # print(json.dumps(result))
# print(json.dumps(result), flush=True)


import cv2
import sys
import json
import os

# Disable YOLO logs
os.environ["YOLO_VERBOSE"] = "False"
os.environ["ULTRALYTICS_CFG"] = "False"

from ultralytics import YOLO

video_path = sys.argv[1]

# Load model silently
model = YOLO("yolov8n.pt", verbose=False)

cap = cv2.VideoCapture(video_path)

frame_count = 0
weapons = 0
blood = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1

    # Sample frames
    if frame_count % 10 != 0:
        continue

    # Disable progress bars by using stream=True
    results = model(frame, stream=True, verbose=False)

    for r in results:
        classes = r.boxes.cls.tolist()
        for cls_id in classes:
            cls_id = int(cls_id)
            # COCO knife = 43, gun = 44 (approx)
            if cls_id in [43, 44]:
                weapons += 1

    # Blood detection (simple red mask)
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lower = (0, 50, 50)
    upper = (10, 255, 255)
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

# PRINT ONLY JSON!
print(json.dumps(result))
