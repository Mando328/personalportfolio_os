function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeText = document.querySelector("#time");
  timeText.innerHTML = currentTime;
}

// copied from WIX
// Make the DIV element draggable:


// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
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

var selectedIcon = undefined
var zIndexCounter = 10

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

closeWindow(personal_window);

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
});

var desktopIcons = document.querySelectorAll(".icon");
desktopIcons.forEach(function(icon) {
  icon.addEventListener("click", function() {
    if (icon.dataset.window) {
      toggleIconSelection(icon);
      return;
    }

    icon.classList.toggle("selected");
  });
});

var allWindows = document.querySelectorAll(".window, #welcome_window");
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

dragElement(document.getElementById("welcome_window"));
dragElement(document.getElementById("personal_window"));
dragElement(document.getElementById("music_window"));
setInterval(updateTime, 1000)



//code copied from 30s of code
const slideGallery = document.querySelector('.slides');
const slides = slideGallery.querySelectorAll('div');
const thumbnailContainer = document.querySelector('.thumbnails');
const slideCount = slides.length;
const slideWidth = 540;

const highlightThumbnail = () => {
  thumbnailContainer
    .querySelectorAll('div.highlighted')
    .forEach(el => el.classList.remove('highlighted'));
  const index = Math.floor(slideGallery.scrollLeft / slideWidth);
  thumbnailContainer
    .querySelector(`div[data-id="${index}"]`)
    .classList.add('highlighted');
};

const scrollToElement = el => {
  const index = parseInt(el.dataset.id, 10);
  slideGallery.scrollTo(index * slideWidth, 0);
};

thumbnailContainer.innerHTML += [...slides]
  .map((slide, i) => `<div data-id="${i}"></div>`)
  .join('');

thumbnailContainer.querySelectorAll('div').forEach(el => {
  el.addEventListener('click', () => scrollToElement(el));
});

slideGallery.addEventListener('scroll', e => highlightThumbnail());

highlightThumbnail();