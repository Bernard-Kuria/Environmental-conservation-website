'use strict'
console.log('Hi');
if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(function(position){
const {latitude} = position.coords;
const {longitude} = position.coords;
console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

const coords = [latitude, longitude];

const map = L.map('map').setView([latitude, longitude], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([latitude, longitude]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();

    map.on('click', function(mapEvent){
        console.log(mapEvent);
        const{lat,lng} = mapEvent.latlng;

        L.marker([lat,lng]).addTo(map).bindPopup('location').openPopup();
    });
},
function(){
    alert('Could not get your location');
});