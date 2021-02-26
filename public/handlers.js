/*  Handlers:
 *
 *    commsHandler{},
 *        Handles the communications between the client and server. e.g. GET & PUT requests.
 * 
 *    renderHandler{},
 *        Handles the rendering of all dynamic components. e.g. the map & place list, modals, etc.
 * 
 *    interfaceHandler{},
 *        Handles the logical & listener interactions for all interface components. e.g. button presses, events.
 */

var commsHandler = {

  /*  Description:
   *    Handles the communications between the client and server.
   *
   *  Structure:
   *
   *  - get {
   *      mapsDirectory(callback)
   *      importMap(mapName)
   *    }
   *
   *  - put {
   *     exportMap(fileName, data, callback)
   *    }
   */

  get: {

    mapsDirectory: function (callback) {

      /*  Description:
       *    Function requests the data directory from the server via '/getMapsDirectory', and expects it in JSON format.
       *    After formatting the data, the function calls back to origin with it.
       *    
       *  Callback:
       *    data = An array of strings; the formatted file names from the data directory
       */

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

      /*  Description:
       *    Function requests a specified map from the server, in JSON format.
       *    The function then converts the raw JSON into a 'Pin()' object and stores each one into an array.
       *    Subsequently, 'renderHandler{}' is called to rerender the map with the imported file.
       *    
       *  Parameters:
       *    mapName = A string; the name of the map to request from the server.
       */

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

          // Parsing 'importData' into the Pin() structure.

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

        renderHandler.map.derender();
        renderHandler.map.setNewPrimaryList(importMap);
        renderHandler.map.renderComponents(importMap);


      }).catch(function (err) {

        console.error('[ERROR] ' + err);

      });

    }

  },

  put: {

    exportMap: function (fileName, data, callback) {

      /*  Description:
       *    Function requests a POST to the server, in JSON format.
       *    The function then simply alerts the user if there was an error, and calls back to origin.
       *    
       *  Parameters:
       *    fileName  = A string; file name to POST
       *    data      = An array of objects with the following structure:
       *              -   {
       *              -     name,
       *              -     lat,
       *              -     lng
       *              -   }
       * 
       *  Callback: Used for sync control.
       */

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

  /*  Description:
   *    Handles the rendering of all dynamic components.
   *
   *  Structure:
   *
   *  - map {
   *      mapTarget: null
   *      currentRenderList: []
   *      primaryList: []
   *      getCurrentRender()
   *      getPrimaryList()
   *      setNewMapTarget(mapEmbed)
   *      setNewPrimaryList(newMap)
   *      setNewRender(newRender)
   *      derender()
   *      rerender()
   *      renderComponents(newRender)
   *      pushPin(pin)
   *      addPin(pin)
   *      removePin(pin)
   *      hidePin(pin)
   *      _showPin(pin)
   *      _splicePin(pin)
   *    }
   *
   *  - pin {
   *      renderNewPinForm(event)
   *      renderPinInfo(event)
   *      _generatePinInfoBox(latLng, html)
   *    }
   *
   *  - filter {
   *      applyFilter()
   *      clearFilterPins()
   *      _createFilterPin(filter)
   *      _pinPassesFilter(pin, filter)
   *    }
   *
   *  - saveModal {
   *     render()
   *     derender()
   *    }
   *
   *  - importModal {
   *      render()
   *      derender()
   *    }
   */

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
      
      /*  Description:
       *    Function renders the dynamic components directly related to map functionality.
       *    In O(n²) complexity, the function calculates the intersection 'A ∩ B', where 'A' is the map's current render and 'B' is the new render.
       *    This intersection represents pins that do not need to be removed or added during the render.
       *    So, let 'C' be this intersection: the function calculates 'A - C' and 'B - C' to find relative set complements of 'A \ B' and 'B \ A'.
       *    These set complements, 'D' and 'E', then represent the pins to be removed and the pins to be added, respectively.
       *    
       *  Parameters:
       *    newRender = An array of 'Pin()' objects
       */

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

      // 'A - C'
      let renderSubDiff = currentRender.filter(pin => !setIntersect.includes(pin.latLng.toString()) );

      // 'B - C'
      let renderAddDiff = newRender.filter(pin => !setIntersect.includes(pin.latLng.toString()) );

      console.log('Intersect: ', setIntersect); // Set 'C'
      console.log('Sub diff: ', renderSubDiff); // Set 'D', derived from 'A - C'
      console.log('Add diff: ', renderAddDiff); // Set 'E', derived from 'B - C'

      renderSubDiff.forEach((pin) => {

        this.hidePin(pin);

      });

      renderAddDiff.forEach((pin) => {

        this._showPin(pin);

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

    addPin: function (pin) {

      this.pushPin(pin);

      this.rerender();

      renderHandler.filter.clearFilterPins();

    },

    removePin: function (pin) {

      this.hidePin(pin);
      this._splicePin(pin);

    },

    hidePin: function (pin) {

      pin.marker.setMap(null);

      if (pin.clickListener) pin.clickListener.remove();

      if (pin.infoBox) pin.infoBox.close();

    },

    _showPin: function (pin) {

      pin.marker.setMap(this.mapTarget);

      pin.clickListener = g_mapEventHandler.addListenerOnce(pin.marker, 'click', renderHandler.pin.renderPinInfo);

    },

    _splicePin: function (pin) {

      this.primaryList.splice(this.primaryList.indexOf(pin), 1);

    },

  },

  pin: {

    renderNewPinForm: function (event) {

      /*  Description:
       *    Function renders the 'new pin form' on the map at the event's latLng.
       *    
       *  Parameters:
       *    event = A 'click' event
       */

      let mapEmbed = renderHandler.map.mapTarget;

      let clickEventLatLng = event.latLng;

      let newPin_marker = new google.maps.Marker({

        position: clickEventLatLng,
        map: mapEmbed

      });

      let newPin_infoFormHTML = Handlebars.templates.pinInfoForm();
      let newPin_infoForm = renderHandler.pin._generatePinInfoBox(clickEventLatLng, newPin_infoFormHTML);

      // Wait for the dynamically generated infobox to be loaded.
      g_mapEventHandler.addListenerOnce(newPin_infoForm, 'domready', function () {

        let newPin = {

          marker: newPin_marker,
          infoBox: newPin_infoForm,
          latLng: clickEventLatLng

        };

        // interfaceHandler{} will handle the inputs, and callback when the form closes.
        interfaceHandler.pin.handleNewPinForm(newPin);

      });

    },

    renderPinInfo: function (event) {

      /*  Description:
       *    Function renders the info box associated with an existing pin. Displays name, description, and a delete button.
       *    
       *  Parameters:
       *    event = A 'click' event
       */

      let currentRender = renderHandler.map.getCurrentRender();
      let mapEmbed = renderHandler.map.mapTarget;
      let eventOriginPin;

      currentRender.forEach((pin) => {

        // I could not find a way to access the event's origin pin from the parameter itself, so comparing 'latLng' is used to find the origin instead.
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

      /*  Description:
       *    Function uses the Maps API to generate an info window.
       *    
       *  Parameters:
       *    latLng  = A Maps API 'latLng' object; position of the info box
       *    html    = An HTML string (typically generated by Handlebars); the info box's HTML
       *    
       */

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

    // ! [This sub-handler is in a basic state] !

    applyFilter: function () {

      /*  Description:
       *    Function filters the current primary list and then calls to render the map with the filtered list.
       */

      let searchbar_input = interfaceHandler.filter.node_searchbar.querySelector('.search-bar-input');

      let filter = { text: searchbar_input.value.trim() }

      if (filter.text) {

        let filterMap = [];
        let primaryList = renderHandler.map.getPrimaryList();

        primaryList.forEach((pin) => {

          if ( renderHandler.filter._pinPassesFilter(pin, filter) ) filterMap.push(pin);

        });

        renderHandler.filter.clearFilterPins();

        renderHandler.map.renderComponents(filterMap);

        renderHandler.filter._createFilterPin(filter);

        searchbar_input.value = '';

      }

    },

    clearFilterPins: function () {

      let filterInfoBox = interfaceHandler.filter.node_filterInfo;

      removeChildNodes(filterInfoBox);

      if (!filterInfoBox.classList.contains('hidden')) {

        filterInfoBox.classList.add('hidden');

      }

    },

    _createFilterPin: function (filter) {

      let filterInfoBox = interfaceHandler.filter.node_filterInfo;
      filterInfoBox.classList.remove('hidden');

      let filterPin = document.createElement('div');
      filterPin.classList.add('filter-pin-container');

      filterPin.insertAdjacentHTML('afterbegin', `<span class="filter-pin">Filtering for: "${filter.text}</span>"`);
      filterPin.insertAdjacentHTML('beforeend', `<i class="fas fa-times-circle"></i>`);

      filterInfoBox.appendChild(filterPin);


      interfaceHandler.filter.generateListener(renderHandler.map.mapTarget);

    },

    _pinPassesFilter: function (pin, filter) {

      if (filter.text) {

        let pinName = pin.name.toLowerCase();
        let filterText = filter.text.toLowerCase();

        if (pinName.indexOf(filterText) === -1) {

          return false;

        }

      }

      return true;

    }

  },

  saveModal: {

    render: function () {

      /*  Description:
       *    Function renders the save modal using the current primary list, and calls for 'interfaceHandler{}' to generate the listeners.
       */

      let saveModal = interfaceHandler.saveModal.node;
      let saveModal_backdrop = interfaceHandler.saveModal.node_backdrop;
      let saveModal_ModalTable = saveModal.querySelector('.modal-table');
      let saveModal_TableRows = saveModal_ModalTable.querySelectorAll('tr.modal-table-row');

      saveModal_TableRows.forEach((node) => {

        // Removes the table row's parent node 'tbody'
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

      /*	Description:
       *		Hides modal and resets values.
       */

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

      /*	Description:
       *    Function renders the import modal using the files names received from the server, and calls for 'interfaceHandler{}' to generate the listeners.
       */

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

      /*	Description:
       *		Hides modal and resets values.
       */

      let importModal = interfaceHandler.importModal.node;
      let importModal_backdrop = interfaceHandler.importModal.node_backdrop;
      let importModal_directory = importModal.querySelector('.modal-directory-container');

      importModal.classList.add('hidden');
      importModal_backdrop.classList.add('hidden');

      removeChildNodes(importModal_directory);

    }

  }

}

var interfaceHandler = {

  /*  Description:
   *    Handles the logical & listener interactions for all interface components.
   *
   *  Structure:
   *
   *  - pin {
   *      handleNewPinForm(newPin)
   *      handleInfoBox(pin)
   *    }
   *
   *  - placesList {
   *      node: '.saved-places-list-element'
   *      generateListeners(pin, mapEmbed)
   *    }
   *
   *  - filter {
   *      node_searchbar: '.search-bar-container'
   *      node_filterInfo: '.saved-places-filter-info'
   *      generateListener(mapEmbed)
   *    }
   *
   *  - saveModal {
   *      node: '.modal-container.save-modal'
   *      node_backdrop: '.modal-backdrop.save-modal'
   *      generateListeners()
   *      _close()
   *      _save()
   *      _selectAll()
   *      _checkboxChangeListener()
   *    }
   *
   *  - importModal {
   *      node: '.modal-container.import-modal'
   *      node_backdrop: '.modal-backdrop.import-modal'
   *      generateListeners()
   *      _close()
   *    }
   */

  pin: {

    handleNewPinForm: function (newPin) {

      /*  Description:
       *    Function generates the listener interactions for the 'new pin form', using data from the provided parameter.
       *    The 'new pin form' listener is only generated upon map initialization and when the form closes, so only one form can be present.
       *    
       *  Parameters:
       *    newPin = A 'Pin()' object; the pin associated with the generated listeners
       * 
       */

      let mapEmbed = renderHandler.map.mapTarget;

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

          renderHandler.map.addPin(_pin);

          g_mapEventHandler.addListenerOnce(mapEmbed, 'click', renderHandler.pin.renderNewPinForm);

        } else {

          alert('You must enter a name for a new pin!');

        }

      });

      g_mapEventHandler.addDomListener(infoForm_cancelButton, 'click', function () {

        renderHandler.map.hidePin(newPin);
        g_mapEventHandler.addListenerOnce(mapEmbed, 'click', renderHandler.pin.renderNewPinForm);

      });

      g_mapEventHandler.addListener(newPin.infoBox, 'closeclick', function () {

        renderHandler.map.hidePin(newPin);
        g_mapEventHandler.addListenerOnce(mapEmbed, 'click', renderHandler.pin.renderNewPinForm);

      });

    },

    handleInfoBox: function (pin) {

      /*  Description:
       *    Function generates the listener interactions for an existing pin's info box.
       *    
       *  Parameters:
       *    pin = A 'Pin()' object; the pin associated with the generated listeners
       */

      let infoBox = g_mapNode.querySelector(`.pin-infobox-container[data-latLng="${pin.latLng}"]`)
      let infoBox_buttonContainer = infoBox.querySelector('.trash-button-container');
      let infoBox_trashButton = infoBox_buttonContainer.querySelector('button.trash-button');

      // This is a bit unsightly, but the concept is, clicking the trash button once will trigger the event below...
      g_mapEventHandler.addDomListenerOnce(infoBox_trashButton, 'click', function () {

        infoBox_buttonContainer.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

        // ...and by triggering the event, it then adds the following listener. Creating a basic two-click confirmation.
        g_mapEventHandler.addDomListenerOnce(infoBox_trashButton, 'click', function () {

          let savedPlacesList = interfaceHandler.placesList.node;
          let listEntry = savedPlacesList.querySelector(`[data-latLng="${pin.latLng}"]`);

          renderHandler.map.removePin(pin);

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

      /*  Description:
       *    Function generates the listener interactions for a pin's 'places list' entry.
       *    
       *  Parameters:
       *    pin       = A 'Pin()' object; the pin associated with the generated listeners
       *    mapEmbed  = A Maps API map; the map to link listeners with
       */

      let savedPlacesList = this.node;
      let listEntry = savedPlacesList.querySelector(`[data-latLng="${pin.latLng}"]`);
      let latLngButton = listEntry.querySelector('button.saved-place-entry-latLng')
      let trashButton = listEntry.querySelector('button.trash-button');

      latLngButton.addEventListener('click', function () {

        mapEmbed.panTo(pin.latLng);

      });

      // This is a bit unsightly, but the concept is, clicking the trash button once will trigger the event below...
      trashButton.addEventListener('click', function () {

        trashButton.parentNode.insertAdjacentHTML('afterbegin', '<em>Press again to confirm</em><strong>:</strong>');

        // ...and by triggering the event, it then adds the following listener. Creating a basic two-click confirmation.
        trashButton.addEventListener('click', function () {

          renderHandler.map.removePin(pin);

          savedPlacesList.removeChild(listEntry);

        }, { once: true });

      }, { once: true });

    }

  },

  filter: {

    node_searchbar: document.querySelector('.search-bar-container'),
    node_filterInfo: document.querySelector('.saved-places-filter-info'),

    generateListener: function () {

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

      /*  Description:
       *    Function generates the listener interactions for the save modal.
       */

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

    _close: function () {

      /*  Description:
       *    Function handles closing tasks for the save modal.
       */

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

    _save: function () {

      /*  Description:
       *    Function calls 'commsHandler{}' to save the pins selected in the save modal, in JSON format and under the given file name.
       */

      let saveModal = interfaceHandler.saveModal.node;
      let saveModal_selectedPins = saveModal.querySelectorAll('.table-row-checkbox:checked');
      let fileName = saveModal.querySelector('.modal-input').value;

      if (fileName && saveModal_selectedPins.length) {

        fileName = fileName.trim().replace(/\s+/g, '-');

        let pinData = [];

        saveModal_selectedPins.forEach((pin) => {

          // Table rows contain datasets for each entry, allowing ease of access.
          let pinTableRow = pin.parentNode.parentNode;

          // Formatting for the data properly for the server.
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

    _selectAll: function () {

      /*  Description:
       *    Function is called to select all table checkboxes on the save modal when the uppermost box is checked.
       */

      let saveModal_selectAllCheckbox = interfaceHandler.saveModal.node.querySelector('.modal-table-select-all');
      let saveModal_checkboxes = interfaceHandler.saveModal.node.querySelectorAll('.table-row-checkbox');

      saveModal_checkboxes.forEach((item) => {

        item.checked = saveModal_selectAllCheckbox.checked;

      });

    },

    _checkboxChangeListener: function () {

      /*  Description:
       *    Function is called to check if all save modal checkboxes are ticked, ensuring proper display of the uppermost box.
       */

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

      /*  Description:
       *    Function generates the listener interactions for the import modal.
       */

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

    _close: function () {

      /*  Description:
       *    Function handles closing tasks for the import modal.
       */

      let importModal = interfaceHandler.importModal.node;
      let importModal_xButton = importModal.querySelector('.modal-x-button');
      let importModal_closeButton = importModal.querySelector('.modal-close-button');

      renderHandler.importModal.derender();

      importModal_xButton.removeEventListener('click', interfaceHandler.importModal._close);
      importModal_closeButton.removeEventListener('click', interfaceHandler.importModal._close);

    }

  }

}
