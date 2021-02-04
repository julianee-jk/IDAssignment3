function loadSneakers(url) {
    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        var sneakers = data;
        const HTMLstring = sneakers.map((s) => `
            <li class="sneaker-card" onclick="selectCard('${s.id}')" id="${s.id}">
                <img src="${s.media.imageUrl}" />
                <span class="sneaker-title">${s.title}</span>
                <span class="sneaker-colorway">${s.colorway}</span>
                <span class="sneaker-price">$${s.retailPrice}</span>
            </li>
        `);
        $(".sneaker-cards").html(HTMLstring);
    });
}

function selectCard(sneakerId) {
    localStorage.setItem("viewProductId", sneakerId);
    window.location.href = "product.html";
}

$(document).ready(function() {
    var limit = 21;
    var url = `https://example-data.draftbit.com/sneakers?_limit=${limit}`
    loadSneakers(url);

    $("#searchBar").keyup(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#search').click();
        }
    });
    $('#search').on("click", function(e) {
        var query = $("#searchBar").val().replaceAll(' ', '%20');
        var url = `https://example-data.draftbit.com/sneakers?q=${query}&_limit=20`
        loadSneakers(url);
        console.log(url);
    });

    $(".cat-group > input.btn-check").on("click", function(e){
        var url = `https://example-data.draftbit.com/sneakers?_limit=${limit}`
        url += `?gender=${e.target.attributes.value.value}`
        loadSneakers(url);
    });
});