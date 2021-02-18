$(document).ready(function() {
    loadFeaturing(); // Load random sneaker into carousel featuring sneaker slide
    loadTrending(); // Load 10 trending sneakers into trending section
    loadLatest(); // Load 10 latest sneakers into latest section
});

function loadFeaturing() {
    fetch("https://example-data.draftbit.com/sneakers?_start=0&_end=420") // Out of about 421 sneakers
    .then(response => response.json())
    .then(function(data) {
        var i = Math.floor(Math.random() * 420); // Generate a integer from 0 to 420
        var sneaker = data[i]; // Get 1 sneaker to be featured;

        if (sneaker.retailPrice == null) { // If the sneaker retail price is null, get another sneaker
            sneaker = sneaker[Math.floor(Math.random() * 420)];
        }

        else { // Else, display the sneaker
            var htmlString = (`
                <div class="carousel-feature-slide" onclick=selectCard('${sneaker.id}')>
                    <img src="${sneaker.media.imageUrl}" class="d-block w-100">
                    <div class="carousel-caption carousel-feature-text d-md-block">
                        <h5>FEATURING</h5>
                        <p>${sneaker.title}</p>
                    </div>
                </div>
            `);
            $(".featured-sneaker").html(htmlString);
        }
    })
    .catch(function(e) { // If there is an error getting the sneaker, use a place holder sneaker
        var htmlString = (`
            <div class="carousel-feature-slide" onclick=selectCard('c116b14f-8f00-454b-915c-f3f51c7a297c')>
                <img src="https://stockx.imgix.net/Nike-Kyrie-6-90s-GS.png?fit=fill&bg=FFFFFF&w=700&h=500&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1591073011" class="d-block w-100">
                <div class="carousel-caption carousel-feature-text d-md-block">
                    <h5>FEATURING</h5>
                    <p>Nike Kyrie 6 90s (GS)</p>
                </div>
            </div>
        `);
        $(".featured-sneaker").html(htmlString);
    });
}

function loadTrending() {
    $.ajax({ // Get transaction data and filter by products and sort by latest
        "async": true,
        "crossDomain": true,
        "url": `https://sneakerzone-11b9.restdb.io/rest/transaction-info?q={"purchaseType":"Product"}&h={"$orderby":{"purchaseDateTime":-1}}`,
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        }
    })
    .done(function(response) {
        var trendingArray = [];
        var i = 0;

        response.map(transaction => {
            transaction.purchaseData.map(data => {
                if (i >= 10) return; // Get 10 of the latest sneaker
                
                else if (!(trendingArray.includes(data[0]))) { // If the sneaker is not already an existing sneaker in the trending array, add it
                    trendingArray.push(data[0]);
                    i++;
                }
            });
        });

        displayTrending(trendingArray); // Display the trending sneakers
    });
}

function displayTrending(trendingArray) {
    $(".trending").html(""); // Clear the trending section
    $(".trending").css("justify-content","flex-start"); // Set the trending section content back to left aligned

    trendingArray.map(function(sneakerID) {
        fetch(`https://example-data.draftbit.com/sneakers/${sneakerID}`)
        .then(res => res.json())
        .then(function(s) {
            $(".trending").append(`
            <div class="card" id="${s.id}" onclick="selectCard('${s.id}')">
                <img src="${s.media.imageUrl}" />
                <div class="card-body">
                    <span class="sneaker-title">${s.title}</span>
                    <span class="sneaker-colorway">${s.colorway}</span>
                    <span class="sneaker-price">$${s.retailPrice}</span>
                </div>
            </div>
            `);
        });
    });
}

function loadLatest() {
    $(".latest").html(""); // Clear the latest section
    $(".latest").css("justify-content","flex-start"); // Set the latest section back to left aligned

    fetch("https://example-data.draftbit.com/sneakers?_limit=10") // Get 10 of the latest sneakers
    .then(response => response.json())
    .then(function(data) {
        var sneakers = data;
        sneakers.map(function(s) {
            $(".latest").append(`
                <div class="card" id="${s.id}" onclick="selectCard('${s.id}')">
                    <img src="${s.media.imageUrl}" />
                    <div class="card-body">
                        <span class="sneaker-title">${s.title}</span>
                        <span class="sneaker-colorway">${s.colorway}</span>
                        <span class="sneaker-price">$${s.retailPrice}</span>
                    </div>
                </div>
            `);
        });
    });
}

function selectCard(sneakerId) { // If a user selects a sneaker direct them to the product page for the sneaker
    localStorage.setItem("viewProductId", sneakerId); // Store the sneaker ID in local storage
    window.location.href = "product.html";
}