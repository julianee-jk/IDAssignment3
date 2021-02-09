let url = `https://example-data.draftbit.com/sneakers?`

$(document).ready(function() {
    loadSneakers(`https://example-data.draftbit.com/sneakers?_limit=21`);

    $("#searchBar").keyup(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#search').click();
        }
    });

    $('#search').on("click", function(e) {
        var query = $("#searchBar").val().replaceAll(' ', '%20');
        var load = url + `q=${query}`
        loadSneakers(load);
    });

    $(".page-item").on("click", function(e) {
        var pageNumber = e.target.innerHTML;
        $('.active').removeClass('active');
        this.className += ' active';
        var load = url + `_start=${21 * pageNumber - 21}&_end=${21 * pageNumber}`;
        loadSneakers(load);

        if ($('.active').text() == "1") {
            $("#prev-page-button").addClass('disabled');
            $("#prev-page-button").prop('disabled', true);
        }

        else {
            $("#prev-page-button").removeClass('disabled');
            $("#prev-page-button").prop('disabled', false);
        }

        if ($('.active').text() == "5") {
            $("#next-page-button").addClass('disabled');
            $("#next-page-button").prop('disabled', true);
        }
        
        else {
            $("#next-page-button").removeClass('disabled');
            $("#next-page-button").prop('disabled', false);
        }
    });

    $("#next-page-button").on("click", function(e) {
        var pageNumber = ($('.active').next()).text();
        var nextActive = $('.active').next();
        $('.active').removeClass('active');
        nextActive.addClass('active');
        var load = url + `_start=${21 * pageNumber - 21}&_end=${21 * pageNumber}`;
        loadSneakers(load);

        if ($('.active').text() == "1") {
            $("#prev-page-button").addClass('disabled');
            $("#prev-page-button").prop('disabled', true);
        }

        else {
            $("#prev-page-button").removeClass('disabled');
            $("#prev-page-button").prop('disabled', false);
        }

        if ($('.active').text() == "5") {
            $("#next-page-button").addClass('disabled');
            $("#next-page-button").prop('disabled', true);
        }
        
        else {
            $("#next-page-button").removeClass('disabled');
            $("#next-page-button").prop('disabled', false);
        }
    })

    $("#prev-page-button").on("click", function(e) {
        var pageNumber = ($('.active').prev()).text();
        var nextActive = $('.active').prev();
        $('.active').removeClass('active');
        nextActive.addClass('active');
        var load = url + `_start=${21 * pageNumber - 21}&_end=${21 * pageNumber}`;
        loadSneakers(load);

        if ($('.active').text() == "1") {
            $("#prev-page-button").addClass('disabled');
            $("#prev-page-button").prop('disabled', true);
        }

        else {
            $("#prev-page-button").removeClass('disabled');
            $("#prev-page-button").prop('disabled', false);
        }

        if ($('.active').text() == "5") {
            $("#next-page-button").addClass('disabled');
            $("#next-page-button").prop('disabled', true);
        }
        
        else {
            $("#next-page-button").removeClass('disabled');
            $("#next-page-button").prop('disabled', false);
        }
    })
});

function loadSneakers(url) {
    console.log(url);
    $(".sneaker-cards").html("") // clear sneaker cards

    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        var sneakers = data;
        sneakers.map(function(s) {
            if (s.retailPrice == null) {
                $(".sneaker-cards").append(`
                <li class="sneaker-card" id="${s.id}" style="opacity: 0.7">
                    <img src="${s.media.imageUrl}" alt="${s.title}" />
                    <span class="sneaker-title">${s.title}</span>
                    <span class="sneaker-colorway">${s.colorway}</span>
                    <span class="sneaker-price">Not Available</span>
                </li>
                `)
            }
            else {
                $(".sneaker-cards").append(`
                    <li class="sneaker-card" onclick="selectCard('${s.id}')" id="${s.id}" style="cursor: pointer">
                        <img src="${s.media.imageUrl}" alt="${s.title}" />
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

function selectCat(category) {
    var load = url + `gender=${category}`;
    loadSneakers(load);
}