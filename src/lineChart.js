import * as chart from 'chart.js';
import { DataManager } from './DataManager.js';
import * as d3 from 'd3';
//Panel

export class LineChart {

  constructor(){
    this.charts =[];
  }

  get(){
    let charts=this.charts;
    let initData=[0];
    this.drawLineChart("temperatureChart",'Temperature [°C]','rgba(255,99,132,1)', ' °C',charts);
    this.drawLineChart("CO2Chart",'CO2 Emmissions [kt]','rgba(99,255,132,1)',' kt',charts);
  }

  drawLineChart(idLineChart,title, color, label, charts) {
    let data = {
      datasets:[]
    };

    let option = {
      animation:false,
      legend: {
        display: true
      },
      title: {
        display: true,
        text: title
      },
      scales: {
        xAxes: [{
                type: 'linear',

                position: 'bottom',
                ticks:{
                  minRotation: 45,
                  stepSize:20
                },

            }],

        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };

    let ctx = document.getElementById(idLineChart);
    let myChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: option
    });
    charts.push(myChart);

  }

   getTemplateDatasets(color,color_point,label_chart,label_country){
     var template=[
    {
      label:label_country,
      data:[],
      pointBackgroundColor: color_point,
      pointRadius: 4,
      type:'scatter'
    },
    {
      label: label_chart,
      data: [],
      borderColor: color,
      fill: false,
      borderWidth: 1,
      pointBackgroundColor: color,
      pointBorderColor: color,
      pointBorderWidth: 0,
      pointRadius: 0,
      type: 'line'
    }

  ];
  return template;
}


updateData(data,countries){  // data=[temp,co2]

  for(let i=0; i < data.length; i++) // iterate on the two charts :temp and co2
  {
    let label_chart;
    let color;
    let color_point;
    if (i==0){ //temp
      label_chart= ' °C';
    }
    else{ //co2
      label_chart='kt';
    }

    let chartDatasets =[];
    let chartData=data[i]; //multiple curves
    for(let j =0; j < data[i].length; j++){ // iterate on the #curves i.e #countries selected

      if (j==0){ //temp
        color = 'rgba(255,99,132,1)';
        color_point = 'rgba(255,0,0,1)';
      }
      else{ //co2
        color='rgba(99,255,132,1)';
        color_point='rgba(0,255,0,1)';
      }

      var lineDatasets=this.getTemplateDatasets(color,color_point,label_chart, countries[j]);
      lineDatasets[1].data= chartData[j];// 1 curve
      chartDatasets= chartDatasets.concat(lineDatasets);
    };
    this.charts[i].data.datasets = chartDatasets;
    this.charts[i].update();
  }
  console.log("UpdateData datasets");
  console.log(this.charts[0].data.datasets);

}

updateTime(data, years_selected){
  for (let i = 0; i < data.length; i++) // iterate on chart , temp and co2
  {
    //range of x axis of charts -> zoom on selected range
    this.charts[i].options.scales.xAxes[0].ticks.min = years_selected[0];
    this.charts[i].options.scales.xAxes[0].ticks.max = years_selected[2];


    let chartDatasets=this.charts[i].data.datasets;
    console.log("chartDatasets update time");
    console.log(chartDatasets);
    let chartData=data[i];// multiple curves
    for(let j =0; j < data[i].length; j++){ //iterate on curves
        //find value for which x=years_selected[1]!
        function findObject(element){
          return element.x==years_selected[1];
        }
        let lineData=chartData[j];
        let ind = lineData.findIndex(findObject);
        let data_timeSelector=lineData[ind];
        console.log("j");
        console.log(j);
        console.log("2*j");
        console.log(2 * j);
        var k =2 * j;
        chartDatasets[k].data= [data_timeSelector];
      }
    this.charts[i].update();
  }
  console.log("Updatetimedatasets");
  console.log(this.charts[0].data.datasets);

}

}
