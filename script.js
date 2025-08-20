// ==========================
// SONG LIST
// ==========================
const songs = [
  { title: "Song 1", src: "songs/song1.mp3", cover: "covers/cover1.jpg" },
  { title: "Song 2", src: "songs/song2.mp3", cover: "covers/cover2.jpg" },
  { title: "Song 3", src: "songs/song3.mp3", cover: "covers/cover3.jpg" },
  { title: "Song 4", src: "songs/song4.mp3", cover: "covers/cover4.jpg" },
  { title: "Song 5", src: "songs/song5.mp3", cover: "covers/cover5.jpg" },
  { title: "Song 6", src: "songs/song6.mp3", cover: "covers/cover6.jpg" },
  { title: "Song 7", src: "songs/song7.mp3", cover: "covers/cover7.jpg" },
  { title: "Song 8", src: "songs/song8.mp3", cover: "covers/cover8.jpg" },
  { title: "Song 9", src: "songs/song9.mp3", cover: "covers/cover9.jpg" },
  { title: "Song 10", src: "songs/song10.mp3", cover: "covers/cover10.jpg" },
   { title: "Song 11", src: "songs/song11.mp3", cover: "covers/cover11.jpg" },
   { title: "Song 12", src: "songs/song12.mp3", cover: "covers/cover12.jpg" },
   { title: "Song 13", src: "songs/song13.mp3", cover: "covers/cover13.jpg" },
   { title: "Song 14", src: "songs/song14.mp3", cover: "covers/cover14.jpg" },
   { title: "Song 15", src: "songs/song15.mp3", cover: "covers/cover15.jpg" },
   { title: "Song 16", src: "songs/song16.mp3", cover: "covers/cover16.jpg" },
   { title: "Song 17", src: "songs/song17.mp3", cover: "covers/cover17.jpg" },
   { title: "Song 18", src: "songs/song18.mp3", cover: "covers/cover18.jpg" },
 
];

// ==========================
// GLOBALS
// ==========================
let currentSong = 0;
let isLooping = false;

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const progress = document.getElementById("progress");

// Base URL for absolute artwork paths
const baseURL = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "/");

// ==========================
// LOAD SONG
// ==========================
function loadSong(song) {
  title.textContent = song.title;
  audio.src = song.src;

  // ✅ Convert relative cover to absolute URL
  const coverURL = song.cover.startsWith("http") ? song.cover : baseURL + song.cover;
  cover.src = coverURL;

  updateMediaSession(song.title, coverURL);
}

// ==========================
// CONTROLS
// ==========================
document.getElementById("play").addEventListener("click", () => audio.play());
document.getElementById("pause").addEventListener("click", () => audio.pause());
document.getElementById("next").addEventListener("click", nextSong);
document.getElementById("prev").addEventListener("click", prevSong);

// Repeat button
const repeatBtn = document.createElement("button");
repeatBtn.textContent = "🔁";
repeatBtn.style.marginTop = "10px";
document.querySelector(".controls").appendChild(repeatBtn);

repeatBtn.addEventListener("click", () => {
  isLooping = !isLooping;
  repeatBtn.style.background = isLooping ? "#4caf50" : "#ff69b4"; // green when active
});

// ==========================
// PROGRESS BAR
// ==========================
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;

    // ✅ Sync with lock screen seek bar
    if ("setPositionState" in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate,
        position: audio.currentTime,
      });
    }
  }
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// ==========================
// AUTOPLAY / LOOP
// ==========================
audio.addEventListener("ended", () => {
  if (isLooping) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextSong();
  }
});

// ==========================
// SONG SWITCHING
// ==========================
function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(songs[currentSong]);
  audio.play();
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(songs[currentSong]);
  audio.play();
}

// ==========================
// MEDIA SESSION API
// ==========================
function updateMediaSession(songTitle, coverURL) {
  if ("mediaSession" in navigator) {
    // ✅ Reset metadata to force refresh (important for Android/iOS)
    navigator.mediaSession.metadata = null;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: songTitle,
      artist: "PookieRhythms",
      artwork: [
        { src: coverURL, sizes: "512x512", type: "image/jpg" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => audio.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.pause());
    navigator.mediaSession.setActionHandler("previoustrack", prevSong);
    navigator.mediaSession.setActionHandler("nexttrack", nextSong);

    // Seek handlers
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.fastSeek && "fastSeek" in audio) {
        audio.fastSeek(details.seekTime);
      } else {
        audio.currentTime = details.seekTime;
      }
    });
    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      audio.currentTime = Math.max(audio.currentTime - (details.seekOffset || 10), 0);
    });
    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      audio.currentTime = Math.min(audio.currentTime + (details.seekOffset || 10), audio.duration);
    });
  }
}

// ==========================
// INIT
// ==========================
loadSong(songs[currentSong]);
