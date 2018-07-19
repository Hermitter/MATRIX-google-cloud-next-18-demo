//////////////////////////////////////////////////////////////////////////////////////////
// INITIAL VARIABLES \\
var events = require('events');// Events module
var googleActions = new events.EventEmitter();// Event emitter for google actions
const bodyParser = require('body-parser');// middleware for handling url encoded bodies
const express = require('express');// Web framework
const webApp = express();// Create express app
var server = require('http').Server(webApp);// Create web server
webApp.use(bodyParser.urlencoded({ extended: true }));// Handle urlencoded extended bodies
webApp.use(bodyParser.json());// Handle json encoded bodies
var io = require('socket.io')(server);// Bind socket.io to web server
const { dialogflow } = require('actions-on-google');// Use google dialog flow
const googleApp = dialogflow();// Define dialogflow middleware
// Hold MATRIX temperature value
// var sensors = {
//     temperature: undefined
// };

//////////////////////////////////////////////////////////////////////////////////////////
// GOOGLE ACTIONS \\
// - Set Servo Position/Animation
googleApp.intent('set luxo', (conv, params) => {
    console.log(params);
    conv.close('Obtained luxo intent');
    io.sockets.emit('luxo', params.luxoCommand);
});
// - Set Zigbee Lights
googleApp.intent('set zigbee', (conv, params) => {
    console.log(params);
    conv.close('Obtained zigbee intent');
    io.sockets.emit('zigbee', params.zigbeeCommand);
});
// - Set MATRIX LEDS
googleApp.intent('set leds', (conv, params) => {
    console.log(params);
    conv.close('Everloop is now ' + params.color + '.');
    io.sockets.emit('color', params.color);
});

// Temperature Request
// // - Request MATRIX Temperature
// googleApp.intent('request temperature', (conv, params) => {
//     // Return as promise to wait for data
//     return new Promise( ( resolve, reject ) => {
//         console.log('temperature intent was called.');
//         // Request temperature from MATRIX
//         io.sockets.emit('request temperature');
//         // On temperature received
//         googleActions.on('temperature result', (data) => {
//             console.log('temperature was sent to googleActions eventEmitter');
//             // Update temperature
//             console.log(data);
//             console.log(data*10);
//             sensors.temperature = Math.trunc(data*10);
//             // Remove temperature event listener
//             googleActions.removeAllListeners('temperature result')
//             // If temperature value was obtained
//             if(sensors.temperature !== undefined){
//                 console.log('temperature value is valid');
//                 conv.close('The current temperature is ' + sensors.temperature + ' degrees Celsius.');
//                 resolve();
//             }
//             // Else report connection issue with MATRIX Creator
//             else{
//                 console.log('temperature value is valid');
//                 conv.close('Could not connect to MATRIX Creator.');
//                 reject();
//             }
//         });
//     });
// });

//////////////////////////////////////////////////////////////////////////////////////////
// EXPRESS \\
// Show hello world in webpage root
webApp.get('/', (req, res) => {
    res.send('Hello World!');
});
// Use dialogflow middleware for /matrix
webApp.use('/matrix', googleApp);

// Start web server
console.log('Server Running!');
server.listen(process.env.PORT,process.env.IP);

//////////////////////////////////////////////////////////////////////////////////////////
// SOCKET.IO \\
io.on('connection', (socket) => {
    console.log('\nClient Has Connected!\n');

    // - Test ping
    socket.on('testSocket', () => {
        console.log('\nInitial Ping Received From Client!\n');
    });

    // - Obtained MATRIX Temperature
    // socket.on('temperature', (temperature) => {
    //     console.log('Obtained result from matrix temperature');
    //     googleActions.emit('temperature result', temperature);
    // });
});