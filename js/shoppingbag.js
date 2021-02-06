$(document).ready(function () {
    checkBagEmpty();

    $('.table-body').on('click', ".delete", function(e) {
        $(".table-body").html("");
        var shoppingBag = JSON.parse(localStorage.getItem('shoppingBag'));
        shoppingBag.pop(e.target.attributes.value.value);
        localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
        checkBagEmpty();
    })  

    $("#checkout-button").on("click", function (e) {
        const APIKEY = "601a5d306adfba69db8b6cfc";
        e.preventDefault();

        let name = $("#user-name").val();
        let shippingAddress = $("#shipping-address").val();
        let contactNumber = $("#contact-number").val();
        let emailAddress = $("#email-address").val();
        let specialRequest = $("#special-request").val();

        let jsondata = {
            "name": name,
            "shippingAddress": shippingAddress,
            "contactNumber": contactNumber,
            "emailAddress": emailAddress,
            "specialRequest": specialRequest
        };
        
        console.log(jsondata);
        
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

        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    });
});

function loadCart() {
    $(".table-body").html("");

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
    if (localStorage.getItem('shoppingBag') == null || localStorage.getItem('shoppingBag') == "[]") {
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

    else {
        loadCart();
    }
}