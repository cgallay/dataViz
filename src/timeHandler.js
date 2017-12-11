import * as noUiSlider from 'nouislider';
import * as sprintf from 'sprintf-js';
import * as d3 from 'd3';
import * as wNumb from 'wnumb';

var $ = require("jquery");


//slider
export class TimeSlider {

    constructor(){
      this.playPauseButtonAnimation();
    }

    addTo(div){
      this.timeSlider=document.getElementById(div);
    }



    //function to create slider
    createSlider(years){
      //create noUISlider
      noUiSlider.create(this.timeSlider, {
        //place handler to 0%, 50% and 100%
        start: [years[0],years[Math.round(years.length / 2)],years[years.length - 1]],
        connect: [false, true, true, false],
        step: 1,
        tooltips: true,
        format: wNumb({
        		decimals: 0
        	}),
        //set range of slider to min and max years
        range: {
          'min':Number(years[0]),
          'max':Number(years[years.length - 1])
        },
        animate: true,
        animationDuration: 400
      }).on('update', function(values, handle) {
        var years_selected= this.getYears()
        //update
        if(this.selectListener) {
          this.selectListener(years_selected);
        }

      }.bind(this));

      //TimeSelector = second handle , design it :
      d3.selectAll('.noUi-handle').filter(function(d, i) {
          if (i == 1) {
            return i;
          }
        })
        .style("width", "2px")
        .style("height","70px")
        .classed(" timeSelector ", true)
        .style("position","relative").style("left","-1px").style("top","-30px")
        .style("content","none")
        .style("border-color","#F00");

      //Design the Range handles
      d3.selectAll('.noUi-handle-upper').classed(" noUi-extended ", true);
      d3.selectAll('.noUi-handle-lower').classed(" noUi-extended ", true);
      d3.selectAll('.noUi-extended').style("height", "24px").style("width", "16px").style("position","relative").style("top","-5px").style("left","-8px");

    }

    // get Years selected by slider (this function not only use in the update of the slider
    //let it be !)
    getYears(){
      var years_selected= this.timeSlider.noUiSlider.get();
      years_selected[0]=Number(years_selected[0]);
      years_selected[1]=Number(years_selected[1]);
      years_selected[2]=Number(years_selected[2]);
      return years_selected;
    }

    addSelectListener(listener){
        this.selectListener = listener;
      }

    //function to add animation to th play button
    playPauseButtonAnimation(){
      var slider=this;
      /*Play Pause button animation*/
      $('.control').on('mousedown', function() {
        console.log("hello1");
          $(this).toggleClass('pause play');

          console.log("button animation this");
          console.log(slider);
          slider.animateTimeSelector();
        });

        $(document).on('keyup', function(e) {

          if (e.which == 32) {

            $('.control').toggleClass('pause play');
          }
        });
      /*End Play Pause button animation*/
    };

    animateTimeSelector(){

       var pos = 0;
       var id = setInterval(frame, 5);
       console.log("animate time selector this");
       console.log(this);

       var limits=this.timeSlider.noUiSlider.get();
       var start = Number(limits[0]);
       var selector_start = Number(limits[1]);
       var end = Number(limits[2]);
       var selector;

       function frame() {
           if (selector == end){

              $('.control').toggleClass('pause play');
               clearInterval(id);
               console.log("hello end");
           } else {
                pos++;
                selector=selector_start+pos;
               this.timeSlider.noUiSlider.set([start,selector,end]);


           }

         }
    }
  }
