# PlaceKeeper

PlaceKeeper is a prototype web application which utilizes the Google Maps JavaScript API, and allows the user to store points of interest. 

PlaceKeeper is a full stack application and currently featured with,
* Node.js (using Express)
* A MySQL database (emulated with Docker)
* React (using Create React App)
* Emotion (for component specific CSS)
* Sequelize (handling database interactions)

PlaceKeeper's primary goal is to serve as a hands-on learning opportunity. As a secondary outcome, PlaceKeeper exhibits a full stack implementation and acts as a reference point for future projects.

## Roadmap
<details><summary>[Expand]</summary>

   ### Front-end
   <ins>Completed</ins>↴
   * [x] Convert homepage to React
   * [x] Rendering of import & save modals
   * [x] PlacesList complete rendering
   * [x] Import & Save modal rendering and functionality
   * [x] Submodal for confirmations and basic menus
   * [x] Import & Save modal ask for confirmations using submodal
   * [x] Apply CSS on a component level using Emotion

   ### Back-end
   <ins>Completed</ins>↴
   * [x] NodeJS serves production build
   * [x] Endpoints for API calls
   * [x] MySQL integration and query functions
   * [x] Map creation and deletion / overwriting
   * [x] Database interactions handled by Sequelize

   ### Gmaps
   <ins>Completed</ins>↴
   * [x] Linked API within React
   * [x] Creation and deletion of map pins
   * [x] Rendering of pin infoboxes

   ### Ideas
   * Front-end↴
      * Stylize using Material UI
      * Expand UX & UI
      * Make components more generic/reusable

   * Back-end↴
      * Authentication and user accounts

   * Gmaps↴
      * Visualize datasets w/ heatmaps, etc. ([Visualization Library](https://developers.google.com/maps/documentation/javascript/visualization))
      * Import `.csv` or `.json` files for lat & lng coords
      * Drag existing pins around map
      * Geocoding to convert street addresses into lat & lng coords ([Geocoding Service](https://developers.google.com/maps/documentation/javascript/geocoding))
      * Calculate distance between pins ([Distance Matrix Service](https://developers.google.com/maps/documentation/javascript/distancematrix))
      * Streetview button for pins ([Street View](https://developers.google.com/maps/documentation/javascript/streetview))
      * ([Custom Markers](https://developers.google.com/maps/documentation/javascript/custom-markers))
      * Ability to create "location areas" ([Drawing Library](https://developers.google.com/maps/documentation/javascript/drawinglayer) & [Shapes](https://developers.google.com/maps/documentation/javascript/shapes))
      * ([Localization](https://developers.google.com/maps/documentation/javascript/localization))

</details>

## Misc.

### Screenshots

( . . . Soon™ . . . )

### Running the application locally

1. Have Node.js installed.

2. Clone the repository.

2. Run `npm install --production` in the repo's directory.

   * If you have a GoogleMaps API Key, create a `.env.local` file in the root directory. In it, create a var `REACT_APP_GMAPS_APIKEY` set equal to your API Key. The API Loader package will handle linking.

   * If you do not have a GoogleMaps API Key, the map embed will start in development mode.

3. *(Optional)* Instructions on setting up a database server is beyond the scope here. However, if you have an existing database server, the backend accesses `.env.local` and looks for env vars `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_USEDB` to initiate a connection.

4. After dependencies are installed, run `npm run build && npm run node`.

5. After compiling, the server will listen on env var `PORT`, or default to port `3000`.

6. Access the port in a web browser. e.g. `localhost:3000`.
