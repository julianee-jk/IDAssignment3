// Close login modal when create modal open
$("#createModalButton").click(function (e) {
    $('#loginModal').modal('hide')
});

// Close create modal when login modal open
$("#loginModalButton").click(function (e) {
    $('#createModal').modal('hide')
});

// Reset login header text
$("#login-text").click(function (e) {
    $('#login-header-text').html('Login');
    $('#login-header-text').css('color', 'black');
});

//[STEP 0]: Make sure our document is A-OK
$(document).ready(function () {
    $('#name-text').hide();
    $("form").submit(function() { // disable refresh when user press enter.
        return false;
    });

    // Check if user is logged in
    const value = localStorage.getItem('accountLoggedIn')
    if (value != null) {
        $('#name-text').html(value);
        $('#login-text').hide();
        $('#name-text').show();
        $('#account-name').html(value);
    }
    //what kind of interface we want at the start 
    const APIKEY = "601a5d306adfba69db8b6cfc";
    getAccountData();
    //[STEP 1]: Create our submit form listener
    $("#create-button").on("click", function (e) {
        //prevent default action of the button 
        e.preventDefault();

        //[STEP 2]: let's retrieve form data
        let name = $("#create-name").val();
        let dob = $("#create-dob").val();
        let password = $("#create-password").val();
        let balance = 0;

        //[STEP 3]: get form values when user clicks on send
        let jsondata = {
            "name": name,
            "dob": dob,
            "password": password,
            "balance": balance
        };
        console.log(jsondata);
        //[STEP 4]: Create our AJAX settings. Take note of API key
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

        // Send our ajax request over to the DB
        $.ajax(settings).done(function (response) {
            console.log(response);
            getAccountData(); // Update
            // localStorage.setItem('accountBal', 0)
            alert('Account successfully create! Login again!');
            $('#createModal').modal('hide')
            $('#loginModal').modal('show')
        });
    });//end click 

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
            // On login click, check if login info is same as database info
            $("#login-button").click(function (e) {
                for (let i = 0; i < response.length && i < limit; i++) {
                    if ($("#login-name").val() === response[i].name && $("#login-password").val() === response[i].password) {
                        $('#login-text').html(response[i].name);
                        localStorage.setItem("accountLoggedIn",response[i].name);
                        $('#loginModal').modal('hide')
                        location.reload();
                        break;
                    }
                    else {
                        $('#login-header-text').html('Invalid Details!');
                        $('#login-header-text').css('color', 'red');
                        continue;
                    }
                }
            });
        });
    }

    loadFlashDeals()
});

function loadFlashDeals() {
    var url = "https://example-data.draftbit.com/sneakers?_limit=10"
    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        var sneakers = data;
        sneakers.map(function(s) {
            $(".index-sneaker-cards").append(`
                <div class="card" id="${s.id}">
                    <img src="${s.media.imageUrl}" />
                    <div class="card-body">
                        <span class="sneaker-title">${s.title}</span>
                        <span class="sneaker-colorway">${s.colorway}</span>
                        <span class="sneaker-price">$${s.retailPrice}</span>
                    </div>
                </div>
            `)
        });
    });
}