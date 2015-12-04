
// $("#sl1").sparkline([5,6,7,9,9,5,3,2,2,4,6,7,1,2,2,5,4,2,21,7,8], {type: 'line'}); 

// var modes = ['walk', 'bike', 'car', 'taxi', 'bus', 'subway']; 

var seasons = ['2008-2', '2008-3', '2008-4', '2009-1', '2009-2', '2009-3'];
var mode_colors = {'walk': '#fbb4ae', 'bike': '#b3cde3', 'car': '#ccebc5', 'taxi': '#decbe4', 'bus': '#fed9a6', 'subway': '#ffffcc'};
var season_index = 0;
display();
plot_xy(data_xy[seasons[season_index]]);  //REMOVE LATER

// create_map(data_xy[seasons[season_index]]);
create_map(data_xy[seasons[season_index]], true, modes);

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function next() {
  if (season_index >= 4) {
    season_index = 5;
    $("#btn_fwd").prop('disabled', true);
  }
  else{
    season_index += 1;
    $("#btn_back").prop('disabled', false);
  }

  display();
  plot_xy(data_xy[seasons[season_index]]); //REMOVE LATER

// create_map(data_xy[seasons[season_index]]);
  create_map(data_xy[seasons[season_index]], false, modes);

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
  plot_xy(data_xy[seasons[season_index]]); //REMOVE LATER

// create_map(data_xy[seasons[season_index]]);
  create_map(data_xy[seasons[season_index]], false, modes);

}

function update() {
  season_index = parseInt($('#dropdown1').val());

  if (season_index >= 5) {
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
  plot_xy(data_xy[seasons[season_index]]); //REMOVE LATER

// create_map(data_xy[seasons[season_index]]);
  create_map(data_xy[seasons[season_index]], false, modes);

}

function display() {
  $('#tbl tbody').html('');
  $("#dropdown1").val(season_index.toString());
  var season = seasons[season_index];
  paths_count = 0
  for (var mode in data[season]) {
    paths_count += data[season][mode]['paths'];
  }

  for (var i in modes) {
    mode = modes[i];

    if (mode in data[season]) {
      data_ = data[season][mode];
      avg_dist = (data_['distance'] / data_['paths'] / 1000.).toFixed(1) + '<span style="color:gray;font-size:x-small"> km</span>';
      avg_dur = (data_['duration'] / data_['paths']).toFixed(1) + '<span style="color:gray;font-size:x-small"> min</span>';
      path_pct = (250 * data[season][mode]['paths'] / paths_count).toFixed(0);
      hourly = data_['hourly'].join();
    }
    else{
      path_pct = 'N/A';
      avg_dist = 'N/A';
      avg_dur = 'N/A';
      hourly = '';
    }

    //arthur changes START
    html = '<tr class="row-mode" id='+mode+'><td> <i class="fa fa-circle" style="color:' + mode_colors[mode] + '"></i> ' + capitalize(mode) + '</td>';
    // html = '<tr><td> <i class="fa fa-circle" style="color:' + mode_colors[mode] + '"></i> ' + capitalize(mode) + '</td>';
    // arthur changes END

    html += '<td><div class="chart"><div style="width: ' + path_pct + 'px"></div></div></td>';
    html += '<td style="text-align:right">' + avg_dist + '</td>';
    html += '<td style="text-align:right">' + avg_dur + '</td><td><span class="inlineline">' + hourly + '</span></td></tr>';
    $("#tbl tbody").append(html);
  }

  // $('.inlinebar').sparkline('html', {type: 'bar', barColor: '#348ABD'} );
  $('.inlineline').sparkline('html', {type: 'line', barColor: '#348ABD'} );
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