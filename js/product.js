function loadSneakers(sneaker_id) {
    var url = `https://example-data.draftbit.com/sneakers/${sneaker_id}`

    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        $('.product-img').append(`<img src="${data.media.imageUrl}" />`);
        $('.product-release-date').append(new Date(data.releaseDate).toDateString());
        $('.product-header').html(`${data.brand} ${data.year}`);
        $('.product-title').html(data.title);
        $('.product-price').append(data.retailPrice);
        $('.product-colorway').append(data.colorway);
    });
}

$(document).ready(function() {
    sneaker_id = localStorage.getItem('viewProductId')
    loadSneakers(sneaker_id);
    var shoppingBag = [];
    var size = "S"

    $(".size > input.btn-check").on("click", function(e){
        size = e.target.attributes.value.value
    });

    $("#addToCart").click(function(e) {
        var qty = $(".qty").val();
        shoppingBag.push([sneaker_id, qty, size]);
        localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag))
    });
});