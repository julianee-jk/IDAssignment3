let url = `https://example-data.draftbit.com/sneakers?`
var category, query;
var range = "_start=0&_end=21";

$(document).ready(function() {
    loadSneakers(url + `_start=0&_end=21`);

    $("#searchBar").keyup(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#search').click();
        }
    });

    $('#search').on("click", function(e) {
        if ($('.cat-group > input.btn-check').is(':checked')) url = `https://example-data.draftbit.com/sneakers?gender=${category}&`;
        else url = `https://example-data.draftbit.com/sneakers?`;
        query = $("#searchBar").val().replaceAll(' ', '%20');
        loadSneakers(url + `q=${query}&${range}`);
        url = url + `q=${query}`;
    });

    $(".cat-group > input.btn-check").on("click", function(e) {
        if (query != undefined && query != '') url = `https://example-data.draftbit.com/sneakers?q=${query}&`;
        else url = `https://example-data.draftbit.com/sneakers?`;
        category = e.target.attributes.value.value;
        loadSneakers(url + `gender=${category}&${range}`);
        url = url + `gender=${category}`;
    });

    $(".page-item").on("click", function(e) {
        var pageNumber = e.target.innerHTML;
        $('.active').removeClass('active');
        this.className += ' active';
        range = `_start=${21 * pageNumber - 21}&_end=${21 * pageNumber}`
        loadSneakers(url + '&' + range);
        checkPage();
    });

    $("#next-page-button").on("click", function(e) {
        var pageNumber = ($('.active').next()).text();
        var nextActive = $('.active').next();
        $('.active').removeClass('active');
        nextActive.addClass('active');
        range = `_start=${21 * pageNumber - 21}&_end=${21 * pageNumber}`
        loadSneakers(url + '&' + range);
        checkPage();
    })

    $("#prev-page-button").on("click", function(e) {
        var pageNumber = ($('.active').prev()).text();
        var nextActive = $('.active').prev();
        $('.active').removeClass('active');
        nextActive.addClass('active');
        range = `_start=${21 * pageNumber - 21}&_end=${21 * pageNumber}`;
        loadSneakers(url + '&' + range);
        checkPage();
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

function checkPage() {
    if (($('.active').prev()).text() == "Prev") {
        $("#prev-page-button").addClass('disabled');
        $("#prev-page-button").prop('disabled', true);
    }

    else {
        $("#prev-page-button").removeClass('disabled');
        $("#prev-page-button").prop('disabled', false);
    }

    if (($('.active').next()).text() == "Next") {
        $("#next-page-button").addClass('disabled');
        $("#next-page-button").prop('disabled', true);
    }
    
    else {
        $("#next-page-button").removeClass('disabled');
        $("#next-page-button").prop('disabled', false);
    }
}