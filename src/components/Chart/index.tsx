import React, { useEffect } from 'react'
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
  import { loadTokens } from "../../utils"
  import {
    ABTest,
    getChartData,
  } from "../../client/abtest"


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
    const res = await fetch("../../../public/data/test_data_1.json")
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    const data = await res.json();
    // console.log("outdata",data)
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
    console.log("------out", chartData)
    return chartData
  }

const Chart = (id:any) => {
    const [chartData, setChartData] = React.useState<any | undefined>(undefined)


    // useEffect(() => {
    //     const tokens = loadTokens();
    //     if (tokens) {
    //         getChartData(tokens.id_token, "80242517-ac80-4b41-8318-b7197599ceba")
    //         .then((tests) => {
    //             const { test_name, epoch, data, test_id } = tests;
    //             const parsedData = JSON.parse(data);

    //             const finalData:any = []

    //             parsedData?.map((data:any) =>{
    //                 finalData?.push({
    //                     event_count : Number(data?.Average_Event_Count),
    //                     duration_seconds: Number(data?.Average_Session_Duration),
    //                     converted: Number(data?.Average_Conversion_Rate)
    //                 })
    //             })

    //             // console.log("111111111", finalData)

    //             const labels = ["show-banner", "hide-banner","test-banner"]
    //             const colors = ["rgba(255, 99, 132, 0.5)", "rgba(53, 162, 235, 0.5)","rgba(53, 162, 235, 0.5)"]
    //             const chartData = {
    //                 labels: ['Bundle Banner New'],
    //                 datasets: finalData.map((d: any, i: number) => ({
    //                   label: labels[i],
    //                   data: [d.converted * 100], // to percentage
    //                   backgroundColor: colors[i]
    //                 }))
    //               }

    //               console.log(chartData)
    //               return chartData
             
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     } else {
    //       window.location.href = "/login";
    //     }
    //   }, []);


    useEffect(() => {
        const fetchData = async () => {
          const data = await fetchTestData()
        //   console.log(data)
          setChartData(data)
        }
        fetchData()
      }, [])


  return (
    <div className='p-5 bg-main min-w-screen min-h-screen'>
    <div className='grid grid-cols-2 gap-2'>
        {
          chartData  ? (
          <div>
            <Bar options={options} data={chartData} />
          </div>) : (<>No Data Found</>)
        }
      </div>
    </div>
  )
}

export default Chart
