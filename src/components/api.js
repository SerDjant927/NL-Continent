export function getCityList() {
    return fetch('https://nlstar.com/api/catalog3/v1/city/?country=ru&term=Новосибирск')
        .then(response => response.json())
        .then(data => data.map(city => city.name))
        .catch(error => console.error(error));
}

export function getFilteredCategories(cityId) {
    return fetch(`https://nlstar.com/ru/api/catalog3/v1/menutags/?city_id=${cityId}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}