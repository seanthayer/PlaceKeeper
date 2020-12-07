var map;
var mapNode = document.querySelector('#map');
var mapClickListener;
var eventHandler;

// The API will callback 'initMap()' when finished loading
function initMap() {

  // Points to the API's 'event' namespace
  eventHandler = google.maps.event;

  // Creates a new Map object inserting it into <div id="map"></div>
  map = new google.maps.Map(document.getElementById('map'), {

    // Each Map object must have a center defined with a latitude & longitude pair, and a zoom level
    center: { lat: 43.815136416911436, lng: -120.6398112171833 },
    zoom: 5

  });

  mapClickListener = eventHandler.addListener(map, 'click', createNewPin);

}

function createNewPin(event) {

  var clickEventCoords = event.latLng;

  var newPinMarker = new google.maps.Marker({

    position: clickEventCoords,
    map: map

  });

  var newPinInfoBox = openPinInfoBox(map, clickEventCoords);

  eventHandler.addListenerOnce(newPinInfoBox, 'domready', function () {

    var newPin = {

      marker: newPinMarker,
      infoBox: newPinInfoBox,
      coords: clickEventCoords

    };

    handleNewPinObject(newPin);

  });

}

function handleNewPinObject(newPinObject) {

  eventHandler.removeListener(mapClickListener);

  var pinNameField = mapNode.querySelector('input#pin-infobox-name');
  var pinDescField = mapNode.querySelector('textarea#pin-infobox-description');
  var saveButton = mapNode.querySelector('.pin-infobox-buttons-container > button[name="save"]');
  var cancelButton = mapNode.querySelector('.pin-infobox-buttons-container > button[name="cancel"]')

  eventHandler.addDomListener(saveButton, 'click', function () {

    if (pinNameField.value) {

      var context = {

        name: pinNameField.value,
        lat: newPinObject.coords.lat(),
        lng: newPinObject.coords.lng()

      }

      var savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
      var savedPlacesList = document.querySelector('.saved-places-list-element');

      savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

      newPinObject.infoBox.close();
      mapClickListener = eventHandler.addListener(map, 'click', createNewPin);

    } else {

      alert('You must enter a name for a new pin!');

    }

  });

  eventHandler.addDomListener(cancelButton, 'click', function () {

    removeMarkerAndInfoBox(newPinObject);
    mapClickListener = eventHandler.addListener(map, 'click', createNewPin);

  });

  eventHandler.addListener(newPinObject.infoBox, 'closeclick', function () {

    removeMarkerAndInfoBox(newPinObject);
    mapClickListener = eventHandler.addListener(map, 'click', createNewPin);

  });

}

function removeMarkerAndInfoBox(newPinObject) {

  newPinObject.infoBox.close();
  newPinObject.marker.setMap(null);

}

function openPinInfoBox(map, coords) {

  var offset = new google.maps.Size(0, -35, 'pixel', 'pixel');
  var infoBox = new google.maps.InfoWindow();

  infoBox.setPosition(coords);
  infoBox.setContent(Handlebars.templates.pinInfoBox());
  infoBox.setOptions({ pixelOffset: offset });
  infoBox.open(map);

  return infoBox;

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
