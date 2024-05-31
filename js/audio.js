import { guess } from 'web-audio-beat-detector';

// An Audio Context must be created after a user gesture on the page
const readyButton = document.querySelector('#play-button');

readyButton.addEventListener('click', () => {
  // Hide the button
  readyButton.style.display = 'none';
  // Step 1: Create an Audio Context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Step 2: Get the audio element
  const audioElement = document.querySelector('audio');

  // Step 3: Create a MediaElementSource node
  // const sourceNode = audioContext.createMediaElementSource(audioElement);

  // Step 4: Fetch the audio file as an ArrayBuffer
  fetch(audioElement.src)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      // Step 5: Decode the audio data into an AudioBuffer
      return audioContext.decodeAudioData(arrayBuffer);
    })
    .then(audioBuffer => {
      // Step 6: Use the AudioBuffer as needed
      console.log('AudioBuffer:', audioBuffer);

      guess(audioBuffer)
        .then(({ bpm, offset, tempo }) => {
          console.log({ 
            'BPM': bpm,
            'Offset': offset,
            'Tempo': tempo,
            'Beat duration': 60 / tempo + 's'
          })

          audioElement.dataset.tempo = tempo;
          audioElement.dataset.beatOffset = offset * 1000;

          audioElement.play();
        })
        .catch((err) => {
            // something went wrong
            console.error('Error analyzing audio buffer:', error);
        });
    })
    .catch(error => {
      console.error('Error decoding audio data:', error);
    });

});