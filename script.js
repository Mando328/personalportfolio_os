var welcome_window = document.querySelector("#welcome_window")
var welcomeScreenClose = document.querySelector("#welcomeclose")
var welcomeScreenOpen = document.querySelector("#welcomeopen")
var discord_window = document.querySelector("#discord_window")
var discordScreenClose = document.querySelector("#discordclose")
var discordScreenOpen = document.querySelector("#discordopen")
const input = document.getElementById('note-input');
const btn = document.getElementById('add-btn');
const list = document.getElementById("notes_list");
var desktopIcons = document.querySelectorAll(".icon");
var allWindows = document.querySelectorAll(".window, #welcome_window");
var selectedIcon = undefined
var zIndexCounter = 10
let notes = JSON.parse(localStorage.getItem('notes')) || [];
var header = document.getElementById("particleh2");
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d")
var mouseX = 0;
var mouseY = 0;
var constant = math.complex(0.28, 0.01)
var maxIterations = 64
var width
var height
var clicked = false
var pan = math.complex(0, 0)
var zoom = 1
var initialConstant = { re: 0.28, im: 0.01 }
var fractalResetButton = document.getElementById("fractal-reset")
const audio = document.getElementById("audio");
const playPauseButton = document.getElementById("play-pause");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const volumeControl = document.getElementById("volume");
const trackSlider = document.getElementById("track-slider");
const currentTimeDisplay = document.getElementById("current-time");
const totalDurationDisplay = document.getElementById("total-duration");
const ribbon = document.getElementById("ribbon");
const trackNameDisplay = document.getElementById("track-name");
const albumPhoto = document.getElementById("album-photo");
const musicWindow = document.getElementById("music_window");
const miniPlayerToggle = document.getElementById("mini-player-toggle");
let isPlaying = false;
let isSeeking = false;
const savedMusicState = JSON.parse(localStorage.getItem("musicState") || "{}");
let currentTrack = Number.isInteger(savedMusicState.currentTrack) ? savedMusicState.currentTrack : 0;
let audioPosition = Number.isFinite(savedMusicState.audioPosition) ? savedMusicState.audioPosition : 0;

 const trackList = [
   "files/tunetank_vlog.mp3",
   "files/isaiahmathew-dont panic.mp3",
    // Add more tracks as needed
  ];

  // Array of Album Photos
  const albumPhotos = [
    "./files/tunetank.webp",
    "./files/music-placeholder.svg",
    // Add more corresponding Album Photos
  ];


//this fragment of code is responsible for the fractals,
//despite the names of some elements beeing "particles"

function syncCanvasSize() {
  var canvasStyles = getComputedStyle(canvas)
  canvas.width = parseFloat(canvasStyles.width)
  canvas.height = parseFloat(canvasStyles.height)
}

syncCanvasSize()
width = canvas.width
height = canvas.height
// aaply julia set formula to see if point escapes
function draw() {
  var image = ctx.createImageData(width, height)
  var pixels = image.data
  var pixelIndex = 0

  for (var y = 0; y < height; y++) {
    var startImaginary = 1 - (y / height) * 2

    for (var x = 0; x < width; x++) {
      var real = ((x / width) * 2 - 1) / zoom + pan.re
      var imaginary = startImaginary / zoom + pan.im
      var currentReal = real
      var currentImaginary = imaginary
      var iterations = 0

      while (currentReal * currentReal + currentImaginary * currentImaginary <= 4 && iterations < maxIterations) {
        var nextReal = currentReal * currentReal - currentImaginary * currentImaginary + constant.re
        currentImaginary = 2 * currentReal * currentImaginary + constant.im
        currentReal = nextReal
        iterations++
      }

      var shade = Math.round((iterations / maxIterations) * 255)
      pixels[pixelIndex++] = shade
      pixels[pixelIndex++] = shade
      pixels[pixelIndex++] = shade
      pixels[pixelIndex++] = 255
    }
  }

  ctx.putImageData(image, 0, 0)
}

