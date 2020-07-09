import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2';

export const Graphs = () => {
    const [graphData, setGraphData] = useState([])
    useEffect(() => {
        async function fetchData() {
            const fetched = await fetch('https://covid19.mathdro.id/api/daily');
            const data = await fetched.json();
            const modifiedData = data.map((data) => ({
                confirmed: data.confirmed.total,
                deaths: data.deaths.total,
                date: data.reportDate,
            }))
            setGraphData(modifiedData);
        }
        fetchData();
    }, [])
    const lineChart = (
        graphData.length ? (
            <Line data={{
                labels: graphData.map(({ date }) => date),
                datasets: [{
                    data: graphData.map(({ confirmed }) => confirmed),
                    label: 'Infected',
                    borderColor: '#3333ff',
                    fill: true,
                },
                {
                    data: graphData.map(({ deaths }) => deaths),
                    label: 'Deaths',
                    borderColor: 'red',
                    backgroundColor: 'rgb(187, 147, 147)',
                    fill: true,
                }]
            }}
                options={{
                    title: { display: true, text: `Daily Cases & Deaths in the World` }
                }} />) : null
    )
    return (
        <div className='line-chart'>
            {lineChart}
        </div>
    )
}
