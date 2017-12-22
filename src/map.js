import * as d3 from 'd3';

import { legendColor } from 'd3-svg-legend'

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
        this.actifZoom = true
        this.zoom = d3.zoom()
            .scaleExtent([0.65, 8])
            .on("zoom", this.zoomed.bind(this));        
    }
    
    centerOn(country){
        let d = this.svg.select('#' + country).datum();
        let svgWidth = parseInt(this.svg.style("width").replace("px", "")) * 0.68;
        let svgHeight = parseInt(this.svg.style("height").replace("px", ""));
        let center = this.path.centroid(d);
        
        this.g.transition()
            .duration(1000)
            .attr("transform", "translate(" + (svgWidth/2 - center[0]) + "," + (svgHeight/2 - center[1]) + ")");
    }

    selectCountries(countries) {
        this.selections = countries
        this.updateColor()
    }

    /**
     * Used for simulate a user click for the Story telling
     * @param {String} country_id 
     * @param {String} name 
     */
    clickOnCountry(country_id, name) {
        let d = {id: country_id, properties: {name: name}}
        this.clicked(d)
    }

    addLegend(){
        this.svg.append("g")
            .attr("class", "legendQuant")
            .attr("transform", "translate(20,150)");

        this.updateLegend();
    }

    
    
    updateLegend() {
        let colorLegend = legendColor()
            .labelFormat(d3.format(".2f"))
            .useClass(false)
            .scale(this.colorScale[this.valueType]);
        this.svg.select(".legendQuant")
            .style('fill', '#FFF');
        this.svg.select(".legendQuant").call(colorLegend);
    }

    zoomActive(actifZoom) {
        this.actifZoom = actifZoom;
    }

    setTextOverCountry(country, title, text, pos='top') {
        d3.select('#' + country)
            .attr('data-toggle', 'popover')
            .attr('title', title)
            .attr('data-content', text)
            .attr('data-container', 'body')
            .attr('data-placement', pos);
    }

    zoomed() {
        if(this.actifZoom) {
            this.g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
            this.g.attr("transform", d3.event.transform);
        }
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
        this.updateLegend();
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
