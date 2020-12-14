var map;
var mapNode = document.querySelector('#map');
var mapClickListener;
var mapPins = [];
var eventHandler;

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

  let clickEventLatLng = event.latLng;

  let newPin_Marker = new google.maps.Marker({

    position: clickEventLatLng,
    map: map

  });

  let newPin_InfoBoxHTML = Handlebars.templates.pinInfoBox();
  let newPin_InfoBox = generatePinInfoBox(map, clickEventLatLng, newPin_InfoBoxHTML);

  // Wait for the dynamically generated infobox to be loaded
  eventHandler.addListenerOnce(newPin_InfoBox, 'domready', function () {

    let newPin = {

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

  let eventOriginPin;

  mapPins.forEach((pin) => {

    if (pin.latLng === event.latLng) {

      eventOriginPin = pin;

    }

  });

  map.panTo(eventOriginPin.latLng);

  let context = {

    name: eventOriginPin.name,
    lat: eventOriginPin.latLng.lat(),
    lng: eventOriginPin.latLng.lng(),
    latLng: eventOriginPin.latLng

  }

  let readOnlyInfoBoxHTML = Handlebars.templates.pinInfoBoxReadOnly(context);
  let readOnlyInfoBox = generatePinInfoBox(map, eventOriginPin.latLng, readOnlyInfoBoxHTML);

  eventHandler.addListenerOnce(readOnlyInfoBox, 'domready', function () {

    handleReadOnlyInfoBox(eventOriginPin, readOnlyInfoBox);

  });

}

function handleReadOnlyInfoBox(pin, infobox) {

  let infoBoxContainer = mapNode.querySelector(`.pin-infobox-readonly-container[data-latLng="${pin.latLng}"]`)
  let buttonContainer = infoBoxContainer.querySelector('.pin-trash-button-container');
  let trashButton = buttonContainer.querySelector('button.pin-trash-button');

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

      let pin_ = new Pin({

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
  let offset = new google.maps.Size(0, -35, 'pixel', 'pixel');
  let infoBox = new google.maps.InfoWindow();

  infoBox.setPosition(latLng);
  infoBox.setContent(html);
  infoBox.setOptions({ pixelOffset: offset });
  infoBox.open(map);

  return infoBox;

}

function importMap(mapName) {

  let getRequest = new XMLHttpRequest();
  let reqURL = '/importMap/' + mapName;

  getRequest.open('GET', reqURL);
  getRequest.setRequestHeader('Content-Type', 'application/json');

  getRequest.addEventListener('load', function(event) {

    if (event.target.status === 200) {

      purgeMapPinData(mapPins);

      let importMap;

      importMap = JSON.parse(event.target.response);

      importMap.forEach((pin) => {

        let coords = { lat: parseFloat(pin.lat), lng: parseFloat(pin.lng) };

        let latLngObj = new google.maps.LatLng(coords);

        let marker = new google.maps.Marker({

          position: latLngObj,
          map: map

        });

        let pin_ = new Pin({

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

  let n = list.length - 1;

  for (let pin = n; pin >= 0; pin--) {

    list[pin].marker.setMap(null);
    list.pop();

  }

  renderDynamicComponents(list);

}

function renderDynamicComponents(list) {

  let savedPlacesList = document.querySelector('.saved-places-list-element');

  let saveModal = document.querySelector('.modal-container.save-modal')
  let modalTable = saveModal.querySelector('.modal-table');
  let modalTableRows = modalTable.querySelectorAll('tr.modal-table-row');

  removeChildNodes(savedPlacesList);

  modalTableRows.forEach((node) => {

    node.parentNode.remove();

  });


  list.forEach((pin) => {

    let context = {

      name: pin.name,
      lat: pin.latLng.lat(),
      lng: pin.latLng.lng()

    }

    let pinsHTML = Handlebars.templates.pins(context);
    modalTable.insertAdjacentHTML('beforeend', pinsHTML);

    let savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
    savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

  });

}
