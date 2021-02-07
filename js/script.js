$(document).ready(function () {
    $("form").submit(function() { // disable refresh when user press enter.
        return false;
    });

    // Close login modal when create modal open
    $("#createModalButton").click(function (e) {
        $('#loginModal').modal('hide');
        $('#createModal').modal('show');
        $('#login-form-text-error').hide();
    });

    // Close create modal when login modal open
    $("#loginModalButton").click(function (e) {
        $('#createModal').modal('hide');
        $('#loginModal').modal('show');
        $('#create-form-text-error').hide();
    });

    // Reset login header text
    $("#login-text").click(function (e) {
        $('#login-form-text-error').hide();
        $('#create-form-text-error').hide();
    });

    $('#name-text').hide();

    // Check if user is logged in
    const value = localStorage.getItem('accountLoggedIn')
    if (value != null) {
        $('#name-text').html(value);
        $('#login-text').hide();
        $('#name-text').show();
        $('#account-name').html(value);
    }
    
    const APIKEY = "601a5d306adfba69db8b6cfc";
    getAccountData();

    $("#create-button").on("click", function (e) {
        e.preventDefault();

        let name = $("#create-name").val();
        let dob = $("#create-dob").val();
        let password = $("#create-password").val();
        let balance = 0;

        let jsondata = {
            "name": name,
            "dob": dob,
            "password": password,
            "balance": balance
        };

        let settings = {
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

        $.ajax(settings).done(function (response) {
            console.log(response);
            getAccountData(); // Update
            $('#login-form-text-error').html('Account created successfully! Please log in again.');
            $('#login-form-text-error').css('color','green');
            $('#createModal').modal('hide');
            $('#loginModal').modal('show');
            $('#login-form-text-error').show();
            $('#create-form-text-error').hide();
        });
    });

    function getAccountData(limit = 10, all = true) {

        let settings = {
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

        $.ajax(settings).done(function (response) {
            $("#create-button").click(function (e) {
                for (let i = 0; i < response.length && i < limit; i++) { 
                    if (response[i].name === $('#create-name').val()) {
                        $('#create-form-text-error').show();
                        $('#login-form-text-error').hide();
                    }
                }
            });

            $("#login-button").click(function (e) {
                for (let i = 0; i < response.length && i < limit; i++) {
                    if ($("#login-name").val() === response[i].name && $("#login-password").val() === response[i].password) {
                        $('#login-text').html(response[i].name);
                        $('#login-form-text-error').hide();
                        localStorage.setItem("accountLoggedIn",response[i].name);
                        $('#loginModal').modal('hide')
                        location.reload();
                        break;
                    }

                    else {
                        $('#login-form-text-error').html('Invalid Account Name or Password!');
                        $('#login-form-text-error').css('color','red');
                        $('#login-form-text-error').show();
                        $('#create-form-text-error').hide();
                        continue;
                    }
                }
            });
        });
    }
});