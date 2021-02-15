var transactions = [] 
$(document).ready(function () {
    if (accLoggedIn != null) {
        $.ajax({ // Get account data from database
            "async": true,
            "crossDomain": true,
            "url": "https://sneakerzone-11b9.restdb.io/rest/transaction-info",
            "method": "GET",
            "headers": {
              "content-type": "application/json",
              "x-apikey": APIKEY,
              "cache-control": "no-cache"
            },
        }).done(function(transaction) {
            for (let i = 0; i < transaction.length; i++) {
                // console.log(transaction[i].userID)
                if (transaction[i].userID == null) {
                    $('.table-body').append(`<tr><th colspan="6" style="text-align: center;">No Purchase History!</th></tr>`)
                    $('footer').css('position','absolute');
                    $('footer').css('bottom','0');
                }
                else {
                    transactions.push(transaction[i]);
                    loadTransaction();
                    console.log(transaction[i].purchaseData[0])
                }
            }
        }).fail(function() { console.log('Error'); });
    }
    else { windows.location.href = 'index.html' }
});

async function loadTransaction() {
    transactions.map(s => {
        let transaction = fetch(`https://example-data.draftbit.com/sneakers/${s.purchaseData[0][0]}`)
        .then(res => res.json())
        .then(data => {
            return data.title;
        })

        transactions.push(transaction);
    })
    transactions = await Promise.all(transactions);
    displayHistory(transactions);
}

function displayHistory(transactions) {
    $(".table-body").html("");
    console.log(transactions);
    var htmlString = '';
    for (var i = 0; i <= transactions.length - 1; i++) {
        htmlString += (`
            <tr>
                <th scope="row">${i + 1}</th>
                <td>Name</td>
                <td>${transactions[i].purchaseData[0]}</td>
                <td>${transactions[i].purchaseData[0]}</td>
                <td>$${transactions[i].moneySpent}</td>
                <td> ${transactions[i].purchaseType}</td>
                <td>${transactions[i].purchaseDateTime}</td>
            </tr>
        `);
        // <th scope="col">#</th>
        // <th scope="col">Product Name</th>
        // <th scope="col">Qty</th>
        // <th scope="col">Size</th>
        // <th scope="col">Cost</th>
        // <th scope="col">Type</th>
        // <th scope="col">DateTime</th>
    }
    $('.table-body').html(htmlString);
}