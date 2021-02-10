$(document).ready(function () {
    loadTrending();
    loadLatest();
});

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