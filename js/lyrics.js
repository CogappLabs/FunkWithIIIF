// what parts of speech should we use?
const posTags = ["NN", "NNS", "NNP", "JJ"]; // nouns, adjectives

// Function to fetch and parse VTT file
async function loadVTT(url) {
    try {
        const response = await fetch(url);
        const vttText = await response.text();
        const jsonLyrics = parseVTT(vttText);
        // now get parts of speech
        jsonLyrics.forEach(cue => {
            console.log(cue.text);
            var words = new Lexer().lex(cue.text);
            var taggedWords = new POSTagger().tag(words);
            var result = "";
            for (i in taggedWords) {
                var taggedWord = taggedWords[i];
                var word = taggedWord[0];
                var tag = taggedWord[1];
                if (posTags.includes(tag)) {
                    console.log(word + " /" + tag);
                    if ('words' in cue) {
                        cue.words.push(word);
                    } else {
                        cue['words'] = [word];
                    }
                }
            }
            document.getElementById('output').textContent = JSON.stringify(jsonLyrics, null, 2);


        });

    } catch (error) {
        console.error('Error loading VTT file:', error);
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
