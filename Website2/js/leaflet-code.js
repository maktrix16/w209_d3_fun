var map = L.map('leaflet-map').setView([39.952, 116.370], 11);
var overlayMaps={};


// var modes = ['walk', 'bike', 'car', 'taxi', 'bus', 'subway']; 

//select different transport mode layer as hover over different modes
//http://stackoverflow.com/questions/12853622/hover-callback-function-with-on-and-binding
$('#tbl').on({
  mouseenter: function(){
    for (i in modes){
      if (modes[i]!=this.id && modes[i]!='all'){
        map.removeLayer(overlayMaps[modes[i]]);
      }
    }
  },
  mouseleave: function(){
    for (i in modes){
      if (modes[i]!=this.id && modes[i]!='all'){
        map.addLayer(overlayMaps[modes[i]]);
      }
    }
  } 
}, '.row-mode');


//main function for populating map objects
function create_map (data, all_data, new_map, transports){
  //position map to center of Beijing
  // console.log(data.length);
  // console.log(data);

  //remove exsiting data if only updating map (not creating new map)
  if (!new_map){
    for (i in modes){
      if (modes[i]!=this.id && modes[i]!='all'){
        map.removeLayer(overlayMaps[modes[i]]);
      }
    }
    overlayMaps={};
  }

  //plot all paths from seasonal data
  for (i in data){
    dataXY = data[i].data;
    mode_transport = data[i].name
    var paths = [];  //for storing the array of polylines

    for (j in dataXY){

      //http://stackoverflow.com/questions/24658596/hide-show-layergroups-in-leaflet-with-own-buttons
      if ($.inArray(mode_transport, transports)> -1){
        var pointList = [];

        for (k in dataXY[j]){
          var x = dataXY[j][k][0];
          var y = dataXY[j][k][1];
          // console.log(x);
          // console.log(y);
          pointList.push(L.latLng(x,y));
        }

        path = L.polyline(pointList, {
          // color: 'blue',
          color: data[i].color,
          weight: 2,
          opacity: 1,
          smoothFactor: 1
        });

        paths.push(path);
      }
    }

    //add layer for each transport mode
    overlayMaps[mode_transport] = L.layerGroup(paths);
    map.addLayer(overlayMaps[mode_transport]);
    // L.layerGroup(paths).addTo(map);
    // console.log(overlayMaps);
  }


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

