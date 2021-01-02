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


  let filterPin_xButton = filterPin.querySelector('.fas.fa-times-circle');

  filterPin_xButton.addEventListener('click', function () {

    clearFilterPins();

    renderHandler.map.rerender(g_mapEmbed);

  }, { once: true });

}

function doFilterUpdate() {

  let filter = { text: document.querySelector('.search-bar-input').value.trim() }

  if (filter.text) {

    let filterMap = [];
    let primaryMap = renderHandler.map.primaryMapList;
    let savedPlacesList = document.querySelector('.saved-places-list-element');

    removeChildNodes(savedPlacesList);

    primaryMap.forEach((pin) => {

      if ( pinPassesFilter(pin, filter) ) filterMap.push(pin);

    });

    clearFilterPins();

    renderHandler.map.renderComponents(filterMap, g_mapEmbed);

    createFilterPin(filter);

    document.querySelector('.search-bar-input').value = '';

  }

}

function openImportModal() {

  let importModal = document.querySelector('.modal-container.import-modal');
  let importModal_backdrop = document.querySelector('.modal-backdrop.import-modal');
  let importModal_xButton = importModal.querySelector('.modal-x-button');
  let importModal_closeButton = importModal.querySelector('.modal-close-button');
  let importModal_directory = importModal.querySelector('.modal-directory-container');

  let importModal_closeFunc = function () {

    importModal.classList.add('hidden');
    importModal_backdrop.classList.add('hidden');

    removeChildNodes(importModal_directory);

    importModal_xButton.removeEventListener('click', importModal_closeFunc);
    importModal_closeButton.removeEventListener('click', importModal_closeFunc);

  }

  importModal.classList.remove('hidden');
  importModal_backdrop.classList.remove('hidden');

  importModal_xButton.addEventListener('click', importModal_closeFunc);
  importModal_closeButton.addEventListener('click', importModal_closeFunc);

  renderHandler.importModal.render(function () {

    importModal_directory.querySelectorAll('.map-directory-entry-container').forEach((entry) => {

      entry.addEventListener('click', function () {

        let mapName = entry.dataset.id.split('.')[0];

        clearFilterPins();

        importMap(mapName, g_mapEmbed);

        importModal_closeFunc();

      });

    });

  });

}

function openSaveModal() {

  let saveModal = document.querySelector('.modal-container.save-modal');
  let saveModal_backdrop = document.querySelector('.modal-backdrop.save-modal');
  let saveModal_xButton = saveModal.querySelector('.modal-x-button');
  let saveModal_closeButton = saveModal.querySelector('.modal-close-button');
  let saveModal_saveButton = saveModal.querySelector('.modal-save-button');
  let saveModal_selectAllCheckbox = saveModal.querySelector('.modal-table-select-all');
  let saveModal_checkboxes;

  let saveModal_closeFunc = function () {

    // Hides modal, removes listeners, and resets inputs

      saveModal.classList.add('hidden');
      saveModal_backdrop.classList.add('hidden');

      saveModal_xButton.removeEventListener('click', saveModal_closeFunc);
      saveModal_closeButton.removeEventListener('click', saveModal_closeFunc);

      saveModal_saveButton.removeEventListener('click', saveModal_saveButtonFunc);

      saveModal_selectAllCheckbox.removeEventListener('click', saveModal_selectAllFunc);

      saveModal_checkboxes.forEach((checkbox) => {

        checkbox.removeEventListener('change', saveModal_checkboxChangeListenerFunc);

      });

      saveModal.querySelector('.modal-input').value = '';

      saveModal.querySelector('.modal-table-select-all').checked = false;

      saveModal.querySelectorAll('.table-row-checkbox').forEach((item) => {

        item.checked = false;

      });

  } // End 'saveModal_closeFunc'

  let saveModal_saveButtonFunc = function () {

    handleSaveModalInputs(function () {

      saveModal_closeFunc();

    });

  } // End 'saveModal_saveButtonFunc'

  let saveModal_selectAllFunc = function () {

    // Adds a toggle functionality for 'saveModal_selectAllCheckbox'

    saveModal_checkboxes.forEach((item) => {

      item.checked = saveModal_selectAllCheckbox.checked;

    });

  } // End 'saveModal_selectAllFunc'

  let saveModal_checkboxChangeListenerFunc = function () {

    // Listens for a change on any table row checkbox, and flips the header pin if (all) || (not all) checkboxes are checked

    let checkboxes_Total = saveModal_checkboxes.length;
    let checkboxes_Checked = saveModal.querySelectorAll('.table-row-checkbox:checked').length;

    if (checkboxes_Total === checkboxes_Checked) {

      saveModal_selectAllCheckbox.checked = true;

    } else {

      saveModal_selectAllCheckbox.checked = false;

    }

  } // End 'saveModal_checkboxChangeListenerFunc'

  renderHandler.saveModal.render();

  saveModal_checkboxes = saveModal.querySelectorAll('.table-row-checkbox');

  saveModal.classList.remove('hidden');
  saveModal_backdrop.classList.remove('hidden');

  saveModal_xButton.addEventListener('click', saveModal_closeFunc);
  saveModal_closeButton.addEventListener('click', saveModal_closeFunc);

  saveModal_saveButton.addEventListener('click', saveModal_saveButtonFunc);

  saveModal_selectAllCheckbox.addEventListener('click', saveModal_selectAllFunc);

  saveModal_checkboxes.forEach((checkbox) => {

    checkbox.addEventListener('change', saveModal_checkboxChangeListenerFunc);

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
