

const songs = [
  { title: "Chihiro", src: "songs/song1.mp3", cover: "covers/cover1.jpg" },
  { title: "Scott & Zelda", src: "songs/song2.mp3", cover: "covers/cover2.jpg" },
  { title: "Jenny Darling (Best Friend)", src: "songs/song3.mp3", cover: "covers/cover3.jpg" },
  { title: "Liar", src: "songs/song4.mp3", cover: "covers/cover4.jpg" },
  { title: "Chest Pain(I love)", src: "songs/song5.mp3", cover: "covers/cover9.jpg" },
  { title: "Bleed", src: "songs/song6.mp3", cover: "covers/cover10.jpg" },
  { title: "Know Ya/Heart Belong", src: "songs/song7.mp3", cover: "covers/cover7.jpg" },
  { title: "Vixen", src: "songs/song8.mp3", cover: "covers/cover10.jpg" },
  { title: "Heaven Sent", src: "songs/song9.mp3", cover: "covers/cover5.jpg" },
  { title: "Body Loud", src: "songs/song10.mp3", cover: "covers/cover6.jpg" },
  { title: "Walking Away", src: "songs/song11.mp3", cover: "covers/cover11.jpg" },
  { title: "All My Dreams Come True", src: "songs/song12.mp3", cover: "covers/cover12.jpg" },
  { title: "Your Love", src: "songs/song13.mp3", cover: "covers/cover13.jpg" },
  { title: "Stellarvision", src: "songs/song14.mp3", cover: "covers/cover14.jpg" },
  { title: "Original", src: "songs/song15.mp3", cover: "covers/cover15.jpg" },
  { title: "Sweet Boy", src: "songs/song16.mp3", cover: "covers/cover16.jpg" },
  { title: "Pocketful Of Sunshine", src: "songs/song17.mp3", cover: "covers/cover17.jpg" },
  { title: "Make Me A Better Man", src: "songs/song18.mp3", cover: "covers/cover18.jpg" }
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

// 🎵 Lyrics button with AI generation
document.getElementById("lyrics").addEventListener("click", async () => {
  const lyricsBox = document.getElementById("lyrics-box");
  const songTitle = songs[currentSong].title;

  lyricsBox.innerText = "✨ Generating AI lyrics... Please wait 🎶";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a creative songwriter. If the song appears to be non-English, first generate lyrics in the native language, then provide an English translation below it."
          },
          {
            role: "user",
            content: `Generate song lyrics inspired by the title "${songTitle}".`
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      throw new Error("No lyrics generated");
    }

    lyricsBox.innerText = data.choices[0].message.content;

  } catch (error) {
    console.error(error);
    lyricsBox.innerText = "❌ Failed to generate lyrics. Try again.";
  }
});

// Load first song
loadSong(songs[currentSong]);
