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
    let temperature=[0]; // dataset, years_id_selected, years
    let co2=[0];
    let years=[0];
    let  years_id_selected=[0,0,0];
    this.drawLineChart(temperature,years, years_id_selected,"temperatureChart",'Temperature [°C]','rgba(255,99,132,1)', ' °C',charts);
    this.drawLineChart(co2, years, years_id_selected,"CO2Chart",'CO2 Emmissions [kt]','rgba(99,255,132,1)',' kt',charts);
  }

  drawLineChart(dataset,years, years_id_selected,idLineChart,title, color, label, charts) {
    console.log("Hello from drawlinechart")
    let data = {
      labels: years.slice(years_id_selected[0], years_id_selected[2]),
      datasets: [
        {
          label:label,
          data: [{
            x: years[years_id_selected[1]],
            y: dataset[years_id_selected[1]]
          }],
          pointBackgroundColor: 'rgba(255,0,0,1)',
          pointRadius: 4,
          type:'scatter'
        },
        {
          label: label,
          data: dataset.slice(years_id_selected[0], years_id_selected[2]),
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
          type: 'category',
          labels: years.slice(years_id_selected[0], years_id_selected[2])
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };

    let ctx = document.getElementById(idLineChart);
    console.log("ctx:")
    console.log(ctx)
    let myChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: option
    });
    charts.push(myChart);

  }


updateData(data){  // data=[temp,co2]

  console.log(data);
  for(let i=0; i < data.length; i++)
  {
  var value= data[i].sort(DataManager.compareDate).map(d => d.temp);
  /*years= data[i].sort(DataManager.compareDate).map(d => d.x);*/
  console.log("updatedata");
  console.log(value);
  this.charts[i].data.datasets[1].data= value;
  this.charts[i].update();
  console.log(this.charts[i].data.datasets[1].data)

  /*this.charts[i].data.labels =  years;*/
  }
}

updateTime(data, years_id_selected){

  console.log("years selected")
  console.log(years_id_selected);
  for (let i = 0; i < data.length; i++)
  {
    var years =data[i].sort(DataManager.compareDate).map(d => d.dt);
    this.charts[i].data.labels =  years.slice(years_id_selected[0], years_id_selected[2]);
    this.charts[i].data.datasets[1].data= this.charts[i].data.datasets[1].data.slice(years_id_selected[0], years_id_selected[2]);
    this.charts[i].data.datasets[0].data.x=years[years_id_selected[1]];
    this.charts[i].data.datasets[0].data.y=this.charts[i].data.datasets[1].data[years_id_selected[1]];
    this.charts[i].update();
    }
}

}
