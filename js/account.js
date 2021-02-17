$(document).ready(function() {
    loadDailyButtons();
    if (accLoggedIn != null) { // Check if user is logged in
        accountDashboard(accLoggedIn[0]);
        var dailyGCGain = 0;
        var recentlyCollected = false;
        $('#account-name').html(accLoggedIn[1]);
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
            if (account.lastDaily == null) { account.lastDaily = new Date($.now() - 86400000) } // Set new account lastDaily to 1 day ago
            // Check dailystreak and set game coupon
            if (account.dailyStreak >= 0 && account.dailyStreak <= 3) dailyGCGain = 1;
            else if (account.dailyStreak > 3 && account.dailyStreak <= 6) dailyGCGain = 2;
            else if (account.dailyStreak > 6 && account.dailyStreak <= 50) dailyGCGain = 3;
                
            $('#daily-streak-id').html(account.dailyStreak);
            $('#daily-streak-gc').html(dailyGCGain);
            $('.account-balance').html(account.balance);
            $('.account-gc').html(account.coupon);
        
            $('#topUp-balance-button').on("click", function() {
                $('#topUp-balance-button').attr("disabled", true);
                var topUpBalance = $('input[name=topUpBalance]:checked').val();
                switch(topUpBalance) {
                    case '$10':
                        topUpValue = 10;
                        account.balance += topUpValue;
                        break;
                    case '$50':
                        topUpValue = 50;
                        account.balance += topUpValue;
                        break;
                    case '$100':
                        topUpValue = 100;
                        account.balance += topUpValue;
                        break;
                    case '$150':
                        topUpValue = 150;
                        account.balance += topUpValue;
                        break;
                }
                addTransactionInfo(account._id, account.balance, topUpValue, topUpValue, new Date($.now()));
                $('#topup-bal-text').html('');
                $('#topup-bal-text').append(`Added $${topUpValue} to balance.`);
                $('#topup-bal-text').show();
                setInterval(function(){$('#topup-bal-text').hide();}, 3000);
                setTimeout(function(){$('#topUp-balance-button').attr("disabled", false);}, 3000);
                updateAccount(account);
            });

            $('#topUp-gc-button').on("click", function() {
                $('#topUp-gc-button').attr("disabled", true);
                var topUpGC = $('input[name=topUpGC]:checked').val();
                var gcCost = 0, coupon = 0;

                switch(topUpGC) {
                    case '1GC':
                        coupon = 1;
                        gcCost = 3; // 1GC for $3
                        break;
                    case '5GC':
                        coupon = 5;
                        gcCost = 14; // 5GC for $14
                        break;
                    case '15GC':
                        coupon = 15;
                        gcCost = 43; // 15GC for $43
                        break;
                    case '50GC':
                        coupon = 50;
                        gcCost = 145; // 50GC for $145
                        break;
                }

                if (account.balance - gcCost < 0) { // Check if sufficient account balance
                    $('#account-gc-error').show(); 
                }

                else { 
                    $('#account-gc-error').hide(); 
                    account.balance -= gcCost;
                    account.coupon += coupon;
                    updateAccount(account);
                    setTimeout(function(){$('#topUp-gc-button').attr("disabled", false);}, 3000);
                }
            });
            
            $("#password-change").submit(function(e) {
                e.preventDefault();
                account.password = $("#new-password").val();
                updateAccount(account);
                $('#password-change-text').show();
            });

            $("#logout-button").on("click", function() {
                localStorage.removeItem('accLoggedIn');
                window.location.href = 'index.html';
            });

            $("#delete-account").on("click", function() {
                localStorage.removeItem('accLoggedIn');
                deleteAccount(account);
            })

            // On page load, automatically enable button according to daily streak
            var firstButton = $("#day1Button");
            if (account.dailyStreak == 1)
                firstButton = $("#day2Button");
            else if (account.dailyStreak == 2)
                firstButton = $("#day3Button");
            else if (account.dailyStreak == 3)
                firstButton = $("#day4Button");
            else if (account.dailyStreak == 4)
                firstButton = $("#day5Button");
            else if (account.dailyStreak == 5)
                firstButton = $("#day6Button");
            else if (account.dailyStreak >= 6)
                firstButton = $("#day7Button");
            $(firstButton).attr("disabled", false);
            
            // Every daily button click, go next button, disable previous
            $('.dailyButton').on("click", function(e) {
                var streakBroken = false;
                var currentTime = new Date();
                var timeSinceLastDaily = currentTime - new Date(account.lastDaily);
                // Check if last daily collection is between next 24hours & before next 48hours
                if (timeSinceLastDaily > 86400000 && timeSinceLastDaily < 172800000) {
                    account.dailyStreak += 1; // Increase daily streak by 1
                    account.lastDaily = new Date($.now()); // Set last daily to current date
                    $('#daily-collect-text').html('Daily Collected!'); // Set daily alert text & show
                    if (account.dailyStreak >= 0 && account.dailyStreak <= 3 && recentlyCollected == false) {
                        dailyGCGain = 1;
                        account.coupon += 1;
                    } else if (account.dailyStreak > 3 && account.dailyStreak <= 6 && recentlyCollected == false) {
                        dailyGCGain = 2;
                        account.coupon += 2;
                    } else if (account.dailyStreak > 6 && account.dailyStreak <= 50 && recentlyCollected == false) {
                        dailyGCGain = 3;
                        account.coupon += 3;
                    }
                }
                // If more than 2 days, reset streak.
                else if (timeSinceLastDaily > 172800000) { 
                    account.dailyStreak = 0; 
                    account.lastDaily = new Date($.now() - 86400000); // Set last daily to current date
                    $('#daily-collect-text').html('You missed a day! Your daily streak has been broken! Claim it again!');
                    streakBroken = true;
                }
                // Check if user recently collect daily
                else {
                    $('#daily-collect-text').html('You recently collected your daily! Come back tomorrow!');
                    recentlyCollected = true;
                }
                $('#daily-collect-text').show();
                setInterval(function(){$('#daily-collect-text').hide();}, 3000);

                // Next button 
                if (e.target.innerHTML == 'Day 7') { $(firstButton).attr("disabled", false); } 
                else {
                    if (recentlyCollected == false) {
                        firstButton = firstButton.next();
                        $(this).attr("disabled", true);
                        $(firstButton).attr("disabled", false);
                        updateAccount(account);
                    }
                    if (streakBroken == true) {
                        $(firstButton).attr("disabled", true);
                        $('#day1Button').attr("disabled", false);
                        firstButton = $("#day1Button");
                    }
                }

                // Check daily streak (Increase coupon gain with higher streaks) & Add coupon
                $('#daily-streak-id').html(account.dailyStreak);
                $('#daily-streak-gc').html(dailyGCGain);
            });
        })
        .fail(function() { window.location.href = 'index.html' });
    }
    else window.location.href = 'index.html';
});

