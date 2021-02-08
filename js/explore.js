$(document).ready(function() {
    var url = `https://example-data.draftbit.com/sneakers?_start=0&_end=21`
    loadSneakers(url);

    $(".page-item").on("click", function(e) {
        var pageNumber = e.target.innerHTML;
        $('.active').removeClass('active');
        this.className += ' active';

        var startValue = 0;
        var endValue = 21;

        switch (pageNumber) {
            case 'Next':
                // work on Next Button
                break;

            case 'Prev':
                // work on Prev Button
                break;

            default:
                startValue = 21 * pageNumber - 21;
                endValue = 21 * pageNumber;
                break;
        }

        var url = `https://example-data.draftbit.com/sneakers?_start=${startValue}&_end=${endValue}`
        loadSneakers(url);
    });

    $("#searchBar").keyup(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#search').click();
        }
    });

    $('#search').on("click", function(e) {
        var query = $("#searchBar").val().replaceAll(' ', '%20');
        var url = `https://example-data.draftbit.com/sneakers?q=${query}&_limit=21`
        loadSneakers(url);
    });

    $(".cat-group > input.btn-check").on("click", function(e){
        var url = `https://example-data.draftbit.com/sneakers?_limit=${limit}`
        url += `?gender=${e.target.attributes.value.value}`
        loadSneakers(url);
    });
});

function loadSneakers(url) {
    $(".sneaker-cards").html("") // clear sneaker cards

    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        var sneakers = data;
        sneakers.map(function(s) {
            if (s.retailPrice == null) {
                $(".sneaker-cards").append(`
                <li class="sneaker-card" id="${s.id}" style="opacity: 0.7">
                    <img src="${s.media.imageUrl}" />
                    <span class="sneaker-title">${s.title}</span>
                    <span class="sneaker-colorway">${s.colorway}</span>
                    <span class="sneaker-price">Not Available</span>
                </li>
                `)
            }
            else {
                $(".sneaker-cards").append(`
                    <li class="sneaker-card" onclick="selectCard('${s.id}')" id="${s.id}" style="cursor: pointer">
                        <img src="${s.media.imageUrl}" />
                        <span class="sneaker-title">${s.title}</span>
                        <span class="sneaker-colorway">${s.colorway}</span>
                        <span class="sneaker-price">$${s.retailPrice}</span>
                    </li>
                `)
            }
        });
    });
}

function selectCard(sneakerId) {
    localStorage.setItem("viewProductId", sneakerId);
    window.location.href = "product.html";
}