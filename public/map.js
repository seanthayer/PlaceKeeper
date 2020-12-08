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

  // Adds a 'click' listener on the map, and calls for the creation of a new pin
  mapClickListener = eventHandler.addListener(map, 'click', generateNewPinForm);

}

function generateNewPinForm(event) {

  // Removes the listener associated with a map 'click' event. Prevents multiple form instances from being generated at a time
  eventHandler.removeListener(mapClickListener);

  // Listeners pass the 'event' parameter allowing us to get the coords of the event
  var clickEventCoords = event.latLng;

  // Now the marker is generated
  var newPinMarker = new google.maps.Marker({

    position: clickEventCoords,
    map: map

  });

  // And the infobox
  var newPinInfoBox = generatePinInfoBox(map, clickEventCoords);

  // Wait for the dynamically generated infobox to be 'domready' (i.e. ready to be accessed within the DOM)
  eventHandler.addListenerOnce(newPinInfoBox, 'domready', function () {

    // Now we package everything together and send it off to be handled
    var newPin = {

      marker: newPinMarker,
      infoBox: newPinInfoBox,
      coords: clickEventCoords

    };

    handleNewPinForm(newPin, function () {

      // After 'handleNewPinForm' callsback (i.e. is finished), we reinstate the 'click' listener
      mapClickListener = eventHandler.addListener(map, 'click', generateNewPinForm);

    });

  });

}

function handleNewPinForm(newPinObject, callback) {

  // 'pinDescField' is currently not stored anywhere, but is a placeholder for the future

  var pinNameField = mapNode.querySelector('input#pin-infobox-name');
  var pinDescField = mapNode.querySelector('textarea#pin-infobox-description');
  var saveButton = mapNode.querySelector('.pin-infobox-buttons-container > button[name="save"]');
  var cancelButton = mapNode.querySelector('.pin-infobox-buttons-container > button[name="cancel"]')

  // The Google API allows us to add event listeners on DOM elements through it, much like the native JS '.addEventListener()'
  eventHandler.addDomListener(saveButton, 'click', function () {

    // A name is required for a new pin
    if (pinNameField.value) {

      var context = {

        name: pinNameField.value,
        lat: newPinObject.coords.lat(),
        lng: newPinObject.coords.lng()

      }

      // Input new pin to modal
      var pinsHTML = Handlebars.templates.pins(context);
      var pinsList = document.getElementsByClassName('modal-pin-table');
      pinsList[0].insertAdjacentHTML('beforeend', pinsHTML);

      // Generate a 'saved-place-entry' using Handlebars and the data from the pin. Then close the infobox (leaving the marker) and callback
      var savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
      var savedPlacesList = document.querySelector('.saved-places-list-element');

      savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

      newPinObject.infoBox.close();
      callback();

    } else {

      alert('You must enter a name for a new pin!');

    }

  });

  // Self explanatory listeners for 'cancelButton' and the infobox's 'x' button
  eventHandler.addDomListener(cancelButton, 'click', function () {

    removeMarkerAndInfoBox(newPinObject);
    callback();

  });

  eventHandler.addListener(newPinObject.infoBox, 'closeclick', function () {

    removeMarkerAndInfoBox(newPinObject);
    callback();

  });

}

function removeMarkerAndInfoBox(newPinObject) {

  newPinObject.infoBox.close();
  newPinObject.marker.setMap(null);

}

function generatePinInfoBox(map, coords) {

  // 'offset' is used for the 'pixelOffset' option and must be defined by a 'Size' object
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
