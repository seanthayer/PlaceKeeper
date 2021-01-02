function clearFilterPins() {

  let filterInfoBox = document.querySelector('.saved-places-filter-info');

  removeChildNodes(filterInfoBox);

  if (!filterInfoBox.classList.contains('hidden')) {

    filterInfoBox.classList.add('hidden');

  }

}

function createFilterPin(filter) {

  let filterInfoBox = document.querySelector('.saved-places-filter-info');
  filterInfoBox.classList.remove('hidden');

  let filterPin = document.createElement('div');
  filterPin.classList.add('filter-pin-container');

  filterPin.insertAdjacentHTML('afterbegin', `<span class="filter-pin">Filtering for: "${filter.text}</span>"`);
  filterPin.insertAdjacentHTML('beforeend', `<i class="fas fa-times-circle"></i>`);

  filterInfoBox.appendChild(filterPin);


  let filterPin_XButton = filterPin.querySelector('.fas.fa-times-circle');

  filterPin_XButton.addEventListener('click', function () {

    clearFilterPins();

    renderHandler.rerenderMap();

  }, { once: true });

}

function doFilterUpdate() {

  let filter = { text: document.querySelector('.search-bar-input').value.trim() }

  if (filter.text) {

    let filterMap = [];
    let primaryMap = renderHandler.primaryMapList;
    let savedPlacesList = document.querySelector('.saved-places-list-element');

    removeChildNodes(savedPlacesList);

    primaryMap.forEach((pin) => {

      if ( pinPassesFilter(pin, filter) ) filterMap.push(pin);

    });

    clearFilterPins();

    renderHandler.renderComponents(filterMap);

    createFilterPin(filter);

    document.querySelector('.search-bar-input').value = '';

  }

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

  renderHandler.renderImportModal(function () {

    importModal_Directory.querySelectorAll('.map-directory-entry-container').forEach((entry) => {

      entry.addEventListener('click', function () {

        let mapName = entry.dataset.id.split('.')[0];

        clearFilterPins();

        importMap(mapName);

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
  let saveModal_Checkboxes;

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

  renderHandler.renderSaveModal();

  saveModal_Checkboxes = saveModal.querySelectorAll('.table-row-checkbox');

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
