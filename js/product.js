function loadSneakers(sneaker_id) {
    var url = `https://example-data.draftbit.com/sneakers/${sneaker_id}`

    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        console.log(data);
        $(".product-img").append(`<img src="${data.media.imageUrl}" />`);
        $(".product-release-date").html(new Date(data.releaseDate).toDateString());
        $(".product-header").html(`${data.brand} ${data.year}`);
        $(".product-title").html(data.title);
        $(".product-price").append(data.retailPrice);
        $(".product-colorway").html(data.colorway);
    });
}

$(document).ready(function() {
    sneaker_id = 'c116b14f-8f00-454b-915c-f3f51c7a297c'
    loadSneakers(sneaker_id);
});