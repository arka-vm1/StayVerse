maptilersdk.config.apiKey = mapToken;
console.log(listing.location);

const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: "streets-v2", // Style URL
    center: listing.geometry.coordinates, // Coordinates [Longitude, Latitude]
    zoom: 12, // Zoom Level
});

const marker = new maptilersdk.Marker({
    color: "#fe424d",
}).setLngLat(listing.geometry.coordinates).setPopup(new maptilersdk.Popup({offset: 25}).setHTML(`<h5>${listing.title}</h5><p>${listing.geometry.coordinates}</p>`)).addTo(map);
