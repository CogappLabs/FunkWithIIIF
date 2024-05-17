/* script.js */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector(".visualizer");
  const imageSources = [
    'https://www.artic.edu/iiif/2/e8e67721-bbb1-d007-82bd-c430ea73db70/full/843,/0/default.jpg',
  ]; // Add more image URLs if needed

  function addImage(src) {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'throbbing';

    // Random position within the container
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - 600;
    const maxY = containerRect.height - 400;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    img.style.left = `${randomX}px`;
    img.style.top = `${randomY}px`;

    container.appendChild(img);
  }

  // Add a new image every second
  setInterval(() => {
    const randomImage = imageSources[Math.floor(Math.random() * imageSources.length)];
    addImage(randomImage);
  }, 2000);
});
