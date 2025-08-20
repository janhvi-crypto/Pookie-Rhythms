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

function loadSong(song) {
  title.textContent = song.title;
  audio.src = song.src;
  cover.src = song.cover;
}

document.getElementById("play").addEventListener("click", () => {
  audio.play();
});

document.getElementById("pause").addEventListener("click", () => {
  audio.pause();
});

document.getElementById("next").addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(songs[currentSong]);
  audio.play();
});

document.getElementById("prev").addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(songs[currentSong]);
  audio.play();
});

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

loadSong(songs[currentSong]);
