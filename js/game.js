let spinExpired = false, flipExpired = false
let wheelSpinning = false; // Spin N Win
let coinFlipping = false, heads = false, tails = false, headWin = false, tailWin = false; // Coin flip

$(document).ready(function () {
    var accLoggedIn = localStorage.getItem('accLoggedIn');
    if (accLoggedIn == null) {
        window.location.href = 'index.html';
    }

    $('#countdown-flip').html('GAME EXPIRED');
    spinTimer();
    $('#flip-play-button').on('click', function () {
        $('#flip-text-error').hide();
    });

    $('#spin-play-button').on('click', function () {
        $('#spin-text-error').hide();
    });
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
        // Alternate timer
        if (distance < 0) {
            clearInterval(x);
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

        // Display the result in the element with id="countdown-flip"
        $('#countdown-flip').html(`
            <div id="countdown-box">
                <div class="countdown-timer">${hours}<div class="countdown-text">HOURS</div></div>
                <div class="countdown-timer">${minutes}<div class="countdown-text">MINS</div></div>
                <div class="countdown-timer">${seconds}<div class="countdown-text">SECS</div></div>
            </div>
        `);
        // If the count down is finished, check
        if (distance < 0) {
            clearInterval(x);
            $('#countdown-flip').html('GAME EXPIRED');
            flipExpired = true, spinExpired = false;
            spinTimer();
        }
    }, 1000)
};

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
    $('#flip-text-error').hide();
    // Ensure that flipping can't be clicked again while already running.
    if (flipExpired == true) {
        $('#flip-text-error').css('color', 'red');
        $('#flip-text-error').html('Game has already expired, wait for next opening time!');
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
        }
    }
    // Set 2 secs cooldown
    var timeleft = 2;
    var flipAmountWon = 0;
    var downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
            clearInterval(downloadTimer);
            $('#flip-text-error').show();
            // Check if heads win & Check if user picked heads - Win || Check if tails win & Check if user picked tails - Win
            if (headWin == true && heads == true || tailWin == true && tails == true) {
                flipAmountWon = 18;
                $('#flip-text-error').css('color', 'green');
                $('#flip-text-error').html('You won $18!');
            }
            else if (headWin == true && heads == false || tailWin == true && tails == false) {
                $('#flip-text-error').css('color', 'red');
                $('#flip-text-error').html('You lost!');
            }
            ModifyAccountBalance(0, 0, flipAmountWon, 0);
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

// Spin Wheel Function
let theWheel = new Winwheel({
    'numSegments': 20,    // Number of segments
    'outerRadius': 212,   // The size of the wheel.
    'centerX': 217,       // Used to position on the background correctly.
    'centerY': 219,
    'textFontSize': 25,   // Font size.
    'segments': [         // Definition of all the segments.
        { 'fillStyle': '#ffb217', 'text': '$100' }, { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '' },     { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '$20' },  { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '' },     { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '$20' },  { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '' },     { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '$30' },  { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '' },     { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '$50' },  { 'fillStyle': '#c8b0d9', 'text': '' },
        { 'fillStyle': '#9560a6', 'text': '' },     { 'fillStyle': '#c8b0d9', 'text': '' }
    ],
    'animation': // Definition of the animation
    {
        'type': 'spinToStop',
        'duration': 5,
        'spins': 8,
        'callbackFinished': alertPrize
    }
});

// Called when the animation has finished.
function alertPrize(indicatedSegment) {
    var spinAmountWon = 0;
    $('#spin-text-error').css('color', 'green');
    switch (indicatedSegment.text) {
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
            $('#spin-text-error').html('You won $100!');
            break;
        default:
            $('#spin-text-error').css('color', 'red');
            $('#spin-text-error').html('You did not win anything!');
    }
    $('#spin-text-error').show();
    ModifyAccountBalance(spinAmountWon, 0, 0, 0);
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.
    $('#spin-button').html('SPIN');
    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}

function ModifyAccountBalance(spinAmountWon, spinCost, flipAmountWon, flipCost) {
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
                },
            }).done(function (account) {
                if (flipAmountWon == 0 && flipCost == 0) {
                    if (account.coupon - spinCost < 0) {
                        $('#spin-text-error').show();
                        $('#spin-text-error').css('color', 'red');
                        $('#spin-text-error').html('Not enough GC!');
                    }
                    else {
                        if (spinExpired == true) {
                            $('#spin-text-error').css('color', 'red');
                            $('#spin-text-error').html('Game has already expired, wait for next opening time!');
                        }
                        else {
                            $('#spin-text-error').hide();
                            account.coupon -= spinCost;
                            if (spinCost == 1) {
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
                            if (spinAmountWon > 0) {
                                account.balance += spinAmountWon;
                                updateAccount(account);
                                addTransactionInfo(account._id, account.balance, 3, 'SpinwheelWin', spinAmountWon, new Date($.now()));
                            }
                        }
                    }
                }
                if (spinAmountWon == 0 && spinCost == 0) {
                    if (account.coupon - flipCost < 0) {
                        $('#flip-text-error').show();
                        $('#flip-text-error').css('color', 'red');
                        $('#flip-text-error').html('Not enough GC!');
                    }
                    else {
                        $('#spin-text-error').hide();
                        account.coupon -= flipCost;
                        if (flipCost == 3) {
                            startFlip();
                        }
                        if (flipAmountWon > 0) {
                            account.balance += flipAmountWon;
                            updateAccount(account);
                            addTransactionInfo(account._id, account.balance, 9, 'CoinflipWin', flipAmountWon, new Date($.now()));
                        }
                    }
                }
            }).fail(function () { window.location.href = 'index.html' });
        }
    }
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
    }).done(function () {
        console.log("Account Info Updated.");
    });
}

function addTransactionInfo(userID, balance, moneySpent, purchaseType, purchaseData, purchaseDateTime) {
    var jsondata = {
    "userID": userID, 
    "balance": balance, 
    "moneySpent": moneySpent, 
    "purchaseType": purchaseType, 
    "purchaseData": purchaseData, 
    "purchaseDateTime": purchaseDateTime}

    var settings = {
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
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}