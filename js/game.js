// Set the date we're counting down to
var countDownDate = new Date().getTime() + 300000;
let spinExpired = false, flipExpired = false, headWin = false, tailWin = false;

// Update the count down every 1 second
var x = setInterval(function () {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="countdown"
  document.getElementById("countdown-spin").innerHTML =
    `<div id="countdown-box">
    <div class="countdown-timer">${hours}<div class="countdown-text">HOURS</div></div>
    <div class="countdown-timer">${minutes}<div class="countdown-text">MINS</div></div>
    <div class="countdown-timer">${seconds}<div class="countdown-text">SECS</div></div>
  </div>`;

  document.getElementById("countdown-flip").innerHTML =
    `<div id="countdown-box">
    <div class="countdown-timer">${hours}<div class="countdown-text">HOURS</div></div>
    <div class="countdown-timer">${minutes}<div class="countdown-text">MINS</div></div>
    <div class="countdown-timer">${seconds}<div class="countdown-text">SECS</div></div>
  </div>`;

  // If the count down is finished, check
  if (distance < 0) {
    clearInterval(x);
    // Need to check when one cooldown ends, another starts
    document.getElementById("countdown-spin").innerHTML = "GAME EXPIRED";
    document.getElementById("countdown-flip").innerHTML = "GAME EXPIRED";
    spinExpired = true;
    flipExpired = true;
  }
}, 1000);

let theWheel = new Winwheel({
  'numSegments': 8,         // Number of segments
  'outerRadius': 212,       // The size of the wheel.
  'centerX': 217,       // Used to position on the background correctly.
  'centerY': 219,
  'textFontSize': 28,        // Font size.
  'segments':            // Definition of all the segments.
    [
      { 'fillStyle': '#eae56f', 'text': 'Prize 1' },
      { 'fillStyle': '#89f26e', 'text': 'Prize 2' },
      { 'fillStyle': '#7de6ef', 'text': 'Prize 3' },
      { 'fillStyle': '#e7706f', 'text': 'Prize 4' },
      { 'fillStyle': '#eae56f', 'text': 'Prize 5' },
      { 'fillStyle': '#89f26e', 'text': 'Prize 6' },
      { 'fillStyle': '#7de6ef', 'text': 'Prize 7' },
      { 'fillStyle': '#e7706f', 'text': 'Prize 8' }
    ],
  'animation':               // Definition of the animation
  {
    'type': 'spinToStop',
    'duration': 5,
    'spins': 8,
    'callbackFinished': alertPrize
  }
});

let wheelSpinning = false;

function startSpin() {
  if (spinExpired == true) {
    alert("Game has already expired, wait for next opening time!");
  }
  else {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
      theWheel.animation.spins = 8;
      // // Disable the spin button so can't click again while wheel is spinning.
      document.getElementById('spin_button').innerHTML = "SPINNING";

      // Begin the spin animation by calling startAnimation on the wheel object.
      theWheel.startAnimation();

      // Set to true so that power can't be changed and spin button re-enabled during
      // the current animation. The user will have to reset before spinning again.
      wheelSpinning = true;
    }
  }
}
// Called when the animation has finished.
function alertPrize(indicatedSegment) {
  // Do basic alert of the segment text.
  alert("You have won " + indicatedSegment.text);
  theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
  theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
  theWheel.draw();                // Call draw to render changes to the wheel.
  document.getElementById('spin_button').innerHTML = "SPIN";
  wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}

// Coin flip
let coinFlipping = false, heads = false, tails = false;

// Change heads button text & disable when tails is clicked
function headButton() {
  if (tails == false) {
    heads = true;
    document.getElementById('heads-button').innerHTML = "You picked Heads!";
  }
}

// Change tails button text & disable when heads is clicked
function tailButton() {
  if (heads == false) {
    tails = true;
    document.getElementById('tails-button').innerHTML = "You picked Tails!";
  }
}

// Start coin flip animation
function startFlip() {
  // Ensure that flipping can't be clicked again while already running.
  if (flipExpired == true) {
    alert("Game has already expired, wait for next opening time!");
    heads = false, tails = false;
  }
  else {
    if (coinFlipping == false) {
      var flipResult = Math.random();
      document.getElementById('flip-text').innerHTML = "Flipping..";
      $('#coin').removeClass(); // Remove class from coin to stop animation
      coinFlipping = true;
      // 50/50 coin flip result
      setTimeout(function () {
        if (flipResult <= 0.5) {
          $('#coin').addClass('heads'); // Add heads animation
          headWin = true;
        }
        else {
          $('#coin').addClass('tails'); // Add tails animation
          tailWin = true;
        }
      }, 100);

      // Set 2 secs cooldown
      var timeleft = 2;
      var downloadTimer = setInterval(function(){
        if(timeleft <= 0){
          clearInterval(downloadTimer);
          // Check if heads win
          if (headWin == true) {
            // Check if user picked heads - Win
            if (heads == true) 
              alert("You won!");
            else
              alert("You lost!");
          }
          // Check if tails win
          if (tailWin == true) {
            // Check if user picked tails - Win
            if (tails == true)
              alert("You won!");
            else
              alert("You lost!");
          }
          heads = false, tails = false, headWin = false, tailWin = false; // Reset user option to false
          document.getElementById('flip-text').innerHTML = "Flip the Coin!";
          document.getElementById('heads-button').innerHTML = "HEADS";
          document.getElementById('tails-button').innerHTML = "TAILS";
          $('#coin').removeClass();
          coinFlipping = false;
        }
        timeleft -= 1;
      }, 1000);
    }
  }
}
