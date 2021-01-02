var commsHandler = {

  getMapsDirectory: function (callback) {

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

  }

}

var renderHandler = {

  currentRenderList: [],

  primaryMapList: [],

  setNewPrimaryMap: function (newMap, mapEmbed) {

    this.primaryMapList.forEach((pin) => {

      hidePin(pin);

    });

    this.currentRenderList = [];
    this.renderComponents(newMap, mapEmbed);
    this.primaryMapList = newMap;

  },

  rerenderMap: function (mapEmbed) {

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

      hidePin(pin);

    });

    renderAddDiff.forEach((pin) => {

      showPin(pin, mapEmbed);

    });

    // End map render

    // Begin placesList render

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

      latLngButton.addEventListener('click', function () {

        mapEmbed.panTo(pin.latLng);

      }, { once: true });

      trashButton.addEventListener('click', function () {

        trashButton.parentNode.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

        trashButton.addEventListener('click', function () {

          let primaryMap = renderHandler.primaryMapList;

          hidePin(pin);

          savedPlacesList.removeChild(listEntry);

          primaryMap.splice(primaryMap.indexOf(pin), 1);

        }, { once: true });

      }, { once: true });

    });

    // End placesList render

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

  },

  renderImportModal: function (callback) {

    // This function deals with 'commsHandler' and requires a callback to ensure data availability.

    let importModal = document.querySelector('.modal-container.import-modal');
    let importModal_Directory = importModal.querySelector('.modal-directory-container');

    commsHandler.getMapsDirectory(function (data) {

      data.forEach((item, i) => {

        let uniqueID = item + '.' + i;
        let directoryEntry = `<div class="map-directory-entry-container" data-id="${uniqueID}"> <i class="fas fa-file"></i> <h4 class="file-title">${item}</h4> </div>`;

        importModal_Directory.insertAdjacentHTML('beforeend', directoryEntry);

      });

      callback();

    });

  }

}
