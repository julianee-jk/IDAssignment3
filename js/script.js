const APIKEY = "601a5d306adfba69db8b6cfc";
const accLoggedIn = JSON.parse(localStorage.getItem('accLoggedIn'));

$(document).ready(function() {
    if (accLoggedIn != null) { // Check if the user is logged in
        $('#login-text').hide(); // Hide login text in nav bar
        $('#name-text').html(accLoggedIn[1]); // Set it to account name
        $('#name-text').show(); // Display the account name in nav bar
    }

    $("#login-text").on("click", function() { // Hide error messages on nav bar login button click
        $('#login-form-text-error').hide();
        $('#create-form-text-error').hide();
    });

    $("#createModalButton").on("click", function() { // Close login modal when create modal open
        $('#login-modal').modal('hide');
        $('#create-modal').modal('show');
        $('#login-form-text-error').hide();
    });
    
    $("#loginModalButton").on("click", function() { // Close create modal when login modal open
        $('#create-modal').modal('hide');
        $('#login-modal').modal('show');
        $('#create-form-text-error').hide();
    });

    $("#login-form").submit(function(e) {
        e.preventDefault();
        loginAccount();
    });

    $("#create-form").submit(function(e) {
        e.preventDefault();
        validateNewAccount();
    });
});

function loginAccount() {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://sneakerzone-11b9.restdb.io/rest/account-info",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
    })
    .done(function(response) {
        var accountFound = false;
        response.map((account) => {
            if ($("#login-name").val() === account.name && $("#login-password").val() === account.password) {
                setAccount(account._id, account.name);
                accountFound = true;
            }
        })

        if (accountFound == false) {
            $('#create-form-text-error').hide();
            $('#login-form-text-error').html('Invalid Account Name or Password!');
            $('#login-form-text-error').css('color','red');
            $('#login-form-text-error').show();
        }
    });
}

function setAccount(id, name) {
    $('#login-form-text-error').hide();
    localStorage.setItem("accLoggedIn", JSON.stringify([id, name]));
    $('#loginModal').modal('hide');
    location.reload();
}

function validateNewAccount() {
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://sneakerzone-11b9.restdb.io/rest/account-info",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
    })
    .done(function(response) {
        var checkName = true;

        response.map((account) => {
            if ($("#create-name").val() === account.name) {
                $('#login-form-text-error').hide();
                $('#create-form-text-error').html('Account Name Already Exists!');
                $('#create-form-text-error').css('color','red');
                $('#create-form-text-error').show();
                checkName = false;
            }
        })

        if (checkName) {
            if (new Date($("#create-dob").val()) > new Date) {
                $('#login-form-text-error').hide();
                $('#create-form-text-error').html('Invalid Account Details!');
                $('#create-form-text-error').css('color','red');
                $('#create-form-text-error').show();
            }

            else {
                createAccount();
            }
        }
    });
}

function createAccount() {
    var jsondata = { 
        "name": $("#create-name").val(), 
        "dob": $("#create-dob").val(), 
        "password": $("#create-password").val(), 
        "balance": 0,
        "coupon": 0,
        "dailyStreak": 0,
        "lastDaily": null
    }; 

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://sneakerzone-11b9.restdb.io/rest/account-info",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    })
    .done(function() {
        $('#login-form-text-error').html('Account created successfully! Please log in again.');
        $('#login-form-text-error').css('color','green');
        $('#create-modal').modal('hide');
        $('#login-modal').modal('show');
        $('#create-form-text-error').hide();
        $('#login-form-text-error').show();
    })
}