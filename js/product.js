var size = '';

$(document).ready(function() {
  sneaker_id = localStorage.getItem('viewProductId')
  loadSneakers(sneaker_id);

  if (localStorage.getItem('shoppingBag') != null) {
      var shoppingBag = JSON.parse(localStorage.getItem('shoppingBag'))
  }
  
  else {
      var shoppingBag = [];
  }

  $(".qty").keyup(function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      if ($(".qty").val() <= 0) $(".qty").val(1);
    }
  });

  $("#addToBag").click(function() {
      $(".check-loading-icon").show();
      $("#addToBag").hide();

      if ($(".qty").val() <= 0) $(".qty").val(1);
      
      var qty = Number($(".qty").val());
      var item = [sneaker_id, qty, size];
      var notDuplicate = true;

      if ($(".qty").val() == 0) qty = 1;
      else qty = $(".qty").val();

      for (var i = 0; i < shoppingBag.length; i++) {
        if (item[0] === shoppingBag[i][0] && item[2] === shoppingBag[i][2]) {
          shoppingBag[i][1] += item[1];
          notDuplicate = false;
        }
      }
      if (notDuplicate) shoppingBag.push(item);
      localStorage.setItem('shoppingBag', JSON.stringify(shoppingBag));
      setTimeout(function(){$("#addToBag").show(); $(".check-loading-icon").hide();}, 2800);
  });

  // +/- qty button increment
  $(".incre-button").on("click", function() {
      var $button = $(this);
      var oldValue = $button.parent().find("input").val();
    
      if ($button.text() == "+") {
          var newVal = parseFloat(oldValue) + 1;
      } 

      else {
       // Don't allow decrementing below 1
        if (oldValue > 1) {
          var newVal = parseFloat(oldValue) - 1;
        } else {
          newVal = 1;
        }
      }

      $button.parent().find("input").val(newVal);
    });
});

function loadSneakers(sneaker_id) {
  var url = `https://example-data.draftbit.com/sneakers/${sneaker_id}`

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
      
      checkCategorySize(data.gender);
  });
}

function checkCategorySize(category) {
  var htmlString = '';
  switch(category) {
    case 'men':
      htmlString += `
        <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS6" onclick="setSize('US6')" checked>
        <label class="btn btn-outline-primary" for="sizeGroupUS6">US6</label>
      `

      for (let i = 7; i <= 12; i++) {
        htmlString += `
          <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS${i}" onclick="setSize('US${i}')">
          <label class="btn btn-outline-primary" for="sizeGroupUS${i}">US${i}</label>
        `
      }

      $('.size').html(htmlString);
      size = 'US6';
      break;

    case 'women':
      htmlString += `
        <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS4" onclick="setSize('US4')" checked>
        <label class="btn btn-outline-primary" for="sizeGroupUS4">US4</label>
      `

      for (let i = 5; i <= 10; i++) {
        htmlString += `
          <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS${i}" onclick="setSize('US${i}')">
          <label class="btn btn-outline-primary" for="sizeGroupUS${i}">US${i}</label>
        `
      }

      $('.size').html(htmlString);
      size = 'US4';
      break;

    default:
      htmlString += `
        <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS3" onclick="setSize('US3')" checked>
        <label class="btn btn-outline-primary" for="sizeGroupUS3">US3</label>
      `
      for (let i = 4; i <= 7; i++) {
        htmlString += `
          <input type="radio" class="btn-check" name="sizeGroup" id="sizeGroupUS${i}" onclick="setSize('US${i}')">
          <label class="btn btn-outline-primary" for="sizeGroupUS${i}">US${i}</label>
        `
      }
      $('.size').html(htmlString);
      size = 'US3';
      break;
  }
}

function setSize(value) {
  size = value;
}