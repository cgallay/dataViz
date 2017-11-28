// @flow
const width = window.innerWidth;
const height = window.innerHeight;

var active = d3.select(null);
const selectionColor = "yellow";
var oldColor; // remember to color of the country to reset it when unselected

// D3 Projection
const projection = d3.geoEquirectangular()
    .scale(width / 2 / Math.PI)
    .translate([width/2, height / 2]);
    
var zoom = d3.zoom()
    // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
    // .translate([0, 0]) 
    // .scale(1) 
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

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
    .attr("preserveAspectRatio", "xMidYMid meet")
    .on("click", stopped, true);

/*
var div = d3.select.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity ")
    .on("click", reset);

*/

svg.call(zoom);

var g = svg.append("g");

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

//TODO Better speparate code (createMap() and colorMap())
function renderCountryColor(countries, color) {
    g.selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("class", (d) => "countries")
    .attr("d", path)
    //.transition().duration(100)
    .style("fill", (d) => {
            const temperature = d.properties.temperature;
            return temperature ? color(temperature) : "white";//color(temperature);
            })
    .on("click", clicked)
    .append("svg:title")
    .text(d => d.properties.name);
}

function updateCountryColor(countries, color) {

    g.selectAll(".countries")
    .data(countries.features)
    .attr("id", (d) => d.id)
    .transition().duration(500)
    .style("fill", (d) => {
            const temperature = d.properties.temperature; 
            //color the selected country in a different manner
            if(active.node() && active.node().id === d.id) {
                return "green";
            }
            return temperature ? color(temperature) : "white";
        });
}

//map file
topojson_path = "topojson/world/countries.json";
geojson_path = "geojson/world-countries.json";
d3.csv("data/output.csv", function(data) {
	d3.json(geojson_path, function(world) {
        //Hide loader
        d3.select("#spinner").remove();

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



//ZOOM

function clicked(d) {
    if (active.node() === this) return reset();
    active.style("fill", oldColor);
    active.classed("active", false);
    active = d3.select(this).classed("active", true);
    oldColor = active.style("fill");
    active.style("fill", "green")

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
        translate = [width / 2 - scale * x, height / 2 - scale * y];
  
    svg.transition()
        .duration(750)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4

}
  
function reset() {
    active.style("fill", oldColor);
    active.classed("active", false);
    active = d3.select(null);

    svg.transition()
        .duration(750)
        // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
        .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}

function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
    g.attr("transform", d3.event.transform); // updated for d3 v4
  }

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  }