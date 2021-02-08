var accLoggedIn = JSON.parse(localStorage.getItem('accLoggedIn'));

$(document).ready(function() {
    $('#account-bal-error').hide()
    if (accLoggedIn != null) { // Check if user is logged in
        var account = getAccount(accLoggedIn[0]);
        var topupChoice = '', topupGCChoice = '';

        $('#add-gc').on("click", function() { 
            $('#account-bal-error').hide()
        });

        $('#addBal-button').on("click", function() {
            var topupValue = document.getElementsByName('topup-value');
            for (let i = 0; i < topupValue.length; i++) {
                if (topupValue[i].checked) {
                    topupChoice = topupValue[i].value; // Get topup-value radio button value
                }
            }

            switch(topupChoice) {
                case '$10':
                    account.balance += 10;
                    break;

                case '$15':
                    account.balance += 15;
                    break;

                case '$20':
                    account.balance += 20;
                    break;

                case '$50':
                    account.balance += 50;
                    break;
            }

            updateAccount(account);
        });
        
        $('#addGC-button').on("click", function() {
            $('#account-bal-error').hide()
            var topupGCValue = document.getElementsByName('topupgc-value');
            for (let i = 0; i < topupGCValue.length; i++) {
                if (topupGCValue[i].checked) {
                    topupGCChoice = topupGCValue[i].value; //Get topupgc-value radio button value
                }
            }

            let gcCost = 0, couponAmt = 0;
            switch(topupGCChoice) {
                case '1GC':
                    couponAmt = 1;
                    gcCost = 3; // 1GC for $3
                    break;

                case '5GC':
                    couponAmt = 5;
                    gcCost = 14;// 5GC for $14
                    break;

                case '15GC':
                    couponAmt = 15;
                    gcCost = 43;// 15GC for $43
                    break;

                case '50GC':
                    couponAmt = 50;
                    gcCost = 145;// 50GC for $145
                    break;
            }
             
            // Check if sufficient account balance
            if (account.balance - gcCost <= 0) $('#account-bal-error').show();
            else { account.balance -= gcCost; account.coupon += couponAmt; }
            
            updateAccount(account);
        });

        $("#logout-button").click(function (e) {
            localStorage.removeItem('accLoggedIn');
            window.location.href = 'index.html';
        });
        
        $("#changePass-text").click(function (e) {
            $('#changeAccountPass-text').html('Change Account Password');
            $('#changeAccountPass-text').css('color', 'black');
        });

        $("#changePass-button").on("click", function () {
            account.password = $("#change-pass").val();
            updateAccount(account);
            
            // Add validation
            $('#changeAccountPass-text').html('Password Changed!');
            $('#changeAccountPass-text').css('color', 'green');
            
            console.log('Password Updated!');
        });
    }
    else window.location.href = 'index.html';
});

// Get account data from database
function getAccount(id) {
    var output;

    let settings = {
        "async": false, // it will work now. But need to revise later
        "crossDomain": true,
        "url": `https://sneakerzone-11b9.restdb.io/rest/account-info/${id}`,
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
    }

    $.ajax(settings).done(function(account) {
        $('#account-name').html(account.name);
        $('.account-bal').html(account.balance);
        $('.account-gc').html(account.coupon);

        output = account;
    });
    
    return output;
};

function updateAccount(account) {
    $('.account-bal').html(account.balance);
    $('.account-gc').html(account.coupon);

    var jsondata = { 
        "name": account.name, 
        "dob": account.dob, 
        "password": account.password, 
        "balance": account.balance, 
        "coupon": account.coupon
    };

    var settings = {
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
    }

    $.ajax(settings).done(function () {
        console.log('Account Info Updated.');
    });
}