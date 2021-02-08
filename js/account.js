$(document).ready(function () {
    const APIKEY = "601a5d306adfba69db8b6cfc";
    // Check if user is logged in
    const value = localStorage.getItem('accountLoggedIn')

    if (value != null) {
        getAccountData(value);
    }

    else  {
        window.location.href = 'index.html';
    }

    $("#addBal-button").click(function (e) { 
        getAccountData();
    });

    $("#logout-button").click(function (e) {
        localStorage.removeItem('accountLoggedIn');
        window.location.href = 'index.html';
    });
    
    $("#changePass-text").click(function (e) {
        $('#changeAccountPass-text').html('Change Account Password');
        $('#changeAccountPass-text').css('color', 'black');
    });
});

// Get account data from database
function getAccountData(id) {
    var topupChoice = '', topupGCChoice = '';
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://sneakerzone-11b9.restdb.io/rest/account-info/${id}`,
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
    }

    // Loop to continously add on data
    $.ajax(settings).done(function (response) {
        $('#account-name').html(response.name);
        // On login click, check if login info is same as database info
        $("#changePass-button").on("click", function (e) {
            e.preventDefault();
            let newPass = $("#change-pass").val();
            let id = response._id;
            let accName = response.name;
            let accDob = response.dob;
            let accountBal = response.balance;
            let accCoupon = response.coupon;

            updateAccountInfo(id, accName, accDob, newPass, accountBal, accCoupon);
            // Add validation
            $('#changeAccountPass-text').html('Password Changed!');
            $('#changeAccountPass-text').css('color', 'green');
            console.log('Password Updated!');
        });

        let accPass = response.password;
        let id = response._id
        let accName = response.name;
        let accDob = response.dob
        let accountBal = response.balance
        let accountCoupon = response.coupon;
        $('#account-bal-id').html(accountBal);
        $('#account-bal-id2').html(accountBal);
        $('#account-gc-id').html(accountCoupon);
        $('#account-gc-id2').html(accountCoupon);

        $('#addBal-button').on("click", function() {
            var topupValue = document.getElementsByName('topup-value');
            for (let i = 0; i < topupValue.length; i++) {
                if (topupValue[i].checked) {
                    topupChoice = topupValue[i].value; //Get topup-value radio button value
                }
            }
            switch(topupChoice) {
                case '$10':
                    accountBal += 10;
                    break;
                case '$15':
                    accountBal += 15;
                    break;
                case '$20':
                    accountBal += 20;
                    break;
                case '$50':
                    accountBal += 50;
                    break;
            }
            updateAccountInfo(id, accName, accDob, accPass, accountBal, accountCoupon);
            $('#account-bal-id').html(accountBal);
            $('#account-bal-id2').html(accountBal);
        });
        
        $('#addGC-button').on("click", function() {
            var topupGCValue = document.getElementsByName('topupgc-value');
            for (let i = 0; i < topupGCValue.length; i++) {
                if (topupGCValue[i].checked) {
                    topupGCChoice = topupGCValue[i].value; //Get topup-value radio button value
                }
            }

            switch(topupGCChoice) {
                case '1GC':
                    accountCoupon += 1;
                    break;
                case '5GC':
                    accountCoupon += 5;
                    break;
                case '15GC':
                    accountCoupon += 15;
                    break;
                case '50GC':
                    accountCoupon += 50;
                    break;
            }
            updateAccountInfo(id, accName, accDob, accPass, accountBal, accountCoupon);
            $('#account-gc-id').html(accountCoupon);
            $('#account-gc-id2').html(accountCoupon);
        });
    })
};

function updateAccountInfo(id, accName, accDob, newPass, accountBal, accountCoupon) {
    
    //@TODO create validation methods for id etc. 
    var jsondata = { "name": accName, "dob": accDob, "password": newPass, "balance": accountBal, "coupon": accountCoupon};
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
            console.log('Account info updated.');
        });
}