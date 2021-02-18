var size = '';

$(document).ready(function() {
  sneaker_id = localStorage.getItem('viewProductId');
  loadSneakers(sneaker_id);
  
  var shoppingBag;
  if (localStorage.getItem('shoppingBag') != null) { // If user has an exisiting shopping bag, get the shopping bag array
      shoppingBag = JSON.parse(localStorage.getItem('shoppingBag'));
  }
  
  else { // Otherwise, create an empty shopping bag array
      shoppingBag = [];
  }

  $(".qty").keyup(function(e) {
    if (e.keyCode === 13) { // If user press enter
      e.preventDefault(); // Prevent page refresh
      if ($(".qty").val() <= 0) $(".qty").val(1); // If user set their input as less than or equal to 0, set back to 1
    }
  });

  $("#addToBag").click(function() { // If user clicks add to bag
      $(".check-loading-icon").show(); // Show the check loading icon
      $("#addToBag").hide(); // Hide the add to bag button

      if ($(".qty").val() <= 0) $(".qty").val(1); // If user set their input as less than or equal to 0, set back to 1
      
      var qty = Number($(".qty").val()); // Otherwise, get the value of the qty input
      var item = [sneaker_id, qty, size]; // Item array to store the inputs the user set
      var notDuplicate = true; // Create a not duplicate variable for check

      // Check if the user has already added the same sneaker with the same size
      for (var i = 0; i < shoppingBag.length; i++) {
        if (item[0] === shoppingBag[i][0] && item[2] === shoppingBag[i][2]) {
          shoppingBag[i][1] += item[1]; // Add the qty together if they are the same
          notDuplicate = false;
        }
      }

      if (notDuplicate) shoppingBag.push(item); // Otherwise, add the item
      localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
      setTimeout(function() {
        $("#addToBag").show(); 
        $(".check-loading-icon").hide();
      }, 2800);
  });

    // +/- qty button increment
    $(".incre-button").on("click", function() {
            var $button = $(this);
            var oldValue = $button.parent().find("input").val();
        
            if ($button.text() == "+") { 
                // Don't allow incrementing above 99
                if (oldValue >= 1 && oldValue < 99) newVal = parseFloat(oldValue) + 1;
                else newVal = 1;
            } 

            else {
                // Don't allow decrementing below 1
                if (oldValue > 1) newVal = parseFloat(oldValue) - 1;
                else newVal = 1;
            }

        $button.parent().find("input").val(newVal);
    });
});

function loadSneakers(sneaker_id) {
  var url = `https://example-data.draftbit.com/sneakers/${sneaker_id}`;

  fetch(url)
  .then(response => response.json())
  .then(function(data) {
      $('.product-img').append(`<img src="${data.media.imageUrl}" alt="${data.title}"/>`);
      $('.product-release-date').append(new Date(data.releaseDate).toDateString());
      $('.product-header').html(`${data.brand} ${data.year}`);
      $('.product-title').html(data.title);
      $('.product-price').append(data.retailPrice);
      $('.product-colorway').append(data.colorway);
      $('.product-category').append((data.gender).charAt(0).toUpperCase() + (data.gender).slice(1));
      $('.size-label').append(`(${(data.gender).charAt(0).toUpperCase() + (data.gender).slice(1)})`);
      
      checkCategorySize(data.gender); // Check the category size
  });
}

function checkCategorySize(category) {
  var htmlString = '';
  switch(category) {
    case 'men': // If the sneaker is for men, get sizes from US6 to US12
      htmlString += `
        <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS6" onclick="setSize('US6')" checked>
        <label class="btn btn-outline-primary" for="sizeGroupUS6">US6</label>
      `;

      for (let i = 7; i <= 12; i++) {
        htmlString += `
          <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS${i}" onclick="setSize('US${i}')">
          <label class="btn btn-outline-primary" for="sizeGroupUS${i}">US${i}</label>
        `;
      }

      $('.size').html(htmlString);
      size = 'US6'; // Default US6
      break;

    case 'women':  // If the sneaker is for women, get sizes from US4 to US10
      htmlString += `
        <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS4" onclick="setSize('US4')" checked>
        <label class="btn btn-outline-primary" for="sizeGroupUS4">US4</label>
      `;

      for (let i = 5; i <= 10; i++) {
        htmlString += `
          <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS${i}" onclick="setSize('US${i}')">
          <label class="btn btn-outline-primary" for="sizeGroupUS${i}">US${i}</label>
        `;
      }

      $('.size').html(htmlString);
      size = 'US4'; // Default US4
      break;

    default: // If the sneaker is for child, get sizes from US3 to US7
      htmlString += `
        <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS3" onclick="setSize('US3')" checked>
        <label class="btn btn-outline-primary" for="sizeGroupUS3">US3</label>
      `;
          
      for (let i = 4; i <= 7; i++) {
        htmlString += `
          <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS${i}" onclick="setSize('US${i}')">
          <label class="btn btn-outline-primary" for="sizeGroupUS${i}">US${i}</label>
        `;
      }
            
      $('.size').html(htmlString);
      size = 'US3'; // Default US3
      break;
  }
}

function setSize(value) { size = value; } // If user clicks on a size radio button, set the size value to size variable