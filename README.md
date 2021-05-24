# PlaceKeeper

### Front end
<ins>Completed</ins>↴
* [x] Convert homepage to React
* [x] Rendering of import & save modals
* [x] PlacesList complete rendering
* [x] Import & Save modal rendering and functionality

### Back end
<ins>Completed</ins>↴

### Gmaps
<ins>Completed</ins>↴
* [x] Linked API within React
* [x] Creation and deletion of map pins
* [x] Rendering of pin infoboxes

## Project Metadata
<details><summary>[Expand]</summary>
<br>
A continuation of PlaceKeeper.

Working with the generous guidance of Professor Rob Hess.

(The description and objectives listed reflect a best case of the project's completion. The end result will vary, depending on the challenges faced.)

### Project Goal
PlaceKeeper's primary goal is to serve as a hands-on learning opportunity. By the logical end of the project, the aim is to have a deeper understanding of:
* Working with external APIs
* Working with PHP, XML, and JavaScript
* Working with Node.js, React, and Material UI
* Designing and implementing MySQL databases
* Designing and implementing user interfaces
* Managing multiple user accounts and authentication

As a secondary outcome, PlaceKeeper will exhibit a full stack implementation and act as a reference point for future projects.

## Project Description
PlaceKeeper will be a web application that interfaces with the Google Maps JavaScript API. It will give a user the ability to store and interact with location data through various methods. These methods will interact directly with the Maps API in the following ways:
* All location data will be managed using [MySQL and PHP](https://developers.google.com/maps/documentation/javascript/mysql-to-maps).
* A map can optionally be used to visualize a dataset. Through an imported `.csv` or `.json` file, a user can import large quantities of data gathered from a seperate application or source. (Security risks will be accounted for when importing user data.) Then, through the Maps API [Visualization Library](https://developers.google.com/maps/documentation/javascript/visualization), a user can present their data through an adjustable heatmap.  
* A user will be able to manually create a location by placing a new pin or dragging an existing pin. A user will also be able to create a new location through the Maps API [Geocoding Service](https://developers.google.com/maps/documentation/javascript/geocoding). Using this service will convert a valid street address into a corresponding latitude & longitude pair on the map.
* Through the Maps API [Distance Matrix Service](https://developers.google.com/maps/documentation/javascript/distancematrix), a user will be able to calculate the distance of a path between an origin pin and a destination pin, if such a path exists.
* Each location infobox will have a button that simply brings a user into the [Street View](https://developers.google.com/maps/documentation/javascript/streetview) of that given location.
* The [Custom Markers](https://developers.google.com/maps/documentation/javascript/custom-markers) API may be implemented just for the fun of it. :-)
* The Maps API has a nice [Drawing Library](https://developers.google.com/maps/documentation/javascript/drawinglayer) which allows a user to draw directly on the map embed. This will make it so a more broad "location area" can be defined through the use of [Shapes](https://developers.google.com/maps/documentation/javascript/shapes).
* The map embed will be correctly [Localized](https://developers.google.com/maps/documentation/javascript/localization) for a user's region.

PlaceKeeper's server will be built using [Node.js](https://nodejs.org/) with [Express](https://www.npmjs.com/package/express) serving. As mentioned previously, the relevant data will be handled using MySQL and PHP. The user interface will be implemented using the React library, and more specifically, using [Create React App](https://create-react-app.dev/) as a framework.

Now, if React is a fine wine, then [Material UI](https://material-ui.com/) is the artisan cheese it pairs with, and PlaceKeeper will be the vineyard that a user has the pleasure of relaxing in. Or, in so many words, Material UI will be added alongside React to handle styling.

Finally, basic user profiles will be implemented, allowing the storage of user-specific maps on the server.

### Project Objectives
* The application’s front-end is implemented using Create React App.
* The application’s front-end is stylized using Material UI.
* The application’s front-end map embed has expanded functionality.
* The application’s front-end is presented with a responsive UI and an intuitive UX.
* The application's back-end features a robust Node.js server that utilizes Express.
* The application’s back-end handles relevant data using a MySQL database.
* The application's back-end uses PHP to handle queried data.
* The application’s back-end authenticates a user and can handle multiple user accounts.

</details>

## Misc.

### Screenshots

<details><summary>[V1 - Jan. 2021]</summary>

#### Site homepage
<details><summary>[Image]</summary>

   ![Site homepage](/public/img/screenshots/screenshot_site-main.png)

</details>

#### Creating a new pin
<details><summary>[Image]</summary>

   ![Creating a new pin](/public/img/screenshots/screenshot_site-newpin.png)

</details>

#### Import modal
<details><summary>[Image]</summary>

   ![Import modal](/public/img/screenshots/screenshot_site-importmodal.png)

</details>

#### A map with multiple pins
<details><summary>[Image]</summary>

   ![A map with multiple pins](/public/img/screenshots/screenshot_site-multi-pins.png)

</details>

#### An example of the search function
<details><summary>[Image]</summary>

   ![An example of the search function](/public/img/screenshots/screenshot_site-filter.png)

</details>

#### Save modal
<details><summary>[Image]</summary>

   ![Save modal](/public/img/screenshots/screenshot_site-savemodal.png)

</details>

</details>

### Running the application locally

To be updated.
