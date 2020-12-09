/*
 * Wait until the DOM content is loaded, and then hook up UI interactions, etc.
 */
window.addEventListener('DOMContentLoaded', function () {
  var selectPinsButton = document.getElementById('select-pins-button');
  if (selectPinsButton){
    selectPinsButton.addEventListener('click', showModal);
  }

  var hideModalButton = document.getElementsByClassName('modal-hide-button');
  for(var i = 0; i < hideModalButton.length; ++i){
    hideModalButton[i].addEventListener('click', hideModal);
  }

  var saveModalButton = document.getElementById('modal-accept');
  if (saveModalButton){
    saveModalButton.addEventListener('click', savePins);
  }

  var importMapButton = document.querySelector('.import-map-button');
  if (importMapButton) {

    importMapButton.addEventListener('click', openImportModal);

  }

});

function openImportModal() {

  var modalBackdrop = document.querySelector('.import-modal-backdrop');
  var importModal = document.querySelector('.import-modal-container');
  var importModal_XButton = importModal.querySelector('.import-modal-hide-button');
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

    data.forEach((item) => {

      importModal_Directory.insertAdjacentHTML('beforeend', `<div class="map-directory-entry-container"> <i class="fas fa-file"></i> <h4 class="file-title">${item}</h4> </div>`)

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
  file_name = document.getElementById('modal-search-bar-input').value;
  console.log(file_name)
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
}

function resetModal(checkboxes){
  checkboxes = document.getElementsByClassName('select-pin');
  selectAllBox = document.getElementById('select-all');
  selectAllBox.checked = false;
  document.getElementById('modal-search-bar-input').value = '';
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
  var selectPinsModal = document.getElementById('select-pins-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

  selectPinsModal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');

}

//Hides modal when close/exit button are clicked
function hideModal(){
  var selectPinsModal = document.getElementById('select-pins-modal');
  var modalBackdrop = document.getElementById('modal-backdrop');

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

  //Add event listener to button
