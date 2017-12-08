//@flow
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import { MapManager } from './map.js';
import { DataManager } from './DataManager.js';
import { TimeSlider } from './timeHandler.js';
import { test } from './helpers.js';
import { getRandomdata} from './helpers.js';
import { Panel } from './panel.js';
import { LineChart } from './lineChart.js';

var $ = require("jquery");

const loaderStyle = require('./loader.css');
const css = require('./style.css');
const nouislidercss = require('./nouislider.css');

const geojson_path = "geojson/world-countries.json";
const dataset_path = "data/temp_country_group.csv";


/**
 * Move inside helpers
 */
function selectYear(year) {

}

//Loading dataset
d3.csv(dataset_path, function(data) {
    d3.json(geojson_path, function(geojson) {
        var mapData = new DataManager(data);
        var panelData = new DataManager(data);
        var myMap = new MapManager(geojson);
        myMap.addTo("#mapContainer");
        myMap.drawMap();

        myMap.setColorDomain(mapData.getTempDomain());

        //TODO: Merge these two
        mapData.selectYear(1980);
        myMap.updateTemperature(mapData.getData());
        myMap.updateColor();


        let myTimeSlider= new TimeSlider();
        let myLineCharts =new LineChart();
        myLineCharts.get();

        myMap.addSelectListener(function(sel){
          /*var temperature = panelData.getTempForCountry(sel);*/
          //Create Time slider
          var temperature=getRandomdata();
          var data=[temperature, temperature];
          let years=temperature.sort(DataManager.compareDate).map(d => d.dt);
          myTimeSlider.createSlider(years);
          myLineCharts.updateData(data);
          myTimeSlider.sliderListener(data, myLineCharts);

        });

        //Hide loader
        d3.select("#spinner").remove();
    });

});
