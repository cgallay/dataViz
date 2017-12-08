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
        /*
        //Create Panel
        var myPanel= new Panel();
        //Create temperature canvas // merge canvas and make line chart
        myPanel.createCanvas(temperature_bis,"temperatureChart",'Temperature [°C]','rgba(255,99,132,1)', ' °C');
        //Create CO2 canvas and save params and data
        myPanel.createCanvas(co2_bis,"CO2Chart",'CO2 Emmissions [kt]','rgba(99,255,132,1)',' kt');
        //Look at handles values and create charts accordingly
        myTimeSlider.sliderListener(myPanel);

        myMap.addSelectListener(function(sel){
<<<<<<< HEAD
            console.log(panelData.getTempForCountry(sel).slice(0, years.length));
            var temperature_bis = panelData.getTempForCountry(sel); //.slice(0, years.length);
            myPanel.createCanvas(temperature_bis,"temperatureChart",'Temperature [°C]','rgba(255,99,132,1)', ' °C');
            myTimeSlider.sliderListener(myPanel);
        });*/
=======
            console.log(panelData.getTempForCountry(sel[0].id).slice(0, years.length));
            var temperature_bis = panelData.getTempForCountry(sel[0].id); //.slice(0, years.length);
            myPanelChart.createCanvas(temperature_bis,"temperatureChart",'Temperature [°C]','rgba(255,99,132,1)', ' °C');
            myTimeSlider.sliderListener(myPanelChart);
        });

        //Hide loader
        d3.select("#spinner").remove();
    });
});
>>>>>>> 357435eb947ac6ac9d68ae4d03ebf39117b29abe
