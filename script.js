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
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
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
  screen = document.querySelector("#" + window + "_window")
  close = document.querySelector("#" + window + "close")
  open = document.querySelector("#" + window + "open")

  close.addEventListener("click", function() {
    deselectIcon(open);
    closeWindow(screen);
    if(window == "personal"){
      closeWindow(discord_window);
    }
  });

  dragElement(screen);
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
personalScreenClose.addEventListener("click", function() {
  deselectIcon(personalScreenOpen);
  closeWindow(personal_window);
  closeWindow(discord_window);
});

projectScreenClose.addEventListener("click", function() {
  deselectIcon(projectScreenOpen);
  closeWindow(project_window);
} );

discordScreenClose.addEventListener("click", function() {
  closeWindow(discord_window);
});

discordScreenOpen.addEventListener("click", function(){
  openWindow(discord_window);
});

particlesScreenClose.addEventListener("click" ,function() {
  deselectIcon(particlesScreenOpen);
  closeWindow(particles_window);
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
render();
getnasa();
dragElement(document.getElementById("welcome_window"));
dragElement(document.getElementById("discord_window"));
updateTime();
setInterval(updateTime, 1000)
canvas.addEventListener('pointermove', move)
updateFractals()



