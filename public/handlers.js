var commsHandler = {

  get: {

    mapsDirectory: function (callback) {

      let requestHEADER = new Headers({ 'Content-Type': 'application/json'});

      let requestGET = new Request('/getMapsDirectory', { method: 'GET', headers: requestHEADER });

      fetch(requestGET).then(function (res) {

        if (res.ok) {

          return res.json();

        } else {

          console.error(`[ERROR] Data directory not found`);

          throw res.status;

        }

      }).then(function (data) {

        for (let i = 0; i < data.length; i++) {

          data[i] = data[i].split('.')[0];

        }

        callback(data);

      }).catch(function (err) {

        console.error('[ERROR] ' + err);

      });

    },

    importMap: function (mapName) {

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

        renderHandler.map.setNewPrimaryList(importMap);

      }).catch(function (err) {

        console.error('[ERROR] ' + err);

      });

    }

  },

  put: {

    exportMap: function (fileName, data, callback) {

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

        callback();

      }).catch(function (err) {

        console.error('[ERROR] ' + err);

      });

    }

  }

}

var renderHandler = {

  map: {

    mapTarget: null,

    currentRenderList: [],

    primaryList: [],

    getCurrentRender: function () {

      return Array.from(this.currentRenderList);

    },

    getPrimaryList: function () {

      return Array.from(this.primaryList);

    },

    setNewMapTarget: function (mapEmbed) {

      this.mapTarget = mapEmbed;

    },

    setNewPrimaryList: function (newMap) {

      this.derender();

      this.renderComponents(newMap);
      this.primaryList = newMap;

    },

    setNewRender: function (newRender) {

      this.currentRenderList = newRender;

    },

    derender: function () {

      console.log('Derendering');

      this.primaryList.forEach((pin) => {

        this.hidePin(pin);

      });

      this.currentRenderList = [];

    },

    rerender: function () {

      this.renderComponents( this.getPrimaryList() );

    },

    renderComponents: function (newRender) {

      // Begin map render

      let currentRender = this.getCurrentRender();
      let setIntersect = [];

      for (let i = 0; i < currentRender.length; i++) {

        for (let  j = 0; j < newRender.length; j++) {

          let currentPin_latLng = currentRender[i].latLng.toString();
          let newPin_latLng = newRender[j].latLng.toString();

          if (currentPin_latLng === newPin_latLng) {

            setIntersect.push(currentPin_latLng);

          }

        }

      }

      let renderSubDiff = currentRender.filter(pin => !setIntersect.includes(pin.latLng.toString()) );
      let renderAddDiff = newRender.filter(pin => !setIntersect.includes(pin.latLng.toString()) );

      console.log('Intersect: ', setIntersect);
      console.log('Sub diff: ', renderSubDiff);
      console.log('Add diff: ', renderAddDiff);

      renderSubDiff.forEach((pin) => {

        this.hidePin(pin);

      });

      renderAddDiff.forEach((pin) => {

        this.showPin(pin);

      });

      // End map render

      // Begin placesList render

      let savedPlacesList = interfaceHandler.placesList.node;

      removeChildNodes(savedPlacesList);

      newRender.forEach((pin) => {

        let context = {

          name: pin.name,
          latLng: pin.latLng,
          lat: pin.latLng.lat(),
          lng: pin.latLng.lng()

        }

        if (pin.description) context.description = pin.description;

        let savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
        savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

        interfaceHandler.placesList.generateListeners(pin, this.mapTarget);

      });

      // End placesList render

      this.setNewRender(newRender);

    },

    pushPin: function (pin) {

      this.primaryList.push(pin);

    },

    hidePin: function (pin) {

      pin.marker.setMap(null);

      if (pin.clickListener) pin.clickListener.remove();

      if (pin.infoBox) pin.infoBox.close();

    },

    showPin: function (pin) {

      pin.marker.setMap(this.mapTarget);

      pin.clickListener = g_mapEventHandler.addListenerOnce(pin.marker, 'click', renderHandler.pin.renderPinInfo);

    },

    splicePin: function (pin) {

      this.primaryList.splice(this.primaryList.indexOf(pin), 1);

    },

  },

  pin: {

    renderNewPinForm: function (event) {

      let mapEmbed = renderHandler.map.mapTarget;

      let clickEventLatLng = event.latLng;

      let newPin_marker = new google.maps.Marker({

        position: clickEventLatLng,
        map: mapEmbed

      });

      let newPin_infoFormHTML = Handlebars.templates.pinInfoForm();
      let newPin_infoForm = renderHandler.pin._generatePinInfoBox(clickEventLatLng, newPin_infoFormHTML);

      // Wait for the dynamically generated infobox to be loaded
      g_mapEventHandler.addListenerOnce(newPin_infoForm, 'domready', function () {

        let newPin = {

          marker: newPin_marker,
          infoBox: newPin_infoForm,
          latLng: clickEventLatLng

        };

        interfaceHandler.pin.handleNewPinForm(newPin, function () {

          g_mapEventHandler.addListenerOnce(mapEmbed, 'click', renderHandler.pin.renderNewPinForm);

        });

      });

    },

    renderPinInfo: function (event) {

      let currentRender = renderHandler.map.getCurrentRender();
      let mapEmbed = renderHandler.map.mapTarget;
      let eventOriginPin;

      currentRender.forEach((pin) => {

        if (pin.latLng === event.latLng) {

          eventOriginPin = pin;

        }

      });

      mapEmbed.panTo(eventOriginPin.latLng);

      let context = {

        name: eventOriginPin.name,
        latLng: eventOriginPin.latLng

      }

      if (eventOriginPin.description) context.description = eventOriginPin.description;

      let infoBoxHTML = Handlebars.templates.pinInfoBox(context);
      let infoBox = renderHandler.pin._generatePinInfoBox(eventOriginPin.latLng, infoBoxHTML);

      eventOriginPin.infoBox = infoBox;

      g_mapEventHandler.addListenerOnce(infoBox, 'domready', function () {

        interfaceHandler.pin.handleInfoBox(eventOriginPin);

      });

    },

    _generatePinInfoBox: function (latLng, html) {

      // 'offset' is used for the 'pixelOffset' option and must be defined by a 'Size' object
      let offset = new google.maps.Size(0, -35, 'pixel', 'pixel');
      let infoBox = new google.maps.InfoWindow();

      infoBox.setPosition(latLng);
      infoBox.setContent(html);
      infoBox.setOptions({ pixelOffset: offset });
      infoBox.open(renderHandler.map.mapTarget);

      return infoBox;

    }

  },

  filter: {

    applyFilter: function () {

      let searchbar_input = interfaceHandler.filter.node_searchbar.querySelector('.search-bar-input');

      let filter = { text: searchbar_input.value.trim() }

      if (filter.text) {

        let filterMap = [];
        let primaryList = renderHandler.map.getPrimaryList();

        primaryList.forEach((pin) => {

          if ( renderHandler.filter.pinPassesFilter(pin, filter) ) filterMap.push(pin);

        });

        renderHandler.filter.clearFilterPins();

        renderHandler.map.renderComponents(filterMap);

        renderHandler.filter.createFilterPin(filter);

        searchbar_input.value = '';

      }

    },

    pinPassesFilter: function (pin, filter) {

      if (filter.text) {

        let pinName = pin.name.toLowerCase();
        let filterText = filter.text.toLowerCase();

        if (pinName.indexOf(filterText) === -1) {

          return false;

        }

      }

      return true;

    },

    clearFilterPins: function () {

      let filterInfoBox = interfaceHandler.filter.node_filterInfo;

      removeChildNodes(filterInfoBox);

      if (!filterInfoBox.classList.contains('hidden')) {

        filterInfoBox.classList.add('hidden');

      }

    },

    createFilterPin: function (filter) {

      let filterInfoBox = interfaceHandler.filter.node_filterInfo;
      filterInfoBox.classList.remove('hidden');

      let filterPin = document.createElement('div');
      filterPin.classList.add('filter-pin-container');

      filterPin.insertAdjacentHTML('afterbegin', `<span class="filter-pin">Filtering for: "${filter.text}</span>"`);
      filterPin.insertAdjacentHTML('beforeend', `<i class="fas fa-times-circle"></i>`);

      filterInfoBox.appendChild(filterPin);


      interfaceHandler.filter.generateListener(renderHandler.map.mapTarget);

    }

  },

  saveModal: {

    render: function () {

      let saveModal = interfaceHandler.saveModal.node;
      let saveModal_backdrop = interfaceHandler.saveModal.node_backdrop;
      let saveModal_ModalTable = saveModal.querySelector('.modal-table');
      let saveModal_TableRows = saveModal_ModalTable.querySelectorAll('tr.modal-table-row');

      saveModal_TableRows.forEach((node) => {

        // TODO: What does this even select?
        node.parentNode.remove();

      });

      renderHandler.map.getPrimaryList().forEach((pin) => {

        let context = {

          name: pin.name,
          lat: pin.latLng.lat(),
          lng: pin.latLng.lng()

        }

        if (pin.description) context.description = pin.description;

        let pinsHTML = Handlebars.templates.pinTableRow(context);
        saveModal_ModalTable.insertAdjacentHTML('beforeend', pinsHTML);

      });

      interfaceHandler.saveModal.generateListeners();

      saveModal.classList.remove('hidden');
      saveModal_backdrop.classList.remove('hidden');

    },

    derender: function () {

      let saveModal = interfaceHandler.saveModal.node;
      let saveModal_backdrop = interfaceHandler.saveModal.node_backdrop;

      saveModal.classList.add('hidden');
      saveModal_backdrop.classList.add('hidden');

      saveModal.querySelector('.modal-input').value = '';

      saveModal.querySelector('.modal-table-select-all').checked = false;

      saveModal.querySelectorAll('.table-row-checkbox').forEach((item) => {

        item.checked = false;

      });

    }

  },

  importModal: {

    render: function () {

      let importModal = interfaceHandler.importModal.node;
      let importModal_backdrop = interfaceHandler.importModal.node_backdrop;
      let importModal_directory = importModal.querySelector('.modal-directory-container');

      commsHandler.get.mapsDirectory(function (data) {

        data.forEach((item, i) => {

          let uniqueID = item + '.' + i;
          let directoryEntry = `<div class="map-directory-entry-container" data-id="${uniqueID}"> <i class="fas fa-file"></i> <h4 class="file-title">${item}</h4> </div>`;

          importModal_directory.insertAdjacentHTML('beforeend', directoryEntry);

        });

        interfaceHandler.importModal.generateListeners(renderHandler.map.mapTarget);

        importModal.classList.remove('hidden');
        importModal_backdrop.classList.remove('hidden');

      });

    },

    derender: function () {

      let importModal = interfaceHandler.importModal.node;
      let importModal_backdrop = interfaceHandler.importModal.node_backdrop;

      importModal.classList.add('hidden');
      importModal_backdrop.classList.add('hidden');

    }

  }

}

