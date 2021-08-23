const element = (e) => document.querySelector(e);
// DOM elements
const coverImg = document.getElementById("cover");

const title = document.getElementById("title");
const artist = document.getElementById("artist");

const slider = document.getElementById("slider");
const timeLeft = document.getElementById("time-left");
const timeRemain = document.getElementById("time-remain");

const playBtn = document.getElementById("play");
const playIcon = document.getElementById("play-icon");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");

// variables
let isPlaying = false;
let duration = 0;
let currentTime = 0;

// prettier-ignore
let playList = [
  { title: "Time",            artist: "Alan Walker & Hans Zimmer",  src: "music/Time.m4a",            cover: "img/cover/Time.jpg"             },
  { title: "In The End",      artist: "Fleurie",                    src: "music/In-The-End.mp3",      cover: "img/cover/In-The-End.jpg"       },
  { title: "Algorithm",       artist: "Muse",                       src: "music/Algorithm.mp3",       cover: "img/cover/Algorithm.jpg"        },
  { title: "Never Fade Away", artist: "Olga Jankowska",             src: "music/Never-Fade-Away.mp3", cover: "img/cover/Never-Fade-Away.jpg"  },
];

let track = 0;
let nowPlaying = playList[track];

let song = new Audio();
song.volume = 0.5;

// change volume
const volumeIcon = element("#volume-btn i");
const inputVolume = element("#input-volume");
inputVolume.addEventListener("input", () => {
  if (!element("#toggle-mute").checked) {
    song.volume = inputVolume.value / 100;
  }

  if (!song.volume) {
    volumeIcon.style.color = "lightcoral";
    volumeIcon.className = "fas fa-volume-mute";
  } else if (song.volume < 0.7) {
    volumeIcon.style.color = "grey";
    volumeIcon.className = "fa fa-volume-down";
  } else {
    volumeIcon.className = "fas fa-volume-up";
  }
});

song.src = nowPlaying.src;
let currentSrc = nowPlaying.src;

song.onloadeddata = () => {
  duration = song.duration;
  slider.max = duration;
  // console.log(duration);
};

// functions
const nowPlayingHighlight = () => {
  // SHOW border for now playing song when click on menu
  const trackLists = document.querySelectorAll(".track-list");
  for (let i = 0; i < trackLists.length; i++) {
    trackLists[i].style.boxShadow = "0 0 0 2px #00000008";
    trackLists[i].addEventListener("click", () => {
      nowPlaying = playList[i];
      track = i;
      isPlaying = false;
      playSong();
    });
  }
  trackLists[track].style.boxShadow = "0 0 0 2px #5a86bf79";
};

const playSong = () => {
  if (currentSrc != nowPlaying.src) {
    // change song.src only if track has changed
    song.src = nowPlaying.src;
    currentSrc = nowPlaying.src;

    element("#cover").classList.remove("effect");
    void element("#cover").offsetWidth;
    element("#cover").classList.add("effect");
  }

  nowPlayingHighlight();

  if (!isPlaying) {
    // update music info
    element("#cover").src = nowPlaying.cover;
    title.innerHTML = nowPlaying.title;
    artist.innerHTML = nowPlaying.artist;
    playIcon.className = "fa fa-pause";
    playIcon.style.transform = "translateX(0%)";
    song.play();
    isPlaying = true;
  } else {
    song.pause();
    playIcon.className = "fa fa-play";
    playIcon.style.transform = "translateX(10%)";
    isPlaying = false;
  }
};

// Control Buttons
playBtn.addEventListener("click", playSong);

nextBtn.addEventListener("click", () => {
  track++;
  if (track > playList.length - 1) track = 0;

  nowPlaying = playList[track];
  isPlaying = false;
  playSong();
});

backBtn.addEventListener("click", () => {
  track--;
  if (track < 0) track = playList.length - 1;

  nowPlaying = playList[track];
  isPlaying = false;
  playSong();
});

// Range slider events ---
slider.addEventListener("change", () => {
  song.currentTime = slider.value;
  // update slider background
  setInterval(() => {
    let x = (slider.value / slider.max) * 100;
    slider.style.background = `linear-gradient(to right, hsl(214, 45%, 80%) ${x}%, hsl(214, 44%, 90%) 0%)`;
  }, 10);
});

