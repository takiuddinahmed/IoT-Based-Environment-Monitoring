import React, {useState} from 'react';

import CanvasJSReact from '../assets/canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default function SingleChart({title, axisY, axisX, data}){
    console.log(data)
    const options = {
        // animationEnabled: true,
        exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: title
			},
			axisY: {
				title: axisY,
				includeZero: false
			},
			axisX: {
				title: axisX,

			},
            data : [{
                type: "spline",
                tooolTipContent: "data {x}: {y}",
                xValueType:"dateTime",
                dataPoints : data

            }]
    }

    return(
        <div className="mt-5">
            <CanvasJSChart options={options}
            />
        </div>
    )


}