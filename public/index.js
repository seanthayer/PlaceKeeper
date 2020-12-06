// Creates <script> tag to access API
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD_OCPs2EO5gnBABRpMDdbEZzdH7OeESC4&callback=initMap';
script.defer = true;

// The API will callback when finished loading
window.initMap = function() {
  // Creates a new Map object inserting it into <div id="map"></div>
  map = new google.maps.Map(document.getElementById('map'), {
    // Each Map object must have a center defined with a latitude & longitude pair, and a zoom level
    center: {lat: 43.815136416911436, lng: -120.6398112171833},
    zoom: 5
  });
};

// Appends the API <script> tag to <head>
document.head.appendChild(script);

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

