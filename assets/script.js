citySearch = document.querySelector("#city");
formSubmit = document.querySelector("#search-city");

let apiKey = "b25ca6f3c40159f7eb3124b1a145f1bc"

function handleForm(e) {
    e.preventDefault();
    let cityName = citySearch.value.trim();
    if (cityName) {
        cityWeather(cityName);
    } else {
        alert("Please include a city in your search!")
    }

}

async function cityWeather(city) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    let data = await response.json();
    console.log(data);
}

formSubmit.addEventListener("submit", handleForm);

