# import tensorflow as tf
#
# # Load legacy Keras model (THIS WILL WORK ONLY IN TF 2.12)
# model = tf.keras.models.load_model("action.h5")
#
# # Convert to TFLite
# converter = tf.lite.TFLiteConverter.from_keras_model(model)
#
# # Required for LSTM models
# converter.target_spec.supported_ops = [
#     tf.lite.OpsSet.TFLITE_BUILTINS,
#     tf.lite.OpsSet.SELECT_TF_OPS,
# ]
#
# converter.optimizations = [tf.lite.Optimize.DEFAULT]
#
# tflite_model = converter.convert()
#
# with open("action.tflite", "wb") as f:
#     f.write(tflite_model)
#
# print("✅ action.tflite created successfully")


#
# import os
# # Force TensorFlow to use the legacy Keras interface
# os.environ["TF_USE_LEGACY_KERAS"] = "1"
#
# import tensorflow as tf
# import tf_keras
#
# # Load legacy model using tf_keras instead of tf.keras
# model = tf_keras.models.load_model("action.h5")
#
# # Convert to TFLite
# # Note: We pass the model loaded via tf_keras directly
# converter = tf.lite.TFLiteConverter.from_keras_model(model)
#
# converter.target_spec.supported_ops = [
#     tf.lite.OpsSet.TFLITE_BUILTINS,
#     tf.lite.OpsSet.SELECT_TF_OPS,
# ]
#
# converter.optimizations = [tf.lite.Optimize.DEFAULT]
#
# tflite_model = converter.convert()
#
# with open("action.tflite", "wb") as f:
#     f.write(tflite_model)
#
# print("✅ action.tflite created successfully")

import tensorflow as tf

# Load the model (Standard Keras load)
model = tf.keras.models.load_model("action.h5")

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# Required for LSTM models (Select TF Ops)
converter.target_spec.supported_ops = [
    tf.lite.OpsSet.TFLITE_BUILTINS,
    tf.lite.OpsSet.SELECT_TF_OPS,
]

converter.optimizations = [tf.lite.Optimize.DEFAULT]

tflite_model = converter.convert()

with open("action.tflite", "wb") as f:
    f.write(tflite_model)

print("✅ action.tflite created successfully")