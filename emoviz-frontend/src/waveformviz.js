// var peaksInstance
//       (function(Peaks) {
//         var myAudioContext = new AudioContext();
//         var options = {
//           container: document.getElementById('waveform-container'),
//           mediaElement: document.querySelector('audio'),
//           audioContext: myAudioContext,
//           keyboard: true,
//           pointMarkerColor: '#006eb0',
//           showPlayheadTime: true,
//           segments: [{
//             startTime: 0,
//             endTime: 8,
//             editable: false,
//             color: "#006eb0",
//             labelText: "I just feel life is not the same anymore"
//           },
//           {
//             startTime: 8,
//             endTime: 20,
//             editable: false,
//             color: "#009999",
//             labelText: "but again im an adult and i have to suck it up"
//           }]
//         };
//
//          peaksInstance = Peaks.init(options);
//
//         peaksInstance.on('peaks.ready', function() {
//           console.log('peaks.ready');
//         });
//
//       })(peaks);
