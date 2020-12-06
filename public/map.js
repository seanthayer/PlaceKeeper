var map;

// The API will callback 'initMap()' when finished loading
function initMap() {
  // Creates a new Map object inserting it into <div id="map"></div>
  map = new google.maps.Map(document.getElementById('map'), {
    // Each Map object must have a center defined with a latitude & longitude pair, and a zoom level
    center: {lat: 43.815136416911436, lng: -120.6398112171833},
    zoom: 5
  });

  var getRequest = new XMLHttpRequest();
  var reqURL = '/importMap';
  getRequest.open('GET', reqURL);

  getRequest.setRequestHeader('Content-Type', 'application/json');

  getRequest.addEventListener('load', function(event) {
    console.log("== Client side:");
    console.log(event);
    console.log(event.target.response);
  });

  getRequest.send();

  map.data.loadGeoJson('places-to-go.json');
}
