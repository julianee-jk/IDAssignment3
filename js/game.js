var spinExpired = false, flipExpired = false;
var wheelSpinning = false; // Spin N Win
var coinFlipping = false, heads = false, tails = false, headWin = false, tailWin = false; // Coin flip

$(document).ready(function () {
    var accLoggedIn = localStorage.getItem('accLoggedIn');
    if (accLoggedIn == null) { // If account NOT logged in, disable play buttons
        $('.not-loggedin-text').show();
        $("#spin-play-button").attr("disabled", true);
        $("#flip-play-button").attr("disabled", true);
    }
    else {
        $('.not-loggedin-text').hide(); // If account logged in, enable play buttons
        $("#spin-play-button").attr("disabled", false);
        $("#flip-play-button").attr("disabled", false);
    }

    $('#countdown-flip').html('GAME EXPIRED'); // Set flip countdown to expired
    spinTimer(); // Start spin timer
});

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
        // Display the result in the element with id="countdown-spin"
        $('#countdown-spin').html(`
            <div id="countdown-box">
                <div class="countdown-timer">${hours}<div class="countdown-text">HOURS</div></div>
                <div class="countdown-timer">${minutes}<div class="countdown-text">MINS</div></div>
                <div class="countdown-timer">${seconds}<div class="countdown-text">SECS</div></div>
            </div>
        `);
        // Check when timer runs out
        if (distance < 0) {
            clearInterval(x);
            $('#countdown-spin').html('GAME EXPIRED'); // Set countdown text to expire when timer runs out
            spinExpired = true; // Set spin expire to true
          	flipExpired = false; // Set flip expire to false
            flipTimer(); // Start fliptimer when spintimer ends
        }
    }, 1000);
}

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

        // Display the result in the element with id="countdown-flip"
        $('#countdown-flip').html(`
            <div id="countdown-box">
                <div class="countdown-timer">${hours}<div class="countdown-text">HOURS</div></div>
                <div class="countdown-timer">${minutes}<div class="countdown-text">MINS</div></div>
                <div class="countdown-timer">${seconds}<div class="countdown-text">SECS</div></div>
            </div>
        `);
        // Check when timer runs out
        if (distance < 0) {
            clearInterval(x);
            $('#countdown-flip').html('GAME EXPIRED'); // Set countdown text to expire when timer runs out
            flipExpired = true; // Set flip expire to true
            spinExpired = false; // Set spin expire to false
            spinTimer(); // Start spin timer when flip timer ends
        }
    }, 1000);
}

// Change heads button text & disable when tails is clicked
$('#heads-button').on("click", function() {
    if (tails == false && flipExpired == false) { // Check to prevent user from clicking button if flipping or expired
        heads = true; // User pick heads - set heads to true
        $('#heads-button').html('You picked Heads!'); // Change button text onclick
    }
});

// Change tails button text & disable when heads is clicked
$('#tails-button').on("click", function() {
    if (heads == false && flipExpired == false) { // Check to prevent user from clicking button if flipping or expired
        tails = true; // User pick tails - set tails to true
        $('#tails-button').html('You picked Tails!'); // Change button text onclick
    }
});

