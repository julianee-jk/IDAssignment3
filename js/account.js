$("#logout-button").click(function (e) {
    localStorage.removeItem('accountLoggedIn');
    localStorage.removeItem('accountLoggedIn');
    window.location.href = 'index.html';
});

$("#changePass-text").click(function (e) {
    $('#changeAccountPass-text').html('Change Account Password');
    $('#changeAccountPass-text').css('color', 'black');
});

var topupChoice = '';

$("#addBal-button").click(function (e) {
    var accountBal = JSON.parse(localStorage.getItem('accountBal'));
    var topupValue = document.getElementsByName('topup-value');
    for(var i = 0; i < topupValue.length; i++){
        if (topupValue[i].checked) {
            topupChoice = topupValue[i].value; //Get topup-value radio button value
            console.log(topupChoice)
        }
    }

    if (topupChoice == '10SZ') {
        accountBal += 10;
    }
    else if (topupChoice == '15SZ') {
        accountBal += 15;
    }
    else if (topupChoice == '20SZ') {
        accountBal += 20;
    }
    else if (topupChoice == '50SZ') {
        accountBal += 50;
    }
    localStorage.setItem('accountBal', accountBal);
});

$(document).ready(function () {
    const APIKEY = "601a5d306adfba69db8b6cfc";
    // Check if user is logged in
    const value = localStorage.getItem('accountLoggedIn')
    getAccountData();
    if (value != null) {
        $('#account-name').html(value);
    }

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
            console.log(response);
            $("#changePass-button").on("click", function (e) {
                for (let i = 0; i < response.length && i < limit; i++) {
                    if (value == response[i].name) {
                        e.preventDefault();
                        let newPass = $("#change-pass").val();
                        let id = response[i]._id;
                        let accName = response[i].name;
                        let accDob = response[i].dob;
                        updatePass(id, accName, accDob, newPass);
                        break;
                    }
                    else {
                        continue;
                    }
                }
            });
        });

        function updatePass(id, accName, accDob, newPass) {
            //@TODO create validation methods for id etc. 
        
            var jsondata = { "name": accName, "dob": accDob, "password": newPass };
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
                $('#changeAccountPass-text').html('Password Changed!');
                $('#changeAccountPass-text').css('color', 'green');
                console.log('Password Updated!');
              });
          }//end updateform function
    }
});