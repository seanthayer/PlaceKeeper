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

});
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
}

  //Function that sends a request to the server for adding locations
  function addPin(name, lat, long) {
    var postRequest = XMLHttpRequest.open();
    postRequest.open('POST', '/addPin');

    var pinObject = {
      name: name;
      lat: Lat;
      long: Long;
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
