$(document).ready(function () {
    loadFeaturing();
    loadTrending();
    loadLatest();
});

function loadFeaturing() {
    var url = `https://example-data.draftbit.com/sneakers?_start=0&_end=420`
    var i = Math.floor(Math.random() * 420);

    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        var sneaker = data[i];
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
    var url = "https://example-data.draftbit.com/sneakers?_limit=10"
    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        var sneakers = data;
        sneakers.map(function(s) {
            $(".trending").append(`
                <div class="card" id="${s.id}" onclick="selectCard('${s.id}')">
                    <img src="${s.media.imageUrl}" />
                    <div class="card-body">
                        <span class="sneaker-title">${s.title}</span>
                        <span class="sneaker-colorway">${s.colorway}</span>
                        <span class="sneaker-price">$${s.retailPrice}</span>
                    </div>
                </div>
            `)
        });
    });
}

function loadLatest() {
    var url = "https://example-data.draftbit.com/sneakers?_limit=10"
    fetch(url)
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
            `)
        });
    });
}

function selectCard(sneakerId) {
    localStorage.setItem("viewProductId", sneakerId);
    window.location.href = "product.html";
}