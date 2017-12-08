//@flow
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import { MapManager } from './map.js';
import { DataManager } from './DataManager.js';
import { TimeSlider } from './timeHandler.js';
import { test } from './helpers.js';
import { getRandomdata} from './helpers.js';
import { getYears} from './helpers.js';
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


        //create year vector for slider (all years present in the dataset)
        let years_slider = getYears(panelData.data);
        years_slider=  Array.from(new Set(years_slider)).sort();
        //create slider
        let myTimeSlider= new TimeSlider(years_slider);
        //Create Line chart
        let myLineCharts =new LineChart();
        myLineCharts.get();

        //temperature and co2 =[{x:year,y:value}]
        //data=[temperature,co2]
        // empty before selecting country
        var chartData=[];

        //When country selected update data and charts
        myMap.addSelectListener(function(sel){
          //get new temperature and co2 sorted by date !!
          var temperature=getRandomdata(years_slider);
          var co2=getRandomdata(years_slider);
          chartData=[temperature, co2];
          myLineCharts.updateData(chartData);
          //when slider used, update charts
          myTimeSlider.sliderListener(chartData, myLineCharts)
        });

        //Hide loader
        d3.select("#spinner").remove();
    });

});
