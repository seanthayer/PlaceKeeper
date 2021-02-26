/* -------------------------------------------------------
 *
 *                      FUNCTIONS DEF
 * 
 * -------------------------------------------------------
 */


function removeChildNodes(node) {

  /*  Description:
   *    Function removes all child nodes from a given node.
   *    
   *  Parameters:
   *    node = An HTML element/node; the node to remove child nodes from
   */

  while (node.lastChild) {

    node.removeChild(node.lastChild);

  }

}

/* -------------------------------------------------------
 *
 *                        END DEF
 * 
 * -------------------------------------------------------
 */

window.addEventListener('DOMContentLoaded', function () {

  let saveMapButton;
  let importMapButton;
  let searchBarButton;

  saveMapButton = document.querySelector('.save-map-button');
  importMapButton = document.querySelector('.import-map-button');
  searchBarButton = document.querySelector('.search-bar-button');

  if (saveMapButton)   { saveMapButton.addEventListener('click', renderHandler.saveModal.render); }
  if (importMapButton) { importMapButton.addEventListener('click', renderHandler.importModal.render); }
  if (searchBarButton) { searchBarButton.addEventListener('click', renderHandler.filter.applyFilter); }

});
