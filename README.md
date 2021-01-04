## PlaceKeeper

### Screenshots

#### Site homepage
<details><summary>[ Image ]</summary>
   
   ![Site homepage](/public/img/screenshots/screenshot_site-main.png)
   
</details>

#### Creating a new pin
<details><summary>[ Image ]</summary>
   
   ![Creating a new pin](/public/img/screenshots/screenshot_site-newpin.png)
   
</details>

#### Import modal
<details><summary>[ Image ]</summary>
   
   ![Import modal](/public/img/screenshots/screenshot_site-importmodal.png)
   
</details>

#### A map with multiple pins
<details><summary>[ Image ]</summary>
   
   ![A map with multiple pins](/public/img/screenshots/screenshot_site-multi-pins.png)
   
</details>

#### An example of the search function
<details><summary>[ Image ]</summary>
   
   ![An example of the search function](/public/img/screenshots/screenshot_site-filter.png)
   
</details>

#### Save modal
<details><summary>[ Image ]</summary>
   
   ![Save modal](/public/img/screenshots/screenshot_site-savemodal.png)
   
</details>

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

<details><summary><ins>[ List ]</ins> ↴</summary>

  <br>

  <strong>Second Implementation [ In Progress ]</strong>                                            <br>
  ✓ Implement panning to pin on map from button in the list entry                                   <br>
  ✓ Implement optional pin description functionality                                                <br>
  ✓ Implement removing pin via saved place list                                                     <br>

  <strong>First Implementation</strong>                                                             <br>
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
