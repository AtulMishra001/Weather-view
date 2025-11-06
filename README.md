# Weather-view
Weather view is a responsive web app for weather forecast it shows 5 days step forecast you can search for any city in the world or can check weather condition of your currrent location.

## Folder Structure
```bash 
    Weather-view
    |-/images
    |   |-/all the images are here
    |-app.js
    |-index.html
    |-input.css
    |-output.css
    |-package-lock.json
    |-package.json
    |-README.md
```
## Technologies used
* HTML
* Tailwind Css
* Javascript
* node JS

### How to run this app on your machine
* You should have Node Js version 18 or above.
* Tailwind CSS version 4.1.14 is used in this app.
* You should have your open weather map API KEY [GET_YOUR_KEY](https://youtu.be/Fks_QxwVpW8?si=LSsFSnLqG14loiOX).
* After cloning this repo you have to create a file **config.js** in the same directory where **app.js** is present.
* Past the following code in **config.js**
```javascript
    export const API_KEY = "REPLACE_WITH_YOUR_KEY";
```
* Now run the following commands

```bash
    npm install
    npx @tailwindcss/cli -i ./input.css -o ./output.css --watch
```
* Run live server and you are set to go.
