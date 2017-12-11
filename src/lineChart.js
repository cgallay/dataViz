import * as chart from 'chart.js';
import { DataManager } from './DataManager.js';
import * as d3 from 'd3';
import * as d3_scale from 'd3-scale';
import * as d3_scale_chromatic from 'd3-scale-chromatic';
import * as wNumb from 'wnumb';
//Panel

export class LineChart {

    constructor() {
        this.charts = [];
        this.colorscale = d3_scale_chromatic.schemeSet2;
    }

    draw(years) {
        this.drawLineChart("temperatureChart", 'Temperature [°C]', 'rgba(255,99,132,1)', ' °C', years);
        this.drawLineChart("CO2Chart", 'CO2 Emmissions [kt]', 'rgba(99,255,132,1)', ' kt', years);
    }

    drawLineChart(idLineChart, title, color, label, range) {
        let data = {
            datasets: [
                {
                    label: [],
                    data: [],
                    borderColor: [],
                    fill: false,
                    borderWidth: 1,
                    backgroundColor: [],
                    pointBackgroundColor: [],
                    /*pointBorderColor: [],
                    pointBorderWidth: 0,*/
                    pointRadius: 0,
                    type: 'line'
                }
            ]
        };

        let option = {
            animation: false,
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

                    position: 'bottom',
                    ticks: {
                        min: range[0],
                        max: range[range.length - 1],
                        minRotation: 45,
                        autoSkip: true

                    }


                }],

                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                        stepSize: 10
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var format=wNumb({
                          decimals: 1
                        });
                        var country = chart.datasets[tooltipItem.datasetIndex].label;
                        country = country.concat(": ");
                        var value = String(format.to(tooltipItem.yLabel));
                        console.log("value");
                        console.log(format.to(tooltipItem.yLabel));
                        var output = country.concat(value.concat(label));
                        return output;
                    }
                }
            }
        };

        let ctx = document.getElementById(idLineChart);
        let myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: option
        });
        this.charts.push(myChart);

    }

    getTemplateDataset() {

        let dataset =
            {
                label: [],
                data: [],
                borderColor: [],
                fill: false,
                borderWidth: 1,
                pointBackgroundColor: [],
                pointBorderColor: [],
                pointRadius: 1,
                spanGaps: true,
                type: 'line'
            };
        return dataset;
    }




    updateData(data, countries) {

        for (let i = 0; i < data.length; i++) // iterate on the two charts :temp and co2
        {
            var chartDatasets = [];
            var chartData = data[i]; //multiple curves
            for (let j = 0; j < data[i].length; j++) { // iterate on the #curves i.e #countries selected
                var lineDatasets = this.getTemplateDataset();
                lineDatasets.data = chartData[j];// 1 curve;
                lineDatasets.label = countries[j];
                lineDatasets.borderColor = this.colorscale[j];
                lineDatasets.backgroundColor = this.colorscale[j];
                chartDatasets = chartDatasets.concat(lineDatasets);
            };
            this.charts[i].data.datasets = chartDatasets;
            this.charts[i].options.legend.display = true;
            this.charts[i].update(/*{duration: 5000}*/);
        }
    }

    updateTime(data, years_selected) {
        for (let i = 0; i < data.length; i++) // iterate on chart , temp and co2
        {
            let chartDatasets = this.charts[i].data.datasets;

            let chartData = data[i];// multiple curves
            for (let j = 0; j < data[i].length; j++) { //iterate on curves
                //find value for which x=years_selected[1]!
                function findObject(element) {
                    return element.x == years_selected[1];
                }
                let lineData = chartData[j];
                let ind = lineData.findIndex(findObject);
                let data_timeSelector = lineData[ind];

                let zero_vec = [];
                let color_vec = [];
                for (let k = 0; k < lineData.length; k++) {
                    zero_vec.push(1);
                    color_vec.push(this.colorscale[j]);
                }
                let pointRadius_vec = zero_vec;
                pointRadius_vec[ind] = 3;
                let pointBackgroundColor_vec = color_vec;
                pointBackgroundColor_vec[ind] = 'rgba(255,0,0,1)';
                let pointBorderColor_vec = pointBackgroundColor_vec;
                chartDatasets[j].pointRadius = pointRadius_vec;
                chartDatasets[j].pointBackgroundColor = pointBackgroundColor_vec;
                chartDatasets[j].pointBorderColor = pointBorderColor_vec;
            }
            /*this.charts[i].update({duration:0});*/

            //range of x axis of charts -> zoom on selected range
            this.charts[i].options.scales.xAxes[0].ticks.min = years_selected[0];
            this.charts[i].options.scales.xAxes[0].ticks.max = years_selected[2];
            this.charts[i].update(/*{duration: 2000}*/);


        }

    }

}
