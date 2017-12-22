import * as d3 from 'd3';
export class MapManager {
    constructor(geojson) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.countries = geojson;

        this.valueType = 'TEMPERATURE';
        this.selection = null;
        this.selections = [];
        this.SELECTION_MAX = 5;

        // D3 Projection
        this.projection = d3.geoEquirectangular()
            .scale(this.width / 2 / Math.PI)
            .translate([this.width/2, this.height / 2]);
        // path generator to convert JSON to SVG paths
        this.path = d3.geoPath()
            .projection(this.projection);

        //colormap for population density
        this.colorScale = {};
        this.colorScale['TEMPERATURE'] = d3.scaleLinear()
            .range(["#2c7bb6", "#ffff8c", "#d7191c"])
            .interpolate(d3.interpolateHcl);
        
        this.colorScale['CO2'] = d3.scaleLinear()
            .range(["#2c7bb6", "#ffff8c", "#d7191c"])
            .interpolate(d3.interpolateHcl);

        //Adding Zoom to the map
        this.zoom = d3.zoom()
            .scaleExtent([0.65, 8])
            .on("zoom", this.zoomed.bind(this));

    }

    zoomed() {
        this.g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        this.g.attr("transform", d3.event.transform);
    }

    isCountrySelected(countryId) {
        return this.selections.find((c) => c.id  === countryId);
    }

    unselectCountry(countryId) {
        this.selections = this.selections.filter(c => c.id != countryId);
    }

    clicked(d){
        let country = {id: d.id, name: d.properties.name}   //selected country
        if(this.isCountrySelected(country.id)) {
            this.unselectCountry(country.id);
        } else {
            this.selections.push(country);
            if(this.selections.length > this.SELECTION_MAX) {
                this.selections.shift()
            }
        }
        this.updateColor();
        if(this.selectListener) {
            this.selectListener(this.selections);
        }
    }

    /**
     * Function to be called when a country is selected
     * The function will receve a list of country in that format [{id: "FRA", name: "France"}, {id: "GER", name: "Germany"}]
     * @param {function} listener
     */
    addSelectListener(listener){
        this.selectListener = listener;
    }

    setColorDomain(domain, typeValue) {
        //TODO test that domain match (sanity check)
        this.colorScale[typeValue] = this.colorScale[typeValue].domain(domain);
    }

    setValueType(valueType){
        this.valueType = valueType;
        this.updateColor();
    }

    /**
     * Attach the map to a div
     * @param {string} div id of the div
     */
    addTo(div) {
        
        this.svg = d3.select(div)
            .append("svg")
            .attr("id", "map")
            .attr("viewBox", "0 0 " + this.width + " " + this.height )
            .attr("preserveAspectRatio", "xMidYMid meet");
            //.on("click", stopped, true);
        this.g = this.svg.append("g");
        this.svg.call(this.zoom);
    }

    getValue(d){
        switch(this.valueType){
            case 'TEMPERATURE':
                return d.properties.temperature;
            case 'CO2':
                return d.properties.CO2;
            default:
                throw 'Unexpected selection value';
        };
    }
    setValue(d){
        switch(this.valueType){
            case 'TEMPERATURE':
                return d.properties.temperature;
            case 'CO2':
                return d.properties.CO2;
            default:
                throw 'Unexpected selection value';
        };
    }

    updateColor() {
        this.g.selectAll(".country")
        .data(this.countries.features)
        .attr("id", (d) => d.id)
        .transition().duration(500)
        .style("fill", (d) => {
                const value = this.getValue(d);//d.properties.temperature;
                //color the selected country in a different manner
                if(this.isCountrySelected(d.id)) {
                    return 'rgba(80,111,255,1)';
                }
                return value ? this.colorScale[this.valueType](value) : "gray";
            })
        .style("stroke",(d) => {
                //color the selected country in a different manner
                if(this.isCountrySelected(d.id)) {
                    return 'white';
                }
            })
        .style("stroke-width",(d) => {
                //color the selected country in a different manner
                if(this.isCountrySelected(d.id)) {
                    return '1';
                }
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
            .on("click", this.clicked.bind(this))
            .append("svg:title")
            .text(d => d.properties.name);
    }

    updateData(data) {
        //TODO try avoid the double loop (sorting once for all)
        // Loop through each country data value in the .csv file
        for (let i = 0; i < data.length; i++) {
            // Country name
            let dataWorldCode = data[i]['ISO Code'];
            // Country temperature
            let dataWorldTemp = data[i].AverageTemperature;
            let dataWorldCo2 = data[i].CO2;
            // Find the corresponding country inside the JSON
            for (let j = 0; j < this.countries.features.length; j++) {
                let jsonWorldCode = this.countries.features[j].id;
                if (dataWorldCode === jsonWorldCode) {
                    // Copy the Country temperature into the JSON
                    this.countries.features[j].properties.temperature = dataWorldTemp;
                    this.countries.features[j].properties.CO2 = dataWorldCo2;
                    break;
                }
            }
        }
    }
}
