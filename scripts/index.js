//*********** Menu and lower panel module ****************/
const UI = (function () {
    let menu = document.querySelector('#menu-container');

    // Hide the loading screen and show the app
    const showApp = () => {
        document.querySelector("#app-loader").classList.add('display-none');
        document.querySelector("main").removeAttribute('hidden')
    };

    // Hide the app and show the loading screen
    const loadApp = () => {
        document.querySelector("#app-loader").classList.remove('display-none');
        document.querySelector("main").setAttribute('hidden', 'true');
    };

    // Show menu
    const _showMenu = () => menu.style.right = 0;

    // Hide menu
    const _hideMenu = () => menu.style.right = '-65%';

    // Toggles the hourly weather panel
    const _toggleHourlyWeather = () => {
        let hourlyWeather = document.querySelector("#hourly-weather-wrapper"),
            arrow = document.querySelector("#toggle-hourly-weather").children[0],
            visible = hourlyWeather.getAttribute('visible'),
            dailyWeather = document.querySelector("#daily-weather-wrapper");

        if (visible == 'true') {
            hourlyWeather.setAttribute('visible', 'false');
            hourlyWeather.style.bottom = '-100%';
            arrow.style.transform = "rotate(0deg)";
            dailyWeather.style.opacity = 1;

        }
        else {
            hourlyWeather.setAttribute('visible', 'true');
            hourlyWeather.style.bottom = 0;
            arrow.style.transform = "rotate(180deg)";
            dailyWeather.style.opacity = 0;
        }

    };

    const drawWeatherData = (data, location) => {

        // Set location labels
        let currentData = data.currently;
        document.querySelectorAll(".location-label").forEach((e) => {
            e.innerHTML = location;
        });

        // Change background
        document.querySelector('main').style.backgroundImage = 'url(./assets/images/bg-images/' + currentData.icon + '.jpg)';
        // Set the icon
        document.querySelector("#current-icon").setAttribute('src', './assets/images/summary-icons/' + currentData.icon + '-white.png');
        // Set the degrees label
        document.querySelector("#degrees-label").innerHTML = Math.round(currentData.temperature) + '&#176';
        // Set the summary label
        document.querySelector("#summary-label").innerHTML = currentData.summary;
        // Set humidity
        document.querySelector("#humidity-label").innerHTML = Math.round(currentData.humidity * 100) + '%';
        // Set wind speed
        document.querySelector("#wind-speed-label").innerHTML = (currentData.windSpeed).toFixed(1) + 'mph';

        // Set daily weather panel
        let dailyData = data.daily.data,
            hourlyData = data.hourly.data,
            weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dailyWeatherWrapper = document.querySelector("#daily-weather-wrapper"),
            dailyWeatherModel,
            day,
            maxMinTemp,
            dailyIcon;
        while (dailyWeatherWrapper.children[1]) {
            dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1]);
        }
        for (let i = 0; i <= 6; i++) {
            // Clone and remove display none
            dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
            dailyWeatherModel.classList.remove('display-none');

            // Set the date
            day = weekDays[new Date(dailyData[i].time * 1000).getDay()];
            dailyWeatherModel.children[0].children[0].innerHTML = day;

            // Set max and min temp
            maxMinTemp = Math.round((dailyData[i].temperatureMax)) + '&#176; / ' + Math.round((dailyData[i].temperatureMin)) + '&#176;';
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;

            // Set daily icon
            dailyIcon = dailyData[i].icon;
            dailyWeatherModel.children[1].children[1].setAttribute('src', './assets/images/summary-icons/' + dailyIcon + '-white.png');

            // Add day
            dailyWeatherWrapper.appendChild(dailyWeatherModel);
        }

        dailyWeatherWrapper.children[1].classList.add('current-day');

        // Set hourly weather wrapper
        let hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper"),
            hourlyWeatherModel,
            hourlyIcon;
        while (hourlyWeatherWrapper.children[1]) {
            hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1]);
        }
        for (let i = 0; i < 24; i++) {
            // Clone and remove display-none
            hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
            hourlyWeatherModel.classList.remove('display-none')

            // Set hour
            hourlyWeatherModel.children[0].children[0].innerHTML = new Date(hourlyData[i].time * 1000).getHours() + ":00";

            // Set termperature
            hourlyWeatherModel.children[1].children[0].innerHTML = Math.round(hourlyData[i].temperature) + '&#176;'

            // Set icon
            hourlyIcon = hourlyData[i].icon;
            hourlyWeatherModel.children[1].children[1].children[0].setAttribute('src', './assets/images/summary-icons/' + hourlyIcon + '-grey.png');

            // Append model
            hourlyWeatherWrapper.appendChild(hourlyWeatherModel)
        }

        UI.showApp();
    };

    // Menu events
    document.querySelector("#open-menu-button").addEventListener('click', _showMenu);
    document.querySelector("#close-menu-button").addEventListener('click', _hideMenu);

    // Hourly weather toggle
    document.querySelector("#toggle-hourly-weather").addEventListener('click', _toggleHourlyWeather);

    return {
        showApp,
        loadApp,
        drawWeatherData
    }
})();


