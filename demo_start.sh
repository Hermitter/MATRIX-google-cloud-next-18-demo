#!/bin/bash
echo "Starting GOOGLE CLOUD Presentation!"
# Expose MATRIX OS device credentials
export MATRIX_DEVICE_ID=dc7a1a71be2d
export MATRIX_DEVICE_SECRET=08629018e9d77h15i5n0t4r3alz0f06cd4f7e5544272b
sleep 5
# Force start MATRIX CORE
malos &
sleep 10
echo "Starting Google Assistant"
# Set output volume to 100%
amixer set PCM 100%
# Start Google Assistant
su -c "/home/pi/google-assistant-matrixio/google-matrixio-assistant-hotword --project_id google-assistant-4201d --device_model_id google-assistant &" - pi
sleep 10
# Start MATRIX OS
echo "Starting MOS"
/home/pi/.nvm/versions/node/v8.6.0/bin/node /home/pi/matrix-os/index.js