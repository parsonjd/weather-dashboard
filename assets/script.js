citySearch = document.querySelector("#city");
formSubmit = document.querySelector("#search-city");
currentCity = document.querySelector("#current-city");
currentWeather = document.querySelector("#current-weather");


//My API Key
let apiKey = "b25ca6f3c40159f7eb3124b1a145f1bc"

//Accepts city from user input and pushes it cityWeather to get weather data from API
function handleForm(e) {
    e.preventDefault();
    let cityName = citySearch.value.trim();
    if (cityName) {
        cityWeather(cityName);
    } else {
        alert("Please include a city in your search!")
    }
    citySearch.value = "";
}

//Fetches weather data from API and passes off to display on the page
async function cityWeather(city) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
    let data = await response.json();
    renderWeather(data, city);

}

//Displays the weather data
function renderWeather(data, city) {
    currentWeather.innerText = "";
    currentCity.innerText = city;

    //Display today's date
    let date = document.createElement("span");
    date.innerText = " (" + moment().format("MMM D, YYYY") + ")";
    currentCity.append(date);

    //Display the weather ICON
    let icon = document.createElement("img");
    icon.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    icon.setAttribute('height', "50px");
    currentCity.append(icon);

    //Display current temperature
    let currentTemp = document.createElement("p");
    currentTemp.innerText = `Temp: ${data.main.temp}`;
    currentWeather.append(currentTemp);
    let currentWind = document.createElement("p");

    //Display current wind velocity
    currentWind.innerText = `Wind: ${data.wind.speed} MPH`;
    currentWeather.append(currentWind);
    let currentHumid = document.createElement("p");

    //Display current humidity
    currentHumid.innerText = `Humidity: ${data.main.humidity} %`;
    currentWeather.append(currentHumid);
    let latitude = data.coord.lat;
    let longitude = data.coord.lon;

    //Pass lon/lat to UVindex function to get UV data from API call
    uvIndex(latitude, longitude);
}

//Fetch UV data from API and pass to function to display
async function uvIndex(latitude, longitude) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    let data = await response.json();
    console.log(data);
    renderUVIndex(data);
}

//Displays UV index on page
function renderUVIndex(UV) {
    let UVIdiv = document.createElement("p");
    UVIdiv.innerText = `UV Index: `;
    let currentUVI = document.createElement("button");
    currentUVI.innerText = UV.value;

    //Determines if the UV button is red/yellow/green based off EPA guidelines on UV index severity
    if (UV.value <= 2) {
        currentUVI.classList = "favorable";
    } else if (UV.index > 2 && UV.index < 8) {
        currentUVI.classList = "moderate";
    } else {
        currentUVI.classList = "severe";
    }

    UVIdiv.append(currentUVI);
    currentWeather.append(UVIdiv);
}

//Handles form submission
formSubmit.addEventListener("submit", handleForm);