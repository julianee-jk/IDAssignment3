let url = "https://example-data.draftbit.com/sneakers?_limit=21";
let category, query;
let limit = "_limit=21";
let range = "_page=1";
let maxPage = 15;

$(document).ready(function() {
    loadSneakers(`${url}&${range}`); // Inital sneaker data load

    // If user press enter in search fill
    $("#searchBar").keyup(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault(); // Prevent page refresh
            $('#search').click();
        }
    });

    $('#search').on("click", function() { // If user searches for a sneaker
        // Reset pagination to page 1
        $("#next-button").prop('disabled', false);
        $("#prev-button").prop('disabled', true);
        range = "_page=1";
        $("#page-input").val(1);

        // If category sort has been checked
        if ($('.cat-group > input.btn-check').is(':checked')) url = `https://example-data.draftbit.com/sneakers?_limit=21&gender=${category}`;
        else url = `https://example-data.draftbit.com/sneakers?_limit=21`;

        query = $("#searchBar").val().replaceAll(' ', '%20'); // Get the search input and replace all the spaces with "%20"

        findMaxPage(); // Find the maximum page for search result
        loadSneakers(url + `&q=${query}&${range}`); // Load the sneaker data
        url = url + `&q=${query}`; // Save query search to url global variable 
    });

    $(".cat-group > input.btn-check").on("click", function(e) { // If user selects a category group
        // Reset pagination to page 1
        $("#next-button").prop('disabled', false);
        $("#prev-button").prop('disabled', true);
        range = "_page=1";
        $("#page-input").val(1);

        // If user has previously searched for a sneaker
        if (query != undefined && query != '') url = `https://example-data.draftbit.com/sneakers?_limit=21&q=${query}`;
        else url = `https://example-data.draftbit.com/sneakers?_limit=21`;

        category = e.target.attributes.value.value; // Get category selected
        
        findMaxPage(); // Find the maximum page for search result
        loadSneakers(url + `&gender=${category}&${range}`); // Load the sneaker data
        url = url + `&gender=${category}`; // Save category select to url global variable
    });

    $(".sort-group > input.btn-check").on("click", function(e) { 
        if ($(".sort-group > input.btn-check:checked").val() == "trending") { // If user selects trending tab
            $(".loading-icon").show(); // Show loading icon
            $(".pagination-group").hide(); // Hide pagination
            $(".searchBar").hide(); // Hide search bar
            $(".cat-group").hide(); // Hide category filter
            $(".sneaker-cards").html(""); // Clear sneaker cards
            $(".back-to-top").css("margin-top", "42px"); // Set back to top top-margin to 42px
            loadTrending(); // Load trending sneaker data
        }

        else { // Else if user selects latest tab
            $(".loading-icon").show(); // Show loading icon
            $(".pagination-group").show(); // Show pagination
            $(".searchBar").show(); // Show search bar
            $(".cat-group").show(); // Show category group buttons
            $(".back-to-top").css("margin-top", "0"); // Set back to top top-margin to 0px
            loadSneakers(`${url}&${range}`); // Load latest sneaker data
        }
    });

    $("#page-input").keyup(function(e) {
        if (e.keyCode === 13) { // If user press enter in pagination input
            value = Number($("#page-input").val()); // Get value of page input
            
            if (value <= 1) { // If user enters a value less than 1, set back to one and set previous-button to disabled
                $("#next-button").prop('disabled', false);
                $("#prev-button").prop('disabled', true);
                $("#page-input").val(1);
            }

            else if (value >= maxPage) { // If user has reached the maximum page limit
                $("#prev-button").prop('disabled', false);
                $("#next-button").prop('disabled', true);
                $("#page-input").val(maxPage);
            }
            
            else { // Else if the page limit is 1 then disable both buttons
                $("#next-button").prop('disabled', false);
                $("#prev-button").prop('disabled', false);
                $("#page-input").val(value);
            }

            range = `_page=${$("#page-input").val()}`; // Save the page range
            loadSneakers(`${url}&${range}`); // Load sneaker data
        }
    });

    $("#prev-button").on("click", function() { // If user clicks on previous page button
        value = Number($("#page-input").val()) - 1;

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


        range = `_page=${$("#page-input").val()}`;
        loadSneakers(`${url}&${range}`);
    });

    $("#next-button").on("click", function() { // If user clicks on next page button
        value = Number($("#page-input").val()) + 1;
        
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
        
        range = `_page=${$("#page-input").val()}`;
        loadSneakers(`${url}&${range}`);
    });

    $(".back-to-top").on("click", function() { // If user clicks back to top button
        $("html, body").animate({ scrollTop: 0 }, "slow"); // Move the web page to the top
        return false;
    });
});

