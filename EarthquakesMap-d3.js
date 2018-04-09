var width = 1255, height = 630;
var h = "";
var arr = []

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3.geo.equirectangular().scale(200).translate([width / 2, height / 2])
var path = d3.geo.path().projection(projection);
var graticule = d3.geo.graticule();

d3.json(
  "https://unpkg.com/world-atlas@1/world/110m.json",
  function (error, w) {
    svg.append("g")
      .attr("class", "land")
      .selectAll("path")
      .data([topojson.object(w, w.objects.land)])
      .enter().append("path")
      .attr("d", path);

    svg.append("g")
      .attr("class", "boundary")
      .selectAll("boundary")
      .data([topojson.object(w, w.objects.countries)])
      .enter().append("path")
      .attr("d", path);

    d3.json(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      function (error, data) {
        if (data.features.length > 0) {
          for (var i = 0; i < data.features.length; i = i + 1) {
            arr.push([data.features[i].geometry.coordinates[0], data.features[i].geometry.coordinates[1]])
            h = h + "<li><a href='" + data.features[i].properties.url + "'>" + data.features[i].properties.title + "</li>"
          }
          c = d3.rgb("#D20E1C");

          svg.selectAll("circle")
            .data(arr).enter()
            .append("circle")
            .attr("cx", function (d) {
              return projection(d)[0];
            })
            .attr("cy", function (d) {
              return projection(d)[1];
            })
            .attr("r", "4px")
            .attr("fill", c)
        }
        document.getElementById("ListEarthquakes").innerHTML = h
      });
  });

function FindLoc() {
  navigator.geolocation.getCurrentPosition(function (position) {
    loc = [position.coords.longitude, position.coords.latitude];
    var rectangle = svg.append("rect")
      .attr("x", projection(loc)[0] - 3)
      .attr("y", projection(loc)[1] - 3)
      .attr("width", 6)
      .attr("height", 6);

      var textLabels = svg.append("text")
                       .attr("x", projection(loc)[0] - 30)
                       .attr("y", projection(loc)[1] + 15)
                       .text( function (d) { return "You are here"; })
                       .attr("font-family", "Helvetica")
                       .attr("font-size", "12px")
                       .attr("fill", "black");

  });
}
  