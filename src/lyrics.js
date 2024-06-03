import posTagger from 'wink-pos-tagger';
import vttText from './iiif.vtt?raw';
const wink = posTagger();

// what parts of speech should we use?
const posTags = ["NN", "NNS", "NNP", "JJ"]; // nouns, adjectives

// what's the API route?
const aicURLRoot = "https://api.artic.edu/api/v1/artworks/search?q=";
const aicURLParams =
  "&query[term][is_public_domain]=true&size=1&fields=id,title,image_id,artist_display,thumbnail.width,thumbnail.height";

// Function to fetch and parse VTT file
export async function loadVTT(url) {
  try {
    // const response = await fetch(url);
    // const vttText = await response.text();
    const jsonLyrics = parseVTT(vttText);
    // now get parts of speech
    jsonLyrics.forEach((cue) => {
      // get relevant words and add to JSON
      const taggedWords = wink.tagSentence(cue.text);
      cue.words = cue.words || [];
      cue.words.push(
        ...taggedWords.filter((word) => posTags.includes(word.pos))
      );

      // get a relevant image if possible
      if (cue.words) {
        cue.images = [];
        cue.words.forEach(async (word) => {
          const imageData = await getImage(word.value);
          if (imageData) {
            cue.images.push({ word, image: imageData });
            cue.image = imageData;
          }
        })
        cue.formattedText = highlightWords(cue.text, cue.words.map(word => word.value));
      }

    });
    console.log(jsonLyrics);
    return jsonLyrics;
  } catch (error) {
    console.error("Error loading VTT file:", error);
  }
}

async function getImage(word) {
  const aicURL = aicURLRoot + word + aicURLParams;
  const response = await fetch(aicURL);
  const artText = await response.json();
  if ("data" in artText) {
    return artText.data[0];
  }
}

// Function to parse VTT file content
function parseVTT(data) {
  const cues = [];
  const lines = data.split("\n").map((line) => line.trim());
  let cue = {};

  lines.forEach((line) => {
    if (line.includes("-->")) {
      const [start, end] = line.split("-->");
      cue = { start: start.trim(), end: end.trim(), text: "" };
    } else if (line) {
      if (cue.text) {
        cue.text += " " + line;
      } else {
        cue.text = line;
      }
    } else if (cue.start) {
      cues.push(cue);
      cue = {};
    }
  });

  if (cue.start) {
    cues.push(cue);
  }

  return cues;
}

function highlightWords(text, words) {
  const wordSet = new Set(words);
  return text
    .split(" ")
    .map((word) => {
      return wordSet.has(word)
        ? `<span class="highlighted">${word}</span>`
        : word;
    })
    .join(" ");
}
