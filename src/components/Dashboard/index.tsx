import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: true,
      text: 'Conversion Rate',
    },
  },
};

const fetchTestData = async () => {
  const res = await fetch("./data/test_data_1.json")
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  const data = await res.json();
  const labels = ["show-banner", "hide-banner"]
  const colors = ["rgba(255, 99, 132, 0.5)", "rgba(53, 162, 235, 0.5)"]
  const chartData = {
    labels: ['Bundle Banner New'],
    datasets: data.map((d: any, i: number) => ({
      label: labels[i],
      data: [d.converted * 100], // to percentage
      backgroundColor: colors[i]
    }))
  }
  console.log(chartData)
  return chartData
}

export default function App() {

  const [chartData, setChartData] = React.useState<any | undefined>(undefined)
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTestData()
      setChartData(data)
    }
    fetchData()
  }, [])
  return (
    <div className='grid grid-cols-2 gap-2'>
      {
        chartData && 
        <div>
          <Bar options={options} data={chartData} />
        </div>
      }
    </div>
  )
}