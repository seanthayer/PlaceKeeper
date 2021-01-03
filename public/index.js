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
  let importMapButton;
  let searchBarButton;

  if (saveMapButton = document.querySelector('.save-map-button')) { saveMapButton.addEventListener('click', renderHandler.saveModal.render); }
  if (importMapButton = document.querySelector('.import-map-button')) { importMapButton.addEventListener('click', renderHandler.importModal.render); }
  if (searchBarButton = document.querySelector('.search-bar-button')) { searchBarButton.addEventListener('click', doFilterUpdate); }

});
