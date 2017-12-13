import * as chart from 'chart.js';
import { DataManager } from './DataManager.js';
import * as d3 from 'd3';
import * as d3_scale from 'd3-scale';
import * as d3_scale_chromatic from 'd3-scale-chromatic';
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
                        var country = chart.datasets[tooltipItem.datasetIndex].label;
                        country = country.concat(": ");
                        var value = String(tooltipItem.yLabel);
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

    updateData(chartData) {
        console.log('updating data !!');
        chartData.forEach((chart, i) => {

            let chartDatasets = [];

            chart.forEach((country, index) => {
                let lineDatasets = this.getTemplateDataset();
                lineDatasets.data = country.value;
                lineDatasets.label = country.name;
                lineDatasets.borderColor = this.colorscale[index];
                lineDatasets.backgroundColor = this.colorscale[index];
                chartDatasets.push(lineDatasets);
            });

            this.charts[i].data.datasets = chartDatasets;
            this.charts[i].options.legend.display = true;
            this.charts[i].update();
        });

    }

    updateTime(years_selected) {

        console.log('updating time !!');
        this.charts.forEach((chartData) => {
            let chartDatasets = chartData.data.datasets;

            chartDatasets.forEach((dataset, i) => {

                let ind = dataset.data.findIndex((date) => {
                    return parseInt(date.x) == years_selected[1];
                });
                let pointRadius_vec = [];
                let pointBackgroundColor_vec = [];

                for (let j = 0; j < dataset.data.length; j++) {
                    pointRadius_vec.push(1);
                    pointBackgroundColor_vec.push(this.colorscale[i]);
                }
                pointRadius_vec[ind] = 3;
                pointBackgroundColor_vec[ind] = 'rgba(255,0,0,1)';

                
                dataset.pointRadius = pointRadius_vec;
                dataset.pointBackgroundColor = pointBackgroundColor_vec;
                dataset.pointBorderColor = pointBackgroundColor_vec;
            });

            chartData.options.scales.xAxes[0].ticks.min = years_selected[0];
            chartData.options.scales.xAxes[0].ticks.max = years_selected[2];
            chartData.update();
        });
    }

}
