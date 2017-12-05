import * as d3 from 'd3';
export class MapManager {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        // D3 Projection
        this.projection = d3.geoEquirectangular()
            .scale(this.width / 2 / Math.PI)
            .translate([this.width/2, this.height / 2]);
        // path generator to convert JSON to SVG paths
        this.path = d3.geoPath()
            .projection(this.projection);
        
        //colormap for population density
        this.color = d3.scaleLinear()
            .range(["#2c7bb6", "#ffff8c", "#d7191c"])
            .interpolate(d3.interpolateHcl);
    }   

    addTo(div) {
        console.log("adding to div " + div);
        this.svg = d3.select(div)
            .append("svg")
            .attr("id", "map")
            .attr("viewBox", "0 0 " + this.width + " " + this.height )
            .attr("preserveAspectRatio", "xMidYMid meet");
            //.on("click", stopped, true);
        this.g = this.svg.append("g");
    }
    
    clicked(d) {
        console.log("User clicked on Country: " + d)    
    }

    renderCountries(countries) {
        this.g.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", this.path)
        .on("click", this.clicked)
        .append("svg:title")
        .text(d => d.properties.name);
    }

    drawMap() {
        let geojson_path = "geojson/world-countries.json";
        let ref = this;
        d3.json(geojson_path, function(countries) {
            ref.renderCountries(countries);
        });
    }

}


