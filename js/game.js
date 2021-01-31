// Set the date we're counting down to
var countDownDate = new Date().getTime() + 300000;

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

  // Display the result in the element with id="demo"
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
    document.getElementById("countdown-flip").innerHTML = "GAME EXPIRED";
  }
}, 1000);