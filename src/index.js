//@flow
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import { MapManager } from './map.js';
import { DataManager } from './DataManager.js';
import { TimeSlider } from './timeHandler.js';
import { test } from './helpers.js';
import { PanelChart } from './panel.js';
import { bubble, BubbleChart } from './bubble.js';
import { pointRadial } from 'd3-shape';

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

                    //Recover the years
                    var years = [];
                    for (var i = 0; i < data.length; i++) {
                        //recover dt from each data object
                        years[i] = data[i].dt;
                    }
                    //get only the years appearing at least once (get rid of duplicates) and sort
                    var years = Array.from(new Set(years)).sort()


                    //TODO recover temperature and CO2
                    //create random data
                    function randomArray(length, max) {
                        return Array.apply(null, Array(length)).map(function () {
                            return Math.round(Math.random() * max);
                        });
                    }
                    var temperature_bis = randomArray(years.length, 40);
                    var co2_bis = randomArray(years.length, 100);


                    //Create Time slider
                    var myTimeSlider = new TimeSlider(years);

                    //Create Panel
                    var myPanelChart = new PanelChart();
                    //Create temperature canvas
                    myPanelChart.createCanvas(temperature_bis, "temperatureChart", 'Temperature [°C]', 'rgba(255,99,132,1)', ' °C');
                    //Create CO2 canvas and save params and data
                    myPanelChart.createCanvas(co2_bis, "CO2Chart", 'CO2 Emmissions [kt]', 'rgba(99,255,132,1)', ' kt');
                    //Look at handles values and create charts accordingly
                    myTimeSlider.sliderListener(myPanelChart);

                    myMap.addSelectListener(function (sel) {
                        console.log(panelData.getTempForCountry(sel).slice(0, years.length));
                        var temperature_bis = panelData.getTempForCountry(sel); //.slice(0, years.length);
                        myPanelChart.createCanvas(temperature_bis, "temperatureChart", 'Temperature [°C]', 'rgba(255,99,132,1)', ' °C');
                        myTimeSlider.sliderListener(myPanelChart);
                        myBubble.update(sel)
                    });

                    //Hide loader
                    d3.select("#spinner").remove();
                });
            });

        })
    })
})