# Overview
<img width=700 src="https://github.com/Hermitter/matrix-google-cloud-next-18-demo/blob/master/dashboard_example.png?raw=true">

This repository is only meant to be used as a reference for the code written in this demo. Below, I will go over what each folder/file does and the general requirements for this setup. This demo enables you to control the MATRIX Creator and a robot arm through the use of Google Assistant and the MATRIX Dashboard.

Tweet & video from @ArmEmbedded: https://twitter.com/ArmEmbedded/status/1021929298985410562/video/1


## [demo_start.sh](https://github.com/Hermitter/matrix-google-cloud-next-18-demo/blob/master/demo_start.sh)
Calling this file in your Raspberry Pi's `etc/rc.local` file as `demo_start.sh &` will, on boot, start MATRIX CORE, MATRIX OS, and Google Assistant.

## [mos_app](https://github.com/Hermitter/matrix-google-cloud-next-18-demo/tree/master/mos_core_libs)
Here is where the MATRIX OS app for this project is located. This app controls all the MATRIX function being called through the [MATRIX Dashboard](dash.matrix.one) and Google Assistant. Note that you will need to edit app.js to point to your Heroku App.

## [mos_core_libs](https://github.com/Hermitter/matrix-google-cloud-next-18-demo/tree/master/mos_app)
Due to MATRIX OS, and MATRIX CORE being separate development layers, the servo and Zigbee implementations are added here as libraries written in MATRIX CORE.

Use `npm install` inside this folder to download the dependencies.

## [heroku_dyno](heroku_dyno)
The code for the Heroku app is written here. This acts as a middle man to catch Google Assistant requests and send them to the MATRIX OS app. The main benefit of using Heroku was being able to borrow the SSL certificate that Google requires for receiving  Google Assistant requests.


# Setup

## Google Assistant
Although not needed, this demo can work with any Google Assistant device. However, setting it up is ideal. The following link is a step by step guide on achieving this.

https://www.hackster.io/matrix-labs/matrix-voice-and-matrix-creator-running-google-assistant-e9751e

## MATRIX OS
Installing and setting up MATRIX OS is required. The link below will direct you to the getting started guide.

https://matrix-io.github.io/matrix-documentation/matrix-os/getting-started/

## MATRIX CORE
MATRIX CORE installation and Javascript setup will be required in order to use the servo and Zigbee implementations. Below is the link to the getting started page. Keep in mind that some of MATRIX CORE files were calibrated to better support the servos in this demo. Note that the [registerZigbee.js](https://github.com/Hermitter/matrix-google-cloud-next-18-demo/blob/master/mos_core_libs/registerZigbee.js) file must be called seperatly in order for you to register any Zigbee device. Only do this once for when you want to register your Zigbee device.

https://matrix-io.github.io/matrix-documentation/matrix-core/getting-started/

## Heroku App
Creating a Heroku app is optional if you have another form of using an SSL certificate approved by Google. However, can create a free account and app with Heroku.

https://www.heroku.com/

## Actions On Google
Creating your own Google Actions is required for creating the custom commands used by this demo. I won't go over all the steps required here, but keep in mind you'll need the following.
- Intents 
    - The fulfillment in your intents must be "Enable webhook call for this intent."
- Entities
    - You will be required to create custom words to use for your intents.
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
