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
  this.infoBox = null;
  this.description = null;

}

// The API will callback 'initMap()' when finished loading
function initMap() {

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

function exportMap(fileName, data) {

  let entryData = {

    fileName: fileName,
    data: data

  }

  let requestHEADER = new Headers({ 'Content-Type': 'application/json'});

  let requestPOST = new Request('/exportFile', { method: 'POST', headers: requestHEADER, body: JSON.stringify(entryData) });

  fetch(requestPOST).then(function (res) {

    if (res.ok) {

      console.log('POST Successful');

    } else {

      console.warn('[WARN] ' + res.status);

      alert('Error saving map data!');

    }

  });

}

function generateNewPinForm(event) {

  let clickEventLatLng = event.latLng;

  let newPin_Marker = new google.maps.Marker({

    position: clickEventLatLng,
    map: map

  });

  let newPin_InfoFormHTML = Handlebars.templates.pinInfoForm();
  let newPin_InfoForm = generatePinInfoBox(map, clickEventLatLng, newPin_InfoFormHTML);

  // Wait for the dynamically generated infobox to be loaded
  eventHandler.addListenerOnce(newPin_InfoForm, 'domready', function () {

    let newPin = {

      marker: newPin_Marker,
      infoBox: newPin_InfoForm,
      latLng: clickEventLatLng

    };

    handleNewPinForm(newPin, function () {

      mapClickListener = eventHandler.addListenerOnce(map, 'click', generateNewPinForm);

    });

  });

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
    latLng: eventOriginPin.latLng

  }

  if (eventOriginPin.description) context.description = eventOriginPin.description;

  let readOnlyInfoBoxHTML = Handlebars.templates.pinInfoBoxReadOnly(context);
  let readOnlyInfoBox = generatePinInfoBox(map, eventOriginPin.latLng, readOnlyInfoBoxHTML);

  eventOriginPin.infoBox = readOnlyInfoBox;

  eventHandler.addListenerOnce(readOnlyInfoBox, 'domready', function () {

    handleReadOnlyInfoBox(eventOriginPin);

  });

}

function handleNewPinForm(newPinObject, callback) {

  let infoForm = mapNode.querySelector('.pin-infoform-container');
  let infoForm_NameField = infoForm.querySelector('input.pin-infoform-name');
  let infoForm_DescField = infoForm.querySelector('textarea.pin-infoform-description');
  let infoForm_SaveButton = infoForm.querySelector('button[name="save"]');
  let infoForm_CancelButton = infoForm.querySelector('button[name="cancel"]');

  eventHandler.addDomListener(infoForm_SaveButton, 'click', function () {

    if (infoForm_NameField.value) {

      newPinObject.infoBox.close();

      let pin_ = new Pin({

        marker: newPinObject.marker,
        name: infoForm_NameField.value,
        latLng: newPinObject.latLng

      });

      if (infoForm_DescField.value) pin_.description = infoForm_DescField.value;

      mapPins.push(pin_);

      renderDynamicComponents(mapPins);

      callback();

    } else {

      alert('You must enter a name for a new pin!');

    }

  });

  eventHandler.addDomListener(infoForm_CancelButton, 'click', function () {

    removeMarkerAndInfoBox(newPinObject.marker, newPinObject.infoBox);
    callback();

  });

  eventHandler.addListener(newPinObject.infoBox, 'closeclick', function () {

    removeMarkerAndInfoBox(newPinObject.marker, newPinObject.infoBox);
    callback();

  });

}

function handleReadOnlyInfoBox(pin) {

  let infoBox = mapNode.querySelector(`.pin-infobox-readonly-container[data-latLng="${pin.latLng}"]`)
  let infoBox_ButtonContainer = infoBox.querySelector('.trash-button-container');
  let infoBox_TrashButton = infoBox_ButtonContainer.querySelector('button.trash-button');

  eventHandler.addDomListenerOnce(infoBox_TrashButton, 'click', function () {

    infoBox_ButtonContainer.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

    eventHandler.addDomListenerOnce(infoBox_TrashButton, 'click', function () {

      removeMarkerAndInfoBox(pin.marker, pin.infoBox);

      mapPins.splice(mapPins.indexOf(pin), 1);

      renderDynamicComponents(mapPins);

    });

  });

  eventHandler.addListenerOnce(pin.infoBox, 'closeclick', function () {

    pin.infoBox.close();

    pin.clickListener = eventHandler.addListenerOnce(pin.marker, 'click', generateReadOnlyInfoBox);

  });

}

