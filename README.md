## PlaceKeeper

### Running the prototype locally

1. Be sure to have Node.js installed (along with npm, of course)

2. Clone the repository to your local machine

3. Within the repo's directory, run `npm install --production` from GitBash or the Linux terminal

    * If you have a GoogleMaps API Key, then create a `ENV_VARS.env` file in the repo's root dir, and within that file create a var `G_MAPS_API_KEY` set equal to your API Key. It will be automatically embedded when the server boots. (Note that this is not secure for public facing applications.)
    
    * If you do not have a GoogleMaps API Key, then the map embed will simply be started in development mode when the server boots.

4. After the dependencies are installed, run `npm start`

5. The server will begin listening on env var 'PORT' if specified, or 3000 if not.

6. Access the specified port in a web browser: `localhost:{PORT}`

### Completed Features
<details><summary><ins>Completed</ins> ↴</summary>
  ✓ Build basic 404 page                                                                            <br>
  ✓ Build basic Homepage                                                                            <br>
  ✓ Apply basic CSS styling                                                                         <br>
  ✓ Build basic About page                                                                          <br>
  ✓ Build basic Homepage Modal                                                                      <br>
  ✓ Implement Modal hiding/unhiding                                                                 <br>
  ✓ Implement reading of current pins and into modal (name, lat, lng)                               <br>
  ✓ Implement very basic 'POST' request generation for Modal                                        <br>
  ✓ Implement completed 'POST' request generation for modal                                         <br>
  ✓ Implement filtering of places (by name) in 'saved-places-list-element' using 'search-bar-input' <br>
  ✓ Implement 404 page routing                                                                      <br>
  ✓ Implement basic Express serving                                                                 <br>
  ✓ Implement serving partials from a {map_name}.json file                                          <br>
  ✓ About page routing                                                                              <br>
  ✓ Implement basic 'POST' request handling                                                         <br>
  ✓ Implement completed request and response 'POST' handling for saving a map                       <br>
  ✓ Implement completed request and response 'GET' handling for /importMap                          <br>
  ✓ Place embed and verify API functionality                                                        <br>
  ✓ Implement ability to place pins                                                                 <br>
  ✓ Implement ability to name a pin                                                                 <br>
  ✓ Implement ability to store latitude, longitude, and name of a pin in an object var              <br>
  ✓ Implement robust infobox popup form entry                                                       <br>
  ✓ Implement infobox popup for existing pins                                                       <br>
  ✓ Implement panning to pin on click                                                               <br>
  ✓ Implement deleting pin from map directly                                                        <br>
  ✓ Create a link to /about                                                                         <br>
  ✓ Style /about                                                                                    <br>
</details>
