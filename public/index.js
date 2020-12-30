function doFilterUpdate() {

  let savedPlacesList = document.querySelector('.saved-places-list-element');
  let filter = { text: document.querySelector('.search-bar-input').value.trim() }

  removeChildNodes(savedPlacesList);

  mapPins.forEach((pin) => {

    if (pinPassesFilter(pin, filter)) {

      let context = {

        name: pin.name,
        lat: pin.latLng.lat(),
        lng: pin.latLng.lng()

      }

      let savedPlacesEntryHTML = Handlebars.templates.savedPlaceEntry(context);
      savedPlacesList.insertAdjacentHTML('beforeend', savedPlacesEntryHTML);

    }

  });

}

function getMapsDirectory(callback) {

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

function openImportModal() {

  let importModal = document.querySelector('.modal-container.import-modal');
  let importModal_BackDrop = document.querySelector('.modal-backdrop.import-modal');
  let importModal_XButton = importModal.querySelector('.modal-x-button');
  let importModal_CloseButton = importModal.querySelector('.modal-close-button');
  let importModal_Directory = importModal.querySelector('.modal-directory-container');

  let importModal_CloseFunc = function () {

    importModal.classList.add('hidden');
    importModal_BackDrop.classList.add('hidden');

    removeChildNodes(importModal_Directory);

    importModal_XButton.removeEventListener('click', importModal_CloseFunc);
    importModal_CloseButton.removeEventListener('click', importModal_CloseFunc);

  }

  importModal.classList.remove('hidden');
  importModal_BackDrop.classList.remove('hidden');

  importModal_XButton.addEventListener('click', importModal_CloseFunc);
  importModal_CloseButton.addEventListener('click', importModal_CloseFunc);

  getMapsDirectory(function (data) {

    data.forEach((item, i) => {

      let uniqueID = item + i;
      let directoryEntry = `<div class="map-directory-entry-container" id="${uniqueID}"> <i class="fas fa-file"></i> <h4 class="file-title">${item}</h4> </div>`;

      importModal_Directory.insertAdjacentHTML('beforeend', directoryEntry);

      importModal_Directory.querySelector(`#${uniqueID}`).addEventListener('click', function () {

        importMap(item);

        importModal_CloseFunc();

      });

    });

  });

}

function openSaveModal() {

  let saveModal = document.querySelector('.modal-container.save-modal');
  let saveModal_BackDrop = document.querySelector('.modal-backdrop.save-modal');
  let saveModal_XButton = saveModal.querySelector('.modal-x-button');
  let saveModal_CloseButton = saveModal.querySelector('.modal-close-button');
  let saveModal_SaveButton = saveModal.querySelector('.modal-save-button');
  let saveModal_SelectAllCheckbox = saveModal.querySelector('.modal-table-select-all');
  let saveModal_Checkboxes = saveModal.querySelectorAll('.table-row-checkbox');

  let saveModal_CloseFunc = function () {

    // Hides modal, removes listeners, and resets inputs

    saveModal.classList.add('hidden');
    saveModal_BackDrop.classList.add('hidden');

    saveModal_XButton.removeEventListener('click', saveModal_CloseFunc);
    saveModal_CloseButton.removeEventListener('click', saveModal_CloseFunc);

    saveModal_SaveButton.removeEventListener('click', saveModal_SaveButtonFunc);

    saveModal_SelectAllCheckbox.removeEventListener('click', saveModal_SelectAllFunc);

    saveModal_Checkboxes.forEach((checkbox) => {

      checkbox.removeEventListener('change', saveModal_CheckboxChangeListenerFunc);

    });

    saveModal.querySelector('.modal-input').value = '';

    saveModal.querySelector('.modal-table-select-all').checked = false;

    saveModal.querySelectorAll('.table-row-checkbox').forEach((item) => {

      item.checked = false;

    });

  } // End 'saveModal_CloseFunc'

  let saveModal_SaveButtonFunc = function () {

    handleSaveModalInputs(function () {

      saveModal_CloseFunc();

    });

  } // End 'saveModal_SaveButtonFunc'

  let saveModal_SelectAllFunc = function () {

    // Adds a toggle functionality for 'saveModal_SelectAllCheckbox'

    saveModal_Checkboxes.forEach((item) => {

      item.checked = saveModal_SelectAllCheckbox.checked;

    });

  } // End 'saveModal_SelectAllFunc'

  let saveModal_CheckboxChangeListenerFunc = function () {

    // Listens for a change on any table row checkbox, and flips the header pin if (all) || (not all) checkboxes are checked

    let checkboxes_Total = saveModal_Checkboxes.length;
    let checkboxes_Checked = saveModal.querySelectorAll('.table-row-checkbox:checked').length;

    if (checkboxes_Total === checkboxes_Checked) {

      saveModal_SelectAllCheckbox.checked = true;

    } else {

      saveModal_SelectAllCheckbox.checked = false;

    }

  } // End 'saveModal_CheckboxChangeListenerFunc'

  saveModal.classList.remove('hidden');
  saveModal_BackDrop.classList.remove('hidden');

  saveModal_XButton.addEventListener('click', saveModal_CloseFunc);
  saveModal_CloseButton.addEventListener('click', saveModal_CloseFunc);

  saveModal_SaveButton.addEventListener('click', saveModal_SaveButtonFunc);

  saveModal_SelectAllCheckbox.addEventListener('click', saveModal_SelectAllFunc);

  saveModal_Checkboxes.forEach((checkbox) => {

    checkbox.addEventListener('change', saveModal_CheckboxChangeListenerFunc);

  });

}

function pinPassesFilter(pin, filter) {

  if (filter.text) {

    let pinName = pin.name.toLowerCase();
    let filterText = filter.text.toLowerCase();

    if (pinName.indexOf(filterText) === -1) {

      return false;

    }

  }

  return true;

}

function removeChildNodes(node) {

  while (node.lastChild) {

    node.removeChild(node.lastChild);

  }

}

window.addEventListener('DOMContentLoaded', function () {

  let saveMapButton;
  let searchBarButton;
  let importMapButton;

  if (saveMapButton = document.querySelector('.save-map-button')) { saveMapButton.addEventListener('click', openSaveModal); }
  if (searchBarButton = document.querySelector('.search-bar-button')) { searchBarButton.addEventListener('click', doFilterUpdate); }
  if (importMapButton = document.querySelector('.import-map-button')) { importMapButton.addEventListener('click', openImportModal); }

});
