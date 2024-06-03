import "../styles.css";
import { loadVTT } from "./lyrics";
import { addImage } from "./images";
import { initFunkyIIIF } from './audio';
import { getRandomMusicEmojis } from './emoji';

// Parse timecode to seconds
function parseTimecode(timecode) {
	var parts = timecode.split(":");
	var hours = parseInt(parts[0]);
	var minutes = parseInt(parts[1]);
	var seconds = parseFloat(parts[2]);
	return hours * 3600 + minutes * 60 + seconds;
}

// Init the audio player.
document.addEventListener("DOMContentLoaded", async (event) => {
	// lyrics data.
	const lyricsData = await loadVTT("/iiif.vtt");

	const audioElement = document.querySelector(".audio-player");
	const lyricsContainer = document.querySelector(".lyrics");
	const imageContainer = document.querySelector(".visualizer");

	/**
	 * karaoke style lyrics display.
	 * also loads in an image based on the lyrics.
	 */

	// Convert start and end times to seconds
	lyricsData.forEach((cue) => {
		cue.start = parseTimecode(cue.start);
		cue.end = parseTimecode(cue.end);
	});

	const currentTime = audioElement.currentTime;
	let currentCueIndex = -1;

	console.log(currentTime);
	lyricsContainer.textContent = currentTime;

	// Update lyrics and image based on current playback time
	audioElement.addEventListener("timeupdate", () => {
		const currentTime = audioElement.currentTime;

		for (let i = 0; i < lyricsData.length; i++) {
			let cue = lyricsData[i];
			if (currentTime >= cue.start && currentTime <= cue.end) {
				lyricsContainer.innerHTML = cue.formattedText;
				// Only update the image if the cue has changed to avoid
				// DOSing the API.
				if (currentCueIndex !== i) {
					currentCueIndex = i;
					const cuewordwithimages = cue.images;
					const delayInterval =
						(cue.end - cue.start) / cuewordwithimages.length;

					cuewordwithimages.forEach((word, index) => {
						setTimeout(
							() => {
								addImage(word.image, audioElement);
								console.log(word.word);
							},
							index * delayInterval * 1000,
						);
					});
				}
				break;
			} else {
        const randomEmojis = getRandomMusicEmojis();
        lyricsContainer.textContent = randomEmojis.join(" ");
      }
		}
	});

  // An Audio Context must be created after a user gesture on the page
  const readyButton = document.querySelector("#play-button");
  readyButton.addEventListener("click", () => initFunkyIIIF(readyButton));
});

