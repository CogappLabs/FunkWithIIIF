/**
 * Add an image to the visualizer
 * @param {Object} image - The image object from the API
 * @param {HTMLAudioElement} audioElement - The audio element to sync the image with
 * @returns {void}
 */
function addImage(image, audioElement) {
  const container = document.querySelector('.visualizer');
  const img = document.createElement('img');
  img.src = `https://www.artic.edu/iiif/2/${image.image_id}/full/!600,600/0/default.jpg`;
  img.className = 'throbbing';
  
  // Random position within the container
  const containerRect = container.getBoundingClientRect();
  const maxX = containerRect.width - 600;
  const maxY = containerRect.height - 400;
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  img.style.left = `${randomX}px`;
  img.style.top = `${randomY}px`;

  const tempo = parseFloat(audioElement.dataset.tempo) || 100;
  const currentTimeInMs = audioElement.currentTime * 1000;
  const beatDurationInMs = (60 / tempo) * 1000;
  const offset =  parseFloat(audioElement.dataset.beatOffset) || 0;

  const keyframes = [
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' },
    { transform: 'scale(1.2)' },
  ];

  const options = {
    duration: beatDurationInMs,
    fill: 'forwards',
    iterations: Infinity,
  };

  const animation = img.animate(keyframes, options);

  // Pause the animation immediately after creation
  animation.pause();

  // Set animation start time to match the next beat
  const beatsPast = Math.floor(currentTimeInMs / beatDurationInMs);
  console.log('Time past (ms):', currentTimeInMs, 'Beat duration (ms):', beatDurationInMs, 'Beats past:', beatsPast);
  const nextBeatTime = offset + (beatsPast + 1) * beatDurationInMs;
  const timeToNextBeat = nextBeatTime - currentTimeInMs;
  animation.startTime = document.timeline.currentTime + timeToNextBeat;
  console.log('Current timeline time:', document.timeline.currentTime, 'Animation start time:', animation.startTime);

  // append the image in timeToNextBeat ms
  setTimeout(() => {
    container.appendChild(img);
  }, timeToNextBeat);
}
