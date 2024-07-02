// Google Ads global variables
var videoElement;
var adsLoaded = false;
var adContainer;
var adDisplayContainer;
var adsLoader;
var adsManager;
var countdownTimer;
const timerCounter = document.querySelector("#timerCounter");
const skipButton = document.querySelector("#skipButton");

// Popup global variables
const popup = document.querySelector("#popup");
const buttons = document.querySelectorAll('.button');
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
let currentIndex = 0;

// Game global variables
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetPopup = document.querySelector("#resetPopup");
const resetButton = document.querySelector("#resetButton");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "gray";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

// TODO: check if this approach is valid. Common for both screens key press observer
// Ads observer
document.addEventListener('keydown', function(event) {
    if (document.activeElement === yesButton || document.activeElement === noButton) {
        if (event.key === 'ArrowRight') {
            // Move to the next button
            currentIndex = (currentIndex + 1) % buttons.length;
            buttons[currentIndex].focus();
        } else if (event.key === 'ArrowLeft') {
            // Move to the previous button
            currentIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            buttons[currentIndex].focus();
        } else if (event.key === 'Enter') {
            // Enter button pressed
            if (document.activeElement === yesButton) 
                yesButtonSelected(event)
            else if (document.activeElement === noButton) 
                noButtonSelected(event)
        } else if (event.key === 'Escape') {
            if(document.activeElement === yesButton || document.activeElement === noButton) {
                noButtonSelected(event)
            }
        }
    }   
    else {
        console.log("game has focus")
        if (document.activeElement === resetButton) {
            resetButtonSelected(event)
        } else {
            changeDirection(event);
        }
        
    }
});

window.addEventListener('load', function(event) {
    videoElement = document.getElementById('video-element');
    initializeIMA();
    // videoElement.addEventListener('play', function(event) {
    //     loadAds(event);
    // });
    // var playButton = document.getElementById('play-button');
    // yesButton.addEventListener('click', function(event) {
    //     videoElement.play();
    // });
});

window.addEventListener('resize', function(event) {
    console.log("window resized");
    if(adsManager) {
        // var width = videoElement.clientWidth;
        // var height = videoElement.clientHeight;
        var width = 1280
        var height = 720
        adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
    }
});

document.addEventListener('click', function(event) {
    if (event.target.id !== "skipButton") {
        event.preventDefault();
        event.stopPropagation();
        if (buttons[currentIndex].focus()) {
            buttons[currentIndex].focus();
        }
        if (resetButton.focus()) {
            resetButton.focus();
        }
        console.log('Mouse click disabled');
    }
}, true);

// buttons.addEventListener('focus', function(event) {
//     buttons.classList.add("activeButton")
// })

buttons.forEach(button => {
    button.addEventListener('focus', function(event) {
        button.classList.add("activeButton")
        button.classList.remove("unactiveButton")
    });
});

buttons.forEach(button => {
    button.addEventListener('blur', function(event) {
        button.classList.add("unactiveButton")
        button.classList.remove("activeButton")
    });
});

// Global code
// popup.focus()
buttons[currentIndex].focus();
gameContainer.classList.add("disable");
timer.classList.add("disable");
skip.classList.add("disable");
