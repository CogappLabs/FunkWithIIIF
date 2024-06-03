const musicEmojis = [
  "🎵",
  "🎤",
  "🎸",
  "🥁",
];

export function getRandomMusicEmojis() {
  const emojis = [...musicEmojis];
  const selectedEmojis = [];

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    selectedEmojis.push(emojis[randomIndex]);
    // Remove the selected emoji to avoid duplicates
    emojis.splice(randomIndex, 1);
  }

  return selectedEmojis;
}

