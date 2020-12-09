# Team 1

Sean Thayer-Freeman: thayerfs@oregonstate.edu

Blake Henry: henrybl@oregonstate.edu

Jonathan Mather: matherj@oregonstate.edu

Christian Herinckx: herincch@oregonstate.edu

## Deadline:
#### Code and demo due by 5:00pm on Friday, 12/11/2020

**Grading Criteria** ↴
* 50 points – Your app satisfies these requirements:
  * The app uses HTML and CSS to implement a well-designed client interface.
  * The app uses client-side JS to enable relevant user interactions.
  * The app is served using a Node.js-based (or other approved) serving stack.
  * The app dynamically generates pages based on data stored permanently on the back end.
  * The app’s client interface communicates with the app’s server to create, read, update, and/or delete content in the back end data store.
* 25 points – Your app has a high-quality design and implementation.
  * For example, your app is free of bugs and has an effective user interface.
* 25 points – Your app is creative and original.
  * If, for example, your app is simply a repackaging of the app we develop together during lecture or the one you developed during your assignments this term, you will likely not score highly in this category.


#
## PlaceKeeper
#### Rough Description
PlaceKeeper will feature a Google Maps embed which the user will be
able to interact with. Specifically, the user will be able to place map pins in locations of
their choice, assign a name & description to that map pin, be able to save a map with
these locations, and finally, be able to retrieve said map at a later time.

## General Roadmap

### Format & Design

<ins>Completed</ins>↴
* [x] Build basic 404 page
* [x] Build basic Homepage
* [x] Apply basic CSS styling
* [x] Build basic About page
* [x] Build basic Homepage Modal

### Front-end Functionality
* [ ] Implement completed 'POST' request generation for modal
* [ ] Implement filtering of places (by name) in 'saved-places-list-element' using 'search-bar-input'
* [ ] Implement selecting list item and panning to pin on map

<ins>Completed</ins>↴
* [x] Implement Modal hiding/unhiding
* [x] Implement reading of current pins and into modal (name, lat, lng)
* [x] Implement very basic 'POST' request generation for Modal

### Back-end Functionality
* [ ] Implement completed request and response 'POST' handling for saving a map
* [ ] Implement completed request and response 'GET' handling for /importMap

<ins>Completed</ins>↴
* [x] Implement 404 page routing
* [x] Implement basic Express serving
* [x] Implement serving partials from a {map_name}.json file
* [x] About page routing
* [x] Implement basic 'POST' request handling

### GoogleMaps Embed

<ins>Completed</ins>↴
* [x] Place embed and verify API functionality
* [x] Implement ability to place pins
* [x] Implement ability to name a pin
* [x] Implement ability to store latitude, longitude, and name of a pin in an object var
* [x] Implement robust infobox popup form entry
* [x] Implement infobox popup for existing pins
* [x] Implement panning to pin on click
* [x] Implement deleting pin from map directly or removing pin when its list item is removed

### Optional Features
* [ ] Implement client side deletion of a list item from the saved places list. This should also remove it from the map embed.
* [ ] Create a link to /about
* [ ] Style /about
* [ ] Further style homepage
* [ ] Create another page?
* [ ] . . .
