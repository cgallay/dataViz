import * as d3 from 'd3';
import { MapManager } from './map.js' 

const loaderStyle = require('./loader.css');
const css = require('./style.css');

var myMap = new MapManager();
myMap.addTo("#mapContainer");
myMap.drawMap();

//Loading dataset
d3.csv("data/temp_country_group.csv", function(data) {
    //Hide loader
    d3.select("#spinner").remove();

    
});