function updateFractals() {
  header.textContent = "Julia set | " + constant.toString() + " at " + zoom + " X "
  draw()
}

function pixelToPoint(x, y) {
  var real = ((x / width) * 2 - 1) / zoom + pan.re
  var imaginary = (1 - (y / height) * 2) / zoom + pan.im
  return math.complex(real, imaginary)
}

function resetFractals() {
  constant = math.complex(initialConstant.re, initialConstant.im)
  pan = math.complex(0, 0)
  zoom = 1
  clicked = false
  updateFractals()
}

function click(event) {
  var canvasRect = canvas.getBoundingClientRect()
  if (!clicked) {
    clicked = true
    return
  }

  mouseX = ((event.clientX - canvasRect.left) / canvasRect.width) * width
  mouseY = ((event.clientY - canvasRect.top) / canvasRect.height) * height


  pan = pixelToPoint(mouseX, mouseY)
  zoom *= 2
  updateFractals()
}

function move(event) {
  var canvasRect = canvas.getBoundingClientRect()

  mouseX = ((event.clientX - canvasRect.left) / canvasRect.width) * width
  mouseY = ((event.clientY - canvasRect.top) / canvasRect.height) * height

  if (clicked) return

  constant = pixelToPoint(mouseX, mouseY)

  constant.re = math.round(constant.re * 100) / 100
  constant.im = math.round(constant.im * 100) / 100
  updateFractals()
}

canvas.addEventListener("click", click)
fractalResetButton.addEventListener("click", resetFractals)


//end of fractals code


//function from WIX
function clampWindowToViewport(element) {
  if (!element) return;

  var halfWidth = element.offsetWidth / 2;
  var halfHeight = element.offsetHeight / 2;
  var currentTop = element.offsetTop;
  var currentLeft = element.offsetLeft;

  element.style.top = Math.max(halfHeight, Math.min(window.innerHeight - halfHeight, currentTop)) + "px";
  element.style.left = Math.max(halfWidth, Math.min(window.innerWidth - halfWidth, currentLeft)) + "px";
}

function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  var dragHandle = document.getElementById(element.id + "header") || element;
  dragHandle.onpointerdown = startDragging;

  // Step 6: Define the `startDragging` function to capture the initial pointer position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    if (e.target.closest("[data-close-window]")) return;
    e.preventDefault();
    bringToFront(element);
    // Step 7: Get the pointer position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    dragHandle.setPointerCapture(e.pointerId);
    // Step 8: Set up event listeners for pointer movement and release.
    dragHandle.onpointermove = dragElement;
    dragHandle.onpointerup = stopDragging;
    dragHandle.onpointercancel = stopDragging;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on pointer movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    var nextTop = element.offsetTop - currentY;
    var nextLeft = element.offsetLeft - currentX;
    element.style.top = nextTop + "px";
    element.style.left = nextLeft + "px";
    clampWindowToViewport(element);
  }

  // Step 12: Define the `stopDragging` function to stop tracking pointer movement.
  function stopDragging(e) {
    if (e && dragHandle.hasPointerCapture(e.pointerId)) {
      dragHandle.releasePointerCapture(e.pointerId);
    }
    dragHandle.onpointermove = null;
    dragHandle.onpointerup = null;
    dragHandle.onpointercancel = null;
  }
};

