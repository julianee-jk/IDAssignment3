// Set the date we're counting down to
var countDownDate = new Date().getTime() + 300000;
var spinExpired = false;

// Update the count down every 1 second
var x = setInterval(function() {

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

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown-spin").innerHTML = "GAME EXPIRED";
    spinExpired = true;
    document.getElementById("countdown-flip").innerHTML = "GAME EXPIRED";
  }
}, 1000);

let theWheel = new Winwheel({
  'numSegments'  : 8,         // Number of segments
  'outerRadius'  : 212,       // The size of the wheel.
  'centerX'      : 217,       // Used to position on the background correctly.
  'centerY'      : 219,
  'textFontSize' : 28,        // Font size.
  'segments'     :            // Definition of all the segments.
  [
     {'fillStyle' : '#eae56f', 'text' : 'Prize 1'},
     {'fillStyle' : '#89f26e', 'text' : 'Prize 2'},
     {'fillStyle' : '#7de6ef', 'text' : 'Prize 3'},
     {'fillStyle' : '#e7706f', 'text' : 'Prize 4'},
     {'fillStyle' : '#eae56f', 'text' : 'Prize 5'},
     {'fillStyle' : '#89f26e', 'text' : 'Prize 6'},
     {'fillStyle' : '#7de6ef', 'text' : 'Prize 7'},
     {'fillStyle' : '#e7706f', 'text' : 'Prize 8'}
  ],
  'animation' :               // Definition of the animation
  {
      'type'     : 'spinToStop',
      'duration' : 5,
      'spins'    : 8,
      'callbackFinished' : alertPrize
  }
});

let wheelSpinning = false;

function startSpin()
{
  if (spinExpired == true) {
    alert("Game has already expired, wait for next opening time!");
  }
  else {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
      // Based on the power level selected adjust the number of spins for the wheel, the more times is has
      // to rotate with the duration of the animation the quicker the wheel spins.
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
function alertPrize(indicatedSegment)
{
  document.getElementById('spin_button').innerHTML = "SPIN";
  // Do basic alert of the segment text.
  alert("You have won " + indicatedSegment.text);
  theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
  theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
  theWheel.draw();                // Call draw to render changes to the wheel.
  document.getElementById('spin_button').innerHTML = "SPIN";
  wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}