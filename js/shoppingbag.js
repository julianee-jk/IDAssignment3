function loadCart() {
    var shoppingBag = JSON.parse(localStorage.getItem('shoppingBag'));
    var totalPrice = 0;

    shoppingBag.map(function(s) {
        var url = `https://example-data.draftbit.com/sneakers/${s[0]}`
        fetch(url)
        .then(response => response.json())
        .then(function(data) {
            var itemPrice = data.retailPrice * Number(s[1])
            $('.table-body').append(`
                <tr>
                    <th scope="row">${shoppingBag.indexOf(s) + 1}</th>
                    <td>${data.title}</td>
                    <td>${s[1]}</td>
                    <td>${s[2]}</td>
                    <td>$${itemPrice}</td>
                    <td class="delete" value="${shoppingBag.indexOf(s)}">Delete</td>
                </tr>
            `)
            totalPrice += itemPrice;
            $('#total-cost').html(`$${totalPrice}`); 
        });
    });
}

function checkBagEmpty() {
    var shoppingBag = JSON.parse(localStorage.getItem('shoppingBag'));
    if (shoppingBag[0] === undefined) {
        console.log('empty');
        $('.table-body').append(`
                <tr>
                    <th colspan="6" style="text-align: center;">Your bag is empty!</th>
                </tr>
            `)
        $('footer').css('position','absolute')
        $('footer').css('bottom','0')
        $('.total-cost-header').hide();
        $('.shopping-form-box').hide();
    }
}

$(document).ready(function () {
    loadCart();
    $('footer').css('position','none')
    $('footer').css('bottom','0')
    $('.shopping-form-box').show();
    checkBagEmpty();
    $('.table-body').on('click', ".delete", function(e) {
        var shoppingBag = JSON.parse(localStorage.getItem('shoppingBag'));
        shoppingBag.pop(e.target.attributes.value.value);
        localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
        location.reload();
    })
    
    const APIKEY = "601a5d306adfba69db8b6cfc";

    //[STEP 1]: Create our submit form listener
    $("#checkout-button").on("click", function (e) {
        e.preventDefault(); // prevent default action of the button 

        //[STEP 2]: let's retrieve form data
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