// Creating map object
var myMap = L.map("map", {
    center: [39.5501, -105.7821],
    zoom: 5
});
  
// Adding light map tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
}).addTo(myMap);
  
//source = all earthquakes from the past 7 days (https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson)
var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// colorscale function
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

// Grabbing GeoJSON data
d3.json(url, function(response) {
  var earthquake=response.features;
  for (i=0;i<earthquake.length;i++) {
    var lat=earthquake[i].geometry.coordinates[1];
    var lng=earthquake[i].geometry.coordinates[0];
    L.circle([lat,lng], {
      color: 'black',
      weight:0.2,
      fillColor: colorScale(earthquake[i].properties.mag),
      fillOpacity:1,
      radius:  earthquake[i].properties.mag*12000
    }).bindPopup("<h3>"+earthquake[i].properties.place+
    "</h3><hr><p><strong>magnitude</strong> - "+earthquake[i].properties.mag+
    "<br><strong>time</strong> - "+new Date(earthquake[i].properties.time)+"</p>")
    .addTo(myMap)};
  
  // Set up the legend
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
})