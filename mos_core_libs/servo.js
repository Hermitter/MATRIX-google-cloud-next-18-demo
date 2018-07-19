// Set Initial Variables \\
var zmq = require('zeromq');// Asynchronous Messaging Framework
var matrix_io = require('matrix-protos').matrix_io;// Protocol Buffers for MATRIX function
var matrix_ip = '127.0.0.1';// Local IP
var matrix_servo_base_port = 20045;// Port for Servo driver
var pins = [1,3,5,7,9,11];


// BASE PORT \\
// Create a Pusher socket
var configSocket = zmq.socket('push');
// Connect Pusher to Base port
configSocket.connect('tcp://' + matrix_ip + ':' + matrix_servo_base_port);
// Create driver configuration
var config = matrix_io.malos.v1.driver.DriverConfig.create({
  // Create servo configuration
  servo: matrix_io.malos.v1.io.ServoParams.create({
    pin: 0,// Use pin 0
    angle: 0// Set angle 0
  })
});

function setServo(pin, angle){
  // Select servo to use
  config.servo.pin = pin
  // Set servo position as defined
  config.servo.angle = angle;
  // Log angle
  console.log('Pin_' + pin + ' Angle: ' + angle);
  // Send driver configuration
  configSocket.send(matrix_io.malos.v1.driver.DriverConfig.encode(config).finish());
}

// EXPORT FUNCTIONS \\
module.exports = {
  set: function(pin,angle){setServo(pin, angle)},
  useZigbee: function(callback, zigbeeFunction){luxoUpAnimation(callback, zigbeeFunction)},
  removeZigbee: function(callback){luxoDownAnimation(callback)}
}

// FUNCTIONS \\
// - Pointed up like a tree position
function restPosition(callback, adjustForBulb = true){
  // Open claw
  setServo(pins[5], 30);
  setTimeout(function(){
    // Adjust wrist if needed(avoids hitting light bulb)
    if(adjustForBulb){
      setServo(pins[3],40);
    }
    // Lift each servo above pin[1]
    setTimeout(function(){
      // Begin moving to
      setServo(pins[0],108);
      setServo(pins[2],20);
      setServo(pins[4],176);
      // Adjust wrist if needed(avoids hitting light bulb)
      if(adjustForBulb){
        setTimeout(()=>{setServo(pins[3],149);}, 300);
      }
      else{
        setServo(pins[3],149);
      }
      // Lift from base
      setTimeout(function(){
        setServo(pins[1],126);
        // Callback after specified seconds (if defined)
        setTimeout(function(){if(callback){callback()};},1000);
      },500);
    },200);
  },300);
}

// Grab
function grabPosition(callback){
  // Set to grabbing position
  setServo(pins[0],108);
  setServo(pins[1],117);
  setServo(pins[2],164);
  setServo(pins[3],7);
  setServo(pins[4],170);
  // Adjust claw
  setTimeout(function(){setServo(pins[3],98);},1500);//used to be 96
  // Close claw
  setTimeout(function(){setServo(pins[5],76);},2500);
  // Callback after 5 seconds (if defined)
  setTimeout(function(){if(callback){callback()};},4000);
}

// - Luxo animation to show off Zigbee light bulb
function luxoUpAnimation(callback, zigbeeFunction){
  restPosition(function(){
    grabPosition(function(){
      // Lift light bulb
      setServo(pins[0],108);
      setServo(pins[2],114);
      setServo(pins[3],79);
      setTimeout(function(){
        setServo(pins[1],162);
      },500);

      setTimeout(function(){
        // Rotate Head
        setServo(pins[4],80);
        // Turn on Zigbee bulb
        setTimeout(()=>{if(zigbeeFunction){zigbeeFunction()};}, 150);
        // Callback after 5 seconds (if defined)
        setTimeout(function(){if(callback){callback()};},3000);
      },2000);
    });
  }, false);
}

// - Animation to place light bulb on the ground and reset
function luxoDownAnimation(callback){
  // Set to grabbing position
  setServo(pins[2],164);
  setServo(pins[3],7);
  setServo(pins[4],170);
  setTimeout(()=>{
    setServo(pins[0],108);
    setServo(pins[1],126);
  },500);

  // Adjust claw before drop
  setTimeout(function(){setServo(pins[3],66);},1500);
  setTimeout(function(){
    setServo(pins[3],96);
    setServo(pins[4],176);
  },2500);
  // Open claw & drop light bulb
  setTimeout(function(){setServo(pins[5],30);},4000);
  // Callback after 5 seconds (if defined)
  setTimeout(function(){
    restPosition();
    if(callback){callback()};
  },5000);
}