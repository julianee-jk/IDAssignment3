// Set the date we're counting down to
let spinExpired = false, flipExpired = false, headWin = false, tailWin = false;
document.getElementById("countdown-flip").innerHTML = "GAME EXPIRED";
spinTimer();

function spinTimer() {
  flipExpired = true;
  var countDownDate = new Date().getTime() + 300000;
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
  // If the count down is finished, check
  if (distance < 0) {
    clearInterval(x);
    // Need to check when one cooldown ends, another starts
    document.getElementById("countdown-spin").innerHTML = "GAME EXPIRED";
    spinExpired = true, flipExpired = false;
    flipTimer();
  }
}, 1000)};

function flipTimer() {
  spinExpired = true;
  var countDownDate = new Date().getTime() + 300000;
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
    document.getElementById("countdown-flip").innerHTML = "GAME EXPIRED";
    flipExpired = true, spinExpired = false;
    spinTimer();
  }
}, 1000)};

let theWheel = new Winwheel({
  'numSegments': 16,         // Number of segments
  'outerRadius': 212,       // The size of the wheel.
  'centerX': 217,       // Used to position on the background correctly.
  'centerY': 219,
  'textFontSize': 25,        // Font size.
  'segments':            // Definition of all the segments.
    [
      { 'fillStyle': '#9560a6', 'text': 'Voucher' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': '' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#ffb217', 'text': 'JACKPOT' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': '' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': '' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': 'Voucher' },
      { 'fillStyle': '#c8b0d9', 'text': '' },
      { 'fillStyle': '#9560a6', 'text': ''},
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

      // the current animation. The user will have to reset before spinning again.
      wheelSpinning = true;
    }
  }
}
// Called when the animation has finished.
function alertPrize(indicatedSegment) {
  // Do basic alert of the segment text.
  if (indicatedSegment.text == 'JACKPOT')
    alert("CONGRATS! YOU HIT THE " + indicatedSegment.text + "!!");
  else if (indicatedSegment.text == 'Voucher')
    alert("You won a " + indicatedSegment.text + "!");
  else
    alert("You did not win anything.");

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
  if (tails == false && flipExpired == false) {
    heads = true;
    document.getElementById('heads-button').innerHTML = "You picked Heads!";
  }
}

// Change tails button text & disable when heads is clicked
function tailButton() {
  if (heads == false && flipExpired == false) {
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

var selectSpin = false, selectFlip = false;

$("#selectSpin").click(function (e) {
  selectSpin = true;
});

$("#selectFlip").click(function (e) {
  selectFlip = true;
});

const APIKEY = "601a5d306adfba69db8b6cfc";
$(document).ready(function () {
  const value = localStorage.getItem('accountLoggedIn')
  getAccountData();
  // Get account data from database
  function getAccountData(limit = 10, all = true) {
    // Create our AJAX settings
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://sneakerzone-11b9.restdb.io/rest/account-info",
        "method": "GET", // Use GET to retrieve info
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
    }

    // Loop to continously add on data
    $.ajax(settings).done(function (response) {
        for (let i = 0; i < response.length && i < limit; i++) {
            if (value == response[i].name) {
                let accountBal = response[i].balance;
                if (accountBal > 0) {
                  if (selectSpin == true) {
                    accountBal -= 5
                  }
                  else if (selectFlip == true) {
                    accountBal -= 3
                  }
                  else 
                      break;
                }
                else {
                  alert('Not enough SZ!');
                  break;
                }
                console.log(accountBal);
                let id = response[i]._id, accName = response[i].name, accDob = response[i].dob, accPass = response[i].password
                updateAccountInfo(id, accName, accDob, accPass, accountBal);
                break;
            }
            else 
                continue;
        }
      }
    )}
  });

function updateAccountInfo(id, accName, accDob, newPass, accountBal) {
  //@TODO create validation methods for id etc. 
  var jsondata = { "name": accName, "dob": accDob, "password": newPass, "balance": accountBal};
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://sneakerzone-11b9.restdb.io/rest/account-info/${id}`,
      "method": "PUT",
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata)
    }
    
    $.ajax(settings).done(function () {
      console.log('Account info updated. (Game Deduction)');
    });
}//end updateform function