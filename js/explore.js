let url = `https://example-data.draftbit.com/sneakers?_limit=21`
var category, query;
var range = "_page=1";

$(document).ready(function() {
    loadSneakers(`${url}&${range}`);
    loadPageCount(20);

    $("#searchBar").keyup(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#search').click();
        }
    });

    $('#search').on("click", function(e) {
        if ($('.cat-group > input.btn-check').is(':checked')) url = `https://example-data.draftbit.com/sneakers?_limit=21&gender=${category}`;
        else url = `https://example-data.draftbit.com/sneakers?_limit=21`;
        query = $("#searchBar").val().replaceAll(' ', '%20');
        loadSneakers(url + `&q=${query}&${range}`);
        url = url + `&q=${query}`;
    });

    $(".cat-group > input.btn-check").on("click", function(e) {
        if (query != undefined && query != '') url = `https://example-data.draftbit.com/sneakers?_limit=21&q=${query}`;
        else url = `https://example-data.draftbit.com/sneakers?_limit=21`;
        category = e.target.attributes.value.value;
        loadSneakers(url + `&gender=${category}&${range}`);
        url = url + `&gender=${category}`;
    });

    $(".page-item").on("click", function(e) {
        var pageNumber = e.target.innerHTML;
        $('.active').removeClass('active');
        this.className += ' active';
        range = `_page=${pageNumber}`
        loadSneakers(`${url}&${range}`);
        checkPage();
    });

    $("#next-page-button").on("click", function(e) {
        var pageNumber = ($('.active').next()).text();
        var nextActive = $('.active').next();
        $('.active').removeClass('active');
        nextActive.addClass('active');
        range = `_page=${pageNumber}`
        loadSneakers(url + '&' + range);
        checkPage();
    })

    $("#prev-page-button").on("click", function(e) {
        var pageNumber = ($('.active').prev()).text();
        var nextActive = $('.active').prev();
        $('.active').removeClass('active');
        nextActive.addClass('active');
        range = `_page=${pageNumber}`;
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

function loadPageCount(count) {
    var htmlString = '';
    htmlString += `<button class="page-link disabled" id="prev-page-button">Prev</button>`
    htmlString += `<li class="page-item active"><a class="page-link" href="#">1</a></li>`
    for (var i = 2; i <= count; i++) {
        htmlString += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
    };
    htmlString += `<button class="page-link" id="next-page-button">Next</button>`
    $(".pagination").html(htmlString);
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
}
