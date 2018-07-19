# matrix-google-cloud-next-demo
MATRIX Labs demo for the Google Cloud Next ’18 Conference

# Overview
This repository is only meant to be used as a reference for the code written in this demo. Below, I will go over what each folder/file does and the general requirements for this setup.

## demo_start.sh
Calling this folder in your Raspberry Pi's `etc/rc.local` file as `demo_start.sh &` will, on boot, start MATRIX CORE, MATRIX OS, and Google Assistant.

## mos_app
Here is where the MATRIX OS app for this project is located. This app controls all the MATRIX function being called through the [MATRIX Dashboard](dash.matrix.one) and Google Assistant. Note that you will need to edit app.js to point to your Heroku App.

## mos_core_libs
Due to MATRIX OS, and MATRIX CORE being separate development layers, the servo and Zigbee implementations are added here as libraries written in MATRIX CORE.

Use `npm install` inside this folder to download the dependencies.

## heroku_dyno
The code for the Heroku app is written here. This acts as a middle man to catch Google Assistant requests and send them to the MATRIX OS app. The main benefit of using Heroku was being able to borrow the SSL certificate that Google requires for receiving  Google Assistant requests.


# Setup

## Google Assistant
Although not needed, this demo can work with any Google Assistant device. However, setting it up is ideal. The following link is a step by step guide on achieving this.

https://www.hackster.io/matrix-labs/matrix-voice-and-matrix-creator-running-google-assistant-e9751e

## MATRIX OS
Installing and setting up MATRIX OS is required. The link below will direct you to the getting started guide.

https://matrix-io.github.io/matrix-documentation/matrix-os/getting-started/

## MATRIX CORE
MATRIX CORE installation and Javascript setup will be required in order to use the servo and Zigbee implementations. Below is the link to the getting started page. Keep in mind that some of MATRIX CORE files were calibrated to better support the servos in this demo.

https://matrix-io.github.io/matrix-documentation/matrix-core/getting-started/

## Heroku App
Creating a Heroku app is optional if you have another form of using an SSL certificate approved by Google. However, can create a free account and app with Heroku.

https://www.heroku.com/

## Actions On Google
Creating your own Google Actions is required for creating the custom commands used by this demo. I won't go over all the steps required here, but keep in mind you'll need the following.
- Intents 
    - The fulfillment in your intents must be "Enable webhook call for this intent."
- Entities
    - You will be required
- Fulfillment
    - Enable Webhook
    - Have the URL pointed to your Heroku app. (example link: https://YOUR_APP.herokuapp.com/matrix)

## Robot Arm
The robot arm used in this demo was built using the following materials:
- Servos:
    - Screws: https://www.amazon.com/gp/product/B00NOGMK3M/ref=oh_aui_detailpage_o09_s00?ie=UTF8&psc=1
    - 2 Strong servos: https://www.amazon.com/gp/product/B073F92G2S/ref=oh_aui_detailpage_o06_s00?ie=UTF8&psc=1
    - 4 Weak servos: https://www.amazon.com/gp/product/B01GNOHB58/ref=oh_aui_detailpage_o05_s00?ie=UTF8&psc=1
    - Arm Frame: https://www.amazon.com/gp/product/B01LVVEP8K/ref=oh_aui_detailpage_o05_s01?ie=UTF8&psc=1
