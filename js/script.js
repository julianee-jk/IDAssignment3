// create accounts never really touched much. Still got that for loop
// fail

const APIKEY = "601a5d306adfba69db8b6cfc";

$(document).ready(function () {
    $("form").submit(function() { return false }); // disable refresh when user press enter.

    $('#name-text').hide();
    var accLoggedIn = localStorage.getItem('accLoggedIn')
    
    if (accLoggedIn != null) {
        accLoggedIn = JSON.parse(accLoggedIn);
        $('#login-text').hide(); // Hide Login text in nav bar
        $('#name-text').html(accLoggedIn[1]); // Set nav bar name to account's name
        $('#name-text').show(); // Show Name text in nav bar
    }

    // Close login modal when create modal open
    $("#createModalButton").on("click", function(e) {
        $('#loginModal').modal('hide');
        $('#createModal').modal('show');
        $('#login-form-text-error').hide();
    });
    
    // Close create modal when login modal open
    $("#loginModalButton").on("click", function(e) {
        $('#createModal').modal('hide');
        $('#loginModal').modal('show');
        $('#create-form-text-error').hide();
    });

    // Reset login/create error message
    $("#login-text").on("click", function(e) {
        $('#login-form-text-error').hide();
        $('#create-form-text-error').hide();
    });

    $("#login-button").on("click", function() {
        loginAccount();
    });

    $("#create-button").on("click", function(e) {
        createAccount();
    });
});

function loginAccount() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://sneakerzone-11b9.restdb.io/rest/account-info",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
    }

    $.ajax(settings).done(function(response) {
        response.map((account) => {
            if ($("#login-name").val() === account.name && $("#login-password").val() === account.password) {
                setAccount(account._id, account.name);
            }
        })

        $('#create-form-text-error').hide();
        $('#login-form-text-error').html('Invalid Account Name or Password!');
        $('#login-form-text-error').css('color','red');
        $('#login-form-text-error').show();            

        $("#create-button").click(function() {
            $('#login-form-text-error').hide();

            for (let i = 0; i < response.length; i++) {
                if (response[i].name === $('#create-name').val()) {
                    $('#create-form-text-error').show();
                }
            }
        });
    });
}

function setAccount(id, name) {
    $('#login-form-text-error').hide();
    localStorage.setItem("accLoggedIn", JSON.stringify([id, name]));
    $('#loginModal').modal('hide');
}

function createAccount() {
    var jsondata = { 
        "name": $("#create-name").val(), 
        "dob": $("#create-dob").val(), 
        "password": $("#create-password").val(), 
        "balance": 0,
        "coupon": 0 
    };

    var settings = {
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
    }

    $.ajax(settings).done(function() {
        $('#login-form-text-error').html('Account created successfully! Please log in again.');
        $('#login-form-text-error').css('color','green');
        $('#createModal').modal('hide');

        $('#loginModal').modal('show');
        $('#create-form-text-error').hide();
        $('#login-form-text-error').show();
    })

    $.ajax(settings).fail(function(response) {
        console.log(response);
    })
}