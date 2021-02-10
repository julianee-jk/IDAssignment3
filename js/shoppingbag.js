var shoppingBag = JSON.parse(localStorage.getItem('shoppingBag'));

$(document).ready(function () {
    checkBagEmpty();

    $('.table-body').on('click', ".delete", function(e) {
        $(".table-body").html("");
        shoppingBag.splice(e.target.attributes.value.value, 1);
        localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
        checkBagEmpty();
    })  

    $("#checkout-button").on("click", function(e) {
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

async function loadBag() {
    var products = [];

    shoppingBag.map(s => {
        let product = fetch(`https://example-data.draftbit.com/sneakers/${s[0]}`)
        .then(res => res.json())
        .then(data => {
            return data;
        })
        products.push(product);
    })
    products = await Promise.all(products);
    displayBag(products);
}

function displayBag(products) {
    $(".table-body").html("");
    var totalPrice = 0;
    var htmlString = '';

    for (var i = 0; i <= shoppingBag.length - 1; i++) {
        if (shoppingBag[i][0] == products[i].id) {
            var itemPrice = products[i].retailPrice * shoppingBag[i][1]
            totalPrice += itemPrice;
            htmlString += (`
                <tr>
                    <th scope="row">${i + 1}</th>
                    <td>${products[i].title}</td>
                    <td>${shoppingBag[i][1]}</td>
                    <td>${shoppingBag[i][2]}</td>
                    <td>$${itemPrice}</td>
                    <td class="delete" value="${i}">Delete</td>
                </tr>
            `);
        }
    }

    $('.table-body').html(htmlString);
    $('#total-cost').html(`$${totalPrice}`);
}

function checkBagEmpty() {
    if (localStorage.getItem('shoppingBag') == null || localStorage.getItem('shoppingBag') == "[]") {
        $('.table-body').append(`<tr><th colspan="6" style="text-align: center;">Your bag is empty!</th></tr>`)
        $('footer').css('position','absolute')
        $('footer').css('bottom','0')
        $('.total-cost-header').hide();
        $('.shopping-form-box').hide();
    }

    else {
        loadBag();
    }
}