function loadSneakers(url) { // Load sneaker data
    $(".sneaker-cards").html(""); // Clear sneaker cards

    fetch(url) // Get saved global variable url
    .then(response => response.json())
    .then(function(data) {
        var sneakers = data;
        sneakers.map(function(s) {
            if (s.retailPrice == null) { // If the price is null means that the sneaker is unavailable
                $(".sneaker-cards").append(`
                <li class="sneaker-card" id="${s.id}" style="opacity: 0.7">
                    <img src="${s.media.imageUrl}" alt="${s.title}" />
                    <span class="sneaker-title">${s.title}</span>
                    <span class="sneaker-colorway">${s.colorway}</span>
                    <span class="sneaker-price">Not Available</span>
                </li>
                `);
            }
            
            else {
                $(".sneaker-cards").append(`
                    <li class="sneaker-card" onclick="selectCard('${s.id}')" id="${s.id}" style="cursor: pointer">
                        <img src="${s.media.imageUrl}" alt="${s.title}" />
                        <span class="sneaker-title">${s.title}</span>
                        <span class="sneaker-colorway">${s.colorway}</span>
                        <span class="sneaker-price">$${s.retailPrice}</span>
                    </li>
                `);
            }
        });
    });
    
    $(".loading-icon").hide(); // Hide loading icon
}

function selectCard(sneakerId) { // If user has selected a sneaker, direct them to the product page
    localStorage.setItem("viewProductId", sneakerId);
    window.location.href = "product.html";
}

function findMaxPage() { // Get the maximum page limit for the search
    if (query == '') { // If the user enters nothing
        maxPage = 15; // Set default maximum page limit to 15

        // Reset pagination to page 1
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

function loadTrending() { // Load trending sneakers function
    $.ajax({ // Get transaction data filter it by product purchases and sort by recent purchases and limit to 21 entries
        "async": true,
        "crossDomain": true,
        "url": `https://sneakerzone-11b9.restdb.io/rest/transaction-info?q={"purchaseType":"Product"}&max=21&h={"$orderby":{"purchaseDateTime":-1}}`,
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        }
    })
    .done(function(response) {
        var trendingArray = []; // Array to store unique sneaker IDs

        response.map(transaction => {
            transaction.purchaseData.map(data => {
                if (!(trendingArray.includes(data[0]))) { // If sneaker is NOT included in trending array, add to array
                    trendingArray.push(data[0]);
                }
            });
        });

        displayTrending(trendingArray);
    });
}

function displayTrending(trendingArray) { // Fetch the sneaker data using trending array IDs and display the sneakers
    trendingArray.map(function(sneakerID) {
        fetch(`https://example-data.draftbit.com/sneakers/${sneakerID}`)
        .then(res => res.json())
        .then(function(s) {
            $(".sneaker-cards").append(`
                <li class="sneaker-card" onclick="selectCard('${s.id}')" id="${s.id}" style="cursor: pointer">
                    <img src="${s.media.imageUrl}" alt="${s.title}" />
                    <span class="sneaker-title">${s.title}</span>
                    <span class="sneaker-colorway">${s.colorway}</span>
                    <span class="sneaker-price">$${s.retailPrice}</span>
                </li>
            `);
        });
    });

    $(".loading-icon").hide(); // Hide loading icon
}
