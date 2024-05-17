// what parts of speech should we use?
const posTags = ["NN", "NNS", "NNP", "JJ"]; // nouns, adjectives

// what's the API route?
const aicURLRoot = "https://api.artic.edu/api/v1/artworks/search?q=";
const aicURLParams = "&query[term][is_public_domain]=true&size=1&fields=id,title,image_id,artist_display,thumbnail.width,thumbnail.height";

// Function to fetch and parse VTT file
async function loadVTT(url) {
  try {
    const response = await fetch(url);
    const vttText = await response.text();
    const jsonLyrics = parseVTT(vttText);
    // now get parts of speech
    jsonLyrics.forEach(cue => {
      // get relevant words and add to JSON
      var words = new Lexer().lex(cue.text);
      var taggedWords = new POSTagger().tag(words);
      for (i in taggedWords) {
        var taggedWord = taggedWords[i];
        var word = taggedWord[0];
        var tag = taggedWord[1];
        if (posTags.includes(tag)) {
          if ('words' in cue) {
            cue.words.push(word);
          } else {
            cue['words'] = [word];
          }
        }
      }

      // get a relevant image if possible
      // console.log(cue.words);
      if ('words' in cue) {

        cue.words.forEach(async word => {
          // console.log("# looking for images with " + word);

          imageData = await getImage(word);
          if (imageData) {
            cue.image = imageData;
          }
        });
      }
      // console.log(jsonLyrics);
      //document.getElementById('output').textContent = JSON.stringify(jsonLyrics, null, 2);
    });
    console.log(jsonLyrics);
    return jsonLyrics;

  } catch (error) {
    // console.error('Error loading VTT file:', error);
  }
}

async function getImage(word) {
  aicURL = aicURLRoot + word + aicURLParams;
  const response = await fetch(aicURL);
  const artText = await response.json();
  if ('data' in artText) {
    return artText.data[0];
  }
}

// Function to parse VTT file content
function parseVTT(data) {
  const cues = [];
  const lines = data.split('\n').map(line => line.trim());
  let cue = {};

  lines.forEach(line => {
    if (line.includes('-->')) {
      const [start, end] = line.split('-->');
      cue = { start: start.trim(), end: end.trim(), text: '' };
    } else if (line) {
      if (cue.text) {
        cue.text += ' ' + line;
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