function getnasa() {

  var apodDescription = document.getElementById("apod_desc");

  if (typeof NASA_API_KEY === "undefined") {
    apodDescription.textContent = "NASA API key is not configured.";
    return;
  }

  fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
  .then(res => {
    if (!res.ok) {
      throw new Error(`NASA API request failed: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    document.getElementById("apod_title").textContent = data.title;
    document.getElementById("apod_desc").textContent = data.explanation;

    if (data.media_type === "image") {
      document.getElementById("apod_image").src = data.url;
    } else {
      document.getElementById("apod_image").alt = "Today's NASA picture is a video.";
    }
  })
  .catch(err => {
    document.getElementById("apod_desc").textContent = "Error loading APOD";
    console.error(err);
  });
}

function deleteNote(index) {
  notes.splice(index, 1);
  render();
}

function render() {

list.innerHTML = '';

notes.forEach((note, index) => {
  const li = document.createElement("li");
  li.textContent = note;
  li.innerHTML += `<button onclick="deleteNote(${index})">X</button>`;
  list.append(li);
});

localStorage.setItem("notes", JSON.stringify(notes));

};

function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#time");
  if (timeText) timeText.textContent = currentTime;
}


btn.addEventListener('click', () => {
  if (input.value.trim() !== "") {
    notes.push(input.value);
    input.value = '';
    render();
  };
});


function bringToFront(element)
{
  if (!element) return;
  zIndexCounter += 1;
  element.style.zIndex = zIndexCounter;
}

function closeWindow(element)
{
    if (!element) return;
    if (element === musicWindow) {
      audioPosition = audio.currentTime;
      audio.pause();
      isPlaying = false;
      playPauseButton.textContent = "►";
      if (ribbon) ribbon.style.display = "none";
      saveMusicState();
    }
    element.style.display = "none"
}

function openWindow(element)
{
    if (!element) return;
  if (element === particles_window) resetFractals();
    element.style.display = "flex"
    bringToFront(element)
}

function syncWindowWithIcon(icon, shouldOpen)
{
  var targetId = icon.dataset.window;
  if (!targetId) return;

  var windowElement = document.getElementById(targetId);
  if (!windowElement) return;

  if (shouldOpen) {
    openWindow(windowElement);
  } else {
    closeWindow(windowElement);
  }
}

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element
}

function deselectIcon(element) {
  element.classList.remove("selected");
  if (selectedIcon === element) {
    selectedIcon = undefined
  }
}

function toggleIconSelection(icon) {
  if (!icon) return;

  if (icon.classList.contains("selected")) {
    deselectIcon(icon);
    syncWindowWithIcon(icon, false);
    return;
  }

  selectIcon(icon);
  syncWindowWithIcon(icon, true);
}

function InitializeWindow(window) {
  const screenElement = document.querySelector("#" + window + "_window")
  const closeButton = document.querySelector("#" + window + "close")
  const openIcon = document.querySelector("#" + window + "open")

  closeButton.addEventListener("click", function() {
    deselectIcon(openIcon);
    closeWindow(screenElement);
    if(window == "personal"){
      closeWindow(discord_window);
    }
  });

  dragElement(screenElement);
};

welcomeScreenClose.addEventListener("click", function() {
  var icon = document.querySelector('.icon[data-window="welcome_window"]');
  if (icon) {
    deselectIcon(icon);
  }
  closeWindow(welcome_window);
});

welcomeScreenOpen.addEventListener("click", function() {
  var icon = document.querySelector('.icon[data-window="welcome_window"]');
  if (icon) {
    selectIcon(icon);
  }
  openWindow(welcome_window);
});


discordScreenClose.addEventListener("click", function() {
  closeWindow(discord_window);
});

discordScreenOpen.addEventListener("click", function(){
  openWindow(discord_window);
});


desktopIcons.forEach(function(icon) {
  icon.addEventListener("click", function() {
    if (icon.dataset.window) {
      toggleIconSelection(icon);
      return;
    }

    icon.classList.toggle("selected");
  });
});

allWindows.forEach(function(windowElement) {
  windowElement.addEventListener("mousedown", function() {
    bringToFront(windowElement);
  });
});

document.addEventListener("click", function(event) {
  var closeButton = event.target.closest("[data-close-window]");
  if (!closeButton) return;

  var windowId = closeButton.dataset.closeWindow;
  var targetWindow = document.getElementById(windowId);
  if (!targetWindow) return;

  var icon = document.querySelector('.icon[data-window="' + windowId + '"]');
  if (icon) {
    deselectIcon(icon);
  }

  closeWindow(targetWindow);
});

//code copied from medium



  // Function to toggle between Play and Pause
  function togglePlayPause() {
    if (audio.paused) {
      const sourceChanged = !audio.src || !audio.src.endsWith(trackList[currentTrack]);
      if (sourceChanged) {
        audio.src = trackList[currentTrack];
        audio.load();
      }
      const savedPosition = audioPosition;
      const startPlayback = () => {
        if (savedPosition > 0) audio.currentTime = savedPosition;
        audio.play()
        .then(() => {
          playPauseButton.textContent = "❚❚";
          isPlaying = true;
          updateTrackName(currentTrack);

          if (ribbon) {
            ribbon.style.display = "block";
            ribbon.classList.add("active");
          }
        })
        .catch((error) => {
          console.error("Audio Playback Error: " + error.message);
          isPlaying = false;
          playPauseButton.textContent = "►";
        });
      };

      if (audio.readyState >= 1) {
        startPlayback();
      } else {
        audio.addEventListener("loadedmetadata", startPlayback, { once: true });
      }
    } else {
      audioPosition = audio.currentTime; // Store the current audio position
      audio.pause();
      saveMusicState();
      playPauseButton.textContent = "►";
      if (ribbon) ribbon.style.display = "none";
      isPlaying = false;
    }
  }

  playPauseButton.addEventListener("click", togglePlayPause);

  // Function to play the next track
  nextButton.addEventListener("click", function () {
    if (currentTrack < trackList.length - 1) {
      currentTrack++;
    } else {
      currentTrack = 0;
    }
    audioPosition = 0;
    playTrack(currentTrack);
  });

  // Function to play the previous track
  prevButton.addEventListener("click", function () {
    if (currentTrack > 0) {
      currentTrack--;
    } else {
      currentTrack = trackList.length - 1;
    }
    audioPosition = 0;
    playTrack(currentTrack);
  });

  // Function to play a specific track
  function playTrack(trackIndex) {
    audio.src = trackList[trackIndex];
    audioPosition = 0;
    audio.load();
    audio.play().catch((error) => {
      console.error("Audio Playback Error: " + error.message);
      isPlaying = false;
      playPauseButton.textContent = "►";
    });
    playPauseButton.textContent = "❚❚";
    isPlaying = true;
    updateTrackName(trackIndex); // Updating the track name
    saveMusicState();
  }

  // Function to update the track name
  function updateTrackName(trackIndex) {
    const trackName = trackList[trackIndex];
    const cleanedTrackName = trackName
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, character => character.toUpperCase());
    trackNameDisplay.textContent = cleanedTrackName;
    if (albumPhoto) {
      albumPhoto.onerror = () => {
        albumPhoto.onerror = null;
        albumPhoto.src = "./files/music-placeholder.svg";
      };
      albumPhoto.src = albumPhotos[trackIndex] || "./files/music-placeholder.svg";
    }
  }

  volumeControl.addEventListener("input", function () {
    audio.volume = volumeControl.value;
  });

  miniPlayerToggle.addEventListener("click", function () {
    const isMiniPlayer = musicWindow.classList.toggle("mini-player");
    clampWindowToViewport(musicWindow);
    miniPlayerToggle.textContent = isMiniPlayer ? "↗" : "↙";
    miniPlayerToggle.setAttribute("aria-label", isMiniPlayer ? "Restore music player" : "Play in mini player");
    miniPlayerToggle.title = isMiniPlayer ? "Restore music player" : "Play in mini player";
  });

  miniPlayerToggle.addEventListener("pointerdown", function (event) {
    event.stopPropagation();
  });

  // Update the audio time displays
  audio.addEventListener("timeupdate", function () {
    audioPosition = audio.currentTime;
    saveMusicState();
    const currentTime = formatTime(audio.currentTime);
    const totalDuration = formatTime(audio.duration);
    currentTimeDisplay.textContent = currentTime;
    totalDurationDisplay.textContent = totalDuration;

    // Update the track slider as the audio plays
    if (!isSeeking && Number.isFinite(audio.duration) && audio.duration > 0) {
      const position = (audio.currentTime / audio.duration) * 100;
      trackSlider.value = position;
    }
  });

  audio.addEventListener("pause", function () {
    audioPosition = audio.currentTime;
    saveMusicState();
    isPlaying = false;
    playPauseButton.textContent = "►";
  });

  audio.addEventListener("play", function () {
    isPlaying = true;
    playPauseButton.textContent = "❚❚";
  });

  window.addEventListener("beforeunload", saveMusicState);

  // Seek to a position when the user interacts with the track slider
  trackSlider.addEventListener("pointerdown", function () {
    isSeeking = true;
  });

  trackSlider.addEventListener("input", function () {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const newPosition = (trackSlider.value / 100) * audio.duration;
    audio.currentTime = newPosition;
    audioPosition = newPosition;
    saveMusicState();
  });

  trackSlider.addEventListener("pointerup", function () {
    isSeeking = false;
  });

  trackSlider.addEventListener("change", function () {
    isSeeking = false;
  });

  // Handle track ending and play the next track
  audio.addEventListener("ended", function () {
    if (currentTrack < trackList.length - 1) {
      currentTrack++;
    } else {
      currentTrack = 0;
    }
    audioPosition = 0;
    playTrack(currentTrack);
  });

  function saveMusicState() {
    localStorage.setItem("musicState", JSON.stringify({ currentTrack, audioPosition }));
  }

  updateTrackName(currentTrack);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }


//code copied from 30s of code, it handles the gallery in my projects window
const slideGallery = document.querySelector('.slides');
const thumbnailContainer = document.querySelector('.thumbnails');
const previousArrow = document.querySelector('.gallery-arrow-prev');
const nextArrow = document.querySelector('.gallery-arrow-next');

if (slideGallery && thumbnailContainer) {
  const slides = slideGallery.querySelectorAll('div');

  const highlightThumbnail = () => {
    thumbnailContainer
      .querySelectorAll('div.highlighted')
      .forEach(el => el.classList.remove('highlighted'));
    const index = Math.round(slideGallery.scrollLeft / slideGallery.clientWidth);
    const activeThumbnail = thumbnailContainer.querySelector(`div[data-id="${index}"]`);
    if (activeThumbnail) activeThumbnail.classList.add('highlighted');
  };

  const scrollToElement = el => {
    const index = parseInt(el.dataset.id, 10);
    slideGallery.scrollTo(index * slideGallery.clientWidth, 0);
  };

  thumbnailContainer.innerHTML += [...slides]
    .map((slide, i) => `<div data-id="${i}"></div>`)
    .join('');

  thumbnailContainer.querySelectorAll('div').forEach(el => {
    el.addEventListener('click', () => scrollToElement(el));
  });

  previousArrow.addEventListener('click', () => {
    const currentIndex = Math.round(slideGallery.scrollLeft / slideGallery.clientWidth);
    scrollToElement({ dataset: { id: Math.max(currentIndex - 1, 0) } });
  });

  nextArrow.addEventListener('click', () => {
    const currentIndex = Math.round(slideGallery.scrollLeft / slideGallery.clientWidth);
    scrollToElement({ dataset: { id: Math.min(currentIndex + 1, slides.length - 1) } });
  });

  slideGallery.addEventListener('scroll', highlightThumbnail);
  highlightThumbnail();
}

// end of copied code
InitializeWindow("space");
InitializeWindow("personal");
InitializeWindow("notes");
InitializeWindow("project");
InitializeWindow("certificates");
InitializeWindow("particles");
InitializeWindow("music");
render();
getnasa();
dragElement(document.getElementById("welcome_window"));
dragElement(document.getElementById("discord_window"));
updateTime();
setInterval(updateTime, 1000)
canvas.addEventListener('pointermove', move)
updateFractals()



