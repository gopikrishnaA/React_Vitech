import React from 'react'
import './resultTable.css'

const ResultTable = (props) => {
  const { width = '100%',
    title,
    data = {
      tableHeads: []
    } } = props
  return (
    <div className='resultTable' style={{ width: width }}>
      <h3 className='h1'>{title}</h3>
      <table cellPadding='10' cellSpacing='0' className='summery-table'>
        <thead>
          <tr>
            {data['tableHeads'].map((key, i) => <th key={`${key}-${i}`}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
         {Object.keys(data).map((item, i) => {
            return (item !== 'tableHeads' && <tr key={`${item}-${i}`}>
              {Object.keys(data[item]).map(elem => <td key={`${data[item]}${elem}`}>{data[item][elem]}</td>)}
            </tr>)
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ResultTable