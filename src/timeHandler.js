import * as noUiSlider from 'nouislider';
import * as sprintf from 'sprintf-js';
import * as d3 from 'd3';
import { PanelChart } from './panel.js';


var $ = require("jquery");


//slider
export class TimeSlider {

    constructor(){
      this.idSlider='timeSlider';
      this.timeSlider=document.getElementById(this.idSlider);

      /*this.createSlider(this.years,this.timeSlider,this.idSlider)*/

    }
    //function to add string label to the pips

    //function to create slider
    createSlider(years){


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

      //
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

      //function to change pips labels
      function changePipLabel(idSlider, years) {
       var labels=[];
       for ( var i=0; i< years.length; i+=5 )
         {
           labels.push(years[i]);
         };
      labels.push(years[years.length-1]);

      for (var i = 0; i < labels.length; i++) {
        var change_label = sprintf.vsprintf('#%s > div.noUi-pips.noUi-pips-horizontal > div:nth-child(%d)', [idSlider, 2 * i + 2]);
        $(change_label).text(labels[i]);
     }
      }

      changePipLabel(this.idSlider, years);
    }

    // on update
    //add and update graphs when slider in updated
    sliderListener( data, myLineChart){
      var years_id_selected =[];
    this.timeSlider.noUiSlider.on('update', function(values, handle) {

      years_id_selected = this.get() /*this.timeSlider.noUiSlider.get()*/;

      years_id_selected[1] = Number(years_id_selected[1]);
      years_id_selected[2] = Number(years_id_selected[2]) + 1;

      myLineChart.updateTime(data,years_id_selected); // recover id of months selected
      //create graph for temperatureChart
      /*for (var i =0 ; i < panelChart.idCharts.length; i++){
        panelChart.drawLineChart(panelChart.dataCharts[i], years, years_id_selected, panelChart.colorCharts[i], panelChart.labelCharts[i], panelChart.idCharts[i], panelChart.titleCharts[i]);
      }*/


    });

  }



}
