import { API_KEY } from "./config.js";

//input
const search_feald = document.querySelector(".search");
//city buttons
const cities_buttons_list = document.querySelectorAll(".city-btn");
//span which contains the unit in which temperature has to be chnaged
const unit_change = document.querySelector(".unit-change");
//variable to keep track of unit
let temp = "C"; //deflaut is celsius


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
//Error handeler function displays the errors for some seconds.
function errorHandeler(error) {
  let errordiv = document.createElement("div");
  errordiv.innerHTML = `
    <div class="error-div p-1 text-sm md:text-lg px-3 bg-red-300/50 border-2 text-red-600 rounded-3xl">
        <p class="font-semibold">${error}</p>
    </div>`;
  document.body.insertBefore(errordiv, document.querySelector(".main"));
  setTimeout(() => {
    document.querySelector(".error-div").remove();
  }, 5000);
}


//this function formates the data in useful manner so that it can be useed directly to update UI.
function formateData(data) {
  console.log(data);
  const[country, name] = data.city 
  let formatedData = {};
  
}

//unit convertor function
function unitConvertor(temp, convertTo) {
  if(convertTo === "C") {
    return Math.round((temp - 32) * 5 / 9);
  } else if(convertTo === "F") {
    return Math.round(temp * 1.8 + 32);
  }
}

//this functon renders the forcast card.
function renderforcast(list) {
  let date = new Date(list[0].dt * 1000);
  let hourOfTheDay = date.getUTCHours();  
  let i = (24 - hourOfTheDay)/3;
  let forecastContainer = document.querySelector(".forcast-container");
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
                <span class="inline-block w-full text-center text-2xl card-date">31<sup>st</sup>Oct</span>
              </div>
            </div>
            <p class="description w-full text-center">${list[i].weather[0].description}</p>
            <div
              class="flex justify-between content-center-safe flex-wrap w-[100%] h-[68%] rounded-b-[20px] p-2 text-center"
            >
              <span class="w-[45%] mb-[10px]">Feels like</span>
              <span class="w-[45%] mb-[10px]">${list[i].main.feels_like}</span>
              <span class="w-[45%] mb-[10px]">Wind Speed</span>
              <span class="w-[45%] mb-[10px]">${list[i].wind.speed}m/s</span>
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
 

}






//Fetch data function fetches the data from API and returns a promise.
async function fetchData(city) {
  try{
    // const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    // let res = await fetch(url);
    // let data = await res.json();
    // localStorage.setItem("data", JSON.stringify(data));
    // the next line is only for development so that we don't have to call the api again and again
    return JSON.parse(localStorage.getItem("data"))
  }
  catch(error) {
    errorHandeler(error);
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  // capitalising the first character of users input in search bar
  const fillInput = search_feald.addEventListener("input", (e) => {
    let value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    e.target.value = value;
  });

  const searchEvent = search_feald.addEventListener("change", (e) => {
    //validating the the seach and catching error if there is any
    try {
      let value = e.target.value;
      validateSearch(value);
      let data = fetchData(value);
      data.then((res) => renderforcast(res.list));
      
    } catch (error) {
      errorHandeler(error);
    }
  

  });

  cities_buttons_list.forEach((city) => {
    city.addEventListener("click", async (e) => {
      const data = await fetchData(e.target.dataset.value);

    });
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