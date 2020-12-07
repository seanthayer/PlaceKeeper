var map;
var mapClickListener;
var eventHandler;

// The API will callback 'initMap()' when finished loading
function initMap() {

  eventHandler = google.maps.event;

  // Creates a new Map object inserting it into <div id="map"></div>
  map = new google.maps.Map(document.getElementById('map'), {

    // Each Map object must have a center defined with a latitude & longitude pair, and a zoom level
    center: { lat: 43.815136416911436, lng: -120.6398112171833 },
    zoom: 5

  });

  eventHandler.addListenerOnce(map, 'tilesloaded', function () {

    mapClickListener = eventHandler.addListener(map, 'click', createNewPin);

  });

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

  var saveButton = document.querySelector('.pin-infobox-buttons-container > button[name="save"]');
  var cancelButton = document.querySelector('.pin-infobox-buttons-container > button[name="cancel"]')

  eventHandler.addDomListener(saveButton, 'click', function () {
    console.log('Save click');

    var context = {

      name: "Test",
      lat: newPinObject.coords.lat(),
      lng: newPinObject.coords.lng()

    }

    var savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
    var savedPlacesList = document.querySelector('.saved-places-list-element');

    savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

    newPinObject.infoBox.close();

  });

  eventHandler.addDomListener(cancelButton, 'click', function () {
    console.log('Cancel click');

    removeMarkerAndInfoBox(newPinObject);

  });

  eventHandler.addListener(newPinObject.infoBox, 'closeclick', function () {
    console.log('Cancel click');

    removeMarkerAndInfoBox(newPinObject);

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
