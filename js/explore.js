function loadSneakers() {
    var limit = 21;
    var url = `https://example-data.draftbit.com/sneakers?_limit=${limit}`

    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        console.log(data);
        var sneakers = data;
        sneakers.map((s) => {
            $(".sneaker-cards").append(`
                <div class="sneaker-card">
                    <img src="${s.media.imageUrl}" />
                    <span class="sneaker-title">${s.title}</span>
                    <span class="sneaker-colorway">${s.colorway}</span>
                    <span class="sneaker-price">$${s.retailPrice}</span>
                </div>
            `);
        });
    });
}

$(document).ready(function() {
    loadSneakers();
});