// Start coin flip animation
function startFlip() {
    $('#flip-text-error').hide();
    // Ensure that flipping can't be clicked again while already running.
    if (flipExpired == true) {
        $('#flip-text-error').css('color', 'red');
        $('#flip-text-error').html('Game has already expired, wait for next opening time!');
        heads = false;
      	tails = false;
    }
    else {
        if (coinFlipping == false) {
            $('.game-flip-loading').hide();
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
        }
    }
    // Set 2 secs cooldown
    var timeleft = 2;
    var flipAmountWon = 0;
    var flipWinTimer = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(flipWinTimer);
            $('#flip-text-error').show();
            // Check if heads win & Check if user picked heads - Win || Check if tails win & Check if user picked tails - Win
            if (headWin == true && heads == true || tailWin == true && tails == true) {
                flipAmountWon = 18;
                $('#flip-text-error').css('color', 'green');
                $('#flip-text-error').html('You won $18!');
                ModifyAccountBalance(0, 0, flipAmountWon, 0);
            }
            else if (headWin == true && heads == false || tailWin == true && tails == false) {
                $('#flip-text-error').css('color', 'red');
                $('#flip-text-error').html('You lost!');
                $(".flip-button").attr("disabled", false);
            }
            heads = false;	// Reset user option to false
            tails = false;	// Reset user option to false
         	headWin = false; // Reset heads win to false
          	tailWin = false; // Reset tais win to false
            $('#flip-text').html('Flip the Coin!');
            $('#heads-button').html('HEADS');
            $('#tails-button').html('TAILS');
            $('#coin').removeClass();
            coinFlipping = false;
        }
        timeleft -= 1;
        $('.game-flip-loading').hide();
        setTimeout(function(){$('#flip-text-error').hide();}, 8000);
    }, 1000);
}

// Spin Wheel Function
let theWheel = new Winwheel({
    'numSegments': 20,    // Number of segments
    'outerRadius': 212,   // The size of the wheel.
    'centerX': 217,       // Used to position on the background correctly.
    'centerY': 219,
    'textFontSize': 25,   // Font size.
    'responsive'   : true,  // This wheel is responsive!
    'segments': [         // Definition of all the segments.
        { 'fillStyle': '#ffb217', 'text': '$100' }, { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '$10' },  { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '$20' },  { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '' },     { 'fillStyle': '#c8b0d9', 'text': '$30' },
        { 'fillStyle': '#9560a6', 'text': '' },     { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '$50' },  { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '' },     { 'fillStyle': '#c8b0d9', 'text': '$20' },
        { 'fillStyle': '#9560a6', 'text': '' },     { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '$30' },  { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '$10' },  { 'fillStyle': '#c8b0d9', 'text': '' }
    ],
    'animation': // Definition of the animation
    {
        'type': 'spinToStop',
        'duration': 5,
        'spins': 8,
        'callbackFinished': alertPrize
    }
});

// Alert prize when animation is finished
function alertPrize(indicatedSegment) {
    var spinAmountWon = 0;
    $('#spin-text-error').css('color', 'green');
    switch (indicatedSegment.text) {
        case '$10':
            spinAmountWon = 10;
            $('#spin-text-error').html('You won $10!');
            break;
        case '$20':
            spinAmountWon = 20;
            $('#spin-text-error').html('You won $20!');
            break;
        case '$30':
            spinAmountWon = 30;
            $('#spin-text-error').html('You won $30!');
            break;
        case '$50':
            spinAmountWon = 50;
            $('#spin-text-error').html('You won $50!');
            break;
        case '$100':
            spinAmountWon = 100;
            $('#spin-text-error').html('You hit the JACKPOT of $100!');
            break;
        default:
            $('#spin-text-error').css('color', 'red');
            $('#spin-text-error').html('You did not win anything!');
            $('#spin-button').attr("disabled", false); // Enable button lose
    }
    $('#spin-text-error').show();
    ModifyAccountBalance(spinAmountWon, 0, 0, 0);
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.
    $('#spin-text').html("SPIN");   // Reset button text to Spin
    $('.game-spin-loading').hide(); // Hide lottie animation
    $('#spin-text').show();         // Show button text
    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
    setTimeout(function(){$('#spin-text-error').hide();}, 5000);
}

