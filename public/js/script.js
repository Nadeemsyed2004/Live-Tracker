
// Watch user's location and send to server
const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Sending location:", { latitude, longitude }); // Debugging
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}


// Initialize map
const map = L.map("map").setView([0, 0], 20);

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "nadeem",
}).addTo(map);

// Keep track of markers by client ID
const markers = {};

// Listen for location updates from the server
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // Check if marker already exists for this client ID
    if (markers[id]) {
        // Update the position of the existing marker
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker for this client ID
        markers[id] = L.marker([latitude, longitude]).addTo(map).bindPopup(`User: ${id}`)
        .openPopup();;
    }

    // Optionally set the map view to the latest location
    map.setView([latitude, longitude], 20);
});

socket.on("user-disconnect",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
})