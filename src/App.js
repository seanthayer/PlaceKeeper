import React from 'react';
import './App.css';
import background from './img/background_header-bg.png';          // Sloppy,
import header from './img/thumbnail_placekeeper-header-icon.png'; // Find a better way.

function App() {
  return (
    <div className="PlaceKeeper">
      <header className="PK-header" style={{backgroundImage: `url(${background})`}}>
        
        <h1 className="site-title">PlaceKeeper</h1>

        <div className="header-image-container"><img className="header-image" src={`${header}`} alt="PlaceKeeper"/></div>

      </header>

      <main>
        <div className="content-container">
          <Map />
          <PlacesList />
        </div>
      </main>

    </div>
  );
}

class Map extends React.Component {
  render() {
    return (
      <section className="map-container">
        <div id="map"></div>

        <div className="import-and-save-buttons-container">

        <div className="import-map-element">
          <button type="button" className="import-map-button">Import Map</button>
        </div>

        <div className="save-map-element">
          <button type="button" className="save-map-button">Save Map</button>
        </div>

        </div>
      </section>
    );
  }
}

class PlacesList extends React.Component {
  render() {
    return (
      <aside className="saved-places-container">

        <div className="search-bar-container">
          <div className="search-bar-element">
            <input type="text" name="filter-text" className="search-bar-input" />
          </div>
          <button className="search-bar-button">Search</button>
        </div>

        <div className="saved-places-list-parent">

          <h5 className="saved-places-list-title">Saved Places</h5>

          <div className="saved-places-filter-info hidden">

          </div>

          <div className="saved-places-list-container">
            <ul className="saved-places-list-element">

            </ul>
          </div>

        </div>

      </aside>
    );
  }
}


// EXAMPLE CODE, disregard
/*
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  
  render() {
    return (
      <div>
        <h1>A Simple Clock</h1>
        <h2>
          It is {this.state.date.toLocaleTimeString()}
        </h2>
      </div>
    );
  }
  
  tick() {
    this.setState({
      date: new Date()
    });
  }
  
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
  
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
}
*/

export default App;
