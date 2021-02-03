//[STEP 0]: Make sure our document is A-OK
$(document).ready(function () {
    //what kind of interface we want at the start 
    const APIKEY = "601a5d306adfba69db8b6cfc";

    //[STEP 1]: Create our submit form listener
    $("#contact-button").on("click", function (e) {
        //prevent default action of the button 
        e.preventDefault();
  
        //[STEP 2]: let's retrieve form data
        let name = $("#contact-name").val();
        let contactNumber = $("#contact-number").val();
        let emailAddress = $("#contact-email-address").val();
        let userTopic = $("#contact-user-topic").val();
        let message = $("#contact-message").val();

        //[STEP 3]: get form values when user clicks on send
        //Adapted from restdb api
        let jsondata = {
            "name": name,
            "contactNumber": contactNumber,
            "emailAddress": emailAddress,
            "topic": userTopic,
            "message": message
        };
        console.log(jsondata);
        //[STEP 4]: Create our AJAX settings. Take note of API key
        var settings = {
            "async": true,
            "crossDomain": true, 
            "url": "https://sneakerzone-11b9.restdb.io/rest/contact-info",
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