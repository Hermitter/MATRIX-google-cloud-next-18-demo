//////////////////////////////////////////////////////////////////////////////////////////
// INITIAL VARIABLES \\
var socket = require('socket.io-client')('https://YOUR_DYNO.herokuapp.com');
var servoControl = require('/home/pi/mos_core_libs/servo.js');
var zigbeeSimple = require('/home/pi/mos_core_libs/toggleZigbee.js');
// Dashboard RGB colors
var deviceColors = {
  red: 0,
  green: 0,
  blue: 0
}
// Arm use statuses
var armInUse = false;
var lastArmAction = 'none'

//////////////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS \\
// - Set MATRIX LED colors and update dashboard
function handleNewColor(color, colorIsNamed=false){
  // If color is by name
  if(colorIsNamed){
    matrix.led(color).render();// Update LEDs
    //Update dashboard
    matrix.type('color').send({
      'colorText': color// Send LED string
    });  
  }
  // Else color is rgb
  else{
    matrix.led('rgb('+color.red+','+color.green+','+color.blue+')').render();// Update LEDs
    //Update dashboard
    matrix.type('color').send({
      'colorText': 'rgb('+color.red+','+color.green+','+color.blue+')'// Send LED string
    });
  }
}

// - Set Event Listerners for MATRIX RGB colors
function colorSetEvent(colorName){
  matrix.on(colorName+'Input', function(payload){
    console.log(payload);
    deviceColors[colorName] = payload.value;
    handleNewColor(deviceColors)
  });
}

// Servo dashboard sliders
matrix.on('servo0', function(payload){servoControl.set(1, payload.value);});
matrix.on('servo1', function(payload){servoControl.set(3, payload.value);});
matrix.on('servo2', function(payload){servoControl.set(5, payload.value);});
matrix.on('servo3', function(payload){servoControl.set(7, payload.value);});
matrix.on('servo4', function(payload){servoControl.set(9, payload.value);});
matrix.on('servo5', function(payload){servoControl.set(11, payload.value);});

// Pick up & turn on zigbee
matrix.on('useZigbee', function(payload){
  // If Zigbee bulb isn't picked up & arm isn't in use
  if(lastArmAction !== 'useZigbee' && !armInUse){
    armInUse = true;// Update boolean
    // Pick up & turn on Zigbee bulb
    servoControl.useZigbee(function(){
      lastArmAction = 'useZigbee';// Update boolean
      armInUse = false;// Update boolean
    }, zigbeeSimple.lightsOn);
  }
});
// Drop off & turn off zigbee
matrix.on('removeZigbee', function(payload){
  // If Zigbee bulb is picked up & arm isn't in use
  if(lastArmAction !== 'removeZigbee' && !armInUse){
    armInUse = true;// Update boolean
    // Put down Zigbee bulb
    servoControl.removeZigbee(function(){
      zigbeeSimple.lightsOff();// Turn Zigbee on
      lastArmAction = 'removeZigbee';// Update boolean
      armInUse = false;// Update boolean
    });
  }
});
// Toggle Zigbee bulb
matrix.on('toggleZigbee', function(payload){
  zigbeeSimple.lightsToggle();
});

//////////////////////////////////////////////////////////////////////////////////////////
// MATRIX CREATOR \\
// Begin calling temperature sensor
matrix.sensor('temperature', {refresh: 4000, timeout: 10000}).then(data => {
  temperatureValue = data.value; // update global variable
  console.log(temperatureValue); // print new temperature value
});

// Listening for dashboard color slider events
for(var color in deviceColors){
  colorSetEvent(color);
}

//////////////////////////////////////////////////////////////////////////////////////////
// SOCKET.IO \\
// On connected to server
socket.on('connect', function(){
    console.log("connected");
    socket.emit('testSocket');
});
// On luxo command
socket.on('luxo', function(command){
  // If Luxo animation should start
  if(command === 'on'){
    matrix.led('green').render();
    matrix.emit('useZigbee');
  }
  // If Luxo animation should reset
  else if(command === 'off'){
    matrix.led('red').render();
    matrix.emit('removeZigbee');
  }
});
// On Zigbee command
socket.on('zigbee', function(command){
  if(command === 'toggle'){
    console.log('Middleman send Zigbee toggle event')
    zigbeeSimple.lightsToggle();
  }
  else if(command === 'on')
    zigbeeSimple.lightsOn();
  else if(command === 'off')
    zigbeeSimple.lightsOff();
});
// On color command
socket.on('color', function(color){
    console.log("Setting New Color!");
    // Wait 1 second
    setTimeout(function(){
      handleNewColor(color, true)// Update MATRIX LEDs
    },1000);
});
// On connection lost
socket.on('disconnect', function(){
    console.log("lost connection")
});