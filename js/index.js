$(document).ready(function () {
    loadFeaturing();
    loadTrending();
    loadLatest();
});

function loadFeaturing() {
    var url = `https://example-data.draftbit.com/sneakers?_start=0&_end=420`
    var i = Math.floor(Math.random() * 421);

    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        var sneaker = data[i]
        var htmlString = `
            <div class="carousel-feature-slide" onclick=selectCard('${sneaker.id}')>
                <img src="${sneaker.media.imageUrl}" class="d-block w-100" alt="..." onclick="selectCard('${sneaker.id}')">
                <div class="carousel-caption carousel-feature-text d-none d-md-block">
                    <h5>FEATURING</h5>
                    <p>${sneaker.title}</p>
                </div>
            </div>
        `
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