const secondsToMinutes = (sec) => {
  return (
    Math.floor(sec / 60)
      .toString()
      .padStart(2, "0") +
    ":" +
    Math.floor(sec % 60)
      .toString()
      .padStart(2, "0")
  );
};

let touch = false;
slider.addEventListener("mousedown", () => (touch = true));
slider.addEventListener("mouseup", () => (touch = false));

// ---- Song events
song.addEventListener("timeupdate", () => {
  element("#toggle-mute").checked ? (song.volume = 0) : (song.volume = inputVolume.value / 100);

  if (!touch) {
    // if user not clicking on slider, update song time
    slider.value = song.currentTime;
    timeLeft.innerHTML = song.currentTime ? secondsToMinutes(song.currentTime) : "00:00";
    timeRemain.innerHTML = song.currentTime ? secondsToMinutes(song.duration - song.currentTime) : "00:00";
    // update sider background
    let x = (slider.value / slider.max) * 100;
    slider.style.background = `linear-gradient(to right, hsl(214, 45%, 80%) ${x}%, hsl(214, 44%, 90%) 0%)`;
  }
});

song.addEventListener("ended", () => {
  track++;
  isPlaying = false;
  if (element("#repeat-toggle").checked) {
    if (track > playList.length - 1) track = 0;
  } else {
    if (track > playList.length - 1) {
      track = playList.length - 1;
      isPlaying = true;
    }
  }

  nowPlaying = playList[track];
  playSong();
});

// --- Buttons events
const menuBtn = document.getElementById("menu-btn");
const trackContainer = element(".tracks-container");
trackContainer.style.bottom = "101%"; // fix working for first time

menuBtn.addEventListener("click", (e) => {
  if (trackContainer.style.height == "380px") {
    trackContainer.style.opacity = "0";
    trackContainer.style.height = "0";
    e.target.style.color = "grey";
  } else {
    trackContainer.style.visibility = "visible";
    trackContainer.style.opacity = "1";
    trackContainer.style.height = "380px";
    e.target.style.color = "#5a86bf";
  }
});

// toggle settings
let settings_elem = element(".settings-container");

element("#settings-btn").addEventListener("click", (e) => {
  if (settings_elem.style.height == "380px") {
    settings_elem.style.opacity = "0";
    settings_elem.style.height = "0";
    e.target.style.color = "grey";
  } else {
    settings_elem.style.visibility = "visible";
    settings_elem.style.opacity = "1";
    settings_elem.style.height = "380px";
    e.target.style.color = "#5a86bf";
  }
});

// play|pause with [spacebar] key
document.body.addEventListener("keydown", (event) => {
  if (event.keyCode == 32) playSong();
});

// get user music
const inputAudio = element("#file");
inputAudio.addEventListener("change", () => {
  var path = window.URL.createObjectURL(inputAudio.files[0]);

  let userMusic = {
    title: inputAudio.files[0].name,
    artist: "unknown",
    src: path,
    cover: "img/cover/default.png",
  };

  playList = [...playList, userMusic];

  createTrackNode();
});

// creates a track component in tracks section
function createTrackNode() {
  const div = document.createElement("div");
  div.className = "track-list";

  const img = document.createElement("img");
  img.setAttribute("src", "img/cover/default.png");
  div.appendChild(img);

  document.createElement("p");
  const text = document.createTextNode(inputAudio.files[0].name);
  div.appendChild(text);

  const traksContainer = element(".tracks-container");
  traksContainer.appendChild(div);
}

// volToggle Switch
element("#toggle-mute").addEventListener("change", function () {
  if (this.checked) {
    volumeIcon.style.color = "lightcoral";
    volumeIcon.className = "fas fa-volume-mute";
  } else if (song.volume < 0.7) {
    volumeIcon.style.color = "grey";
    volumeIcon.className = "fa fa-volume-down";
  } else {
    volumeIcon.className = "fas fa-volume-up";
    volumeIcon.style.color = "grey";
  }
});

// instagram: web.script
// github: github.com/miladxdev
// © 2021 Milad Gharibi. All rights reserved
