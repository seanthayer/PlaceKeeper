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
