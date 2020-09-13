//source1 = all earthquakes from the past 7 days (https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson)
var earthquakeUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//source2 = tectonic plates from https://github.com/fraxen/tectonicplates
var tectonicUrl="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

//main createMap function
function createMap(earthquakes) {
  // Adding tile layers
  var satellite=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  var grayscale=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var outdoor=L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });
  
  // Create a baseMaps object
  var baseMaps = {
    Satellite: satellite,
    Grayscale: grayscale,
    Outdoors: outdoor
    };
  
  // Create overlayMaps 
  var overlayMaps = {
    "Fault Lines": tectonic,
    Earthquakes: earthquakes
    };
    
  // Creating map object
  var myMap = L.map("map", {
    center: [39.5501, -105.7821],
    zoom: 3,
    layers:[satellite,tectonic]
  });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

  // Set up the earthquake legend
  var legend=L.control({position:"bottomright"});
  legend.onAdd=function(map) {
    var div = L.DomUtil.create("div","legendInfo");
    var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
    for (var i=0;i<labels.length;i++) {
      var spacing=23*i;
      div.innerHTML+="<div class=\"legendItem\" style=\"bottom:"+spacing+"px\">"+
      "<i style=\"background-color:"+color[i]+"\"></i>"+
      "&nbsp;&nbsp;"+labels[i]+"</div><br>";
    }
    return div;
  };
  legend.addTo(myMap);
}

// earthquake colorscale function
var color=["#b7f34d","#e1f34d","#f3db4d","#f3ba4d","#f0a76b","#f06b6b"];

function colorScale(earthquakeLvl) {
  if (earthquakeLvl<=1) {
    return color[0];
  }
  else if (earthquakeLvl<=2) {
    return color[1];
  }
  else if (earthquakeLvl<=3) {
    return color[2];
  }
  else if (earthquakeLvl<=4) {
    return color[3];
  }
  else if (earthquakeLvl<=5) {
    return color[4];
  }
  else {
    return color[5]; 
  } 
}

// function to grab the earthquake marker and pass to createMap
function earthquakeMarker(response) {
  var earthquakes=response.features;
  var earthquake=[];
  for (let i=0;i<earthquakes.length;i++) {
    var lat=earthquakes[i].geometry.coordinates[1];
    var lng=earthquakes[i].geometry.coordinates[0];
    var circ=L.circle([lat,lng], {
      weight:0,
      fillColor: colorScale(earthquakes[i].properties.mag),
      fillOpacity:1,
      radius:  earthquakes[i].properties.mag*12000
    }).bindPopup("<h3>"+earthquakes[i].properties.place+
    "</h3><hr><p><strong>magnitude</strong> - "+earthquakes[i].properties.mag+
    "<br><strong>time</strong> - "+new Date(earthquakes[i].properties.time)+"</p>");
    earthquake.push(circ);
  }
  createMap(L.layerGroup(earthquake));
}

//getting tectonic data
tectonicLayer=[];
d3.json(tectonicUrl, function(data) {
  tectonic=L.geoJson(data,{
    style: {
      color:"#f3ba4d",
      fillOpacity:0,
      weight: 1.5
    }
  })
})
//creating the tectonic layer group
var tectonic=L.layerGroup(tectonicLayer);

//getting earthquake data
d3.json(earthquakeUrl,earthquakeMarker);