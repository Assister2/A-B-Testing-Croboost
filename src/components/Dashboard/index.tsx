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
import { loadTokens } from "../../utils"
import {
  ABTest,
  getTests,
  createTest,
  deleteTest,
  updateTest,
} from "../../client/abtest"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
  const [currentData, setCurrentData] = React.useState<ABTest[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTestData()
      setChartData(data)
    }
    fetchData()
  }, [])



  useEffect(() => {
    const tokens = loadTokens()
    if (tokens) {
      getTests(tokens.id_token)
        .then((tests) => {
          tests.sort((a, b) => {
            return new Date(b.iso_created_at).getTime() - new Date(a.iso_created_at).getTime();
          });
          setCurrentData(tests)
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      window.location.href = "/login"
    }
  }, [])


  const formatISODate = (isoDate:any) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (

    <div className="p-5 bg-main min-w-screen min-h-screen">
      <h5 className="mb-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white ml-4">Current A/B Tests</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-6 gap-3 ml-4">
        {currentData.map((test, index) => (
          <Card className="w-full rounded-xl" key={index}>
            <CardHeader>
              <CardTitle className='text-2xl font-normal capitalize'>{test.title} Test</CardTitle>
              <CardDescription>{formatISODate(test.iso_created_at)}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className='rounded-full bg-blue-800 text-white text-xs px-6 py-2 hover:bg-blue-700 hover:text-white border-0'>View Data</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className='grid grid-cols-2 gap-2'>
        {
          chartData &&
          <div>
            <Bar options={options} data={chartData} />
          </div>
        }
      </div>
    </div>

  )
}