var interfaceHandler = {

  pin: {

    handleNewPinForm: function (newPin, callback) {

      let infoForm = g_mapNode.querySelector('.pin-infoform-container');
      let infoForm_nameField = infoForm.querySelector('input.pin-infoform-name');
      let infoForm_descField = infoForm.querySelector('textarea.pin-infoform-description');
      let infoForm_saveButton = infoForm.querySelector('button[name="save"]');
      let infoForm_cancelButton = infoForm.querySelector('button[name="cancel"]');

      g_mapEventHandler.addDomListenerOnce(infoForm_saveButton, 'click', function () {

        if (infoForm_nameField.value) {

          let _pin = new Pin({

            marker: newPin.marker,
            name: infoForm_nameField.value,
            latLng: newPin.latLng

          });

          if (infoForm_descField.value) _pin.description = infoForm_descField.value;

          newPin.infoBox.close();

          renderHandler.map.pushPin(_pin);

          renderHandler.filter.clearFilterPins();

          renderHandler.map.rerender();

          callback();

        } else {

          alert('You must enter a name for a new pin!');

        }

      });

      g_mapEventHandler.addDomListener(infoForm_cancelButton, 'click', function () {

        renderHandler.map.hidePin(newPin);
        callback();

      });

      g_mapEventHandler.addListener(newPin.infoBox, 'closeclick', function () {

        renderHandler.map.hidePin(newPin);
        callback();

      });

    },

    handleInfoBox: function (pin) {

      let infoBox = g_mapNode.querySelector(`.pin-infobox-container[data-latLng="${pin.latLng}"]`)
      let infoBox_buttonContainer = infoBox.querySelector('.trash-button-container');
      let infoBox_trashButton = infoBox_buttonContainer.querySelector('button.trash-button');

      g_mapEventHandler.addDomListenerOnce(infoBox_trashButton, 'click', function () {

        infoBox_buttonContainer.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

        g_mapEventHandler.addDomListenerOnce(infoBox_trashButton, 'click', function () {

          let savedPlacesList = interfaceHandler.placesList.node;
          let listEntry = savedPlacesList.querySelector(`[data-latLng="${pin.latLng}"]`);

          renderHandler.map.hidePin(pin);
          renderHandler.map.splicePin(pin);

          savedPlacesList.removeChild(listEntry);

        });

      });

      g_mapEventHandler.addListenerOnce(pin.infoBox, 'closeclick', function () {

        pin.infoBox.close();

        pin.clickListener = g_mapEventHandler.addListenerOnce(pin.marker, 'click', renderHandler.pin.renderPinInfo);

      });

    }

  },

  placesList: {

    node: document.querySelector('.saved-places-list-element'),

    generateListeners: function (pin, mapEmbed) {

      let savedPlacesList = this.node;
      let listEntry = savedPlacesList.querySelector(`[data-latLng="${pin.latLng}"]`);
      let latLngButton = listEntry.querySelector('button.saved-place-entry-latLng')
      let trashButton = listEntry.querySelector('button.trash-button');

      latLngButton.addEventListener('click', function () {

        mapEmbed.panTo(pin.latLng);

      });

      trashButton.addEventListener('click', function () {

        trashButton.parentNode.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

        trashButton.addEventListener('click', function () {

          renderHandler.map.hidePin(pin);
          renderHandler.map.splicePin(pin);

          savedPlacesList.removeChild(listEntry);

        }, { once: true });

      }, { once: true });

    }

  },

  filter: {

    node_searchbar: document.querySelector('.search-bar-container'),
    node_filterInfo: document.querySelector('.saved-places-filter-info'),

    generateListener: function (mapEmbed) {

      let filterPin_xButton = this.node_filterInfo.querySelector('.fas.fa-times-circle');

      filterPin_xButton.addEventListener('click', function () {

        renderHandler.filter.clearFilterPins();

        renderHandler.map.rerender();

      }, { once: true });

    }

  },

  saveModal: {

    node: document.querySelector('.modal-container.save-modal'),
    node_backdrop: document.querySelector('.modal-backdrop.save-modal'),

    generateListeners: function () {

      let saveModal = this.node;
      let saveModal_xButton = saveModal.querySelector('.modal-x-button');
      let saveModal_closeButton = saveModal.querySelector('.modal-close-button');
      let saveModal_saveButton = saveModal.querySelector('.modal-save-button');
      let saveModal_selectAllCheckbox = saveModal.querySelector('.modal-table-select-all');
      let saveModal_checkboxes = saveModal.querySelectorAll('.table-row-checkbox');

      saveModal_xButton.addEventListener('click', this._close);
      saveModal_closeButton.addEventListener('click', this._close);

      saveModal_saveButton.addEventListener('click', this._save);

      saveModal_selectAllCheckbox.addEventListener('click', this._selectAll);

      saveModal_checkboxes.forEach((checkbox) => {

        checkbox.addEventListener('change', this._checkboxChangeListener);

      });

    },

    _close: function (event) {

      let saveModal = interfaceHandler.saveModal.node;
      let saveModal_xButton = saveModal.querySelector('.modal-x-button');
      let saveModal_closeButton = saveModal.querySelector('.modal-close-button');
      let saveModal_saveButton = saveModal.querySelector('.modal-save-button');
      let saveModal_selectAllCheckbox = saveModal.querySelector('.modal-table-select-all');
      let saveModal_checkboxes = saveModal.querySelectorAll('.table-row-checkbox');

      renderHandler.saveModal.derender();

      saveModal_xButton.removeEventListener('click', interfaceHandler.saveModal._close);
      saveModal_closeButton.removeEventListener('click', interfaceHandler.saveModal._close);

      saveModal_saveButton.removeEventListener('click', interfaceHandler.saveModal._save);

      saveModal_selectAllCheckbox.removeEventListener('click', interfaceHandler.saveModal._selectAll);

      saveModal_checkboxes.forEach((checkbox) => {

        checkbox.removeEventListener('change', interfaceHandler.saveModal._checkboxChangeListener);

      });

    },

    _save: function (event) {

      let saveModal = interfaceHandler.saveModal.node;
      let saveModal_selectedPins = saveModal.querySelectorAll('.table-row-checkbox:checked');
      let fileName = saveModal.querySelector('.modal-input').value;

      if (fileName && saveModal_selectedPins.length) {

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

        commsHandler.put.exportMap(fileName, pinData, function () {

          interfaceHandler.saveModal._close();

        });

      } else {

        alert('Please enter a file name!');

      }

    },

    _selectAll: function (event) {

      let saveModal_selectAllCheckbox = interfaceHandler.saveModal.node.querySelector('.modal-table-select-all');
      let saveModal_checkboxes = interfaceHandler.saveModal.node.querySelectorAll('.table-row-checkbox');

      saveModal_checkboxes.forEach((item) => {

        item.checked = saveModal_selectAllCheckbox.checked;

      });

    },

    _checkboxChangeListener: function (event) {

      let saveModal = interfaceHandler.saveModal.node;
      let saveModal_selectAllCheckbox = saveModal.querySelector('.modal-table-select-all');
      let saveModal_checkboxes = saveModal.querySelectorAll('.table-row-checkbox');

      let checkboxes_total = saveModal_checkboxes.length;
      let checkboxes_checked = saveModal.querySelectorAll('.table-row-checkbox:checked').length;

      if (checkboxes_total === checkboxes_checked) {

        saveModal_selectAllCheckbox.checked = true;

      } else {

        saveModal_selectAllCheckbox.checked = false;

      }

    },

  },

  importModal: {

    node: document.querySelector('.modal-container.import-modal'),
    node_backdrop: document.querySelector('.modal-backdrop.import-modal'),

    generateListeners: function (mapEmbed) {

      let importModal = this.node;
      let importModal_xButton = importModal.querySelector('.modal-x-button');
      let importModal_closeButton = importModal.querySelector('.modal-close-button');
      let importModal_directory = importModal.querySelector('.modal-directory-container');

      importModal_xButton.addEventListener('click', this._close);
      importModal_closeButton.addEventListener('click', this._close);

      importModal_directory.querySelectorAll('.map-directory-entry-container').forEach((entry) => {

        entry.addEventListener('click', function () {

          let mapName = entry.dataset.id.split('.')[0];

          renderHandler.filter.clearFilterPins();

          commsHandler.get.importMap(mapName);

          interfaceHandler.importModal._close();

        });

      });

    },

    _close: function (event) {

      let importModal = interfaceHandler.importModal.node;
      let importModal_directory = importModal.querySelector('.modal-directory-container');
      let importModal_xButton = importModal.querySelector('.modal-x-button');
      let importModal_closeButton = importModal.querySelector('.modal-close-button');

      renderHandler.importModal.derender();

      removeChildNodes(importModal_directory);

      importModal_xButton.removeEventListener('click', interfaceHandler.importModal._close);
      importModal_closeButton.removeEventListener('click', interfaceHandler.importModal._close);

    }

  }

}
