$(document).ready(function() {
    if (accLoggedIn != null) {
        $('.table-body').html('');
        loadAccountData();
    }

    else window.location.href = 'index.html';
});

function loadAccountData() {
    var userID = JSON.parse(localStorage.getItem('accLoggedIn'))[0];

    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": `https://sneakerzone-11b9.restdb.io/rest/transaction-info?q={"userID":"${userID}"}`,
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        }
    })
    .done(function(response) {
        console.log(response);
        if (response.length == 0) $('.table-body').append(`<tr><th colspan="7" style="text-align: center;">No Purchase History!</th></tr>`);
        else loadTransactions(response);
    });
}

function loadTransactions(transactions) {
    var i = 0;
    var htmlString = '';
    $('.history-loading').hide();
    transactions.map(transaction => {
        if (transaction.purchaseType == "Product") {
            transaction.purchaseData.forEach(product => {
                var url = `https://example-data.draftbit.com/sneakers/${product[0]}`;

                fetch(url)
                .then(res => res.json())
                .then(data => {
                    htmlString = (`
                        <tr>
                            <th scope="row" class="history-index">${i += 1}</th>
                            <td class="history-product-name">${data.title}</td>
                            <td class="history-qty">${product[1]}</td>
                            <td class="history-size">${product[2]}</td>
                            <td class="history-cost">$${data.retailPrice * product[1]}</td>
                            <td class="history-type">${transaction.purchaseType}</td>
                            <td class="history-datetime">${transaction.purchaseDateTime}</td>
                        </tr>
                    `)

                    $('.table-body').append(htmlString);
                });
            });
        }

        else if (transaction.purchaseType == "BalanceTopUp") {
            htmlString = (`
                <tr>
                    <th scope="row" class="history-index">${i += 1}</th>
                    <td class="history-product-name">${transaction.purchaseType}</td>
                    <td class="history-qty">NA</td>
                    <td class="history-size">NA</td>
                    <td class="history-cost">$${transaction.purchaseData}</td>
                    <td class="history-type">${transaction.purchaseType}</td>
                    <td class="history-datetime">${transaction.purchaseDateTime}</td>
                </tr>
            `)
            $('.table-body').append(htmlString);
        }
    });
}