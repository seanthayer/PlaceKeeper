window.addEventListener('DOMContentLoaded', function () {

  var saveMapButton = document.querySelector('.save-map-button');
  saveMapButton.addEventListener('click', showModal);

  var saveModal_XButton = document.querySelector('.save-modal-x-button');
  var saveModal_CloseButton = document.querySelector('.save-modal-close-button');
  saveModal_XButton.addEventListener('click', hideModal);
  saveModal_CloseButton.addEventListener('click', hideModal);

  var saveModal_SaveButton = document.querySelector('.save-modal-save-button');
  saveModal_SaveButton.addEventListener('click', savePins);

  var searchBarButton = document.querySelector('.search-bar-button');
  searchBarButton.addEventListener('click', doFilterUpdate);

  var importMapButton = document.querySelector('.import-map-button');
  importMapButton.addEventListener('click', openImportModal);

});

function openImportModal() {

  var modalBackdrop = document.querySelector('.import-modal-backdrop');
  var importModal = document.querySelector('.import-modal-container');
  var importModal_XButton = importModal.querySelector('.import-modal-x-button');
  var importModal_CloseButton = importModal.querySelector('.import-modal-close-button');
  var importModal_Directory = importModal.querySelector('.import-modal-directory-container');

  var importModal_CloseFunc = function () {

    modalBackdrop.classList.add('hidden');
    importModal.classList.add('hidden');

    removeChildNodes(importModal_Directory);

    importModal_XButton.removeEventListener('click', importModal_CloseFunc);
    importModal_CloseButton.removeEventListener('click', importModal_CloseFunc);

  }

  modalBackdrop.classList.remove('hidden');
  importModal.classList.remove('hidden');

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

function savePins(){
  checkboxes = document.getElementsByClassName('select-pin');
  pin_names = document.getElementsByClassName('pin-name');
  pin_lats = document.getElementsByClassName('latitude');
  pin_longs = document.getElementsByClassName('longitude');
  file_name = document.querySelector('.save-modal-input').value;

  if (file_name) {

    file_name = file_name.trim().replace(/\s+/g, '-');

    checkbox_data = []
    for(var i = 0; i < checkboxes.length; ++i) {
      if(checkboxes[i].checked){
        name = pin_names[i].textContent
        lat =  pin_lats[i].textContent
        longs = pin_longs[i].textContent
        jVar = { "name":name, "lat":lat, "lng":longs};

        checkbox_data.push(jVar)
      }

    }
    writeToFile(checkbox_data, file_name)

    hideModal();
    resetModal();

  } else {

    alert('Please enter a file name!');

  }

}

function resetModal(checkboxes){
  checkboxes = document.getElementsByClassName('select-pin');
  selectAllBox = document.querySelector('.table-select-all');
  selectAllBox.checked = false;
  document.querySelector('.save-modal-input').value = '';
  for (var i = 0; i < checkboxes.length; ++i){
    checkboxes[i].checked = false;
  }
}
function writeToFile(jsonData, file_name){
  let postRequest = new XMLHttpRequest();
  let reqURL = '/exportFile';
  postRequest.open('POST', reqURL, true);
  postRequest.setRequestHeader('Content-Type','application/json');

  postRequest.addEventListener('load', function(event) {
    if (event.target.status != 200){
      console.log("Pins Error")
      var message = event.target.response;
      alert("Error saving Pins: ", message);
    } else {
        console.log("Request successful");
      }
  });

  file_name = `data/${file_name}.json`
  console.log(file_name)

  let obj = {"data": jsonData, "file": file_name};
  obj = JSON.stringify(obj)
  console.log(obj)
  postRequest.send(obj);
}

//Select-all button for checkboxes
function toggle(source) {
  checkboxes = document.getElementsByClassName('select-pin');
  for(var i = 0; i < checkboxes.length; ++i) {
    checkboxes[i].checked = source.checked
  }
}

//Shows the modal when the button to select pins is clicked
function showModal(){
  var selectPinsModal = document.querySelector('.save-modal-container');
  var modalBackdrop = document.querySelector('.save-modal-backdrop');

  selectPinsModal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');

}

//Hides modal when close/exit button are clicked
function hideModal(){
  var selectPinsModal = document.querySelector('.save-modal-container');
  var modalBackdrop = document.querySelector('.save-modal-backdrop');

  selectPinsModal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');
  resetModal();
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
