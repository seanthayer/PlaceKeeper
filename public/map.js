// 'g_' prefix denotes a global variable

var g_mapNode;
var g_mapEventHandler;
var g_mapEmbed;

function Pin(pin) {

  this.marker = pin.marker;
  this.name = pin.name;
  this.latLng = pin.latLng;
  this.clickListener = null;
  this.infoBox = null;
  this.description = null;

}

// The API will callback 'initMap()' when finished loading. The global variables are also defined here.
function initMap() {

  g_mapNode = document.querySelector('#map');

  g_mapEventHandler = google.maps.event;

  // Creates a new Map object and inserts it into the selected div
  g_mapEmbed = new google.maps.Map(document.querySelector('#map'), {

    center: { lat: 43.815136416911436, lng: -120.6398112171833 },
    zoom: 5,
    clickableIcons: false

  });

  // Adds a 'click' listener on the map, and calls for the creation of a new pin form
  g_mapEventHandler.addListenerOnce(g_mapEmbed, 'click', generateNewPinForm);

}

function generateNewPinForm(event) {

  let clickEventLatLng = event.latLng;

  let newPin_marker = new google.maps.Marker({

    position: clickEventLatLng,
    map: g_mapEmbed

  });

  let newPin_infoFormHTML = Handlebars.templates.pinInfoForm();
  let newPin_infoForm = generatePinInfoBox(clickEventLatLng, newPin_infoFormHTML, g_mapEmbed);

  // Wait for the dynamically generated infobox to be loaded
  g_mapEventHandler.addListenerOnce(newPin_infoForm, 'domready', function () {

    let newPin = {

      marker: newPin_marker,
      infoBox: newPin_infoForm,
      latLng: clickEventLatLng

    };

    handleNewPinForm(newPin, function () {

      g_mapEventHandler.addListenerOnce(g_mapEmbed, 'click', generateNewPinForm);

    });

  });

}

function generatePinInfoBox(latLng, html, mapEmbed) {

  // 'offset' is used for the 'pixelOffset' option and must be defined by a 'Size' object
  let offset = new google.maps.Size(0, -35, 'pixel', 'pixel');
  let infoBox = new google.maps.InfoWindow();

  infoBox.setPosition(latLng);
  infoBox.setContent(html);
  infoBox.setOptions({ pixelOffset: offset });
  infoBox.open(mapEmbed);

  return infoBox;

}

function generateReadOnlyInfoBox(event) {

  let eventOriginPin;

  renderHandler.map.currentRenderList.forEach((pin) => {

    if (pin.latLng === event.latLng) {

      eventOriginPin = pin;

    }

  });

  g_mapEmbed.panTo(eventOriginPin.latLng);

  let context = {

    name: eventOriginPin.name,
    latLng: eventOriginPin.latLng

  }

  if (eventOriginPin.description) context.description = eventOriginPin.description;

  let readOnlyInfoBoxHTML = Handlebars.templates.pinInfoBoxReadOnly(context);
  let readOnlyInfoBox = generatePinInfoBox(eventOriginPin.latLng, readOnlyInfoBoxHTML, g_mapEmbed);

  eventOriginPin.infoBox = readOnlyInfoBox;

  g_mapEventHandler.addListenerOnce(readOnlyInfoBox, 'domready', function () {

    handleReadOnlyInfoBox(eventOriginPin);

  });

}

