var shoppingBag = JSON.parse(localStorage.getItem('shoppingBag'));
var totalPrice = 0;

$(document).ready(function () {
    checkBagEmpty();
    $('.table-body').on('click', ".delete", function(e) {
        $(".table-body").html("");
        shoppingBag.splice(e.target.attributes.value.value, 1);
        localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
        checkBagEmpty();
    });

    $('.delete-all').on('click', function(e) {
        localStorage.removeItem('shoppingBag');
        $(".table-body").html("");
        checkBagEmpty();
    })

    if (accLoggedIn != null) {
        $('.not-loggedin-text').hide();
        $("#checkout-button").attr("disabled", false);
        $.ajax({ // Get account data from database
            "async": true,
            "crossDomain": true,
            "url": `https://sneakerzone-11b9.restdb.io/rest/account-info/${accLoggedIn[0]}`,
            "method": "GET",
            "headers": {
                "content-type": "application/json",
                "x-apikey": APIKEY,
                "cache-control": "no-cache"
            },
        })
        .done(function(account) {
            $("#shopping-form").submit(function(e) {
                e.preventDefault();
                if (account.balance - totalPrice < 0) {
                    // Insufficient Account Balance
                    $('#checkout-button-text').show();
                    setInterval(function(){$('#checkout-button-text').hide();}, 3000);
                }
                else {
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

                    $.ajax(settings).done(function () {
                        account.balance -= totalPrice; // Account balance
                        addTransactionInfo(account._id, account.balance, totalPrice, shoppingBag, new Date($.now())); // Add transaction info
                        localStorage.removeItem('shoppingBag'); // Clear shopping bag when checked out
                        $('#success-purchase-text').show();
                        setInterval(function(){$('#success-purchase-text').hide();}, 3000); // Show successful message

                    }).fail(function() { alert('Please fill up the shipping form!') });
                }
            })
        });
    }
    else {
        $('.not-loggedin-text').show();
        $("#checkout-button").attr("disabled", true);
    }
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
    var htmlString = '';
    for (var i = 0; i < shoppingBag.length; i++) {
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
        $('.delete-all').hide();
    }

    else {
        loadBag();
    }
}

function addTransactionInfo(userID, balance, moneySpent, purchaseData, purchaseDateTime) {
    var jsondata = {
        "userID": userID, 
        "balance": balance, 
        "moneySpent": moneySpent, 
        "purchaseType": 'Product', 
        "purchaseData": purchaseData, 
        "purchaseDateTime": purchaseDateTime
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://sneakerzone-11b9.restdb.io/rest/transaction-info",
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
}