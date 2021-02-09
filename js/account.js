$(document).ready(function() {
    if (accLoggedIn != null) { // Check if user is logged in
        $('#account-name').html(accLoggedIn[1]);

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
            $('.account-balance').html(account.balance);
            $('.account-gc').html(account.coupon);

            $('#topUp-balance-button').on("click", function() {
                var topUpBalance = $('input[name=topUpBalance]:checked').val();
                switch(topUpBalance) {
                    case '$10':
                        account.balance += 10;
                        break;

                    case '$15':
                        account.balance += 15;
                        break;

                    case '$20':
                        account.balance += 20;
                        break;

                    case '$50':
                        account.balance += 50;
                        break;
                }

                updateAccount(account);
            });

            $('#topUp-gc-button').on("click", function() {
                var topUpGC = $('input[name=topUpGC]:checked').val();
                var gcCost = 0, coupon = 0;

                switch(topUpGC) {
                    case '1GC':
                        coupon = 1;
                        gcCost = 3; // 1GC for $3
                        break;
    
                    case '5GC':
                        coupon = 5;
                        gcCost = 14;// 5GC for $14
                        break;
    
                    case '15GC':
                        coupon = 15;
                        gcCost = 43;// 15GC for $43
                        break;
    
                    case '50GC':
                        coupon = 50;
                        gcCost = 145;// 50GC for $145
                        break;
                }

                if (account.balance - gcCost <= 0) { // Check if sufficient account balance
                    $('#account-gc-error').show(); 
                }

                else { 
                    $('#account-gc-error').hide(); 
                    account.balance -= gcCost;
                    account.coupon += coupon;
                    updateAccount(account);
                }
            });

            $("#password-change").submit(function(e) {
                e.preventDefault();
                account.password = $("#new-password").val();
                updateAccount(account);
                $('#password-change-text').show();
            });

            $("#logout-button").on("click", function() {
                localStorage.removeItem('accLoggedIn');
                window.location.href = 'index.html';
            });
        })
        .fail(function() { window.location.href = 'index.html' });
    }
    else window.location.href = 'index.html';
});

function updateAccount(account) {
    $('.account-balance').html(account.balance);
    $('.account-gc').html(account.coupon);

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
    })
    .done(function() {
        console.log("Account Info Updated.");
    });
}