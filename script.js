function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#time");
  if (timeText) timeText.textContent = currentTime;
}

// copied from WIX
// Make the DIV element draggable:

function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
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

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var welcome_window = document.querySelector("#welcome_window")
var welcomeScreenClose = document.querySelector("#welcomeclose")
var welcomeScreenOpen = document.querySelector("#welcomeopen")
var personal_window = document.querySelector("#personal_window")
var personalScreenClose = document.querySelector("#personalclose")
var personalScreenOpen = document.querySelector("#personalopen")
var discord_window = document.querySelector("#discord_window")
var discordScreenClose = document.querySelector("#discordclose")
var discordScreenOpen = document.querySelector("#discordopen")
var project_window = document.querySelector("#project_window")
var projectScreenClose = document.querySelector("#projectclose")
var projectScreenOpen = document.querySelector("#projectopen")
var space_window = document.querySelector("#space_window")
var spaceScreenClose = document.querySelector("#spaceclose")
var spaceScreenOpen = document.querySelector("#spaceopen")
const input = document.getElementById('note-input');
const btn = document.getElementById('add-btn');
const list = document.getElementById("notes_list");
var desktopIcons = document.querySelectorAll(".icon");
var allWindows = document.querySelectorAll(".window, #welcome_window");
var selectedIcon = undefined
var zIndexCounter = 10
let notes = JSON.parse(localStorage.getItem('notes')) || [];

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

function render() {

list.innerHTML = '';
notes.forEach((note, index) => {
  const li = document.createElement("li");
  li.textContent = note;
  li.innerHTML += `<button onclick="deleteNote(${index})">X</button>`;
  list.append(li);
});
localStorage.setItem("notes", JSON.stringify(notes));

}

btn.addEventListener('click', () => {
  if (input.value.trim() !== "") {
    notes.push(input.value);
    input.value = '';
    render();
  }
});

function deleteNote(index) {
  notes.splice(index, 1);
  render();
}

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

spaceScreenClose.addEventListener("click", function() {
  deselectIcon(spaceScreenOpen);
  closeWindow(space_window);
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

render();
getnasa();
dragElement(document.getElementById("welcome_window"));
dragElement(document.getElementById("personal_window"));
dragElement(document.getElementById("notes_window"));
dragElement(document.getElementById("discord_window"));
dragElement(document.getElementById("project_window"));
dragElement(document.getElementById("space_window"));
updateTime();
setInterval(updateTime, 1000)




//code copied from 30s of code, it handles the gallery in my projects
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