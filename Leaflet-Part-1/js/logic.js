//api to query using url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//map creation 
let myMap = L.map("map", {
  center: [
      37.09, -95.71
  ],
  zoom: 5,
  
});

//adding the title and the attributes  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(myMap);

//get requests to make sure it runs
d3.json(queryUrl).then(function(data){
  //process the data and color depth 
  var earthquakeData = data.features;
  function getColor(depth){
    switch (true) {
      case depth > 90:
          return "#d73027";
        case depth > 70: 
          return "#fc8d59"; 
        case depth > 50:
          return "#fee08b";
        case depth > 30:
          return "#d9ef8b";
        case depth > 10:
          return "#91cf60";
        default:
          return "#1a9850";
  }
}

//markers based on magnitude size and color
function getMarker (magnitude,depth){
  return{
    radius: magnitude * 4,
    fillColor: getColor(depth),
    color:"red",
    weight: 1,
    opacity:1
  };
}
//loop through earthquake data  
earthquakeData.forEach(function(earthquake){
  var coordinates = earthquake.geometry.coordinates;
  var magnitude = earthquake.properties.mag;
  var depth = coordinates[2];
  
  var markerOpt = getMarker(magnitude,depth);
  //create pop up markers
  var marker = L.circleMarker([coordinates[1],coordinates[0]],markerOpt).bindPopup(`<h3>${earthquake.properties.place}<h3><hr><p>${new Date(earthquake.properties.time)}</p><hr><p>${earthquake.properties.mag}</p>`).addTo(myMap);
});
var myColors = ["#d73027", "#fc8d59", "#fee08b", "#d9ef8b", "#91cf60", "#1a9850"];
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ["<div style='background-color: lightgray'><strong>&nbsp&nbspDepth (km)&nbsp&nbsp</strong></div>"];
    categories = ['+90', ' 70-90', ' 50-70', ' 30-50', ' 10-30', '-10-10'];
    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            labels.push(
                '<li class="circle" style="background-color:' + myColors[i] + '">' + categories[i] + '</li> '
            );
    }
    div.innerHTML = '<ul style="list-style-type:none; text-align: center">' + labels.join('') + '</ul>'
    return div;
};
legend.addTo(myMap);
});


