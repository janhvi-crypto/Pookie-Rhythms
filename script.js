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
  { title: "Song 18", src: "songs/song18.mp3", cover: "covers/cover18.jpg" }
];

let currentSong = 0;
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const progress = document.getElementById("progress");

// 🔧 Helper: resize any image to 512x512 for Media Session
async function resizeImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 512, 512);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.src = url;
  });
}

// Load a song
function loadSong(song) {
  title.textContent = song.title;
  audio.src = song.src;
  cover.src = song.cover;
  updateMediaSession(song);
}

// Play / Pause controls
document.getElementById("play").addEventListener("click", () => {
  audio.play();
});

document.getElementById("pause").addEventListener("click", () => {
  audio.pause();
});

// Next / Prev controls
document.getElementById("next").addEventListener("click", () => {
  nextSong();
});

document.getElementById("prev").addEventListener("click", () => {
  prevSong();
});

// Progress bar update
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// Autoplay next track when song ends
audio.addEventListener("ended", () => {
  nextSong();
});

// Functions to switch songs
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

// Media Session API for lock screen controls (with resize fix)
async function updateMediaSession(song) {
  if ("mediaSession" in navigator) {
    const resizedCover = await resizeImage(song.cover);

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: "PookieRhythms",
      artwork: [{ src: resizedCover, sizes: "512x512", type: "image/jpeg" }]
    });

    navigator.mediaSession.setActionHandler("play", () => audio.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.pause());
    navigator.mediaSession.setActionHandler("previoustrack", () => prevSong());
    navigator.mediaSession.setActionHandler("nexttrack", () => nextSong());
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.fastSeek && "fastSeek" in audio) {
        audio.fastSeek(details.seekTime);
      } else {
        audio.currentTime = details.seekTime;
      }
    });
  }
}

// Lyrics button (placeholder)
document.getElementById("lyrics").addEventListener("click", async () => {
  const lyricsBox = document.getElementById("lyrics-box");
  lyricsBox.innerText = "Generating lyrics... 🎶";

  // Placeholder (replace with OpenAI API or lyrics API later)
  setTimeout(() => {
    lyricsBox.innerText = `✨ AI Lyrics for ${songs[currentSong].title}\n\n[Sample lyrics here...]`;
  }, 2000);
});

// Load first song
loadSong(songs[currentSong]);
