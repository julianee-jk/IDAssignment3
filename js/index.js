$(document).ready(function () {
    loadFeaturing();
    loadTrending();
    loadLatest();
});

function loadFeaturing() {
    fetch("https://example-data.draftbit.com/sneakers?_start=0&_end=420")
    .then(response => response.json())
    .then(function(data) {
        var i = Math.floor(Math.random() * 420);
        var sneaker = data[i];

        if (sneaker.retailPrice == null) {
            sneaker = sneaker[Math.floor(Math.random() * 420)];
        }

        else {
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
    .catch(function(e) {
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
    $.ajax({
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
                if (i >= 10) return;
                
                else if (!(trendingArray.includes(data[0]))) {
                    trendingArray.push(data[0]);
                    i++;
                }
            });
        });

        displayTrending(trendingArray);
    });
}

function displayTrending(trendingArray) {
    $(".trending").html("");
    $(".trending").css("justify-content","flex-start");

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
    $(".latest").html("");
    $(".latest").css("justify-content","flex-start");

    fetch("https://example-data.draftbit.com/sneakers?_limit=10")
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

function selectCard(sneakerId) {
    localStorage.setItem("viewProductId", sneakerId);
    window.location.href = "product.html";
}