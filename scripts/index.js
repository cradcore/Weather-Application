//*********** Responsible for controling UI elements like 'menu' ****************/
const UI = (function() {

    const showApp = () => {
        document.querySelector('#app-loader').classList.add('display-none');
        document.querySelector('main').removeAttribute('hidden')
    };

    const loadApp = () => {
        document.querySelector('#app-loader').classList.remove('display-none');
        document.querySelector('main').setAttribute('hidden', 'true');
    };

    return {
        showApp,
        loadApp
    }
})();

//*********** Init ****************/
window.onload = function() {
    UI.showApp();
}