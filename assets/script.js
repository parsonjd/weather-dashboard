citySearch = document.querySelector("#city");
formSubmit = document.querySelector("#search-city");
currentCity = document.querySelector("#current-city");
currentWeather = document.querySelector("#current-weather");
fiveDay = document.querySelector("#five-day");


//My API Key
let apiKey = "b25ca6f3c40159f7eb3124b1a145f1bc"

//Accepts city from user input and pushes it cityWeather to get weather data from API
function handleForm(e) {
    e.preventDefault();
    let cityName = citySearch.value.trim();
    if (cityName) {
        cityWeather(cityName);
        fiveDayOutlook(cityName);
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
    date.innerText = " (" + moment().format("MM/DD/YY") + ")";
    currentCity.append(date);

    //Display the weather ICON
    let icon = document.createElement("img");
    icon.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    icon.setAttribute('height', "50px");
    currentCity.append(icon);

    //Display current temperature
    let currentTemp = document.createElement("p");
    currentTemp.innerText = `Temp: ${data.main.temp} \u2109`;
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
    } else if (UV.value > 2 && UV.value < 8) {
        currentUVI.classList = "moderate";
    } else {
        currentUVI.classList = "severe";
    }

    UVIdiv.append(currentUVI);
    currentWeather.append(UVIdiv);
}

//Get the five-day outlook from the API
async function fiveDayOutlook(city) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`);
    let data = await response.json();
    renderFiveDay(data);
}

//Display five-day forecast
function renderFiveDay(days) {
    fiveDay.innerText = "";
    //Increment by eight so the eight time hacks of each day are skipped over so we can get a five-day outlook
    for (let i = 1; i < days.list.length; i += 8) {
        let dayForecast = days.list[i];
        console.log(dayForecast);

        //Create div to hold each day's forecast - keeping each day a column width of 2
        let fiveDayForecast = document.createElement("div");
        fiveDayForecast.classList = "col-2 bg-primary text-light text-center each-day m-2";

        //Create and display date at top of the div
        let fiveDayDate = document.createElement("h5");
        fiveDayDate.innerText = moment(dayForecast.dt_txt).format("MM/DD/YY");
        fiveDayForecast.append(fiveDayDate);
        fiveDay.append(fiveDayForecast);

        //Create and display daily weather icon
        let dailyIcon = document.createElement("img");
        dailyIcon.classList = "text-center";
        dailyIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dayForecast.weather[0].icon}@2x.png`);
        dailyIcon.setAttribute('height', "30px");
        fiveDayForecast.append(dailyIcon);

        //Create and display daily temperature
        let dailyTemp = document.createElement("p");
        dailyTemp.classList = "text-center";
        dailyTemp.innerText = `Temp: ${dayForecast.main.temp} \u2109`;
        fiveDayForecast.append(dailyTemp);

        //Create and display wind velocity
        let dailyWind = document.createElement("p");
        dailyTemp.classList = "text-center";
        dailyWind.innerText = `Wind: ${dayForecast.wind.speed} MPH`;
        fiveDayForecast.append(dailyWind);

        //Create and display humidity
        let dailyHum = document.createElement("p");
        dailyHum.classList = "text-center";
        dailyHum.innerText = `Humidity: ${dayForecast.main.humidity} %`;
        fiveDayForecast.append(dailyHum);

    }
}

//Handles form submission
formSubmit.addEventListener("submit", handleForm);