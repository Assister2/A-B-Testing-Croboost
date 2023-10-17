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
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Conversion Rate %',
    },
  },
  layout: {
    padding: {
      top: 10,
      bottom: 10
    },
  },
};



export const options2 = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Avg. Event count',
    },
  },
  layout: {
    padding: {
      top: 10,
      bottom: 10,
    },
  },
};
export const options3 = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Bounce Rate %',
    },
  },
  layout: {
    padding: {
      top: 10,
      bottom: 10,
    },
  },
};



const Chart = (id: any) => {
  const [chartData, setChartData] = React.useState<any | undefined>(undefined)
  const [engagement, setEngagement] = React.useState<any | undefined>(undefined)
  const [bounce, setBounce] = React.useState<any | undefined>(undefined)
  const [notification, setNotification] = React.useState<any | undefined>(null);
  const [allData, setAllData] = React.useState<any | undefined>(null)


  const showNotification = (message: any) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Close the notification after 5 seconds
  };

  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    const tokens = loadTokens();
    if (tokens) {
      getChartData(tokens.id_token, "80242517-ac80-4b41-8318-b7197599ceba")
        .then((tests) => {
          const { test_name, epoch, data, test_id } = tests;
          const parsedData = JSON.parse(data);
          const filteredArray = parsedData.filter((item: any) => item.Variant !== "Overall");
          setAllData(filteredArray)
        })
        .catch((err) => {
          console.log(err);
          showNotification('Data not Found');

        });
    } else {
      window.location.href = "/login";
    }
  }, [])



  const conversion = () => {


    const finalData: any = []


    allData?.map((data: any) => {
      finalData?.push({
        converted: Number(data?.Average_Conversion_Rate)
      })
    })

    const labels = ["Green Button Homepage", "Purple Button Homepage"]
    const colors = ["#ff6347 ", "#006CA5"]
    const chartData = {
      labels: ['Variant'],
      datasets: finalData.map((d: any, i: number) => ({
        label: labels[i],
        data: [d.converted * 100], // to percentage
        backgroundColor: colors[i],
        barThickness: 55
      }))
    }

    setChartData(chartData)
    return chartData

  }

  const engagementData = async () => {


    const finalData: any = []


    allData?.map((data: any) => {
      finalData?.push({
        event_count: Number(data?.Average_Event_Count),
      })
    })

    const labels = ["Green Button Homepage", "Purple Button Homepage"]
    const colors = ["#ff6347 ", "#006CA5"]
    const chartData = {
      labels: ['Variant'],
      datasets: finalData.map((d: any, i: number) => ({
        label: labels[i],
        data: [d?.event_count * 100], // to percentage
        backgroundColor: colors[i],
        barThickness: 55
      }))
    }

    setEngagement(chartData)
    return chartData

  }

  const bounceData = async () => {


    const finalData: any = []


    allData?.map((data: any) => {
      finalData?.push({
        bounce_rate: Number(data?.Bounce_Rate),
      })
    })

    const labels = ["Green Button Homepage", "Purple Button Homepage"]
    const colors = ["#ff6347 ", "#006CA5"]
    const chartData = {
      labels: ['Variant'],
      datasets: finalData.map((d: any, i: number) => ({
        label: labels[i],
        data: [d?.bounce_rate * 100], // to percentage
        backgroundColor: colors[i],
        barThickness: 55
      }))
    }

    setBounce(chartData)
    return chartData
  }

  useEffect(() => {
    conversion()
    engagementData()
    bounceData()
  }, [allData])




  return (
    <div className='p-5 bg-main min-w-screen min-h-screen'>

      {notification && (
        <div
          id="toast-warning"
          className="absolute top-4 right-4 w-80 p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 flex items-center"
          role="alert"
        >
          <div className="w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
              />
            </svg>
          </div>
          <div className="ml-3 text-sm font-normal">{notification}</div>
          <button
            type="button"
            onClick={closeNotification}
            className="ml-auto -mx-1.5 -my-1.5 p-1.5 hover:bg-gray-100 rounded-full focus:ring-2 focus:ring-gray-300 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}
      <div className='grid'>
        {
          chartData ? (
            <div>
              <h1 className='text-2xl font-light'>Conversion Overall</h1>
              <Bar options={options} data={chartData} width={4} height={1} />
            </div>) : (<>No Data Found</>)
        }


      </div>
      <div className='grid'>
        {
          engagement ? (
            <div>
              <h1 className='text-2xl font-light'>Engagement Overall</h1>
              <Bar options={options2} data={engagement} width={4} height={1} />
            </div>) : (<>No Data Found</>)
        }
      </div>

      <div className='grid'>
        {
          bounce ? (
            <div>
              <h1 className='text-2xl font-light'>Bounce Overall</h1>
              <Bar options={options3} data={bounce} width={4} height={1} />
            </div>) : (<>No Data Found</>)
        }
      </div>
    </div>
  )
}

export default Chart
