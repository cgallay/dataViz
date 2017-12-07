import * as noUiSlider from 'noUiSlider';
import * as sprintf from 'sprintf-js';
import * as d3 from 'd3';
import { PanelChart } from './panel.js';


var $ = require("jquery");


//slider
export class TimeSlider {


    constructor(){

    }
    //function to add string label to the pips

    //function to create slider
    createSlider(years,timeSlider){
      function filter10( value, type ){
        	return value % 10 ? 2 : 1;
        }


      noUiSlider.create(timeSlider, {
        start: [0, Math.round(years.length / 2), years.length - 1],
        connect: [false, true, true, false],
        step: 5,
        range: {
          'min': 0,
          'max': years.length - 1,
        },
        pips: {
          /*mode:'values',
          values:[...Array(years.length).keys()],*/
          mode: 'steps',
          filter: filter10,
          density: 25,
          stepped: true
        },
        animate: true,
        animationDuration: 400
      });

      d3.selectAll('.noUi-handle').filter(function(d, i) {
          if (i == 1) {
            return i;
          }
        })
        .style("width", "2px")
        .style("height","70px")
        .classed(" timeSelector ", true)
        .style("position","relative").style("left","-1px").style("top","-35px")
        .style("content","none")
        .style("border-color","#F00");

      d3.selectAll('.noUi-handle-upper').classed(" noUi-extended ", true);
      d3.selectAll('.noUi-handle-lower').classed(" noUi-extended ", true);

      /*default_width=34px;
      default_height=28px;
      -17px -14px*/

      d3.selectAll('.noUi-extended').style("height", "24px").style("width", "16px").style("position","relative").style("top","-5px").style("left","-8px");
    }



    //function to change pips labels
    changePipLabel(idSlider, years) {
    /*
     //first and last labels
      var change_first_label = sprintf.vsprintf('#%s > div.noUi-pips.noUi-pips-horizontal > div:nth-child(%d)', [idSlider, 2]);
      $(change_first_label).text(years[0]);
      /*var change_last_label = sprintf.vsprintf('#%s > div.noUi-pips.noUi-pips-horizontal > div:nth-child(%d)', [idSlider, 2*(years.length-1) + 2]);
      console.log("last year:")
      console.log(years[years.length -1])
      $(change_last_label).text(years[years.length -1]);*/
      /*
      var labels=[];
      for ( var i=1; i< years.length -1 ; i+=10 )
        {
          labels.push(years[i]);
        };
        console.log(labels)
        console.log(labels);
     for (var i = 0; i < labels.length; i++) {
       var change_label = sprintf.vsprintf('#%s > div.noUi-pips.noUi-pips-horizontal > div:nth-child(%d)', [idSlider, 2 * i + 4]);
       $(change_label).text(labels[i]);
     }
     */

     var labels=[];
     for ( var i=0; i< years.length; i+=5 )
       {
         labels.push(years[i]);
       };
    labels.push(years[years.length-1]);
    console.log("labels")
    console.log(labels);
    for (var i = 0; i < labels.length; i++) {
      var change_label = sprintf.vsprintf('#%s > div.noUi-pips.noUi-pips-horizontal > div:nth-child(%d)', [idSlider, 2 * i + 2]);
      console.log($(change_label))
      $(change_label).text(labels[i]);
   }
    }

    // on update
    //add and update graphs when slider in updated
    sliderListener(years, timeSlider,panelChart, temperature, co2){

    timeSlider.noUiSlider.on('update', function(values, handle) {

      var years_id_selected = timeSlider.noUiSlider.get();;
      years_id_selected[1] = Number(years_id_selected[1]);
      years_id_selected[2] = Number(years_id_selected[2]) + 1; // recover id of months selected

      //create graph for temperatureChart
      var color_temperature = 'rgba(255,99,132,1)';
      var label_temperature = ' °C';
      var idLineChart_temperature = "temperatureChart";
      panelChart.makeLineChart(temperature, years, years_id_selected, color_temperature, label_temperature, idLineChart_temperature, 'Temperature [°C]');

      // function create graph for temperatureChart
      var color_co2 = 'rgba(99,255,132,1)';
      var label_co2 = ' kt';
      var idLineChart_co2 = "CO2Chart";
      panelChart.makeLineChart(co2, years, years_id_selected, color_co2, label_co2, idLineChart_co2, 'CO2 Emmissions [kt]')

    });
  }



}
