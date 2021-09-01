/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React from 'react';

import * as Styles from 'components/PlacesSearch.styles';

/* ------------------------------------------
 *
 *              PLACES SEARCH
 * 
 * ------------------------------------------
 */

class PlacesSearch extends React.Component {

  // **FIX: Incomplete.

  /*  Description:
   *    No current functionality. Renders the saved places search bar.
   */

  render() {

    return (
      <div className="search-bar-container" css={Styles.container}>
        <div className="search-bar-element" css={Styles.element}>

          <input type="text" name="filter-text" className="search-bar-input" />

        </div>

        <button className="search-bar-button" css={Styles.element}>Search</button>

      </div>
    );

  }

}

export default PlacesSearch;