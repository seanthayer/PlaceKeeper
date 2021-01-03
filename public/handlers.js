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

    importMap: function (mapName, mapEmbed) {

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

    currentRenderList: [],

    primaryMapList: [],

    hidePin: function (pin) {

      pin.marker.setMap(null);

      if (pin.clickListener) pin.clickListener.remove();

      if (pin.infoBox) pin.infoBox.close();

    },

    showPin: function (pin, mapEmbed) {

      pin.marker.setMap(mapEmbed);

      pin.clickListener = g_mapEventHandler.addListenerOnce(pin.marker, 'click', generateReadOnlyInfoBox);

    },

    setNewPrimaryMap: function (newMap, mapEmbed) {

      this.primaryMapList.forEach((pin) => {

        this.hidePin(pin);

      });

      this.currentRenderList = [];
      this.renderComponents(newMap, mapEmbed);
      this.primaryMapList = newMap;

    },

    rerender: function (mapEmbed) {

      this.renderComponents(this.primaryMapList, mapEmbed);

    },

    renderComponents: function (newRenderList, mapEmbed) {

      // Begin map render

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

        this.hidePin(pin);

      });

      renderAddDiff.forEach((pin) => {

        this.showPin(pin, mapEmbed);

      });

      // End map render

      // Begin placesList render

      let savedPlacesList = interfaceHandler.placesList.node;

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

        interfaceHandler.placesList.generateListeners(pin, mapEmbed);

      });

      // End placesList render

      this.currentRenderList = newRenderList;

    },

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

      renderHandler.map.primaryMapList.forEach((pin) => {

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

        interfaceHandler.importModal.generateListeners();

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

  placesList: {

    node: document.querySelector('.saved-places-list-element'),

    generateListeners: function (pin, mapEmbed) {

      let savedPlacesList = this.node;
      let listEntry = savedPlacesList.querySelector(`[data-latLng="${pin.latLng}"]`);
      let latLngButton = listEntry.querySelector('button.saved-place-entry-latLng')
      let trashButton = listEntry.querySelector('button.trash-button');

      latLngButton.addEventListener('click', function () {

        mapEmbed.panTo(pin.latLng);

      }, { once: true });

      trashButton.addEventListener('click', function () {

        trashButton.parentNode.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

        trashButton.addEventListener('click', function () {

          let primaryMap = renderHandler.map.primaryMapList;

          renderHandler.map.hidePin(pin);

          savedPlacesList.removeChild(listEntry);

          primaryMap.splice(primaryMap.indexOf(pin), 1);

        }, { once: true });

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

    generateListeners: function () {

      let importModal = this.node;
      let importModal_xButton = importModal.querySelector('.modal-x-button');
      let importModal_closeButton = importModal.querySelector('.modal-close-button');
      let importModal_directory = importModal.querySelector('.modal-directory-container');

      importModal_xButton.addEventListener('click', this._close);
      importModal_closeButton.addEventListener('click', this._close);

      importModal_directory.querySelectorAll('.map-directory-entry-container').forEach((entry) => {

        entry.addEventListener('click', function () {

          let mapName = entry.dataset.id.split('.')[0];

          clearFilterPins();

          commsHandler.get.importMap(mapName, g_mapEmbed);

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
