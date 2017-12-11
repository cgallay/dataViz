//@flow
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import { MapManager } from './map.js';
import { DataManager } from './DataManager.js';
import { TimeSlider } from './TimeSlider.js';
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


/**
 * Move inside helpers
 */
function selectYear(year) {

}

//Loading dataset

d3.csv(dataset_path, function (data) {
    d3.json(geojson_path, function (geojson) {
        d3.csv(dataset_CO2_path, (CO2_data) => {
            d3.csv(dataset_pop_path, (pop_data) => {
                d3.csv(dataset_delta_temp_path, (delta_data) => {

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

                    let myLineCharts = new LineChart();
                    myLineCharts.get();

                    //create year vector for slider (all years present in the dataset)
                    let years_slider = getYears(panelData.data);
                    years_slider = Array.from(new Set(years_slider)).sort();
                    //create slider
                    let myTimeSlider = new TimeSlider();
                    myTimeSlider.addTo('timeSlider');
                    myTimeSlider.createSlider(years_slider);

                    //Create Line chart

                    //data=[temperature,co2]
                    // empty before selecting country


                    //When country selected update data and charts
                    myMap.addSelectListener(function (sel) {
                        //get new temperature and co2 sorted by date !!
                        //temperature=[ temp 1st country selected,temp 2nd country selected ,....];
                        //temp 1st country sected =[{x:year_value, y:temp_value},{x:year_value, y:temp_value}]
                        //when slider used, update charts
                        var temperature = getRandomdata2(years_slider);
                        var co2 = getRandomdata2(years_slider);
                        var countries = ['France', 'Switzerland'];
                        var chartData = [temperature, co2];
                        myLineCharts.updateData(chartData, countries);
                        myBubble.update(sel);

                    });
                    myTimeSlider.addSelectListener(function (years) {
                        myLineCharts.updateTime(data, years);
                    });

                    //Hide loader
                    d3.select("#spinner").remove();
                });

            });
        })
    })
})