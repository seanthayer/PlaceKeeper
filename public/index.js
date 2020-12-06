window.addEventListener('DOMContentLoaded', function() {
  // UI interactions will go here
});

//Handles clicking and resetting involved with the modal

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
