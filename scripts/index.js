//*********** Responsible for controling UI elements like 'menu' ****************/
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

    // Menu events
    document.querySelector("#open-menu-button").addEventListener('click', _showMenu);
    document.querySelector("#close-menu-button").addEventListener('click', _hideMenu);

    // Hourly weather toggle
    document.querySelector("#toggle-hourly-weather").addEventListener('click', _toggleHourlyWeather);

    return {
        showApp,
        loadApp
    }
})();

//*********** Init ****************/
window.onload = function () {
    UI.showApp();
}