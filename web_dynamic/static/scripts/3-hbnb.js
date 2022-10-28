$(document).ready( function () {
    const checkedAmenities = {};
    $('input[type=checkbox]').change(function () {
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
      success: function (data) {
        for (const d of data) {
          //appending the article to the section
          $('section.places').append(`<article>
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
        </article>`);
        }
      }
    });
});
