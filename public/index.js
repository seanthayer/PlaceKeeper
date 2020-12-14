window.addEventListener('DOMContentLoaded', function () {

  var saveMapButton = document.querySelector('.save-map-button');
  saveMapButton.addEventListener('click', openSaveModal);

  var searchBarButton = document.querySelector('.search-bar-button');
  searchBarButton.addEventListener('click', doFilterUpdate);

  var importMapButton = document.querySelector('.import-map-button');
  importMapButton.addEventListener('click', openImportModal);

});

function openImportModal() {

  var importModal = document.querySelector('.modal-container.import-modal');
  var importModal_BackDrop = document.querySelector('.modal-backdrop.import-modal');
  var importModal_XButton = importModal.querySelector('.modal-x-button');
  var importModal_CloseButton = importModal.querySelector('.modal-close-button');
  var importModal_Directory = importModal.querySelector('.modal-directory-container');

  var importModal_CloseFunc = function () {

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

      var uniqueID = item + i;
      var directoryEntry = `<div class="map-directory-entry-container" id="${uniqueID}"> <i class="fas fa-file"></i> <h4 class="file-title">${item}</h4> </div>`;

      importModal_Directory.insertAdjacentHTML('beforeend', directoryEntry);

      importModal_Directory.querySelector(`#${uniqueID}`).addEventListener('click', function () {

        importMap(item);

        importModal_CloseFunc();

      });

    });

  });

}

function removeChildNodes(node) {

  var node_ = Array.from(node.childNodes);

  node_.forEach((childNode) => {

    node.removeChild(childNode);

  });

}

function getMapsDirectory(callback) {

  var getRequest = new XMLHttpRequest();
  var reqURL = '/getMapsDirectory';

  getRequest.open('GET', reqURL);
  getRequest.setRequestHeader('Content-Type', 'application/json');

  getRequest.addEventListener('load', function(event) {

    if (event.target.status === 200) {

      var data = JSON.parse(event.target.response);

      for (var i = 0; i < data.length; i++) {

        data[i] = data[i].split('.')[0];

      }

      callback(data);

    }

  });

  getRequest.send();

}

function saveMap(callback) {

  var saveModal = document.querySelector('.modal-container.save-modal');
  var saveModal_SelectedPins = saveModal.querySelectorAll('.table-row-checkbox:checked');
  var fileName = saveModal.querySelector('.modal-input').value;

  if (fileName) {

    fileName = fileName.trim().replace(/\s+/g, '-');

    var pinData = [];

    saveModal_SelectedPins.forEach((pin) => {

      var pinTableRow = pin.parentNode.parentNode;

      var pinObj = {

        name: pinTableRow.querySelector('.table-row-name').textContent,
        lat: pinTableRow.querySelector('.table-row-latitude').textContent,
        lng: pinTableRow.querySelector('.table-row-longitude').textContent

      }

      pinData.push(pinObj);

    });

    writeToFile(pinData, fileName);

    callback();

  } else {

    alert('Please enter a file name!');

  }

}

function writeToFile(data, fileName) {

  var postRequest = new XMLHttpRequest();
  var reqURL = '/exportFile';
  var entryData = {

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

//Select-all button for checkboxes
function selectAll(source) {

  var saveModal = document.querySelector('.modal-container.save-modal');
  var saveModal_Checkboxes = saveModal.querySelectorAll('.table-row-checkbox');

  saveModal_Checkboxes.forEach((item) => {

    // TODO: if one checkbox is unchecked then it should uncheck the select all checkbox

    item.checked = source.checked;

  });

}

function openSaveModal() {

  var saveModal = document.querySelector('.modal-container.save-modal');
  var saveModal_BackDrop = document.querySelector('.modal-backdrop.save-modal');
  var saveModal_XButton = saveModal.querySelector('.modal-x-button');
  var saveModal_CloseButton = saveModal.querySelector('.modal-close-button');
  var saveModal_SaveButton = saveModal.querySelector('.modal-save-button');

  var saveModal_CloseFunc = function () {

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

  var saveModal_SaveButtonFunc = function () {

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

  //Function that sends a request to the server for adding locations
  function addPin(name, lat, long) {
    var postRequest = XMLHttpRequest.open();
    postRequest.open('POST', '/addPin');

    var pinObject = {
      name: name,
      lat: Lat,
      long: Long
    };
    var requestBody = JSON.stringify(pinObject);
    postRequest.setRequestHeader(
      'Content-Type', 'application/json'
    );
    postRequest.addEventListener('load', function (event) {
      if (event.target.status != 200) {
        var message = event.target.response;
        alert("Error storing Pin data: ", message);
      } else {
        //Add pin data here
        console.log("Request was successful");
      }
    });

    postRequest.send(requestBody);
  }


  //Function that checks if a certain pin matches the filter request
  //returns true or false
  function pinPassesFilter(pin, filter){

  		if (filter.text){
      	var pinName = pin.name.toLowerCase();
  			var filterText = filter.text.toLowerCase();
         if (pinName.indexOf(filterText) === -1){
				return false;
  			}
  		}

  		return true;
  }

  //Updates pin results
  function doFilterUpdate(){

	      var filter = {
				text: document.querySelector('.search-bar-input').value.trim()
			}

			var pinContainer = document.querySelector('.saved-places-list-element');
			while (pinContainer.lastChild){
				pinContainer.removeChild(pinContainer.lastChild);
			}
			var i;
			for(i = 0; i < mapPins.length; i++){
				if(pinPassesFilter(mapPins[i], filter)){
					var pinArgs = {
						name: mapPins[i].name,
						lat: mapPins[i].latLng.lat(),
						lng: mapPins[i].latLng.lng()
					}
					var pinHTML = Handlebars.templates.savedPlaceEntry(pinArgs);
					var entrySection = document.querySelector('.saved-places-list-element');
					entrySection.insertAdjacentHTML('beforeend', pinHTML);
				}
			}
	}

  //Add event listener to button
