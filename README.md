# PlaceKeeper

PlaceKeeper is a prototype web application which utilizes the Google Maps JavaScript API, and allows the user to store points of interest. 

PlaceKeeper is a full stack application and currently featured with,

---

- ✅ **TypeScript**
- ✅ **Node.js**
  - ☑️ *Express*
  - ☑️ *Sequelize*
- ✅ **MySQL**
   - ☑️ *Docker*
- ✅ **React**
   - ☑️ *Create React App*

---

PlaceKeeper's primary goal is to serve as a hands-on learning opportunity. As a secondary outcome, PlaceKeeper exhibits a full stack implementation and acts as a reference point for future projects.

## Points of Interest

- [ReactMap Writeup](https://github.com/seanthayer/PlaceKeeper/pull/15) ([PDF](https://drive.google.com/file/d/1yku9YHY4bs81nqVXiv-mWyFcBKnWmVef/view?usp=sharing)) — The complete writeup and analysis for the abandoned ReactMap branch. This branch attempted to fully integrate the rendering of React components on the Google Maps embed, with minimal dependency on API functionalities.
- [ReactMap Graveyard](https://github.com/seanthayer/PlaceKeeper/tree/main/__abandoned/reactmap) — The actual code of ReactMap at its point of fullest development. No promises made in regard to readability or organization.
  - [API](https://github.com/seanthayer/PlaceKeeper/blob/main/__abandoned/reactmap/API.ts) — The library functions that acted as ReactMap's interface.
  - [RenderLayer](https://github.com/seanthayer/PlaceKeeper/blob/main/__abandoned/reactmap/components/RenderLayer.tsx) — The component that managed interactions between the API and rendered components.
  - [RenderedComponent](https://github.com/seanthayer/PlaceKeeper/blob/main/__abandoned/reactmap/components/RenderedComponent.tsx) — The component that wrapped any user-defined React component, housing functions for position keeping and instance specific logic.
- [Dev Interface](https://github.com/seanthayer/PlaceKeeper/blob/main/src/__DEV__/__DEV__INTERFACE.ts) — Orginally created when developing ReactMap, houses various debugging functions related to the map embed.
- [Server](https://github.com/seanthayer/PlaceKeeper/blob/main/server.js) — PlaceKeeper's Node.js based server, utilizing Express and Sequelize.
  - [SQL Starter](https://github.com/seanthayer/PlaceKeeper/blob/main/sql_example.sql) — SQL code for initializing the example tables. Also provides insight into the basic database schema.
- [Map API](https://github.com/seanthayer/PlaceKeeper/blob/main/src/map/API.tsx) — Home to all functions that manage map pins and pin interactions.
- [App](https://github.com/seanthayer/PlaceKeeper/blob/main/src/App.tsx) — PlaceKeeper's primary React component, composes all sub-components.
- [Type Definitions](https://github.com/seanthayer/PlaceKeeper/blob/main/src/global.d.ts) — All globally accessible definitions for TypeScript functionality.

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
   * [x] Port to TypeScript

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

2. Run `npm install` in the repo's directory.

   * If you have a GoogleMaps API Key, create a `.env.local` file in the root directory. In it, create a var `REACT_APP_GMAPS_APIKEY` set equal to your API Key. The API Loader package will handle linking.

   * If you do not have a GoogleMaps API Key, the map embed will start in development mode.

3. *(Optional)* Instructions on setting up a database server is beyond the scope here. However, if you have an existing database server, the backend accesses `.env.local` and looks for env vars `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_USEDB` to initiate a connection.

4. After dependencies are installed, run `npm run build && npm run node`.

5. After compiling, the server will listen on env var `PORT`, or default to port `3000`.

6. Access the port in a web browser. e.g. `localhost:3000`.
