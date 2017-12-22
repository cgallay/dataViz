import * as chart from 'chart.js';
import { DataManager } from './DataManager.js';
import * as d3 from 'd3';
import * as d3_scale from 'd3-scale';
import * as d3_scale_chromatic from 'd3-scale-chromatic';
import * as wNumb from 'wnumb';
import { min } from 'd3';
//Panel

export class LineChart {

    constructor(data_mean) {
        this.charts = [];
        this.colorscale = d3_scale_chromatic.schemeSet2;
        this.data_mean = data_mean.sort((a, b) => (a.dt) - (b.dt)).map(elem => {
            console.log(elem);
            return [{/*
                x: elem.dt,
                y: elem.AverageTemperature
            },{/*/
                x: elem.dt,
                y: elem.delta
            }, {//*/
                x: elem.dt,
                y: elem.CO2
            }, {
                x: elem.dt,
                y: elem.footprint/10000000
            }];
        });
    }

    addTo(div,id) {

        this.div = d3.select(div);
        this.canvas = this.div.append('canvas')
            .attr('width', window.innerWidth)
            .attr('id', id)
            .attr('responsive','true');
    }

    draw(years) {
        this.addTo("#temperatureChart","temperatureCanvas");
        this.addTo("#CO2Chart","CO2Canvas");

        this.drawLineChart("temperatureChart", 'Temperature [°C]', 'rgba(255,99,132,1)', ' °C', years);
        this.drawLineChart("CO2Chart", 'CO2 Emmissions [kt]', 'rgba(99,255,132,1)', ' kt', years);
        this.drawLineChart("footprintChart", 'Footprint', 'rgba(99,255,132,1)', 'GHA', years);
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
                    pointRadius: 0,
                    type: 'line'
                }
            ]
        };

        let option = {
            animation: false,
            maintainAspectRatio: true,
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
                        autoSkip: true
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem, chart) => {
                        let format = wNumb({
                            decimals: 1
                        });
                        let country = chart.datasets[tooltipItem.datasetIndex].label;
                        country = country.concat(": ");
                        let value = String(format.to(tooltipItem.yLabel));
                        let output = country.concat(value.concat(label));
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
                pointBackgroundColor: 'black',
                pointBorderColor: [],
                pointRadius: 0,
                spanGaps: true,
                type: 'line'
            };
        return dataset;
    }

    setWorldInfo() {

        for(let i = 0; i<this.charts.length; i++){

            let worldDataSet = this.getTemplateDataset()
            worldDataSet.label = 'World';
            worldDataSet.borderColor = this.colorscale[0];
            worldDataSet.backgroundColor = this.colorscale[0];
            

            if(i==0){
                this.charts[i].options.scales.yAxes[0].ticks.min = -1;
                this.charts[i].options.scales.yAxes[0].ticks.max = 2;
                worldDataSet.data = this.data_mean.map(elem => elem[i]);
            }
            else if (i==1){
                this.charts[i].options.scales.yAxes[0].ticks.min = 0;
                this.charts[i].options.scales.yAxes[0].ticks.max = 6;
                worldDataSet.data = this.data_mean.map(elem => elem[i]);
                console.log('test');
                console.log(worldDataSet.data);
            }
            else {
                this.charts[i].options.scales.yAxes[0].ticks.min = 0;
                this.charts[i].options.scales.yAxes[0].ticks.max = 12;
                worldDataSet.data = this.data_mean.map(elem => elem[i]);
            }

            this.charts[i].data.datasets = [worldDataSet];
            this.charts[i].options.legend.display = true;
            this.charts[i].update();
        }

    }

    updateData(chartData) {

        chartData.forEach((chart, i) => {

            let chartDatasets = [];

            let max_values = [];
            let min_values = [];
            
            if (chart.length > 0) {

                chart.forEach((country, index) => {
                    let lineDatasets = this.getTemplateDataset();
                    lineDatasets.data = country.value;
                    lineDatasets.label = country.name;
                    lineDatasets.borderColor = this.colorscale[index];
                    lineDatasets.backgroundColor = this.colorscale[index];


                    let value = country.value.map((elem) => parseFloat(elem.y)).filter((elem) => !isNaN(elem));

                    max_values.push(Math.max.apply(null, value));
                    min_values.push(Math.min.apply(null, value));

                    chartDatasets.push(lineDatasets);

                });

                this.charts[i].options.scales.yAxes[0].ticks.max = Math.max.apply(null, max_values);
                this.charts[i].options.scales.yAxes[0].ticks.min = Math.min.apply(null, min_values);
                
                this.charts[i].data.datasets = chartDatasets;
                this.charts[i].options.legend.display = true;
                this.charts[i].update();
            }
            else {

                this.setWorldInfo(chartData.length);
                
            }

        });

    }

    updateTime(years_selected) {

        this.charts.forEach((chartData) => {

            let chartDatasets = chartData.data.datasets;

            chartDatasets.forEach((dataset, i) => {

                let ind = dataset.data.findIndex((date) => {
                    return parseInt(date.x) == years_selected[1];
                });
                let pointRadius_vec = [];
                let pointBackgroundColor_vec = [];

                for (let j = 0; j < dataset.data.length; j++) {
                    pointRadius_vec.push(0);
                    pointBackgroundColor_vec.push('black');
                }
                pointRadius_vec[ind] = 3;
                pointBackgroundColor_vec[ind] = 'rgba(255,0,0,1)';

                dataset.pointRadius = pointRadius_vec;
                dataset.pointBackgroundColor = pointBackgroundColor_vec;

            });

            chartData.options.scales.xAxes[0].ticks.min = years_selected[0];
            chartData.options.scales.xAxes[0].ticks.max = years_selected[2];
            chartData.update();
        });
    }

}
