var map;
var mapNode = document.querySelector('#map');
var mapClickListener;
var eventHandler;

var renderHandler = {

  currentRenderList: [],

  primaryMapList: [],

  setNewPrimaryMap: function (newMap) {

    this.primaryMapList.forEach((pin) => {

      removeMarkerAndInfoBox(pin.marker, pin.infoBox);

    });

    this.currentRenderList = [];
    this.renderComponents(newMap);
    this.primaryMapList = newMap;

  },

  rerenderMap: function () {

    this.renderComponents(this.primaryMapList);

  },

  renderComponents: function (newRenderList, renderOptions = {mapEmbed: true, placesList: true}) {

    if (renderOptions.mapEmbed || renderOptions.mapEmbed === undefined) {

      let setIntersect = [];

      for (let i = 0; i < this.currentRenderList.length; i++) {

        for (let  j = 0; j < newRenderList.length; j++) {

          let currentPin_latLng = this.currentRenderList[i].latLng.toString();
          let newPin_latLng = newRenderList[j].latLng.toString();

          if (currentPin_latLng === newPin_latLng) {

            setIntersect.push(currentPin_latLng);

          }

        }

      }

      let renderSubDiff = this.currentRenderList.filter(pin => !setIntersect.includes(pin.latLng.toString()) );
      let renderAddDiff = newRenderList.filter(pin => !setIntersect.includes(pin.latLng.toString()) );

      console.log('Intersect: ', setIntersect);
      console.log('Sub diff: ', renderSubDiff);
      console.log('Add diff: ', renderAddDiff);

      renderSubDiff.forEach((pin) => {

        removeMarkerAndInfoBox(pin.marker, pin.infoBox);

      });

      renderAddDiff.forEach((pin) => {

        pin.marker.setMap(map);

      });

    }

    if (renderOptions.placesList || renderOptions.placesList === undefined) {

      let savedPlacesList = document.querySelector('.saved-places-list-element');

      removeChildNodes(savedPlacesList);

      newRenderList.forEach((pin) => {

        let context = {

          name: pin.name,
          latLng: pin.latLng,
          lat: pin.latLng.lat(),
          lng: pin.latLng.lng()

        }

        if (pin.description) context.description = pin.description;

        let savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
        savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

        let listEntry = savedPlacesList.querySelector(`[data-latLng="${pin.latLng}"]`);
        let latLngButton = listEntry.querySelector('button.saved-place-entry-latLng')
        let trashButton = listEntry.querySelector('button.trash-button');

        eventHandler.addDomListener(latLngButton, 'click', function () {

          map.panTo(pin.latLng);

        });

        eventHandler.addDomListenerOnce(trashButton, 'click', function () {

          trashButton.parentNode.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

          eventHandler.addDomListenerOnce(trashButton, 'click', function () {

            let primaryMap = renderHandler.primaryMapList;

            removeMarkerAndInfoBox(pin.marker, pin.infoBox);

            savedPlacesList.removeChild(listEntry);

            primaryMap.splice(primaryMap.indexOf(pin), 1);

          });

        });

      });

    }

    this.currentRenderList = newRenderList;

  },

  renderSaveModal: function () {

    let saveModal = document.querySelector('.modal-container.save-modal')
    let saveModal_ModalTable = saveModal.querySelector('.modal-table');
    let saveModal_TableRows = saveModal_ModalTable.querySelectorAll('tr.modal-table-row');

    saveModal_TableRows.forEach((node) => {

      // TODO: What does this even select?
      node.parentNode.remove();

    });

    this.primaryMapList.forEach((pin) => {

      let context = {

        name: pin.name,
        lat: pin.latLng.lat(),
        lng: pin.latLng.lng()

      }

      if (pin.description) context.description = pin.description;

      let pinsHTML = Handlebars.templates.pinTableRow(context);
      saveModal_ModalTable.insertAdjacentHTML('beforeend', pinsHTML);

    });

  }

}

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

  renderHandler.currentRenderList.forEach((pin) => {

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

    let primaryMap = renderHandler.primaryMapList;

    if (infoForm_NameField.value) {

      newPinObject.infoBox.close();

      let pin_ = new Pin({

        marker: newPinObject.marker,
        name: infoForm_NameField.value,
        latLng: newPinObject.latLng

      });

      if (infoForm_DescField.value) pin_.description = infoForm_DescField.value;

      primaryMap.push(pin_);

      clearFilterPins();

      renderHandler.rerenderMap();

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

      let primaryMap = renderHandler.primaryMapList;
      let savedPlacesList = document.querySelector('.saved-places-list-element');
      let listEntry = savedPlacesList.querySelector(`[data-latLng="${pin.latLng}"]`);

      removeMarkerAndInfoBox(pin.marker, pin.infoBox);

      savedPlacesList.removeChild(listEntry);

      primaryMap.splice(primaryMap.indexOf(pin), 1);

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

  }).then(function (importData) {

    let importMap = [];

    importData.forEach((entry) => {

      let coords = { lat: parseFloat(entry.lat), lng: parseFloat(entry.lng) };

      let newLatLng = new google.maps.LatLng(coords);

      let marker = new google.maps.Marker({

        position: newLatLng,
        map: null

      });

      let pin_ = new Pin({

        marker: marker,
        name: entry.name,
        latLng: newLatLng

      });

      if (entry.description) pin_.description = entry.description;

      importMap.push(pin_);

    });

    renderHandler.setNewPrimaryMap(importMap);

  }).catch(function (err) {

    console.error('[ERROR] ' + err);

  });

}

function removeMarkerAndInfoBox(marker, infoBox=null) {

  marker.setMap(null);

  if (infoBox) infoBox.close();

}
