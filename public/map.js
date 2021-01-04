var g_mapNode;
var g_mapEventHandler;

function Pin(pin) {

  this.marker = pin.marker;
  this.name = pin.name;
  this.latLng = pin.latLng;
  this.clickListener = null;
  this.infoBox = null;
  this.description = null;

}

function initMap() {

  g_mapNode = document.querySelector('#map');
  g_mapEventHandler = google.maps.event;

  let mapEmbed = new google.maps.Map(document.querySelector('#map'), {

    center: { lat: 43.815136416911436, lng: -120.6398112171833 },
    zoom: 5,
    clickableIcons: false

  });

  renderHandler.map.setNewMapTarget(mapEmbed);

  g_mapEventHandler.addListenerOnce(mapEmbed, 'click', renderHandler.pin.renderNewPinForm);

}