//*********** Get location module ****************/
const GETLOCATION = (function () {

    let location;

    const locationInput = document.querySelector("#location-input"),
        addCityButton = document.querySelector("#add-city-button");

    const _addCity = () => {
        location = locationInput.value.trim();
        locationInput.value = '';
        addCityButton.setAttribute('disable', 'true');
        addCityButton.classList.add('disable');
        WEATHER.getWeather(location, true);
    };


    locationInput.addEventListener('input', function () {
        let inputText = this.value.trim();
        if (inputText != '') {
            addCityButton.removeAttribute('disable');
            addCityButton.classList.remove('disable');
        } else {
            addCityButton.setAttribute('disable', 'true');
            addCityButton.classList.add('disable');
        }
    })

    addCityButton.addEventListener('click', _addCity);
})();


//*********** Get weather data module ****************/
const WEATHER = (function () {
    const darkSkyKey = '0c6edb67c3b77ecfbb0e6c5fa92ece5d',
        openCageDataKey = 'b1ddc25b55724b6f85d9a057239ad30c';

    const _getGeocodeURL = (location) => 'https://api.opencagedata.com/geocode/v1/json?q=' + location + '&key=' + openCageDataKey;

    const _getDarkSkyURL = (lat, long) => 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + darkSkyKey + '/' + lat + ',' + long;

    const _getDarkSkyData = (url, location) => {
        axios.get(url)
            .then((res) => {
                UI.drawWeatherData(res.data, location);
            })
            .catch((err) => {
                console.error(err);
            })
    };

    const getWeather = (location, save) => {
        UI.loadApp();
        let geocodeURL = _getGeocodeURL(location);

        axios.get(geocodeURL)
            .then((res) => {
                if (res.data.results.length == 0) {
                    console.error("Invalid location");
                    UI.showApp();
                    return;
                }
                if (save) {
                    LOCALSTORAGE.save(location);
                    SAVEDCITIES.drawCity(location);
                }


                let lat = res.data.results[0].geometry.lat;
                let long = res.data.results[0].geometry.lng;

                let darkSkyURL = _getDarkSkyURL(lat, long);
                _getDarkSkyData(darkSkyURL, location);
            })
            .catch((err) => {
                console.error(err);
            })
    };

    return {
        getWeather
    }
})();

//*********** Local storage module ****************/
const LOCALSTORAGE = (function () {

    let savedCities = [];

    const save = (cityName) => {
        savedCities.push(cityName);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }

    const get = () => {
        if (localStorage.getItem('savedCities') != null)
            savedCities = JSON.parse(localStorage.getItem('savedCities'))
    }

    const remove = (index) => {
        if (savedCities.length > index) {
            savedCities.splice(index, 1);
            localStorage.setItem('savedCities', JSON.stringify(savedCities));
        }
    }

    const getSavedCities = () => savedCities;

    return {
        save,
        get,
        remove,
        getSavedCities
    }

})();

//*********** Saved cities module ****************/
const SAVEDCITIES = function () {
    let container = document.querySelector("#saved-locations-wrapper");

    const drawCity = (city) => {
        let cityBox = document.createElement('div'),
            cityWrapper = document.createElement('div'),
            deleteWrapper = document.createElement('div'),
            cityTextNode = document.createElement('h1'),
            deleteButton = document.createElement('button');

        cityBox.classList.add('saved-locations-box', 'flex-container');
        cityTextNode.innerHTML = city;
        cityTextNode.classList.add('set-city');
        cityWrapper.classList.add('ripple', 'set-city');
        cityWrapper.append(cityTextNode);
        cityBox.append(cityWrapper);

        deleteButton.classList.add('ripple', 'remove-saved-location');
        deleteButton.innerHTML = '-';
        deleteWrapper.append(deleteButton);
        cityBox.append(deleteWrapper);

        container.append(cityBox);
    };

    const _deleteCity = (cityHTMLButton) => {
        let nodes = Array.prototype.slice.call(container.children),
            cityWrapper = cityHTMLButton.closest('.saved-locations-box'),
            cityIndex = nodes.indexOf(cityWrapper);
        LOCALSTORAGE.remove(cityIndex);
        cityWrapper.remove();
    };

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-saved-location'))
            _deleteCity(event.target);
        else if (event.target.classList.contains('set-city')) {
            let nodes = Array.prototype.slice.call(container.children),
                cityWrapper = event.target.closest('.saved-locations-box'),
                cityIndex = nodes.indexOf(cityWrapper),
                savedCities = LOCALSTORAGE.getSavedCities();

            WEATHER.getWeather(savedCities[cityIndex], false);

        }
    })

    return {
        drawCity
    }
}();

//*********** Init ****************/
window.onload = function () {
    LOCALSTORAGE.get();
    let cities = LOCALSTORAGE.getSavedCities();
    if (cities.length != 0) {
        cities.forEach( (city) => SAVEDCITIES.drawCity(city));
        WEATHER.getWeather(cities[cities.length - 1], false);
    }
    else UI.showApp();
}