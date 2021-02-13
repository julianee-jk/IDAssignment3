let url = "https://example-data.draftbit.com/sneakers?_limit=21";
let category, query;
let limit = "_limit=21";
let range = "_page=1";
let maxPage = 15;

$(document).ready(function() {
    loadSneakers(`${url}&${range}`);

    $("#searchBar").keyup(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            $('#search').click();
        }
    });

    $('#search').on("click", function() {
        if ($('.cat-group > input.btn-check').is(':checked')) url = `https://example-data.draftbit.com/sneakers?_limit=21&gender=${category}`;
        else url = `https://example-data.draftbit.com/sneakers?_limit=21`;
        query = $("#searchBar").val().replaceAll(' ', '%20');
        findMaxPage();
        loadSneakers(url + `&q=${query}&${range}`);
        url = url + `&q=${query}`;
    });

    $(".cat-group > input.btn-check").on("click", function(e) {
        $("#next-button").prop('disabled', false);
        $("#prev-button").prop('disabled', true);
        range = "_page=1"
        $("#page-input").val(1);

        if (query != undefined && query != '') url = `https://example-data.draftbit.com/sneakers?_limit=21&q=${query}`;
        else url = `https://example-data.draftbit.com/sneakers?_limit=21`;
        category = e.target.attributes.value.value;
        findMaxPage();
        loadSneakers(url + `&gender=${category}&${range}`);
        url = url + `&gender=${category}`;
    });

    $("#page-input").keyup(function(e) {
        if (e.keyCode === 13) {
            value = Number($("#page-input").val());
            
            if (value <= 1) {
                $("#next-button").prop('disabled', false);
                $("#prev-button").prop('disabled', true);
                $("#page-input").val(1);
            }

            else if (value >= maxPage) {
                $("#prev-button").prop('disabled', false);
                $("#next-button").prop('disabled', true);
                $("#page-input").val(maxPage);
            }
            
            else {
                $("#next-button").prop('disabled', false);
                $("#prev-button").prop('disabled', false);
                $("#page-input").val(value);
            }

            range = `_page=${$("#page-input").val()}`
            loadSneakers(`${url}&${range}`);
        }
    });

    $("#prev-button").on("click", function() {
        value = Number($("#page-input").val()) - 1;

        if (value <= 1) {
            $("#prev-button").prop('disabled', true);
            $("#page-input").val(1);
        }

        else { 
            $("#next-button").prop('disabled', false);
            $("#page-input").val(value);
        }

        range = `_page=${$("#page-input").val()}`
        loadSneakers(`${url}&${range}`);
    })

    $("#next-button").on("click", function() {
        value = Number($("#page-input").val()) + 1;
        if (value >= maxPage) {
            $("#next-button").prop('disabled', true);
            $("#page-input").val(value);
        }

        else {
            $("#prev-button").prop('disabled', false);
            $("#page-input").val(value);
        }
        
        range = `_page=${$("#page-input").val()}`
        loadSneakers(`${url}&${range}`);
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

function findMaxPage() {
    if (query == '') {
        maxPage = 15;
        $("#next-button").prop('disabled', false);
        $("#prev-button").prop('disabled', true);
        $("#page-input").val(1);
    }

    else {
        var checkURL = `https://example-data.draftbit.com/sneakers?`;
        if (query != undefined) checkURL += `&q=${query}`;
        if (category != undefined) checkURL += `&gender=${category}`;

        fetch(checkURL)
        .then(response => response.json())
        .then(function(data) {
            maxPage = Math.ceil(data.length / 21);
            if (maxPage <= 1) {
                $("#next-button").prop('disabled', true);
                $("#prev-button").prop('disabled', true);
                $("#page-input").val(1);
            }

            else $("#next-button").prop('disabled', false);
        });
    }
}
