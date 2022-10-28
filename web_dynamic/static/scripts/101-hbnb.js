$(document).ready( function () {
    let checkedAmenities = {};
    let checkedStates = {};
    let checkedCities = {};
    $('.amenities input[type=checkbox]').change(function () {
      if ($(this).prop('checked')) {
        checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
      } else if (!$(this).prop('checked')) {
        delete checkedAmenities[$(this).attr('data-id')];
      }
      if (Object.keys(checkedAmenities).length === 0) {
        $('div.amenities h4').html('&nbsp');
      } else {
        $('div.amenities h4').text(Object.values(checkedAmenities).join(', '));
      }
    });

    $('.state_input').change(function () {
      if ($(this).prop('checked')) {
        checkedStates[$(this).attr('data-id')] = $(this).attr('data-name');
      } else if (!$(this).prop('checked')) {
        delete checkedStates[$(this).attr('data-id')];
      }
      if (Object.keys(checkedStates).length === 0 && Object.keys(checkedCities).length === 0) {
        $('.locations h4').html('&nbsp');
      } else {
        $('.locations h4').text(Object.values(checkedStates).concat(Object.values(checkedCities)).join(', '));
      }
    });

    $('.city_input').change(function () {
      if ($(this).prop('checked')) {
        checkedCities[$(this).attr('data-id')] = $(this).attr('data-name');
      } else if (!$(this).prop('checked')) {
        delete checkedCities[$(this).attr('data-id')];
      }
      if (Object.keys(checkedStates).length === 0 && Object.keys(checkedCities).length === 0) {
        $('.locations h4').html('&nbsp');
      } else {
        $('.locations h4').text(Object.values(checkedCities).concat(Object.values(checkedStates)).join(', '));
      }
    });

    const api_url = `http://0.0.0.0:5001/api/v1/status/`;
    $.get(api_url, function (data, textStatus) {
      if (textStatus === 'success'){
        if (data.status === 'OK') {
          $('#api_status').addClass('available');
        } else {
          $('#api_status').removeClass('available');
        } 
      }
    });

    const places_search_url = `http://0.0.0.0:5001/api/v1/places_search/`;
    $.ajax({
      url: places_search_url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({}),
      dataType: 'json',
      success: function (data) {
        for (const d of data) {
          //appending the article to the section
          $('section.places').append(
          `<article>
            <div class="title_box">
              <h2>${d.name}</h2>
              <div class="price_by_night">$${d.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${d.max_guest} Guest(s)</div>
              <div class="number_rooms">${d.number_rooms} Bedroom(s)</div>
              <div class="number_bathrooms">${d.number_bathrooms} Bathroom(s)</div>
            </div>
            <div class="description">
              ${d.description}
            </div>
            
            <div class="reviews">
              <h2>Reviews <span class="reviewSpan" data-id="${d.id}">show</span></h2>
              <ul>
              </ul>
            </div>
          </article>`);
        }

      $('.reviewSpan').change(function () {
        $.ajax({
          url: 'http://0.0.0.0:5001/api/v1/places/' + $(this).attr('data-id') + '/reviews',
          success: function (data) {
            $('.reviews h2 span').addClass('hideReview');
            if ($('.reviewSpan').text('show')) {
              for (const review of data) {
                $('.reviews ul').append(`<li>${review.text}</li>`);
              }
              $('.hideReview').text('hide');
            } else if ($('.hideReview').text('hide')) {
                $('.reviews ul').empty();
                $('.reviewSpan').text('show');
            }
          }

        });
      });
      //

      },
      error: function (error) {
        console.log(error);
      }
    });

    $('.filters button').click(function () {
      $('section.places').empty();
      $.ajax({
        url: places_search_url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          amenities: Object.keys(checkedAmenities),
          states: Object.keys(checkedStates),
          cities: Object.keys(checkedCities)}),
        success: function (data) {
          for (const d of data) {
            //appending the article to the section
            $('section.places').append(
            `<article>
              <div class="title_box">
                <h2>${d.name}</h2>
                <div class="price_by_night">$${d.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${d.max_guest} Guest(s)</div>
                <div class="number_rooms">${d.number_rooms} Bedroom(s)</div>
                <div class="number_bathrooms">${d.number_bathrooms} Bathroom(s)</div>
              </div>
              <div class="description">
                ${d.description}
              </div>

              <div class="reviews">
                <h2>Reviews <span class="reviewSpan" data-id="${d.id}">show</span></h2>
                <ul>
                </ul>
              </div>
          </article>`);
          }
          $('.reviewSpan').change(function () {
            $.ajax({
              url: 'http://0.0.0.0:5001/api/v1/places/' + $(this).attr('data-id') + '/reviews',
              success: function (data) {
                $('.reviews h2 span').addClass('hideReview');
                if ($('.reviewSpan').text('show')) {
                  for (const review of data) {
                    $('.reviews ul').append(`<li>${review.text}</li>`);
                  }
                  $('.hideReview').text('hide');
                } else if ($('.hideReview').text('hide')) {
                    $('.reviews ul').empty();
                    $('.reviewSpan').text('show');
                }
              }
    
            });
          });
        },
        error: function (error) {
          console.log(error);
        }
      });
    });
});