function ModifyAccountBalance(spinAmountWon, spinCost, flipAmountWon, flipCost) {
    if (spinExpired == false) { // Display spin lottie animation only when spin not expired
        $('.game-spin-loading').show();
        $('#spin-text').hide();
    }
    else { // Display flip lottie animation only when flip not expired
        $(".flip-button").attr("disabled", true);
        $('.game-flip-loading').show();
    }

    if (accLoggedIn != null) { // Check if user is logged in
        if (spinAmountWon > 0 || spinCost == 1 || flipAmountWon > 0 || flipCost == 3) {
            $.ajax({ // Get account data from database
                "async": true,
                "crossDomain": true,
                "url": `https://sneakerzone-11b9.restdb.io/rest/account-info/${accLoggedIn[0]}`,
                "method": "GET",
                "headers": {
                    "content-type": "application/json",
                    "x-apikey": APIKEY,
                    "cache-control": "no-cache"
                }
            }).done(function (account) {
                $('.game-spin-loading').hide(); // Hide spin lottie loading animation
                $('#spin-text').show(); // Display spin text
                $('#spin-text-error').show(); // Show spin text error
                if (flipAmountWon == 0 && flipCost == 0) { // To check if user playing SPIN WHEEL
                    if (account.coupon - spinCost < 0) { // Check if user has sufficient game coupons
                        $('#spin-text-error').css('color', 'red');
                        $('#spin-text-error').html('Not enough GC!');
                        setInterval(function(){$('#spin-text-error').hide();}, 3000);
                    }
                    else {
                        if (spinExpired == true) { // Check if game expired
                            $('#spin-text-error').css('color', 'red');
                            $('#spin-text-error').html('Game has already expired, wait for next opening time!');
                        }
                        else {
                            $('#spin-text-error').hide();
                            if (spinCost == 1 && wheelSpinning == false) {
                                account.coupon -= spinCost;
                                // Ensure that spinning can't be clicked again while already running.
                                theWheel.animation.spins = 8;
                                $('#spin-text').html("SPINNING");
                                // Begin the spin animation by calling startAnimation on the wheel object.
                                theWheel.startAnimation();
                                // the current animation. The user will have to reset before spinning again.
                                wheelSpinning = true;
                                $('#spin-button').attr("disabled", true);
                            }
                            if (spinAmountWon > 0) { // Check if user win prize from spin wheel
                                account.balance += spinAmountWon; // Add amount won to account balance
                                addTransactionInfo(account._id, account.balance, 3, spinAmountWon, new Date($.now())); // Add transaction info
                            }
                            updateAccount(account); // Update account information
                        }
                    }
                }
                if (spinAmountWon == 0 && spinCost == 0) { // To check if user playing COIN FLIP
                    if (account.coupon - flipCost < 0) { // Check if user has sufficient game coupons
                        $('#flip-text-error').show();
                        $('#flip-text-error').css('color', 'red');
                        $('#flip-text-error').html('Not enough GC!');
                        setTimeout(function(){$('#flip-text-error').hide();}, 5000);
                    }
                    else {
                        account.coupon -= flipCost; // Deduct game coupon
                        if (flipCost == 3) startFlip(); // Start flip if user paid
                        else if (flipAmountWon > 0) { // Check if user win prize from coin flip
                            account.balance += flipAmountWon; // Add amount won to account balance
                            updateAccount(account); // Update account information
                            addTransactionInfo(account._id, account.balance, 9, flipAmountWon, new Date($.now())); // Add transaction info
                        }
                    }
                }
            }).fail(function () { window.location.href = 'index.html'; }); // In case function fails, re-direct user to home page
        }
    }
}

// Update account information function
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
    }).done(function () { 
        // Enable both buttons when PUT successfully
        $(".flip-button").attr("disabled", false); 
        $('#spin-button').attr("disabled", false);
    });
}

// Add Transaction Info function
function addTransactionInfo(userID, balance, moneySpent, purchaseData, purchaseDateTime) {
    var jsondata = {
        "userID": userID, 
        "balance": balance, 
        "moneySpent": moneySpent, 
        "purchaseType": 'GameWin', 
        "purchaseData": purchaseData, 
        "purchaseDateTime": purchaseDateTime
    };

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://sneakerzone-11b9.restdb.io/rest/transaction-info",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    });
}