function handleSaveModalInputs(callback) {

  let saveModal = document.querySelector('.modal-container.save-modal');
  let saveModal_SelectedPins = saveModal.querySelectorAll('.table-row-checkbox:checked');
  let fileName = saveModal.querySelector('.modal-input').value;

  if (fileName) {

    fileName = fileName.trim().replace(/\s+/g, '-');

    let pinData = [];

    saveModal_SelectedPins.forEach((pin) => {

      let pinTableRow = pin.parentNode.parentNode;

      let pinObj = {

        name: pinTableRow.dataset.name,
        lat: pinTableRow.dataset.lat,
        lng: pinTableRow.dataset.lng

      }

      if (pinTableRow.dataset.description) pinObj.description = pinTableRow.dataset.description;

      pinData.push(pinObj);

    });

    exportMap(fileName, pinData);

    callback();

  } else {

    alert('Please enter a file name!');

  }

}

function importMap(mapName) {

  let mapURL = '/importMap/' + mapName;

  let requestHEADER = new Headers({ 'Content-Type': 'application/json'});

  let requestGET = new Request(mapURL, { method: 'GET', headers: requestHEADER });

  fetch(requestGET).then(function (res) {

    if (res.ok) {

      return res.json();

    } else {

      console.error(`[ERROR] Resource (${mapName}) not found`);

      throw res.status;

    }

  }).then(function (importMap) {

    purgeMapPinData(mapPins);

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

      if (pin.description) pin_.description = pin.description;

      mapPins.push(pin_);

    });

    renderDynamicComponents(mapPins);

  }).catch(function (err) {

    console.error('[ERROR] ' + err);

  });

}

function purgeMapPinData(list) {

  let n = list.length - 1;

  for (let pin = n; pin >= 0; pin--) {

    list[pin].marker.setMap(null);

    if (list[pin].infoBox) list[pin].infoBox.close();

    list.pop();

  }

  renderDynamicComponents(list);

}

function removeMarkerAndInfoBox(marker, infoBox=null) {

  marker.setMap(null);

  if (infoBox) infoBox.close();

}

function renderDynamicComponents(list) {

  let savedPlacesList = document.querySelector('.saved-places-list-element');

  let saveModal = document.querySelector('.modal-container.save-modal')
  let saveModal_ModalTable = saveModal.querySelector('.modal-table');
  let saveModal_TableRows = saveModal_ModalTable.querySelectorAll('tr.modal-table-row');

  removeChildNodes(savedPlacesList);

  saveModal_TableRows.forEach((node) => {

    node.parentNode.remove();

  });

  list.forEach((pin) => {

    let context = {

      name: pin.name,
      latLng: pin.latLng,
      lat: pin.latLng.lat(),
      lng: pin.latLng.lng()

    }

    if (pin.description) context.description = pin.description;

    let pinsHTML = Handlebars.templates.pinTableRow(context);
    saveModal_ModalTable.insertAdjacentHTML('beforeend', pinsHTML);

    let savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
    savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

    let currentEntry = savedPlacesList.querySelector(`[data-latLng="${pin.latLng}"]`);
    let trashButton = currentEntry.querySelector('button.trash-button');

    eventHandler.addDomListenerOnce(trashButton, 'click', function () {

      trashButton.parentNode.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

      eventHandler.addDomListenerOnce(trashButton, 'click', function () {

        removeMarkerAndInfoBox(pin.marker, pin.infoBox);

        mapPins.splice(mapPins.indexOf(pin), 1);

        renderDynamicComponents(mapPins);

      });

    });

  });

}
