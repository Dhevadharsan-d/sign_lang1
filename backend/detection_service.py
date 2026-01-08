import cv2
import numpy as np
import mediapipe as mp
from tensorflow.keras.models import load_model

# -------------------------------
# 1. Load Model ONCE
# -------------------------------
print("🔄 Loading action recognition model...")
model = load_model("action.tflite")
print("✅ Model loaded successfully")

# -------------------------------
# 2. Constants
# -------------------------------
SEQUENCE_LENGTH = 20
SMOOTHING_WINDOW = 6
MIN_CONSISTENT = 4
threshold = 0.4

actions = np.array(["hello", "thanks", "iloveyou"])  # update if needed

# -------------------------------
# 3. MediaPipe Setup
# -------------------------------
mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# -------------------------------
# 4. Runtime Buffers
# -------------------------------
sequence = []
sentence = []
predictions = []

# -------------------------------
# 5. Prediction Function
# -------------------------------
def predict(image_bytes: bytes):
    global sequence, sentence, predictions

    # Decode image bytes
    np_img = np.frombuffer(image_bytes, np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    if frame is None:
        raise ValueError("Invalid image data")

    # MediaPipe detection
    image, results = mediapipe_detection(frame, holistic)

    # Sequence buffer
    keypoints = extract_keypoints(results)
    sequence.append(keypoints)
    sequence = sequence[-SEQUENCE_LENGTH:]

    predicted_action = None
    confidence = 0.0

    # Prediction
    if len(sequence) == SEQUENCE_LENGTH:
        res = model.predict(
            np.expand_dims(sequence, axis=0),
            verbose=0
        )[0]

        pred_idx = np.argmax(res)
        confidence = float(res[pred_idx])

        predictions.append(pred_idx)
        predictions = predictions[-SMOOTHING_WINDOW:]

        if predictions.count(pred_idx) >= MIN_CONSISTENT:
            if confidence > threshold:
                action = actions[pred_idx]

                if len(sentence) == 0 or action != sentence[-1]:
                    sentence.append(action)

                predicted_action = action

        sentence[:] = sentence[-5:]

    return {
        "prediction": predicted_action,
        "confidence": confidence,
        "sentence": sentence
    }
