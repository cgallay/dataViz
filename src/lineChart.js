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
      datasets: [
        {
          label:label,
          data:[],
          pointBackgroundColor: 'rgba(255,0,0,1)',
          pointRadius: 4,
          type:'scatter'
        },
        {
          label: label,
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

      ]
    };

    let option = {
      animation:false,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title
      },
      scales: {
        xAxes: [{
                type: 'linear',
                position: 'bottom'
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


updateData(data){  // data=[temp,co2]

  for(let i=0; i < data.length; i++)
  {
  this.charts[i].data.datasets[1].data= data[i];
  this.charts[i].update();
  }

}

updateTime(data, years_selected){
  for (let i = 0; i < data.length; i++)
  {
    //range of x axis of charts -> zoom on selected range
    this.charts[i].options.scales.xAxes[0].ticks.min = years_selected[0];
    this.charts[i].options.scales.xAxes[0].ticks.max = years_selected[2];


    //this.charts[i].data.datasets[0].data=data[i][years_selected[1]];
    //find value for which x=years_selected[1]!=


    function findObject(element){
      return element.x==years_selected[1];
    }
    var Data=data[i];
    console.log("Data");
    console.log(Data);
    let ind = Data.findIndex(findObject);
    let data_timeSelector=Data[ind];
    console.log("ind");
    console.log(ind)
    console.log("data time selector");
    console.log(data_timeSelector);

    this.charts[i].data.datasets[0].data= [data_timeSelector];
    this.charts[i].update();
    }

}

}
