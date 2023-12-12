var earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

var myMap = L.map("map").setView([0, 0], 2);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(myMap);


fetch(earthquakeDataUrl)
    .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(function (data) {
        
        L.geoJSON(data.features, {
            pointToLayer: function (feature, latlng) {
                
                var magnitude = feature.properties.mag;
                var depth = feature.geometry.coordinates[2];
                var radius = magnitude * 5;
                var fillColor = getColor(depth);

              
                return L.circleMarker(latlng, {
                    radius: radius,
                    fillColor: fillColor,
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8,
                }).bindPopup("Magnitude: " + magnitude + "<br>Depth: " + depth);
            }
        }).addTo(myMap);

       
        createDynamicLegend();
    })
    .catch(function (error) {
        console.error('Error fetching earthquake data:', error);
    });


function getColor(depth) {
    if (depth < 10) {
        return "#4CAF50"; // Green
    } else if (depth < 50) {
        return "#FFC107"; // Yellow
    } else {
        return "#FF5722"; // Red
    }
}


function createDynamicLegend() {
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend");
        var depthColors = calculateDepthColors();

        div.innerHTML = "<h4>Earthquake Depth (km)</h4>";

        depthColors.forEach(function (color, index) {
            var from = index === 0 ? 0 : depthColors[index - 1] + 1;
            var to = depthColors[index];
            div.innerHTML += '<i style="background:' + color + '"></i> ' +
                from + (to ? "&ndash;" + to : "+") + ' km<br>';
        });

        return div;
    };

    legend.addTo(myMap);
}

function calculateDepthColors() {
 
    return [10, 50];
}

