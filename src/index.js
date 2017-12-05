//@flow

import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import { MapManager } from './map.js';
import {test, updateTemperature} from './helpers.js';
import { timeDay } from 'd3';

const loaderStyle = require('./loader.css');
const css = require('./style.css');
const geojson_path = "geojson/world-countries.json";

function selectYear(year) {

}

//Loading dataset
d3.csv("data/temp_country_group.csv", function(data) {
    d3.json(geojson_path, function(geojson) {
        var myMap = new MapManager(geojson);
        myMap.addTo("#mapContainer");
        myMap.drawMap();
        
        // define domain for the colormap
        var temperature = data.map((d) => d.AverageTemperature).sort((a, b) => a - b);
        let domain = [d3.quantile(temperature, 0), d3.quantile(temperature, .50), d3.quantile(temperature, 1)];
        myMap.setColorDomain(domain);

        //Manage data
        let cf = crossfilter(data);
        var timeDimension = cf.dimension( d => d.dt);
        var countryDim = cf.dimension (d => d["ISO Code"]);
        var temperatureDim = cf.dimension( d => d.AverageTemperature);
        timeDimension.filter(d => d=='1970');

        let d = timeDimension.top(Infinity);
        console.log(d);
        myMap.updateTemperature(data);
        myMap.updateColor();

    });
    //Hide loader
    d3.select("#spinner").remove();
});