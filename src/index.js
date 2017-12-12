//@flow
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import { MapManager } from './map.js';
import { DataManager } from './DataManager.js';
import { TimeSlider } from './TimeHandler.js';
import { test } from './helpers.js';
import { getRandomdata } from './helpers.js';
import { getRandomdata2 } from './helpers.js';
import { getYears } from './helpers.js';
import { LineChart } from './lineChart.js';
import { bubble, BubbleChart } from './bubble.js';

var $ = require("jquery");

const loaderStyle = require('./loader.css');
const css = require('./style.css');
const nouislidercss = require('./nouislider.css');

const geojson_path = "geojson/world-countries.json";
const dataset_path = "data/temp_country_group.csv";
const dataset_CO2_path = "data/CO2_country.csv";
const dataset_pop_path = "data/population_country.csv";
const dataset_delta_temp_path = "data/delta_temp.csv";

const fulldata_path = "data/full_data.csv"


/**
 * Move inside helpers
 */
function selectYear(year) {

}

//Loading dataset

d3.csv(fulldata_path, function (data) {
    d3.json(geojson_path, function (geojson) {


        let myBubble = new BubbleChart();
        myBubble.addTo('#bubble');
        myBubble.get_chart();

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
        //to replace later
        let years_slider = getYears(panelData.getData());
        years_slider = Array.from(new Set(years_slider)).sort();

        //create slider
        let myTimeSlider = new TimeSlider();
        myTimeSlider.addSliderTo('timeSlider');
        myTimeSlider.addPlayPauseTo('PlayPauseContainer');
        myTimeSlider.createSlider(years_slider);


        //Create Line chart
        let myLineCharts = new LineChart();
        myLineCharts.draw(years_slider);

        let chartData = [];

        //When country selected update data and charts
        myMap.addSelectListener(function (sel) {

            let temperature = panelData.getTempByCountry(sel);
            let CO2 = panelData.getCO2ByCountry(sel, getRandomdata(years_slider));

            chartData = [temperature, CO2];

            myLineCharts.updateData_second(chartData);
            myBubble.update(sel);

        });

        myTimeSlider.addSelectListener(function (years_selected) {
            //update the years range and time selector of the charts
            myLineCharts.updateTime(years_selected);
            //pass the year of the timeselector to the map to change the colormap
        });
        //Hide loader
        d3.select("#spinner").remove();
    });

});
