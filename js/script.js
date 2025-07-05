// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

const gallery = document.getElementById("gallery");
const getImagesBtn = document.getElementById("getImagesBtn");

// Random Space Fact LevelUp
const spaceFacts = [
  "Did you know? Jupiter’s Great Red Spot is a giant storm bigger than Earth!",
  "Did you know? A day on Venus is longer than a year on Venus.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Neutron stars can spin 600 times per second.",
  "Did you know? NASA’s Voyager 1 is the farthest human-made object from Earth."
];

function displayRandomFact() {
  const factElement = document.getElementById("spaceFact");
  const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  factElement.textContent = randomFact;
}
// Call once when the page loads
displayRandomFact();

getImagesBtn.addEventListener("click", async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;
  gallery.innerHTML = "";
  gallery.innerHTML = `<div class="placeholder"><p>🔄 Loading space photos…</p></div>`;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateArray = [];

  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    dateArray.push(new Date(dt).toISOString().split('T')[0]);
  }

  gallery.innerHTML = ""; // Clear loading message once data starts

  for (let date of dateArray) {
    try {
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=bF0cdgSW7PRoUwtPe0Qd1LVKNm6QpRdv4aIdKrnU&date=${date}`);
      const data = await response.json();
      if (data.media_type === "image") {
        gallery.innerHTML += `
          <div class="gallery-item" onclick="openModal('${data.hdurl}', '${data.title}', '${data.date}', \`${data.explanation}\`)">
            <img src="${data.url}" alt="${data.title}">
            <h3>${data.title}</h3>
            <p>${data.date}</p>
          </div>`;
      } else if (data.media_type === "video") {
        gallery.innerHTML += `
          <div class="gallery-item" onclick="openModal('${data.url}', '${data.title}', '${data.date}', \`${data.explanation}\`)">
            <div class="placeholder-icon">🎥</div>
            <h3>${data.title}</h3>
            <p>${data.date}</p>
          </div>`;
      }
    } catch (error) {
      console.error("Failed to fetch APOD:", error);
    }
  }
});

// Modal functions
function openModal(mediaUrl, title, date, explanation) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");

  modalContent.innerHTML = mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be")
    ? `<iframe src="${mediaUrl}" frameborder="0" allowfullscreen></iframe>`
    : `<img src="${mediaUrl}" alt="${title}">`;

  modalContent.innerHTML += `
    <h2>${title}</h2>
    <h4>${date}</h4>
    <p>${explanation}</p>`;

  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
