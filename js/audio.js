// Sets up the audio player
var audioCtx, audioElement, source, analyser, dataArray;

function formatTime(seconds) {
  var hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  var minutes = Math.floor(seconds / 60);
  var secs = Math.floor(seconds % 60);
  var milliseconds = Math.floor((seconds % 1) * 1000);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (secs < 10) {
    secs = "0" + secs;
  }
  if (milliseconds < 100) {
    if (milliseconds < 10) {
      milliseconds = "00" + milliseconds;
    } else {
      milliseconds = "0" + milliseconds;
    }
  }

  return hours + ":" + minutes + ":" + secs + "." + milliseconds;
}

function initAudioContext(audioElement) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  var bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // Create a MediaElementAudioSourceNode from the audio element
  source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  getAmplitudeData();
}

function getAmplitudeData() {
  requestAnimationFrame(getAmplitudeData);
  analyser.getByteTimeDomainData(dataArray);
  console.log(dataArray);
}
