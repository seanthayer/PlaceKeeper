/** @jsxImportSource @emotion/react */

/* ------------------------------------------
 *
 *                  IMPORT
 * 
 * ------------------------------------------
 */

import React   from 'react';
import { css } from '@emotion/react';

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

    /* -----------------------
     *    COMPONENT STYLES
     * -----------------------
     */

    const containerStyle = css`
    
      display: flex;
      padding: 5px 3px 5px 3px;
      border: 1px solid black;
      border-radius: 5px;
      background: dimgrey;
    
    `;

    const elementStyle = css`
    
      margin: 2px;
    
    `;

    /* -----------------------
     *       HTML CONTENT
     * -----------------------
     */

    return (
      <div className="search-bar-container" css={containerStyle}>
        <div className="search-bar-element" css={elementStyle}>

          <input type="text" name="filter-text" className="search-bar-input" />

        </div>

        <button className="search-bar-button" css={elementStyle}>Search</button>

      </div>
    );

  }

}

export default PlacesSearch;