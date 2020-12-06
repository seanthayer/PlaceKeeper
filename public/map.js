var map;

// The API will callback 'initMap()' when finished loading
function initMap() {

  // Creates a new Map object inserting it into <div id="map"></div>
  map = new google.maps.Map(document.getElementById('map'), {

    // Each Map object must have a center defined with a latitude & longitude pair, and a zoom level
    center: {lat: 43.815136416911436, lng: -120.6398112171833},
    zoom: 5

  });

  map.addListener('click', function (event) {

    var marker = new google.maps.Marker({

      position: event.latLng,
      map: map

    });

    var context = {
      name: "Test",
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }

    var savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);

    var savedPlacesList = document.querySelector('.saved-places-list-element');
    savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

  });

}

function importMap() {

  var getRequest = new XMLHttpRequest();
  var reqURL = '/importMap';

  getRequest.open('GET', reqURL);

  getRequest.setRequestHeader('Content-Type', 'application/json');

  getRequest.addEventListener('load', function(event) {

    var importMap;

    importMap = JSON.parse(event.target.response);

    importMap.forEach((item, i) => {

      var coords = { lat: parseFloat(item.lat), lng: parseFloat(item.lng) };

      var marker = new google.maps.Marker({

        position: coords,
        map: map

      });

    });

  });

  getRequest.send();

}
