
// $("#sl1").sparkline([5,6,7,9,9,5,3,2,2,4,6,7,1,2,2,5,4,2,21,7,8], {type: 'line'}); 

var modes = ['walk', 'bike', 'car', 'taxi', 'bus', 'subway', 'all']; 

// var seasons = ['2008-2', '2008-3', '2008-4', '2009-1', '2009-2', '2009-3'];
var seasons = ['all','2009-2', '2009-3', '2008-4', '2009-1'];
var mode_colors = {'walk': '#fbb4ae', 'bike': '#b3cde3', 'car': '#ccebc5', 'taxi': '#decbe4', 'bus': '#fed9a6', 'subway': '#ffffcc'};
var season_index = 0; //start at the all option
display();
// plot_xy(data_xy[seasons[season_index]]);  //REMOVE LATER


// create_map(data_xy[seasons[season_index]]);
create_map(data_xy2[seasons[season_index]], true, modes);

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function next() {
  if (season_index >= 3) {
    season_index = 4;
    $("#btn_fwd").prop('disabled', true);
  }
  else{
    season_index += 1;
    $("#btn_back").prop('disabled', false);
  }

  display();
  // plot_xy(data_xy[seasons[season_index]]); //REMOVE LATER

// create_map(data_xy[seasons[season_index]]);
  create_map(data_xy2[seasons[season_index]], false, modes);

}

function back() {
  if (season_index <= 1) {
    season_index = 0;
    $("#btn_back").prop('disabled', true);
  }
  else{
    season_index -= 1;
    $("#btn_fwd").prop('disabled', false);
  }

  display();
  // plot_xy(data_xy[seasons[season_index]]); //REMOVE LATER

// create_map(data_xy[seasons[season_index]]);
  create_map(data_xy2[seasons[season_index]], false, modes);

}

function update() {
  season_index = parseInt($('input[name="dropdown1"]:checked').val());
  
  if (season_index >= 4) {
    $("#btn_fwd").prop('disabled', true);
    $("#btn_back").prop('disabled', false);
  }
  else if (season_index <= 0) {
    $("#btn_back").prop('disabled', true);
    $("#btn_fwd").prop('disabled', false);
  }
  else{
    $("#btn_fwd").prop('disabled', false);
    $("#btn_back").prop('disabled', false);
  }

  display();
  // plot_xy(data_xy[seasons[season_index]]); //REMOVE LATER

// create_map(data_xy[seasons[season_index]]);
  create_map(data_xy2[seasons[season_index]], false, modes);

}

