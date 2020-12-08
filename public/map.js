var map;
var mapNode = document.querySelector('#map');
var mapClickListener;
var eventHandler;
var mapPins = [];

function Pin(marker, pinData) {

  this.marker = marker;
  this.name = pinData.name;
  this.latLng = pinData.latLng;
  this.clickListener = eventHandler.addListenerOnce(this.marker, 'click', generateReadOnlyInfoBox);

}

// The API will callback 'initMap()' when finished loading
function initMap() {

  // Points to the API's 'event' namespace
  eventHandler = google.maps.event;

  // Creates a new Map object inserting it into <div id="map"></div>
  map = new google.maps.Map(document.getElementById('map'), {

    // Each Map object must have a center defined with a latitude & longitude pair, and a zoom level
    center: { lat: 43.815136416911436, lng: -120.6398112171833 },
    zoom: 5,
    clickableIcons: false

  });

  // Adds a 'click' listener on the map, and calls for the creation of a new pin
  mapClickListener = eventHandler.addListenerOnce(map, 'click', generateNewPinForm);

}

function generateNewPinForm(event) {

  // Listeners pass the 'event' parameter allowing us to get the coords of the event
  var clickEventCoords = event.latLng;

  // Now the marker is generated
  var newPinMarker = new google.maps.Marker({

    position: clickEventCoords,
    map: map

  });

  // And the infobox
  var newPinInfoBoxHTML = Handlebars.templates.pinInfoBox();
  var newPinInfoBox = generatePinInfoBox(map, clickEventCoords, newPinInfoBoxHTML);

  // Wait for the dynamically generated infobox to be 'domready' (i.e. ready to be accessed within the DOM)
  eventHandler.addListenerOnce(newPinInfoBox, 'domready', function () {

    // Now we package everything together and send it off to be handled
    var newPin = {

      marker: newPinMarker,
      infoBox: newPinInfoBox,
      coords: clickEventCoords

    };

    handleNewPinForm(newPin, function () {

      // After 'handleNewPinForm' callsback (i.e. is finished), we reinstate the map 'click' listener
      mapClickListener = eventHandler.addListenerOnce(map, 'click', generateNewPinForm);

    });

  });

}

function generateReadOnlyInfoBox(event) {

  // Abandon all hope, ye who enter here

  var eventOriginPin;
  var eventOriginPinIndex;

  for (var i = 0; i < mapPins.length; i++) {

    if (mapPins[i].latLng === event.latLng) {

      eventOriginPin = mapPins[i];

    }

  }

  map.panTo(eventOriginPin.latLng);

  var context = {

    name: eventOriginPin.name,
    lat: eventOriginPin.latLng.lat(),
    lng: eventOriginPin.latLng.lng(),
    uniqueID: eventOriginPin.latLng

  }

  var readOnlyInfoBoxHTML = Handlebars.templates.pinInfoBoxReadOnly(context);
  var readOnlyInfoBox = generatePinInfoBox(map, eventOriginPin.latLng, readOnlyInfoBoxHTML);

  eventHandler.addListenerOnce(readOnlyInfoBox, 'domready', function () {

    handleReadOnlyInfoBox(eventOriginPin, readOnlyInfoBox);

  });

}

function handleReadOnlyInfoBox(pin, infobox) {

  // AVERT THINE EYES LEST THEY BURN INTO ASH

  var infoBoxContainer = mapNode.querySelector(`.pin-infobox-readonly-container[data-id="${pin.latLng}"]`)
  var buttonContainer = infoBoxContainer.querySelector('.pin-trash-button-container');
  var trashButton = buttonContainer.querySelector('button.pin-trash-button');

  eventHandler.addDomListenerOnce(trashButton, 'click', function () {

    buttonContainer.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

    eventHandler.addDomListenerOnce(trashButton, 'click', function () {

      removeMarkerAndInfoBox(pin.marker, infobox);

      mapPins.splice(mapPins.indexOf(pin), 1);

      renderSavedPlacesList(mapPins);

    });

  });

  eventHandler.addListenerOnce(infobox, 'closeclick', function () {

    infobox.close();

    pin.clickListener = eventHandler.addListenerOnce(pin.marker, 'click', generateReadOnlyInfoBox);

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

      newPinObject.infoBox.close();

      var pin_ = new Pin(newPinObject.marker, {

        name: pinNameField.value,
        latLng: newPinObject.coords

      });

      mapPins.push(pin_);

      renderSavedPlacesList(mapPins);

      callback();

    } else {

      alert('You must enter a name for a new pin!');

    }

  });

  // Self explanatory listeners for 'cancelButton' and the infobox's 'x' button
  eventHandler.addDomListener(cancelButton, 'click', function () {

    removeMarkerAndInfoBox(newPinObject.marker, newPinObject.infoBox);
    callback();

  });

  eventHandler.addListener(newPinObject.infoBox, 'closeclick', function () {

    removeMarkerAndInfoBox(newPinObject.marker, newPinObject.infoBox);
    callback();

  });

}

function removeMarkerAndInfoBox(marker, infoBox) {

  infoBox.close();
  marker.setMap(null);

}

function generatePinInfoBox(map, coords, html) {

  // 'offset' is used for the 'pixelOffset' option and must be defined by a 'Size' object
  var offset = new google.maps.Size(0, -35, 'pixel', 'pixel');
  var infoBox = new google.maps.InfoWindow();

  infoBox.setPosition(coords);
  infoBox.setContent(html);
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

function renderSavedPlacesList(list) {

  var savedPlacesList = document.querySelector('.saved-places-list-element')
  var savedPlacesListNodes = Array.from(savedPlacesList.childNodes);

  savedPlacesListNodes.forEach((node) => {

    node.parentNode.removeChild(node);

  });

  list.forEach((pin) => {

    var context = {

      name: pin.name,
      lat: pin.latLng.lat(),
      lng: pin.latLng.lng()

    }

    // Generate a 'saved-place-entry' using Handlebars and the data from the pin. Then close the infobox (leaving the marker) and callback
    var savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);

    savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);
    savedPlacesList.append(' ');

  });

}

renderSavedPlacesList(mapPins);
