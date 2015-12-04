function create_map (data){

  //position map to center of Beijing
  var map = L.map('leaflet-map').setView([39.952, 116.370], 11);

  console.log(data);

  for (i in data){
    data_transport = data[i]
    line_color = data_transport.color;
    dataXY = data_transport.data;

    var pointList = [];

    for (j in dataXY){
      var x = dataXY[j][0];
      var y = dataXY[j][1];
      console.log(x);
      console.log(y);

      pointList.push(L.latLng(x,y));

    }

    var path = L.polyline(pointList, {
      // color: 'blue',
      color: line_color,
      weight: 1,
      opacity: 0.5,
      smoothFactor: 1

    });
    path.addTo(map);

  }

  // API call to mapbox.com
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'maktrix.oai34h1p',
      accessToken: 'sk.eyJ1IjoibWFrdHJpeCIsImEiOiJjaWhvYmc3MDEwYXEwdGhqNzF5NHhsaXNlIn0.zCNGMBx_p9bZoKmi5JUfvg'
  }).addTo(map);

  var popup = L.popup();

  function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
  }

  map.on('click', onMapClick);

}

