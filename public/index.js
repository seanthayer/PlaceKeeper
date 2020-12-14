function doFilterUpdate() {

  let savedPlacesList = document.querySelector('.saved-places-list-element');
  let savedPlacesListArray = Array.from(savedPlacesList.childNodes);
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

function exportMap(data, fileName) {

  let postRequest = new XMLHttpRequest();
  let reqURL = '/exportFile';
  let entryData = {

    fileName: fileName,
    data: data

  }

  postRequest.open('POST', reqURL, true);
  postRequest.setRequestHeader('Content-Type', 'application/json');

  postRequest.addEventListener('load', function(event) {

    if (event.target.status != 200) {

      alert('Server failed to save data!');

    } else {

      console.log('POST Successful');

    }

  });

  postRequest.send(JSON.stringify(entryData));

}

function getMapsDirectory(callback) {

  let getRequest = new XMLHttpRequest();
  let reqURL = '/getMapsDirectory';

  getRequest.open('GET', reqURL);
  getRequest.setRequestHeader('Content-Type', 'application/json');

  getRequest.addEventListener('load', function(event) {

    if (event.target.status === 200) {

      let data = JSON.parse(event.target.response);

      for (let i = 0; i < data.length; i++) {

        data[i] = data[i].split('.')[0];

      }

      callback(data);

    }

  });

  getRequest.send();

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

  let saveModal_CloseFunc = function () {

    saveModal.classList.add('hidden');
    saveModal_BackDrop.classList.add('hidden');

    saveModal_XButton.removeEventListener('click', saveModal_CloseFunc);
    saveModal_CloseButton.removeEventListener('click', saveModal_CloseFunc);

    saveModal_SaveButton.removeEventListener('click', saveModal_SaveButtonFunc);

    saveModal.querySelector('.modal-input').value = '';

    saveModal.querySelector('.modal-table-select-all').checked = false;

    saveModal.querySelectorAll('.table-row-checkbox').forEach((item) => {

      item.checked = false;

    });

  }

  let saveModal_SaveButtonFunc = function () {

    saveMap(function () {

      saveModal_CloseFunc();

    });

  }

  saveModal.classList.remove('hidden');
  saveModal_BackDrop.classList.remove('hidden');

  saveModal_XButton.addEventListener('click', saveModal_CloseFunc);
  saveModal_CloseButton.addEventListener('click', saveModal_CloseFunc);

  saveModal_SaveButton.addEventListener('click', saveModal_SaveButtonFunc);

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

function saveMap(callback) {

  let saveModal = document.querySelector('.modal-container.save-modal');
  let saveModal_SelectedPins = saveModal.querySelectorAll('.table-row-checkbox:checked');
  let fileName = saveModal.querySelector('.modal-input').value;

  if (fileName) {

    fileName = fileName.trim().replace(/\s+/g, '-');

    let pinData = [];

    saveModal_SelectedPins.forEach((pin) => {

      let pinTableRow = pin.parentNode.parentNode;

      let pinObj = {

        name: pinTableRow.querySelector('.table-row-name').textContent,
        lat: pinTableRow.querySelector('.table-row-latitude').textContent,
        lng: pinTableRow.querySelector('.table-row-longitude').textContent

      }

      pinData.push(pinObj);

    });

    exportMap(pinData, fileName);

    callback();

  } else {

    alert('Please enter a file name!');

  }

}

function selectAll(source) {

  //Select-all button for checkboxes

  let saveModal = document.querySelector('.modal-container.save-modal');
  let saveModal_Checkboxes = saveModal.querySelectorAll('.table-row-checkbox');

  saveModal_Checkboxes.forEach((item) => {

    // TODO: if one checkbox is unchecked then it should uncheck the select all checkbox

    item.checked = source.checked;

  });

}

window.addEventListener('DOMContentLoaded', function () {

  let saveMapButton = document.querySelector('.save-map-button');
  saveMapButton.addEventListener('click', openSaveModal);

  let searchBarButton = document.querySelector('.search-bar-button');
  searchBarButton.addEventListener('click', doFilterUpdate);

  let importMapButton = document.querySelector('.import-map-button');
  importMapButton.addEventListener('click', openImportModal);

});
