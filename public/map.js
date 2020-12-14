var map;
var mapNode = document.querySelector('#map');
var mapClickListener;
var eventHandler;
var mapPins = [];

function Pin(pin) {

  this.marker = pin.marker;
  this.name = pin.name;
  this.latLng = pin.latLng;
  this.clickListener = eventHandler.addListenerOnce(this.marker, 'click', generateReadOnlyInfoBox);

}

// The API will callback 'initMap()' when finished loading
function initMap() {

  // Points to the API's 'event' namespace
  eventHandler = google.maps.event;

  // Creates a new Map object and inserts it into the selected div
  map = new google.maps.Map(document.querySelector('#map'), {

    center: { lat: 43.815136416911436, lng: -120.6398112171833 },
    zoom: 5,
    clickableIcons: false

  });

  // Adds a 'click' listener on the map, and calls for the creation of a new pin form
  mapClickListener = eventHandler.addListenerOnce(map, 'click', generateNewPinForm);

}

function generateNewPinForm(event) {

  var clickEventLatLng = event.latLng;

  var newPin_Marker = new google.maps.Marker({

    position: clickEventLatLng,
    map: map

  });

  var newPin_InfoBoxHTML = Handlebars.templates.pinInfoBox();
  var newPin_InfoBox = generatePinInfoBox(map, clickEventLatLng, newPin_InfoBoxHTML);

  // Wait for the dynamically generated infobox to be loaded
  eventHandler.addListenerOnce(newPin_InfoBox, 'domready', function () {

    var newPin = {

      marker: newPin_Marker,
      infoBox: newPin_InfoBox,
      latLng: clickEventLatLng

    };

    handleNewPinForm(newPin, function () {

      // After 'handleNewPinForm' callsback (i.e. is finished), we reinstate the map 'click' listener
      mapClickListener = eventHandler.addListenerOnce(map, 'click', generateNewPinForm);

    });

  });

}

function generateReadOnlyInfoBox(event) {

  var eventOriginPin;

  mapPins.forEach((pin) => {

    if (pin.latLng === event.latLng) {

      eventOriginPin = pin;

    }

  });

  map.panTo(eventOriginPin.latLng);

  var context = {

    name: eventOriginPin.name,
    lat: eventOriginPin.latLng.lat(),
    lng: eventOriginPin.latLng.lng(),
    latLng: eventOriginPin.latLng

  }

  var readOnlyInfoBoxHTML = Handlebars.templates.pinInfoBoxReadOnly(context);
  var readOnlyInfoBox = generatePinInfoBox(map, eventOriginPin.latLng, readOnlyInfoBoxHTML);

  eventHandler.addListenerOnce(readOnlyInfoBox, 'domready', function () {

    handleReadOnlyInfoBox(eventOriginPin, readOnlyInfoBox);

  });

}

function handleReadOnlyInfoBox(pin, infobox) {

  var infoBoxContainer = mapNode.querySelector(`.pin-infobox-readonly-container[data-latLng="${pin.latLng}"]`)
  var buttonContainer = infoBoxContainer.querySelector('.pin-trash-button-container');
  var trashButton = buttonContainer.querySelector('button.pin-trash-button');

  eventHandler.addDomListenerOnce(trashButton, 'click', function () {

    buttonContainer.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

    eventHandler.addDomListenerOnce(trashButton, 'click', function () {

      removeMarkerAndInfoBox(pin.marker, infobox);

      mapPins.splice(mapPins.indexOf(pin), 1);

      renderDynamicComponents(mapPins);

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

  eventHandler.addDomListener(saveButton, 'click', function () {

    if (pinNameField.value) {

      newPinObject.infoBox.close();

      var pin_ = new Pin({

        marker: newPinObject.marker,
        name: pinNameField.value,
        latLng: newPinObject.latLng

      });

      mapPins.push(pin_);

      renderDynamicComponents(mapPins);

      callback();

    } else {

      alert('You must enter a name for a new pin!');

    }

  });

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

function generatePinInfoBox(map, latLng, html) {

  // 'offset' is used for the 'pixelOffset' option and must be defined by a 'Size' object
  var offset = new google.maps.Size(0, -35, 'pixel', 'pixel');
  var infoBox = new google.maps.InfoWindow();

  infoBox.setPosition(latLng);
  infoBox.setContent(html);
  infoBox.setOptions({ pixelOffset: offset });
  infoBox.open(map);

  return infoBox;

}

function importMap(mapName) {

  var getRequest = new XMLHttpRequest();
  var reqURL = '/importMap/' + mapName;

  getRequest.open('GET', reqURL);
  getRequest.setRequestHeader('Content-Type', 'application/json');

  getRequest.addEventListener('load', function(event) {

    if (event.target.status === 200) {

      purgeMapPinData(mapPins);

      var importMap;

      importMap = JSON.parse(event.target.response);

      importMap.forEach((pin) => {

        var coords = { lat: parseFloat(pin.lat), lng: parseFloat(pin.lng) };

        var latLngObj = new google.maps.LatLng(coords);

        var marker = new google.maps.Marker({

          position: latLngObj,
          map: map

        });

        var pin_ = new Pin({

          marker: marker,
          name: pin.name,
          latLng: latLngObj

        });

        mapPins.push(pin_);

      });

      renderDynamicComponents(mapPins);

    } else if (event.target.status === 404) {

      alert('Map file not found!');

    } else {

      alert('Error requesting file!');

    }

  });

  getRequest.send();

}

function purgeMapPinData(list) {

  var n = list.length - 1;

  for (var pin = n; pin >= 0; pin--) {

    list[pin].marker.setMap(null);
    list.pop();

  }

  renderDynamicComponents(list);

}

function renderDynamicComponents(list) {

  var savedPlacesList = document.querySelector('.saved-places-list-element');

  var saveModal = document.querySelector('.modal-container.save-modal')
  var modalTable = saveModal.querySelector('.modal-table');
  var modalTableRows = modalTable.querySelectorAll('tr.modal-table-row');

  removeChildNodes(savedPlacesList);

  modalTableRows.forEach((node) => {

    node.parentNode.remove();

  });


  list.forEach((pin) => {

    var context = {

      name: pin.name,
      lat: pin.latLng.lat(),
      lng: pin.latLng.lng()

    }

    var pinsHTML = Handlebars.templates.pins(context);
    modalTable.insertAdjacentHTML('beforeend', pinsHTML);

    var savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
    savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

  });

}
