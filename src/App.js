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

      <section className="map-container">
        <Map />
      </section>

    </div>
  );
}

class Map extends React.Component {
  render() {
    return (
      <div id="map"></div>
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
