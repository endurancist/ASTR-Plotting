'use strict';


import Chart from "chart.js/auto";
import Handsontable from "handsontable";

import { tableCommonOptions, colors } from "./config"
import { updateLabels, updateTableHeight } from "./util"
import { round } from "./my-math"
import { ChartConfiguration } from "chart.js";


/**
 * 
 * @returns {[Handsontable, Chart]}
 */
export function spectrum(): [Handsontable, Chart] {
    document.getElementById('input-div').insertAdjacentHTML('beforeend',
        '<form title="Spectrum" id="spectrum-form" style="padding-bottom: 1em">\n' +
        '<div class="row">\n' +
        '<div class="col-sm-7">Select Channel: </div>\n' +
        '<div class="col-sm-5"><select name="channel" style="width: 100%;" title="Select Channel">\n' +
        '<option value="x" title="Channel 1" selected>Channel 1</option>\n' +
        '<option value="y" title="Channel 2">Channel 2</option>\n' +
        '</select>\n' +
        '</div>\n' +
        '</form>'
    );
    // let standardViewRadio = document.getElementById("standardView") as HTMLInputElement;
    // let frameOnDataRadio = document.getElementById("frameOnData") as HTMLInputElement;
    // let panLeft = document.getElementById("panLeft") as HTMLInputElement;
    // let panRight = document.getElementById("panRight") as HTMLInputElement;
    // let zoomIn = document.getElementById('zoomIn') as HTMLInputElement;
    // let zoomOut = document.getElementById('zoomOut') as HTMLInputElement;

    // standardViewRadio.addEventListener("click", () => {
    //     radioOnclick(standardViewRadio, frameOnDataRadio);
    //   });
    //   frameOnDataRadio.addEventListener("click", () => {
    //     radioOnclick(frameOnDataRadio, standardViewRadio)
    //   });
    //   let pan: number;
    //   panLeft.onmousedown = function() {
    //     pan = setInterval( () => {myChart.pan(1)}, 20 )
    //   }
    //   panLeft.onmouseup = panLeft.onmouseleave = function() {
    //     clearInterval(pan);
    //   }
    //   panRight.onmousedown = function() {
    //     pan = setInterval( () => {myChart.pan(-1)}, 20 )
    //   }
    //   panRight.onmouseup = panRight.onmouseleave = function() {
    //     clearInterval(pan);
    //   }
    
    //   //handel zoom/pan buttons
    //   let zoom: number;
    //   zoomIn.onmousedown = function() {
    //     zoom = setInterval(()=>{myChart.zoom(myChart.getZoomLevel()+0.05);}, 200);;
    //   }
    //   zoomIn.onmouseup = zoomIn.onmouseleave = function() {
    //     clearInterval(zoom);
    //   }
    //   zoomOut.onmousedown = function() {
    //     zoom = setInterval(()=>{myChart.zoom(myChart.getZoomLevel()-0.05);}, 200);;
    //   }
    //   zoomOut.onmouseup = zoomOut.onmouseleave = function() {
    //     clearInterval(zoom);
    //   }
    //   function radioOnclick(radioOnClicked: HTMLInputElement, otherRadio: HTMLInputElement): any {
    //     radioOnClicked.checked = true;
    //     setRadioLabelColor(radioOnClicked, true)
    //     otherRadio.checked = false;
    //     setRadioLabelColor(otherRadio, false)
    
    //     graphScaleMode = radioOnClicked.id === "standardView" ? "auto" : "data"
    //     chartRescale(myChart, modelForm)
    //   }
    
    //   //Alter radio input background color between Carolina blue and white
    //   function setRadioLabelColor(radio: HTMLInputElement, activate: boolean) {
    //     document.getElementById(radio.id + "Label").style.backgroundColor = activate ? "#4B9CD3" : "white"
    //   }
    
    //   //Unchecked and reset both radio buttons to white background
    //   function zoompanDeactivate(): any {
    //     graphScaleMode = null
    //     standardViewRadio.checked = false;
    //     frameOnDataRadio.checked = false;
    //     setRadioLabelColor(standardViewRadio, false)
    //     setRadioLabelColor(frameOnDataRadio, false)
    //     setTimeout(function () {
    //       myChart.data.datasets[2].backgroundColor = HRrainbow(myChart,
    //         modelForm["red"].value, modelForm["blue"].value)
    //       myChart.update()
    //     }, 5)
    //   }









    const tableData = [];
    for (let i = 0; i < 200; i++) {
        let wl = i / 200 * 0.03 + 21.09;
        tableData.push({
            'wl': wl,
            'x': 100 - Math.pow(100 * (wl - 21.105), 2) / 0.015 + Math.random() * 21,
            'y': 100 - Math.pow(100 * (wl - 21.105), 2) / 0.015 + Math.random() * 21,
        });
    }

    const container = document.getElementById('table-div');
    const tableOptions: Handsontable.GridSettings = {
        data: tableData,
        colHeaders: ['Wavelength', 'Channel 1', 'Channel 2'],
        maxCols: 3,
        columns: [
            { data: 'wl', type: 'numeric', numericFormat: { pattern: { mantissa: 4 } } },
            { data: 'x', type: 'numeric', numericFormat: { pattern: { mantissa: 2 } } },
            { data: 'y', type: 'numeric', numericFormat: { pattern: { mantissa: 2 } } },
        ],
    };
    const hot = new Handsontable(container, { ...tableCommonOptions, ...tableOptions });

    const ctx = (document.getElementById("myChart") as HTMLCanvasElement).getContext('2d'); // the Curser
    // curser options
    const chartOptions: ChartConfiguration = {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Channel 1',
                    data: [],
                    borderColor: colors['blue'],
                    backgroundColor: colors['white-0'],
                    borderWidth: 2,
                    tension: 0.1,
                    fill: false,
                    hidden: false,

                }, {
                    label: 'Channel 2',
                    data: [],
                    borderColor: colors['red'],
                    backgroundColor: colors['white-0'],
                    borderWidth: 2,
                    tension: 0.1,
                    fill: false,
                    hidden: true,

                }
            ]
        },
        options: {
            elements: {
                point:{
                    radius: 3
                }
            },
            plugins: {
                zoom: {
                    pan: {
                      enabled: true,
                      mode: 'x',
                    },
                    zoom: {
                      wheel: {
                        enabled: true,
                      },
                      mode: 'x',
                    },
                  },
                legend: {
                    labels: {
                        filter: function (legendItem) {
                            return !legendItem.hidden;
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return '(' + round(context.parsed.x, 4) + ', ' +
                                round(context.parsed.y, 2) + ')';
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    };

    const myChart = new Chart(ctx, chartOptions) as Chart<'line'>;

    const update = function () {
        updateSpectrum(hot, myChart);
        updateTableHeight(hot);
    };

    hot.updateSettings({
        afterChange: update,
        afterRemoveRow: update,
        afterCreateRow: update,
    });

    const spectrumForm = document.getElementById("spectrum-form") as SpectrumForm;
    spectrumForm.onchange = function () {
        let channel = spectrumForm.elements["channel"].value;
        if (channel === "x") {
            myChart.data.datasets[0].hidden = false;
            myChart.data.datasets[1].hidden = true;
        } else {
            myChart.data.datasets[0].hidden = true;
            myChart.data.datasets[1].hidden = false;
        }
        myChart.update('none');
        updateLabels(myChart, document.getElementById('chart-info-form') as ChartInfoForm, true);
    }

    myChart.options.plugins.title.text = "Title";
    myChart.options.scales['x'].title.text = "x";
    myChart.options.scales['y'].title.text = "y";
    updateLabels(myChart, document.getElementById('chart-info-form') as ChartInfoForm, true);

    updateSpectrum(hot, myChart);
    updateTableHeight(hot);

    return [hot, myChart];
}
/**
 * This function takes the updated value from the table and uses it to update the chart.
 * @param {Handsontable} table Handsontable object
 * @param {Chart} myChart Chartjs object
 */
function updateSpectrum(table: Handsontable, myChart: Chart) {
    for (let i = 0; i < 2; i++) {
        myChart.data.datasets[i].data = [];
    }

    const tableData = table.getData();
    let src1Data = [];
    let src2Data = [];

    for (let i = 0; i < tableData.length; i++) {
        if (isNaN(parseFloat(tableData[i][0]))) continue;
        if (!isNaN(parseFloat(tableData[i][1]))) {
            src1Data.push({
                "x": tableData[i][0],
                "y": tableData[i][1],
            })
        }
        if (!isNaN(parseFloat(tableData[i][2]))) {
            src2Data.push({
                "x": tableData[i][0],
                "y": tableData[i][2],
            })
        }
    }



    myChart.data.datasets[0].data = src1Data;
    myChart.data.datasets[1].data = src2Data;
    myChart.options.scales = {
        x: {
            type: 'linear',
            position: 'bottom'
        }
    }
    // console.log('mark')
    if (src1Data[0].x > 3000){
        myChart.options.elements.point.radius = 0;
        myChart.data.datasets[0].borderWidth = 1;
        myChart.data.datasets[1].borderWidth = 1;
    }else{
        myChart.options.elements.point.radius = 3;
        myChart.data.datasets[0].borderWidth = 2;
        myChart.data.datasets[1].borderWidth = 2;
    }
    myChart.update();

    const spectrumForm = document.getElementById("spectrum-form") as SpectrumForm;
    spectrumForm.elements["channel"].selectedIndex = 0;
    spectrumForm.onchange(null);

    myChart.update('none');
}

/**
 * This function handles the uploaded file to the spectrum chart. Specifically, it parse the file
 * and load related information into the table.
 * DATA FLOW: file -> table
 * @param {Event} evt The uploadig event
 * @param {Handsontable} table The table to be updated
 * @param {Chart} myChart
 */
export function spectrumFileUpload(evt: Event, table: Handsontable) {
    // console.log("spectrumFileUpload called");
    const file = (evt.target as HTMLInputElement).files[0];
    if (file === undefined) {
        return;
    }

    // File type validation
    if (!file.type.match("text/plain") ||
        !file.name.match(".*\.txt")) {
        console.log("Uploaded file type is: ", file.type);
        console.log("Uploaded file name is: ", file.name);
        alert("Please upload a .txt file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        let data = (reader.result as string).split("\n");
        data = data.filter(str => (str !== null && str !== undefined && str !== ""));
        var theFrequencyInfoString = data.filter(str => str.slice(0,14)== '#      OBSFREQ')[0];
        // console.log(theFrequencyInfoString);

        data = data.filter(str => (str[0] !== '#'));
        var theFrequencyInfo = parseFloat(theFrequencyInfoString.slice(15, theFrequencyInfoString.length));
        // console.log(theFrequencyInfo);
        const tableData = [];
        var whetherObtical = 0;
        if (300000000 <= theFrequencyInfo && theFrequencyInfo<= 800000000){
            whetherObtical = 1
        };
        // console.log(whetherObtical);
        if (! whetherObtical){
            for (let i = 0; i < data.length; i++) {
                "Use regular expression `/\s+/` to handle more than one space"
                let entry = data[i].trim().split(/\s+/);

                let wl = freqToWL(parseFloat(entry[0]));
                let x = parseFloat(entry[1]);
                let y = parseFloat(entry[2]);
                if (isNaN(wl) || isNaN(x) || wl < 21.085 || wl > 21.125) {
                    continue;
                }
                if (isNaN(y)) {
                    tableData.push({
                        "wl": wl,
                        "x": x,  
                    })
                }else{
                    tableData.push({
                        "wl": wl,
                        "x": x,
                        "y": y,  
                    })
                };

        }}else{
            for (let i = 0; i < data.length; i++) {
                "Use regular expression `/\s+/` to handle more than one space"
                let entry = data[i].trim().split(/\s+/);

                let wl = parseFloat(entry[0]);
                // console.log(wl)
                let x = parseFloat(entry[1]);
                // console.log(x)
                let y = parseFloat(entry[2]);
                // console.log(y)
                if(isNaN(wl) || isNaN(x) || wl < 4966  || wl > 6545.6){
                    continue;

                }
                if (isNaN(y)) {
                    tableData.push({
                        "wl": wl,
                        "x": x,  
                    })
                }else{
                    tableData.push({
                        "wl": wl,
                        "x": x,
                        "y": y,  
                    })
                };
            }
        };
        
        // console.log(tableData);
        tableData.sort((a, b) => a.wl - b.wl);
        // console.log(tableData);
    

        
        tableData.sort((a, b) => a.wl - b.wl);


        const spectrumForm = document.getElementById("spectrum-form") as SpectrumForm;
        spectrumForm.elements['channel'].selectedIndex = 0;

        // Need to put this line down in the end, because it will trigger update on the Chart, which will 
        // in turn trigger update to the variable form and the light curve form, which needs to be cleared
        // prior to being triggered by this upload.
        table.updateSettings({ data: tableData });
    }
    reader.readAsText(file);
}

const c = 299792458;
/**
 * This function converts a specific light wave's frequency, in MHz, to its corresponding wavelength, in cm.
 * @param {number} freq The frequency of the light in MHz
 */
function freqToWL(freq: number): number {
    return c / (freq * 1e4);
}

/**
 * This function converts a wavelength in cm to its frequency in MHz
 * @param {number} wl The wavelength of the light in centimeters
 */
// function wlToFreq(wl: number): number {
//     return c / (wl * 1e4)
// }