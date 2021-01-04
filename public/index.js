function removeChildNodes(node) {

  while (node.lastChild) {

    node.removeChild(node.lastChild);

  }

}

window.addEventListener('DOMContentLoaded', function () {

  let saveMapButton;
  let importMapButton;
  let searchBarButton;

  if (saveMapButton = document.querySelector('.save-map-button')) { saveMapButton.addEventListener('click', renderHandler.saveModal.render); }
  if (importMapButton = document.querySelector('.import-map-button')) { importMapButton.addEventListener('click', renderHandler.importModal.render); }
  if (searchBarButton = document.querySelector('.search-bar-button')) { searchBarButton.addEventListener('click', renderHandler.filter.applyFilter); }

});
