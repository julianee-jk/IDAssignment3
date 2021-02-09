let spinExpired = false, flipExpired = false, headWin = false, tailWin = false, wheelSpinning = false;
// Coin flip
let coinFlipping = false, heads = false, tails = false;

$(document).ready(function() {
  $('#countdown-flip').html('GAME EXPIRED');
  spinTimer();
});

// Change heads button text & disable when tails is clicked
function headButton() {
  if (tails == false && flipExpired == false) {
    heads = true;
    $('#heads-button').html('You picked Heads!');
  }
}

// Change tails button text & disable when heads is clicked
function tailButton() {
  if (heads == false && flipExpired == false) {
    tails = true;
    $('#tails-button').html('You picked Tails!');
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
      $('#flip-text').html('Flipping..');
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
      var downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
          clearInterval(downloadTimer);
          // Check if heads win
          if (headWin == true) {
            // Check if user picked heads - Win
            if (heads == true) alert("You won!");
            else alert("You lost!");
          }
          // Check if tails win
          if (tailWin == true) {
            // Check if user picked tails - Win
            if (tails == true) alert("You won!");
            else alert("You lost!");
          }
          heads = false, tails = false, headWin = false, tailWin = false; // Reset user option to false
          $('#flip-text').html('Flip the Coin!');
          $('#heads-button').html('HEADS');
          $('#tails-button').html('TAILS');
          $('#coin').removeClass();
          coinFlipping = false;
        }
        timeleft -= 1;
      }, 1000);
    }
  }
}

let theWheel = new Winwheel({
  'numSegments': 16,         // Number of segments
  'outerRadius': 212,       // The size of the wheel.
  'centerX': 217,       // Used to position on the background correctly.
  'centerY': 219,
  'textFontSize': 25,        // Font size.
  'segments':            // Definition of all the segments.
    [
      { 'fillStyle': '#9560a6', 'text': '$15' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': '' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#ffb217', 'text': '$100' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': '' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': '$20' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': '' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': '$30' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': '' },
      { 'fillStyle': '#c8b0d9', 'text': '' }
    ],
  'animation':               // Definition of the animation
  {
    'type': 'spinToStop',
    'duration': 5,
    'spins': 8,
    'callbackFinished': alertPrize
  }
});

function startSpin() {
  var spinCost = 3;
  if (spinExpired == true) {
    alert("Game has already expired, wait for next opening time!");
  }
  else {
    ModifyAccountBalance(0, spinCost);
    console.log('$3 deducted');
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
      theWheel.animation.spins = 8;
      $('#spin-button').html('SPINNING');
      // Begin the spin animation by calling startAnimation on the wheel object.
      theWheel.startAnimation();
      // the current animation. The user will have to reset before spinning again.
      wheelSpinning = true;
    }
  }
}

// Called when the animation has finished.
function alertPrize(indicatedSegment) {
  var spinAmountWon = 0;
  switch (indicatedSegment.text) {
    case '$15':
      spinAmountWon = 15;
      console.log('$15');
      break;
    case '$20':
      spinAmountWon = 20;
      console.log('$20');
      break;
    case '$30':
      spinAmountWon = 30;
      console.log('$30');
      break;
    case '$100':
      spinAmountWon = 100;
      console.log('$100');
      break;
    default:
      console.log('You did not win anything.');
  }
  ModifyAccountBalance(spinAmountWon, 0);
  console.log('$' + spinAmountWon + ' added');
  theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
  theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
  theWheel.draw();                // Call draw to render changes to the wheel.
  $('#spin-button').html('SPIN');
  wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
  // Do basic alert of the segment text.
      
}

function ModifyAccountBalance(spinAmountWon, spinCost) {
  if (accLoggedIn != null) { // Check if user is logged in
    if (spinAmountWon > 0 || spinCost == 3) {
      $.ajax({ // Get account data from database
        "async": true,
        "crossDomain": true,
        "url": `https://sneakerzone-11b9.restdb.io/rest/account-info/${accLoggedIn[0]}`,
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
      })
      .done(function(account) {
        account.balance -= spinCost;
        account.balance += spinAmountWon;
        updateAccount(account);
      }).fail(function() { window.location.href = 'index.html' });
    }
  } else window.location.href = 'index.html'
}

function updateAccount(account) {
  var jsondata = { 
      "name": account.name, 
      "dob": account.dob, 
      "password": account.password, 
      "balance": account.balance, 
      "coupon": account.coupon
  };

  $.ajax({
      "async": true,
      "crossDomain": true,
      "url": `https://sneakerzone-11b9.restdb.io/rest/account-info/${account._id}`,
      "method": "PUT",
      "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata)
  })
  .done(function() {
      console.log("Account Info Updated.");
  });
}

// Countdown Timers
function spinTimer() {
  flipExpired = true;
  var countDownTime = new Date().getTime() + 300000;
  // Update the count down every 1 second
  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownTime - now;
    // Time calculations for hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Display the result in the element with id="countdown"
    $('#countdown-spin').html(
      `<div id="countdown-box">
        <div class="countdown-timer">${hours}<div class="countdown-text">HOURS</div></div>
      <div class="countdown-timer">${minutes}<div class="countdown-text">MINS</div></div>
      <div class="countdown-timer">${seconds}<div class="countdown-text">SECS</div></div>
      </div>`);
;
    // If the count down is finished, check
    if (distance < 0) {
      clearInterval(x);
      // Need to check when one cooldown ends, another starts
      $('#countdown-spin').html('GAME EXPIRED');
      spinExpired = true, flipExpired = false;
      flipTimer();
    }
  }, 1000)
};

function flipTimer() {
  spinExpired = true;
  var countDownTime = new Date().getTime() + 300000;
  // Update the count down every 1 second
  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownTime - now;
    // Time calculations for hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="countdown"
    $('#countdown-flip').html(
      `<div id="countdown-box">
      <div class="countdown-timer">${hours}<div class="countdown-text">HOURS</div></div>
      <div class="countdown-timer">${minutes}<div class="countdown-text">MINS</div></div>
      <div class="countdown-timer">${seconds}<div class="countdown-text">SECS</div></div>
      </div>`);
    // If the count down is finished, check
    if (distance < 0) {
      clearInterval(x);
      // Need to check when one cooldown ends, another starts
      $('#countdown-flip').html('GAME EXPIRED');
      flipExpired = true, spinExpired = false;
      spinTimer();
    }
  }, 1000)
};