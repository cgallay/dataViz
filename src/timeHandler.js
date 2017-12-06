import * as noUiSlider from 'noUiSlider';
import * as sprintf from 'sprintf-js';
import { PanelChart } from './panel.js';


var $ = require("jquery");


//slider
export class TimeSlider {


    constructor(){

    }
    //function to add string label to the pips

    //function to create slider
    createSlider(years,timeSlider){
    noUiSlider.create(timeSlider, {
      start: [0, Math.round(years.length / 2), years.length - 1],
      connect: [false, true, true, false],
      step: 1,
      range: {
        'min': 0,
        'max': years.length - 1,
      },
      pips: {
        mode: 'values',
        values: [...Array(years.length).keys()],
        density: 25,
        stepped: true
      },
      animate: true,
      animationDuration: 400
    });
    }

    //function to change pips labels
    changePipLabel(idSlider, years) {
     for (var i = 0; i < years.length; i++) {
       var change_label = sprintf.vsprintf('#%s > div.noUi-pips.noUi-pips-horizontal > div:nth-child(%d)', [idSlider, 2 * i + 2]);
       $(change_label).text(years[i]);
    }
    }

    // on update
    //add and update graphs when slider in updated
    sliderListener(years, timeSlider, temperature, co2){

    timeSlider.noUiSlider.on('update', function(values, handle) {

      var years_id_selected = timeSlider.noUiSlider.get();;
      years_id_selected[1] = Number(years_id_selected[1]);
      years_id_selected[2] = Number(years_id_selected[2]) + 1; // recover id of months selected

      //create graph for temperatureChart
      var color_temperature = 'rgba(255,99,132,1)';
      var label_temperature = ' °C';
      var idLineChart_temperature = "temperatureChart";
      var MyPanelChart= new PanelChart();
      MyPanelChart.createCanvas(idLineChart_temperature);
      MyPanelChart.makeLineChart(temperature, years, years_id_selected, color_temperature, label_temperature, idLineChart_temperature, 'Temperature [°C]');

      // function create graph for temperatureChart
      var color_co2 = 'rgba(99,255,132,1)';
      var label_co2 = ' kt';
      var idLineChart_co2 = "CO2Chart";
      MyPanelChart.createCanvas(idLineChart_co2);
      MyPanelChart.makeLineChart(co2, years, years_id_selected, color_co2, label_co2, idLineChart_co2, 'CO2 Emmissions [kt]')

    });
  }



}
