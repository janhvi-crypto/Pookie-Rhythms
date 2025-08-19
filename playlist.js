// === Song List ===
// 18 songs, all mp4 format, stored in /songs/
// Covers stored in /covers/, or you can just use one default cover
const songs = [];

for (let i = 1; i <= 18; i++) {
  songs.push({
    title: `Song ${i}`,
    file: `songs/song${i}.mp4`,
    cover: `covers/cover${i}.jpg` // or "covers/default.jpg" if same for all
  });
}

let currentSongIndex = 0;
let isPlaying = false;
let isRepeat = false;

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const repeatBtn = document.getElementById("repeatBtn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist-items");

// === Load Song ===
function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  cover.src = song.cover;
  audio.src = song.file;

  // Highlight active playlist item
  document.querySelectorAll("#playlist li").forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });
}

// === Play / Pause ===
function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.textContent = "⏸️";
}
function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.textContent = "▶️";
}
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

// === Next / Prev ===
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});
prevBtn.addEventListener("click", () => {
  currentSongIndex =
    (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

// === Repeat Toggle ===
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "#1db954" : "white";
});
audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSong();
  } else {
    nextBtn.click();
  }
});

// === Progress Bar ===
audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  if (!isNaN(duration)) {
    progress.value = (currentTime / duration) * 100;
  }

  let curMin = Math.floor(currentTime / 60) || 0;
  let curSec = Math.floor(currentTime % 60) || 0;
  let durMin = Math.floor(duration / 60) || 0;
  let durSec = Math.floor(duration % 60) || 0;

  currentTimeEl.textContent = `${curMin}:${curSec.toString().padStart(2, "0")}`;
  durationEl.textContent = `${durMin}:${durSec.toString().padStart(2, "0")}`;
});

// Seek
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// === Build Playlist ===
songs.forEach((song, index) => {
  const li = document.createElement("li");
  li.textContent = song.title;
  li.addEventListener("click", () => {
    currentSongIndex = index;
    loadSong(index);
    playSong();
  });
  playlistEl.appendChild(li);
});

// === Init ===
loadSong(currentSongIndex);
