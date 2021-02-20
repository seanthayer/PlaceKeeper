## PlaceKeeper

### Spring 2021 - CS 406
A continuation of PlaceKeeper.

Working with the generous guidance of Professor Rob Hess.

(The description and objectives listed reflect a best case of the project's completion. The end result will vary, depending on the challenges faced.)

### Project Description
PlaceKeeper will be a web application that interfaces with the Google Maps JavaScript API, allowing a user to store points of interest on a personal user profile. The application will be served from a Node.js based back-end, and the data will be handled using a MySQL database or MongoDB. The user interface will be completely overhauled to utilize the React library, and the page will be stylized using Bootstrap or Material UI. The application will be capable of managing multiple profiles with authentication, and the application’s map embed will feature expanded functionality and more complex API interactions.

Finally, the application will be presented with a responsive and intuitive user experience, tying together a fully realized version of PlaceKeeper and exhibiting a full-stack implementation.

### Project Objectives
* The application’s UI is interactive and fully featured using the React library.
* The application’s front-end is stylized using Bootstrap or Material UI.
* The application’s back-end handles relevant data using a MySQL database or MongoDB.
* The application’s back-end authenticates the user and can handle multiple user accounts.
* The application’s front-end map embed has expanded functionality.
* The application’s front-end is presented with a responsive UI and an intuitive UX.

---

### Screenshots

<details><summary>[Jan. 2021]</summary>

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

1. Be sure to have Node.js installed.

2. Clone the repository to your local machine.

3. Within the repo's directory, run `npm install --production` from GitBash or the Linux terminal.

    * If you have a GoogleMaps API Key, then create a `ENV_VARS.env` file in the repo's root dir, and within that file create a var `G_MAPS_API_KEY` set equal to your API Key. It will be automatically embedded when the server boots. (Note that this is not secure for public facing applications.)

    * If you do not have a GoogleMaps API Key, then the map embed will simply be started in development mode when the server boots.

4. After the dependencies are installed, run `npm start`.

5. The server will begin listening on env var 'PORT' if specified, or 3000 if not.

6. Access the specified port in a web browser: `localhost:{PORT}`.
