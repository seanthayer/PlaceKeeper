class MapInterface {
  constructor(mapEmbed, mapDOMNode) {
    this.mapEmbed   = mapEmbed;
    this.mapDOMNode = mapDOMNode;

    this.generateNewPin = this.generateNewPin.bind(this);
  }

  generateNewPin(event) {
    const google = window.google;
    const mapEvent = window.mapEvent;
    const HTMLGen = window.HTMLGen;

    let newInfoForm = this._generateInfoBox(event.latLng, HTMLGen.NewPinForm());

    let newMarker = new google.maps.Marker({

      position: event.latLng,
      map: this.mapEmbed

    });

    mapEvent.addListenerOnce(newInfoForm, 'domready', () => {

      let newPin = {

        marker: newMarker,
        infoBox: newInfoForm,
        latLng: event.latLng

      }

      this._handleNewPinForm(newPin);

    });

  }

  _generateInfoBox(latLng, html) {
    const google = window.google;

    let offset = new google.maps.Size(0, -35, 'pixel', 'pixel');
    let infoBox = new google.maps.InfoWindow();

    infoBox.setPosition(latLng);
    infoBox.setContent(html);
    infoBox.setOptions({ pixelOffset: offset });
    infoBox.open(this.mapEmbed);

    return infoBox;
  }

  _handleNewPinForm(newPin) {
    const mapEvent = window.mapEvent;

    let infoForm = this.mapDOMNode.querySelector('.pin-infoform-container');
    let infoForm_nameField = infoForm.querySelector('input.pin-infoform-name');
    let infoForm_descField = infoForm.querySelector('textarea.pin-infoform-description');
    let infoForm_saveButton = infoForm.querySelector('button[name="save"]');
    let infoForm_cancelButton = infoForm.querySelector('button[name="cancel"]');


    mapEvent.addDomListener(infoForm_cancelButton, 'click', function () {

      console.log('test cancel');

    });

    mapEvent.addListener(newPin.infoBox, 'closeclick', function () {

      console.log('test x');

    });
  }
}

export default MapInterface;