var map = L.map('leaflet-map').setView([39.952, 116.370], 11);
var overlayMaps={};

// MUST CHANGE....
var modes = ['walk', 'bike', 'car', 'taxi', 'bus', 'subway'];

$(".mode").click(function(event) {
    event.preventDefault();
    if(map.hasLayer(overlayMaps[this.id])) {
        $(this).removeClass('selected');
        map.removeLayer(this.id);
    } else {
        map.addLayer(overlayMaps[this.id]);        
        $(this).addClass('selected');
   }
   console.log('hello')
});





// $(".mode").hover(function(event) { //mouse hover-in
//   // event.preventDefault();
//   // if(map.hasLayer(overlayMaps[this.id])) {
//     // $(this).removeClass('selected');
//     console.log(overlayMaps['walk']);
//     map.removeLayer(overlayMaps['walk']);

//     for (i in modes){
//       // console.log(modes[i]);
//       // console.log(this.id);
//       if (modes[i]!=this.id){
//         map.removeLayer(overlayMaps[modes[i]]);
//         map.removeLayer(overlayMaps[this.id]);
//         // console.log(map);
//       }
//     // }

//   }}, function(event){ //mouse hover-away
//     console.log('hover-away');

//   // else {
//   //   map.addLayer(overlayMaps[this.id]);        
//   //   $(this).addClass('selected');
//   // }
// });

//main function for populating map objects
function create_map (data, new_map, transports){
  //position map to center of Beijing
  // console.log(data.length);
  // console.log(data);

  for (i in data){

    dataXY = data[i].data;
    mode_transport = data[i].name
    var paths = [];  //for storing the array of polylines

    // console.log(transports);
    // console.log(transport_data);
    // console.log($.inArray(transport_data, transports)> -1)

    //http://stackoverflow.com/questions/24658596/hide-show-layergroups-in-leaflet-with-own-buttons

    if ($.inArray(mode_transport, transports)> -1){
      var pointList = [];

      for (j in dataXY){
        var x = dataXY[j][0];
        var y = dataXY[j][1];
        // console.log(x);
        // console.log(y);

        pointList.push(L.latLng(x,y));

      }

      path = L.polyline(pointList, {
        // color: 'blue',
        color: data[i].color,
        weight: 1,
        opacity: 0.5,
        smoothFactor: 1
      });

      paths.push(path);
    }

    //add layer for each transport mode
    overlayMaps[mode_transport] = L.layerGroup(paths);
    L.layerGroup(paths).addTo(map);
    // console.log(overlayMaps);
  }

  // L.control.layers(overlayMaps).addTo(map); 


  //   if ($.inArray(transport_mode, transports)> -1){
  //     var pointList = [];

  //     for (j in dataXY){
  //       var x = dataXY[j][0];
  //       var y = dataXY[j][1];
  //       // console.log(x);
  //       // console.log(y);

  //       pointList.push(L.latLng(x,y));

  //     }

  //     var path = L.polyline(pointList, {
  //       // color: 'blue',
  //       color: data[i].color,
  //       weight: 1,
  //       opacity: 0.5,
  //       smoothFactor: 1

  //     });
  //     path.addTo(map);

  //   }
  // }





  // API call to mapbox.com
  var MAPBOX_URL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
  var MAPBOX_ATTRIBUTION = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
  var MAPBOX_ID = 'maktrix.oai34h1p'
  var MAPBOX_ACCESS_TOKEN = 'sk.eyJ1IjoibWFrdHJpeCIsImEiOiJjaWhvYmc3MDEwYXEwdGhqNzF5NHhsaXNlIn0.zCNGMBx_p9bZoKmi5JUfvg'

  L.tileLayer(MAPBOX_URL, {
      attribution: MAPBOX_ATTRIBUTION,
      maxZoom: 18,
      id: MAPBOX_ID,
      accessToken: MAPBOX_ACCESS_TOKEN
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

