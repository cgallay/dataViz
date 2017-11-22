//Some functions

function getCountryName(feature){
    return feature.properties.name;
}

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    console.log(feature);
    return {
        fillColor: getColor(getCountryName(feature)),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }

}

//Reference
//http://intellipharm.github.io/dc-addons/examples/leaflet-choropleth.html
//https://github.com/Intellipharm/dc-addons/blob/master/README.md


//Showing the map
/*
var myMap = L.map('mapContainer').setView([51.505,-0.09], 13);
L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

L.geoJson(countryData,  {style: style}).addTo(myMap);
*/


var mapChart = dc.leafletChoroplethChart("#mapContainer");
var numberFormat = d3.format(".2f");
// Loading the data
d3.csv("data/temperatures_major.csv", function(error, data) {
    if(error) console.error(error);
    my_data = crossfilter(data);
    var timeDimension = my_data.dimension( d => d.dt);
    var temperatureDim = my_data.dimension( d => d.AverageTemperature);
    var countryDim = my_data.dimension( d => d.Country);
    temperatureDim.filter(t => t !== "")
    var old_time = timeDimension.filter(d => d=='1849-01-01');
    old_time
    mapChart
        .width(990)
        .height(500)
        .center([50.09024, -95.712891])
        .zoom(3)
        .dimension(countryDim) //WHY ?
        .group(countryDim.group().reduce((p,v) => {p.sum = p.sum + parseFloat(v.AverageTemperature); p.count= p.count + 1; return p;},
                            (p,v) => {p.sum = p.sum - parseFloat(v.AverageTemperature); p.count= p.count - 1; return p;},
                            (p,v) => {return {sum:0, count:0}}))
        .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
        .colorDomain([-20, 40])
        .colorCalculator(function (d) { return d ? mapChart.colors()(d.value.sum/d.value.count) : '#cca'; })
        .geojson(countryData.features)
        .featureKeyAccessor(function(feature) {
            return feature.properties.name;
        })
        .title(function (d) {
            return "Country: " + d.key + "\n Mean temperature is: " + (d.value ? d.value.sum/d.value.count : 0) + " degree";
        })
        .legend(dc.leafletLegend().position('bottomright'));

    console.log(old_time.top(Infinity));
    console.log("hellods");
    console.log(data[0]);
    dc.renderAll();
});