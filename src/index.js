//@flow
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import { MapManager } from './map.js';
import { DataManager } from './DataManager.js';
import { TimeSlider } from './timeHandler.js';
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

const fulldata_path = "data/full_data.csv"


/**
 * Move inside helpers
 */
function selectYear(year) {

}

//Loading dataset

d3.csv(fulldata_path, (data) => {
    d3.json(geojson_path, (geojson) => {

        let mapData = new DataManager(data);
        let panelData = new DataManager(data);
        let myMap = new MapManager(geojson);
        myMap.addTo("#mapContainer");
        myMap.drawMap();

        myMap.setColorDomain(mapData.getTempDomain());


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

        //Create Bubble chart
        let myBubble = new BubbleChart(years_slider[0]);
        myBubble.addTo('#bubble');
        myBubble.get_chart();

        var data_country_select;
        //When country selected update data and charts
        myMap.addSelectListener( (sel) => {
            let data = panelData.getDataByCountry(sel)
            myLineCharts.updateData(data.slice(0,2));
            //myBubble.update(sel);
            myBubble.updateData(data[2]);
            data_country_select = panelData.getDataByCountry(sel);
            console.log(sel);
            console.log("data country");
            console.log(data_country_select);

        });

        myTimeSlider.addSelectListener( (years_selected) => {
            //update the years range and time selector of the charts
            myLineCharts.updateTime(years_selected);

            myBubble.updateTime(years_selected[1]);
            mapData.selectYear(years_selected[1]);
            myMap.updateTemperature(mapData.getData());
            myMap.updateColor();

        });
        //Hide loader
        d3.select("#spinner").remove();
    });

});
