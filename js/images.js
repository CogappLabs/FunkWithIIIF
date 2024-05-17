function addImage(image) {
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

  container.appendChild(img);
}
