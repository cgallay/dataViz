import * as d3 from 'd3';
export class MapManager {
    constructor(geojson) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.countries = geojson;

        this.selection = null;

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
        
        //colormap for population density
        this.colorScale = d3.scaleLinear()
            .range(["#2c7bb6", "#ffff8c", "#d7191c"])
            .interpolate(d3.interpolateHcl);
        
        this.clicked = this.getClickedFn(this)
        
    }

    getClickedFn(mapRef){
        return function(d) {
            console.log("User clicked on Country: " + d.id);
            mapRef.selection = d.id;
            mapRef.updateColor();

            if(mapRef.selectListener) {
                mapRef.selectListener(mapRef.selection);
            }
        };
    }

    // clicked2(){

    //     console.log("User clicked on Country: " + d.id);
    //     this.selection = d.id;
    //     this.updateColor();
    //     if(this.selectListener) {
    //         this.selectListener(this.selection);
    //     }

    // }

    /**
     * Function to be called when a country is selected
     * @param {function} listener 
     */
    addSelectListener(listener){
        this.selectListener = listener;
    }

    setColorDomain(domain) {
        //TODO test that domain match (sanity check)
        this.colorScale = this.colorScale.domain(domain);
    }

    /**
     * Attach the map to a div
     * @param {string} div id of the div
     */
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
    
    updateColor() {
        this.g.selectAll(".country")
        .data(this.countries.features)
        .attr("id", (d) => d.id)
        .transition().duration(500)
        .style("fill", (d) => {
                const temperature = d.properties.temperature; 
                //color the selected country in a different manner
                if(this.selection === d.id) {
                    return "green";
                }
                return temperature ? this.colorScale(temperature) : "white";
            });
    }

    

    /**
     * Draw the map into the div
     */
    drawMap() {
        this.g.selectAll("path")
            .data(this.countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", this.path)
            .on("click", this.clicked)
            .append("svg:title")
            .text(d => d.properties.name);
    }

    /**
     * For each country add a temperature property
     * to countries json  
     * @param {Array} data temperature for countries 
     */
    updateTemperature(data) {
        //TODO try avoid the double loop (sorting once for all)
        // Loop through each country data value in the .csv file
        for (let i = 0; i < data.length; i++) {
            // Country name
            let dataWorldCode = data[i]['ISO Code'];
            // Country temperature
            let dataWorldTemp = data[i].AverageTemperature
            // Find the corresponding country inside the JSON
            for (let j = 0; j < this.countries.features.length; j++) {
                let jsonWorldCode = this.countries.features[j].id;
                if (dataWorldCode === jsonWorldCode) {
                    // Copy the Country temperature into the JSON
                    this.countries.features[j].properties.temperature = dataWorldTemp;
                    break;
                }
            }
        }
    }
}