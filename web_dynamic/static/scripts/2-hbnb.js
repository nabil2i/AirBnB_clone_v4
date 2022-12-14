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
});