function updateAccount(account) {
    $('.account-balance').html(account.balance);
    $('.account-gc').html(account.coupon);

    var jsondata = { 
        "name": account.name, 
        "dob": account.dob, 
        "password": account.password, 
        "balance": account.balance, 
        "coupon": account.coupon,
        "dailyStreak": account.dailyStreak,
        "lastDaily": account.lastDaily
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

function deleteAccount(account) {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": `https://sneakerzone-11b9.restdb.io/rest/account-info/${account._id}`,
        "method": "DELETE",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        }
    })
    .done(function() {
        console.log("Account Deleted.");
        window.location.href = 'index.html';
    });
}
function addTransactionInfo(userID, balance, moneySpent, purchaseData, purchaseDateTime) {
    var jsondata = {
        "userID": userID, 
        "balance": balance, 
        "moneySpent": moneySpent, 
        "purchaseType": 'BalanceTopUp', 
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
    })
}

function accountDashboard(id) {
    $.ajax({ // Get account data from database
        "async": true,
        "crossDomain": true,
        "url": `https://sneakerzone-11b9.restdb.io/rest/transaction-info?q={"userID": "${id}"}`,
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
    })
    .done(function(transaction) {
        var spendingArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var winningsArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        
        for (let i = 0; i < transaction.length; i++) {
            if (transaction[i].purchaseType == 'Product') {
                for (let x = 0; x < 12; x++) {
                    if (new Date(transaction[i].purchaseDateTime).getMonth() == x) spendingArray[x] += transaction[i].moneySpent;
                    else continue;
                }
            }
            else {
                for (let x = 0; x < 12; x++) {
                    if (new Date(transaction[i].purchaseDateTime).getMonth() == x) winningsArray[x] += transaction[i].moneySpent;
                    else continue;
                }
            }
        }
        $('.chart-loading-box').hide();
        $('.chart-box').show();
        // BalanceTopup & Product
        spendingsChart = new Chart($('#spendings-chart')[0].getContext('2d'), {
            type: 'line', // The type of chart we want to create
            data: { // The data for our dataset
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Account Spendings in 2021',
                    backgroundColor: '#4F359B',
                    borderColor: '#2e1e5f',
                    data: [spendingArray[0], spendingArray[1], spendingArray[2], spendingArray[3], spendingArray[4], 
                    spendingArray[5], spendingArray[6], spendingArray[7], spendingArray[8], spendingArray[9], 
                    spendingArray[10], spendingArray[11], spendingArray[12]]
                }]
            },
            options: { maintainAspectRatio: false } // Configuration options go here
        });

        winningsChart = new Chart($('#winnings-chart')[0].getContext('2d'), {
            type: 'line', // The type of chart we want to createv
            data: { // The data for our dataset
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Account Winnings in 2021',
                    backgroundColor: '#4F359B',
                    borderColor: '#2e1e5f',
                    data: [winningsArray[0], winningsArray[1], winningsArray[2], winningsArray[3], winningsArray[4], 
                    winningsArray[5], winningsArray[6], winningsArray[7], winningsArray[8], winningsArray[9], 
                    winningsArray[10], winningsArray[11], winningsArray[12]]
                }]
            },
            options: { maintainAspectRatio: false } // Configuration options go here
        });
    });
}

function loadDailyButtons() {
    for (let i = 1; i <= 7; i++) {
        $('.daily-button-box').append(`<button class="btn btn-outline-primary dailyButton" disabled="disabled" id="day${i}Button">Day ${i}</button>`)
    }
}