var USGS_API = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log(USGS_API)
var USGS_Plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log(USGS_Plates)

function markerSize(magnitude) {
    return magnitude * 4;
};


var earthquakes = new L.LayerGroup();

d3.json(USGS_API, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(geoJsonPoint.properties.mag)
            });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

var platesBorder = new L.LayerGroup();

d3.json(USGS_Plates, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 3,
                color: 'red'
            }
        },
    }).addTo(platesBorder);
})


function Color(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'orangered'
    } else if (magnitude > 3) {
        return 'orange'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};

function createMap() {

    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: 'pk.eyJ1IjoiY3NlbGxpb3R0IiwiYSI6ImNrMmhwN3Z0ZzA2OXozY29oOGh4ZW84bmwifQ.Lyq4prMgPCgkqqRFbDZ3sA'
    });


    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1IjoiY3NlbGxpb3R0IiwiYSI6ImNrMmhwN3Z0ZzA2OXozY29oOGh4ZW84bmwifQ.Lyq4prMgPCgkqqRFbDZ3sA'
    });


    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoiY3NlbGxpb3R0IiwiYSI6ImNrMmhwN3Z0ZzA2OXozY29oOGh4ZW84bmwifQ.Lyq4prMgPCgkqqRFbDZ3sA'
    });

    // L.ALKMaps.setApiKey("YourAPIKey");
    // var weather = L.ALKMaps.Layer.weatherRadar({
    //     display: "satellite",
    //     opacity: 0.75
    // });




    var baseLayers = {
        "High Contrast": highContrastMap,
        "Dark": darkMap,
        "Satellite": satellite,
        // "weather": weather
    };

    var overlays = {
        "Earthquakes": earthquakes,
        "Plate Boundaries": platesBorder,
    };

    var mymap = L.map('mymap', {
        center: [40, -99],
        zoom: 4.3,

        layers: [satellite, earthquakes, platesBorder]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);


    var legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);

    // If I get time then work on this.


    // var videoUrls = [
    //     'https://www.wunderground.com/maps/satellite/regional-infrared'
    // ];


    // var bounds = L.latLngBounds([
    //     [
    //         [50.7124, -127.4604],
    //         [18.9712, -72.2852]
    //     ]
    // ]);


    // var videoOverlay = L.videoOverlay(videoUrls, bounds, {
    //     opacity: 0.8
    // }).addTo(mymap);


    // L.rectangle(bounds).addTo(mymap);
    // mymap.fitBounds(bounds);


}

// createMap()