import React from 'react'
import { Chart } from 'react-google-charts';
import './chart.css'

const Pure = (props) => {
  const {
    title,
    chartType,
    data,
    isStacked = false,
    width = '500px',
    height = '300px'
  } = props
  return (
    <div className="chartContainer">
      <h3>{title}</h3>
      <Chart
        width={width}
        height={height}
        chartType={chartType}
        data={data}
        options={{
          isStacked,
          legend: {
            position: 'none'
          }
        }}
      />
    </div>)
}


export default Pure
