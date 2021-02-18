var shoppingBag = JSON.parse(localStorage.getItem('shoppingBag')); // Get shopping bag data from local storage
var totalPrice = 0; // Inital total price set as 0

$(document).ready(function () {
    $('.bag-loading').show(); // Show bag loading icon
    checkBagEmpty(); // Check if the bag is empty

    $('.table-body').on('click', ".delete", function(e) { // If user clicks on delete button
        $(".table-body").html(""); // Clear the table
        totalPrice = 0; // Set back total price variable to 0
        shoppingBag.splice(e.target.attributes.value.value, 1); // Remove item from shopping bag
        localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag)); // Reset the local storage shopping bag array
        checkBagEmpty(); // Check if the bag is empty
    });

    $('.delete-all').on('click', function(e) { // If user clicks delete all button
        totalPrice = 0;
        localStorage.removeItem('shoppingBag'); // Remove shopping bag from array
        $(".table-body").html(""); // Clear the table
        checkBagEmpty(); // Check if the bag is empty
    });

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
            }
        })
        .done(function(account) {
            $("#shopping-form").submit(function(e) {
                e.preventDefault();
                if (account.balance - totalPrice < 0) { // Check if account has sufficient balance
                    $('#checkout-button-text').show(); // Show check out button if user logged in
                    setInterval(function(){$('#checkout-button-text').hide();}, 3000); // Hide check out button after 3 seconds
                }
                else {
                    let jsondata = {
                        "name": $("#user-name").val(),
                        "shippingAddress": $("#shipping-address").val(),
                        "contactNumber": $("#contact-number").val(),
                        "emailAddress": $("#email-address").val(),
                        "specialRequest": $("#special-request").val()
                    };
                    
                    $.ajax({
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

                    }).done(function () {
                        account.balance -= totalPrice; // Deduct total price from account balance
                        updateAccount(account); // Update account information
                        addTransactionInfo(account._id, account.balance, totalPrice, shoppingBag, new Date($.now())); // Add transaction info
                    }).fail(function() { alert('Please fill up the shipping form!'); }); // If fail to POST, alert user to fill up form
                }
            });
        });
    }
    else { // If user not logged in
        $('.not-loggedin-text').show(); // Display warning text
        $("#checkout-button").attr("disabled", true); // Disable check out button
    }
});

// Fetch products according to shoppingBag localStorage
async function loadBag() {
    var products = [];
    shoppingBag.map(s => {
        let product = fetch(`https://example-data.draftbit.com/sneakers/${s[0]}`)
        .then(res => res.json())
        .then(data => {
            return data;
        });
        products.push(product);
    });
    products = await Promise.all(products);
    displayBag(products);
}

// Display products in shoppingBag table
function displayBag(products) {
    $('.bag-loading').hide();
    $(".table-body").html("");
    var htmlString = '';
    for (var i = 0; i < shoppingBag.length; i++) {
        if (shoppingBag[i][0] == products[i].id) {
            var itemPrice = products[i].retailPrice * shoppingBag[i][1];
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

function checkBagEmpty() { // If the shopping bag is empty, show "shopping bag is empty" message, Otherwise, load shopping bag items
    if (localStorage.getItem('shoppingBag') == null || localStorage.getItem('shoppingBag') == "[]") {
        $('.table-body').append(`<tr><th colspan="6" style="text-align: center;">Your bag is empty!</th></tr>`);
        $('footer').css('position','absolute');
        $('footer').css('bottom','0');
        $('.total-cost-header').hide();
        $('.shopping-form-box').hide();
        $('.delete-all').hide();
        $('.bag-loading').hide();
    }

    else { loadBag(); }
}

// Add account transaction information
function addTransactionInfo(userID, balance, moneySpent, purchaseData, purchaseDateTime) {
    var jsondata = {
        "userID": userID, 
        "balance": balance, 
        "moneySpent": moneySpent, 
        "purchaseType": 'Product', 
        "purchaseData": purchaseData, 
        "purchaseDateTime": purchaseDateTime
    };

    $.ajax({
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
    
    }).done(function() {
        localStorage.removeItem('shoppingBag'); // Clear shopping bag when checked out
        $(".table-body").html(""); // Reset table html
        checkBagEmpty(); // Check if bag empty
        $('#success-purchase-text').show(); // Display success message
        setInterval(function(){$('#success-purchase-text').hide();}, 10000); // Show successful message
    });
}

function updateAccount(account) {
    var jsondata = { 
        "name": account.name, 
        "dob": account.dob, 
        "password": account.password, 
        "balance": account.balance, 
        "coupon": account.coupon
    };

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": `https://sneakerzone-11b9.restdb.io/rest/account-info/${account._id}`,
        "method": "PUT",
        "headers": {
            "content-type": "application/json",
            "x-apikey": APIKEY,
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    });
}