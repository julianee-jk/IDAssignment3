
$("#createModalButton").click(function (e) {
    $('#loginModal').modal('hide')
});
$("#loginModalButton").click(function (e) {
    $('#createModal').modal('hide')
});

//[STEP 0]: Make sure our document is A-OK
$(document).ready(function () {
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

        //[STEP 3]: get form values when user clicks on send
        let jsondata = {
            "name": name,
            "dob": dob,
            "password": password
        };
        console.log(jsondata);
        //[STEP 4]: Create our AJAX settings. Take note of API key
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

        //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    });//end click 
});