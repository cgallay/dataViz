import * as chart from 'chart.js';
import * as d3 from 'd3';
//Panel

export class PanelChart {

      constructor(){
        this.dataCharts=[];
        this.idCharts=[];
        this.titleCharts=[];
        this.colorCharts=[];
        this.labelCharts=[];
      }

    //create or select canvas
    createCanvas(data,idLineChart,title,color,label){
      //save id of the chart
      this.dataCharts.push(data);
      this.idCharts.push(idLineChart);
      this.titleCharts.push(title);
      this.colorCharts.push(color);
      this.labelCharts.push(label);

      let myPanel = d3.select("#panel");

      if(myPanel.select(idLineChart).empty()){
        //if no canvas with wanted id , create it
        myPanel.append("canvas")
                  .attr("id", idLineChart);
      }else{
        //if canvas with wanted id, select it
        myPanel.select(idLineChart);
      }
    }
    //create chart
  
     makeLineChart(dataset, years, years_id_selected, color, label, idLineChart, title) {
      var data = {
        labels: years.slice(years_id_selected[0], years_id_selected[2]),
        datasets: [
          {

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

      var option = {
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

      var ctx = document.getElementById(idLineChart);
      var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: option
      });

    }
}
