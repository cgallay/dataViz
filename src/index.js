//@flow
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import { MapManager } from './map.js';
import { TimeSlider } from './timeHandler.js';
import { test } from './helpers.js';
import { timeDay } from 'd3';
import { PanelChart } from './panel.js';

var $ = require("jquery");
/*const { document } = (new JSDOM(``)).window;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;*/

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
        var myMap = new MapManager(geojson);
        myMap.addTo("#mapContainer");
        myMap.drawMap();
        myMap.addSelectListener(function(sel){
            alert("country " + sel + " is selected");
        });

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
        console.log("d:");
        console.log(d);
        console.log("data:");
        console.log(data);

        myMap.updateTemperature(d);
        myMap.updateColor();

        var MyTimeSlider= new TimeSlider();
        console.log("years:");
        var years = [];
        for(var i = 0; i < data.length; i++){
            years[i] = data[i].dt;
        }
        var years = Array.from(new Set(years)).sort()
        console.log(years);
        console.log("last");
        console.log(years[years.length-1]);


        function randomArray(length, max) {
            return Array.apply(null, Array(length)).map(function() {
                return Math.round(Math.random() * max);
            });
        }
        var temperature_bis = randomArray(years.length, 40);
        console.log("temp random:");
        console.log(temperature_bis);
        var co2_bis = randomArray(years.length, 100);
        console.log("co2 random");
        console.log(co2_bis);
        /*let months = ['January', 'February', 'March', 'April', 'May', 'June'];*/

        let timeSlider = document.getElementById('timeSlider');
        MyTimeSlider.createSlider(years,timeSlider);
        MyTimeSlider.changePipLabel('timeSlider', years);
        var idLineChart_temperature = "temperatureChart";

        var MyPanelChart= new PanelChart();
        var idLineChart_temperature = "temperatureChart";
        MyPanelChart.createCanvas(idLineChart_temperature);
        var idLineChart_co2 = "CO2Chart";
        MyPanelChart.createCanvas(idLineChart_co2);

        MyTimeSlider.sliderListener(years, timeSlider,MyPanelChart,temperature_bis,co2_bis);


        /*Play Pause button animation*/
        $('.control').on('mousedown', function() {
            $(this).toggleClass('pause play');
          });

          $(document).on('keyup', function(e) {
            if (e.which == 32) {
              $('.control').toggleClass('pause play');
            }
          });
        /*End Play Pause button animation*/


        //Hide loader
        d3.select("#spinner").remove();
    });
});
