//[STEP 0]: Make sure our document is A-OK
$(document).ready(function () {
    //what kind of interface we want at the start 
    const APIKEY = "601a5d306adfba69db8b6cfc";

    //[STEP 1]: Create our submit form listener
    $("#checkout-button").on("click", function (e) {
      //prevent default action of the button 
      e.preventDefault();
  
      //[STEP 2]: let's retrieve form data
      //for now we assume all information is valid
      //you are to do your own data validation
      let name = $("#user-name").val();
      let shippingAddress = $("#shipping-address").val();
      let contactNumber = $("#contact-number").val();
      let emailAddress = $("#email-address").val();
      let specialRequest = $("#special-request").val();
  
      //[STEP 3]: get form values when user clicks on send
      //Adapted from restdb api
      let jsondata = {
        "name": name,
        "shippingAddress": shippingAddress,
        "contactNumber": contactNumber,
        "emailAddress": emailAddress,
        "specialRequest": specialRequest
      };
      console.log(jsondata);
      //[STEP 4]: Create our AJAX settings. Take note of API key
      var settings = {
        "async": true,
        "crossDomain": true, 
        "url": "https://sneakerzone-11b9.restdb.io/rest/shipping-info",
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