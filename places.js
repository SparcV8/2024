
// el siguiente código ha sído tomado de:
// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete#maps_places_autocomplete-javascript



// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {
const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 4.79049749271, lng: -75.6904123677 },
    zoom: 16,
    mapTypeControl: false,
});
// éste código no utiliza algunos elementos, por ello comento las líneas:
const card = document.getElementById("pac-card");
const input = document.getElementById("pac-input");
const biasInputElement = document.getElementById("use-location-bias");
const strictBoundsInputElement = document.getElementById("use-strict-bounds");
const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
};
map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

const autocomplete = new google.maps.places.Autocomplete(input, options);

// Bind the map's bounds (viewport) property to the autocomplete object,
// so that the autocomplete requests use the current map bounds for the
// bounds option in the request.
autocomplete.bindTo("bounds", map);

const infowindow = new google.maps.InfoWindow();
//const infowindowContent = document.getElementById("infowindow-content");

//infowindow.setContent(infowindowContent);

const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
});

autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    window.alert("No details available for input: '" + place.name + "'");
    return;
    }

// aquí entregan LAT y LON en un OBJETO con propiedades:
    if (place.geometry.viewport){
    map.fitBounds(place.geometry.viewport);
// tómo LAT y LON:
    LAT = place.geometry.location.lat();
    LON = place.geometry.location.lng();
    clima(LAT, LON);
    } else {
    map.setCenter(place.geometry.location);
    map.setZoom(17);
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    //infowindowContent.children["place-name"].textContent = place.name;
    //infowindowContent.children["place-address"].textContent =
    place.formatted_address;
    infowindow.open(map, marker);
});

// Sets a listener on a radio button to change the filter type on Places
function setupClickListener(id, types){
    const radioButton = document.getElementById(id);
    radioButton.addEventListener("click", () => {
    autocomplete.setTypes(types);
    input.value = "";
    });
}

setupClickListener("changetype-all", []);
setupClickListener("changetype-address", ["address"]);
setupClickListener("changetype-establishment", ["establishment"]);
setupClickListener("changetype-geocode", ["geocode"]);
setupClickListener("changetype-cities", ["(cities)"]);
setupClickListener("changetype-regions", ["(regions)"]);
biasInputElement.addEventListener("change", () => {
    if (biasInputElement.checked) {
    autocomplete.bindTo("bounds", map);
    } else {
    // User wants to turn off location bias, so three things need to happen:
    // 1. Unbind from map
    // 2. Reset the bounds to whole world
    // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
    autocomplete.unbind("bounds");
    autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 });
    strictBoundsInputElement.checked = biasInputElement.checked;
    }

    input.value = '';
});
strictBoundsInputElement.addEventListener("change", () => {
    autocomplete.setOptions({
    strictBounds: strictBoundsInputElement.checked,
    });
    if (strictBoundsInputElement.checked) {
    biasInputElement.checked = strictBoundsInputElement.checked;
    autocomplete.bindTo("bounds", map);
    }

    input.value = "";
});
}

window.initMap = initMap;


/////// código de los compañeros:

async function clima(lat, lon) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m`);
    const data = await response.json();
    if(data.current.temperature_2m){
        let R = document.getElementById('info');
        if(data.current.temperature_2m >= 25)R.innerHTML = data.current.temperature_2m + ' <span>🌝</span>';
        else R.innerHTML = data.current.temperature_2m + ' <span>🥶</span>';
        }
  }
  
  
  
