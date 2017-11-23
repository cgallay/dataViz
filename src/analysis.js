// @flow
const width = window.innerWidth;
const height = window.innerHeight;

// D3 Projection
const projection = d3.geoEquirectangular()
    .scale(width / 2 / Math.PI)
	.translate([width/2, height / 2]);

// path generator to convert JSON to SVG paths
const path = d3.geoPath()
	.projection(projection);

//colormap for population density
var color = d3.scaleLinear()
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
    //.range(["hsl(62,100%,90%)", "hsl(228,30%,20%)"])
    //.range(["rgb(0,255,255)", "rgb(255,255,255)"])
    //.range(['lightblue', 'orange', 'lightgreen', 'pink']);
	//.interpolate(d3.interpolateHcl);

const svg = d3.select("body")
    .append("svg")
    .attr("id", "map")
    .attr("viewBox", "0 0 " + width + " " + height )
    .attr("preserveAspectRatio", "xMidYMid meet");



function updateTemperature(countries, data) {
    //TODO try avoid the double loop (sorting once for all)
    // Loop through each country data value in the .csv file
    for (let i = 0; i < data.length; i++) {
        // Country name
        let dataWorldCode = data[i].key;
        
        // Canton density
        let dataWorldTemp = data[i].value.sum / data[i].value.count;

        // Find the corresponding country inside the JSON
        for (let j = 0; j < countries.features.length; j++) {
            let jsonWorldCode = countries.features[j].id;
            
            if (dataWorldCode === jsonWorldCode) {
                // Copy the canton density into the JSON
                //console.log(dataWorldCode);
                //console.log(dataWorldTemp);
                countries.features[j].properties.temperature = dataWorldTemp;
                break;
            }
        }
    }
}
function renderCountryColor(countries, color) {
    svg.selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("class", (d) => "countries")
    .attr("d", path)
    .style("fill", (d) => {
            const temperature = d.properties.temperature;
            return temperature ? color(temperature) : "white";//color(temperature);
            });
}

function updateCountryColor(countries, color) {

    svg.selectAll(".countries")
    .data(countries.features)
    .attr("id", (d) => d.id)
    .style("fill", (d) => {
            const temperature = d.properties.temperature;
            //console.log("hello" + temperature + "for " + d.id);
            return temperature ? color(temperature) : "white";//color(temperature);
        });
}

//map file
topojson_path = "topojson/world/countries.json";
geojson_path = "geojson/world-countries.json";
d3.csv("data/output.csv", function(data) {
	d3.json(geojson_path, function(world) {
        //const countries = topojson.feature(world, world.objects.units);
        const countries = world
        cf = crossfilter(data)
        var timeDimension = cf.dimension( d => d.dt);
        var countryDim = cf.dimension (d => d["ISO Code"]);
        var temperatureDim = cf.dimension( d => d.AverageTemperature);
        timeDimension.filter(d => d=='1849-01-01');

        grp_country = countryDim.group().reduce((p,v) => {p.sum = p.sum + parseFloat(v.AverageTemperature); p.count= p.count + 1; return p;},
            (p,v) => {p.sum = p.sum - parseFloat(v.AverageTemperature); p.count= p.count - 1; return p;},
            (p,v) => {return {sum:0, count:0}})

            
        updateTemperature(countries, grp_country.top(Infinity))
    
        // define domain for the colormap
        //TODO move it to updateTemperature ?
		var temperature = data.map((d) => d.AverageTemperature).sort((a, b) => a - b);
        color = color.domain([d3.quantile(temperature, .01), d3.quantile(temperature, .99)]);
        //console.log([d3.quantile(temperature, .01), d3.quantile(temperature, .99)])

		//color the map according to the density of each canton
        renderCountryColor(countries, color);
        var year = 1850; 
        updateCountryColor(countries, color);
        setInterval(function(){
            year = year + 1;
            timeDimension.filter(d => d === year+'-01-01')
            updateTemperature(countries, grp_country.top(Infinity))
            updateCountryColor(countries, color);
            //console.log(countries)
        }, 1000) 
        
		
	});
});