function display() {
  $('#tbl tbody').html('');
  // $("#dropdown1").val();
  $("input[name='dropdown1']").parent('.btn').removeClass('active');
  $("input[name='dropdown1'][value=" + season_index.toString() + "]").parent('.btn').addClass('active');

   //.attr('checked', '');

  var season = seasons[season_index];
  paths_count = 0
  for (var mode in data[season]) {
    if (mode != 'all') {
      paths_count += data[season][mode]['paths'];
    }
  }

  for (var i in modes) {
    mode = modes[i];


    // if (mode in data[season]) {
    data_ = data[season][mode];
    avg_dist = (data_['distance'] / data_['paths'] / 1000.).toFixed(1) + '<span style="color:gray;font-size:x-small"> km</span>';
    avg_dur = (data_['duration'] / data_['paths']).toFixed(1) + '<span style="color:gray;font-size:x-small"> min</span>';
    path_pct = data_['paths']; // / paths_count;
    hourly = data_['hourly'].join();
    // }
    // else{
    //   path_pct = 'N/A';
    //   avg_dist = 'N/A';
    //   avg_dur = 'N/A';
    //   hourly = '';
    // }

    if (mode != 'all') {
      //arthur changes START
      html = '<tr class="row-mode" id=' + mode + '><td> <i class="fa fa-minus" style="color:' + mode_colors[mode] + '"></i> ' + capitalize(mode) + '</td>';
      // html = '<tr><td> <i class="fa fa-circle" style="color:' + mode_colors[mode] + '"></i> ' + capitalize(mode) + '</td>';
      // arthur changes END

      html += '<td><span style="font-size: x-small" data-toggle="tooltip" title="' + (100 * path_pct / paths_count).toFixed(0) + '% of paths">' + data_['paths'] + '</span><div class="chart"><div style="width: ' + (.2 * path_pct).toFixed(0) + 'px"></div></div></td>';
      html += '<td style="text-align:right"><span data-toggle="tooltip" title="Total: ' + (data_['distance'] / 1000).toFixed(0) + ' km">' + avg_dist + '</span></td>';
      html += '<td style="text-align:right"><span data-toggle="tooltip" title="Total: ' + (data_['duration']).toFixed(0) + ' mins">' + avg_dur + '</span></td><td><span id="sparkline' + i + '"></span></td></tr>';
      $("#tbl tbody").append(html);

      $('#sparkline' + i).sparkline(JSON.parse('[' + hourly + ']'),
                        {type: 'line',
                        width: '80',
                        height: '20',
                        tooltipFormat: '<span style="color: {{color}}">&#9679;</span>{{y}} paths for {{offset:offset}}',
                        tooltipValueLookups: {
                            'offset': {
                                0: '12 AM',
                                1: '1 AM',
                                2: '2 AM',
                                3: '3 AM',
                                4: '4 AM',
                                5: '5 AM',
                                6: '6 AM',
                                7: '7 AM',
                                8: '8 AM',
                                9: '9 AM',
                                10: '10 AM',
                                11: '11 AM',
                                12: '12 PM',
                                13: '1 PM',
                                14: '2 PM',
                                15: '3 PM',
                                16: '4 PM',
                                17: '5 PM',
                                18: '6 PM',
                                19: '7 PM',
                                20: '8 PM',
                                21: '9 PM',
                                22: '10 PM',
                                23: '11 PM',
                            }
                        },
                        spotColor: null,
                        minSpotColor: null,
                        spotRadius: 2,
                        drawNormalOnTop: true
                      });
    }
    else {
      html = '<tr style="background-color: #ccebc5; font-weight: bold"><td> <i class="fa fa-circle" style="color: #ccebc5"></i> All</td><td>' + paths_count + '</td>';
      html += '<td style="text-align:right"><span data-toggle="tooltip" title="Total: ' + (data_['distance'] / 1000).toFixed(0) + ' km">' + avg_dist + '</span></td>';
      html += '<td style="text-align:right"><span data-toggle="tooltip" title="Total: ' + (data_['duration']).toFixed(0) + ' mins">' + avg_dur + '</span></td><td><span id="sparkline' + i + '"></span></td></tr>';
      $("#tbl tbody").append(html);

      $('#sparkline' + i).sparkline(JSON.parse('[' + hourly + ']'),
                        {type: 'line',
                        width: '80',
                        height: '20',
                        tooltipFormat: '<span style="color: {{color}}">&#9679;</span>{{y}} paths for {{offset:offset}}',
                        tooltipValueLookups: {
                            'offset': {
                                0: '12 AM',
                                1: '1 AM',
                                2: '2 AM',
                                3: '3 AM',
                                4: '4 AM',
                                5: '5 AM',
                                6: '6 AM',
                                7: '7 AM',
                                8: '8 AM',
                                9: '9 AM',
                                10: '10 AM',
                                11: '11 AM',
                                12: '12 PM',
                                13: '1 PM',
                                14: '2 PM',
                                15: '3 PM',
                                16: '4 PM',
                                17: '5 PM',
                                18: '6 PM',
                                19: '7 PM',
                                20: '8 PM',
                                21: '9 PM',
                                22: '10 PM',
                                23: '11 PM',
                            }
                        },
                        spotColor: null,
                        minSpotColor: null,
                        spotRadius: 2,
                        drawNormalOnTop: true
                      });
    }
    
  }

  // $('.inlinebar').sparkline('html', {type: 'bar', barColor: '#348ABD'} );
  // alert(hourly);
  // alert(hourly);

  

  $('[data-toggle="tooltip"]').tooltip(); 
  // $('.inlinebox').sparkline('html', {type: 'box', barColor: '#348ABD'} );
}

function plot_xy(data_xy) {
  $('#map').highcharts({
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        exporting: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        xAxis: {
            
            title: null,
            labels: {enabled: false},
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            lineWidth: 0,
               minorGridLineWidth: 0,
               lineColor: 'transparent',
            title: null,
            labels: {enabled: false},
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} lat, {point.y} lon'
                }
            }
        },
        series: data_xy
    });
}