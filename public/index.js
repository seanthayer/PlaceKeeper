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

  if (saveMapButton = document.querySelector('.save-map-button')) { saveMapButton.addEventListener('click', renderHandler.saveModal.render); }
  if (searchBarButton = document.querySelector('.search-bar-button')) { searchBarButton.addEventListener('click', doFilterUpdate); }
  if (importMapButton = document.querySelector('.import-map-button')) { importMapButton.addEventListener('click', openImportModal); }

});
