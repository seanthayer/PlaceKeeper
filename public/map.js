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

function exportMap(data, fileName) {

  let postRequest = new XMLHttpRequest();
  let reqURL = '/exportFile';
  let entryData = {

    fileName: fileName,
    data: data

  }

  postRequest.open('POST', reqURL, true);
  postRequest.setRequestHeader('Content-Type', 'application/json');

  postRequest.addEventListener('load', function(event) {

    if (event.target.status != 200) {

      alert('Server failed to save data!');

    } else {

      console.log('POST Successful');

    }

  });

  postRequest.send(JSON.stringify(entryData));

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

function handleNewPinForm(newPinObject, callback) {

  // 'infoForm_DescField' is currently not stored anywhere, but is a placeholder for the future

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

function handleReadOnlyInfoBox(pin, infobox) {

  let infoBox = mapNode.querySelector(`.pin-infobox-readonly-container[data-latLng="${pin.latLng}"]`)
  let infoBox_ButtonContainer = infoBox.querySelector('.pin-trash-button-container');
  let infoBox_TrashButton = infoBox_ButtonContainer.querySelector('button.pin-trash-button');

  eventHandler.addDomListenerOnce(infoBox_TrashButton, 'click', function () {

    infoBox_ButtonContainer.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

    eventHandler.addDomListenerOnce(infoBox_TrashButton, 'click', function () {

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

        name: pinTableRow.querySelector('.table-row-name').textContent,
        lat: pinTableRow.querySelector('.table-row-latitude').textContent,
        lng: pinTableRow.querySelector('.table-row-longitude').textContent

      }

      pinData.push(pinObj);

    });

    exportMap(pinData, fileName);

    callback();

  } else {

    alert('Please enter a file name!');

  }

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

function removeMarkerAndInfoBox(marker, infoBox) {

  infoBox.close();
  marker.setMap(null);

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
      lat: pin.latLng.lat(),
      lng: pin.latLng.lng()

    }

    let pinsHTML = Handlebars.templates.pinTableRow(context);
    saveModal_ModalTable.insertAdjacentHTML('beforeend', pinsHTML);

    let savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
    savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

  });

}
