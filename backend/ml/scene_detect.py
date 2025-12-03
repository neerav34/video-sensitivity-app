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



import os
import cv2
import sys
import json
import warnings

# ---------------------------------------------------------
# SILENCE ALL YOLO / ULTRALYTICS / NUMPY NOISE
# ---------------------------------------------------------
warnings.filterwarnings("ignore")

os.environ["YOLO_VERBOSE"] = "False"
os.environ["ULTRALYTICS_SUPPRESS"] = "True"
os.environ["ULTRALYTICS_CFG"] = "False"
os.environ["KMP_WARNINGS"] = "0"
os.environ["NUMEXPR_MAX_THREADS"] = "8"

# ---------------------------------------------------------
# Import YOLO silently
# ---------------------------------------------------------
from ultralytics import YOLO

video_path = sys.argv[1]

# Load YOLO model — without verbose (YOLO8 removed verbose arg)
model = YOLO("yolov8n.pt")   # autodownloads to ~/.cache


# ---------------------------------------------------------
# ANALYSIS LOGIC
# ---------------------------------------------------------
cap = cv2.VideoCapture(video_path)
frame_count = 0
weapons = 0
blood = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1

    # Sample every 10th frame
    if frame_count % 10 != 0:
        continue

    # Run YOLO inference silently
    results = model(frame, stream=True)

    for r in results:
        if r.boxes is None:
            continue
        classes = r.boxes.cls.tolist()
        for cls_id in classes:
            cls_id = int(cls_id)
            # COCO: 43 = knife, 44 = gun
            if cls_id in [43, 44]:
                weapons += 1

    # Simple blood detection using red color mask
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lower = (0, 50, 50)
    upper = (10, 255, 255)
    mask = cv2.inRange(hsv, lower, upper)
    red_ratio = mask.sum() / frame.size

    if red_ratio > 0.05:
        blood += 1

cap.release()

# ---------------------------------------------------------
# RETURN CLEAN JSON ONLY
# ---------------------------------------------------------
result = {
    "weapons": weapons,
    "blood": blood,
    "safe": weapons == 0 and blood == 0
}

# **PRINT ONLY JSON — ZERO NOISE**
print(json.dumps(result), flush=True)



# import cv2
# import sys
# import json
# import os

# # Disable YOLO logs
# os.environ["YOLO_VERBOSE"] = "False"
# os.environ["ULTRALYTICS_CFG"] = "False"

# from ultralytics import YOLO

# video_path = sys.argv[1]

# # Load model silently
# # model = YOLO("yolov8n.pt", verbose=False)
# model = YOLO("yolov8n.pt")   # remove verbose argument


# cap = cv2.VideoCapture(video_path)

# frame_count = 0
# weapons = 0
# blood = 0

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break

#     frame_count += 1

#     # Sample frames
#     if frame_count % 10 != 0:
#         continue

#     # Disable progress bars by using stream=True
#     results = model(frame, stream=True, verbose=False)

#     for r in results:
#         classes = r.boxes.cls.tolist()
#         for cls_id in classes:
#             cls_id = int(cls_id)
#             # COCO knife = 43, gun = 44 (approx)
#             if cls_id in [43, 44]:
#                 weapons += 1

#     # Blood detection (simple red mask)
#     hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
#     lower = (0, 50, 50)
#     upper = (10, 255, 255)
#     mask = cv2.inRange(hsv, lower, upper)

#     red_ratio = mask.sum() / frame.size

#     if red_ratio > 0.05:
#         blood += 1

# cap.release()

# result = {
#     "weapons": weapons,
#     "blood": blood,
#     "safe": weapons == 0 and blood == 0
# }

# # PRINT ONLY JSON!
# print(json.dumps(result))
