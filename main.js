let apiKey = "bf1d4cbf377000a442b993d50563f39f";
let wrapper = document.querySelector(".wrapper")
let city = document.querySelector(".city-span");
let searchCity = document.querySelector(".search-input");
let loupe = document.querySelector(".loupe");
let currentLocation = document.querySelector(".btn");
let reset = document.querySelector("#reset");
let attributeImg = "";

function showCurrentTime() {
    let today = new Date();
    let time = today.toLocaleTimeString().slice(0,-3);
    let todayDate = today.toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    document.querySelector(".time-span").innerHTML = time;
    document.querySelector(".date-span").innerHTML = todayDate;

    let hour = today.getHours()
    switch (true) {
        case (hour >= 6 && hour < 12):
            wrapper.classList.add("morning");
            break;
        case (hour >= 12 && hour < 18):
            wrapper.classList.add("afternoon");
            break;
        case (hour >= 18 && hour < 23):
            wrapper.classList.add("evening");
            break;
        case (hour >= 0 && hour < 6):
            wrapper.classList.add("night");
            break;
    }
}

function getNewRequest(city) {
    let requestCity;
    if (searchCity.value) {
        requestCity = searchCity.value;
    } else requestCity = "Киев";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${requestCity}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let lon = data.coord.lon;
            let lat = data.coord.lat;
            showWeatherInfo(lon, lat);
        })
        .catch(error => alert("Введите корректное название города"))
}

function showWeatherInfo(lon, lat) {
    showTodayWeather(lon, lat);
    showWeekWeather(lon, lat);
}
function showTodayWeather(lon, lat) {
    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            let temperature = document.querySelector(".temperature-span");
            let weatherText = document.querySelector(".weather-icon-span");
            let maxTemp = document.querySelector(".max-temp");
            let minTemp = document.querySelector(".min-temp");
            let temFeelsLike = document.querySelector(".temp-feels-span");
            let humidity = document.querySelector(".humidity-span");
            let windSpeed = document.querySelector(".wind-speed-span")

            city.innerHTML = data.name;
            temperature.innerHTML = data.main.temp.toFixed(1) + "&#176";
            weatherText.innerHTML = data.weather[0].main;
            maxTemp.innerHTML = data.main.temp_max.toFixed(1) + "&#176";
            minTemp.innerHTML = "/" + data.main.temp_min.toFixed(1) + "&#176";
            temFeelsLike.innerHTML = data.main.feels_like.toFixed(1) + "&#176";
            humidity.innerHTML = Math.round(data.main.humidity) + " %";
            windSpeed.innerHTML = Math.round(data.wind.speed) + " m/s";

            showIcons(data, 0);
        })
}

function showWeekWeather(lon, lat) {
    let weekWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(weekWeatherUrl)
        .then(response => response.json())
        .then(data => {
            let allNextDays = document.querySelectorAll(".day-container");
            let indexDay = 8;
            allNextDays.forEach(day => {
                let nextDaysName = new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(new Date(data.list[indexDay].dt * 1000));
                day.querySelector(".day").innerHTML = nextDaysName;

                day.querySelector(".temp-span").innerHTML = data.list[indexDay].main.temp.toFixed(1) + "&#176";

                let attributeImg = showIcons(data, indexDay);
                day.querySelector(".day-icon-img").setAttribute("src", attributeImg);

                indexDay += 8;
            })
        })
}
function showIcons(data, index) {
    let weatherDescription;
    let todayIcon = document.querySelector("#today-weather-icon");

    if (data.list) {
        weatherDescription = data.list[index].weather[0].id;
        attributeImg = choiceIcon(weatherDescription);
        return attributeImg;
    } else {
        weatherDescription = data.weather[0].id;
        attributeImg = choiceIcon(weatherDescription)
        todayIcon.setAttribute("src", `${attributeImg}`);
    }
}
function choiceIcon(id) {
    switch (true) {
        case (id == "800"):
            attributeImg = "../weather/img/sun.png";
            break;
        case (id == "801"):
            attributeImg = "../weather/img/cloudy-sun.png";
            break;
        case (id >= "802" && id <= "804"):
            attributeImg = "../weather/img/cloud.png";
            break;
        case (id >= "500" && id <= "531"):
            attributeImg = "../weather/img/rain.png";
            break;
        case (id >= "200" && id <= "238" || id >= "300" && id <= "321"):
            attributeImg = "../weather/img/storm.png";
            break;
        case (id >= "600" && id <= "622"):
            attributeImg = "../weather/img/snow.png";
            break;
        case (id >= "701" && id <= "781"):
            attributeImg = "../weather/img/mist.png";
            break;
    }
    return attributeImg;
}


searchCity.addEventListener("keydown", function(e) {
    if (e.code == "Enter") {
        getNewRequest()
    }
    loupe.addEventListener("click", getNewRequest);
})
reset.addEventListener("click", function() {
    getNewRequest();
    showCurrentTime();
})
currentLocation.addEventListener("click", function() {
    navigator.geolocation.getCurrentPosition(showPosition, handleError, { enableHighAccuracy: true, timeout: 2000, maximumAge: 3000 })
})
function showPosition(position) {
    let lon = position.coords.longitude;
    let lat = position.coords.latitude;
    showTodayWeather(lon, lat);
    showWeekWeather(lon, lat);
}

function handleError(error) {
    switch (error.code) {
        case 0:
            alert("При попытке определить местоположение возникала ошибка: " + error.message);
            break;
        case 1:
            alert("Пользователь запретил получение данных о местоположении." );
            break;
        case 2:
            alert("Браузеру не удалось определить местоположение.");
            break;
        case 3:
            alert("Истекло доступное время ожидания.");
            break;
    }
}

showCurrentTime()
getNewRequest("Киев");