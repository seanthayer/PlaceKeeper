
//Handles clicking and resetting involved with the modal

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
  var importModal_XButton = document.querySelector('.import-modal-hide-button');
  var importModal_CloseButton = document.querySelector('.import-modal-close-button');

  modalBackdrop.classList.remove('hidden');
  importModal.classList.remove('hidden');

  importModal_XButton.addEventListener('click', function () {

    modalBackdrop.classList.add('hidden');
    importModal.classList.add('hidden');

  });

  importModal_CloseButton.addEventListener('click', function () {

    modalBackdrop.classList.add('hidden');
    importModal.classList.add('hidden');

  });

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
