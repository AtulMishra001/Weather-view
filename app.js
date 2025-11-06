import { API_KEY } from "./config.js";

//input
const search_btn = document.querySelector(".search-btn");
//city buttons
const cities_buttons_list = document.querySelectorAll(".city-btn");
//span which contains the unit in which temperature has to be chnaged
const unit_change = document.querySelector(".unit-change");
//search history container
const searchHistoryContainer = document.querySelector(".search-history");
//variable to keep track of unit
let temp = "C"; //deflaut is celsius
let recentSearch = false // recent search div is hidden by default


if(!localStorage.getItem("recent")) {
  localStorage.setItem("recent", JSON.stringify([]))
}
getUserLocation() //calling the getUserLocation function immediately to show user their weather data.

// this function gets the user's precise coordinates for location search.
function getUserLocation() {
  // Checks if the browser supports the Geolocation API
  if (navigator.geolocation) {
    // Options for high accuracy and a timeout
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position)=> {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        geoCoding(latitude, longitude)
      }, // Function to run on success
      (error)=> {
        let errorMessage =
          "Could not retrieve location. Please ensure location services are enabled.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            // User blocked location access
            errorMessage = "Location access denied by the user.";
            break;
          case error.POSITION_UNAVAILABLE:
            // Location information is unavailable
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            // Request timed out
            errorMessage = "Location request timed out.";
            break;
        }
        console.error("Geolocation Error:", errorMessage);
        errorHandeler(error);
      }, // Function to run on failure
      options
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
//this function converts the latitude and longitude to city name and populates the data on screen.
async function geoCoding(lat, lon) {
  try{
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${API_KEY}`;
    const res = await fetch(url);
    const cityData = await res.json();
    const city = cityData[0].name;
    const data = await fetchData(city);
    populateData(data);
    renderforcast(data.list);
  } catch(error) {
    errorHandeler("error fetching current location.");
  }
  
}
//function to validate search input checks for empty spaces, numbers and special characters.
function validateSearch(search) {
  let input = search.trim();
  if (input === "") {
    throw new Error("Empty spaces not allowed. Enter city name");
  }
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\d]/.test(input)) {
    throw new Error("Numbers and special characters are not allowed");
  }
}

//this function changes the background based in main weather condition.
function changeBG(value) {
  let body = document.body;
  switch (value) {
    case "Clear":
      body.style.backgroundImage = "url('./images/sunny.png')";
      break;
    case "Clouds":
      body.style.backgroundImage = "url('./images/clouds.png')";
      break;
    case "Rain":
      body.style.backgroundImage = "url('./images/rain.png')";
      break;
    case "Thunderstorm":
      body.style.backgroundImage = "url('./images/storm.png')";
      break;
    case "Snow":
      body.style.backgroundImage = "url('./images/snow.png')";
      break;
    case "Mist":
      body.style.backgroundImage = "url('./images/atmosphere.png')";
      break;
    case "Smoke":
      body.style.backgroundImage = "url('./images/atmosphere.png')";
      break;
    case "Haze":
      body.style.backgroundImage = "url('./images/atmosphere.png')";
      break;
    case "Dust":
      body.style.backgroundImage = "url('./images/atmosphere.png')";
      break;
    case "Fog":
      body.style.backgroundImage = "url('./images/atmosphere.png')";
      break;
    case "Sand":
      body.style.backgroundImage = "url('./images/atmosphere.png')";
      break;
    case "Ash":
      body.style.backgroundImage = "url('./images/atmosphere.png')";
      break;
    case "Squall":
      body.style.backgroundImage = "url('./images/atmosphere.png')";
      break;
    case "Tornado":
      body.style.backgroundImage = "url('./images/atmosphere.png')";
      break;

    default:
      body.style.backgroundImage = "url('./images/sunny.png')";
      break;
  }
}

//Error handeler function displays the errors for some seconds.
function errorHandeler(error) {
  const errordiv = document.createElement("div");
  errordiv.innerHTML = `
    <div class="error-div p-1 text-sm md:text-lg px-3 bg-red-300/50 border-2 text-red-600 rounded-3xl">
        <p class="font-semibold">${error}</p>
    </div>`;
  document.body.insertBefore(errordiv, document.querySelector(".main"));
  setTimeout(() => {
    document.querySelector(".error-div").remove();
  }, 5000);
}
//unit convertor function
function unitConvertor(temp, convertTo) {
  if(convertTo === "C") {
    return Math.round((temp - 32) * 5 / 9);
  } else if(convertTo === "F") {
    return Math.round(temp * 1.8 + 32);
  }
}
//this function formates the date in this formate "1st Nov".
function formateDate(dt) {
  const date = new Date(dt * 1000);
  const day = date.getUTCDate();
  const month = date.toLocaleDateString('eng-US', {month: 'short', timeZone: 'UTC'});
  const dayOfMonth = date.getUTCDate();
  let suffix;
  if (dayOfMonth > 3 && dayOfMonth < 21) {
    // 4th to 20th
    suffix = "th";
  } else {
    switch (dayOfMonth % 10) {
      case 1:
        suffix = "st";
        break;
      case 2:
        suffix = "nd";
        break;
      case 3:
        suffix = "rd";
        break;
      default:
        suffix = "th";
    }
  }
  return `${day}${suffix} ${month}`
}  
//this functon renders the forcast card it receives an array of forecasts.
function renderforcast(list) {
  const date = new Date(list[0].dt * 1000);
  const hourOfTheDay = date.getUTCHours();  
  let i = (24 - hourOfTheDay)/3;
  const forecastContainer = document.querySelector(".forcast-container");
  forecastContainer.innerHTML = ""
  while(i < list.length) {
    let card = document.createElement("div");
    card.innerHTML = `<div
          class="w-[270px] h-[350px] bgBlur roundedShadow flex justify-center items-center"
        >
          <div class="w-[90%] h-[90%] bg-sky-500 rounded-[20px]">
            <div class="flex justify-around items-center">
              <img
                src="https://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png" class="" alt=""
              />
              <div class="flex flex-col gap-2">
                <span class="inline-block w-full text-center text-4xl">${Math.round(list[i].main.temp)}°C</span>
                <span class="inline-block w-full text-center text-2xl card-date">${formateDate(list[i].dt)}</span>
              </div>
            </div>
            <p class="description w-full text-center">${list[i].weather[0].description}</p>
            <div
              class="flex justify-between content-center-safe flex-wrap w-[100%] h-[68%] rounded-b-[20px] p-2 text-center"
            >
              <span class="w-[45%] mb-[10px]">Feels like</span>
              <span class="w-[45%] mb-[10px]">${list[i].main.feels_like}</span>
              <span class="w-[45%] mb-[10px]">Wind Speed</span>
              <span class="w-[45%] mb-[10px]">${list[i].wind.speed} m/s</span>
              <span class="w-[45%] mb-[10px]">cloudiness</span>
              <span class="w-[45%] mb-[10px]">${list[i].clouds.all}</span>
              <span class="w-[45%] mb-[10px]">Humidity</span>
              <span class="w-[45%] mb-[10px]">${list[i].main.humidity}</span>
            </div>
          </div>
        </div>`;
    i = i +8;
    forecastContainer.appendChild(card);
  }
  console.log(list[0].weather[0].main)
}

function renderRecentSearch() {
  document.querySelector(".search-history").innerHTML = ""
  const recentsearchArray = JSON.parse(localStorage.getItem("recent"));
  recentsearchArray.forEach((item) => {
    const p = document.createElement("p");
    p.innerHTML = `<p class="search-item border-b-[1px] p-1 min-h-fit">${item}</p>`;
    document.querySelector(".search-history").appendChild(p)
  });
}
//this function updates the data in main section and adds the search city to recent search.
function populateData(data) {
  
  changeBG(data.list[0].weather[0].main);
  const city = document.querySelector(".city");
  const temperature = document.querySelector(".temperature");
  const feelsLike = document.querySelector(".feels-like")
  const minTemp = document.querySelector(".min-temp")
  const maxTemp = document.querySelector(".max-temp")
  const humidity = document.querySelector(".humidity")
  const windSpeed = document.querySelector(".wind-speed");
  const windDirection = document.querySelector(".wind-direction");
  const pressure = document.querySelector(".pressure");
  const cloud = document.querySelector(".cloud");
  city.innerHTML = `${data.city.name},<span class="text-xl">${data.city.country}</span>`;
  temperature.innerText = `${Math.round(data.list[0].main.temp)}°`;
  temperature.dataset.temp = Math.round(data.list[0].main.temp);
  feelsLike.innerText = Math.round(data.list[0].main.feels_like);
  feelsLike.dataset.temp = Math.round(data.list[0].main.feels_like);
  minTemp.innerText = Math.round(data.list[0].main.temp_min);
  minTemp.dataset.temp = Math.round(data.list[0].main.temp_min);
  maxTemp.innerText = Math.round(data.list[0].main.temp_max);
  maxTemp.dataset.temp = Math.round(data.list[0].main.temp_max);
  humidity.innerText = data.list[0].main.humidity
  windSpeed.innerText = data.list[0].wind.speed;
  windDirection.innerText = data.list[0].wind.deg;
  pressure.innerText = data.list[0].main.pressure;
  cloud.innerText = `${data.list[0].clouds.all} %`
  const recentSearchArr = JSON.parse(localStorage.getItem("recent"));
  if(recentSearchArr.includes(data.city.name)) {    
    recentSearchArr.splice(recentSearchArr.indexOf(data.city.name),1);
    recentSearchArr.unshift(data.city.name);
  }else {
    recentSearchArr.unshift(data.city.name);
  }
  localStorage.setItem("recent", JSON.stringify(recentSearchArr));
  renderRecentSearch();
}
//Fetch data function fetches the data from API and returns a promise.
async function fetchData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    let res = await fetch(url);
    let data = await res.json();
    if(!res.ok) {
      errorHandeler(data.message);
    }
    return data;
    // the next line is only for development so that we don't have to call the api again and again
    // localStorage.setItem("data", JSON.stringify(data));
    // return JSON.parse(localStorage.getItem("data"));
}

document.addEventListener("DOMContentLoaded", (e) => {
  // capitalising the first character of users input in search bar
  const fillInput = document
    .querySelector(".search")
    .addEventListener("input", (e) => {
      let value =
        e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
      e.target.value = value;
    });

  const searchEvent = search_btn.addEventListener("click", (e) => {
    //validating the the seach and catching error if there is any
    try {
      //defore fetching the data we will set the temperature unit to default.
      document.querySelector(".unit").innerText = "C";
      document.querySelector(".unit-change-to").innerText = "°F";
      let value = document.querySelector(".search").value;
      validateSearch(value);
      temp = "C";

      let data = fetchData(value);
      data.then((res) => {
        populateData(res);
        renderforcast(res.list);
      });
    } catch (error) {
      errorHandeler(error);
    }
    document.querySelector(".search").value = "";
  });

  //click event for recent search items.
  document.querySelector(".recent").addEventListener("click", (e) => {
    if (recentSearch) {
      searchHistoryContainer.classList.add("hidden");
      recentSearch = false;
      document.querySelector(".recent").innerText = "history";
    } else {
      searchHistoryContainer.classList.remove("hidden");
      recentSearch = true;
      document.querySelector(".recent").innerText = "close";

      document.querySelectorAll(".search-item").forEach((searchItem) => {
        searchItem.addEventListener("click", (e) => {
          fetchData(e.target.innerText).then((data) => {
            populateData(data);
            renderforcast(data.list);
          });
        });
      });
    }
  });

  cities_buttons_list.forEach((city) => {
    city.addEventListener("click", async (e) => {
      const data = await fetchData(e.target.dataset.value);
      renderforcast(data.list);
      populateData(data);
    });
    renderRecentSearch();
  });
});

const unit_change_event = unit_change.addEventListener("click", (e)=> {
  const temperature = document.querySelector(".temperature");
  const min_temp = document.querySelector(".min-temp");
  const max_temp = document.querySelector(".max-temp");
  const feels_like = document.querySelector(".feels-like")
  const unit = document.querySelector(".unit");
  const unitChangeTo = document.querySelector(".unit-change-to")
  if(temp === "C") {
    //we have to change to fahrenheit
    temperature.dataset.temp = Math.round(unitConvertor(temperature.dataset.temp, "F"));
    temperature.innerText = temperature.dataset.temp+"°";

    min_temp.dataset.temp = Math.round(unitConvertor(min_temp.dataset.temp, "F"));
    min_temp.innerText = min_temp.dataset.temp;

    max_temp.dataset.temp = Math.round(unitConvertor(max_temp.dataset.temp, "F"));
    max_temp.innerText = max_temp.dataset.temp;

    feels_like.dataset.temp = Math.round(unitConvertor(feels_like.dataset.temp, "F"));
    feels_like.innerText = feels_like.dataset.temp;

    unit.innerText = "F"
    unitChangeTo.innerText = "C" 
    temp = "F"

  }else if(temp === "F") {
    let celsius = (temperature.dataset.temp - 32) * 5/9
    temperature.innerText = Math.round(celsius)+ "°"
    temperature.dataset.temp = celsius;

    min_temp.dataset.temp = Math.round(unitConvertor(min_temp.dataset.temp, "C"));
    min_temp.innerText = min_temp.dataset.temp;

    max_temp.dataset.temp = Math.round(unitConvertor(max_temp.dataset.temp, "C"));
    max_temp.innerText = max_temp.dataset.temp;

    feels_like.dataset.temp = Math.round(unitConvertor(feels_like.dataset.temp, "C"));
    feels_like.innerText = feels_like.dataset.temp;

    unit.innerText = "C"
    unitChangeTo.innerText = "F";
    temp = "C"
  }
})

const localtion_event = document.querySelector(".location").addEventListener("click", (e)=> {
  getUserLocation();
})