function handleNewPinForm(newPinObject, callback) {

  let infoForm = g_mapNode.querySelector('.pin-infoform-container');
  let infoForm_nameField = infoForm.querySelector('input.pin-infoform-name');
  let infoForm_descField = infoForm.querySelector('textarea.pin-infoform-description');
  let infoForm_saveButton = infoForm.querySelector('button[name="save"]');
  let infoForm_cancelButton = infoForm.querySelector('button[name="cancel"]');

  g_mapEventHandler.addDomListener(infoForm_saveButton, 'click', function () {

    let primaryMap = renderHandler.map.primaryMapList;

    if (infoForm_nameField.value) {

      newPinObject.infoBox.close();

      let _pin = new Pin({

        marker: newPinObject.marker,
        name: infoForm_nameField.value,
        latLng: newPinObject.latLng

      });

      _pin.clickListener = g_mapEventHandler.addListenerOnce(_pin.marker, 'click', generateReadOnlyInfoBox);

      if (infoForm_descField.value) _pin.description = infoForm_descField.value;


      primaryMap.push(_pin);

      clearFilterPins();

      renderHandler.map.rerender(g_mapEmbed);

      callback();

    } else {

      alert('You must enter a name for a new pin!');

    }

  });

  g_mapEventHandler.addDomListener(infoForm_cancelButton, 'click', function () {

    hidePin(newPinObject);
    callback();

  });

  g_mapEventHandler.addListener(newPinObject.infoBox, 'closeclick', function () {

    hidePin(newPinObject);
    callback();

  });

}

function handleReadOnlyInfoBox(pin) {

  let infoBox = g_mapNode.querySelector(`.pin-infobox-readonly-container[data-latLng="${pin.latLng}"]`)
  let infoBox_buttonContainer = infoBox.querySelector('.trash-button-container');
  let infoBox_trashButton = infoBox_buttonContainer.querySelector('button.trash-button');

  g_mapEventHandler.addDomListenerOnce(infoBox_trashButton, 'click', function () {

    infoBox_buttonContainer.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

    g_mapEventHandler.addDomListenerOnce(infoBox_trashButton, 'click', function () {

      let primaryMap = renderHandler.map.primaryMapList;
      let savedPlacesList = document.querySelector('.saved-places-list-element');
      let listEntry = savedPlacesList.querySelector(`[data-latLng="${pin.latLng}"]`);

      hidePin(pin);

      savedPlacesList.removeChild(listEntry);

      primaryMap.splice(primaryMap.indexOf(pin), 1);

    });

  });

  g_mapEventHandler.addListenerOnce(pin.infoBox, 'closeclick', function () {

    pin.infoBox.close();

    pin.clickListener = g_mapEventHandler.addListenerOnce(pin.marker, 'click', generateReadOnlyInfoBox);

  });

}

function handleSaveModalInputs(callback) {

  let saveModal = document.querySelector('.modal-container.save-modal');
  let saveModal_selectedPins = saveModal.querySelectorAll('.table-row-checkbox:checked');
  let fileName = saveModal.querySelector('.modal-input').value;

  if (fileName) {

    fileName = fileName.trim().replace(/\s+/g, '-');

    let pinData = [];

    saveModal_selectedPins.forEach((pin) => {

      let pinTableRow = pin.parentNode.parentNode;

      let pinObj = {

        name: pinTableRow.dataset.name,
        lat: pinTableRow.dataset.lat,
        lng: pinTableRow.dataset.lng

      }

      if (pinTableRow.dataset.description) pinObj.description = pinTableRow.dataset.description;

      pinData.push(pinObj);

    });

    commsHandler.put.exportMap(fileName, pinData, callback);

  } else {

    alert('Please enter a file name!');

  }

}

function importMap(mapName, mapEmbed) {

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

  }).then(function (importData) {

    let importMap = [];

    importData.forEach((entry) => {

      let coords = { lat: parseFloat(entry.lat), lng: parseFloat(entry.lng) };

      let newLatLng = new google.maps.LatLng(coords);

      let marker = new google.maps.Marker({

        position: newLatLng,
        map: null

      });

      let _pin = new Pin({

        marker: marker,
        name: entry.name,
        latLng: newLatLng

      });

      if (entry.description) _pin.description = entry.description;

      importMap.push(_pin);

    });

    renderHandler.map.setNewPrimaryMap(importMap, mapEmbed);

  }).catch(function (err) {

    console.error('[ERROR] ' + err);

  });

}

function hidePin(pin) {

  pin.marker.setMap(null);

  if (pin.clickListener) pin.clickListener.remove();

  if (pin.infoBox) pin.infoBox.close();

}

function showPin(pin, mapEmbed) {

  pin.marker.setMap(mapEmbed);

  pin.clickListener = g_mapEventHandler.addListenerOnce(pin.marker, 'click', generateReadOnlyInfoBox);

}
